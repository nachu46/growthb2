import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

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

    const docs = db.prepare(`
      SELECT id, title, doc_type as docType, file_url as downloadUrl, file_size as fileSize, revision
      FROM product_documents
      WHERE product_id = ?
    `).all(product.id);

    const formattedProduct = {
      ...product,
      inStock: Boolean(product.in_stock),
      aramcoApproved: Boolean(product.aramco_approved),
      pricePerUnitEstimate: product.price_estimate,
      leadTime: product.lead_time,
      tempRange: product.temp_range,
      complianceBadges: ['ARAMCO SAES-N-001', 'ASTM C552', 'SABIC SPEC-M-801', 'ISO 9001 Facility'],
      fabricationForms: ['Rigid Block (Factory Flat)', 'Pre-Formed Pipe Shell (2-Piece)', 'Curved Segmental Ring'],
      thicknesses: ['25mm (1")', '50mm (2")', '75mm (3")', '100mm (4")', 'Custom CNC Cut'],
      physicalProperties: [
        { property: 'Apparent Density', testMethod: 'ASTM C303', performanceValue: product.density || '115 kg/m³' },
        { property: 'Compressive Strength', testMethod: 'ASTM C240', performanceValue: '≥ 600 kPa (Rigid Structural)' },
        { property: 'Thermal Conductivity (λ)', testMethod: 'ASTM C177 (+10°C)', performanceValue: '0.042 W/m·K' },
        { property: 'Water Vapor Permeability', testMethod: 'ASTM E96', performanceValue: '0.00 ng/Pa·s·m (100% Hermetic Barrier)' },
        { property: 'Reaction to Fire', testMethod: 'EN 13501-1', performanceValue: 'Euroclass A1 Non-Combustible', isRedHighlight: true },
        { property: 'Operating Temperature', testMethod: 'ASTM C411', performanceValue: product.temp_range || '-268°C to +430°C' },
      ],
      technicalDocs: docs,
    };

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
