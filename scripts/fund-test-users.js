const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// ============ الإعدادات ============
const AMOUNT = parseFloat(process.argv[2] || '100');  // افتراضي: 100$
const PATTERN = process.argv[3] || '@aura-test.com';  // نمط البريد

async function main() {
  console.log('\n═══════════════════════════════════════');
  console.log('💰 Funding Test Users');
  console.log('═══════════════════════════════════════');
  console.log('💵 Amount per user:', `$${AMOUNT}`);
  console.log('📧 Email pattern:', PATTERN);
  console.log('═══════════════════════════════════════\n');

  // ============ 1) جلب المستخدمين ============
  const users = await prisma.user.findMany({
    where: {
      email: { contains: PATTERN },
    },
    select: {
      id: true,
      email: true,
      username: true,
      totalDeposited: true,
      availableBalance: true,
    },
  });

  if (users.length === 0) {
    console.error(`❌ لا يوجد مستخدمون بنمط "${PATTERN}"`);
    process.exit(1);
  }

  console.log(`✅ تم العثور على ${users.length} مستخدم\n`);

  // ============ 2) اشحن كل مستخدم ============
  let successCount = 0;
  let totalFunded = 0;

  for (const user of users) {
    try {
      // نفّذ كل شيء في transaction واحدة
      await prisma.$transaction(async (tx) => {
        // 1️⃣ أنشئ معاملة إيداع مكتملة
        await tx.transaction.create({
          data: {
            userId: user.id,
            type: 'deposit',
            amount: AMOUNT,
            network: 'USDT - TRC20',
            txid: `TEST_${Date.now()}_${user.id.slice(0, 8)}`,
            status: 'completed',
            reason: 'شحن تجريبي',
            meta: JSON.stringify({ test: true }),
          },
        });

        // 2️⃣ حدّث أرصدة المستخدم
        const newAvailable = (user.availableBalance || 0) + AMOUNT;
        const newDeposited = (user.totalDeposited || 0) + AMOUNT;

        await tx.user.update({
          where: { id: user.id },
          data: {
            availableBalance: newAvailable,
            totalDeposited: newDeposited,
            totalValue: newAvailable,
          },
        });

        // 3️⃣ سجل في earnings
        await tx.earning.create({
          data: {
            userId: user.id,
            type: 'deposit',
            amount: AMOUNT,
            description: `شحن تجريبي — $${AMOUNT}`,
          },
        });
      });

      successCount++;
      totalFunded += AMOUNT;

      console.log(
        `✅ [${successCount}/${users.length}] ${user.username} → +$${AMOUNT}`
      );
    } catch (e) {
      console.error(`❌ [${user.username}] فشل:`, e.message);
    }
  }

  // ============ 3) النتيجة النهائية ============
  console.log('\n═══════════════════════════════════════');
  console.log('📊 النتيجة النهائية:');
  console.log('═══════════════════════════════════════');
  console.log('✅ تم شحن:', successCount, '/', users.length);
  console.log('💵 إجمالي المبلغ:', `$${totalFunded.toFixed(2)}`);
  console.log('═══════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());