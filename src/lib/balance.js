import { prisma } from './prisma';

/**
 * حساب الرصيد المتاح للمستخدم
 * ⚠️ availableBalance هو المصدر الوحيد للحقيقة.
 *    لا يُعاد حسابه من total*.
 */
export async function calculateAvailableBalance(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { availableBalance: true },
  });

  if (!user) return 0;
  return Math.max(0, user.availableBalance);
}

/**
 * حساب إجمالي القيمة = الرصيد المتاح + الرصيد المقفل
 */
export async function calculateTotalValue(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      availableBalance: true,
      lockedBalance: true,
    },
  });

  if (!user) return 0;
  return user.availableBalance + user.lockedBalance;
}

/**
 * تحديث totalValue فقط
 * ⚠️ availableBalance لا يُحسب من total* — هو المصدر الوحيد للحقيقة
 *    ويُدار حصراً عبر increment/decrement عند كل عملية مالية.
 */
export async function updateUserBalances(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      availableBalance: true,
      lockedBalance: true,
    },
  });

  if (!user) return null;

  const totalValue = user.availableBalance + user.lockedBalance;

  return prisma.user.update({
    where: { id: userId },
    data: {
      totalValue: Math.max(0, totalValue),
      // ❌ لا تُلمس availableBalance هنا إطلاقاً
    },
    select: {
      availableBalance: true,
      lockedBalance: true,
      totalValue: true,
      totalDeposited: true,
      totalWithdrawn: true,
      totalProfit: true,
      totalLoss: true,
    },
  });
}

/**
 * إضافة عملية مالية جديدة وتحديث الرصيد تلقائياً
 */
export async function addTransaction({
  userId,
  type,
  amount,
  network,
  txid,
  address,
  status = 'pending',
  reason,
  meta,
  updateBalances = true,
}) {
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type,
      amount,
      network,
      txid,
      address,
      status,
      reason,
      meta: meta ? JSON.stringify(meta) : null,
    },
  });

  if (updateBalances && status === 'completed') {
    await applyTransactionEffect(userId, type, amount);
  }

  return transaction;
}

/**
 * تطبيق تأثير العملية على أرصدة المستخدم
 * ✅ نستخدم increment/decrement مباشرة على availableBalance
 *    بدلاً من إعادة الحساب من total*.
 */
async function applyTransactionEffect(userId, type, amount) {
  const updates = {};

  switch (type) {
    case 'deposit':
      // ✅ إيداع مقبول: زد رأس المال + الرصيد المتاح
      updates.totalDeposited = { increment: amount };
      updates.availableBalance = { increment: amount };
      // ❌ withdrawableBalance لا يتغير (رأس المال غير قابل للسحب)
      break;

    case 'withdraw':
      // ✅ عند الموافقة: حرّر المقفل + سجّل السحب
      updates.lockedBalance = { decrement: amount };
      updates.totalWithdrawn = { increment: amount };
      // ❌ availableBalance و withdrawableBalance خُصما عند الطلب
      break;

    case 'mission':
    case 'referral':
    case 'vip':
      // ✅ الأرباح: تزيد totalProfit + availableBalance + withdrawableBalance
      updates.totalProfit = { increment: amount };
      updates.availableBalance = { increment: amount };
      updates.withdrawableBalance = { increment: amount };
      break;

    case 'trade':
      // أرباح التداول: تزيد totalProfit + availableBalance فقط
      // (لا تُضاف لـ withdrawableBalance لأنها تبقى رأس مال للتداول)
      updates.totalProfit = { increment: amount };
      updates.availableBalance = { increment: amount };
      break;

    case 'loss':
      // ✅ الخسارة: تنقص totalLoss + availableBalance + withdrawableBalance
      updates.totalLoss = { increment: amount };
      updates.availableBalance = { decrement: amount };
      updates.withdrawableBalance = { decrement: amount };
      break;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updates,
  });

  await updateUserBalances(userId);
}

/**
 * إضافة ربح + تحديث الرصيد
 */
export async function addEarning({ userId, type, amount, description }) {
  await prisma.earning.create({
    data: { userId, type, amount, description },
  });

  const updates = {
    totalProfit: { increment: amount },
    availableBalance: { increment: amount },
  };

  // ✅ الأرباح (مهمة/إحالة/VIP) قابلة للسحب
  if (type === 'mission' || type === 'referral' || type === 'vip' || type === 'salary' || type === 'bonus') {
    updates.withdrawableBalance = { increment: amount };
  }

  await prisma.user.update({
    where: { id: userId },
    data: updates,
  });

  return updateUserBalances(userId);
}

/**
 * الموافقة على عملية (من قبل المدير)
 */
export async function approveTransaction(transactionId) {
  const tx = await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'completed' },
  });

  await applyTransactionEffect(tx.userId, tx.type, tx.amount);
  return tx;
}

/**
 * رفض عملية
 */
export async function rejectTransaction(transactionId, reason) {
  return prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'rejected', reason },
  });
}