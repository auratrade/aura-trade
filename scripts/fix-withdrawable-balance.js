import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fix() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      availableBalance: true,
      withdrawableBalance: true,
      totalProfit: true,
      totalWithdrawn: true,
    },
  });

  console.log(`🔧 Fixing ${users.length} users...\n`);

  for (const u of users) {
    // ✅ الأرباح القابلة للسحب = totalProfit - المسحوب من الأرباح
    //    (نفترض أن كل السحوبات كانت من الأرباح)
    const expected = Math.max(0, u.totalProfit - u.totalWithdrawn);

    if (Math.abs(u.withdrawableBalance - expected) > 0.01) {
      console.log(
        `👤 ${u.username}: withdrawable ${u.withdrawableBalance.toFixed(2)} → ${expected.toFixed(2)}`
      );

      await prisma.user.update({
        where: { id: u.id },
        data: { withdrawableBalance: expected },
      });
    }
  }

  console.log('\n🎉 Done!');
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());