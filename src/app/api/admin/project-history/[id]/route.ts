import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';

const clip = (v: unknown, n = 300) => String(v ?? '').trim().slice(0, n);

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;
  const { id } = await params;

  try {
    const existing = db.prepare(`SELECT * FROM project_history WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const body = await req.json();
    const projectName = body.projectName !== undefined ? clip(body.projectName, 200) : existing.project_name;
    const client = body.client !== undefined ? clip(body.client, 200) : existing.client;
    const country = body.country !== undefined ? clip(body.country, 120) : existing.country;
    const industry = body.industry !== undefined ? clip(body.industry, 120) : existing.industry;
    const year = body.year !== undefined ? clip(body.year, 10) : existing.year;
    const scope = body.scope !== undefined ? clip(body.scope) : existing.scope;
    const description = body.description !== undefined ? clip(body.description, 1000) : existing.description;
    const status = body.status !== undefined ? clip(body.status, 40) : existing.status;
    const displayOrder = body.displayOrder !== undefined ? Number(body.displayOrder) || 0 : existing.display_order;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;

    db.prepare(`
      UPDATE project_history
      SET project_name = ?, client = ?, country = ?, industry = ?, year = ?, scope = ?, description = ?, status = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(projectName, client, country, industry, year, scope, description, status, displayOrder, isActive, id);

    logAdminAction({
      adminEmail: user.email,
      action: 'UPDATE',
      entity: 'PROJECT_HISTORY',
      entityId: id,
      metadata: { projectName, isActive },
    });

    return NextResponse.json({ success: true, message: 'Project updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;
  const { id } = await params;

  try {
    const existing = db.prepare(`SELECT * FROM project_history WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    db.prepare(`DELETE FROM project_history WHERE id = ?`).run(id);

    logAdminAction({
      adminEmail: user.email,
      action: 'DELETE',
      entity: 'PROJECT_HISTORY',
      entityId: id,
      metadata: { projectName: existing.project_name },
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
