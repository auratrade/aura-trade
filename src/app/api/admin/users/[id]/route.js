import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, logAdminAction } from '@/lib/admin-auth';
import { updateUserBalances } from '@/lib/balance';

// ============ جلب مستخدم واحد ============
export async function GET(request, { params }) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        accountLevel: true,
        referralCode: true,
        referralCount: true,
        availableBalance: true,
        lockedBalance: true,
        totalValue: true,
        totalDeposited: true,
        totalWithdrawn: true,
        totalProfit: true,
        totalLoss: true,
        referralEarnings: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        referredBy: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // جلب معاملات المستخدم
    const transactions = await prisma.transaction.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ user, transactions });
  } catch (error) {
    console.error('Admin get user error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

// ============ تعديل مستخدم ============
export async function PATCH(request, { params }) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // تحقق من وجود المستخدم
    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // ============ الحقول المسموح تعديلها ============
    const allowedFields = [
      'fullName',
      'email',
      'username',
      'accountLevel',
      'isVerified',
      'availableBalance',
      'lockedBalance',
      'totalProfit',
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // تحقق من عدم تكرار البريد/اسم المستخدم
    if (updates.email && updates.email !== existing.email) {
      const dup = await prisma.user.findUnique({
        where: { email: updates.email },
      });
      if (dup) {
        return NextResponse.json(
          { error: 'البريد الإلكتروني مستخدم' },
          { status: 409 }
        );
      }
      updates.email = updates.email.toLowerCase();
    }

    if (updates.username && updates.username !== existing.username) {
      const dup = await prisma.user.findUnique({
        where: { username: updates.username },
      });
      if (dup) {
        return NextResponse.json(
          { error: 'اسم المستخدم مستخدم' },
          { status: 409 }
        );
      }
    }

    // حدّث المستخدم
    const user = await prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        accountLevel: true,
        availableBalance: true,
        lockedBalance: true,
        totalValue: true,
        isVerified: true,
      },
    });

    // أعد حساب الأرصدة إذا تغيرت
    if (updates.availableBalance !== undefined || updates.lockedBalance !== undefined) {
      await updateUserBalances(id);
    }

    // سجل العملية
    await logAdminAction({
      adminId: session.admin.id,
      action: 'update_user',
      targetType: 'user',
      targetId: id,
      details: { updates, before: existing },
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التعديل' },
      { status: 500 }
    );
  }
}

// ============ حذف مستخدم ============
export async function DELETE(request, { params }) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await params;
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // سجل العملية قبل الحذف
    await logAdminAction({
      adminId: session.admin.id,
      action: 'delete_user',
      targetType: 'user',
      targetId: id,
      details: { email: user.email, username: user.username },
      ipAddress: ip,
    });

    // احذف المستخدم (Cascade سيمسح المعاملات)
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء الحذف' },
      { status: 500 }
    );
  }
}