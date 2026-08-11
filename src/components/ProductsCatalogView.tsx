'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, FileSpreadsheet, ArrowRight, ShieldCheck, Thermometer, Plus, Info, ExternalLink, RefreshCw, MessageSquare, Wrench } from 'lucide-react';
import { PRODUCTS_CATALOG, ProductItem } from '@/data/mockData';
import { BulkBomModal } from './BulkBomModal';

interface ProductsCatalogViewProps {
  onAddRfqItem: (product: ProductItem) => void;
}

export const ProductsCatalogView: React.FC<ProductsCatalogViewProps> = ({ onAddRfqItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillars, setSelectedPillars] = useState<string[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedCategoryCard, setSelectedCategoryCard] = useState<string | null>(null);
  const [isBomModalOpen, setIsBomModalOpen] = useState(false);

  const CATEGORY_CARDS = [
    {
      id: 'insulation',
      pillarName: 'Insulation',
      slug: 'foamglas-cellular-glass',
      title: 'Industrial Insulation',
      iconSvg: (
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 30L30 10L50 30" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 30L30 20L40 30" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      items: ['FOAMGLAS Blocks', 'Pyrogel Aerogel', 'PIR / PUR Rigid Foam', 'Elastomeric Nitrile'],
    },
    {
      id: 'jacketing',
      pillarName: 'Jacketing',
      slug: 'psmb-polysurlyn-jacketing',
      title: 'Metal Jacketing',
      iconSvg: (
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="20" r="14" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="30" cy="20" r="6" stroke="#94A3B8" strokeWidth="2" />
        </svg>
      ),
      items: ['Aluminium (Stucco/Smooth)', 'Stainless Steel 316L', 'Galvanized Iron (GI)', 'PolySurlyn™ Barrier'],
    },
    {
      id: 'acoustic',
      pillarName: 'Acoustic',
      slug: 'mineral-wool-pipe-section',
      title: 'Acoustic & Vapor',
      iconSvg: (
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="12" width="10" height="16" stroke="#CBD5E1" strokeWidth="2" rx="2" />
          <rect x="25" y="12" width="10" height="16" stroke="#CBD5E1" strokeWidth="2" rx="2" />
          <rect x="38" y="12" width="10" height="16" stroke="#CBD5E1" strokeWidth="2" rx="2" />
        </svg>
      ),
      items: ['Acoustic Lead Sheets', 'Mass Loaded Vinyl (MLV)', 'Bitumen Membranes', 'Poly-Scrim Kraft (PSK)'],
    },
    {
      id: 'accessories',
      pillarName: 'Accessories',
      slug: 'foamglas-cellular-glass',
      title: 'Accessories & Tapes',
      iconSvg: (
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="10" width="30" height="20" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" rx="3" />
        </svg>
      ),
      items: ['Fiber Glass Mesh', 'Pastes & Mastics', 'Aluminium Foil Tapes', 'Toggle Clips & Banding'],
    },
    {
      id: 'fits',
      pillarName: 'Fits',
      slug: 'foamglas-cellular-glass',
      title: 'Pre-Fabricated Fits',
      iconSvg: (
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 30V15C15 12.2386 17.2386 10 20 10H35" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
      items: ['Mitered 90° & 45° Elbows', 'Tee & Valve Covers', 'Pressed Barrel Heads', 'Cryogenic Pipe Supports'],
    },
    {
      id: 'valves',
      pillarName: 'Valves',
      slug: 'foamglas-cellular-glass',
      title: 'Valves & Refractory',
      iconSvg: (
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 10V22L38 30" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="30" cy="10" r="3" fill="#94A3B8" />
        </svg>
      ),
      items: ['Removable Insulation Blankets', 'Ceramic Fiber Gaskets', 'Calcium Silicate Boards', 'High-Temp Refractory'],
    },
  ];

  const handleTogglePillar = (pillarName: string) => {
    setSelectedPillars(prev =>
      prev.includes(pillarName) ? prev.filter(p => p !== pillarName) : [...prev, pillarName]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedPillars([]);
    setSelectedApprovals([]);
    setSelectedManufacturers([]);
    setSelectedCategoryCard(null);
    setSearchQuery('');
  };

  const handleContactEngineer = () => {
    const text = encodeURIComponent(`Hello Technical Engineering Desk, we searched for "${searchQuery || 'custom material'}" and need assistance cross-referencing equivalent approved EPC materials.`);
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  const handleCustomFabRequest = () => {
    const text = encodeURIComponent(`Hello Fabrication Desk, we need a custom milled/laminated specification for our project: ${searchQuery || 'Custom Substrate'}.`);
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  const filteredProducts = PRODUCTS_CATALOG.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSpec = p.compliance.toLowerCase().includes(q);
      const matchPillar = p.pillar.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchPillar) return false;
    }

    if (selectedCategoryCard && p.pillar.toLowerCase() !== selectedCategoryCard.toLowerCase()) {
      return false;
    }

    if (selectedPillars.length > 0) {
      const matchPillar = selectedPillars.some(sp => p.pillar.toLowerCase().includes(sp.toLowerCase()));
      if (!matchPillar) return false;
    }

    return true;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Top Ticker Notification Header */}
      <div style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.5rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.725rem',
        fontWeight: 800,
        color: 'var(--slate-700)',
        marginBottom: '2rem',
        letterSpacing: '0.04em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span>VERIFIED GCC VENDOR: ARAMCO 10114402 • SABIC 11047900 • ICV CERTIFIED</span>
        </div>
        <div>HQ: +971-6-530-9555 | SALES@GROWTHME.COM</div>
      </div>

      {/* Breadcrumb & Heading Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '0.5rem', fontWeight: 600 }}>
          Home &gt; <strong style={{ color: 'var(--slate-900)' }}>Products</strong>
        </div>

        <span style={{
          display: 'inline-block',
          padding: '0.3rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: '#FFE4E6',
          color: 'var(--primary-red)',
          fontSize: '0.7rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.75rem',
        }}>
          Browse Products
        </span>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 800,
          color: 'var(--slate-900)',
          marginBottom: '0.5rem',
          letterSpacing: '-0.03em',
        }}>
          Browse Certified Industrial
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--slate-600)' }}>
          Select a material category below or apply precision filters to generate a localized SKU catalog.
        </p>
      </div>

      {/* Main Grid: Left Sidebar + Right Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
      }} className="catalog-grid">
        {/* Left Sidebar ("Filter Parameters") */}
        <aside style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--slate-200)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          height: 'max-content',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Filter Parameters
            </h3>
            <button
              onClick={handleClearAllFilters}
              style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-red)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear All ✕
            </button>
          </div>

          {/* Filter Section 1: Material Pillar */}
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '0.875rem', color: 'var(--slate-900)', marginBottom: '0.85rem' }}>
              <span>Material Pillar</span>
              <ChevronDown size={16} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { name: 'Insulation (Cellular Glass)', pillar: 'Insulation', count: 48 },
                { name: 'Metal Jacketing (Al, Alu-St, SS)', pillar: 'Jacketing', count: 82 },
                { name: 'Accessories & Tapes', pillar: 'Accessories', count: 114 },
                { name: 'Acoustic & Vapor Barrier', pillar: 'Acoustic', count: 18 },
                { name: 'Valves & Refractory', pillar: 'Valves', count: 24 },
              ].map((item, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem', color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedPillars.includes(item.pillar)}
                      onChange={() => handleTogglePillar(item.pillar)}
                      style={{ accentColor: 'var(--primary-red)', cursor: 'pointer' }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>{item.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Section 2: Tier-1 EPC Approvals */}
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '0.875rem', color: 'var(--slate-900)', marginBottom: '0.85rem' }}>
              <span>Tier-1 EPC Approvals</span>
              <ChevronDown size={16} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Saudi ARAMCO', 'SABIC', 'ADNOC / TAKREER', 'ICV Certified Units'].map((name, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedApprovals.includes(name)}
                    onChange={() => {
                      setSelectedApprovals(prev =>
                        prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
                      );
                    }}
                    style={{ accentColor: 'var(--primary-red)', cursor: 'pointer' }}
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Section 3: Featured Manufacturers */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '0.875rem', color: 'var(--slate-900)', marginBottom: '0.85rem' }}>
              <span>Featured Manufacturers</span>
              <ChevronDown size={16} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Owens Corning', 'FOAMGLAS', 'Armacell', 'Aspen Aerogels'].map((mfr, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedManufacturers.includes(mfr)}
                    onChange={() => {
                      setSelectedManufacturers(prev =>
                        prev.includes(mfr) ? prev.filter(m => m !== mfr) : [...prev, mfr]
                      );
                    }}
                    style={{ accentColor: 'var(--primary-red)', cursor: 'pointer' }}
                  />
                  <span>{mfr}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Search Bar & Bulk Upload BOM Action */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <input
                type="text"
                placeholder="Search materials, specs (e.g., ASTM C552), or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-300)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>

            <button
              onClick={() => setIsBomModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFFFFF',
                color: 'var(--slate-900)',
                border: '1.5px solid var(--slate-300)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <FileSpreadsheet size={18} color="var(--primary-red)" />
              <span>Bulk Upload BOM</span>
            </button>
          </div>

          {/* Conditional Rendering: 0 Matches State vs Product Grid */}
          {filteredProducts.length === 0 ? (
            /* Zero Matches Search View (Matches Screenshot Home / Products / Not Found) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Main 0 Matches Container */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid var(--slate-200)',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  color: 'var(--slate-400)',
                }}>
                  <Search size={32} />
                </div>

                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  0 Standard Inventory Matches Found
                </h2>

                <p style={{ fontSize: '0.975rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
                  We couldn't find an exact match for <strong>"{searchQuery || 'your query'}"</strong>
                </p>

                <button
                  onClick={handleClearAllFilters}
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: '#0EA5E9',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Clear Search & View All Inventory ✕
                </button>
              </div>

              {/* 2 Alternative Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}>
                {/* Card 1: Require a Custom Spec? */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--slate-200)',
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#FFE4E6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-red)',
                      marginBottom: '1.25rem',
                    }}>
                      <Wrench size={20} />
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                      Require a Custom Spec?
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      Our ISO certified factory can mill, laminate, or corrugate substrate to your exact mechanical tolerances.
                    </p>
                  </div>

                  <button
                    onClick={handleCustomFabRequest}
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--primary-red)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Request Custom Fabrication +</span>
                  </button>
                </div>

                {/* Card 2: Need an EPC Alternative? */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--slate-200)',
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#E0F2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0EA5E9',
                      marginBottom: '1.25rem',
                    }}>
                      <MessageSquare size={20} />
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                      Need an EPC Alternative?
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      Our technical engineers can cross-reference your search with an equivalent approved material.
                    </p>
                  </div>

                  <button
                    onClick={handleContactEngineer}
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#0EA5E9',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Talk to an Engineer +</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 6 Category Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
              }}>
                {CATEGORY_CARDS.map(card => (
                  <div
                    key={card.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--slate-200)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div>
                      <div style={{
                        backgroundColor: 'var(--slate-50)',
                        borderRadius: 'var(--radius-sm)',
                        height: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        border: '1px dashed var(--slate-200)',
                      }}>
                        {card.iconSvg}
                      </div>

                      <Link href={`/products/${card.slug}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                          {card.title}
                        </h3>
                      </Link>

                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                        {card.items.map((sub, i) => (
                          <li key={i} style={{ fontSize: '0.8rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--slate-400)' }} />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/products/${card.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#0EA5E9',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <span>Open Product Page →</span>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Matched Product Items Listing */}
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
                  Matched SKU Catalog Items ({filteredProducts.length})
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem',
                }}>
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--slate-200)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase' }}>
                            {product.pillar}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{product.leadTime}</span>
                        </div>

                        <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                            {product.name}
                          </h4>
                        </Link>

                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '0.75rem' }}>
                          {product.description}
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', backgroundColor: 'var(--slate-50)', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>
                          Spec: <strong>{product.compliance}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => onAddRfqItem(product)}
                          style={{
                            flex: 1,
                            padding: '0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--navy-dark)',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '0.825rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <Plus size={14} />
                          <span>Add to RFQ</span>
                        </button>

                        <Link
                          href={`/products/${product.slug}`}
                          style={{
                            padding: '0.6rem 0.8rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--slate-300)',
                            color: '#0EA5E9',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                          }}
                        >
                          <span>View Specs</span>
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <BulkBomModal
        isOpen={isBomModalOpen}
        onClose={() => setIsBomModalOpen(false)}
      />

      <style jsx>{`
        @media (min-width: 1024px) {
          :global(.catalog-grid) {
            grid-template-columns: 280px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
