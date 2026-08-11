import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { storage } from '@/lib/storage';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const customerName = (formData.get('customerName') as string) || 'Valued Client';
    const company = (formData.get('company') as string) || 'EPC Partner';
    const email = (formData.get('email') as string) || 'client@epc.com';
    const phone = (formData.get('phone') as string) || '+971-50-000-0000';
    const projectName = (formData.get('projectName') as string) || 'GCC Industrial Expansion';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Secure File Upload via Storage Abstraction Layer
    const uploadResult = await storage.upload(file, 'bom_submissions');

    const bomId = `bom_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    db.prepare(`
      INSERT INTO bom_submissions (id, customer_name, company, email, phone, project_name, file_url, file_name, file_size, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review')
    `).run(
      bomId,
      customerName,
      company,
      email,
      phone,
      projectName,
      uploadResult.url,
      uploadResult.originalName,
      fileSizeFormatted
    );

    return NextResponse.json({
      success: true,
      bomId,
      fileUrl: uploadResult.url,
      message: 'BOM File uploaded and submitted to Growth International Engineering Desk successfully.',
    });
  } catch (error: any) {
    console.error('Error uploading BOM file:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload BOM file' },
      { status: 500 }
    );
  }
}
