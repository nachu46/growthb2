'use client';

import React, { useState } from 'react';
import { MATERIAL_PILLARS, GCC_HUBS } from '@/data/mockData';
import { ChevronDown, CheckCircle2, MessageCircle } from 'lucide-react';

export const OrderingWidget: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState('Insulation');
  const [selectedVolume, setSelectedVolume] = useState('5,000+ Sq. Meters');
  const [selectedHub, setSelectedHub] = useState('uae-hq');

  const handleCalculateQuote = () => {
    const hubObj = GCC_HUBS.find(h => h.id === selectedHub) || GCC_HUBS[0];
    const message = `Hello Growth International Sales Desk,\n\nI would like a direct volume quote for:\n- Material Pillar: ${selectedPillar}\n- Estimated Volume: ${selectedVolume}\n- Delivery Hub: ${hubObj.name} (${hubObj.status})\n\nPlease send custom pricing matrix and dispatch lead time.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/9715309555?text=${encoded}`, '_blank');
  };

  const trustPoints = [
    {
      title: 'Direct Engineering Alignment',
      subtitle: 'Live product data mapped to rigorous EPC standards.',
    },
    {
      title: 'Zero Automated Chatbots',
      subtitle: 'Complex commercial negotiations require humans.',
    },
    {
      title: 'Transparent Mechanical Warranty',
      subtitle: 'Standardized warranty periods clearly displayed.',
    },
    {
      title: 'Whatsapp Support',
      subtitle: 'Connect instantly with regional management.',
    },
    {
      title: 'Direct Sales Management Bypass',
      subtitle: 'Connect instantly with regional management.',
    },
    {
      title: 'Direct Sales Management Bypass',
      subtitle: 'Connect instantly with regional management.',
    },
  ];

  return (
    <section style={{
      padding: '3rem 1.25rem',
      maxWidth: '1280px',
      margin: '0 auto',
    }}>
      {/* Outer Card Container (Matches Desktop Screenshot) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid var(--slate-200)',
        padding: '2.5rem 2rem',
        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--slate-900)',
            marginBottom: '0.4rem',
            letterSpacing: '-0.02em',
          }}>
            Streamline Your Ordering
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
            Calculate bulk affordability and bypass automated gates to access regional sales management directly.
          </p>
        </div>

        {/* Top Form Row (Horizontal on Desktop, Stacked on Mobile) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          alignItems: 'center',
          marginBottom: '2.5rem',
        }}>
          {/* Input 1: Material Pillar with Red Border (Matches Screenshot) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '2px solid var(--primary-red)',
            padding: '0.75rem 1.15rem',
            boxShadow: '0 2px 8px rgba(225, 29, 72, 0.08)',
          }}>
            <label style={{ display: 'block', fontSize: '0.675rem', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
              MATERIAL PILLAR
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedPillar}
                onChange={(e) => setSelectedPillar(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--slate-900)',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  paddingRight: '1.5rem',
                }}
              >
                <option value="Select Material...">Select Material...</option>
                {MATERIAL_PILLARS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-red)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Input 2: Estimated Volume */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid var(--slate-200)',
            padding: '0.75rem 1.15rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.675rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
              ESTIMATED VOLUME
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedVolume}
                onChange={(e) => setSelectedVolume(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--slate-900)',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  paddingRight: '1.5rem',
                }}
              >
                <option value="5,000+ Sq. Meters">5,000+ Sq. Meters</option>
                <option value="1,000+ Sq. Meters">1,000+ Sq. Meters</option>
                <option value="10,000+ Sq. Meters (Project Scale)">10,000+ Sq. Meters (Project Scale)</option>
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Input 3: Delivery Hub */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid var(--slate-200)',
            padding: '0.75rem 1.15rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.675rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
              DELIVERY HUB
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--slate-900)',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  paddingRight: '1.5rem',
                }}
              >
                {GCC_HUBS.map(hub => (
                  <option key={hub.id} value={hub.id}>{hub.name}</option>
                ))}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Action Button: Whatsapp Live Quote → (Matches Screenshot) */}
          <button
            onClick={handleCalculateQuote}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '1.05rem 1.35rem',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-red)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              boxShadow: '0 8px 20px rgba(225, 29, 72, 0.3)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <MessageCircle size={20} fill="#FFFFFF" color="var(--primary-red)" />
            <span>Whatsapp Live Quote →</span>
          </button>
        </div>

        {/* Bottom Trust Benefits Card Container (Matches Desktop Screenshot) */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '20px',
          border: '1px solid var(--slate-200)',
          padding: '2rem',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem 2.5rem',
          }}>
            {trustPoints.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#D1FAE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                  flexShrink: 0,
                }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', lineHeight: 1.4 }}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
