import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      accountLevel: true,
      referralCode: true,
      referralCount: true,

      // ============ الأرصدة المالية ============
      availableBalance: true,
      lockedBalance: true,
      totalValue: true,
      totalDeposited: true,
      totalWithdrawn: true,
      totalProfit: true,
      totalLoss: true,

      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}