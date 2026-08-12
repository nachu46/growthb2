'use client';

import React from 'react';
import Link from 'next/link';
import { GccLogisticsMap } from './GccLogisticsMap';
import { FileText, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onOpenProfile: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenProfile }) => {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: '3rem 1.5rem 4rem 1.5rem',
      backgroundColor: '#F8FAFC',
    }}>
      {/* Background Soft Radial Mesh Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(225, 29, 72, 0.08) 0%, rgba(248, 250, 252, 0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '3rem',
        alignItems: 'center',
      }} className="hero-responsive-grid">
        {/* Left Hero Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Eyebrow */}
          <div>
            <span style={{
              fontSize: '0.825rem',
              fontWeight: 800,
              color: 'var(--primary-red)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              B2B INDUSTRIAL SUPPLY
            </span>
          </div>

          {/* Headline (Matches Mobile Screenshot 1) */}
          <h1 style={{
            fontSize: 'clamp(2.1rem, 4.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'var(--slate-900)',
            letterSpacing: '-0.03em',
          }}>
            Mechanical Elite GCC Thermal &
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--slate-600)',
            maxWidth: '580px',
            lineHeight: 1.6,
          }}>
            Anchoring a regional supply network backed by over 18 years of specialized Middle East EPC expertise.
          </p>

          {/* Action Buttons (Matches Mobile Screenshot 1: Stacked Pill Buttons) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            marginTop: '0.5rem',
          }} className="hero-button-group">
            {/* Primary Navy Pill Button */}
            <Link
              href="#inventory-section"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.95rem 1.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--navy-dark)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 10px 25px -5px rgba(11, 19, 43, 0.4)',
                textAlign: 'center',
              }}
            >
              <span>Access Live Inventory</span>
            </Link>

            {/* Outline Pill Button */}
            <button
              onClick={onOpenProfile}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.95rem 1.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FFFFFF',
                color: 'var(--slate-800)',
                border: '1.5px solid var(--slate-300)',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                textAlign: 'center',
              }}
            >
              <span>Download Profile PDF</span>
            </button>
          </div>

          {/* Live Warehousing Info Box (Matches Mobile Screenshot 2) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--slate-200)',
            padding: '1.25rem 1.5rem',
            marginTop: '1rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.675rem', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                LIVE WAREHOUSING
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--slate-900)' }}>
                9 Regional Offices
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-500)' }}>
              6 Countries
            </div>
          </div>
        </div>

        {/* Right Hero Column: Interactive Vector GCC Map */}
        <div style={{ position: 'relative' }}>
          <GccLogisticsMap />
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          :global(.hero-button-group) {
            flex-direction: row !important;
          }
        }
        @media (min-width: 1024px) {
          :global(.hero-responsive-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
