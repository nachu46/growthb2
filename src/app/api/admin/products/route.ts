import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const products = db.prepare(`SELECT * FROM products ORDER BY display_order ASC, created_at DESC`).all();
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const body = await req.json();
    const { name, pillar, industry, tempRange, density, compliance, description, inStock, leadTime, unit, priceEstimate, aramcoApproved, displayOrder } = body;

    if (!name || !pillar || !industry) {
      return NextResponse.json({ success: false, error: 'Name, Pillar, and Industry are required.' }, { status: 400 });
    }

    const id = `prod_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    db.prepare(`
      INSERT INTO products (id, slug, name, pillar, industry, temp_range, density, compliance, description, in_stock, lead_time, unit, price_estimate, aramco_approved, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      id,
      slug,
      name,
      pillar,
      industry,
      tempRange || 'N/A',
      density || 'Standard',
      compliance || 'ASTM Compliant',
      description || '',
      inStock ? 1 : 0,
      leadTime || 'Immediate Dispatch',
      unit || 'Sqm',
      priceEstimate || 0,
      aramcoApproved ? 1 : 0,
      displayOrder || 0
    );

    logAdminAction({
      adminEmail: user.email,
      action: 'CREATE',
      entity: 'PRODUCT',
      entityId: id,
      metadata: { name, slug, pillar },
    });

    return NextResponse.json({ success: true, id, slug, message: 'Product created successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
