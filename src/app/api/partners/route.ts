import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const partners = db.prepare(`
      SELECT * FROM supply_partners
      WHERE is_active = 1
      ORDER BY display_order ASC, created_at DESC
    `).all();

    return NextResponse.json({
      success: true,
      count: partners.length,
      data: partners,
    });
  } catch (error) {
    console.error('Error fetching supply partners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch supply partners' },
      { status: 500 }
    );
  }
}
