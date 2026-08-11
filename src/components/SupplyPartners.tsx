'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

export const SupplyPartners: React.FC = () => {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPartners(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const defaultPartners = [
    { name: 'Owens Corning' },
    { name: 'Johns Manville' },
    { name: 'Armacell' },
    { name: 'FOAMGLAS' },
    { name: 'Aspen Aerogels' },
  ];

  const displayedList = partners.length > 0 ? partners : defaultPartners;

  return (
    <section style={{
      padding: '3rem 1.25rem',
      maxWidth: '1280px',
      margin: '0 auto',
    }}>
      {/* 2 Top Warranty & Chatbot Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {/* Card 1: Mechanical Warranty */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--slate-200)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0EA5E9',
            flexShrink: 0,
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2px' }}>
              Mechanical Warranty
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Standardized up to 10 years.
            </p>
          </div>
        </div>

        {/* Card 2: Zero Chatbots */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--slate-200)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#FFE4E6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-red)',
            flexShrink: 0,
          }}>
            <XCircle size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2px' }}>
              Zero Chatbots
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Direct access to regional sales.
            </p>
          </div>
        </div>
      </div>

      {/* Trusted by Tier 1 EPCs Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
          Trusted by Tier 1 EPCs
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Delivering structural thermal reliability to the most rigorous GCC projects.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {['ADNOC', 'SABIC', 'TAKREER', 'Saudi Aramco'].map((name, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--slate-200)',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                fontWeight: 900,
                fontSize: '0.95rem',
                color: 'var(--slate-900)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Supply Partners Section (Fetching from DB) */}
      <div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
          Featured Supply Partners
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {displayedList.map((partner, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid var(--slate-200)',
                padding: '1.15rem 1rem',
                textAlign: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: 'var(--slate-800)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
