'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: 'var(--slate-900)' }}>
      <Navbar
        rfqCount={0}
        onOpenRfqQueue={() => {}}
        onOpenProfile={() => {}}
      />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--slate-200)',
          padding: '4rem 2rem',
          maxWidth: '650px',
          margin: '0 auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            backgroundColor: '#FFE4E6',
            color: 'var(--primary-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            fontWeight: 900,
            fontSize: '1.75rem',
          }}>
            404
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
            Page Not Found
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '2rem' }}>
            The specification or URL you requested could not be located in our active material catalog.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--navy-dark)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              <Home size={18} />
              <span>Return Home</span>
            </Link>

            <Link
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFFFFF',
                color: 'var(--slate-900)',
                border: '1.5px solid var(--slate-300)',
                fontWeight: 800,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              <Search size={18} />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer onOpenProfile={() => {}} />
    </div>
  );
}
