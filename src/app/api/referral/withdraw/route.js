import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { updateUserBalances } from '@/lib/balance';

export async function POST() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    // ============ جلب المستخدم ============
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { referralEarnings: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    if (!user.referralEarnings || user.referralEarnings <= 0) {
      return NextResponse.json(
        { error: 'لا توجد أرباح قابلة للنقل' },
        { status: 400 }
      );
    }

    const amount = user.referralEarnings;

    // ============ نقل الأرباح (transaction) ============
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.userId },
        data: {
          availableBalance: { increment: amount },
          referralEarnings: 0,
        },
      });

      await tx.earning.create({
        data: {
          userId: session.userId,
          type: 'referral',
          amount,
          description: 'نقل أرباح الإحالة إلى الرصيد المتاح',
        },
      });
    });

    // ============ تحديث الأرصدة ============
    try {
      await updateUserBalances(session.userId);
    } catch (e) {
      console.error('Update balances error:', e);
    }

    return NextResponse.json({
      success: true,
      transferred: amount,
    });
  } catch (error) {
    console.error('🔥 Transfer earnings error:', error);
    return NextResponse.json(
      { error: 'فشل نقل الأرباح' },
      { status: 500 }
    );
  }
}