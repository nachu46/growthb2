import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { storage } from '@/lib/storage';
import { logAdminAction } from '@/lib/audit';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const logos = db.prepare(`SELECT * FROM company_logos ORDER BY display_order ASC, created_at DESC`).all();
    return NextResponse.json({ success: true, count: logos.length, data: logos });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch company logos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const contentType = req.headers.get('content-type') || '';
    let name = '';
    let websiteUrl = '';
    let description = '';
    let vendorIdCode = '';
    let displayOrder = 0;
    let logoUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      name = (formData.get('name') as string) || '';
      websiteUrl = (formData.get('websiteUrl') as string) || '';
      description = (formData.get('description') as string) || '';
      vendorIdCode = (formData.get('vendorIdCode') as string) || '';
      displayOrder = parseInt((formData.get('displayOrder') as string) || '0');

      const file = formData.get('logoFile') as File | null;
      if (file) {
        const uploadResult = await storage.upload(file, 'logos');
        logoUrl = uploadResult.url;
      } else {
        logoUrl = (formData.get('logoUrl') as string) || '';
      }
    } else {
      const body = await req.json();
      name = body.name || '';
      websiteUrl = body.websiteUrl || '';
      description = body.description || '';
      vendorIdCode = body.vendorIdCode || '';
      displayOrder = body.displayOrder || 0;
      logoUrl = body.logoUrl || '';
    }

    if (!name || !logoUrl) {
      return NextResponse.json({ success: false, error: 'Company Name and Logo are required.' }, { status: 400 });
    }

    const id = `comp_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    db.prepare(`
      INSERT INTO company_logos (id, name, logo_url, website_url, description, vendor_id_code, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(id, name, logoUrl, websiteUrl, description, vendorIdCode, displayOrder);

    logAdminAction({
      adminEmail: user.email,
      action: 'CREATE',
      entity: 'COMPANY_LOGO',
      entityId: id,
      metadata: { name, logoUrl },
    });

    return NextResponse.json({ success: true, id, message: 'Company logo added successfully.' });
  } catch (error: any) {
    console.error('Error adding company logo:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to add company logo' }, { status: 500 });
  }
}
