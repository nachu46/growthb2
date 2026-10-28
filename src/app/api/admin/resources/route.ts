import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';
import { storage } from '@/lib/storage';
import { RESOURCE_EXTENSIONS, RESOURCE_FOLDERS, fileTypeFromName, formatFileSize } from '@/lib/resources';
import crypto from 'crypto';

const clip = (v: FormDataEntryValue | null, n = 200) => String(v ?? '').trim().slice(0, n);

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const resources = db.prepare(`SELECT * FROM resources ORDER BY folder ASC, display_order ASC, created_at DESC`).all();
    return NextResponse.json({ success: true, count: resources.length, data: resources, folders: RESOURCE_FOLDERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const fd = await req.formData();
    const file = fd.get('file');
    const folder = clip(fd.get('folder'), 120);
    let title = clip(fd.get('title'));

    if (!(RESOURCE_FOLDERS as readonly string[]).includes(folder)) {
      return NextResponse.json({ success: false, error: 'Please choose a library folder.' }, { status: 400 });
    }

    let fileUrl = '';
    let fileSize = '—';
    let fileType = 'PDF';
    if (file instanceof File && file.size > 0) {
      const uploaded = await storage.upload(file, 'resources', RESOURCE_EXTENSIONS);
      fileUrl = uploaded.url;
      fileSize = formatFileSize(file.size);
      fileType = fileTypeFromName(file.name);
      if (!title) title = uploaded.originalName.slice(0, 200);
    }

    if (!title) {
      return NextResponse.json({ success: false, error: 'Please upload a file or enter a document name.' }, { status: 400 });
    }

    const id = `res_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    db.prepare(`
      INSERT INTO resources (id, title, category, subtitle, folder, subfolder, file_type, revision_date, file_url, file_size, pdf_code, product_id, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      id,
      title,
      clip(fd.get('category'), 80) || folder,
      clip(fd.get('subtitle')),
      folder,
      clip(fd.get('subfolder'), 120),
      fileType,
      clip(fd.get('revisionDate'), 20) || new Date().toISOString().slice(0, 10),
      fileUrl,
      fileSize,
      clip(fd.get('pdfCode'), 60),
      clip(fd.get('productId'), 80) || null,
      Number(fd.get('displayOrder')) || 0
    );

    logAdminAction({
      adminEmail: user.email,
      action: 'CREATE',
      entity: 'RESOURCE',
      entityId: id,
      metadata: { title, folder, hasFile: Boolean(fileUrl) },
    });

    return NextResponse.json({ success: true, id, message: 'Document added to the library.' });
  } catch (error: any) {
    const known = /not allowed|exceeds limit/i.test(error?.message || '');
    return NextResponse.json({ success: false, error: known ? error.message : 'Failed to add document' }, { status: known ? 400 : 500 });
  }
}
