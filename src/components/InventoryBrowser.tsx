'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MATERIAL_PILLARS, INDUSTRY_APPROVALS, PRODUCTS_CATALOG, ProductItem } from '@/data/mockData';
import { Thermometer, Award, Plus, ExternalLink } from 'lucide-react';

interface InventoryBrowserProps {
  onAddRfqItem: (product: ProductItem) => void;
}

export const InventoryBrowser: React.FC<InventoryBrowserProps> = ({ onAddRfqItem }) => {
  const [selectedPillar, setSelectedPillar] = useState<string>('Insulation');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Oil & Gas');
  const [activeTab, setActiveTab] = useState<'pillar' | 'industry'>('pillar');

  const displayedProducts = PRODUCTS_CATALOG.filter(product => {
    if (activeTab === 'pillar') {
      return product.pillar === selectedPillar;
    } else {
      return product.industry === selectedIndustry;
    }
  });

  return (
    <section id="inventory-section" style={{
      padding: '3rem 1.25rem',
      maxWidth: '1280px',
      margin: '0 auto',
    }}>
      {/* Outer Card Container (Matches Desktop Screenshot) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid var(--slate-200)',
        padding: '2.5rem 2rem',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2.25rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--slate-900)',
            marginBottom: '0.4rem',
            letterSpacing: '-0.02em',
          }}>
            Browse Certified Industrial Inventory By Material Category
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
            Dual-lens discovery mapping live inventory to EPC technical specifications.
          </p>
        </div>

        {/* Dual-Lens Filter Cards Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Card 1: 1. Browse by Material Pillar (Matches Desktop Screenshot) */}
          <div
            onClick={() => setActiveTab('pillar')}
            style={{
              backgroundColor: '#F8FAFC',
              border: activeTab === 'pillar' ? '2px solid #0EA5E9' : '1px solid var(--slate-200)',
              borderRadius: '20px',
              padding: '1.5rem 2rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }} className="desktop-card-inner">
              {/* Left/Top Section: Icon + Titles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#E0F2FE',
                  border: '3px solid #0EA5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#0EA5E9' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2px' }}>
                    1. Browse by Material Pillar
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    Select a structural pillar to check real-time availability and compliance data:
                  </p>
                </div>
              </div>

              {/* Horizontal Row of Pills (Matches Desktop Screenshot) */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
              }} className="pills-flex-container">
                {[
                  { id: 'Insulation', label: 'Insulation' },
                  { id: 'Jacketing', label: 'Jacketing (Inc. PSMB & GI)' },
                  { id: 'Accessories', label: 'Accessories (Inc. Marking & Tape)' },
                  { id: 'Acoustic', label: 'Acoustic & Vapor' },
                  { id: 'Valves', label: 'Valves & Refractory' },
                ].map(item => {
                  const isActive = activeTab === 'pillar' && selectedPillar === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('pillar');
                        setSelectedPillar(item.id);
                      }}
                      style={{
                        padding: '0.55rem 1.35rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isActive ? '#FFFFFF' : '#FFFFFF',
                        color: isActive ? '#0EA5E9' : 'var(--slate-800)',
                        border: isActive ? '2px solid #0EA5E9' : '1px solid var(--slate-300)',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        boxShadow: isActive ? '0 2px 8px rgba(14, 165, 233, 0.2)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Environmental & Industry Approvals (Matches Desktop Screenshot) */}
          <div
            onClick={() => setActiveTab('industry')}
            style={{
              backgroundColor: '#F8FAFC',
              border: activeTab === 'industry' ? '2px solid var(--primary-red)' : '1px solid var(--slate-200)',
              borderRadius: '20px',
              padding: '1.5rem 2rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }} className="desktop-card-inner">
              {/* Left/Top Section: Icon + Subtitle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#FFE4E6',
                  border: '3px solid var(--primary-red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--primary-red)' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-600)' }}>
                    Cross-reference material data mapped to specific environmental approvals:
                  </p>
                </div>
              </div>

              {/* Horizontal Row of Pills (Matches Desktop Screenshot) */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
              }} className="pills-flex-container">
                {[
                  { id: 'Oil & Gas', label: 'Oil & Gas' },
                  { id: 'HVAC', label: 'HVAC' },
                  { id: 'Chemical', label: 'Chemical' },
                  { id: 'Electro-Mechanical', label: 'Electro-Mechanical' },
                  { id: 'Industrial Commercial', label: 'Industrial Commercial' },
                ].map(item => {
                  const isActive = activeTab === 'industry' && selectedIndustry === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('industry');
                        setSelectedIndustry(item.id);
                      }}
                      style={{
                        padding: '0.55rem 1.35rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isActive ? '#FFFFFF' : '#FFFFFF',
                        color: isActive ? 'var(--primary-red)' : 'var(--slate-800)',
                        border: isActive ? '2px solid var(--primary-red)' : '1px solid var(--slate-300)',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        boxShadow: isActive ? '0 2px 8px rgba(225, 29, 72, 0.2)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Display Filtered Inventory Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {displayedProducts.map(product => (
            <div
              key={product.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--slate-200)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#0EA5E9',
                    backgroundColor: '#E0F2FE',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    {product.pillar}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                    {product.leadTime}
                  </span>
                </div>

                <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {product.name}
                  </h4>
                </Link>

                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {product.description}
                </p>

                <div style={{
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-700)' }}>
                    <Thermometer size={14} color="var(--primary-red)" />
                    <span>Temp: <strong>{product.tempRange}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-700)' }}>
                    <Award size={14} color="#0EA5E9" />
                    <span>Spec: <strong>{product.compliance}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => onAddRfqItem(product)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--navy-dark)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={16} />
                  <span>Add to RFQ</span>
                </button>

                <Link
                  href={`/products/${product.slug}`}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    color: '#0EA5E9',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                  }}
                >
                  <span>Specs</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          :global(.pills-flex-container) {
            margin-left: 4rem !important;
          }
        }
      `}</style>
    </section>
  );
};
