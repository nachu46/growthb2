import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pillar = searchParams.get('pillar');
    const industry = searchParams.get('industry');
    const query = searchParams.get('q');

    let sql = `SELECT * FROM products WHERE is_active = 1`;
    const params: any[] = [];

    if (pillar && pillar !== 'all') {
      sql += ` AND LOWER(pillar) = LOWER(?)`;
      params.push(pillar);
    }

    if (industry && industry !== 'all') {
      sql += ` AND LOWER(industry) = LOWER(?)`;
      params.push(industry);
    }

    if (query) {
      sql += ` AND (LOWER(name) LIKE ? OR LOWER(compliance) LIKE ? OR LOWER(description) LIKE ?)`;
      const qLower = `%${query.toLowerCase()}%`;
      params.push(qLower, qLower, qLower);
    }

    sql += ` ORDER BY display_order ASC, created_at DESC`;

    const products = db.prepare(sql).all(...params);

    const categories = db.prepare(`SELECT * FROM product_categories WHERE is_active = 1 ORDER BY display_order ASC`).all();
    const industriesList = db.prepare(`SELECT * FROM industries WHERE is_active = 1 ORDER BY display_order ASC`).all();

    // Transform boolean flags for client representation
    const formattedProducts = products.map((p: any) => ({
      ...p,
      inStock: Boolean(p.in_stock),
      aramcoApproved: Boolean(p.aramco_approved),
      pricePerUnitEstimate: p.price_estimate,
      leadTime: p.lead_time,
      tempRange: p.temp_range,
    }));

    return NextResponse.json({
      success: true,
      count: formattedProducts.length,
      pillars: categories.map((c: any) => ({ id: c.name, label: c.name })),
      industries: industriesList.map((i: any) => ({ id: i.name, label: i.name })),
      products: formattedProducts,
    });
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
