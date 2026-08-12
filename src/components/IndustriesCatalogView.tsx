'use client';

import React, { useState } from 'react';
import { GCC_INDUSTRIES, IndustryAssembly } from '@/data/industriesData';
import { InventoryBrowser } from './InventoryBrowser';
import { BulkBomModal } from './BulkBomModal';
import { ProductItem, PRODUCTS_CATALOG } from '@/data/mockData';
import { Plus, MessageSquare, ArrowRight, ShieldCheck, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

interface IndustriesCatalogViewProps {
  onAddRfqItem: (product: ProductItem) => void;
}

export const IndustriesCatalogView: React.FC<IndustriesCatalogViewProps> = ({ onAddRfqItem }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryAssembly | null>(null);
  const [isBomModalOpen, setIsBomModalOpen] = useState(false);

  const handleOpenConsultation = () => {
    const text = encodeURIComponent('Hello Growth International Technical Engineering Team, I would like to request a free engineering consultation regarding pre-vetted material assemblies for our project.');
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  const handleContactEngineering = () => {
    const text = encodeURIComponent('Hello Technical Engineering Desk, we need assistance cross-referencing our environmental specs with active EPC vendor approvals.');
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  // Icon renderer for the 9 cards
  const renderCardIcon = (iconType: string, color: string) => {
    switch (iconType) {
      case 'tower':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 22V10M18 22V10M12 2v20M6 10h12M9 16h6" />
          </svg>
        );
      case 'power':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      case 'hvac':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18M3 12h18" />
          </svg>
        );
      case 'chemical':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v5.5L4.5 17A2 2 0 006.3 20h11.4a2 2 0 001.8-3L14 7.5V2" />
            <path d="M8.5 2h7M7 14h10" />
          </svg>
        );
      case 'marine':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12c4 0 4-3 8-3s4 3 8 3 4-3 8-3M2 17c4 0 4-3 8-3s4 3 8 3 4-3 8-3" />
          </svg>
        );
      case 'mep':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M4.2 19.8l2.8-2.8M17 7l2.8-2.8" />
          </svg>
        );
      case 'cryo':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
          </svg>
        );
      case 'water':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
        );
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1.25rem', fontWeight: 600 }}>
        Home &gt; <strong style={{ color: 'var(--slate-900)' }}>Industries</strong>
      </div>

      {/* Hero Dark Navy Card (Matches Screenshot 1) */}
      <div style={{
        backgroundColor: 'var(--navy-dark)',
        borderRadius: '24px',
        padding: '3rem 3rem',
        color: '#FFFFFF',
        boxShadow: '0 20px 40px -10px rgba(11, 19, 43, 0.5)',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Soft Background Gradient Glow */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.18) 0%, rgba(11, 19, 43, 0) 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }} className="industries-hero-grid">
          {/* Left Text Content */}
          <div>
            <span style={{
              fontSize: '0.825rem',
              fontWeight: 800,
              color: '#FF6B81',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.75rem',
            }}>
              Industries Application
            </span>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.2vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#FFFFFF',
              marginBottom: '1rem',
              letterSpacing: '-0.03em',
            }}>
              Browse Pre-Vetted Material Assemblies
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--slate-300)',
              maxWidth: '650px',
              lineHeight: 1.6,
            }}>
              Browse expert recommended pre-vetted material assemblies mapped directly to extreme environmental conditions. Select an industry to automatically filter the Master Catalog for compliant specifications.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'flex-end' }} className="hero-buttons-right">
            <button
              onClick={() => setIsBomModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                width: '100%',
                maxWidth: '280px',
                padding: '0.95rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-red)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                boxShadow: '0 10px 20px -5px rgba(225, 29, 72, 0.4)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus size={18} />
              <span>Upload AutoCAD / BOM</span>
            </button>

            <button
              onClick={handleOpenConsultation}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                width: '100%',
                maxWidth: '280px',
                padding: '0.95rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <MessageSquare size={18} fill="#FFFFFF" color="#10B981" />
              <span>Request for Free Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9 Industry Assembly Cards Grid (Matches Screenshots 2 & 3) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.75rem',
        marginBottom: '4rem',
      }}>
        {GCC_INDUSTRIES.map(ind => (
          <div
            key={ind.id}
            onClick={() => setSelectedIndustry(ind)}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid var(--slate-200)',
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
            className="industry-assembly-card"
          >
            <div>
              {/* Top Row: Icon Badge + Light Grey Arrow */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: ind.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {renderCardIcon(ind.iconType, ind.iconColor)}
                </div>
                <ArrowRight size={20} color="var(--slate-300)" />
              </div>

              {/* Title with Red Arrow */}
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--slate-900)',
                marginBottom: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                lineHeight: 1.2,
              }}>
                <span>{ind.title}</span>
                <span style={{ color: 'var(--primary-red)' }}>→</span>
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--slate-600)',
                lineHeight: 1.55,
                marginBottom: '1.5rem',
                minHeight: '65px',
              }}>
                {ind.description}
              </p>
            </div>

            {/* Bottom Divider & EPC Approved Materials */}
            <div>
              <div style={{ height: '1px', backgroundColor: 'var(--slate-100)', marginBottom: '1rem' }} />

              <div style={{ fontSize: '0.675rem', fontWeight: 800, color: 'var(--slate-500)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                EPC APPROVED MATERIALS:
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {ind.epcApprovedMaterials.map((mat, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      color: 'var(--slate-800)',
                      backgroundColor: 'var(--slate-100)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-200)',
                    }}
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Engineering Callout Banner (Matches Screenshot 3) */}
      <div style={{
        backgroundColor: 'var(--navy-dark)',
        borderRadius: '24px',
        padding: '3.5rem 2.5rem',
        textAlign: 'center',
        color: '#FFFFFF',
        marginBottom: '4rem',
        boxShadow: '0 20px 40px -10px rgba(11, 19, 43, 0.4)',
      }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Not sure which materials meet your environmental specs?
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--slate-300)', maxWidth: '700px', margin: '0 auto 2rem auto', lineHeight: 1.5 }}>
          Our technical engineers can cross-reference your site requirements with active EPC vendor approvals.
        </p>

        <button
          onClick={handleContactEngineering}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.9rem 2.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#0EA5E9',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            boxShadow: '0 10px 20px -5px rgba(14, 165, 233, 0.4)',
            cursor: 'pointer',
          }}
        >
          <span>Contact Engineering →</span>
        </button>
      </div>

      {/* Category Discovery Dual-Lens Section (Matches Screenshot 4) */}
      <InventoryBrowser
        onAddRfqItem={onAddRfqItem}
      />

      {/* Modals */}
      <BulkBomModal
        isOpen={isBomModalOpen}
        onClose={() => setIsBomModalOpen(false)}
      />

      {/* Industry Detail Assembly Drawer / Modal */}
      {selectedIndustry && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2.5rem',
            maxWidth: '650px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase' }}>
                  Pre-Vetted Material Assembly
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {selectedIndustry.title}
                </h3>
              </div>
              <button onClick={() => setSelectedIndustry(null)} style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--slate-500)' }}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.925rem', color: 'var(--slate-600)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {selectedIndustry.description}
            </p>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                EPC Approved Material Specifications:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedIndustry.epcApprovedMaterials.map((mat, i) => (
                  <span key={i} style={{ backgroundColor: '#FFFFFF', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-300)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-red)' }}>
                    ✓ {mat}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  // Add first approved item to RFQ
                  const matched = PRODUCTS_CATALOG.find(p => p.pillar.toLowerCase() === 'insulation') || PRODUCTS_CATALOG[0];
                  onAddRfqItem(matched);
                  setSelectedIndustry(null);
                }}
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-red)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                }}
              >
                Add Assembly Materials to RFQ
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 1024px) {
          :global(.industries-hero-grid) {
            grid-template-columns: 1fr 300px !important;
          }
        }
        :global(.industry-assembly-card:hover) {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
          border-color: var(--primary-red) !important;
        }
      `}</style>
    </div>
  );
};
