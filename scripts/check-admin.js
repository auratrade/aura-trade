const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv/config');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const admins = await prisma.admin.findMany();

  console.log('\n📋 Total admins:', admins.length);

  for (const a of admins) {
    console.log('\n══════════════════════════════════');
    console.log('📧 Email:', a.email);
    console.log('👤 Username:', a.username);
    console.log('✅ Active:', a.isActive);
    console.log('🔒 Login attempts:', a.loginAttempts);
    console.log('⏰ Locked until:', a.lockedUntil);
    console.log('🔑 Hash:', a.password.slice(0, 40) + '...');

    // اختبار كلمات مرور شائعة
    const tests = [
      'Admin@2026!',
      'admin123',
      'Admin123!',
      'admin',
      'Admin@123',
    ];

    console.log('\n🔍 اختبار كلمات المرور:');
    for (const pwd of tests) {
      const valid = await bcrypt.compare(pwd, a.password);
      if (valid) {
        console.log(`   ✅ "${pwd}" = صحيحة`);
      }
    }
  }
  console.log('\n══════════════════════════════════\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());