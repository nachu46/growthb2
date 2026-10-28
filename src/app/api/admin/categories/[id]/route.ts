import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';
import { storage } from '@/lib/storage';
import { sanitizeUrl } from '@/lib/products';
import { CATEGORY_IMAGE_EXTENSIONS, itemsFromText } from '@/lib/categories';

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
    const existing = db.prepare(`SELECT * FROM product_categories WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const fd = await req.formData();
    const has = (k: string) => fd.has(k);
    const name = has('name') ? clip(fd.get('name'), 80) : existing.name;
    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
    }

    let imageUrl = has('imageUrl') ? sanitizeUrl(fd.get('imageUrl')) : existing.image_url;
    const file = fd.get('image');
    if (file instanceof File && file.size > 0) {
      imageUrl = (await storage.upload(file, 'categories', CATEGORY_IMAGE_EXTENSIONS)).url;
    }
    if (existing.image_url && existing.image_url !== imageUrl && existing.image_url.startsWith('/uploads/categories/')) {
      await storage.delete(existing.image_url);
    }

    // The key (slug) is fixed: products reference it, so renaming only changes the display name
    db.prepare(`
      UPDATE product_categories
      SET name = ?, description = ?, items = ?, image_url = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      name,
      has('description') ? clip(fd.get('description'), 200) : existing.description,
      has('items') ? itemsFromText(fd.get('items')) : existing.items,
      imageUrl || '',
      has('displayOrder') ? Number(fd.get('displayOrder')) || 0 : existing.display_order,
      has('isActive') ? (fd.get('isActive') === 'false' ? 0 : 1) : existing.is_active,
      id
    );

    logAdminAction({ adminEmail: user.email, action: 'UPDATE', entity: 'CATEGORY', entityId: id, metadata: { name } });

    return NextResponse.json({ success: true, message: 'Category updated.' });
  } catch (error: any) {
    const known = /not allowed|exceeds limit/i.test(error?.message || '');
    return NextResponse.json({ success: false, error: known ? error.message : 'Failed to update category' }, { status: known ? 400 : 500 });
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
    const existing = db.prepare(`SELECT * FROM product_categories WHERE id = ?`).get(id) as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const inUse = (db.prepare(`SELECT count(*) as count FROM products WHERE lower(pillar) = lower(?)`).get(existing.slug) as any).count;
    if (inUse > 0) {
      return NextResponse.json(
        { success: false, error: `${inUse} product(s) still use "${existing.name}". Move them to another category or hide this category instead.` },
        { status: 409 }
      );
    }

    db.prepare(`DELETE FROM product_categories WHERE id = ?`).run(id);
    if (existing.image_url && existing.image_url.startsWith('/uploads/categories/')) await storage.delete(existing.image_url);

    logAdminAction({ adminEmail: user.email, action: 'DELETE', entity: 'CATEGORY', entityId: id, metadata: { name: existing.name } });

    return NextResponse.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
