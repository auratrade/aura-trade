import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOtpSchema } from '@/lib/validations';

export async function POST(request) {
  try {
    const body = await request.json();

    // ✅ Zod validation
    const result = verifyOtpSchema.safeParse({
      email: body.email,
      code: body.code,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'البريد أو الرمز غير صالح' },
        { status: 400 }
      );
    }

    const { email, code } = result.data;

    // ابحث عن الرمز
    const otp = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        used: false,
      },
    });

    if (!otp) {
      return NextResponse.json(
        { error: 'الرمز غير صحيح' },
        { status: 400 }
      );
    }

    if (new Date() > otp.expiresAt) {
      return NextResponse.json(
        { error: 'انتهت صلاحية الرمز. اطلب رمزاً جديداً' },
        { status: 400 }
      );
    }

    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('🔥 VERIFY OTP ERROR:', error);
    return NextResponse.json(
      { error: 'فشل التحقق من الرمز' },
      { status: 500 }
    );
  }
}