import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';
import { storage } from '@/lib/storage';
import { RESOURCE_EXTENSIONS, RESOURCE_FOLDERS, fileTypeFromName, formatFileSize } from '@/lib/resources';

const clip = (v: FormDataEntryValue | null, n = 200) => String(v ?? '').trim().slice(0, n);

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;
  const { id } = await params;

  try {
    const existing = db.prepare(`SELECT * FROM resources WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const fd = await req.formData();
    const has = (k: string) => fd.has(k);

    const folder = has('folder') ? clip(fd.get('folder'), 120) : existing.folder;
    if (!(RESOURCE_FOLDERS as readonly string[]).includes(folder)) {
      return NextResponse.json({ success: false, error: 'Please choose a library folder.' }, { status: 400 });
    }

    let fileUrl = existing.file_url;
    let fileSize = existing.file_size;
    let fileType = existing.file_type;
    let title = has('title') ? clip(fd.get('title')) : existing.title;

    const file = fd.get('file');
    if (file instanceof File && file.size > 0) {
      const uploaded = await storage.upload(file, 'resources', RESOURCE_EXTENSIONS);
      if (existing.file_url && existing.file_url.startsWith('/uploads/')) await storage.delete(existing.file_url);
      fileUrl = uploaded.url;
      fileSize = formatFileSize(file.size);
      fileType = fileTypeFromName(file.name);
      if (!title) title = uploaded.originalName.slice(0, 200);
    }

    db.prepare(`
      UPDATE resources
      SET title = ?, category = ?, subtitle = ?, folder = ?, subfolder = ?, file_type = ?, revision_date = ?, file_url = ?, file_size = ?, pdf_code = ?, product_id = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      title || existing.title,
      has('category') ? clip(fd.get('category'), 80) || folder : existing.category,
      has('subtitle') ? clip(fd.get('subtitle')) : existing.subtitle,
      folder,
      has('subfolder') ? clip(fd.get('subfolder'), 120) : existing.subfolder,
      fileType,
      has('revisionDate') ? clip(fd.get('revisionDate'), 20) : existing.revision_date,
      fileUrl,
      fileSize,
      has('pdfCode') ? clip(fd.get('pdfCode'), 60) : existing.pdf_code,
      has('productId') ? clip(fd.get('productId'), 80) || null : existing.product_id,
      has('displayOrder') ? Number(fd.get('displayOrder')) || 0 : existing.display_order,
      has('isActive') ? (fd.get('isActive') === 'true' ? 1 : 0) : existing.is_active,
      id
    );

    logAdminAction({
      adminEmail: user.email,
      action: 'UPDATE',
      entity: 'RESOURCE',
      entityId: id,
      metadata: { title, folder },
    });

    return NextResponse.json({ success: true, message: 'Document updated.' });
  } catch (error: any) {
    const known = /not allowed|exceeds limit/i.test(error?.message || '');
    return NextResponse.json({ success: false, error: known ? error.message : 'Failed to update document' }, { status: known ? 400 : 500 });
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
    const existing = db.prepare(`SELECT * FROM resources WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    db.prepare(`DELETE FROM resources WHERE id = ?`).run(id);
    if (existing.file_url && existing.file_url.startsWith('/uploads/')) await storage.delete(existing.file_url);

    logAdminAction({
      adminEmail: user.email,
      action: 'DELETE',
      entity: 'RESOURCE',
      entityId: id,
      metadata: { title: existing.title },
    });

    return NextResponse.json({ success: true, message: 'Document deleted.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete document' }, { status: 500 });
  }
}
