'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

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
        backgroundColor: 'var(--primary-red)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(225, 29, 72, 0.4)',
        zIndex: 90,
        cursor: 'pointer',
        border: '2px solid #FFFFFF',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      title="Chat with Regional Sales Desk on WhatsApp"
    >
      <MessageSquare size={24} fill="#FFFFFF" color="var(--primary-red)" />
    </button>
  );
};
