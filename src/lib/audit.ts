import db from './db';
import crypto from 'crypto';

export interface AuditLogEntry {
  adminEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'UPLOAD' | 'STATUS_CHANGE' | 'REORDER' | 'LOGIN' | 'LOGOUT';
  entity: string;
  entityId?: string;
  metadata?: any;
}

export function logAdminAction(entry: AuditLogEntry) {
  try {
    const id = `log_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    db.prepare(`
      INSERT INTO audit_logs (id, admin_email, action, entity, entity_id, metadata_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      entry.adminEmail,
      entry.action,
      entry.entity,
      entry.entityId || null,
      entry.metadata ? JSON.stringify(entry.metadata) : null
    );
  } catch (err) {
    console.error('Failed to log audit action:', err);
  }
}
