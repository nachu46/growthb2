import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const boms = db.prepare(`SELECT * FROM bom_submissions ORDER BY created_at DESC`).all();
    return NextResponse.json({ success: true, count: boms.length, data: boms });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch BOM submissions' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'BOM ID and status are required' }, { status: 400 });
    }

    db.prepare(`UPDATE bom_submissions SET status = ? WHERE id = ?`).run(status, id);

    logAdminAction({
      adminEmail: user.email,
      action: 'STATUS_CHANGE',
      entity: 'BOM_SUBMISSION',
      entityId: id,
      metadata: { newStatus: status },
    });

    return NextResponse.json({ success: true, message: 'BOM submission status updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update BOM status' }, { status: 500 });
  }
}
