import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserFromRequest, SESSION_COOKIE } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';

export async function POST(req: NextRequest) {
  const user = getAdminUserFromRequest(req);
  if (user) {
    logAdminAction({
      adminEmail: user.email,
      action: 'LOGOUT',
      entity: 'USER',
      entityId: user.userId,
    });
  }

  const res = NextResponse.json({
    success: true,
    message: 'Logged out successfully.',
  });

  res.cookies.delete(SESSION_COOKIE);
  return res;
}
