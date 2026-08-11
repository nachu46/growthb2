import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const logs = db.prepare(`SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100`).all();
    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
