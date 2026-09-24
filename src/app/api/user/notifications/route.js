import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    // 1️⃣ إشعارات المستخدم
    const userNotifs = await prisma.userNotification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    // 2️⃣ تحويلها للشكل الموحد
    const notifications = userNotifs.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      icon: n.icon,
      priority: n.priority,
      actionUrl: n.actionUrl,
      isRead: n.isRead,
      createdAt: n.createdAt,
    }));

    // 3️⃣ عدد غير المقروء
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
    });
  }
}

// ============ تعليم كل الإشعارات كمقروءة ============
export async function POST() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    await prisma.userNotification.updateMany({
      where: {
        userId: session.userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}