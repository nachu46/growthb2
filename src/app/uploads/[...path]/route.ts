import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '@/lib/storage';
import { getAdminUserFromRequest } from '@/lib/auth';

// Customer BOM files are private: only a logged-in admin may download them
const PRIVATE_FOLDERS = ['bom_submissions'];

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.csv': 'text/csv',
  '.dwg': 'application/acad',
  '.zip': 'application/zip',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  if (PRIVATE_FOLDERS.includes(segments[0]) && !getAdminUserFromRequest(req)) {
    return new NextResponse('Not Found', { status: 404 });
  }
  const filePath = path.resolve(UPLOAD_DIR, ...segments);

  if (!filePath.startsWith(UPLOAD_DIR + path.sep) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const data = await fs.promises.readFile(filePath);

  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Content-Length': String(data.length),
      'Cache-Control': PRIVATE_FOLDERS.includes(segments[0]) ? 'private, no-store' : 'public, max-age=86400',
      // Uploaded SVGs could carry scripts; never let them execute in our origin
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
