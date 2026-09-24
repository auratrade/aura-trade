import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getCurrentAdmin,
  removeAdminCookie,
  logAdminAction,
} from '@/lib/admin-auth';

export async function POST(request) {
  try {
    const session = await getCurrentAdmin();

    if (session) {
      await prisma.adminSession.delete({
        where: { id: session.sessionId },
      });

      await logAdminAction({
        adminId: session.admin.id,
        action: 'admin_logout',
      });
    }

    await removeAdminCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin logout error:', error);
    await removeAdminCookie();
    return NextResponse.json({ success: true });
  }
}