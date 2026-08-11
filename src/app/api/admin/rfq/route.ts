import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const rfqs = db.prepare(`SELECT * FROM rfq_requests ORDER BY created_at DESC`).all();
    return NextResponse.json({ success: true, count: rfqs.length, data: rfqs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch RFQs' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'RFQ ID and status are required' }, { status: 400 });
    }

    db.prepare(`UPDATE rfq_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(status, id);

    logAdminAction({
      adminEmail: user.email,
      action: 'STATUS_CHANGE',
      entity: 'RFQ_REQUEST',
      entityId: id,
      metadata: { newStatus: status },
    });

    return NextResponse.json({ success: true, message: 'RFQ status updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update RFQ status' }, { status: 500 });
  }
}
