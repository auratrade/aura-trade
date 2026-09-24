import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getCurrentAdmin,
  verifyAdminPassword,
  hashAdminPassword,
  logAdminAction,
} from '@/lib/admin-auth';

export async function PATCH(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'البيانات مطلوبة' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.admin.id },
    });

    const valid = await verifyAdminPassword(currentPassword, admin.password);
    if (!valid) {
      return NextResponse.json(
        { error: 'كلمة المرور الحالية خاطئة' },
        { status: 400 }
      );
    }

    const hashed = await hashAdminPassword(newPassword);

    await prisma.admin.update({
      where: { id: session.admin.id },
      data: { password: hashed },
    });

    await logAdminAction({
      adminId: session.admin.id,
      action: 'change_admin_password',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'فشل التغيير' }, { status: 500 });
  }
}