import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();

    // ⚠️ إنهاء المهام المنتهية تلقائياً (أفضلية للأداء)
    await prisma.mission.updateMany({
      where: {
        status: 'active',
        endsAt: { lt: new Date() },
      },
      data: {
        status: 'ended',
        endedAt: new Date(),
        endedBy: 'auto',
      },
    });

    // جلب المهمة النشطة (واحدة فقط)
    const mission = await prisma.mission.findFirst({
      where: { status: 'active' },
      select: {
        id: true,
        title: true,
        startedAt: true,
        endsAt: true,
      },
    });

    // ⚠️ إذا لا يوجد مستخدم → أعد المهمة فقط
    if (!session) {
      return NextResponse.json({
        mission: mission || null,
        depositBalance: 0,
        completed: false,
        totalRewards: 0,
        percent: 2,
      });
    }

    // بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { totalDeposited: true },
    });

    const depositBalance = user?.totalDeposited || 0;

    // هل أكمل المستخدم هذه المهمة؟
    let completed = false;
    if (mission) {
      const completion = await prisma.missionCompletion.findUnique({
        where: {
          userId_missionId: {
            userId: session.userId,
            missionId: mission.id,
          },
        },
      });
      completed = !!completion;
    }

    // إجمالي المكافآت
    const completions = await prisma.missionCompletion.findMany({
      where: { userId: session.userId },
      select: { reward: true },
    });

    const totalRewards = completions.reduce((sum, c) => sum + c.reward, 0);

    return NextResponse.json({
      mission: mission || null,
      depositBalance,
      completed,
      totalRewards,
      percent: 2,
    });
  } catch (error) {
    console.error('🔥 User missions error:', error);
    return NextResponse.json({
      mission: null,
      depositBalance: 0,
      completed: false,
      totalRewards: 0,
      percent: 2,
    });
  }
}