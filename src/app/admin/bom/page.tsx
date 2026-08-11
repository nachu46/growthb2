'use client';

import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, Download, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';

export default function AdminBomPage() {
  const [boms, setBoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoms = async () => {
    try {
      const res = await fetch('/api/admin/bom');
      const data = await res.json();
      if (data.success) setBoms(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoms();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/bom', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchBoms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
          AutoCAD & Excel BOM Submissions
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
          Review and download uploaded project Bill of Materials (BOM) files submitted by regional EPC contractors.
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--slate-200)',
        padding: '1.25rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading BOM submissions...</div>
        ) : boms.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            No BOM submissions uploaded yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Uploaded Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Project / Company</th>
                <th style={{ padding: '0.85rem 1rem' }}>Contact Details</th>
                <th style={{ padding: '0.85rem 1rem' }}>File Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Size</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Download</th>
              </tr>
            </thead>
            <tbody>
              {boms.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-500)', fontSize: '0.775rem' }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--slate-900)' }}>{item.project_name || 'Industrial Project'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{item.company} ({item.customer_name})</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                    <div>{item.email}</div>
                    <div style={{ color: 'var(--slate-500)' }}>{item.phone}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0EA5E9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileSpreadsheet size={16} />
                      <span>{item.file_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)', fontSize: '0.8rem' }}>
                    {item.file_size}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--slate-300)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor: item.status === 'Completed' ? '#ECFDF5' : '#E0F2FE',
                        color: item.status === 'Completed' ? '#10B981' : '#0EA5E9',
                      }}
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="Under Analysis">Under Analysis</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <a
                      href={item.file_url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--navy-dark)',
                        color: '#FFFFFF',
                        fontSize: '0.775rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </a>
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
