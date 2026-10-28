'use client';

import React from 'react';
import { GccLogisticsMap } from './GccLogisticsMap';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroSectionProps {
  onOpenProfile: () => void;
}

const WHATSAPP_PROCUREMENT_URL = `https://wa.me/9715309555?text=${encodeURIComponent(
  'Hello Growth International Procurement Desk, I would like to discuss a direct material procurement requirement.'
)}`;

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenProfile }) => {
  return (
    <section style={{
      position: 'relative',
      padding: '2.5rem 1.5rem 2.5rem 1.5rem',
    }}>
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2.5rem',
        alignItems: 'center',
      }} className="hero-responsive-grid">
        {/* Left Hero Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', minWidth: 0 }}>
          <h1 style={{
            fontSize: 'clamp(2.1rem, 4.6vw, 3.6rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            color: 'var(--slate-900)',
            letterSpacing: '-0.025em',
          }}>
            Elite GCC Industrial Thermal Insulation &amp; Mechanical Supply
          </h1>

          <p style={{
            fontSize: '1rem',
            color: 'var(--slate-600)',
            maxWidth: '560px',
            lineHeight: 1.6,
          }}>
            Founded in 2014. Anchoring an elite regional supply network backed by leadership with over 18 years of specialized Middle East expertise.
          </p>

          {/* Actions + live warehousing stat */}
          <div className="hero-actions">
            <a
              href={WHATSAPP_PROCUREMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn--dark"
            >
              <WhatsAppIcon size={18} color="#25D366" />
              Direct Procurement via WhatsApp
            </a>

            <button onClick={onOpenProfile} className="hero-btn hero-btn--outline">
              Open Corporate Profile
            </button>

            <div className="hero-stat">
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Warehousing
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', lineHeight: 1.2 }}>
                9 Offices
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--slate-500)', fontWeight: 500 }}>
                Active Supply in 6 Countries
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Column: GCC hub map */}
        <div style={{ position: 'relative', minWidth: 0 }}>
          <GccLogisticsMap />
        </div>
      </div>

      <style jsx>{`
        .hero-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.4rem;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-align: center;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          line-height: 1.25;
          text-decoration: none;
          cursor: pointer;
        }
        .hero-btn--dark {
          background-color: var(--slate-900);
          color: #ffffff;
          border: 1.5px solid var(--slate-900);
        }
        .hero-btn--dark:hover {
          background-color: #1e293b;
        }
        .hero-btn--outline {
          background-color: #ffffff;
          color: var(--slate-900);
          border: 1.5px solid var(--slate-300);
        }
        .hero-btn--outline:hover {
          border-color: var(--slate-900);
        }
        .hero-stat {
          background: #ffffff;
          border: 1.5px solid var(--slate-200);
          border-radius: 12px;
          padding: 0.55rem 0.9rem;
        }
        @media (min-width: 768px) {
          .hero-actions {
            flex-direction: row;
            align-items: stretch;
          }
          .hero-btn {
            max-width: 220px;
          }
        }
        @media (min-width: 1024px) {
          :global(.hero-responsive-grid) {
            grid-template-columns: 1.1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
