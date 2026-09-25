import { prisma } from './prisma';
import {
  getTierFromReferrals,
  canWithdrawSalary,
  REFERRAL_TIERS,
} from './referral-tiers';

// ============ توليد كود إحالة فريد ============
export async function generateUniqueReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let attempts = 0;

  while (attempts < 10) {
    let random = '';
    for (let i = 0; i < 6; i++) {
      random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `AURA-${random}`;

    const found = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });

    if (!found) return code;
    attempts++;
  }

  return `AURA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

// ============================================================
//                 معالجة إحالة جديدة (Full Flow)
// ============================================================
// ============================================================
//                 معالجة إحالة جديدة
// ============================================================
export async function processReferral(newUserId, referrerCode) {
  if (!referrerCode) return { applied: false };

  // 1️⃣ ابحث عن المُحيل
  const referrer = await prisma.user.findUnique({
    where: { referralCode: referrerCode },
    select: {
      id: true,
      username: true,
      referralCount: true,
      referralTier: true,
      totalReferrals: true,
      availableBalance: true,
    },
  });

  if (!referrer) return { applied: false, error: 'invalid_code' };
  if (referrer.id === newUserId) {
    return { applied: false, error: 'self_referral' };
  }

  // 2️⃣ اربط المُحال
  await prisma.user.update({
    where: { id: newUserId },
    data: { referredBy: referrer.id },
  });

  // 3️⃣ سجل العلاقة (Level 1)
  await prisma.referralRelation.upsert({
    where: {
      referrerId_referredId: {
        referrerId: referrer.id,
        referredId: newUserId,
      },
    },
    update: {},
    create: {
      referrerId: referrer.id,
      referredId: newUserId,
      level: 1,
    },
  });

  // 4️⃣ سجل العلاقات للمستويات 2-4
  await buildReferralChain(referrer.id, newUserId);

  // 5️⃣ احسب الإحالات الجديدة
  const newCount = referrer.totalReferrals + 1;

  // 6️⃣ احسب المستوى
  const oldTier = getTierFromReferrals(referrer.totalReferrals);
  const newTier = getTierFromReferrals(newCount);
  const tierChanged = oldTier.key !== newTier.key;

  // 7️⃣ حدّث المُحيل
  await prisma.user.update({
    where: { id: referrer.id },
    data: {
      totalReferrals: newCount,
      referralCount: newCount,
      referralTier: newTier.key,
    },
  });

  // ============================================================
  //   8️⃣ ترقية المستوى → مكافأة + إشعار
  // ============================================================
  let bonusAdded = 0;

  if (tierChanged && newTier.bonus > 0) {
    // ✅ 8a) أنشئ سجل المكافأة
    try {
      await prisma.referralBonus.upsert({
        where: {
          userId_tier: { userId: referrer.id, tier: newTier.key },
        },
        update: {},
        create: {
          userId: referrer.id,
          tier: newTier.key,
          amount: newTier.bonus,
          milestone: newCount,
          claimed: true,              // ✅ فوري
          claimedAt: new Date(),
        },
      });
    } catch (e) {
      console.error('Bonus create error:', e);
    }

    // ✅ 8b) أضف المكافأة إلى الرصيد مباشرة + سجل في earnings
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
  where: { id: referrer.id },
  data: {
    availableBalance: { increment: newTier.bonus },
    withdrawableBalance: { increment: newTier.bonus },   // ✅ جديد
    totalProfit: { increment: newTier.bonus },
    totalBonusEarned: { increment: newTier.bonus },
    totalValue: { increment: newTier.bonus },
  },
});

      await tx.earning.create({
        data: {
          userId: referrer.id,
          type: 'referral',
          amount: newTier.bonus,
          description: `مكافأة ترقية — ${newTier.name}`,
        },
      });
    });

    bonusAdded = newTier.bonus;

    // ✅ 8c) إشعار الترقية للمستخدم
    await createNotification({
      userId: referrer.id,
      type: 'tier_upgrade',
      title: `🎉 ترقية إلى ${newTier.name}!`,
      message: `مبروك! لقد وصلت إلى ${newTier.name} بعد ${newCount} إحالة. تم إضافة مكافأة $${newTier.bonus.toLocaleString()} إلى رصيدك مباشرة.`,
      icon: 'crown',
      priority: 'high',
      actionUrl: '/referrals',
    });
  }

  // ============================================================
  //   9️⃣ فتح شرط الراتب → إشعار
  // ============================================================
  if (
    newTier.salaryLocked &&
    canWithdrawSalary(newCount, newTier)
  ) {
    const existing = await prisma.user.findUnique({
      where: { id: referrer.id },
      select: { weeklySalaryUnlockedAt: true },
    });

    if (!existing.weeklySalaryUnlockedAt) {
      await prisma.user.update({
        where: { id: referrer.id },
        data: { weeklySalaryUnlockedAt: new Date() },
      });

      // ✅ إشعار فتح الراتب
      await createNotification({
        userId: referrer.id,
        type: 'salary_unlock',
        title: `💰 تم تفعيل راتبك الأسبوعي!`,
        message: `مبروك! يمكنك الآن سحب راتبك الأسبوعي بقيمة $${newTier.weeklySalary} USDT. الراتب يُصرف كل 7 أيام.`,
        icon: 'wallet',
        priority: 'high',
        actionUrl: '/referrals',
      });
    }
  }

  // ============================================================
  //   10) إشعار شرط الراتب عند الترقية (معلوماتي)
  // ============================================================
  if (tierChanged && newTier.weeklySalary > 0) {
    if (newTier.salaryLocked) {
      const unlockAt = newTier.minReferrals + newTier.salaryUnlockExtra;
      const remaining = Math.max(0, unlockAt - newCount);

      if (remaining > 0) {
        // إشعار: كيف تحصل على الراتب
        await createNotification({
          userId: referrer.id,
          type: 'salary_info',
          title: `📢 معلومة عن راتبك الأسبوعي`,
          message: `راتبك الأسبوعي هو $${newTier.weeklySalary} USDT. لتفعيل السحب، يجب أن تصل إلى ${unlockAt} إحالة (باقي ${remaining} إحالة).`,
          icon: 'info',
          priority: 'normal',
          actionUrl: '/referrals',
        });
      }
    } else {
      // راتب فوري
      await createNotification({
        userId: referrer.id,
        type: 'salary_info',
        title: `💰 راتبك الأسبوعي جاهز!`,
        message: `راتبك الأسبوعي $${newTier.weeklySalary} USDT قابل للسحب الآن. الراتب يُصرف كل 7 أيام.`,
        icon: 'wallet',
        priority: 'high',
        actionUrl: '/referrals',
      });
    }
  }

  return {
    applied: true,
    referrer: referrer.referralCode,
    newCount,
    newTier: newTier.key,
    tierChanged,
    bonusAdded,
  };
}

// ============================================================
//             إنشاء إشعار للمستخدم (Helper)
// ============================================================
async function createNotification({
  userId,
  type,
  title,
  message,
  icon = 'bell',
  priority = 'normal',
  actionUrl,
}) {
  try {
    await prisma.userNotification.create({
      data: {
        userId,
        type,
        title,
        message,
        icon,
        priority,
        actionUrl,
      },
    });
  } catch (e) {
    console.error('Notification create error:', e);
  }
}

// ============================================================
//             بناء سلسلة الإحالة (موجود)
// ============================================================
async function buildReferralChain(referrerId, newUserId) {
  let currentId = referrerId;
  const chain = [];

  for (let i = 0; i < 4; i++) {
    const user = await prisma.user.findUnique({
      where: { id: currentId },
      select: { referredBy: true },
    });
    if (!user?.referredBy) break;
    chain.push(user.referredBy);
    currentId = user.referredBy;
  }

  for (let i = 0; i < chain.length; i++) {
    const level = i + 2;
    if (level > 4) break;

    await prisma.referralRelation.upsert({
      where: {
        referrerId_referredId: {
          referrerId: chain[i],
          referredId: newUserId,
        },
      },
      update: {},
      create: {
        referrerId: chain[i],
        referredId: newUserId,
        level,
      },
    });
  }
}



// ============ إنشاء مكافأة المستوى ============
async function createTierBonus(userId, tier, amount, milestone) {
  try {
    await prisma.referralBonus.upsert({
      where: {
        userId_tier: { userId, tier },
      },
      update: {},
      create: {
        userId,
        tier,
        amount,
        milestone,
        claimed: false,
      },
    });

    // أضف للأرباح المؤقتة (لا يمكن السحب فوراً)
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalBonusEarned: { increment: amount },
      },
    });
  } catch (e) {
    console.error('Create bonus error:', e);
  }
}

// ============ الحصول على المستخدم الحالي والمستوى ============
export async function getReferralStats(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      referralCode: true,
      totalReferrals: true,
      referralCount: true,
      referralTier: true,
      referralEarnings: true,
      totalBonusEarned: true,
      totalSalaryEarned: true,
      weeklySalaryUnlockedAt: true,
      lastSalaryPaidAt: true,
    },
  });

  if (!user) return null;

  // إحصائيات
  const totalReferred = await prisma.user.count({
    where: { referredBy: userId },
  });

  // المكافآت
  const bonuses = await prisma.referralBonus.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  // الرواتب
  const salaries = await prisma.weeklySalary.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return {
    referralCode: user.referralCode,
    totalReferrals: user.totalReferrals || 0,
    referralCount: user.referralCount || 0,
    referralTier: user.referralTier,
    referralEarnings: user.referralEarnings || 0,
    totalBonusEarned: user.totalBonusEarned || 0,
    totalSalaryEarned: user.totalSalaryEarned || 0,
    totalReferred,
    weeklySalaryUnlockedAt: user.weeklySalaryUnlockedAt,
    lastSalaryPaidAt: user.lastSalaryPaidAt,
    bonuses,
    recentSalaries: salaries,
  };
}

// ============ قائمة المُحالين المباشرين ============
export async function getReferredUsers(userId, limit = 100) {
  return prisma.user.findMany({
    where: { referredBy: userId },
    select: {
      id: true,
      username: true,
      fullName: true,
      email: true,
      referralTier: true,
      totalDeposited: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}