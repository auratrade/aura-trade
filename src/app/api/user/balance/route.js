import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { updateUserBalances } from '@/lib/balance';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
  }

  // حدّث الأرصدة أولاً لضمان الدقة
  const balances = await updateUserBalances(session.userId);

  if (!balances) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
  }

  return NextResponse.json({ balances });
}