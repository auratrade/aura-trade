import { prisma } from './prisma';

import {
  getTierFromReferrals,
  canWithdrawSalary,
} from './referral-tiers';

// ============================================================
// توليد كود إحالة فريد
// ============================================================

export async function generateUniqueReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let attempts = 0;

  while (attempts < 10) {
    let random = '';

    for (let i = 0; i < 6; i++) {
      random += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
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
// ربط الإحالة عند التسجيل
//
// مهم:
// هذه الدالة لا تحتسب الإحالة.
// لا تزيد referralCount.
// لا تزيد totalReferrals.
// لا تعطي مكافأة.
// لا ترقي المستوى.
//
// فقط تحفظ علاقة المستخدم بالمُحيل.
// ============================================================

export async function linkReferral(newUserId, referrerCode) {
  if (!referrerCode) {
    return {
      applied: false,
    };
  }

  // 1️⃣ البحث عن المُحيل
  const referrer = await prisma.user.findUnique({
    where: {
      referralCode: referrerCode,
    },
    select: {
      id: true,
      username: true,
      referralCode: true,
    },
  });

  if (!referrer) {
    return {
      applied: false,
      error: 'invalid_code',
    };
  }

  // 2️⃣ منع الإحالة الذاتية
  if (referrer.id === newUserId) {
    return {
      applied: false,
      error: 'self_referral',
    };
  }

  // 3️⃣ التأكد أن المستخدم لم يتم ربطه بمُحيل آخر
  const newUser = await prisma.user.findUnique({
    where: {
      id: newUserId,
    },
    select: {
      referredBy: true,
    },
  });

  if (!newUser) {
    return {
      applied: false,
      error: 'user_not_found',
    };
  }

  // إذا كان مرتبطاً مسبقاً، لا نغيّر المُحيل
  if (newUser.referredBy) {
    return {
      applied: false,
      error: 'already_referred',
    };
  }

  // 4️⃣ ربط المستخدم بالمُحيل
  await prisma.user.update({
    where: {
      id: newUserId,
    },
    data: {
      referredBy: referrer.id,
    },
  });

  // 5️⃣ إنشاء علاقة Level 1
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
      activatedAt: null,
    },
  });

  // 6️⃣ بناء سلسلة الإحالات للمستويات الأعلى
  await buildReferralChain(
    referrer.id,
    newUserId
  );

  return {
    applied: true,
    referrer: referrer.referralCode,
    activated: false,
  };
}

// ============================================================
// تفعيل الإحالة بعد أول إيداع مقبول
//
// هذه هي الدالة التي تقوم بالاحتساب الحقيقي.
//
// يتم استدعاؤها فقط بعد أن يصبح الإيداع completed.
// ============================================================

