import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';
import crypto from 'crypto';

const clip = (v: unknown, n = 300) => String(v ?? '').trim().slice(0, n);

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const projects = db.prepare(`SELECT * FROM project_history ORDER BY display_order ASC, created_at DESC`).all();
    return NextResponse.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch project history' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const body = await req.json();
    const { projectName, client, country, industry, year, scope, description, status, displayOrder } = body;

    if (!projectName || !client || !country || !industry || !scope) {
      return NextResponse.json({ success: false, error: 'Project name, client, location, sector and materials supplied are required.' }, { status: 400 });
    }

    const id = `proj_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    db.prepare(`
      INSERT INTO project_history (id, project_name, client, country, industry, year, scope, description, status, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(id, clip(projectName, 200), clip(client, 200), clip(country, 120), clip(industry, 120), clip(year || new Date().getFullYear(), 10), clip(scope), clip(description, 1000), clip(status || 'Completed', 40), Number(displayOrder) || 0);

    logAdminAction({
      adminEmail: user.email,
      action: 'CREATE',
      entity: 'PROJECT_HISTORY',
      entityId: id,
      metadata: { projectName },
    });

    return NextResponse.json({ success: true, id, message: 'Project added successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to add project' }, { status: 500 });
  }
}
