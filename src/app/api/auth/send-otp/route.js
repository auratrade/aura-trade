import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/resend';
import { checkRateLimit, recordAttempt, getClientIP } from '@/lib/rate-limit';
import { sendOtpSchema } from '@/lib/validations';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = sendOtpSchema.safeParse({
      email: body.email,
      name: body.name,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    const { email, name } = result.data;
    const ip = getClientIP(request);

    // ✅ Rate Limiting: 3 طلبات / 15 دقيقة
    const rl = await checkRateLimit({
      identifier: email,
      type: 'register',
      maxAttempts: 3,
      windowMs: 15 * 60 * 1000,
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { error: `طلبات كثيرة. حاول بعد ${rl.retryAfter} دقيقة` },
        { status: 429 }
      );
    }

    // تحقق من وجود المستخدم
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مسجّل بالفعل' },
        { status: 409 }
      );
    }

    // احذف الأكواد القديمة
    await prisma.otpCode.deleteMany({
      where: { email, type: 'register' },
    });

    // أنشئ كود جديد
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: { email, code, type: 'register', expiresAt },
    });

    // ✅ أرسل البريد وتوقف فوراً إذا حدث خطأ بدلاً من إظهار رسالة النجاح
    try {
      await sendOtpEmail({ to: email, code, name: name || 'عزيزي' });
      await recordAttempt({ identifier: email, type: 'register', success: true, ipAddress: ip });
    } catch (e) {
      console.error('❌ Send OTP Failed:', e);
      await recordAttempt({ identifier: email, type: 'register', success: false, ipAddress: ip });

      return NextResponse.json(
        { error: 'فشل إرسال رمز التحقق إلى بريدك الإلكتروني. يرجى المحاولة لاحقاً.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك',
    });

  } catch (error) {
    console.error('🔥 SEND OTP ROUTE ERROR:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع في الخادم' },
      { status: 500 }
    );
  }
}