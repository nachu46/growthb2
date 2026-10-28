'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/data/mockData';
import { useCategories } from '@/hooks/useCategories';
import { categoryForPillar } from '@/data/categories';
import { Plus, Download, FileText, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';


interface ProductDetailViewProps {
  product: ProductItem;
  onAddRfqItem: (product: ProductItem, qty: number, form: string, thickness: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddRfqItem }) => {
  const forms = product.fabricationForms || [];
  const thicknesses = product.thicknesses || [];
  const [selectedForm, setSelectedForm] = useState<string>(forms[0] || '');
  const [selectedThickness, setSelectedThickness] = useState<string>(thicknesses[1] || thicknesses[0] || '');
  const [quantity, setQuantity] = useState<number>(500);

  const categories = useCategories();
  const pillarLabel = categoryForPillar(categories, product.pillar)?.name || product.pillar;
  const stockLevel = product.stockLevel || (product.inStock ? 'High' : 'On Order');
  const stockDot = stockLevel === 'High' ? '#10B981' : stockLevel === 'On Order' ? 'var(--slate-400)' : '#F59E0B';
  const stockText = stockLevel === 'On Order' ? 'Available on Order' : `${stockLevel} Stock Available`;

  const requestDocUrl = (title: string) =>
    `https://wa.me/9715309555?text=${encodeURIComponent(`Hello Technical Desk, please send the latest "${title}" for ${product.name}.`)}`;

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '1rem 1.5rem 4rem 1.5rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)', margin: '0.5rem 0 1.5rem 0', fontWeight: 600 }}>
        <Link href="/products" style={{ color: 'var(--slate-500)', textDecoration: 'none' }}>Products</Link> &gt;{' '}
        <Link href={`/products?pillar=${encodeURIComponent(product.pillar.toLowerCase())}`} style={{ color: 'var(--slate-500)', textDecoration: 'none' }}>{pillarLabel}</Link> &gt;{' '}
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
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-300)',
              color: 'var(--slate-900)',
              fontSize: '0.725rem',
              fontWeight: 700,
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>ARAMCO APP.</span>
            </div>
          )}

          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', marginTop: '2rem' }}
            />
          ) : (
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
              Product image coming soon
            </div>
          </div>
          )}
        </div>

        {/* Right Column: Product Specs & Ordering Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Title & Description */}
          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 700,
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
          {forms.length > 0 && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-900)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              1. SELECT FABRICATION FORM:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {forms.map((form, idx) => {
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
                      fontWeight: 700,
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
          )}

          {/* 2. SELECT THICKNESS (MM) */}
          {thicknesses.length > 0 && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-900)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              2. SELECT THICKNESS (MM):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {thicknesses.map((th, idx) => {
                const isActive = selectedThickness === th;
                const isCustom = th.trim().startsWith('+');
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedThickness(th)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isActive ? '2px solid #0EA5E9' : isCustom ? '1.5px dashed var(--slate-300)' : '1px solid var(--slate-300)',
                      backgroundColor: isActive ? '#F0F9FF' : '#FFFFFF',
                      color: isActive ? '#0EA5E9' : isCustom ? 'var(--slate-500)' : 'var(--slate-800)',
                      fontWeight: 700,
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
          )}

          {/* Stock status + quantity + add to RFQ, one card as in the design */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid var(--slate-200)',
          }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', paddingBottom: '0.9rem', marginBottom: '1rem', borderBottom: '1px solid var(--slate-200)' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: stockDot, marginTop: '6px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)' }}>{stockText}</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>
                {product.stockHub ? `Ready for dispatch from ${product.stockHub}` : product.leadTime}
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
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
                  style={{ padding: '0.6rem 0.85rem', color: 'var(--slate-600)', fontWeight: 700, fontSize: '1rem' }}
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  aria-label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(10000000, parseInt(e.target.value, 10) || 1)))}
                  style={{
                    width: '70px',
                    textAlign: 'center',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 50)}
                  style={{ padding: '0.6rem 0.85rem', color: 'var(--slate-600)', fontWeight: 700, fontSize: '1rem' }}
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
                minWidth: 'min(100%, 220px)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.9rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontWeight: 700,
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
      </div>

      {/* Physical & Thermal Properties Table (Matches Screenshot 2) */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
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
          <table className="props-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--slate-200)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.725rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  PHYSICAL PROPERTY
                </th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.725rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TEST METHOD / STANDARD
                </th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.725rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                      fontWeight: 700,
                      color: 'var(--slate-700)',
                      fontFamily: 'monospace',
                    }}>
                      {row.testMethod}
                    </span>
                  </td>
                  <td style={{
                    padding: '1.1rem 1.5rem',
                    fontWeight: 700,
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
            Associated Technical Documentation
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '1.25rem',
        }}>
          {(product.technicalDocs || []).map(doc => {
            const hasFile = Boolean(doc.downloadUrl);
            return (
            <a
              key={doc.id}
              href={hasFile ? doc.downloadUrl : requestDocUrl(doc.title)}
              {...(hasFile ? { download: doc.fileName || true } : { target: '_blank', rel: 'noopener noreferrer' })}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--slate-200)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              className="doc-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
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
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '2px' }}>
                    {doc.title}
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--slate-500)', fontWeight: 500 }}>
                    {hasFile ? [doc.revision, doc.fileSize].filter(Boolean).join(' • ') : 'Available on request'}
                  </p>
                </div>
              </div>

              <div style={{ color: '#0EA5E9', padding: '0.25rem', flexShrink: 0 }} aria-label={hasFile ? 'Download' : 'Request via WhatsApp'}>
                {hasFile ? <Download size={20} /> : <WhatsAppIcon size={20} color="#25D366" />}
              </div>
            </a>
            );
          })}
          {(product.technicalDocs || []).length === 0 && (
            <a
              href={requestDocUrl('technical data sheets')}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0EA5E9', textDecoration: 'none' }}
            >
              Request TDS / SDS documents via WhatsApp <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          :global(.product-hero-grid) {
            grid-template-columns: 460px 1fr !important;
          }
        }
        /* Phones: each property row becomes a stacked card (name + method, value underneath) */
        @media (max-width: 640px) {
          :global(.props-table thead) {
            display: none;
          }
          :global(.props-table tr) {
            display: grid !important;
            grid-template-columns: 1fr auto;
            padding: 0.9rem 1rem;
            gap: 0.35rem 0.75rem;
          }
          :global(.props-table td) {
            padding: 0 !important;
          }
          :global(.props-table td:last-child) {
            grid-column: 1 / -1;
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
