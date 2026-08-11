'use client';

import React from 'react';
import { X, Award, ShieldCheck, Download, Calendar, MapPin, Building } from 'lucide-react';

interface CorporateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorporateProfileModal: React.FC<CorporateProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const timelineEvents = [
    { year: '2014', title: 'Founded in UAE', desc: 'Established Growth International L.L.C. in Ajman, UAE specializing in thermal insulation.' },
    { year: '2017', title: 'Saudi Aramco Qualification', desc: 'Achieved pre-qualified Aramco Vendor status (10114402) for Oil & Gas megaprotection.' },
    { year: '2020', title: 'Regional Expansion', desc: 'Opened logistics hubs and warehousing facilities in Dammam, Kuwait, and Qatar.' },
    { year: '2023', title: 'In-House Fabrication Workshop', desc: 'Commissioned automated PSMB hot-melt lamination line and cellular glass shaping machinery.' },
    { year: '2026', title: '18-Year Leadership Network', desc: 'Over 14,000 metric tons of stock ready across 9 regional offices in 6 countries.' },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        maxWidth: '750px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Corporate Profile & History
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Growth International L.L.C.
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
              Anchoring Middle East Industrial & Commercial Thermal Insulation Supply.
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '0.5rem', color: 'var(--slate-500)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-red)' }}>18+ Yrs</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 600 }}>Leadership Expertise</div>
          </div>
          <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-dark)' }}>9 Offices</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 600 }}>6 GCC Countries</div>
          </div>
          <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0EA5E9' }}>ISO 9001</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 600 }}>Quality Certified</div>
          </div>
        </div>

        {/* Timeline */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
          Milestone Timeline
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          {timelineEvents.map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--navy-dark)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.8rem',
              }}>
                {ev.year}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-900)' }}>{ev.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>{ev.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => {
              const dummyBlob = new Blob(['Growth International Full Corporate Profile 2026'], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(dummyBlob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Growth-International-Corporate-Profile-2026.pdf';
              document.body.appendChild(a);
              a.click();
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.9rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-red)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.95rem',
            }}
          >
            <Download size={18} />
            <span>Download Corporate Profile (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
