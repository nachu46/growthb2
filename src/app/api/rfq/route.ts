import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  if (!rateLimit(req, 'rfq', 20, 10 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { customerName, company, email, phone, country, items, quantity, materialPillar, deliveryHub, message } = body;

    // WhatsApp-initiated RFQs carry no contact form; the customer's number arrives in the WhatsApp chat
    if (!company && !(Array.isArray(items) && items.length) && !materialPillar) {
      return NextResponse.json(
        { success: false, error: 'RFQ must include a company or requested materials.' },
        { status: 400 }
      );
    }

    const rfqId = `rfq_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const productsJson = JSON.stringify(Array.isArray(items) ? items.slice(0, 100) : []);

    db.prepare(`
      INSERT INTO rfq_requests (id, customer_name, company, email, phone, country, products_json, quantity, material_pillar, delivery_hub, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `).run(
      rfqId,
      String(customerName || 'WhatsApp Lead').slice(0, 200),
      String(company || 'Not provided').slice(0, 200),
      String(email || '—').slice(0, 200),
      String(phone || 'Via WhatsApp').slice(0, 50),
      String(country || 'UAE').slice(0, 60),
      productsJson,
      String(quantity || '').slice(0, 100),
      String(materialPillar || '').slice(0, 100),
      String(deliveryHub || '').slice(0, 120),
      String(message || '').slice(0, 1000)
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