export async function activateReferral(
  newUserId,
  tx = prisma
) {
  // 1️⃣ العثور على العلاقة المباشرة
  const relation = await tx.referralRelation.findFirst({
    where: {
      referredId: newUserId,
      level: 1,
      activatedAt: null,
    },
    select: {
      id: true,
      referrerId: true,
      referredId: true,
      level: true,
    },
  });

  // لا توجد إحالة أو تم تفعيلها سابقاً
  if (!relation) {
    return {
      activated: false,
      reason: 'no_pending_referral',
    };
  }

  // 2️⃣ نحاول حجز الإحالة بشكل ذري
  //
  // إذا كان هناك طلبان بنفس الوقت، واحد فقط
  // يستطيع تغيير activatedAt من null إلى تاريخ.
  //
  // هذا يمنع احتساب نفس الإحالة مرتين.
  const claim = await tx.referralRelation.updateMany({
    where: {
      id: relation.id,
      activatedAt: null,
    },
    data: {
      activatedAt: new Date(),
    },
  });

  if (claim.count !== 1) {
    return {
      activated: false,
      reason: 'already_activated',
    };
  }

  // 3️⃣ جلب بيانات المُحيل بعد حجز الإحالة
  const referrer = await tx.user.findUnique({
    where: {
      id: relation.referrerId,
    },
    select: {
      id: true,
      username: true,
      referralCode: true,
      referralCount: true,
      referralTier: true,
      totalReferrals: true,
      availableBalance: true,
      withdrawableBalance: true,
    },
  });

  if (!referrer) {
    throw new Error('REFERRER_NOT_FOUND');
  }

  // 4️⃣ حساب العدد الجديد
  const newCount = (referrer.totalReferrals || 0) + 1;

  // 5️⃣ حساب المستوى القديم والجديد
  const oldTier = getTierFromReferrals(
    referrer.totalReferrals || 0
  );

  const newTier = getTierFromReferrals(
    newCount
  );

  const tierChanged =
    oldTier.key !== newTier.key;

  // 6️⃣ تحديث إحصائيات المُحيل
  await tx.user.update({
    where: {
      id: referrer.id,
    },
    data: {
      totalReferrals: newCount,
      referralCount: newCount,
      referralTier: newTier.key,
    },
  });

  // ============================================================
  // 7️⃣ مكافأة الترقية
  // ============================================================

  let bonusAdded = 0;

  if (
    tierChanged &&
    newTier.bonus > 0
  ) {
    // إنشاء سجل المكافأة
    await tx.referralBonus.upsert({
      where: {
        userId_tier: {
          userId: referrer.id,
          tier: newTier.key,
        },
      },
      update: {},
      create: {
        userId: referrer.id,
        tier: newTier.key,
        amount: newTier.bonus,
        milestone: newCount,
        claimed: true,
        claimedAt: new Date(),
      },
    });

    // إضافة المكافأة إلى الرصيد
    await tx.user.update({
      where: {
        id: referrer.id,
      },
      data: {
        availableBalance: {
          increment: newTier.bonus,
        },

        withdrawableBalance: {
          increment: newTier.bonus,
        },

        totalProfit: {
          increment: newTier.bonus,
        },

        totalBonusEarned: {
          increment: newTier.bonus,
        },

        totalValue: {
          increment: newTier.bonus,
        },
      },
    });

    // تسجيل الربح
    await tx.earning.create({
      data: {
        userId: referrer.id,
        type: 'referral',
        amount: newTier.bonus,
        description: `مكافأة ترقية — ${newTier.name}`,
      },
    });

    bonusAdded = newTier.bonus;

    // إشعار الترقية
    await createNotification(
      {
        userId: referrer.id,
        type: 'tier_upgrade',
        title: `🎉 ترقية إلى ${newTier.name}!`,
        message: `مبروك! لقد وصلت إلى ${newTier.name} بعد ${newCount} إحالة. تم إضافة مكافأة $${newTier.bonus.toLocaleString()} إلى رصيدك مباشرة.`,
        icon: 'crown',
        priority: 'high',
        actionUrl: '/referrals',
      },
      tx
    );
  }

  // ============================================================
  // 8️⃣ فتح شرط الراتب
  // ============================================================

  if (
    newTier.salaryLocked &&
    canWithdrawSalary(
      newCount,
      newTier
    )
  ) {
    const existing = await tx.user.findUnique({
      where: {
        id: referrer.id,
      },
      select: {
        weeklySalaryUnlockedAt: true,
      },
    });

    if (
      !existing.weeklySalaryUnlockedAt
    ) {
      await tx.user.update({
        where: {
          id: referrer.id,
        },
        data: {
          weeklySalaryUnlockedAt:
            new Date(),
        },
      });

      await createNotification(
        {
          userId: referrer.id,
          type: 'salary_unlock',
          title:
            '💰 تم تفعيل راتبك الأسبوعي!',
          message: `مبروك! يمكنك الآن سحب راتبك الأسبوعي بقيمة $${newTier.weeklySalary} USDT. الراتب يُصرف كل 7 أيام.`,
          icon: 'wallet',
          priority: 'high',
          actionUrl: '/referrals',
        },
        tx
      );
    }
  }

  // ============================================================
  // 9️⃣ إشعار الراتب عند الترقية
  // ============================================================

  if (
    tierChanged &&
    newTier.weeklySalary > 0
  ) {
    if (newTier.salaryLocked) {
      const unlockAt =
        newTier.minReferrals +
        newTier.salaryUnlockExtra;

      const remaining = Math.max(
        0,
        unlockAt - newCount
      );

      if (remaining > 0) {
        await createNotification(
          {
            userId: referrer.id,
            type: 'salary_info',
            title:
              '📢 معلومة عن راتبك الأسبوعي',
            message: `راتبك الأسبوعي هو $${newTier.weeklySalary} USDT. لتفعيل السحب، يجب أن تصل إلى ${unlockAt} إحالة (باقي ${remaining} إحالة).`,
            icon: 'info',
            priority: 'normal',
            actionUrl: '/referrals',
          },
          tx
        );
      }
    } else {
      await createNotification(
        {
          userId: referrer.id,
          type: 'salary_info',
          title:
            '💰 راتبك الأسبوعي جاهز!',
          message: `راتبك الأسبوعي $${newTier.weeklySalary} USDT قابل للسحب الآن. الراتب يُصرف كل 7 أيام.`,
          icon: 'wallet',
          priority: 'high',
          actionUrl: '/referrals',
        },
        tx
      );
    }
  }

  return {
    activated: true,
    referrer: referrer.referralCode,
    newCount,
    newTier: newTier.key,
    tierChanged,
    bonusAdded,
  };
}

