import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  code: z.string().length(6, 'الرمز يجب أن يكون 6 أرقام').regex(/^\d+$/, 'الرمز أرقام فقط'),
  newPassword: z
    .string()
    .min(8, 'كلمة المرور 8 أحرف على الأقل')
    .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم'),
});

const MAX_ATTEMPTS = 5;

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

    const { email, code, newPassword } = result.data;

    // ابحث عن الكود
    const otp = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        type: 'reset',
        used: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return NextResponse.json(
        { error: 'الرمز غير صحيح أو منتهي' },
        { status: 400 }
      );
    }

    // ⚠️ الحد الأقصى للمحاولات
    if (otp.attempts >= MAX_ATTEMPTS) {
      await prisma.otpCode.update({
        where: { id: otp.id },
        data: { used: true },
      });
      return NextResponse.json(
        { error: 'تجاوزت عدد المحاولات. اطلب رمزاً جديداً' },
        { status: 429 }
      );
    }

    // تحقق من الانتهاء
    if (new Date() > otp.expiresAt) {
      await prisma.otpCode.update({
        where: { id: otp.id },
        data: { used: true },
      });
      return NextResponse.json(
        { error: 'انتهت صلاحية الرمز. اطلب رمزاً جديداً' },
        { status: 400 }
      );
    }

    // ابحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'حدث خطأ' }, { status: 400 });
    }

    // شفّر كلمة المرور الجديدة
    const hashedPassword = await hashPassword(newPassword);

    // ✅ transaction: حدّث كلمة المرور + علّم الكود كمستخدم
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await tx.otpCode.update({
        where: { id: otp.id },
        data: { used: true },
      });

      // احذف كل الأكواد الأخرى
      await tx.otpCode.deleteMany({
        where: { email, type: 'reset' },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    });
  } catch (error) {
    console.error('🔥 Reset password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ. حاول مرة أخرى' },
      { status: 500 }
    );
  }
}