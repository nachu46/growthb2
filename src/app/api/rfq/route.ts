import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, company, email, phone, country, items, quantity, materialPillar, deliveryHub, message } = body;

    if (!customerName || !company || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer contact details.' },
        { status: 400 }
      );
    }

    const rfqId = `rfq_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const productsJson = JSON.stringify(items || []);

    db.prepare(`
      INSERT INTO rfq_requests (id, customer_name, company, email, phone, country, products_json, quantity, material_pillar, delivery_hub, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `).run(
      rfqId,
      customerName,
      company,
      email,
      phone,
      country || 'UAE',
      productsJson,
      quantity || '',
      materialPillar || '',
      deliveryHub || '',
      message || ''
    );

    return NextResponse.json({
      success: true,
      rfqId,
      message: 'RFQ inquiry submitted successfully. Growth International Sales Team will respond within 15 minutes.',
    });
  } catch (error) {
    console.error('Error processing RFQ submission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process RFQ inquiry' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rfqs = db.prepare(`SELECT * FROM rfq_requests ORDER BY created_at DESC`).all();
    return NextResponse.json({ success: true, count: rfqs.length, data: rfqs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch RFQs' }, { status: 500 });
  }
}
