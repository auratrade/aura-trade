import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';
import {
  checkRateLimit,
  recordAttempt,
  clearAttempts,
  getClientIP,
} from '@/lib/rate-limit';
import { z } from 'zod';

const schema = z.object({
  emailOrUsername: z.string().min(1, 'البيانات مطلوبة').max(255),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { emailOrUsername, password } = result.data;
    const ip = getClientIP(request);
    const identifier = emailOrUsername.toLowerCase().trim();

    // ✅ Rate Limiting
    const rl = await checkRateLimit({
      identifier,
      type: 'login',
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 دقيقة
    });

    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: `تجاوزت عدد المحاولات. حاول بعد ${rl.retryAfter} دقيقة`,
        },
        { status: 429 }
      );
    }

    // ابحث عن المستخدم
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      await recordAttempt({
        identifier,
        type: 'login',
        success: false,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || '',
      });
      return NextResponse.json(
        { error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    // تحقق من كلمة المرور
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      await recordAttempt({
        identifier,
        type: 'login',
        success: false,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || '',
      });
      return NextResponse.json(
        { error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    // ✅ نجح → امسح المحاولات
    await clearAttempts({ identifier, type: 'login' });

    // أنشئ Token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        accountLevel: user.accountLevel,
        referralCode: user.referralCode,
        referralCount: user.referralCount,
      },
    });
  } catch (error) {
    console.error('🔥 Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}