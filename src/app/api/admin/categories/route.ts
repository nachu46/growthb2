import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';
import { storage } from '@/lib/storage';
import { sanitizeUrl } from '@/lib/products';
import crypto from 'crypto';
import { CATEGORY_IMAGE_EXTENSIONS, itemsFromText } from '@/lib/categories';

const clip = (v: FormDataEntryValue | null, n = 200) => String(v ?? '').trim().slice(0, n);


export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const rows = db.prepare(`
      SELECT c.*, (SELECT count(*) FROM products p WHERE lower(p.pillar) = lower(c.slug)) AS product_count
      FROM product_categories c
      ORDER BY c.display_order ASC, c.name ASC
    `).all();
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const fd = await req.formData();
    const name = clip(fd.get('name'), 80);
    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
    }

    let slug = (clip(fd.get('slug'), 40) || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    if (!slug) slug = `category-${crypto.randomBytes(2).toString('hex')}`;
    if (db.prepare(`SELECT 1 FROM product_categories WHERE slug = ?`).get(slug)) {
      return NextResponse.json({ success: false, error: `A category with the key "${slug}" already exists.` }, { status: 409 });
    }

    let imageUrl = sanitizeUrl(fd.get('imageUrl'));
    const file = fd.get('image');
    if (file instanceof File && file.size > 0) {
      imageUrl = (await storage.upload(file, 'categories', CATEGORY_IMAGE_EXTENSIONS)).url;
    }

    const id = `cat_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO product_categories (id, slug, name, description, items, image_url, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      slug,
      name,
      clip(fd.get('description'), 200),
      itemsFromText(fd.get('items')),
      imageUrl,
      Number(fd.get('displayOrder')) || 0,
      fd.get('isActive') === 'false' ? 0 : 1
    );

    logAdminAction({ adminEmail: user.email, action: 'CREATE', entity: 'CATEGORY', entityId: id, metadata: { name, slug } });

    return NextResponse.json({ success: true, id, slug, message: 'Category created.' });
  } catch (error: any) {
    const known = /not allowed|exceeds limit/i.test(error?.message || '');
    return NextResponse.json({ success: false, error: known ? error.message : 'Failed to create category' }, { status: known ? 400 : 500 });
  }
}
