'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, MessageSquare, Building2, MapPin, ChevronDown } from 'lucide-react';
import { ProductItem, GCC_HUBS } from '@/data/mockData';
import { CustomSelect } from './CustomSelect';

interface RfqQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: ProductItem[];
  onRemoveItem: (id: string) => void;
  onClearQueue: () => void;
}

export const RfqQueueDrawer: React.FC<RfqQueueDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearQueue,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [selectedHub, setSelectedHub] = useState('UAE HQ (Ajman) - Stock Available');
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({
    'P-001': 5000,
    'P-002': 120,
    'P-003': 120,
  });

  if (!isOpen) return null;

  const handleUpdateQty = (id: string, delta: number) => {
    setItemQuantities(prev => {
      const current = prev[id] || 100;
      const updated = Math.max(10, current + delta);
      return { ...prev, [id]: updated };
    });
  };

  const handleWhatsAppRedirect = () => {
    let text = `*GROWTH INTERNATIONAL L.L.C. - LIVE RFQ SUBMISSION*\n`;
    if (companyName.trim()) {
      text += `*Project/Company:* ${companyName.trim()}\n`;
    }
    text += `*Preferred Delivery Hub:* ${selectedHub}\n\n`;
    text += `*Requested Materials Inventory (${items.length} items):*\n`;

    items.forEach((item, index) => {
      const qty = itemQuantities[item.id] || 100;
      text += `${index + 1}. *${item.name}*\n   - Spec: ${item.compliance}\n   - Quantity: ${qty} ${item.unit}\n\n`;
    });

    text += `Please send volume pricing matrix, EPC test certificates, and dispatch schedule.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/9715309555?text=${encoded}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 90,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Slide-Over Drawer Container (Matches Screenshot RFQ - overlay) */}
      <aside style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(480px, 95vw)',
        backgroundColor: '#FFFFFF',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.75rem 2rem 1.25rem 2rem',
          borderBottom: '1px solid var(--slate-100)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Live RFQ Queue
              </h2>
              {items.length > 0 && (
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-red)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {items.length}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Review materials before Sending Message
            </p>
          </div>

          {/* Red/Pink Circular Close Button */}
          <button
            onClick={onClose}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FFE4E6',
              border: '1px solid #FECDD3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-red)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.75rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--slate-500)' }}>
              <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Your RFQ Queue is empty.</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Browse our catalog to add materials for instant quote generation.</p>
              <Link href="/products" onClick={onClose} style={{ color: '#0EA5E9', fontWeight: 800, textDecoration: 'none' }}>
                Browse Master Catalog →
              </Link>
            </div>
          ) : (
            <>
              {/* Materials Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {items.map(item => {
                  const qty = itemQuantities[item.id] ?? 500;
                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '16px',
                        border: '1px solid var(--slate-200)',
                        padding: '1.15rem 1.25rem',
                        position: 'relative',
                      }}
                    >
                      {/* Delete Item Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          color: 'var(--slate-400)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <X size={16} />
                      </button>

                      <h3 style={{ fontSize: '0.975rem', fontWeight: 800, color: 'var(--slate-900)', paddingRight: '1.5rem', marginBottom: '3px' }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: '0.775rem', color: 'var(--slate-500)', fontWeight: 600, marginBottom: '0.85rem' }}>
                        {item.pillar} • {item.compliance.split(',')[0]}
                      </p>

                      {/* Quantity Control Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--slate-300)',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                        }}>
                          <button
                            onClick={() => handleUpdateQty(item.id, -50)}
                            style={{ padding: '0.35rem 0.65rem', fontWeight: 800, color: 'var(--slate-600)' }}
                          >
                            -
                          </button>
                          <span style={{ padding: '0.35rem 0.85rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--slate-900)', minWidth: '55px', textAlign: 'center' }}>
                            {qty.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.id, 50)}
                            style={{ padding: '0.35rem 0.65rem', fontWeight: 800, color: 'var(--slate-600)' }}
                          >
                            +
                          </button>
                        </div>
                        <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--slate-500)' }}>
                          {item.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Add Another Material Link */}
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <Link
                    href="/products"
                    onClick={onClose}
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#0EA5E9',
                      textDecoration: 'none',
                    }}
                  >
                    Add Another Material
                  </Link>
                </div>
              </div>

              {/* Routing Details Form Section */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--slate-200)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.15rem' }}>
                  Routing Details
                </h3>

                {/* Project / Company Name Input */}
                <div style={{ marginBottom: '1.15rem' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                    PROJECT / COMPANY NAME (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ahamed Chawki new - balance"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--slate-300)',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Preferred Delivery Hub Select */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                    PREFERRED DELIVERY HUB
                  </label>
                  <CustomSelect
                    variant="standard"
                    options={[
                      'UAE HQ (Ajman) - Stock Available',
                      'KSA (Dammam) - Active Logistics',
                      'Kuwait - Stock Available',
                      'Qatar (Ras Laffan) - Active Logistics',
                      'Bahrain (BAPCO Hub) - Stock Available',
                      'Oman (Duqm Hub) - Stock Available',
                    ]}
                    value={selectedHub}
                    onChange={(val) => setSelectedHub(val)}
                    accentColor="var(--primary-red)"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Bottom Action Bar */}
        {items.length > 0 && (
          <div style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid var(--slate-200)',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
          }}>
            <button
              onClick={handleWhatsAppRedirect}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '0.95rem',
                borderRadius: '12px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1rem',
                border: 'none',
                boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.4)',
                cursor: 'pointer',
              }}
            >
              <MessageSquare size={20} fill="#FFFFFF" color="#10B981" />
              <span>Request via WhatsApp →</span>
            </button>

            <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)', fontWeight: 600 }}>
              Average Response Time: &lt; 15 Minutes
            </span>
          </div>
        )}
      </aside>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};
