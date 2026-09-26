import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { notifyAdmin } from '@/lib/admin-auth';

export async function POST(request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, network, proof } = body;

    // 1️⃣ التحقق من المبالغ والشبكة فقط
    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: 'الحد الأدنى للإيداع 10 USDT' },
        { status: 400 }
      );
    }
    if (!network) {
      return NextResponse.json(
        { error: 'الشبكة مطلوبة' },
        { status: 400 }
      );
    }

    // 2️⃣ جلب بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { username: true, email: true },
    });

    // 3️⃣ إنشاء المعاملة بدون إجبار وجود txid
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.userId,
        type: 'deposit',
        amount: parseFloat(amount),
        network,
        txid: null, // تم تغيير القيمة لتكون فارغة
        status: 'pending',
        meta: proof ? JSON.stringify({ hasProof: true }) : null,
      },
    });

    // 4️⃣ إشعار الأدمن
    await notifyAdmin({
      type: 'deposit',
      title: 'طلب إيداع جديد',
      message: `المستخدم ${user.username} أرسل طلب إيداع بقيمة $${amount} USDT`,
      referenceId: transaction.id,
      priority: 'high',
    });

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
      },
    });
  } catch (error) {
    console.error('Deposit request error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الطلب' },
      { status: 500 }
    );
  }
}