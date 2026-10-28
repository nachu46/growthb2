'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const EMPTY_FORM = {
  projectName: '',
  client: '',
  country: '',
  industry: '',
  year: String(new Date().getFullYear()),
  scope: '',
  description: '',
  status: 'Completed',
  displayOrder: 1,
  isActive: true,
};

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' };

export default function AdminProjectHistoryPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/project-history');
      const data = await res.json();
      if (data.success) setProjects(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const set = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, displayOrder: projects.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      projectName: item.project_name || '',
      client: item.client || '',
      country: item.country || '',
      industry: item.industry || '',
      year: item.year || '',
      scope: item.scope || '',
      description: item.description || '',
      status: item.status || 'Completed',
      displayOrder: item.display_order || 1,
      isActive: Boolean(item.is_active),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingId ? `/api/admin/project-history/${editingId}` : '/api/admin/project-history';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProjects();
      } else {
        alert(data.error || 'Failed to save project');
      }
    } catch (err) {
      alert('Error saving project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete project "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/project-history/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            GCC Project Execution History
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Projects shown in the &quot;Project Execution History&quot; table on the Certifications page.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.35rem', borderRadius: '12px', backgroundColor: 'var(--primary-red)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} />
          <span>Add Project</span>
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--slate-200)', padding: '1.25rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading project history...</div>
        ) : projects.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>No projects yet. Click &quot;Add Project&quot;.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Project Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Client / EPC</th>
                <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                <th style={{ padding: '0.85rem 1rem' }}>Sector</th>
                <th style={{ padding: '0.85rem 1rem' }}>Materials Supplied</th>
                <th style={{ padding: '0.85rem 1rem' }}>Visible</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--slate-900)' }}>{item.project_name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-700)' }}>{item.client}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{item.country}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#0EA5E9', fontWeight: 700 }}>{item.industry}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)', fontSize: '0.8rem' }}>{item.scope}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{item.is_active ? 'Yes' : 'Hidden'}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenEdit(item)} title="Edit" style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-300)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                        <Edit size={14} color="var(--slate-700)" />
                      </button>
                      <button onClick={() => handleDelete(item.id, item.project_name)} title="Delete" style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--slate-200)', backgroundColor: '#F8FAFC', cursor: 'pointer' }}>
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
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Project' : 'Add Project'}
            </h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Project Name *</label>
                <input required value={form.projectName} onChange={set('projectName')} style={inputStyle} placeholder="e.g. Jafurah Petrochemical Complex" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Client / EPC *</label>
                  <input required value={form.client} onChange={set('client')} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Location *</label>
                  <input required value={form.country} onChange={set('country')} style={inputStyle} placeholder="e.g. Jubail, KSA" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Sector *</label>
                  <input required value={form.industry} onChange={set('industry')} style={inputStyle} placeholder="e.g. Oil & Gas (Downstream)" />
                </div>
                <div>
                  <label style={labelStyle}>Year</label>
                  <input value={form.year} onChange={set('year')} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Materials Supplied *</label>
                <input required value={form.scope} onChange={set('scope')} style={inputStyle} placeholder="e.g. Cellular Glass, SS Jacketing" />
              </div>
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea rows={3} value={form.description} onChange={set('description')} style={inputStyle} />
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
                  {submitting ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
