'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Building2,
  Handshake,
  Award,
  FolderGit2,
  FileText,
  MapPin,
  Inbox,
  FileSpreadsheet,
  History,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Check admin authentication session
    fetch('/api/admin/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          setLoading(false);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F6F6F7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#303030', fontWeight: 800 }}>
        Loading Shopify Admin CMS...
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Company Logos', href: '/admin/company-logos', icon: Building2 },
    { label: 'Supply Partners', href: '/admin/partners', icon: Handshake },
    { label: 'Products Catalog', href: '/admin/products', icon: Package },
    { label: 'Certifications', href: '/admin/certifications', icon: Award },
    { label: 'Project History', href: '/admin/project-history', icon: FolderGit2 },
    { label: 'Technical Resources', href: '/admin/resources', icon: FileText },
    { label: 'GCC Locations', href: '/admin/locations', icon: MapPin },
    { label: 'Customer RFQs', href: '/admin/rfq', icon: Inbox },
    { label: 'BOM Submissions', href: '/admin/bom', icon: FileSpreadsheet },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F6F6F7', color: '#303030' }}>
      {/* Clean White Shopify Admin Sidebar Navigation */}
      <aside style={{
        width: '250px',
        backgroundColor: '#FFFFFF',
        color: '#303030',
        borderRight: '1px solid #E1E3E5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 0.85rem',
        flexShrink: 0,
      }}>
        <div>
          {/* Brand Logo Header (Shopify Admin Style) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.5rem 1.25rem 0.5rem', borderBottom: '1px solid #E1E3E5', marginBottom: '1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1rem',
            }}>
              G
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1A1A1A' }}>Growth Admin</div>
              <div style={{ fontSize: '0.7rem', color: '#616161', fontWeight: 600 }}>Shopify B2B CMS</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#F1F1F1' : 'transparent',
                    color: isActive ? 'var(--primary-red)' : '#4A4A4A',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={18} color={isActive ? 'var(--primary-red)' : '#616161'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Public Site Link */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #E1E3E5', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              backgroundColor: '#F1F1F1',
              color: '#005BD3',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <span>View Public Store →</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              backgroundColor: '#FFF0F2',
              color: 'var(--primary-red)',
              border: '1px solid #FFD4D8',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Topbar */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E1E3E5',
          padding: '0.85rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SHOPIFY-STYLE ADMIN DASHBOARD
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#10B981',
              backgroundColor: '#EAF8F2',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #B7EAD4',
            }}>
              <ShieldCheck size={14} />
              <span>Role: ADMIN</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1A1A1A' }}>
              {adminUser?.email || 'admin@growthme.com'}
            </div>
          </div>
        </header>

        <main style={{ padding: '2rem', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
