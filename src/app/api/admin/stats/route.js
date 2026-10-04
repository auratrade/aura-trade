import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin-auth';

export async function GET() {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const [
      totalUsers,
      totalDeposits,
      totalWithdrawals,
      pendingDeposits,
      pendingWithdrawals,
      totalBalance,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.count({ where: { type: 'deposit' } }),
      prisma.transaction.count({ where: { type: 'withdraw' } }),
      prisma.transaction.count({ where: { type: 'deposit', status: 'pending' } }),
      prisma.transaction.count({ where: { type: 'withdraw', status: 'pending' } }),
      prisma.user.aggregate({
        _sum: { availableBalance: true, totalValue: true },
      }),
    ]);

    // أحدث المستخدمين
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        accountLevel: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalDeposits,
        totalWithdrawals,
        pendingDeposits,
        pendingWithdrawals,
        totalBalance: totalBalance._sum.availableBalance || 0,
        totalValue: totalBalance._sum.totalValue || 0,
      },
      recentUsers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}