/**
 * سكربت إنشاء حساب Rita
 * 
 * التشغيل:
 *   node scripts/create-rita.js
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================================
// بيانات الحساب
// ============================================================
const USER_DATA = {
  fullName: 'Rita',
  email: 'rita@aura-trade.com',
  username: 'rita',
  password: '12345678',
  referralCode: 'AURA-RITA01',
};

async function main() {
  console.log('🚀 بدء إنشاء حساب Rita...\n');

  // ============================================================
  // 1) التحقق من عدم وجود الحساب مسبقاً
  // ============================================================
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: USER_DATA.email },
        { username: USER_DATA.username },
      ],
    },
  });

  if (existing) {
    console.log('⚠️  الحساب موجود بالفعل:');
    console.log(`   📧 Email: ${existing.email}`);
    console.log(`   👤 Username: ${existing.username}`);
    console.log(`   🆔 ID: ${existing.id}`);
    console.log(`   🔑 Referral Code: ${existing.referralCode}`);
    console.log('\n❌ لا يمكن الإنشاء — الحساب موجود.');
    return;
  }

  // ============================================================
  // 2) تشفير كلمة المرور
  // ============================================================
  console.log('🔐 جاري تشفير كلمة المرور...');
  const hashedPassword = await bcrypt.hash(USER_DATA.password, 10);
  console.log('✅ تم التشفير\n');

  // ============================================================
  // 3) إنشاء المستخدم
  // ============================================================
  console.log('👤 جاري إنشاء المستخدم...');
  const user = await prisma.user.create({
    data: {
      fullName: USER_DATA.fullName,
      email: USER_DATA.email.toLowerCase(),
      username: USER_DATA.username,
      password: hashedPassword,
      referralCode: USER_DATA.referralCode,

      // حالة الحساب
      isVerified: true,        // ✅ موثق مباشرة (اختياري — احذفه إذا أردت التوثيق اليدوي)
      accountLevel: 0,
      referralTier: 'STARTER',

      // الأرصدة
      availableBalance: 0,
      lockedBalance: 0,
      withdrawableBalance: 0,
      totalValue: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalProfit: 0,
      totalLoss: 0,

      // الإحالات
      referralCount: 0,
      totalReferrals: 0,
      referralEarnings: 0,
      level1Referrals: 0,
      level2Referrals: 0,
      level3Referrals: 0,

      // الرواتب
      totalSalaryEarned: 0,
      totalBonusEarned: 0,
    },
  });

  console.log('✅ تم إنشاء المستخدم بنجاح!\n');

  // ============================================================
  // 4) عرض النتيجة
  // ============================================================
  console.log('═══════════════════════════════════════════════════════');
  console.log('  ✨ تم إنشاء الحساب بنجاح');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  🆔 ID:             ${user.id}`);
  console.log(`  👤 Username:       ${user.username}`);
  console.log(`  📧 Email:          ${user.email}`);
  console.log(`  🏷️  Full Name:      ${user.fullName}`);
  console.log(`  🎫 Referral Code:  ${user.referralCode}`);
  console.log(`  🔑 Password:       ${USER_DATA.password}`);
  console.log(`  ✅ Verified:       ${user.isVerified}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n🎉 يمكنك الآن تسجيل الدخول باستخدام:');
  console.log(`   📧 البريد:   ${USER_DATA.email}`);
  console.log(`   🔑 كلمة المرور: ${USER_DATA.password}`);
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