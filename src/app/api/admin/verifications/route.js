import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin-auth';

export async function GET(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const where = {};
    if (status !== 'all') where.status = status;

    const verifications = await prisma.identityVerification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        // لا يمكن include لأن userId ليس relation — سنجلب يدوياً
      },
    });

    // جلب بيانات المستخدمين
    const userIds = verifications.map((v) => v.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isVerified: true,
        createdAt: true,
      },
    });

    const usersMap = users.reduce((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {});

    const result = verifications.map((v) => ({
      ...v,
      user: usersMap[v.userId] || null,
    }));

    return NextResponse.json({ verifications: result });
  } catch (error) {
    console.error('Admin verifications error:', error);
    return NextResponse.json({ verifications: [] });
  }
}