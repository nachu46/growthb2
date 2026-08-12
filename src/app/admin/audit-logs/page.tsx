'use client';

import React, { useEffect, useState } from 'react';
import { History, ShieldCheck, User } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
          Admin Audit Logs History
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
          Immutable log of all administrative actions, data edits, status changes, and file uploads.
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--slate-200)',
        padding: '1.25rem',
        boxShadow: 'none',
        overflowX: 'auto',
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading audit log entries...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            No audit log entries recorded yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Timestamp</th>
                <th style={{ padding: '0.85rem 1rem' }}>Admin User</th>
                <th style={{ padding: '0.85rem 1rem' }}>Action</th>
                <th style={{ padding: '0.85rem 1rem' }}>Entity</th>
                <th style={{ padding: '0.85rem 1rem' }}>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-500)', fontSize: '0.775rem', fontFamily: 'monospace' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} color="var(--primary-red)" />
                      <span>{log.admin_email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: log.action === 'CREATE' ? '#F0F9FF' : log.action === 'DELETE' ? '#FEF2F2' : '#F8FAFC',
                      color: log.action === 'CREATE' ? '#0284C7' : log.action === 'DELETE' ? '#DC2626' : '#475569',
                      border: '1px solid var(--slate-200)',
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--slate-800)' }}>
                    {log.entity}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--slate-600)', fontFamily: 'monospace', maxWidth: '380px', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                    {log.metadata_json || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
