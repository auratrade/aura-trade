import { LEVELS } from '@/data/mockData';

/**
 * حساب المستوى الحالي بناءً على عدد الإحالات
 * @param {number} referralCount - عدد الإحالات المكتملة
 * @returns {object} - بيانات المستوى الحالي
 */
export function getCurrentLevel(referralCount = 0) {
  // ابدأ من أعلى مستوى وابحث عن أول واحد تنطبق عليه الشروط
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (referralCount >= LEVELS[i].minReferrals) {
      return LEVELS[i];
    }
  }
  return LEVELS[0]; // starter
}

/**
 * المستوى التالي (أو null إذا كان بأعلى مستوى)
 */
export function getNextLevel(referralCount = 0) {
  const current = getCurrentLevel(referralCount);
  const nextIndex = LEVELS.findIndex(l => l.key === current.key) + 1;
  return LEVELS[nextIndex] || null;
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
  const progress = referralCount - current.minReferrals;
  return Math.min(100, (progress / range) * 100);
}

/**
 * هل المستخدم وصل لمستوى معين؟
 */
export function hasReachedLevel(referralCount = 0, levelKey = 'vip1') {
  const target = LEVELS.find(l => l.key === levelKey);
  if (!target) return false;
  return referralCount >= target.minReferrals;
}

/**
 * كل المستويات مع حالة الفتح/الإغلاق
 */
export function getLevelsWithStatus(referralCount = 0) {
  return LEVELS.map(level => ({
    ...level,
    unlocked: referralCount >= level.minReferrals,
    isCurrent: getCurrentLevel(referralCount).key === level.key,
  }));
}