import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { formatProduct } from '@/lib/products';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = db.prepare(`
      SELECT * FROM products
      WHERE (id = ? OR slug = ?) AND is_active = 1
    `).get(id, id) as any;

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Documents are managed in Admin → Resources and linked to a product
    const docs = (db.prepare(`
      SELECT id, subtitle, title, file_type, file_url, file_size, revision_date
      FROM resources
      WHERE product_id = ? AND is_active = 1
      ORDER BY display_order ASC
    `).all(product.id) as any[]).map((d) => ({
      id: d.id,
      title: d.subtitle || d.title,
      fileName: d.title,
      docType: d.file_type || 'PDF',
      downloadUrl: d.file_url || '',
      fileSize: d.file_size,
      revision: d.revision_date ? `Rev. ${new Date(d.revision_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}` : '',
    }));

    const formattedProduct = { ...formatProduct(product), technicalDocs: docs };

    return NextResponse.json({
      success: true,
      product: formattedProduct,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
