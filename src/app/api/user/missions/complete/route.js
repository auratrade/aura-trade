import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const REWARD_PERCENT = 2;

export async function POST(request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { missionId } = await request.json();

    if (!missionId) {
      return NextResponse.json(
        { error: 'معرّف المهمة مطلوب' },
        { status: 400 }
      );
    }

    // 1) جلب المهمة
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      return NextResponse.json(
        { error: 'المهمة غير موجودة' },
        { status: 404 }
      );
    }

    // 2) التحقق من الحالة
    if (mission.status !== 'active') {
      return NextResponse.json(
        { error: 'المهمة منتهية' },
        { status: 400 }
      );
    }

    // ⚠️ التحقق من الوقت
    if (new Date() > mission.endsAt) {
      return NextResponse.json(
        { error: 'انتهى وقت المهمة' },
        { status: 400 }
      );
    }

    // 3) تحقق من عدم الإكمال المسبق
    const existing = await prisma.missionCompletion.findUnique({
      where: {
        userId_missionId: {
          userId: session.userId,
          missionId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'لقد أكملت هذه المهمة بالفعل' },
        { status: 409 }
      );
    }

    // 4) جلب رصيد الإيداع
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { totalDeposited: true },
    });

    const depositBase = user.totalDeposited || 0;

    if (depositBase <= 0) {
      return NextResponse.json(
        { error: 'يجب أن تُودع مبلغاً أولاً' },
        { status: 400 }
      );
    }

    // 5) حساب المكافأة
    const reward = (depositBase * REWARD_PERCENT) / 100;

    // 6) حفظ الإكمال + إضافة الرصيد
    const result = await prisma.$transaction(async (tx) => {
      await tx.missionCompletion.create({
        data: {
          userId: session.userId,
          missionId,
          reward,
          depositBase,
          percent: REWARD_PERCENT,
        },
      });

      const updated = await tx.user.update({
        where: { id: session.userId },
        data: {
          availableBalance: { increment: reward },
          withdrawableBalance: { increment: reward },
          totalProfit: { increment: reward },
        },
        select: { availableBalance: true },
      });

      await tx.earning.create({
        data: {
          userId: session.userId,
          type: 'mission',
          amount: reward,
          description: `مكافأة مهمة: ${mission.title}`,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      reward,
      depositBase,
      percent: REWARD_PERCENT,
      newBalance: result.availableBalance,
    });
  } catch (error) {
    console.error('🔥 Complete mission error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إكمال المهمة' },
      { status: 500 }
    );
  }
}