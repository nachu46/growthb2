'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, ExternalLink, Upload, MoveUp, MoveDown } from 'lucide-react';

const getLogoSrc = (item: any) => {
  if (item.logo_url && item.logo_url.trim() !== '') return item.logo_url;
  const n = (item.name || '').toLowerCase();
  if (n.includes('aramco')) return '/logos/aramco.webp';
  if (n.includes('sabic')) return '/logos/sabic.svg';
  if (n.includes('adnoc')) return '/logos/adnoc.png';
  if (n.includes('sadara')) return '/logos/sadara.png';
  if (n.includes('knpc')) return '/logos/knpc.svg';
  if (n.includes('total')) return '/logos/totalenergies.png';
  if (n.includes('maaden') || n.includes("ma'aden")) return '/logos/maaden.svg';
  return '/logos/aramco.webp';
};

export default function AdminCompanyLogosPage() {
  const [logos, setLogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [vendorIdCode, setVendorIdCode] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchLogos = async () => {
    try {
      const res = await fetch('/api/admin/company-logos');
      const data = await res.json();
      if (data.success) {
        setLogos(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch company logos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setName('');
    setWebsiteUrl('');
    setVendorIdCode('');
    setDescription('');
    setDisplayOrder(logos.length + 1);
    setLogoUrl('');
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setWebsiteUrl(item.website_url || '');
    setVendorIdCode(item.vendor_id_code || '');
    setDescription(item.description || '');
    setDisplayOrder(item.display_order || 1);
    setLogoUrl(item.logo_url || '');
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('websiteUrl', websiteUrl);
      formData.append('vendorIdCode', vendorIdCode);
      formData.append('description', description);
      formData.append('displayOrder', displayOrder.toString());

      if (logoFile) {
        formData.append('logoFile', logoFile);
      } else {
        formData.append('logoUrl', logoUrl);
      }

      const url = editingId ? `/api/admin/company-logos/${editingId}` : '/api/admin/company-logos';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchLogos();
      } else {
        alert(data.error || 'Failed to save logo');
      }
    } catch (err) {
      alert('Error saving company logo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: any) => {
    try {
      const res = await fetch(`/api/admin/company-logos/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.is_active }),
      });
      if (res.ok) fetchLogos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete ${companyName}?`)) return;
    try {
      const res = await fetch(`/api/admin/company-logos/${id}`, { method: 'DELETE' });
      if (res.ok) fetchLogos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            Company & Vendor Logo Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Manage homepage vendor logos for Saudi Aramco, SABIC, ADNOC, Sadara, KNPC, TotalEnergies, MA'ADEN.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
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
            boxShadow: 'none',
          }}
        >
          <Plus size={18} />
          <span>Add Company</span>
        </button>
      </div>

      {/* Logos Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--slate-200)',
        padding: '1.25rem',
        boxShadow: 'none',
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading database logos...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Logo Preview</th>
                <th style={{ padding: '0.85rem 1rem' }}>Company</th>
                <th style={{ padding: '0.85rem 1rem' }}>Vendor Code</th>
                <th style={{ padding: '0.85rem 1rem' }}>Website</th>
                <th style={{ padding: '0.85rem 1rem' }}>Order</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logos.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{
                      width: '90px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--slate-200)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                    }}>
                      <img src={getLogoSrc(item)} alt={item.name} style={{ maxHeight: '34px', maxWidth: '80px', objectFit: 'contain' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--slate-700)' }}>
                    {item.vendor_id_code || '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {item.website_url ? (
                      <a href={item.website_url} target="_blank" rel="noreferrer" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>Link</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>
                    {item.display_order}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button
                      onClick={() => handleToggleStatus(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid var(--slate-200)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        backgroundColor: item.is_active ? '#F1F5F9' : '#F8FAFC',
                        color: item.is_active ? 'var(--slate-800)' : 'var(--slate-400)',
                      }}
                    >
                      <span>{item.is_active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-300)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                        title="Edit"
                      >
                        <Edit size={14} color="var(--slate-700)" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-200)', backgroundColor: '#F8FAFC', cursor: 'pointer' }}
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

      {/* Add / Edit Modal */}
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
            maxWidth: '520px',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Company Logo' : 'Add New Company Logo'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saudi Aramco"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Vendor Registration Code
                </label>
                <input
                  type="text"
                  value={vendorIdCode}
                  onChange={(e) => setVendorIdCode(e.target.value)}
                  placeholder="e.g. 10114402"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Website URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://www.aramco.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Logo Upload (SVG, PNG, WEBP, JPG) or Image URL
                </label>
                <input
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', padding: '0.5rem 0', fontSize: '0.85rem' }}
                />
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Or paste external logo image URL"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.85rem', outline: 'none', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', outline: 'none' }}
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
                  {submitting ? 'Saving...' : 'Save Company Logo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
