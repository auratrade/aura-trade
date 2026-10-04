import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/admin-auth';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ admin: null }, { status: 401 });
  }
  return NextResponse.json({ admin: session.admin });
}