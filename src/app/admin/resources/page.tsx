'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Download, AlertTriangle } from 'lucide-react';
import { RESOURCE_FOLDERS } from '@/lib/resources';
import { CustomSelect } from '@/components/CustomSelect';

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', background: '#FFFFFF' };

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  folder: RESOURCE_FOLDERS[0] as string,
  subfolder: '',
  revisionDate: new Date().toISOString().slice(0, 10),
  pdfCode: '',
  productId: '',
  isActive: true,
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/admin/resources');
      const data = await res.json();
      if (data.success) setResources(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => data.success && setProducts(data.data || []))
      .catch(() => {});
  }, []);

  const set = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      folder: (RESOURCE_FOLDERS as readonly string[]).includes(item.folder) ? item.folder : RESOURCE_FOLDERS[0],
      subfolder: item.subfolder || '',
      revisionDate: item.revision_date || '',
      pdfCode: item.pdf_code || '',
      productId: item.product_id || '',
      isActive: Boolean(item.is_active),
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (file) fd.append('file', file);
      const res = await fetch(editingId ? `/api/admin/resources/${editingId}` : '/api/admin/resources', {
        method: editingId ? 'PUT' : 'POST',
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchResources();
      } else {
        alert(data.error || 'Failed to save document');
      }
    } catch (err) {
      alert('Error saving document');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" and its file?`)) return;
    try {
      const res = await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' });
      if (res.ok) fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const productName = (id: string) => products.find(p => p.id === id)?.name;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            Technical Resources Library
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Files shown on the Tech Resources page. Link a file to a product to show it on that product&apos;s page.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.35rem', borderRadius: '12px', backgroundColor: 'var(--primary-red)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--slate-200)', padding: '1.25rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading technical resources...</div>
        ) : resources.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>No documents yet. Click &quot;Upload Document&quot;.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Document</th>
                <th style={{ padding: '0.85rem 1rem' }}>Folder</th>
                <th style={{ padding: '0.85rem 1rem' }}>Product</th>
                <th style={{ padding: '0.85rem 1rem' }}>Rev. Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>File</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)', opacity: item.is_active ? 1 : 0.55 }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--slate-900)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{item.subtitle}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>
                    <div>{item.folder || '—'}</div>
                    {item.subfolder && <div style={{ color: 'var(--slate-500)' }}>↳ {item.subfolder}</div>}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>{item.product_id ? productName(item.product_id) || item.product_id : '—'}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>{item.revision_date || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {item.file_url ? (
                      <a href={item.file_url} download style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0EA5E9', fontWeight: 700, fontSize: '0.8rem' }}>
                        <Download size={14} /> {item.file_type} · {item.file_size}
                      </a>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#B45309', fontWeight: 700, fontSize: '0.8rem' }}>
                        <AlertTriangle size={14} /> No file yet
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenEdit(item)} title="Edit" style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-300)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                        <Edit size={14} color="var(--slate-700)" />
                      </button>
                      <button onClick={() => handleDelete(item.id, item.title)} title="Delete" style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-200)', backgroundColor: '#F8FAFC', cursor: 'pointer' }}>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11, 19, 43, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Document' : 'Upload Document'}
            </h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{editingId ? 'Replace File (optional)' : 'File'}</label>
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv,.dwg,.zip,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={inputStyle}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>PDF, Excel, CSV, DWG, ZIP or image, up to 25 MB.</p>
              </div>
              <div>
                <label style={labelStyle}>Document Name / ID</label>
                <input value={form.title} onChange={set('title')} style={inputStyle} placeholder="Leave empty to use the file name" />
              </div>
              <div>
                <label style={labelStyle}>Short Description</label>
                <input value={form.subtitle} onChange={set('subtitle')} style={inputStyle} placeholder="e.g. Technical Data Sheet (TDS)" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Folder *</label>
                  <CustomSelect
                    options={[...RESOURCE_FOLDERS]}
                    value={form.folder}
                    onChange={(val) => setForm(prev => ({ ...prev, folder: val }))}
                    ariaLabel="Folder"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Sub-folder</label>
                  <input value={form.subfolder} onChange={set('subfolder')} style={inputStyle} placeholder="e.g. FOAMGLAS® Products" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Revision Date</label>
                  <input type="date" value={form.revisionDate} onChange={set('revisionDate')} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Code</label>
                  <input value={form.pdfCode} onChange={set('pdfCode')} style={inputStyle} placeholder="e.g. TDS-FG-01" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Show on Product Page</label>
                <CustomSelect
                  options={[{ value: '', label: 'Not linked' }, ...products.map(p => ({ value: p.id, label: p.name }))]}
                  value={form.productId}
                  onChange={(val) => setForm(prev => ({ ...prev, productId: val }))}
                  ariaLabel="Show on product page"
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))} />
                Show on website
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', backgroundColor: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--primary-red)', color: '#FFFFFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                  {submitting ? 'Saving...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
