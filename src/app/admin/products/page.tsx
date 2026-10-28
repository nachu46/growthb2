'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { CustomSelect } from '@/components/CustomSelect';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [pillar, setPillar] = useState('insulation');
  const [categories, setCategories] = useState<any[]>([]);
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
  const [manufacturer, setManufacturer] = useState('');
  const [stockLevel, setStockLevel] = useState('High');
  const [stockHub, setStockHub] = useState('UAE Hub (Ajman)');
  const [imageUrl, setImageUrl] = useState('');
  const [complianceBadges, setComplianceBadges] = useState('');
  const [fabricationForms, setFabricationForms] = useState('');
  const [thicknesses, setThicknesses] = useState('');
  const [physicalProperties, setPhysicalProperties] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // JSON columns <-> simple text inputs
  const jsonListToText = (value: string | null) => {
    try {
      const list = value ? JSON.parse(value) : [];
      return Array.isArray(list) ? list.join(', ') : '';
    } catch {
      return '';
    }
  };
  const jsonPropsToText = (value: string | null) => {
    try {
      const rows = value ? JSON.parse(value) : [];
      return Array.isArray(rows)
        ? rows.map((r: any) => `${r.property} | ${r.testMethod} | ${r.isRedHighlight ? '!' : ''}${r.performanceValue}`).join('\n')
        : '';
    } catch {
      return '';
    }
  };

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
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => data.success && setCategories(data.data || []))
      .catch(() => {});
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setName('');
    setPillar(categories[0]?.slug || 'insulation');
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
    setManufacturer('');
    setStockLevel('High');
    setStockHub('UAE Hub (Ajman)');
    setImageUrl('');
    setComplianceBadges('');
    setFabricationForms('');
    setThicknesses('');
    setPhysicalProperties('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setPillar(String(item.pillar || '').toLowerCase());
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
    setManufacturer(item.manufacturer || '');
    setStockLevel(item.stock_level || 'High');
    setStockHub(item.stock_hub || '');
    setImageUrl(item.image_url || '');
    setComplianceBadges(jsonListToText(item.compliance_badges));
    setFabricationForms(jsonListToText(item.fabrication_forms));
    setThicknesses(jsonListToText(item.thicknesses));
    setPhysicalProperties(jsonPropsToText(item.physical_properties));
    setIsModalOpen(true);
  };

  // Category dropdown comes from Admin → Categories (value = category key stored on the product)
  const categoryOptions = categories.length
    ? categories.map(c => ({ value: c.slug, label: c.is_active ? c.name : `${c.name} (hidden)` }))
    : [{ value: pillar, label: pillar }];
  const categoryLabel = (key: string) => categories.find(c => c.slug.toLowerCase() === String(key).toLowerCase())?.name || key;

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
        manufacturer,
        stockLevel,
        stockHub,
        imageUrl,
        complianceBadges,
        fabricationForms,
        thicknesses,
        physicalProperties,
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
            boxShadow: 'none',
          }}
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--slate-200)',
        padding: '1.25rem',
        boxShadow: 'none',
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
                      {categoryLabel(item.pillar)}
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
                      <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0284C7', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                        Approved
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>—</span>
                    )}
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
                    Category *
                  </label>
                  <CustomSelect
                    variant="standard"
                    options={categoryOptions}
                    value={pillar}
                    onChange={(val) => setPillar(val)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Industry Approval *
                  </label>
                  <CustomSelect
                    variant="standard"
                    options={[
                      'Oil & Gas',
                      'HVAC',
                      'Chemical',
                      'Electro-Mechanical',
                      'Industrial Commercial',
                    ]}
                    value={industry}
                    onChange={(val) => setIndustry(val)}
                  />
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>Manufacturer</label>
                  <input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="e.g. FOAMGLAS" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>Stock Level</label>
                  <CustomSelect
                    variant="standard"
                    options={['High', 'Medium', 'Low', 'On Order']}
                    value={stockLevel}
                    onChange={(val) => setStockLevel(val)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>Stock Hub</label>
                  <input type="text" value={stockHub} onChange={(e) => setStockHub(e.target.value)} placeholder="e.g. UAE Hub (Ajman)" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>Product Image URL</label>
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/uploads/... or https://..." style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>Compliance Badges</label>
                <input type="text" value={complianceBadges} onChange={(e) => setComplianceBadges(e.target.value)} placeholder="ASTM C552, Non-Combustible (A1), Zero Vapor Perm." style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>Separate with commas.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>Fabrication Forms</label>
                  <input type="text" value={fabricationForms} onChange={(e) => setFabricationForms(e.target.value)} placeholder="Rigid Block, Pipe Shell (Fit)" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>Thicknesses</label>
                  <input type="text" value={thicknesses} onChange={(e) => setThicknesses(e.target.value)} placeholder="25 mm, 50 mm, + Custom (CNC)" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>Physical &amp; Thermal Properties</label>
                <textarea
                  rows={5}
                  value={physicalProperties}
                  onChange={(e) => setPhysicalProperties(e.target.value)}
                  placeholder={'Apparent Density | ASTM C303 | 115 kg/m³\nReaction to Fire | EN 13501-1 | !Euroclass A1'}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--slate-300)', fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>One per line: Property | Test method | Value. Start the value with ! to show it in red.</p>
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
