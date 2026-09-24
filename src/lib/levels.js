// ============ نظام المستويات ============
// 0 إحالة → مستوى 0 (مبتدئ)
// 5 إحالات → مستوى 1
// 10 إحالات → مستوى 2
// 30 إحالة → مستوى 3

export const LEVELS = [
  {
    key: 'starter',
    name: 'مبتدئ',
    levelNumber: 0,
    minReferrals: 0,
    commission: 5,
    color: '#7d8aab',
  },
  {
    key: 'vip1',
    name: 'مستوى 1',
    levelNumber: 1,
    minReferrals: 5,
    commission: 10,
    color: '#cd7f32',
  },
  {
    key: 'vip2',
    name: 'مستوى 2',
    levelNumber: 2,
    minReferrals: 10,
    commission: 15,
    color: '#c0c0c0',
  },
  {
    key: 'vip3',
    name: 'مستوى 3',
    levelNumber: 3,
    minReferrals: 30,
    commission: 20,
    color: '#f5b041',
  },
];

/**
 * حساب المستوى الحالي بناءً على عدد الإحالات
 */
export function getCurrentLevel(referralCount = 0) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (referralCount >= level.minReferrals) {
      current = level;
    }
  }
  return current;
}

/**
 * المستوى التالي (أو null إذا كان بأعلى مستوى)
 */
export function getNextLevel(referralCount = 0) {
  const current = getCurrentLevel(referralCount);
  const currentIndex = LEVELS.findIndex((l) => l.key === current.key);
  return LEVELS[currentIndex + 1] || null;
}

/**
 * عدد الإحالات المتبقية للمستوى التالي
 */
export function getReferralsToNext(referralCount = 0) {
  const next = getNextLevel(referralCount);
  if (!next) return 0;
  return Math.max(0, next.minReferrals - referralCount);
}

/**
 * نسبة التقدم نحو المستوى التالي (0-100)
 */
export function getLevelProgress(referralCount = 0) {
  const current = getCurrentLevel(referralCount);
  const next = getNextLevel(referralCount);
  if (!next) return 100;

  const range = next.minReferrals - current.minReferrals;
  if (range <= 0) return 100;

  const progress = referralCount - current.minReferrals;
  return Math.min(100, Math.max(0, (progress / range) * 100));
}

/**
 * كل المستويات مع حالة الفتح/الإغلاق
 */
export function getLevelsWithStatus(referralCount = 0) {
  const current = getCurrentLevel(referralCount);
  return LEVELS.map((level) => ({
    ...level,
    unlocked: referralCount >= level.minReferrals,
    isCurrent: current.key === level.key,
  }));
}

/**
 * حساب المستوى من عدد الإحالات (يُستخدم في API)
 */
export function calculateLevelFromReferrals(count) {
  if (count >= 30) return 3;
  if (count >= 10) return 2;
  if (count >= 5) return 1;
  return 0;
}