'use client';

import React, { useState } from 'react';
import { MATERIAL_PILLARS, GCC_HUBS } from '@/data/mockData';
import { CustomSelect } from './CustomSelect';
import { ChevronDown, Award, MessageCircle } from 'lucide-react';

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
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 2.5rem',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        marginBottom: '3rem',
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

        {/* 4-Step Action Grid (Matches Screenshot Layout) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          alignItems: 'center',
          marginBottom: '2.5rem',
        }}>
          {/* Input 1: Material Pillar with Red Border */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '2px solid var(--primary-red)',
            padding: '0.75rem 1.15rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <label style={{ display: 'block', fontSize: '0.675rem', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
              MATERIAL PILLAR
            </label>
            <CustomSelect
              variant="hero"
              options={[
                { value: 'Select Material...', label: 'Select Material...' },
                ...MATERIAL_PILLARS.map(p => ({ value: p.id, label: p.label }))
              ]}
              value={selectedPillar}
              onChange={(val) => setSelectedPillar(val)}
              accentColor="var(--primary-red)"
            />
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
            <CustomSelect
              variant="hero"
              options={[
                { value: '5,000+ Sq. Meters', label: '5,000+ Sq. Meters' },
                { value: '1,000+ Sq. Meters', label: '1,000+ Sq. Meters' },
                { value: '10,000+ Sq. Meters (Project Scale)', label: '10,000+ Sq. Meters (Project Scale)' }
              ]}
              value={selectedVolume}
              onChange={(val) => setSelectedVolume(val)}
              accentColor="var(--slate-700)"
            />
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
            <CustomSelect
              variant="hero"
              options={GCC_HUBS.map(hub => ({ value: hub.id, label: hub.name }))}
              value={selectedHub}
              onChange={(val) => setSelectedHub(val)}
              accentColor="var(--slate-700)"
            />
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
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
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
                  <Award size={18} />
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
