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
    const existing = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const body = await req.json();

    const name = body.name !== undefined ? body.name : existing.name;
    const pillar = body.pillar !== undefined ? body.pillar : existing.pillar;
    const industry = body.industry !== undefined ? body.industry : existing.industry;
    const tempRange = body.tempRange !== undefined ? body.tempRange : existing.temp_range;
    const density = body.density !== undefined ? body.density : existing.density;
    const compliance = body.compliance !== undefined ? body.compliance : existing.compliance;
    const description = body.description !== undefined ? body.description : existing.description;
    const inStock = body.inStock !== undefined ? (body.inStock ? 1 : 0) : existing.in_stock;
    const leadTime = body.leadTime !== undefined ? body.leadTime : existing.lead_time;
    const unit = body.unit !== undefined ? body.unit : existing.unit;
    const priceEstimate = body.priceEstimate !== undefined ? body.priceEstimate : existing.price_estimate;
    const aramcoApproved = body.aramcoApproved !== undefined ? (body.aramcoApproved ? 1 : 0) : existing.aramco_approved;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;
    const displayOrder = body.displayOrder !== undefined ? body.displayOrder : existing.display_order;

    db.prepare(`
      UPDATE products
      SET name = ?, pillar = ?, industry = ?, temp_range = ?, density = ?, compliance = ?, description = ?, in_stock = ?, lead_time = ?, unit = ?, price_estimate = ?, aramco_approved = ?, is_active = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, pillar, industry, tempRange, density, compliance, description, inStock, leadTime, unit, priceEstimate, aramcoApproved, isActive, displayOrder, id);

    logAdminAction({
      adminEmail: user.email,
      action: 'UPDATE',
      entity: 'PRODUCT',
      entityId: id,
      metadata: { name, isActive },
    });

    return NextResponse.json({ success: true, message: 'Product updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update product' }, { status: 500 });
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
    const existing = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    db.prepare(`DELETE FROM products WHERE id = ?`).run(id);

    logAdminAction({
      adminEmail: user.email,
      action: 'DELETE',
      entity: 'PRODUCT',
      entityId: id,
      metadata: { name: existing.name },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
