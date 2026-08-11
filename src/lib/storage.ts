import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

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
  async upload(file: File, folder = ''): Promise<StorageUploadResult> {
    const ext = path.extname(file.name).toLowerCase();
    const mimeType = file.type;

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds limit of 25MB`);
    }

    // Validate extension
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(`File extension ${ext} is not allowed`);
    }

    // Sanitize and generate safe unique filename
    const hash = crypto.randomBytes(8).toString('hex');
    const safeBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeBaseName}_${Date.now()}_${hash}${ext}`;

    const targetDir = folder ? path.join(UPLOAD_DIR, folder) : UPLOAD_DIR;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.promises.writeFile(filePath, buffer);

    const relativeUrl = folder ? `/uploads/${folder}/${filename}` : `/uploads/${filename}`;

    return {
      filename,
      url: relativeUrl,
      size: file.size,
      mimeType: mimeType || 'application/octet-stream',
      originalName: file.name,
    };
  },

  async delete(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl || !fileUrl.startsWith('/uploads/')) return false;
      const relativePath = fileUrl.replace('/uploads/', '');
      const filePath = path.join(UPLOAD_DIR, relativePath);
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
