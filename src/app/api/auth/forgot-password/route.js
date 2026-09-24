import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/resend';
import { checkRateLimit, recordAttempt } from '@/lib/rate-limit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('البريد غير صالح').transform((v) => v.toLowerCase()),
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

    const { email } = result.data;

    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // ✅ Rate Limiting
    const rl = await checkRateLimit({
      identifier: email,
      type: 'reset',
      maxAttempts: 3,
      windowMs: 15 * 60 * 1000, // 15 دقيقة
    });

    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: `طلبات كثيرة. حاول بعد ${rl.retryAfter} دقيقة`,
        },
        { status: 429 }
      );
    }

    // ⚠️ لا نكشف إن كان البريد مسجّلاً أم لا (أمان)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, username: true, fullName: true },
    });

    if (!user) {
      // أعد النجاح الوهمي (لتجنب enumeration)
      await recordAttempt({ identifier: email, type: 'reset', success: false, ipAddress: ip });
      return NextResponse.json({
        success: true,
        message: 'إذا كان البريد مسجّلاً، ستصلك رسالة خلال لحظات',
      });
    }

    // احذف الأكواد القديمة
    await prisma.otpCode.deleteMany({
      where: { email, type: 'reset' },
    });

    // أنشئ كود جديد
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

    await prisma.otpCode.create({
      data: {
        email,
        code,
        type: 'reset',
        expiresAt,
      },
    });

    // أرسل البريد
    try {
      await sendOtpEmail({
        to: email,
        code,
        name: user.fullName || user.username || 'عزيزي',
        subject: 'إعادة تعيين كلمة المرور',
      });
    } catch (e) {
      console.error('Send reset email error:', e);
    }

    await recordAttempt({ identifier: email, type: 'reset', success: true, ipAddress: ip });

    return NextResponse.json({
      success: true,
      message: 'إذا كان البريد مسجّلاً، ستصلك رسالة خلال لحظات',
    });
  } catch (error) {
    console.error('🔥 Forgot password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ. حاول مرة أخرى' },
      { status: 500 }
    );
  }
}