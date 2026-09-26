import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const MIN_WITHDRAW = 20;
const FEE = 1;

export async function POST(request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, network, address } = body;

    // ============ التحقق من المدخلات ============
    if (!amount || amount < MIN_WITHDRAW) {
      return NextResponse.json(
        { error: `الحد الأدنى للسحب ${MIN_WITHDRAW} USDT` },
        { status: 400 }
      );
    }
    if (!address || address.length < 20) {
      return NextResponse.json(
        { error: 'عنوان المحفظة غير صالح' },
        { status: 400 }
      );
    }

    // ============ جلب المستخدم ============
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        availableBalance: true,
        lockedBalance: true,
        withdrawableBalance: true,
        username: true,
      },
    });

    // ============ التحقق من الرصيد القابل للسحب ============
    const totalNeeded = parseFloat(amount) + FEE;

    if (user.withdrawableBalance < totalNeeded) {
      return NextResponse.json(
        {
          error: `الرصيد القابل للسحب غير كافٍ. المتاح: $${user.withdrawableBalance.toFixed(2)} USDT. الرصيد المُودع (رأس المال) غير قابل للسحب.`,
        },
        { status: 400 }
      );
    }

    // ============ التحقق من عدم وجود طلب معلّق ============
    const pendingWithdraw = await prisma.transaction.findFirst({
      where: {
        userId: session.userId,
        type: 'withdraw',
        status: { in: ['pending', 'processing'] },
      },
    });

    if (pendingWithdraw) {
      return NextResponse.json(
        { error: 'لديك طلب سحب معلّق. انتظر معالجته' },
        { status: 400 }
      );
    }

    // ============ إنشاء المعاملة ============
    const transaction = await prisma.$transaction(async (tx) => {
      // انقل المبلغ من الأرباح إلى lockedBalance
      await tx.user.update({
        where: { id: session.userId },
        data: {
          availableBalance: { decrement: totalNeeded },
          withdrawableBalance: { decrement: totalNeeded },
          lockedBalance: { increment: totalNeeded },
        },
      });

      // أنشئ المعاملة
      return tx.transaction.create({
        data: {
          userId: session.userId,
          type: 'withdraw',
          amount: parseFloat(amount),
          network,
          address,
          status: 'pending',
          meta: JSON.stringify({ fee: FEE }),
        },
      });
    });

    // ============ إشعار الأدمن ============
    try {
      await prisma.adminNotification.create({
        data: {
          type: 'withdraw',
          title: 'طلب سحب جديد',
          message: `المستخدم ${user.username} طلب سحب $${amount} USDT إلى ${address.slice(0, 10)}...`,
          referenceId: transaction.id,
          priority: 'high',
        },
      });
    } catch (e) {
      console.error('Notification error:', e);
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
      },
    });
  } catch (error) {
    console.error('Withdraw request error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الطلب' },
      { status: 500 }
    );
  }
}