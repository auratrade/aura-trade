import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// ✅ تهيئة الاتصال مباشرة من .env (لتفادي أي مشاكل في lib/prisma)
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL غير موجود في .env');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ============================================================
// بيانات المستخدمين
// ============================================================
const USERS = [
  {
    fullName: 'User A',
    username: 'user_a',
    email: 'usera@test.com',
    password: 'test1234',
    referralCode: 'AURA-AAAAAA',
  },
  {
    fullName: 'User B',
    username: 'user_b',
    email: 'userb@test.com',
    password: 'test1234',
    referralCode: 'AURA-BBBBBB',
  },
  {
    fullName: 'User C',
    username: 'user_c',
    email: 'userc@test.com',
    password: 'test1234',
    referralCode: 'AURA-CCCCCC',
  },
];

async function main() {
  console.log('🚀 إنشاء مستخدمين تجريبيين...\n');

  const createdUsers = {};

  // 1) إنشاء المستخدمين
  for (const u of USERS) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username: u.username }, { email: u.email }],
      },
    });

    if (existing) {
      console.log(`⚠️ المستخدم ${u.username} موجود بالفعل (ID: ${existing.id})`);
      createdUsers[u.username] = existing;
      continue;
    }

    const hashed = await bcrypt.hash(u.password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: u.fullName,
        username: u.username,
        email: u.email,
        password: hashed,
        referralCode: u.referralCode,
        isVerified: true,
        accountLevel: 0,
        referralTier: 'STARTER',
        availableBalance: 0,
        withdrawableBalance: 0,
        lockedBalance: 0,
        totalValue: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        totalProfit: 0,
        totalLoss: 0,
        referralCount: 0,
        totalReferrals: 0,
        referralEarnings: 0,
        totalCommissionEarned: 0,
        level1Referrals: 0,
        level2Referrals: 0,
        level3Referrals: 0,
        totalSalaryEarned: 0,
        totalBonusEarned: 0,
      },
    });

    console.log(`✅ تم إنشاء: ${u.username} (ID: ${user.id})`);
    createdUsers[u.username] = user;
  }

  console.log('\n============================================================');
  console.log('🔗 ربط الإحالات...\n');

  const a = createdUsers['user_a'];
  const b = createdUsers['user_b'];
  const c = createdUsers['user_c'];

  // ربط B بـ A
  if (b && !b.referredBy && a) {
    await prisma.user.update({
      where: { id: b.id },
      data: { referredBy: a.id },
    });

    await prisma.referralRelation.upsert({
      where: { referrerId_referredId: { referrerId: a.id, referredId: b.id } },
      update: {},
      create: { referrerId: a.id, referredId: b.id, level: 1, activatedAt: null },
    });
    console.log(`✅ B (${b.username}) مربوط بـ A (${a.username})`);
  }

  // ربط C بـ B (و A كمستوى ثاني)
  if (c && !c.referredBy && b) {
    await prisma.user.update({
      where: { id: c.id },
      data: { referredBy: b.id },
    });

    await prisma.referralRelation.upsert({
      where: { referrerId_referredId: { referrerId: b.id, referredId: c.id } },
      update: {},
      create: { referrerId: b.id, referredId: c.id, level: 1, activatedAt: null },
    });

    if (a) {
      await prisma.referralRelation.upsert({
        where: { referrerId_referredId: { referrerId: a.id, referredId: c.id } },
        update: {},
        create: { referrerId: a.id, referredId: c.id, level: 2, activatedAt: null },
      });
      console.log(`✅ A (${a.username}) مربوط بـ C كمستوى 2`);
    }

    console.log(`✅ C (${c.username}) مربوط بـ B (${b.username})`);
  }

  console.log('\n============================================================');
  console.log('📊 ملخص الإحالات:');
  console.log('============================================================');
  console.log(`👤 A: ${a?.username} — كود: ${a?.referralCode}`);
  console.log(`👤 B: ${b?.username} — كود: ${b?.referralCode} — دعاه A`);
  console.log(`👤 C: ${c?.username} — كود: ${c?.referralCode} — دعاه B`);
  console.log('\n============================================================');
  console.log('🔐 بيانات تسجيل الدخول:');
  console.log('============================================================');
  console.log('👤 User A: usera@test.com / test1234');
  console.log('👤 User B: userb@test.com / test1234');
  console.log('👤 User C: userc@test.com / test1234');
  console.log('\n============================================================');
  console.log('🎯 الاختبار:');
  console.log('  1. سجّل دخول كـ C وأودع 100$');
  console.log('  2. وافق من الأدمن');
  console.log('  3. تحقق: B يحصل على $5، A يحصل على $10');
  console.log('\n');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });