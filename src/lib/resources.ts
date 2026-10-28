// Folder structure of the Tech Resources library (Figma "Library Directory")
export const RESOURCE_FOLDERS = [
  'Material Specifications (TDS)',
  'Safety Data Sheets (SDS)',
  'Installation Guides',
  'ASTM Compliance Audits',
  'EPC Registration Certificates',
] as const;

export const RESOURCE_EXTENSIONS = ['.pdf', '.xlsx', '.xls', '.csv', '.dwg', '.zip', '.png', '.jpg', '.jpeg', '.webp'];

export function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function fileTypeFromName(name: string): string {
  const ext = name.slice(name.lastIndexOf('.') + 1).toUpperCase();
  return ext && ext.length <= 5 ? ext : 'FILE';
}
