'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, MessageCircle, Calendar } from 'lucide-react';
import { CustomSelect } from '@/components/CustomSelect';

const RFQ_STATUS_OPTIONS = [
  { value: 'New', label: 'New', color: '#1D4ED8', bg: '#EFF6FF' },
  { value: 'Pending', label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
  { value: 'Quoted', label: 'Quoted', color: '#16A34A', bg: '#F0FDF4' },
  { value: 'Processing', label: 'Processing', color: '#9333EA', bg: '#F3E8FF' },
  { value: 'Completed', label: 'Completed', color: '#059669', bg: '#ECFDF5' },
  { value: 'Rejected', label: 'Rejected', color: '#DC2626', bg: '#FEF2F2' },
];

export default function AdminRfqPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchRfqs = async () => {
    try {
      const res = await fetch('/api/admin/rfq');
      const data = await res.json();
      if (data.success) setRfqs(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/rfq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchRfqs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRfqs = rfqs.filter(r => statusFilter === 'All' || r.status === statusFilter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            Customer RFQ Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Review incoming B2B volume pricing requests and update commercial response statuses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-600)' }}>Status Filter:</label>
          <CustomSelect
            variant="badge"
            options={[
              { value: 'All', label: 'All Statuses' },
              ...RFQ_STATUS_OPTIONS,
            ]}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            accentColor="var(--primary-red)"
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading customer RFQs...</div>
        ) : filteredRfqs.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            No RFQ inquiries found matching filter.
          </div>
        ) : (
          filteredRfqs.map((rfq) => {
            let items: any[] = [];
            try { items = JSON.parse(rfq.products_json || '[]'); } catch (e) {}

            return (
              <div
                key={rfq.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--slate-200)',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--slate-900)' }}>
                        {rfq.customer_name}
                      </h3>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-500)' }}>
                        ({rfq.company})
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {rfq.email}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> {rfq.phone}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {rfq.country || 'UAE'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(rfq.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                      STATUS:
                    </span>
                    <CustomSelect
                      variant="badge"
                      options={RFQ_STATUS_OPTIONS}
                      value={rfq.status}
                      onChange={(val) => handleStatusChange(rfq.id, val)}
                      accentColor="var(--primary-red)"
                    />
                  </div>
                </div>

                {/* RFQ Order Details */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                    Requested Items / Material Specs:
                  </div>
                  {items.length > 0 ? (
                    <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {items.map((it: any, i: number) => (
                        <li key={i}>
                          <strong>{it.name || it.title}</strong> — {it.pillar || ''} ({it.compliance || ''})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>
                      Material Pillar: <strong>{rfq.material_pillar || 'N/A'}</strong> | Volume: <strong>{rfq.quantity || 'Bulk'}</strong> | Hub: <strong>{rfq.delivery_hub || 'UAE HQ'}</strong>
                    </div>
                  )}
                  {rfq.message && (
                    <div style={{ marginTop: '0.5rem', color: 'var(--slate-600)', fontStyle: 'italic' }}>
                      "{rfq.message}"
                    </div>
                  )}
                </div>

                {/* WhatsApp Quick Reply Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      const msg = `Hello ${rfq.customer_name},\nRegarding your Growth International RFQ inquiry (${rfq.company}):\nWe have reviewed your request. Here is our official quotation...`;
                      window.open(`https://wa.me/${rfq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>Reply via WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
