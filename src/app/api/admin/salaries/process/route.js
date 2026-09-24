import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, logAdminAction } from '@/lib/admin-auth';
import { canWithdrawSalary, getTierFromReferrals } from '@/lib/referral-tiers';

// ⚠️ هذا API للتشغيل اليدوي (يمكن ربطه بـ Cron لاحقاً)
export async function POST(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    // جلب كل المستخدمين الذين لديهم راتب مستحق
    const users = await prisma.user.findMany({
      where: {
        totalReferrals: { gte: 5 },
      },
      select: {
        id: true,
        username: true,
        totalReferrals: true,
        lastSalaryPaidAt: true,
      },
    });

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let processed = 0;
    let totalPaid = 0;

    for (const user of users) {
      // تحقق من آخر راتب
      if (user.lastSalaryPaidAt && user.lastSalaryPaidAt > weekAgo) {
        continue; // لم تمر 7 أيام
      }

      const tier = getTierFromReferrals(user.totalReferrals);

      // لا راتب لهذا المستوى
      if (!tier.weeklySalary || tier.weeklySalary <= 0) continue;

      // تحقق من شرط السحب
      const canWithdraw = canWithdrawSalary(user.totalReferrals, tier);

      // إذا الراتب مقفل → لا تدفع
      if (tier.salaryLocked && !canWithdraw) continue;

      const amount = tier.weeklySalary;

      // أنشئ سجل الراتب
      await prisma.$transaction(async (tx) => {
        await tx.weeklySalary.create({
          data: {
            userId: user.id,
            tier: tier.key,
            amount,
            weekStart: weekAgo,
            weekEnd: now,
            status: 'paid',
            paidAt: now,
          },
        });

        await tx.user.update({
          where: { id: user.id },
          data: {
            availableBalance: { increment: amount },
            totalProfit: { increment: amount },
            totalSalaryEarned: { increment: amount },
            lastSalaryPaidAt: now,
          },
        });

        await tx.earning.create({
          data: {
            userId: user.id,
            type: 'referral',
            amount,
            description: `راتب أسبوعي — ${tier.name}`,
          },
        });
      });

      processed++;
      totalPaid += amount;
    }

    await logAdminAction({
      adminId: session.admin.id,
      action: 'process_salaries',
      details: { processed, totalPaid },
    });

    return NextResponse.json({
      success: true,
      processed,
      totalPaid,
    });
  } catch (error) {
    console.error('Process salaries error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}