import { prisma } from '../src/lib/prisma.js';

// ✏️ عدّل هذه القيم
const USERNAME = 'Mnbvcxy21';
const AMOUNT = 3;
const REASON = 'مكافأة من الإدارة';

async function main() {
  console.log('🔍 البحث عن المستخدم...');

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: USERNAME },
        { email: USERNAME },
      ],
    },
  });

  if (!user) {
    console.error(`❌ المستخدم "${USERNAME}" غير موجود`);
    return;
  }

  console.log(`👤 المستخدم: ${user.username} (${user.id})`);
  console.log(`💰 الرصيد الحالي: $${user.availableBalance.toFixed(2)}`);
  console.log(`💵 القابل للسحب: $${user.withdrawableBalance.toFixed(2)}`);

  await prisma.$transaction(async (tx) => {
    // 1) إضافة الرصيد
    await tx.user.update({
      where: { id: user.id },
      data: {
        availableBalance: { increment: AMOUNT },
        withdrawableBalance: { increment: AMOUNT },
        totalProfit: { increment: AMOUNT },
      },
    });

    // 2) تسجيل المكافأة في earnings
    await tx.earning.create({
      data: {
        userId: user.id,
        type: 'bonus',
        amount: AMOUNT,
        description: REASON,
      },
    });

    // 3) إشعار للمستخدم
    await tx.userNotification.create({
      data: {
        userId: user.id,
        type: 'system',
        title: '🎁 مكافأة جديدة!',
        message: `تمت إضافة $${AMOUNT.toFixed(2)} إلى حسابك: ${REASON}`,
        icon: 'gift',
        priority: 'high',
        actionUrl: '/dashboard',
        isRead: false,
      },
    });
  });

  console.log(`\n✅ تمت إضافة $${AMOUNT.toFixed(2)} بنجاح`);
  console.log(`💰 الرصيد الجديد: $${(user.availableBalance + AMOUNT).toFixed(2)}`);
  console.log(`💵 القابل للسحب: $${(user.withdrawableBalance + AMOUNT).toFixed(2)}`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });