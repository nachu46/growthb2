import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const resources = db.prepare(`
      SELECT * FROM resources
      WHERE is_active = 1
      ORDER BY display_order ASC
    `).all();

    return NextResponse.json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}
