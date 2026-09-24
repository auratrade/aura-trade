const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv/config');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2] || 'admin@aura-trade.com';
  const username = process.argv[3] || 'admin';
  const password = process.argv[4] || 'Admin@2026!';
  const fullName = process.argv[5] || 'Super Admin';

  console.log('\n📝 Creating admin...');
  console.log('  Email:', email);
  console.log('  Username:', username);
  console.log('  Full Name:', fullName);

  const hashed = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hashed },
    create: {
      email,
      username,
      password: hashed,
      fullName,
      role: 'superadmin',
      isActive: true,
    },
  });

  console.log('\n✅ Admin ready!');
  console.log('═══════════════════════════════════════');
  console.log('  📧 Email:    ', admin.email);
  console.log('  🔑 Password: ', password);
  console.log('  🌐 Login:     http://localhost:3000/admin/login');
  console.log('═══════════════════════════════════════');
  console.log('⚠️  احتفظ بهذه البيانات في مكان آمن!');
  console.log('⚠️  غيّر كلمة المرور بعد أول دخول!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());