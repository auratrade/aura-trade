import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

import {
  hashPassword,
  createToken,
  setAuthCookie,
} from '@/lib/auth';

import {
  registerSchema,
  formatZodErrors,
} from '@/lib/validations';

import {
  generateUniqueReferralCode,
  linkReferral,
} from '@/lib/referral';

export async function POST(request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse({
      fullName: body.fullName,
      email: body.email,
      username: body.username,
      password: body.password,
      confirmPassword:
        body.confirmPassword ||
        body.password,
      referralCode:
        body.referralCode || '',
    });

    if (!result.success) {
      const errors =
        formatZodErrors(result.error);

      return NextResponse.json(
        {
          error:
            'البيانات غير صالحة',
          fieldErrors: errors,
        },
        {
          status: 400,
        }
      );
    }

    const {
      email,
      username,
      password,
      fullName,
      referralCode,
    } = result.data;

    // ============================================================
    // التحقق من وجود المستخدم
    // ============================================================

    const existing =
      await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username },
          ],
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            existing.email === email
              ? 'البريد الإلكتروني مستخدم بالفعل'
              : 'اسم المستخدم مستخدم بالفعل',
        },
        {
          status: 409,
        }
      );
    }

    // ============================================================
    // توليد كود إحالة فريد
    // ============================================================

    const newReferralCode =
      await generateUniqueReferralCode();

    // ============================================================
    // تشفير كلمة المرور
    // ============================================================

    const hashedPassword =
      await hashPassword(password);

    // ============================================================
    // إنشاء المستخدم
    // ============================================================

    const user =
      await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          fullName: fullName || null,

          accountLevel: 0,

          referralCount: 0,

          referralCode:
            newReferralCode,

          availableBalance: 0,
          lockedBalance: 0,
          totalValue: 0,
          totalDeposited: 0,
          totalWithdrawn: 0,
          totalProfit: 0,
          totalLoss: 0,
          referralEarnings: 0,
        },

        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          accountLevel: true,
          referralCode: true,
          referralCount: true,
          availableBalance: true,
          totalValue: true,
          createdAt: true,
        },
      });

    // ============================================================
    // ربط الإحالة فقط
    //
    // ⚠️ لا يتم احتساب الإحالة هنا.
    // ============================================================

    let referralResult = null;

    if (referralCode) {
      try {
        referralResult =
          await linkReferral(
            user.id,
            referralCode
          );
      } catch (e) {
        console.error(
          'Referral linking error:',
          e
        );
      }
    }

    // ============================================================
    // إنشاء Token
    // ============================================================

    const token =
      await createToken({
        userId: user.id,
        email: user.email,
        username: user.username,
      });

    await setAuthCookie(token);

    // ============================================================
    // الاستجابة
    // ============================================================

    return NextResponse.json(
      {
        user,

        referral:
          referralResult
            ? {
                applied:
                  !!referralResult.applied,

                activated: false,

                referrer:
                  referralResult.referrer ||
                  null,
              }
            : null,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      '🔥 REGISTER ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'حدث خطأ أثناء إنشاء الحساب',
      },
      {
        status: 500,
      }
    );
  }
}