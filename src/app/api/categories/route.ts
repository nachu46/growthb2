import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { formatCategoryRow } from '@/data/categories';

export async function GET() {
  try {
    const rows = db.prepare(`SELECT * FROM product_categories WHERE is_active = 1 ORDER BY display_order ASC, name ASC`).all();
    return NextResponse.json({ success: true, categories: (rows as any[]).map(formatCategoryRow) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}
