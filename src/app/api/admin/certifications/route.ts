import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const certs = db.prepare(`SELECT * FROM certifications ORDER BY display_order ASC, created_at DESC`).all();
    return NextResponse.json({ success: true, count: certs.length, data: certs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const body = await req.json();
    const { name, issuingOrg, certNumber, description, displayOrder } = body;

    if (!name || !issuingOrg || !certNumber) {
      return NextResponse.json({ success: false, error: 'Name, Issuing Organization and Certificate Number are required.' }, { status: 400 });
    }

    const id = `cert_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    db.prepare(`
      INSERT INTO certifications (id, name, issuing_org, cert_number, description, display_order, status, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 'Active', 1)
    `).run(id, name, issuingOrg, certNumber, description || '', displayOrder || 0);

    logAdminAction({
      adminEmail: user.email,
      action: 'CREATE',
      entity: 'CERTIFICATION',
      entityId: id,
      metadata: { name, certNumber },
    });

    return NextResponse.json({ success: true, id, message: 'Certification added successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to add certification' }, { status: 500 });
  }
}
