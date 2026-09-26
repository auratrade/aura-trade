import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin-auth';

// ============ جلب إشعارات الأدمن ============
export async function GET(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    // جلب الإشعارات (آخر 50 إشعار)
    const notifications = await prisma.adminNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
    });
  } catch (error) {
    console.error('Admin notifications GET error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإشعارات', details: error.message },
      { status: 500 }
    );
  }
}

// ============ تعليم جميع الإشعارات كمقروءة ============
export async function POST(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    // تعليم جميع الإشعارات غير المقروءة كمقروءة
    const result = await prisma.adminNotification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      updated: result.count,
    });
  } catch (error) {
    console.error('Admin notifications POST error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تعليم الإشعارات', details: error.message },
      { status: 500 }
    );
  }
}

// ============ تحديث إشعار واحد كمقروء ============
export async function PATCH(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id, isRead } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'معرّف الإشعار مفقود' },
        { status: 400 }
      );
    }

    const updated = await prisma.adminNotification.update({
      where: { id },
      data: { isRead: isRead ?? true },
    });

    return NextResponse.json({
      success: true,
      notification: updated,
    });
  } catch (error) {
    console.error('Admin notifications PATCH error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الإشعار', details: error.message },
      { status: 500 }
    );
  }
}

// ============ حذف إشعار ============
export async function DELETE(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'معرّف الإشعار مفقود' },
        { status: 400 }
      );
    }

    await prisma.adminNotification.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin notifications DELETE error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الإشعار', details: error.message },
      { status: 500 }
    );
  }
}
