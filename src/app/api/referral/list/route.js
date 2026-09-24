import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getReferredUsers } from '@/lib/referral';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
  }

  const referrals = await getReferredUsers(session.userId);

  return NextResponse.json({ referrals });
}