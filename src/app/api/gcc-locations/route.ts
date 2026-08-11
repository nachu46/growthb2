import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const locations = db.prepare(`
      SELECT * FROM gcc_locations
      WHERE is_active = 1
      ORDER BY display_order ASC
    `).all();

    return NextResponse.json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    console.error('Error fetching GCC locations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GCC locations' },
      { status: 500 }
    );
  }
}
