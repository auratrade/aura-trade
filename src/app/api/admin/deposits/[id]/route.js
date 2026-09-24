import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, logAdminAction } from '@/lib/admin-auth';
import { updateUserBalances } from '@/lib/balance';

// ============ الموافقة ============
export async function POST(request, { params }) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body; // 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'الإجراء غير صالح' },
        { status: 400 }
      );
    }

    const tx = await prisma.transaction.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } } },
    });

    if (!tx) {
      return NextResponse.json(
        { error: 'العملية غير موجودة' },
        { status: 404 }
      );
    }

    if (tx.status !== 'pending') {
      return NextResponse.json(
        { error: 'العملية معالجة بالفعل' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (action === 'approve') {
      // ✅ موافقة — أضف الرصيد
      await prisma.$transaction(async (prismaTx) => {
        await prismaTx.transaction.update({
          where: { id },
          data: { status: 'completed' },
        });

        await prismaTx.user.update({
          where: { id: tx.userId },
          data: {
            totalDeposited: { increment: tx.amount },
          },
        });
      });

      // أعد حساب الأرصدة
      await updateUserBalances(tx.userId);

      await logAdminAction({
        adminId: session.admin.id,
        action: 'approve_deposit',
        targetType: 'transaction',
        targetId: id,
        details: { amount: tx.amount, userId: tx.userId },
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, action: 'approved' });
    } else {
      // ❌ رفض
      await prisma.transaction.update({
        where: { id },
        data: {
          status: 'rejected',
          reason: reason || 'لم يتم التحقق من التحويل',
        },
      });

      await logAdminAction({
        adminId: session.admin.id,
        action: 'reject_deposit',
        targetType: 'transaction',
        targetId: id,
        details: { amount: tx.amount, reason },
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, action: 'rejected' });
    }
  } catch (error) {
    console.error('Admin deposit action error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}