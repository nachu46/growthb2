import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const logos = db.prepare(`
      SELECT * FROM company_logos
      WHERE is_active = 1
      ORDER BY display_order ASC, created_at DESC
    `).all();

    return NextResponse.json({
      success: true,
      count: logos.length,
      data: logos,
    });
  } catch (error) {
    console.error('Error fetching company logos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company logos' },
      { status: 500 }
    );
  }
}
