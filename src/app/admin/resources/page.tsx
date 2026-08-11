'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Download, FileText } from 'lucide-react';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources');
      const data = await res.json();
      if (data.success) setResources(data.resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            Technical Resources PDF Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Upload and manage ASTM Compliance Sheets, Installation Manuals, and Corporate Profiles.
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--slate-200)',
        padding: '1.25rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading technical resources...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Title</th>
                <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem' }}>Code</th>
                <th style={{ padding: '0.85rem 1rem' }}>File Size</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Download</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {item.title}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--primary-red)', backgroundColor: '#FFE4E6', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--slate-700)' }}>
                    {item.pdf_code || '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)', fontSize: '0.8rem' }}>
                    {item.file_size}
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
                        backgroundColor: '#0EA5E9',
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