// ============================================================
// إنشاء إشعار
// ============================================================

async function createNotification(
  {
    userId,
    type,
    title,
    message,
    icon = 'bell',
    priority = 'normal',
    actionUrl,
  },
  tx = prisma
) {
  try {
    await tx.userNotification.create({
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
    console.error(
      'Notification create error:',
      e
    );
  }
}

// ============================================================
// بناء سلسلة الإحالة للمستويات 2-4
// ============================================================

async function buildReferralChain(
  referrerId,
  newUserId
) {
  let currentId = referrerId;
  const chain = [];

  for (let i = 0; i < 4; i++) {
    const user = await prisma.user.findUnique({
      where: {
        id: currentId,
      },
      select: {
        referredBy: true,
      },
    });

    if (!user?.referredBy) {
      break;
    }

    chain.push(user.referredBy);
    currentId = user.referredBy;
  }

  for (
    let i = 0;
    i < chain.length;
    i++
  ) {
    const level = i + 2;

    if (level > 4) {
      break;
    }

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
        activatedAt: null,
      },
    });
  }
}

// ============================================================
// إنشاء مكافأة المستوى
// ============================================================

async function createTierBonus(
  userId,
  tier,
  amount,
  milestone
) {
  try {
    await prisma.referralBonus.upsert({
      where: {
        userId_tier: {
          userId,
          tier,
        },
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

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        totalBonusEarned: {
          increment: amount,
        },
      },
    });
  } catch (e) {
    console.error(
      'Create bonus error:',
      e
    );
  }
}

// ============================================================
// إحصائيات الإحالة
// ============================================================

export async function getReferralStats(
  userId
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
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

  if (!user) {
    return null;
  }

  // عدد الإحالات التي تم تفعيلها فعلياً
  const totalReferred =
    await prisma.referralRelation.count({
      where: {
        referrerId: userId,
        level: 1,
        activatedAt: {
          not: null,
        },
      },
    });

  // عدد الإحالات المعلقة
  const pendingReferrals =
    await prisma.referralRelation.count({
      where: {
        referrerId: userId,
        level: 1,
        activatedAt: null,
      },
    });

  // المكافآت
  const bonuses =
    await prisma.referralBonus.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

  // الرواتب
  const salaries =
    await prisma.weeklySalary.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

  return {
    referralCode: user.referralCode,

    totalReferrals:
      user.totalReferrals || 0,

    referralCount:
      user.referralCount || 0,

    referralTier:
      user.referralTier,

    referralEarnings:
      user.referralEarnings || 0,

    totalBonusEarned:
      user.totalBonusEarned || 0,

    totalSalaryEarned:
      user.totalSalaryEarned || 0,

    totalReferred,

    pendingReferrals,

    weeklySalaryUnlockedAt:
      user.weeklySalaryUnlockedAt,

    lastSalaryPaidAt:
      user.lastSalaryPaidAt,

    bonuses,

    recentSalaries: salaries,
  };
}

// ============================================================
// قائمة المُحالين المباشرين
// ============================================================

export async function getReferredUsers(
  userId,
  limit = 100
) {
  return prisma.user.findMany({
    where: {
      referredBy: userId,
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      email: true,
      referralTier: true,
      totalDeposited: true,
      createdAt: true,
      referredBy: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}