import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, logAdminAction } from '@/lib/admin-auth';

// ============ جلب مهمة واحدة ============
export async function GET(request, { params }) {
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

    return NextResponse.json({ mission });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

// ============ تعديل مهمة ============
export async function PATCH(request, { params }) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.mission.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'المهمة غير موجودة' },
        { status: 404 }
      );
    }

    // الحقول المسموح تعديلها
    const updates = {};
    const allowed = [
      'title', 'description', 'symbol', 'name', 'price',
      'change', 'up', 'icon', 'difficulty', 'timeEstimate',
      'reward', 'isActive', 'order',
    ];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === 'price' || key === 'change' || key === 'reward') {
          updates[key] = parseFloat(body[key]);
        } else if (key === 'order') {
          updates[key] = parseInt(body[key]);
        } else if (key === 'symbol') {
          updates[key] = body[key].toUpperCase();
        } else {
          updates[key] = body[key];
        }
      }
    }

    const mission = await prisma.mission.update({
      where: { id },
      data: updates,
    });

    await logAdminAction({
      adminId: session.admin.id,
      action: 'update_mission',
      targetType: 'mission',
      targetId: id,
      details: updates,
    });

    return NextResponse.json({ success: true, mission });
  } catch (error) {
    console.error('Update mission error:', error);
    return NextResponse.json({ error: 'فشل التعديل' }, { status: 500 });
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

    await logAdminAction({
      adminId: session.admin.id,
      action: 'delete_mission',
      targetType: 'mission',
      targetId: id,
      details: { title: mission.title, symbol: mission.symbol },
    });

    await prisma.mission.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete mission error:', error);
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}