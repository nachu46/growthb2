'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/emblem.png" alt="Growth International" style={{ width: '56px', height: '56px', objectFit: 'contain', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--primary-red)' }}>Growth</span> International
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>Sign in to the Admin Control Center</p>
        </div>

        {error && (
          <div className="login-error" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label htmlFor="admin-email" className="login-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} className="login-icon" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="login-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} className="login-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="login-eye"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-submit">
            <span>{loading ? 'Signing in…' : 'Sign In'}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <Link href="/" className="login-back">
          <ArrowLeft size={15} /> Back to website
        </Link>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border: 1px solid var(--slate-200);
          border-radius: 20px;
          padding: 2.5rem 2rem 2rem 2rem;
        }
        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fde7ea;
          border: 1px solid #fbc4cc;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: var(--primary-red);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .login-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--slate-600);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.4rem;
        }
        .login-card :global(.login-icon) {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--slate-400);
          pointer-events: none;
        }
        .login-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          border-radius: 10px;
          background: #ffffff;
          border: 1.5px solid var(--slate-300);
          color: var(--slate-900);
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
        }
        .login-input:focus {
          border-color: var(--slate-900);
        }
        .login-eye {
          position: absolute;
          right: 0.6rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--slate-500);
          padding: 0.35rem;
          display: flex;
        }
        .login-submit {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.9rem;
          border-radius: 10px;
          background: var(--primary-red);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .login-submit:disabled {
          opacity: 0.7;
          cursor: wait;
        }
        .login-card :global(.login-back) {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--slate-500);
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
