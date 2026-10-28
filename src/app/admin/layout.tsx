'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, Package, Building2, Handshake, Award, FolderGit2, FileText, MapPin, Inbox, FileSpreadsheet, History, LogOut, ExternalLink, ShieldCheck, ArrowRight, Tags } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Phones/tablets: the sidebar is a drawer; close it after navigating or on Escape
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
        Loading Admin Control Panel...
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Company Logos', href: '/admin/company-logos', icon: Building2 },
    { label: 'Supply Partners', href: '/admin/partners', icon: Handshake },
    { label: 'Products Catalog', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Tags },
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
      {sidebarOpen && <div className="admin-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden />}

      {/* Clean White Admin Sidebar Navigation */}
      <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`} aria-label="Admin navigation" style={{
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
          {/* Brand Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.5rem 1.25rem 0.5rem', borderBottom: '1px solid #E1E3E5', marginBottom: '1rem' }}>
            <img
              src="/emblem.png"
              alt="Growth International L.L.C emblem"
              style={{
                height: '34px',
                width: '34px',
                objectFit: 'contain',
              }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                <span style={{ color: 'var(--primary-red)' }}>Growth</span>{' '}
                <span style={{ color: '#1A1A1A' }}>Admin</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#616161', fontWeight: 600 }}>B2B Control Center</div>
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
            <span>View Public Store <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} /></span>
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
          padding: '0.85rem clamp(1rem, 3vw, 2rem)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="admin-menu-btn"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ADMIN CONTROL PANEL
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="admin-role-badge" style={{
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
            <div className="admin-email" style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1A1A1A' }}>
              {adminUser?.email || 'admin@growthme.com'}
            </div>
          </div>
        </header>

        <main className="admin-main" style={{ padding: 'clamp(1rem, 3vw, 2rem)', flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        .admin-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid #e1e3e5;
          color: #303030;
        }
        .admin-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          z-index: 60;
        }
        /* Wide tables scroll inside their card instead of squashing */
        .admin-main div:has(> table) {
          overflow-x: auto;
        }
        .admin-main table {
          min-width: 640px;
        }
        @media (max-width: 1023px) {
          .admin-menu-btn {
            display: inline-flex;
          }
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 70;
            overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.22s ease;
          }
          .admin-sidebar.is-open {
            transform: translateX(0);
          }
          .admin-role-badge {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .admin-email {
            max-width: 160px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.8rem !important;
          }
          /* Page title rows and toolbars wrap; side-by-side form fields stack */
          .admin-main [style*="justify-content: space-between"] {
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .admin-main [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .admin-main h1 {
            font-size: 1.4rem !important;
          }
        }
      `}</style>
    </div>
  );
}
