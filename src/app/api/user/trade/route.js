import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const TRADE_AMOUNT = 100; // قيمة الصفقة الفعلية

export async function POST(request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { direction } = await request.json(); // 'up' or 'down'

    if (!['up', 'down'].includes(direction)) {
      return NextResponse.json(
        { error: 'اتجاه الصفقة غير صحيح' },
        { status: 400 }
      );
    }

    // التحقق من الرصيد الحالي
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        availableBalance: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من أن الرصيد كافٍ
    if (user.availableBalance < TRADE_AMOUNT) {
      return NextResponse.json(
        { error: 'رصيدك غير كافٍ، الحد الأدنى للصفقة 100$' },
        { status: 400 }
      );
    }

    // محاكاة الخسارة (1.2% - 2.7%)
    const lossPercentage = 0.012 + Math.random() * 0.015;
    const loss = TRADE_AMOUNT * lossPercentage;

    // خصم المبلغ من الرصيد
    const newBalance = user.availableBalance - loss;

    // تحديث الرصيد في قاعدة البيانات
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        availableBalance: newBalance,
        totalValue: { decrement: loss },
        // اختياري: تسجيل الخسارة كربح سالب
        totalProfit: { decrement: loss },
      },
    });

    // إنشاء سجل للصفقة (اختياري)
    const entryPrice = 69149.29 + (Math.random() - 0.5) * 200;
    const exitPrice = entryPrice * 0.985; // خسارة محاكاة

    // يمكن إضافة جدول Trades إذا أردت تتبع تاريخ الصفقات
    // await prisma.trade.create({
    //   data: {
    //     userId: session.userId,
    //     direction,
    //     symbol: 'BTC/USDT',
    //     entryPrice,
    //     exitPrice,
    //     amount: TRADE_AMOUNT,
    //     loss,
    //     timestamp: new Date(),
    //   },
    // });

    return NextResponse.json({
      success: true,
      trade: {
        direction,
        symbol: 'BTC/USDT',
        entryPrice: entryPrice.toFixed(2),
        exitPrice: exitPrice.toFixed(2),
        amount: TRADE_AMOUNT,
        loss: loss.toFixed(2),
        balanceAfter: newBalance.toFixed(2),
      },
      balances: {
        availableBalance: newBalance,
      },
    });
  } catch (error) {
    console.error('Trade error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تنفيذ الصفقة' },
      { status: 500 }
    );
  }
}
