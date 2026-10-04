const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv/config');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// ============ الإعدادات ============
const REFERRAL_CODE = process.argv[2] || 'AURA-PJ5MA5';
const COUNT = parseInt(process.argv[3] || '5');
const PASSWORD = 'Test@2026!';

async function main() {
  console.log('\n═══════════════════════════════════════');
  console.log('🚀 Creating Referral Test Users');
  console.log('═══════════════════════════════════════');
  console.log('📌 Referral Code:', REFERRAL_CODE);
  console.log('👥 Count:', COUNT);
  console.log('🔑 Password:', PASSWORD);
  console.log('═══════════════════════════════════════\n');

  // ============ 1) ابحث عن المُحيل ============
  const referrer = await prisma.user.findUnique({
    where: { referralCode: REFERRAL_CODE },
    select: {
      id: true,
      username: true,
      referralCode: true,
      totalReferrals: true,
      referralTier: true,
    },
  });

  if (!referrer) {
    console.error(`❌ لم يتم العثور على المستخدم بكود الإحالة: ${REFERRAL_CODE}`);
    console.error('   تأكد أن الكود صحيح.');
    process.exit(1);
  }

  console.log('✅ تم العثور على المُحيل:');
  console.log('   └─ Username:', referrer.username);
  console.log('   └─ Total Referrals:', referrer.totalReferrals);
  console.log('   └─ Tier:', referrer.referralTier);
  console.log('');

  // ============ 2) أنشئ المستخدمين ============
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const timestamp = Date.now();
  const createdUsers = [];

  for (let i = 1; i <= COUNT; i++) {
    const email = `test_ref_${timestamp}_${i}@aura-test.com`;
    const username = `testref_${timestamp}_${i}`;
    const fullName = `Test Referral User ${i}`;

    try {
      // أنشئ المستخدم
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          fullName,
          referralCode: `AURA-TEST${String(i).padStart(3, '0')}${timestamp.toString().slice(-4)}`,
          referredBy: referrer.id,
          isVerified: true,
        },
      });

      // سجل العلاقة
      await prisma.referralRelation.upsert({
        where: {
          referrerId_referredId: {
            referrerId: referrer.id,
            referredId: newUser.id,
          },
        },
        update: {},
        create: {
          referrerId: referrer.id,
          referredId: newUser.id,
          level: 1,
        },
      });

      createdUsers.push(newUser);
      console.log(`✅ [${i}/${COUNT}] Created: ${username}`);
    } catch (e) {
      console.error(`❌ [${i}/${COUNT}] Failed:`, e.message);
    }
  }

  // ============ 3) حدّث بيانات المُحيل ============
  const newTotal = referrer.totalReferrals + createdUsers.length;

  // احسب المستوى الجديد
  let newTier = 'STARTER';
  if (newTotal >= 1000) newTier = 'VIP';
  else if (newTotal >= 600) newTier = 'LEVEL5';
  else if (newTotal >= 150) newTier = 'LEVEL4';
  else if (newTotal >= 70) newTier = 'LEVEL3';
  else if (newTotal >= 20) newTier = 'LEVEL2';
  else if (newTotal >= 5) newTier = 'LEVEL1';

  await prisma.user.update({
    where: { id: referrer.id },
    data: {
      totalReferrals: newTotal,
      referralCount: newTotal,
      referralTier: newTier,
    },
  });

  // ============ 4) المكافآت التلقائية ============
  const bonusesToCreate = [];

  if (newTotal >= 5 && referrer.totalReferrals < 5) {
    bonusesToCreate.push({ tier: 'LEVEL1', bonus: 50, milestone: 5 });
  }
  if (newTotal >= 20 && referrer.totalReferrals < 20) {
    bonusesToCreate.push({ tier: 'LEVEL2', bonus: 100, milestone: 20 });
  }
  if (newTotal >= 150 && referrer.totalReferrals < 150) {
    bonusesToCreate.push({ tier: 'LEVEL4', bonus: 500, milestone: 150 });
  }
  if (newTotal >= 600 && referrer.totalReferrals < 600) {
    bonusesToCreate.push({ tier: 'LEVEL5', bonus: 4000, milestone: 600 });
  }
  if (newTotal >= 1000 && referrer.totalReferrals < 1000) {
    bonusesToCreate.push({ tier: 'VIP', bonus: 10000, milestone: 1000 });
  }

  for (const b of bonusesToCreate) {
    try {
      await prisma.referralBonus.upsert({
        where: {
          userId_tier: { userId: referrer.id, tier: b.tier },
        },
        update: {},
        create: {
          userId: referrer.id,
          tier: b.tier,
          amount: b.bonus,
          milestone: b.milestone,
          claimed: false,
        },
      });
      console.log(`🎁 منحت مكافأة ${b.tier}: $${b.bonus}`);
    } catch (e) {
      console.error('Bonus error:', e.message);
    }
  }

  // ============ النتائج النهائية ============
  console.log('\n═══════════════════════════════════════');
  console.log('📊 النتائج:');
  console.log('═══════════════════════════════════════');
  console.log('✅ Created Users:', createdUsers.length);
  console.log('📈 Total Referrals (before):', referrer.totalReferrals);
  console.log('📈 Total Referrals (after):', newTotal);
  console.log('👑 New Tier:', newTier);
  console.log('═══════════════════════════════════════\n');

  console.log('🔑 بيانات الدخول لكل مستخدم:');
  console.log('   Password:', PASSWORD);
  console.log('');

  createdUsers.forEach((u, i) => {
    console.log(`   [${i + 1}] Email: ${u.email}`);
    console.log(`       Username: ${u.username}`);
  });

  console.log('\n✅ تم الانتهاء!\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());