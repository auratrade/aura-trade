import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, logAdminAction } from '@/lib/admin-auth';

// ============ جلب كل المهام ============
export async function GET() {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const missions = await prisma.mission.findMany({
      orderBy: { startedAt: 'desc' },
    });

    return NextResponse.json({ missions });
  } catch (error) {
    console.error('Missions list error:', error);
    return NextResponse.json({ missions: [] });
  }
}

// ============ إنشاء مهمة جديدة (60 دقيقة) ============
export async function POST(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const body = await request.json();
    const { title } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'الرجاء إدخال اسم المهمة' },
        { status: 400 }
      );
    }

    // ⚠️ تحقق: هل هناك مهمة نشطة بالفعل؟
    const activeMission = await prisma.mission.findFirst({
      where: { status: 'active' },
    });

    if (activeMission) {
      return NextResponse.json(
        { error: 'لا يمكن إنشاء مهمة جديدة قبل إنهاء المهمة الحالية' },
        { status: 400 }
      );
    }

    // ✅ حساب وقت الانتهاء (60 دقيقة من الآن)
    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + 60 * 60 * 1000);

    const mission = await prisma.mission.create({
      data: {
        title: title.trim(),
        status: 'active',
        startedAt,
        endsAt,
        createdBy: session.admin.id,
      },
    });

    await logAdminAction({
      adminId: session.admin.id,
      action: 'create_mission',
      targetType: 'mission',
      targetId: mission.id,
      details: { title: mission.title, endsAt },
    });

    return NextResponse.json({ success: true, mission });
  } catch (error) {
    console.error('🔥 Create mission error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المهمة' },
      { status: 500 }
    );
  }
}