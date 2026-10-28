import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';
import { listToJson, normalizeStockLevel, propertiesToJson, sanitizeUrl } from '@/lib/products';
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
    const { name, pillar, industry, tempRange, density, compliance, description, inStock, leadTime, unit, priceEstimate, aramcoApproved, displayOrder, manufacturer, stockLevel, stockHub, imageUrl, complianceBadges, fabricationForms, thicknesses, physicalProperties } = body;

    if (!name || !pillar || !industry) {
      return NextResponse.json({ success: false, error: 'Name, Pillar, and Industry are required.' }, { status: 400 });
    }

    const id = `prod_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    let slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Keep slugs unique so product URLs never collide
    if (db.prepare(`SELECT 1 FROM products WHERE slug = ?`).get(slug)) slug = `${slug}-${crypto.randomBytes(2).toString('hex')}`;

    db.prepare(`
      INSERT INTO products (id, slug, name, pillar, industry, temp_range, density, compliance, description, in_stock, lead_time, unit, price_estimate, aramco_approved, display_order, is_active,
        manufacturer, stock_level, stock_hub, image_url, compliance_badges, fabrication_forms, thicknesses, physical_properties)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)
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
      displayOrder || 0,
      String(manufacturer || '').slice(0, 120),
      normalizeStockLevel(stockLevel),
      String(stockHub || '').slice(0, 120),
      sanitizeUrl(imageUrl),
      listToJson(complianceBadges),
      listToJson(fabricationForms),
      listToJson(thicknesses),
      propertiesToJson(physicalProperties)
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
