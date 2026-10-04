const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

(async () => {
  console.log('=== Prisma Client Check ===');
  console.log('loginAttempt:', !!prisma.loginAttempt);
  console.log('user:', !!prisma.user);
  console.log('otpCode:', !!prisma.otpCode);
  console.log('passwordResetToken:', !!prisma.passwordResetToken);
  
  if (prisma.loginAttempt) {
    const count = await prisma.loginAttempt.count();
    console.log('LoginAttempt count:', count);
  }
  
  await prisma.$disconnect();
})();