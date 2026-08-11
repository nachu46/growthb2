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
    const existing = db.prepare(`SELECT * FROM supply_partners WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Supply Partner not found' }, { status: 404 });
    }

    const body = await req.json();
    const name = body.name !== undefined ? body.name : existing.name;
    const websiteUrl = body.websiteUrl !== undefined ? body.websiteUrl : existing.website_url;
    const description = body.description !== undefined ? body.description : existing.description;
    const displayOrder = body.displayOrder !== undefined ? body.displayOrder : existing.display_order;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;

    db.prepare(`
      UPDATE supply_partners
      SET name = ?, website_url = ?, description = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(name, websiteUrl, description, displayOrder, isActive, id);

    logAdminAction({
      adminEmail: user.email,
      action: 'UPDATE',
      entity: 'SUPPLY_PARTNER',
      entityId: id,
      metadata: { name, isActive },
    });

    return NextResponse.json({ success: true, message: 'Supply Partner updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update supply partner' }, { status: 500 });
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
    const existing = db.prepare(`SELECT * FROM supply_partners WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Supply Partner not found' }, { status: 404 });
    }

    db.prepare(`DELETE FROM supply_partners WHERE id = ?`).run(id);

    logAdminAction({
      adminEmail: user.email,
      action: 'DELETE',
      entity: 'SUPPLY_PARTNER',
      entityId: id,
      metadata: { name: existing.name },
    });

    return NextResponse.json({ success: true, message: 'Supply Partner deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete supply partner' }, { status: 500 });
  }
}
