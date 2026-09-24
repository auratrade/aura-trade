import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, logAdminAction } from '@/lib/admin-auth';
import { updateUserBalances } from '@/lib/balance';

export async function POST(request, { params }) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, reason, externalTxid } = body;

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

    const fee = 1; // رسوم السحب
    const totalLocked = tx.amount + fee;

    if (action === 'approve') {
      // ✅ موافقة — اخصم من lockedBalance
      await prisma.$transaction(async (prismaTx) => {
        await prismaTx.transaction.update({
          where: { id },
          data: {
            status: 'completed',
            meta: JSON.stringify({
              fee,
              externalTxid: externalTxid || null,
              approvedBy: session.admin.id,
              approvedAt: new Date().toISOString(),
            }),
          },
        });

        // اخصم من الرصيد المقفل
        await prismaTx.user.update({
          where: { id: tx.userId },
          data: {
            lockedBalance: { decrement: totalLocked },
            totalWithdrawn: { increment: tx.amount },
          },
        });
      });

      await updateUserBalances(tx.userId);

      await logAdminAction({
        adminId: session.admin.id,
        action: 'approve_withdrawal',
        targetType: 'transaction',
        targetId: id,
        details: {
          amount: tx.amount,
          userId: tx.userId,
          externalTxid,
        },
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, action: 'approved' });
    } else {
      // ❌ رفض — أعد المبلغ من lockedBalance إلى availableBalance
      await prisma.$transaction(async (prismaTx) => {
        await prismaTx.transaction.update({
          where: { id },
          data: {
            status: 'rejected',
            reason: reason || 'تم الرفض من الإدارة',
          },
        });

        await prismaTx.user.update({
          where: { id: tx.userId },
          data: {
            availableBalance: { increment: totalLocked },
            lockedBalance: { decrement: totalLocked },
          },
        });
      });

      await updateUserBalances(tx.userId);

      await logAdminAction({
        adminId: session.admin.id,
        action: 'reject_withdrawal',
        targetType: 'transaction',
        targetId: id,
        details: { amount: tx.amount, reason },
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, action: 'rejected' });
    }
  } catch (error) {
    console.error('Admin withdrawal action error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}