'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Award } from 'lucide-react';

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [certNumber, setCertNumber] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchCerts = async () => {
    try {
      const res = await fetch('/api/admin/certifications');
      const data = await res.json();
      if (data.success) setCerts(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setIssuingOrg('');
    setCertNumber('');
    setDescription('');
    setDisplayOrder(certs.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setIssuingOrg(item.issuing_org || '');
    setCertNumber(item.cert_number || '');
    setDescription(item.description || '');
    setDisplayOrder(item.display_order || 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingId ? `/api/admin/certifications/${editingId}` : '/api/admin/certifications';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, issuingOrg, certNumber, description, displayOrder }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCerts();
      } else {
        alert(data.error || 'Failed to save certification');
      }
    } catch (err) {
      alert('Error saving certification');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete certification ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            Certifications & Quality Approvals
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Manage Saudi Aramco, SABIC, ISO 9001:2015, and ICV certifications.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.35rem',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-red)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(225, 29, 72, 0.3)',
          }}
        >
          <Plus size={18} />
          <span>+ Add Certification</span>
        </button>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--slate-200)',
        padding: '1.25rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading certifications...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Certification Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Issuing Authority</th>
                <th style={{ padding: '0.85rem 1rem' }}>Cert Code</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-700)', fontWeight: 600 }}>
                    {item.issuing_org}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#0EA5E9' }}>
                    {item.cert_number}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', backgroundColor: '#ECFDF5', color: '#10B981' }}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-300)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                        title="Edit"
                      >
                        <Edit size={14} color="var(--slate-700)" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid #FFE4E6', backgroundColor: '#FFF1F2', cursor: 'pointer' }}
                        title="Delete"
                      >
                        <Trash2 size={14} color="var(--primary-red)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 19, 43, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Certification' : 'Add Certification'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Certification Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ISO 9001:2015"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={issuingOrg}
                  onChange={(e) => setIssuingOrg(e.target.value)}
                  placeholder="e.g. Bureau Veritas"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Certificate Number *
                </label>
                <input
                  type="text"
                  required
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  placeholder="e.g. UAE-QMS-90812"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', backgroundColor: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--primary-red)', color: '#FFFFFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
