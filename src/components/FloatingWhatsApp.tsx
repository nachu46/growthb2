'use client';

import React from 'react';

import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export const FloatingWhatsApp: React.FC = () => {
  const handleClick = () => {
    const text = encodeURIComponent('Hello Growth International Sales Desk, I would like to inquire about industrial thermal insulation supply.');
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
        zIndex: 90,
        cursor: 'pointer',
        border: '2px solid #FFFFFF',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      title="Chat with Regional Sales Desk on WhatsApp"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon size={28} color="#FFFFFF" />
    </button>
  );
};
