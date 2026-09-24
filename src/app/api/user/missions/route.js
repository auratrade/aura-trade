import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();

    // جلب المهام النشطة
    const missions = await prisma.mission.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    console.log('🔵 Missions from DB:', missions.length);

    let depositBalance = 0;
    let completedIds = [];
    let totalRewards = 0;

    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { totalDeposited: true },
      });

      if (user) {
        depositBalance = user.totalDeposited || 0;
      }

      const completions = await prisma.missionCompletion.findMany({
        where: { userId: session.userId },
      });

      completedIds = completions.map((c) => c.missionId);
      totalRewards = completions.reduce((sum, c) => sum + c.reward, 0);
    }

    return NextResponse.json({
      missions,
      depositBalance,
      completedIds,
      totalRewards,
      percent: 2,
    });
  } catch (error) {
    console.error('🔥 User missions error:', error);
    console.error('  message:', error.message);
    console.error('  code:', error.code);
    return NextResponse.json(
      {
        missions: [],
        depositBalance: 0,
        completedIds: [],
        totalRewards: 0,
        error: error.message,
      },
      { status: 200 }
    );
  }
}