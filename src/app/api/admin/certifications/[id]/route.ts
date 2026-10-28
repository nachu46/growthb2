import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;
  const { id } = await params;

  try {
    const existing = db.prepare(`SELECT * FROM certifications WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Certification not found' }, { status: 404 });
    }

    const body = await req.json();
    const name = body.name !== undefined ? body.name : existing.name;
    const issuingOrg = body.issuingOrg !== undefined ? body.issuingOrg : existing.issuing_org;
    const certNumber = body.certNumber !== undefined ? body.certNumber : existing.cert_number;
    const description = body.description !== undefined ? body.description : existing.description;
    const displayOrder = body.displayOrder !== undefined ? body.displayOrder : existing.display_order;
    const status = body.status !== undefined ? body.status : existing.status;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;

    db.prepare(`
      UPDATE certifications
      SET name = ?, issuing_org = ?, cert_number = ?, description = ?, display_order = ?, status = ?, is_active = ?
      WHERE id = ?
    `).run(name, issuingOrg, certNumber, description, displayOrder, status, isActive, id);

    logAdminAction({
      adminEmail: user.email,
      action: 'UPDATE',
      entity: 'CERTIFICATION',
      entityId: id,
      metadata: { name, certNumber },
    });

    return NextResponse.json({ success: true, message: 'Certification updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update certification' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;
  const { id } = await params;

  try {
    const existing = db.prepare(`SELECT * FROM certifications WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Certification not found' }, { status: 404 });
    }

    db.prepare(`DELETE FROM certifications WHERE id = ?`).run(id);

    logAdminAction({
      adminEmail: user.email,
      action: 'DELETE',
      entity: 'CERTIFICATION',
      entityId: id,
      metadata: { name: existing.name },
    });

    return NextResponse.json({ success: true, message: 'Certification deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete certification' }, { status: 500 });
  }
}
