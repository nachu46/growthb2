import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const partners = db.prepare(`SELECT * FROM supply_partners ORDER BY display_order ASC, created_at DESC`).all();
    return NextResponse.json({ success: true, count: partners.length, data: partners });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch supply partners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const body = await req.json();
    const { name, websiteUrl, description, displayOrder } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Partner Name is required.' }, { status: 400 });
    }

    const id = `sp_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    db.prepare(`
      INSERT INTO supply_partners (id, name, website_url, description, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(id, name, websiteUrl || '', description || '', displayOrder || 0);

    logAdminAction({
      adminEmail: user.email,
      action: 'CREATE',
      entity: 'SUPPLY_PARTNER',
      entityId: id,
      metadata: { name },
    });

    return NextResponse.json({ success: true, id, message: 'Supply Partner added successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to add supply partner' }, { status: 500 });
  }
}
