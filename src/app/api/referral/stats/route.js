import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getReferralStats } from '@/lib/referral';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const stats = await getReferralStats(session.userId);
    if (!stats) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('🔥🔥🔥 REFERRAL STATS ERROR 🔥🔥🔥');
    console.error('  name:', error?.name);
    console.error('  code:', error?.code);
    console.error('  message:', error?.message);
    console.error('  meta:', JSON.stringify(error?.meta, null, 2));
    console.error('  stack:', error?.stack?.split('\n').slice(0, 5).join('\n'));

    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء جلب الإحصائيات',
        debug: {
          name: error?.name,
          code: error?.code,
          message: error?.message,
        },
      },
      { status: 500 }
    );
  }
}