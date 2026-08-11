'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [pillar, setPillar] = useState('Insulation');
  const [industry, setIndustry] = useState('Oil & Gas');
  const [tempRange, setTempRange] = useState('-268°C to +430°C');
  const [density, setDensity] = useState('115 kg/m³');
  const [compliance, setCompliance] = useState('ASTM C552 / Aramco SAES-N-001');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [leadTime, setLeadTime] = useState('Immediate Dispatch');
  const [unit, setUnit] = useState('Sqm');
  const [priceEstimate, setPriceEstimate] = useState(42.50);
  const [aramcoApproved, setAramcoApproved] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setName('');
    setPillar('Insulation');
    setIndustry('Oil & Gas');
    setTempRange('-268°C to +430°C');
    setDensity('115 kg/m³');
    setCompliance('ASTM C552 / Aramco SAES-N-001');
    setDescription('');
    setInStock(true);
    setLeadTime('Immediate Dispatch');
    setUnit('Sqm');
    setPriceEstimate(42.50);
    setAramcoApproved(true);
    setDisplayOrder(products.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setPillar(item.pillar);
    setIndustry(item.industry);
    setTempRange(item.temp_range);
    setDensity(item.density);
    setCompliance(item.compliance);
    setDescription(item.description);
    setInStock(Boolean(item.in_stock));
    setLeadTime(item.lead_time);
    setUnit(item.unit || 'Sqm');
    setPriceEstimate(item.price_estimate || 0);
    setAramcoApproved(Boolean(item.aramco_approved));
    setDisplayOrder(item.display_order || 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name,
        pillar,
        industry,
        tempRange,
        density,
        compliance,
        description,
        inStock,
        leadTime,
        unit,
        priceEstimate,
        aramcoApproved,
        displayOrder,
      };

      const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      alert('Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: any) => {
    try {
      const res = await fetch(`/api/admin/products/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.is_active }),
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            Products Catalog Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Create, edit, activate/deactivate, and manage industrial thermal insulation products.
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
            boxShadow: '0 6px 16px rgba(225, 29, 72, 0.3)',
          }}
        >
          <Plus size={18} />
          <span>+ Add Product</span>
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
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading database products...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Product Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Pillar</th>
                <th style={{ padding: '0.85rem 1rem' }}>Industry</th>
                <th style={{ padding: '0.85rem 1rem' }}>Temp Range</th>
                <th style={{ padding: '0.85rem 1rem' }}>Aramco Appr.</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0EA5E9', backgroundColor: '#E0F2FE', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      {item.pillar}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-700)', fontWeight: 600 }}>
                    {item.industry}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)', fontSize: '0.8rem' }}>
                    {item.temp_range}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {item.aramco_approved ? (
                      <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#10B981', backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                        ✓ Yes
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button
                      onClick={() => handleToggleStatus(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        backgroundColor: item.is_active ? '#ECFDF5' : '#F1F5F9',
                        color: item.is_active ? '#10B981' : '#64748B',
                      }}
                    >
                      {item.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
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

      {/* Add / Edit Product Modal */}
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
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Product' : 'Create New Product'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. FOAMGLAS® ONE™ Cellular Glass"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Material Pillar *
                  </label>
                  <select
                    value={pillar}
                    onChange={(e) => setPillar(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                  >
                    <option value="Insulation">Insulation</option>
                    <option value="Jacketing">Jacketing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Acoustic">Acoustic & Vapor</option>
                    <option value="Valves">Valves & Refractory</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Industry Approval *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                  >
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Electro-Mechanical">Electro-Mechanical</option>
                    <option value="Industrial Commercial">Industrial Commercial</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Operating Temp Range
                  </label>
                  <input
                    type="text"
                    value={tempRange}
                    onChange={(e) => setTempRange(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Apparent Density
                  </label>
                  <input
                    type="text"
                    value={density}
                    onChange={(e) => setDensity(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Compliance Standards
                </label>
                <input
                  type="text"
                  value={compliance}
                  onChange={(e) => setCompliance(e.target.value)}
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

              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={aramcoApproved}
                    onChange={(e) => setAramcoApproved(e.target.checked)}
                  />
                  <span>Saudi Aramco Approved</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                  />
                  <span>In Stock</span>
                </label>
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
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
