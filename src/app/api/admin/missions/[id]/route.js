import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, logAdminAction } from '@/lib/admin-auth';

// ============ إنهاء مهمة ============
export async function PATCH(request, { params }) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await params;

    const mission = await prisma.mission.findUnique({ where: { id } });

    if (!mission) {
      return NextResponse.json(
        { error: 'المهمة غير موجودة' },
        { status: 404 }
      );
    }

    if (mission.status === 'ended') {
      return NextResponse.json(
        { error: 'المهمة منتهية بالفعل' },
        { status: 400 }
      );
    }

    // ✅ إنهاء المهمة
    const updated = await prisma.mission.update({
      where: { id },
      data: {
        status: 'ended',
        endedAt: new Date(),
        endedBy: session.admin.id,
      },
    });

    await logAdminAction({
      adminId: session.admin.id,
      action: 'end_mission',
      targetType: 'mission',
      targetId: id,
      details: { title: mission.title },
    });

    return NextResponse.json({ success: true, mission: updated });
  } catch (error) {
    console.error('🔥 End mission error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// ============ حذف مهمة ============
export async function DELETE(request, { params }) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await params;

    const mission = await prisma.mission.findUnique({ where: { id } });
    if (!mission) {
      return NextResponse.json(
        { error: 'المهمة غير موجودة' },
        { status: 404 }
      );
    }

    await prisma.mission.delete({ where: { id } });

    await logAdminAction({
      adminId: session.admin.id,
      action: 'delete_mission',
      targetType: 'mission',
      targetId: id,
      details: { title: mission.title },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete mission error:', error);
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}