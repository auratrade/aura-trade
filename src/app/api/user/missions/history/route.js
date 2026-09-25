import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرّح' },
        { status: 401 }
      );
    }

    // جلب سجل المهام الخاصة بالمستخدم فقط
    const completions = await prisma.missionCompletion.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    // جلب بيانات المهام المرتبطة بالسجل
    const missionIds = [
      ...new Set(completions.map((item) => item.missionId)),
    ];

    const missions = await prisma.mission.findMany({
      where: {
        id: {
          in: missionIds,
        },
      },
      select: {
        id: true,
        title: true,
        startedAt: true,
        endsAt: true,
      },
    });

    const missionMap = new Map(
      missions.map((mission) => [mission.id, mission])
    );

    const history = completions.map((completion) => {
      const mission = missionMap.get(completion.missionId);

      return {
        id: completion.id,
        missionId: completion.missionId,

        title: mission?.title || 'مهمة محذوفة',

        reward: completion.reward,
        depositBase: completion.depositBase,
        percent: completion.percent,

        completedAt: completion.completedAt,

        missionStartedAt: mission?.startedAt || null,
        missionEndsAt: mission?.endsAt || null,
      };
    });

    const totalRewards = history.reduce(
      (total, item) => total + item.reward,
      0
    );

    return NextResponse.json({
      success: true,
      history,
      totalCompleted: history.length,
      totalRewards,
    });
  } catch (error) {
    console.error('🔥 Mission history error:', error);

    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب سجل المهام' },
      { status: 500 }
    );
  }
}