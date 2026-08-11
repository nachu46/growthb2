import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const certs = db.prepare(`
      SELECT * FROM certifications
      WHERE is_active = 1
      ORDER BY display_order ASC
    `).all();

    const projects = db.prepare(`
      SELECT * FROM project_history
      WHERE is_active = 1
      ORDER BY display_order ASC
    `).all();

    return NextResponse.json({
      success: true,
      certifications: certs,
      projects: projects,
    });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}
