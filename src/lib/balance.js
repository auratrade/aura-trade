import { prisma } from './prisma';

/**
 * حساب الرصيد المتاح للمستخدم
 * = الإيداعات المكتملة - السحوبات المكتملة + الأرباح - الخسائر
 */
export async function calculateAvailableBalance(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      availableBalance: true,
      totalDeposited: true,
      totalWithdrawn: true,
      totalProfit: true,
      totalLoss: true,
      lockedBalance: true,
    },
  });

  if (!user) return 0;

  const calculated =
    user.totalDeposited -
    user.totalWithdrawn +
    user.totalProfit -
    user.totalLoss -
    user.lockedBalance;

  return Math.max(0, calculated);
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
 * تحديث كل الأرصدة دفعة واحدة
 * يُستدعى بعد أي عملية مالية
 */
export async function updateUserBalances(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      totalDeposited: true,
      totalWithdrawn: true,
      totalProfit: true,
      totalLoss: true,
      lockedBalance: true,
    },
  });

  if (!user) return null;

  const availableBalance =
    user.totalDeposited -
    user.totalWithdrawn +
    user.totalProfit -
    user.totalLoss -
    user.lockedBalance;

  const totalValue = availableBalance + user.lockedBalance;

  return prisma.user.update({
    where: { id: userId },
    data: {
      availableBalance: Math.max(0, availableBalance),
      totalValue: Math.max(0, totalValue),
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

  // تحديث الإحصائيات فوراً حسب النوع والحالة
  if (updateBalances && status === 'completed') {
    await applyTransactionEffect(userId, type, amount);
  }

  return transaction;
}

/**
 * تطبيق تأثير العملية على أرصدة المستخدم
 */
async function applyTransactionEffect(userId, type, amount) {
  const updates = {};

  switch (type) {
    case 'deposit':
      updates.totalDeposited = { increment: amount };
      break;
    case 'withdraw':
      updates.totalWithdrawn = { increment: amount };
      break;
    case 'mission':
    case 'referral':
    case 'vip':
    case 'trade':
      updates.totalProfit = { increment: amount };
      break;
    case 'loss':
      updates.totalLoss = { increment: amount };
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

  await prisma.user.update({
    where: { id: userId },
    data: { totalProfit: { increment: amount } },
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