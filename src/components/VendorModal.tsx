'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Award, Download } from 'lucide-react';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: any | null;
}

export const VendorModal: React.FC<VendorModalProps> = ({ isOpen, onClose, vendor }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !vendor || !mounted || typeof document === 'undefined') return null;

  const handleDownloadCert = () => {
    const text = encodeURIComponent(`Hello Quality & Compliance Desk, please provide an official stamped copy of ${vendor.name} Approval Certificate (${vendor.vendorId}).`);
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 110,
        display: 'grid',
        placeItems: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
    >
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '2rem 2.25rem',
        maxWidth: '550px',
        width: '100%',
        maxHeight: 'min(85vh, 600px)',
        overflowY: 'auto',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--navy-dark)', fontWeight: 800, fontSize: '0.8rem' }}>
            <Award size={18} color="var(--primary-red)" />
            <span>OFFICIAL TIER-1 VENDOR REGISTRATION</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            style={{
              padding: '0.6rem',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <X size={18} />
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
    </div>,
    document.body
  );
};
