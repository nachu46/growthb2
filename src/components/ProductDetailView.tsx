'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/data/mockData';
import { Plus, Minus, Download, FileText, Award, Thermometer, Box } from 'lucide-react';

interface ProductDetailViewProps {
  product: ProductItem;
  onAddRfqItem: (product: ProductItem, qty: number, form: string, thickness: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddRfqItem }) => {
  const [selectedForm, setSelectedForm] = useState<string>(
    product.fabricationForms?.[0] || 'Rigid Block'
  );
  const [selectedThickness, setSelectedThickness] = useState<string>(
    product.thicknesses?.[1] || '50 mm'
  );
  const [quantity, setQuantity] = useState<number>(500);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  const handleDownloadDoc = (docTitle: string) => {
    setDownloadingDoc(docTitle);
    setTimeout(() => {
      const dummyBlob = new Blob([`Growth International Document: ${docTitle}\nProduct: ${product.name}\nStandard: ${product.compliance}`], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(dummyBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docTitle.replace(/\s+/g, '-')}-Growth-International.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setDownloadingDoc(null);
    }, 800);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Top Ticker Header */}
      <div style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.5rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.725rem',
        fontWeight: 800,
        color: 'var(--slate-700)',
        marginBottom: '2rem',
        letterSpacing: '0.04em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span>VERIFIED GCC VENDOR: ARAMCO 10114402 • SABIC 11047900 • ICV CERTIFIED</span>
        </div>
        <div>HQ: +971-6-530-9555 | SALES@GROWTHME.COM</div>
      </div>

      {/* Breadcrumb Navigation */}
      <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '2rem', fontWeight: 600 }}>
        <Link href="/products" style={{ color: 'var(--slate-500)', textDecoration: 'none' }}>Products</Link> &gt;{' '}
        <span style={{ color: 'var(--slate-500)' }}>{product.pillar}</span> &gt;{' '}
        <strong style={{ color: 'var(--slate-900)' }}>{product.name}</strong>
      </div>

      {/* 2-Column Product Hero Section (Matches Screenshot 1) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '3rem',
        marginBottom: '4rem',
        alignItems: 'start',
      }} className="product-hero-grid">
        {/* Left Column: Isometric 3D Box Image Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--slate-200)',
          padding: '2.5rem 2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '420px',
        }}>
          {/* Top Left Aramco Approval Badge */}
          {product.aramcoApproved && (
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#047857',
              fontSize: '0.725rem',
              fontWeight: 800,
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>Aramco Approved</span>
            </div>
          )}

          {/* Isometric 3D Box Illustration Render */}
          <div style={{ margin: '3rem 0 2rem 0', textAlign: 'center' }}>
            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 15L85 32V68L50 85L15 68V32L50 15Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" strokeLinejoin="round" />
              <path d="M50 15V85" stroke="#94A3B8" strokeWidth="2" />
              <path d="M50 50L85 32" stroke="#94A3B8" strokeWidth="2" />
              <path d="M50 50L15 32" stroke="#94A3B8" strokeWidth="2" />
              <path d="M50 15L85 32L50 50L15 32L50 15Z" fill="#E2E8F0" />
              <path d="M50 50L85 32V68L50 85V50Z" fill="#94A3B8" />
              <path d="M50 50L15 32V68L50 85V50Z" fill="#64748B" />
            </svg>
            <div style={{ fontSize: '0.775rem', color: 'var(--slate-400)', fontWeight: 600, marginTop: '1rem' }}>
              Insert Image: Cellular Glass Isometric Render
            </div>
          </div>
        </div>

        {/* Right Column: Product Specs & Ordering Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Title & Description */}
          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              color: 'var(--slate-900)',
              lineHeight: 1.15,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}>
              {product.name}
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--slate-600)',
              lineHeight: 1.6,
              marginBottom: '1.25rem',
            }}>
              {product.description}
            </p>

            {/* Compliance Badges Pill Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {(product.complianceBadges || ['ASTM C552', 'Non-Combustible (A1)', 'Zero Vapor Perm.']).map((badge, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--slate-100)',
                    border: '1px solid var(--slate-200)',
                    color: 'var(--slate-800)',
                    fontWeight: 700,
                    fontSize: '0.775rem',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* 1. SELECT FABRICATION FORM */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-900)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              1. SELECT FABRICATION FORM:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {(product.fabricationForms || ['Rigid Block', 'Pipe Shell (Fit)', 'Curved Segments']).map((form, idx) => {
                const isActive = selectedForm === form;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedForm(form)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isActive ? '2px solid #0EA5E9' : '1px solid var(--slate-300)',
                      backgroundColor: isActive ? '#F0F9FF' : '#FFFFFF',
                      color: isActive ? '#0EA5E9' : 'var(--slate-800)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    {form}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SELECT THICKNESS (MM) */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-900)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              2. SELECT THICKNESS (MM):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {(product.thicknesses || ['25 mm', '50 mm', '75 mm', '+ Custom (CNC)']).map((th, idx) => {
                const isActive = selectedThickness === th;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedThickness(th)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isActive ? '2px solid #0EA5E9' : '1px solid var(--slate-300)',
                      backgroundColor: isActive ? '#F0F9FF' : '#FFFFFF',
                      color: isActive ? '#0EA5E9' : 'var(--slate-800)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    {th}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Availability Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span><strong>High Stock Available</strong> • {product.leadTime}</span>
          </div>

          {/* Quantity Selector & Add to RFQ Bar (Matches Screenshot 1) */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid var(--slate-200)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            {/* Quantity Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--slate-300)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(100, quantity - 50))}
                  style={{ padding: '0.6rem 0.85rem', color: 'var(--slate-600)', fontWeight: 800, fontSize: '1rem' }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 100)}
                  style={{
                    width: '70px',
                    textAlign: 'center',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 50)}
                  style={{ padding: '0.6rem 0.85rem', color: 'var(--slate-600)', fontWeight: 800, fontSize: '1rem' }}
                >
                  +
                </button>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-600)' }}>
                {product.unit}
              </span>
            </div>

            {/* Add to RFQ Queue Button */}
            <button
              onClick={() => onAddRfqItem(product, quantity, selectedForm, selectedThickness)}
              style={{
                flex: 1,
                minWidth: '220px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.9rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)',
                cursor: 'pointer',
              }}
            >
              <Plus size={18} />
              <span>Add to RFQ Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Physical & Thermal Properties Table (Matches Screenshot 2) */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
            Physical & Thermal Properties
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)' }}>
            Rigid adherence to global testing standards. Values represent typical average properties.
          </p>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--slate-200)',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--slate-200)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.725rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  PHYSICAL PROPERTY
                </th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.725rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TEST METHOD / STANDARD
                </th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.725rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  PERFORMANCE VALUE
                </th>
              </tr>
            </thead>
            <tbody>
              {(product.physicalProperties || []).map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < (product.physicalProperties?.length || 0) - 1 ? '1px solid var(--slate-200)' : 'none',
                  }}
                >
                  <td style={{ padding: '1.1rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                    {row.property}
                  </td>
                  <td style={{ padding: '1.1rem 1.5rem' }}>
                    <span style={{
                      backgroundColor: 'var(--slate-100)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: 'var(--slate-700)',
                      fontFamily: 'monospace',
                    }}>
                      {row.testMethod}
                    </span>
                  </td>
                  <td style={{
                    padding: '1.1rem 1.5rem',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: row.isRedHighlight ? 'var(--primary-red)' : 'var(--slate-900)',
                  }}>
                    {row.performanceValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Associated Technical Documentation Cards (Matches Screenshot 3) */}
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
            Associated Technical Documentation
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {(product.technicalDocs || []).map(doc => (
            <div
              key={doc.id}
              onClick={() => handleDownloadDoc(doc.title)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--slate-200)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              className="doc-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--slate-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-red)',
                  flexShrink: 0,
                }}>
                  <FileText size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.975rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2px' }}>
                    {doc.title}
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                    {doc.revision} • {doc.fileSize}
                  </p>
                </div>
              </div>

              <div style={{ color: '#0EA5E9', padding: '0.5rem' }}>
                <Download size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          :global(.product-hero-grid) {
            grid-template-columns: 460px 1fr !important;
          }
        }
        :global(.doc-card:hover) {
          border-color: #0EA5E9 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};
