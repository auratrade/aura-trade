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
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ missions });
  } catch (error) {
    console.error('Missions list error:', error);
    return NextResponse.json({ missions: [] });
  }
}

// ============ إنشاء مهمة ============
export async function POST(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      symbol,
      name,
      price,
      change,
      up,
      icon,
      difficulty,
      timeEstimate,
      reward,
      isActive,
    } = body;

    // التحقق
    if (!title || !description || !symbol || !name || !price) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // ترتيب تلقائي
    const count = await prisma.mission.count();

    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        symbol: symbol.toUpperCase(),
        name,
        price: parseFloat(price),
        change: parseFloat(change || 0),
        up: up !== undefined ? up : true,
        icon: icon || 'chart',
        difficulty: difficulty || 'سهل',
        timeEstimate: timeEstimate || '30 ثانية',
        reward: parseFloat(reward || 0),
        isActive: isActive !== undefined ? isActive : true,
        order: count,
      },
    });

    await logAdminAction({
      adminId: session.admin.id,
      action: 'create_mission',
      targetType: 'mission',
      targetId: mission.id,
      details: { title, symbol },
    });

    return NextResponse.json({ success: true, mission });
  } catch (error) {
    console.error('Create mission error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المهمة' },
      { status: 500 }
    );
  }
}