import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getAdminUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}
