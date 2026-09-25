import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        availableBalance: true,
        lockedBalance: true,
        withdrawableBalance: true,   // ✅ جديد
        totalDeposited: true,
        totalWithdrawn: true,
        totalProfit: true,
        totalSalaryEarned: true,
        totalBonusEarned: true,
        totalValue: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      balances: {
        availableBalance: user.availableBalance || 0,
        lockedBalance: user.lockedBalance || 0,
        withdrawableBalance: user.withdrawableBalance || 0,   // ✅
        totalValue: user.totalValue || 0,
        totalDeposited: user.totalDeposited || 0,
        totalWithdrawn: user.totalWithdrawn || 0,
        totalProfit: user.totalProfit || 0,
      },
    });
  } catch (error) {
    console.error('Balance error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}