import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Stored outside public/ because `next start` only serves files that existed at build time;
// src/app/uploads/[...path]/route.ts serves these at /uploads/...
export const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/dwg',
  'application/octet-stream',
  'text/csv',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.xls', '.xlsx', '.csv', '.dwg'];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB max limit

export interface StorageUploadResult {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  originalName: string;
}

export const storage = {
  async upload(file: File, folder = '', allowedExtensions: string[] = ALLOWED_EXTENSIONS): Promise<StorageUploadResult> {
    const ext = path.extname(file.name).toLowerCase();
    const mimeType = file.type;

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds limit of 25MB`);
    }

    // Validate extension
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`File extension ${ext} is not allowed`);
    }

    // Sanitize and generate safe unique filename
    const hash = crypto.randomBytes(8).toString('hex');
    const safeBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeBaseName}_${Date.now()}_${hash}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let url: string;
    try {
      const targetDir = folder ? path.join(UPLOAD_DIR, folder) : UPLOAD_DIR;
      await fs.promises.mkdir(targetDir, { recursive: true });
      await fs.promises.writeFile(path.join(targetDir, filename), buffer);
      url = folder ? `/uploads/${folder}/${filename}` : `/uploads/${filename}`;
    } catch (err) {
      // Read-only filesystem (Vercel Serverless): embed the file as a data URL instead
      console.warn('Upload directory not writable, storing file inline as data URL.');
      url = `data:${mimeType || 'application/octet-stream'};base64,${buffer.toString('base64')}`;
    }

    return {
      filename,
      url,
      size: file.size,
      mimeType: mimeType || 'application/octet-stream',
      originalName: file.name,
    };
  },

  async delete(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl || !fileUrl.startsWith('/uploads/')) return false;
      const relativePath = fileUrl.replace('/uploads/', '');
      const filePath = path.resolve(UPLOAD_DIR, relativePath);
      if (!filePath.startsWith(UPLOAD_DIR + path.sep)) return false;
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting file:', err);
      return false;
    }
  },

  getUrl(fileUrl: string): string {
    if (!fileUrl) return '';
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl;
    }
    return fileUrl;
  },
};
