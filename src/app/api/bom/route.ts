import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { storage } from '@/lib/storage';
import { rateLimit } from '@/lib/rateLimit';
import crypto from 'crypto';

const BOM_EXTENSIONS = ['.xlsx', '.xls', '.csv', '.pdf', '.dwg'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v: FormDataEntryValue | null, n: number) => String(v ?? '').trim().slice(0, n);

export async function POST(req: NextRequest) {
  // 5 uploads per visitor per 10 minutes is plenty for genuine buyers
  if (!rateLimit(req, 'bom', 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { success: false, error: 'Too many uploads. Please wait a few minutes or contact us on WhatsApp.' },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const email = clip(formData.get('email'), 200);
    const targetQuarter = clip(formData.get('targetQuarter'), 20);
    const customerName = clip(formData.get('customerName'), 200) || 'Not provided';
    const company = clip(formData.get('company'), 200) || 'Not provided';
    const phone = clip(formData.get('phone'), 50) || 'Not provided';
    const projectName = clip(formData.get('projectName'), 200);

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, error: 'Please attach your BOM file.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid procurement officer email.' }, { status: 400 });
    }
    if (!/^Q[1-4] \d{4}$/.test(targetQuarter)) {
      return NextResponse.json({ success: false, error: 'Please choose a target delivery quarter.' }, { status: 400 });
    }

    // Saved under data/uploads/bom_submissions — only downloadable by a logged-in admin
    const uploadResult = await storage.upload(file, 'bom_submissions', BOM_EXTENSIONS);

    const bomId = `bom_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const fileSizeFormatted = file.size >= 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    db.prepare(`
      INSERT INTO bom_submissions (id, customer_name, company, email, phone, project_name, file_url, file_name, file_size, status, target_quarter)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review', ?)
    `).run(
      bomId,
      customerName,
      company,
      email,
      phone,
      projectName,
      uploadResult.url,
      uploadResult.originalName.slice(0, 200),
      fileSizeFormatted,
      targetQuarter
    );

    return NextResponse.json({
      success: true,
      bomId,
      fileName: uploadResult.originalName,
      message: 'BOM received. Our engineering desk will reply to your email within 2-4 hours.',
    });
  } catch (error: any) {
    console.error('Error uploading BOM file:', error);
    const known = /not allowed|exceeds limit/i.test(error?.message || '');
    return NextResponse.json(
      { success: false, error: known ? error.message : 'Failed to upload BOM file' },
      { status: known ? 400 : 500 }
    );
  }
}
