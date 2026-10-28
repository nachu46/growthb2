'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, FileSpreadsheet, ArrowRight, Award, Thermometer, Plus, Info, ExternalLink, RefreshCw, MessageSquare, Wrench, X, ArrowDown } from 'lucide-react';
import { ProductItem } from '@/data/mockData';
import { useCatalogProducts } from '@/hooks/useCatalogProducts';
import { useCategories } from '@/hooks/useCategories';
import { categoryForPillar } from '@/data/categories';
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
  const { products: catalogProducts, loading: catalogLoading } = useCatalogProducts();
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean | undefined>>({});
  const toggleSection = (key: string) =>
    setOpenSections(prev => {
      const openByDefault = window.matchMedia('(min-width: 1024px)').matches;
      return { ...prev, [key]: !(prev[key] ?? openByDefault) };
    });
  const sectionClass = (key: string) => (openSections[key] === undefined ? '' : openSections[key] ? 'is-open' : 'is-closed');
  const [visibleCount, setVisibleCount] = useState(10);

  // Deep links from the home page lenses: /products?pillar=Insulation or ?industry=HVAC
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pillar = params.get('pillar');
    const industry = params.get('industry');
    if (pillar) setSelectedPillars([pillar.toLowerCase()]);
    if (industry) setIndustryFilter(industry);
  }, []);

  // Built-in line icons per category key; categories themselves come from Admin → Categories
  const BUILTIN_CARDS = [
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

  const categories = useCategories();
  const categoryName = (slug: string) => categoryForPillar(categories, slug)?.name || slug;
  const CATEGORY_CARDS = categories.map(c => ({
    id: c.slug,
    pillarName: c.slug,
    title: c.name,
    items: c.items,
    imageUrl: c.imageUrl,
    iconSvg: (BUILTIN_CARDS.find(b => b.id === c.slug) || BUILTIN_CARDS[0]).iconSvg,
  }));

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
    setIndustryFilter(null);
    setVisibleCount(10);
  };

  const handleContactEngineer = () => {
    const text = encodeURIComponent(`Hello Technical Engineering Desk, we searched for "${searchQuery || 'custom material'}" and need assistance cross-referencing equivalent approved EPC materials.`);
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  const handleCustomFabRequest = () => {
    const text = encodeURIComponent(`Hello Fabrication Desk, we need a custom milled/laminated specification for our project: ${searchQuery || 'Custom Substrate'}.`);
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  const APPROVAL_MATCHERS: Record<string, (p: ProductItem) => boolean> = {
    'Saudi ARAMCO': p => Boolean(p.aramcoApproved) || /aramco/i.test(p.compliance),
    'SABIC': p => /sabic/i.test(p.compliance) || (p.complianceBadges || []).some(b => /sabic/i.test(b)),
    'ADNOC / TAKREER': p => /adnoc|takreer/i.test(p.compliance),
    'ICV Certified Only': p => /icv/i.test(p.compliance),
  };

  const isFiltering = Boolean(
    searchQuery.trim() || selectedPillars.length || selectedApprovals.length || selectedManufacturers.length || industryFilter || selectedCategoryCard
  );

  const filteredProducts = catalogProducts.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const haystack = [p.name, p.compliance, p.pillar, p.manufacturer, p.description, p.slug].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (selectedCategoryCard && p.pillar.toLowerCase() !== selectedCategoryCard.toLowerCase()) return false;
    if (selectedPillars.length > 0 && !selectedPillars.some(sp => p.pillar.toLowerCase() === sp.toLowerCase())) return false;
    if (industryFilter && p.industry.toLowerCase() !== industryFilter.toLowerCase()) return false;
    if (selectedApprovals.length > 0 && !selectedApprovals.every(a => APPROVAL_MATCHERS[a]?.(p))) return false;
    if (selectedManufacturers.length > 0 && !selectedManufacturers.some(m => (p.manufacturer || '').toLowerCase().includes(m.toLowerCase()))) return false;
    return true;
  });

  const pillarCount = (pillar: string) => catalogProducts.filter(p => p.pillar.toLowerCase() === pillar.toLowerCase()).length;

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...selectedPillars.map(pl => ({ label: `Category: ${categoryName(pl)}`, onRemove: () => handleTogglePillar(pl) })),
    ...(industryFilter ? [{ label: `Industry: ${industryFilter}`, onRemove: () => setIndustryFilter(null) }] : []),
    ...selectedApprovals.map(a => ({ label: `EPC: ${a}`, onRemove: () => setSelectedApprovals(prev => prev.filter(x => x !== a)) })),
    ...selectedManufacturers.map(m => ({ label: `Brand: ${m}`, onRemove: () => setSelectedManufacturers(prev => prev.filter(x => x !== m)) })),
  ];

  const stockDot = (level?: string) => (level === 'High' ? '#10B981' : level === 'On Order' ? 'var(--slate-400)' : '#F59E0B');
  const stockLabel = (level?: string) => (level === 'High' ? 'High Stock' : level === 'Medium' ? 'Med. Stock' : level === 'Low' ? 'Low Stock' : 'On Order');

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '1rem 1.5rem 4rem 1.5rem' }}>
      {/* Breadcrumb & Heading Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)', margin: '0.5rem 0 1rem 0', fontWeight: 600 }}>
          <Link href="/" style={{ color: 'var(--slate-500)', textDecoration: 'none' }}>Home</Link> &gt;{' '}
          {isFiltering ? (
            <>
              <button onClick={handleClearAllFilters} style={{ color: 'var(--slate-500)', fontWeight: 600, fontSize: 'inherit' }}>Products</button> &gt;{' '}
              <strong style={{ color: 'var(--slate-900)' }}>{selectedPillars.length === 1 ? categoryName(selectedPillars[0]) : 'Catalog'}</strong>
            </>
          ) : (
            <strong style={{ color: 'var(--slate-900)' }}>Products</strong>
          )}
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 700,
          color: 'var(--slate-900)',
          margin: '0.6rem 0 0.4rem 0',
          letterSpacing: '-0.025em',
        }}>
          {isFiltering ? 'Master Industrial Catalog' : 'Browse Certified Industrial Materials'}
        </h1>

        <p style={{ fontSize: '1rem', color: 'var(--slate-600)', maxWidth: '560px' }}>
          {isFiltering
            ? `${filteredProducts.length} verified technical material${filteredProducts.length === 1 ? '' : 's'} currently matching your parameters.`
            : 'Select a material category below or apply precision filters to generate a localized SKU catalog.'}
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
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Filter Parameters
            </h3>
            <button
              onClick={handleClearAllFilters}
              style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-red)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear All <X size={13} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
            </button>
          </div>

          {/* Filter Section 1: Material Pillar */}
          <div style={{ marginBottom: '0.9rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.9rem' }}>
            <button
              type="button"
              className="filter-toggle"
              onClick={() => toggleSection('pillar')}
              aria-expanded={openSections['pillar'] ?? undefined}
            >
              <span>Material Pillar{selectedPillars.length > 0 ? ` (${selectedPillars.length})` : ''}</span>
              <ChevronDown size={16} className={`filter-chevron ${sectionClass('pillar')}`} />
            </button>

            <div className={`filter-body ${sectionClass('pillar')}`}>
              {categories.map(c => ({ name: c.name, pillar: c.slug })).map((item, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem', color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedPillars.includes(item.pillar.toLowerCase())}
                      onChange={() => handleTogglePillar(item.pillar.toLowerCase())}
                      style={{ accentColor: 'var(--primary-red)', cursor: 'pointer' }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>{catalogLoading ? '' : pillarCount(item.pillar)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Section 2: Tier-1 EPC Approvals */}
          <div style={{ marginBottom: '0.9rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.9rem' }}>
            <button
              type="button"
              className="filter-toggle"
              onClick={() => toggleSection('approvals')}
              aria-expanded={openSections['approvals'] ?? undefined}
            >
              <span>Tier-1 EPC Approvals{selectedApprovals.length > 0 ? ` (${selectedApprovals.length})` : ''}</span>
              <ChevronDown size={16} className={`filter-chevron ${sectionClass('approvals')}`} />
            </button>

            <div className={`filter-body ${sectionClass('approvals')}`}>
              {Object.keys(APPROVAL_MATCHERS).map((name, idx) => (
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
            <button
              type="button"
              className="filter-toggle"
              onClick={() => toggleSection('manufacturers')}
              aria-expanded={openSections['manufacturers'] ?? undefined}
            >
              <span>Featured Manufacturers{selectedManufacturers.length > 0 ? ` (${selectedManufacturers.length})` : ''}</span>
              <ChevronDown size={16} className={`filter-chevron ${sectionClass('manufacturers')}`} />
            </button>

            <div className={`filter-body ${sectionClass('manufacturers')}`}>
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
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: 'clamp(0.75rem, 2vw, 1.25rem)', minWidth: 0 }}>
          {/* Search Bar & Bulk Upload BOM Action */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 'min(100%, 260px)' }}>
              <input
                type="text"
                placeholder="Search materials, specs (e.g., ASTM C552), or SKU..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(10);
                }}
                aria-label="Search materials"
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

          {isFiltering && catalogLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)', fontWeight: 600 }}>Loading catalog…</div>
          ) : isFiltering && filteredProducts.length === 0 ? (
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

                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  0 Standard Inventory Matches Found
                </h2>

                <p style={{ fontSize: '0.975rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
                  We couldn't find an exact match for <strong>"{searchQuery || 'your query'}"</strong>
                </p>

                <button
                  onClick={handleClearAllFilters}
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#0EA5E9',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Clear Search & View All Inventory <X size={14} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
                </button>
              </div>

              {/* 2 Alternative Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
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

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
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
                      fontWeight: 700,
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

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
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
                      fontWeight: 700,
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
          ) : isFiltering ? (
            <>
              {activeChips.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {activeChips.map(chip => (
                    <button key={chip.label} onClick={chip.onRemove} className="filter-chip" aria-label={`Remove filter ${chip.label}`}>
                      {chip.label} <X size={13} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              )}

              <div className="catalog-table-wrap">
                <div className="catalog-row catalog-head">
                  <span>Material &amp; Specification</span>
                  <span>Manufacturer</span>
                  <span>Operating Range</span>
                  <span>Availability</span>
                  <span />
                </div>
                {filteredProducts.slice(0, visibleCount).map(product => (
                  <div key={product.id} className="catalog-row catalog-item">
                    <div style={{ minWidth: 0 }}>
                      <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>{product.name}</div>
                      </Link>
                      <span className="spec-tag">{product.compliance.split('/')[0].trim()}</span>
                    </div>
                    <div className="cell-label" data-label="Manufacturer" style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{product.manufacturer || '—'}</div>
                    <div className="cell-label" data-label="Operating Range" style={{ color: 'var(--slate-700)' }}>{product.tempRange}</div>
                    <div className="cell-label" data-label="Availability">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--slate-900)' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: stockDot(product.stockLevel), flexShrink: 0 }} />
                        {stockLabel(product.stockLevel)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', paddingLeft: '14px' }}>{product.stockHub || product.leadTime}</div>
                    </div>
                    <button onClick={() => onAddRfqItem(product)} className="add-rfq-btn">+ Add to RFQ</button>
                  </div>
                ))}
              </div>

              {filteredProducts.length > visibleCount && (
                <button onClick={() => setVisibleCount(c => c + 10)} className="load-more-btn">
                  Load More Items <ArrowDown size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
                </button>
              )}
            </>
          ) : (
            <>
              {/* 6 Category Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                gap: '1.25rem',
              }}>
                {CATEGORY_CARDS.map(card => (
                  <div key={card.id} className="cat-card">
                    <div className="cat-card-image">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        card.iconSvg
                      )}
                    </div>
                    <div style={{ padding: '1rem 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.6rem' }}>
                        {card.title}
                      </h3>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.25rem', flex: 1 }}>
                        {card.items.map((sub, i) => (
                          <li key={i} style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>{sub}</li>
                        ))}
                      </ul>
                      <button
                        onClick={() => {
                          setSelectedPillars([card.pillarName]);
                          setVisibleCount(10);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ alignSelf: 'flex-start', color: '#0EA5E9', fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        View Category <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
                      </button>
                    </div>
                  </div>
                ))}
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
        .filter-toggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--slate-900);
          padding: 0.25rem 0;
          margin-bottom: 0.6rem;
          cursor: pointer;
        }
        :global(.filter-chevron) {
          transition: transform 0.2s ease;
        }
        :global(.filter-chevron.is-closed) {
          transform: rotate(-90deg);
        }
        .filter-body {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding-top: 0.25rem;
        }
        .filter-body.is-closed {
          display: none;
        }
        /* Phones/tablets: filter groups start collapsed until tapped */
        @media (max-width: 1023px) {
          .filter-body:not(.is-open) {
            display: none;
          }
          :global(.filter-chevron:not(.is-open)) {
            transform: rotate(-90deg);
          }
        }
        .cat-card {
          background: #ffffff;
          border: 1.5px solid var(--slate-200);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .cat-card-image {
          background: #f1f5f9;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          color: #0284c7;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 0.4rem 0.9rem;
          border-radius: 9999px;
        }
        .catalog-table-wrap {
          border: 1px solid var(--slate-200);
          border-radius: 16px;
          padding: 0 1rem 1rem 1rem;
          background: #fcfcfd;
        }
        .catalog-row {
          display: grid;
          grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.1fr) minmax(0, 1.1fr) minmax(0, 1.1fr) auto;
          gap: 1rem;
          align-items: center;
        }
        .catalog-head {
          padding: 1rem 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--slate-600);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border-bottom: 1px solid var(--slate-200);
          margin-bottom: 0.75rem;
        }
        .catalog-item {
          background: #ffffff;
          border: 1px solid var(--slate-200);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }
        .spec-tag {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--slate-600);
          background: #f1f5f9;
          border-radius: 4px;
          padding: 0.15rem 0.45rem;
        }
        .add-rfq-btn {
          border: 1.5px solid #0ea5e9;
          color: #0ea5e9;
          background: #f0f9ff;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          white-space: nowrap;
        }
        .load-more-btn {
          align-self: center;
          background: var(--slate-900);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.85rem 2.25rem;
          border-radius: 9999px;
        }
        @media (max-width: 860px) {
          .catalog-head {
            display: none;
          }
          .catalog-row {
            grid-template-columns: 1fr 1fr;
          }
          .catalog-item > :first-child {
            grid-column: 1 / -1;
          }
          .cell-label::before {
            content: attr(data-label);
            display: block;
            font-size: 0.65rem;
            font-weight: 700;
            color: var(--slate-500);
            text-transform: uppercase;
          }
          .add-rfq-btn {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
};
