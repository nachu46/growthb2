'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const FabricationBanner: React.FC = () => {
  return (
    <section id="fabrication-section" style={{
      padding: '2.5rem 1.5rem',
      maxWidth: '1280px',
      margin: '0 auto',
    }}>
      <div style={{
        backgroundColor: '#0F172A',
        borderRadius: '24px',
        padding: '2.5rem 3rem',
        color: '#FFFFFF',
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.35)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
      }}>
        <div style={{ flex: '1 1 500px', minWidth: 0 }}>
          <div style={{
            color: '#E11D48',
            fontSize: '0.725rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}>
            BEYOND TRADING
          </div>

          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
          }}>
            In-House Fabrication Capabilities
          </h2>

          <p style={{
            fontSize: '0.9rem',
            color: '#94A3B8',
            lineHeight: 1.5,
            margin: 0,
          }}>
            Cellular Glass Fabrication • Lamination • Embossing • Corrugation • Pipe Fitting
          </p>
        </div>

        <div style={{ flexShrink: 0 }}>
          <Link
            href="/#fabrication-section"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.75rem',
              borderRadius: '9999px',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontWeight: 800,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Explore Engineering →</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
