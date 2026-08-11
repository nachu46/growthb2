import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { storage } from '@/lib/storage';
import { logAdminAction } from '@/lib/audit';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;
  const { id } = await params;

  try {
    const existing = db.prepare(`SELECT * FROM company_logos WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Company logo not found' }, { status: 404 });
    }

    const contentType = req.headers.get('content-type') || '';
    let name = existing.name;
    let websiteUrl = existing.website_url;
    let description = existing.description;
    let vendorIdCode = existing.vendor_id_code;
    let displayOrder = existing.display_order;
    let isActive = existing.is_active;
    let logoUrl = existing.logo_url;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      if (formData.has('name')) name = formData.get('name') as string;
      if (formData.has('websiteUrl')) websiteUrl = formData.get('websiteUrl') as string;
      if (formData.has('description')) description = formData.get('description') as string;
      if (formData.has('vendorIdCode')) vendorIdCode = formData.get('vendorIdCode') as string;
      if (formData.has('displayOrder')) displayOrder = parseInt(formData.get('displayOrder') as string);
      if (formData.has('isActive')) isActive = formData.get('isActive') === 'true' || formData.get('isActive') === '1' ? 1 : 0;

      const file = formData.get('logoFile') as File | null;
      if (file) {
        // Delete previous uploaded file if local
        if (existing.logo_url && existing.logo_url.startsWith('/uploads/')) {
          await storage.delete(existing.logo_url);
        }
        const uploadResult = await storage.upload(file, 'logos');
        logoUrl = uploadResult.url;
      } else if (formData.has('logoUrl')) {
        logoUrl = formData.get('logoUrl') as string;
      }
    } else {
      const body = await req.json();
      if (body.name !== undefined) name = body.name;
      if (body.websiteUrl !== undefined) websiteUrl = body.websiteUrl;
      if (body.description !== undefined) description = body.description;
      if (body.vendorIdCode !== undefined) vendorIdCode = body.vendorIdCode;
      if (body.displayOrder !== undefined) displayOrder = body.displayOrder;
      if (body.isActive !== undefined) isActive = body.isActive ? 1 : 0;
      if (body.logoUrl !== undefined) logoUrl = body.logoUrl;
    }

    db.prepare(`
      UPDATE company_logos
      SET name = ?, logo_url = ?, website_url = ?, description = ?, vendor_id_code = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, logoUrl, websiteUrl, description, vendorIdCode, displayOrder, isActive, id);

    logAdminAction({
      adminEmail: user.email,
      action: 'UPDATE',
      entity: 'COMPANY_LOGO',
      entityId: id,
      metadata: { name, logoUrl, isActive },
    });

    return NextResponse.json({ success: true, message: 'Company logo updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update company logo' }, { status: 500 });
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
    const existing = db.prepare(`SELECT * FROM company_logos WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Company logo not found' }, { status: 404 });
    }

    if (existing.logo_url && existing.logo_url.startsWith('/uploads/')) {
      await storage.delete(existing.logo_url);
    }

    db.prepare(`DELETE FROM company_logos WHERE id = ?`).run(id);

    logAdminAction({
      adminEmail: user.email,
      action: 'DELETE',
      entity: 'COMPANY_LOGO',
      entityId: id,
      metadata: { name: existing.name },
    });

    return NextResponse.json({ success: true, message: 'Company logo deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete company logo' }, { status: 500 });
  }
}
