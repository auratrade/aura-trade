import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const REWARD_PERCENT = 2; // 2%

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

    // 1️⃣ جلب المهمة
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      return NextResponse.json(
        { error: 'المهمة غير موجودة' },
        { status: 404 }
      );
    }

    if (!mission.isActive) {
      return NextResponse.json(
        { error: 'المهمة غير نشطة' },
        { status: 400 }
      );
    }

    // 2️⃣ تحقق من عدم الإكمال المسبق
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

    // 3️⃣ جلب بيانات المستخدم (للرصيد)
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        totalDeposited: true,
        availableBalance: true,
        totalProfit: true,
      },
    });

    // 4️⃣ حساب المكافأة
    // القاعدة: 2% من إجمالي الإيداعات
    const depositBase = user.totalDeposited || 0;

    if (depositBase <= 0) {
      return NextResponse.json(
        {
          error: 'يجب أن تُودع مبلغاً أولاً قبل إكمال المهام',
        },
        { status: 400 }
      );
    }

    const reward = (depositBase * REWARD_PERCENT) / 100;

    // 5️⃣ حفظ الإكمال + إضافة الرصيد (في transaction)
    const result = await prisma.$transaction(async (tx) => {
      // سجل الإكمال
      const completion = await tx.missionCompletion.create({
        data: {
          userId: session.userId,
          missionId,
          reward,
          depositBase,
          percent: REWARD_PERCENT,
        },
      });

      // أضف الرصيد
     const updatedUser = await tx.user.update({
  where: { id: session.userId },
  data: {
    availableBalance: { increment: reward },
    withdrawableBalance: { increment: reward },  // ✅ جديد
    totalProfit: { increment: reward },
  },
});
      // سجل في earnings
      await tx.earning.create({
        data: {
          userId: session.userId,
          type: 'mission',
          amount: reward,
          description: `مكافأة مهمة: ${mission.title}`,
        },
      });

      return { completion, updatedUser };
    });

    // 6️⃣ (اختياري) إشعار الأدمن
    try {
      await prisma.adminNotification.create({
        data: {
          type: 'system',
          title: 'إكمال مهمة',
          message: `مستخدم أكمل مهمة "${mission.title}" وربح $${reward.toFixed(2)}`,
          referenceId: session.userId,
          priority: 'low',
        },
      });
    } catch (e) {
      console.error('Notification error:', e);
    }

    return NextResponse.json({
      success: true,
      reward,
      depositBase,
      percent: REWARD_PERCENT,
      newBalance: result.updatedUser.availableBalance,
    });
  } catch (error) {
    console.error('🔥 Complete mission error:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء إكمال المهمة',
        details:
          process.env.NODE_ENV === 'development'
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}