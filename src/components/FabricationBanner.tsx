'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench } from 'lucide-react';

export const FabricationBanner: React.FC = () => {
  return (
    <section id="fabrication-section" style={{
      padding: '2rem 1.25rem 4rem 1.25rem',
      maxWidth: '1280px',
      margin: '0 auto',
    }}>
      {/* Mobile Fabrication Card (Matches Mobile Screenshot 5) */}
      <div style={{
        backgroundColor: 'var(--navy-dark)',
        borderRadius: '24px',
        padding: '2.5rem 1.75rem',
        color: '#FFFFFF',
        boxShadow: '0 20px 40px -10px rgba(11, 19, 43, 0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span style={{
            display: 'inline-block',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(225, 29, 72, 0.2)',
            color: '#FF6B81',
            border: '1px solid rgba(225, 29, 72, 0.4)',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            marginBottom: '1rem',
          }}>
            BEYOND TRADING
          </span>

          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}>
            In-House Fabrication Capabilities
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--slate-300)',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}>
            Cellular Glass Fabrication • Lamination • Embossing • Corrugation • Fitting
          </p>

          <Link
            href="/#fabrication-section"
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.95rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FFFFFF',
              color: 'var(--navy-dark)',
              fontWeight: 800,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
          >
            <span>Explore Engineering →</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
