'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, ImageIcon } from 'lucide-react';

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', background: '#FFFFFF', fontFamily: 'inherit' };

const EMPTY_FORM = { name: '', slug: '', description: '', items: '', imageUrl: '', displayOrder: 1, isActive: true };

const parseItems = (json: string | null) => {
  try {
    const list = json ? JSON.parse(json) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const set = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, displayOrder: categories.length + 1 });
    setImage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditing(item);
    setForm({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      items: parseItems(item.items).join('\n'),
      imageUrl: item.image_url || '',
      displayOrder: item.display_order || 1,
      isActive: Boolean(item.is_active),
    });
    setImage(null);
    setIsModalOpen(true);
  };

  const save = async (fd: FormData, id?: string) => {
    const res = await fetch(id ? `/api/admin/categories/${id}` : '/api/admin/categories', { method: id ? 'PUT' : 'POST', body: fd });
    return res.json();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'slug' && editing) return;
        fd.append(k, String(v));
      });
      if (image) fd.append('image', image);
      const data = await save(fd, editing?.id);
      if (data.success) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        alert(data.error || 'Failed to save category');
      }
    } catch (err) {
      alert('Error saving category');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVisible = async (item: any) => {
    const fd = new FormData();
    fd.append('isActive', item.is_active ? 'false' : 'true');
    const data = await save(fd, item.id);
    if (data.success) fetchCategories();
    else alert(data.error);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete category "${item.name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${item.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchCategories();
    else alert(data.error);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            Product Categories
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Shown on the Products page, the home page filters and the Products menu. Order and visibility update the website instantly.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.35rem', borderRadius: '12px', backgroundColor: 'var(--primary-red)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading categories...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
          {categories.map(cat => (
            <div key={cat.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--slate-200)', borderRadius: '16px', overflow: 'hidden', opacity: cat.is_active ? 1 : 0.55 }}>
              <div style={{ height: '110px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon size={28} color="var(--slate-400)" />
                )}
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>{cat.name}</h3>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-600)', background: '#F1F5F9', borderRadius: '6px', padding: '0.15rem 0.5rem', whiteSpace: 'nowrap' }}>
                    {cat.product_count} product{cat.product_count === 1 ? '' : 's'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '0.6rem' }}>{cat.description}</p>
                <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--slate-700)', display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '0.9rem' }}>
                  {parseItems(cat.items).map((it: string) => <li key={it}>{it}</li>)}
                </ul>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', fontFamily: 'monospace' }}>key: {cat.slug} · #{cat.display_order}</span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => toggleVisible(cat)} title={cat.is_active ? 'Hide on website' : 'Show on website'} style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-300)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                      {cat.is_active ? <Eye size={14} color="var(--slate-700)" /> : <EyeOff size={14} color="var(--slate-500)" />}
                    </button>
                    <button onClick={() => handleOpenEdit(cat)} title="Edit" style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-300)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                      <Edit size={14} color="var(--slate-700)" />
                    </button>
                    <button onClick={() => handleDelete(cat)} title="Delete" style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-200)', backgroundColor: '#F8FAFC', cursor: 'pointer' }}>
                      <Trash2 size={14} color="var(--primary-red)" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11, 19, 43, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
              {editing ? 'Edit Category' : 'Add Category'}
            </h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Category Name *</label>
                <input required value={form.name} onChange={set('name')} style={inputStyle} placeholder="e.g. Fire Protection" maxLength={80} />
              </div>
              {!editing && (
                <div>
                  <label style={labelStyle}>Key (optional)</label>
                  <input value={form.slug} onChange={set('slug')} style={inputStyle} placeholder="Generated from the name, e.g. fire-protection" maxLength={40} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Used in links and to connect products. It can&apos;t be changed later.</p>
                </div>
              )}
              <div>
                <label style={labelStyle}>Short Description</label>
                <input value={form.description} onChange={set('description')} style={inputStyle} maxLength={200} />
              </div>
              <div>
                <label style={labelStyle}>Items Shown on the Card</label>
                <textarea rows={5} value={form.items} onChange={set('items')} style={inputStyle} placeholder={'FOAMGLAS Blocks\nPyrogel Aerogel\nPIR / PUR Rigid Foam'} />
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>One per line (up to 12).</p>
              </div>
              <div>
                <label style={labelStyle}>Card Image</label>
                <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => setImage(e.target.files?.[0] || null)} style={inputStyle} />
                {form.imageUrl && !image && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <img src={form.imageUrl} alt="" style={{ width: '64px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-red)' }}>
                      Remove image
                    </button>
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" min={0} value={form.displayOrder} onChange={(e) => setForm(prev => ({ ...prev, displayOrder: Number(e.target.value) }))} style={inputStyle} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', paddingBottom: '0.8rem' }}>
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))} />
                  Show on website
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', backgroundColor: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--primary-red)', color: '#FFFFFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
