'use client';

import React from 'react';
import { X, ShieldCheck, Download } from 'lucide-react';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: any | null;
}

export const VendorModal: React.FC<VendorModalProps> = ({ isOpen, onClose, vendor }) => {
  if (!isOpen || !vendor) return null;

  const handleDownloadCert = () => {
    const text = encodeURIComponent(`Hello Quality & Compliance Desk, please provide an official stamped copy of ${vendor.name} Approval Certificate (${vendor.vendorId}).`);
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
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
        maxWidth: '550px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 800, fontSize: '0.8rem' }}>
            <ShieldCheck size={18} />
            <span>VERIFIED TIER-1 VENDOR APPROVAL</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--slate-400)', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
          {vendor.name}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
          {vendor.status || 'Active Registered Vendor'}
        </p>

        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '16px',
          border: '1px solid var(--slate-200)',
          padding: '1.25rem',
          marginBottom: '2rem',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '4px' }}>
            OFFICIAL REGISTRATION NUMBER
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--slate-900)', letterSpacing: '0.15em' }}>
            {vendor.vendorId}
          </div>
        </div>

        <button
          onClick={handleDownloadCert}
          style={{
            width: '100%',
            padding: '0.9rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-red)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 16px -4px rgba(225, 29, 72, 0.4)',
          }}
        >
          Request Official Certificate Copy →
        </button>
      </div>
    </div>
  );
};
