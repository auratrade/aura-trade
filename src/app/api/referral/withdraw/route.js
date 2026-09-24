import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { transferReferralEarnings } from '@/lib/referral';
import { updateUserBalances } from '@/lib/balance';

export async function POST() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const result = await transferReferralEarnings(session.userId);

    if (!result.success) {
      if (result.error === 'no_earnings') {
        return NextResponse.json(
          { error: 'لا توجد أرباح قابلة للنقل' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'فشل نقل الأرباح' },
        { status: 500 }
      );
    }

    // حدّث الأرصدة
    await updateUserBalances(session.userId);

    return NextResponse.json({
      success: true,
      transferred: result.amount,
    });
  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: 'فشل نقل الأرباح' },
      { status: 500 }
    );
  }
}