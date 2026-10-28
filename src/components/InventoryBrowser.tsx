'use client';

import React from 'react';
import Link from 'next/link';
import { ProductItem } from '@/data/mockData';
import { useCategories } from '@/hooks/useCategories';

interface InventoryBrowserProps {
  // Kept for existing callers; pills now open the filtered Master Catalog instead
  onAddRfqItem?: (product: ProductItem) => void;
}

const INDUSTRIES = [
  { id: 'Oil & Gas', label: 'Oil & Gas' },
  { id: 'HVAC', label: 'HVAC' },
  { id: 'Chemical', label: 'Chemical' },
  { id: 'Electro-Mechanical', label: 'Electro-Mechanical' },
  { id: 'Industrial Commercial', label: 'Industrial Commercial' },
];

export const InventoryBrowser: React.FC<InventoryBrowserProps> = () => {
  const categories = useCategories();

  return (
    <section id="inventory-section" style={{
      padding: '1.5rem 1.25rem',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
    }}>
      <div className="lens-outer">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--slate-900)',
            marginBottom: '0.35rem',
            letterSpacing: '-0.02em',
          }}>
            Browse Certified Industrial Inventory By Material Category
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
            Dual-lens discovery mapping live inventory to EPC technical specifications.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Lens 1: material pillar */}
          <div className="lens-card">
            <div className="lens-icon lens-icon--blue"><span /></div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 className="lens-title">1. Browse by Material Pillar</h3>
              <p className="lens-sub">Select a structural pillar to check real-time availability and compliance data:</p>
              <div className="lens-pills">
                {categories.map(cat => (
                  <Link key={cat.slug} href={`/products?pillar=${encodeURIComponent(cat.slug)}`} className="lens-pill">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Lens 2: industry application */}
          <div className="lens-card">
            <div className="lens-icon lens-icon--red"><span /></div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 className="lens-title">2. Browse by Industry Application</h3>
              <p className="lens-sub">Cross-reference material data mapped to specific environmental approvals:</p>
              <div className="lens-pills">
                {INDUSTRIES.map(item => (
                  <Link key={item.id} href={`/products?industry=${encodeURIComponent(item.id)}`} className="lens-pill lens-pill--red">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lens-outer {
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid var(--slate-200);
          padding: clamp(1.25rem, 4vw, 2.25rem) clamp(1rem, 4vw, 2.25rem);
        }
        .lens-card {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          background-color: #f8fafc;
          border: 1px solid var(--slate-200);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
        }
        .lens-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .lens-icon--blue {
          border: 2.5px solid #0ea5e9;
          background: #e0f2fe;
        }
        .lens-icon--red {
          border: 2.5px solid var(--primary-red);
          background: #ffffff;
        }
        .lens-icon--red span {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--primary-red);
        }
        .lens-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--slate-900);
          margin-bottom: 2px;
        }
        .lens-sub {
          font-size: 0.8rem;
          color: var(--slate-500);
          margin-bottom: 0.85rem;
        }
        .lens-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .lens-pills :global(.lens-pill) {
          padding: 0.45rem 1.1rem;
          border-radius: 9999px;
          background: #ffffff;
          border: 1px solid var(--slate-300);
          color: var(--slate-800);
          font-weight: 600;
          font-size: 0.8rem;
          text-decoration: none;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .lens-pills :global(.lens-pill:hover) {
          border-color: #0ea5e9;
          color: #0ea5e9;
        }
        .lens-pills :global(.lens-pill--red:hover) {
          border-color: var(--primary-red);
          color: var(--primary-red);
        }
        @media (max-width: 640px) {
          .lens-card {
            padding: 1rem;
            gap: 0.85rem;
          }
          .lens-icon {
            width: 40px;
            height: 40px;
          }
          .lens-icon--red span {
            width: 24px;
            height: 24px;
          }
          .lens-pills {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};
