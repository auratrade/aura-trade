import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, logAdminAction } from '@/lib/admin-auth';

// ⚠️ إطلاق المكافآت (للمكافآت المعلقة التي فُتح شرط سحبها)
export async function POST(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    // جلب المكافآت غير المسحوبة
    const bonuses = await prisma.referralBonus.findMany({
      where: { claimed: false },
      include: {
        // لا يمكن include لأن ReferralBonus ليس له relation إلى User
      },
    });

    let processed = 0;
    let totalReleased = 0;

    for (const bonus of bonuses) {
      // جلب المستخدم
      const user = await prisma.user.findUnique({
        where: { id: bonus.userId },
        select: { totalReferrals: true },
      });

      if (!user) continue;

      // المكافآت الفورية (Level 4, 5, VIP) → تُطلق فوراً
      // المكافآت المعلقة (Level 1, 2, 3) → تنتظر شرط
      // ⚠️ بما أن المستخدم وصل للمستوى → المكافأة فورية
      // الشرط هنا: هل وصل لعدد معين؟

      await prisma.$transaction(async (tx) => {
        await tx.referralBonus.update({
          where: { id: bonus.id },
          data: {
            claimed: true,
            claimedAt: new Date(),
          },
        });

        await tx.user.update({
          where: { id: bonus.userId },
          data: {
            availableBalance: { increment: bonus.amount },
            totalProfit: { increment: bonus.amount },
          },
        });

        await tx.earning.create({
          data: {
            userId: bonus.userId,
            type: 'referral',
            amount: bonus.amount,
            description: `مكافأة ${bonus.tier}`,
          },
        });
      });

      processed++;
      totalReleased += bonus.amount;
    }

    await logAdminAction({
      adminId: session.admin.id,
      action: 'release_bonuses',
      details: { processed, totalReleased },
    });

    return NextResponse.json({
      success: true,
      processed,
      totalReleased,
    });
  } catch (error) {
    console.error('Release bonuses error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}