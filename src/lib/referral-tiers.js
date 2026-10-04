// ============ نظام مستويات الإحالة ============

export const REFERRAL_TIERS = [
  {
    key: 'STARTER',
    number: 0,
    name: 'مبتدئ',
    nameEn: 'Starter',
    minReferrals: 0,
    bonus: 0,
    weeklySalary: 0,
    salaryUnlockExtra: 0,   // عدد إضافي لفتح السحب
    salaryLocked: false,
    color: '#7d8aab',
    icon: 'user',
  },
  {
    key: 'LEVEL1',
    number: 1,
    name: 'المستوى الأول',
    nameEn: 'Level 1',
    minReferrals: 5,
    bonus: 50,
    weeklySalary: 10,
    salaryUnlockExtra: 7,   // +7 لفتح السحب
    salaryLocked: true,
    unlockCondition: 'يجب إضافة 7 أشخاص إضافيين (المجموع 12) لسحب الراتب',
    color: '#cd7f32',
    icon: 'crown',
  },
  {
    key: 'LEVEL2',
    number: 2,
    name: 'المستوى الثاني',
    nameEn: 'Level 2',
    minReferrals: 20,
    bonus: 100,
    weeklySalary: 50,
    salaryUnlockExtra: 30,   // المجموع 30
    salaryLocked: true,
    unlockCondition: 'يجب إضافة 10 إضافيين (المجموع 30) لسحب الراتب',
    color: '#c0c0c0',
    icon: 'crown',
  },
  {
    key: 'LEVEL3',
    number: 3,
    name: 'المستوى الثالث',
    nameEn: 'Level 3',
    minReferrals: 70,
    bonus: 200,
    weeklySalary: 100,
    salaryUnlockExtra: 0,
    salaryLocked: false,
    color: '#a78bfa',
    icon: 'crown',
  },
  {
    key: 'LEVEL4',
    number: 4,
    name: 'المستوى الرابع',
    nameEn: 'Level 4',
    minReferrals: 150,
    bonus: 500,
    weeklySalary: 200,
    salaryUnlockExtra: 0,
    salaryLocked: false,  // ✅ فوري
    color: '#22d3ee',
    icon: 'crown',
  },
  {
    key: 'LEVEL5',
    number: 5,
    name: 'المستوى الخامس',
    nameEn: 'Level 5',
    minReferrals: 600,
    bonus: 4000,
    weeklySalary: 1500,
    salaryUnlockExtra: 0,
    salaryLocked: false,
    color: '#16c784',
    icon: 'crown',
  },
  {
    key: 'VIP',
    number: 6,
    name: 'VIP',
    nameEn: 'VIP',
    minReferrals: 1000,
    bonus: 10000,
    weeklySalary: 4000,
    salaryUnlockExtra: 0,
    salaryLocked: false,
    color: '#f5b041',
    icon: 'crown',
  },
];

// ============ الحصول على المستوى من عدد الإحالات ============
export function getTierFromReferrals(count = 0) {
  let current = REFERRAL_TIERS[0];
  for (const tier of REFERRAL_TIERS) {
    if (count >= tier.minReferrals) current = tier;
  }
  return current;
}

// ============ المستوى التالي ============
export function getNextTier(count = 0) {
  const current = getTierFromReferrals(count);
  const idx = REFERRAL_TIERS.findIndex((t) => t.key === current.key);
  return REFERRAL_TIERS[idx + 1] || null;
}

// ============ عدد الإحالات المتبقية ============
export function getReferralsToNext(count = 0) {
  const next = getNextTier(count);
  return next ? Math.max(0, next.minReferrals - count) : 0;
}

// ============ هل يمكن سحب الراتب؟ ============
export function canWithdrawSalary(count = 0, tier = null) {
  const t = tier || getTierFromReferrals(count);
  if (!t.salaryLocked) return true;
  const unlockAt = t.minReferrals + t.salaryUnlockExtra;
  return count >= unlockAt;
}

// ============ عدد الإحالات المتبقية لفتح السحب ============
export function referralsToUnlockSalary(count = 0) {
  const t = getTierFromReferrals(count);
  if (!t.salaryLocked) return 0;
  const unlockAt = t.minReferrals + t.salaryUnlockExtra;
  return Math.max(0, unlockAt - count);
}

// ============ كل المستويات مع الحالة ============
export function getTiersWithStatus(count = 0) {
  const current = getTierFromReferrals(count);
  return REFERRAL_TIERS.map((t) => ({
    ...t,
    unlocked: count >= t.minReferrals,
    isCurrent: current.key === t.key,
    canWithdrawSalary: canWithdrawSalary(count, t),
  }));
}