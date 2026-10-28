'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
  color?: string;
  bg?: string;
}

export interface CustomSelectProps {
  options: (SelectOption | string)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'hero' | 'standard' | 'badge';
  accentColor?: string;
  borderColor?: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
}

const LIST_MAX_HEIGHT = 280;

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  variant = 'standard',
  accentColor = 'var(--primary-red)',
  borderColor,
  style,
  disabled = false,
  id,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pos, setPos] = useState<{ left: number; top: number; width: number; up: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const normalizedOptions: SelectOption[] = options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
  const selectedIndex = normalizedOptions.findIndex((opt) => opt.value === value);
  const selectedOption = normalizedOptions[selectedIndex];
  const isBadge = variant === 'badge';
  const isHero = variant === 'hero';

  // The list is rendered in a portal with fixed positioning so scrolling modals/cards never clip it
  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const up = spaceBelow < Math.min(LIST_MAX_HEIGHT, normalizedOptions.length * 44 + 16) && r.top > spaceBelow;
    const width = isBadge ? Math.max(170, r.width) : r.width;
    const left = Math.min(isBadge ? r.right - width : r.left, window.innerWidth - width - 8);
    setPos({ left: Math.max(8, left), top: up ? r.top - 8 : r.bottom + 8, width, up });
  }, [isBadge, normalizedOptions.length]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [isOpen, place]);

  // Close on outside click (the list lives in a portal, so check both elements)
  useEffect(() => {
    if (!isOpen) return;
    const handle = (event: MouseEvent) => {
      const t = event.target as Node;
      if (containerRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  // Keep the highlighted option visible while using the keyboard
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const open = () => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        open();
      }
      return;
    }
    if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % normalizedOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + normalizedOptions.length) % normalizedOptions.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (normalizedOptions[activeIndex]) handleSelect(normalizedOptions[activeIndex].value);
    }
  };

  const trigger = isBadge ? (
    <button
      ref={triggerRef}
      id={id}
      type="button"
      disabled={disabled}
      onClick={() => (isOpen ? setIsOpen(false) : open())}
      onKeyDown={handleKeyDown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listId}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.75rem',
        borderRadius: '9999px',
        border: `1.5px solid ${isOpen ? accentColor : borderColor || 'var(--slate-300)'}`,
        backgroundColor: selectedOption?.bg || '#FFFFFF',
        color: selectedOption?.color || 'var(--slate-800)',
        fontWeight: 700,
        fontSize: '0.8rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'border-color 0.2s ease',
      }}
    >
      <span>{selectedOption ? selectedOption.label : placeholder}</span>
      <ChevronDown size={14} style={{ transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
    </button>
  ) : (
    <button
      ref={triggerRef}
      id={id}
      type="button"
      disabled={disabled}
      onClick={() => (isOpen ? setIsOpen(false) : open())}
      onKeyDown={handleKeyDown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listId}
      aria-label={ariaLabel}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isHero ? '0.2rem 0' : '0.7rem 0.9rem',
        backgroundColor: isHero ? 'transparent' : disabled ? 'var(--slate-50)' : '#FFFFFF',
        border: isHero ? 'none' : `1.5px solid ${isOpen ? accentColor : borderColor || 'var(--slate-300)'}`,
        borderRadius: isHero ? '0' : '10px',
        fontSize: isHero ? '0.95rem' : '0.875rem',
        fontWeight: isHero ? 700 : 600,
        fontFamily: 'inherit',
        color: selectedOption ? 'var(--slate-900)' : 'var(--slate-400)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
        textAlign: 'left',
        transition: 'border-color 0.2s ease',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      <ChevronDown
        size={isHero ? 18 : 16}
        style={{
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(180deg)' : 'none',
          color: isOpen || isHero ? accentColor : 'var(--slate-400)',
          flexShrink: 0,
          marginLeft: '0.5rem',
        }}
      />
    </button>
  );

  const list =
    isOpen && pos && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            className="cs-list"
            style={{
              position: 'fixed',
              left: pos.left,
              width: pos.width,
              ...(pos.up ? { bottom: window.innerHeight - pos.top } : { top: pos.top }),
              maxHeight: LIST_MAX_HEIGHT,
              overflowY: 'auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--slate-200)',
              outline: '4px solid rgba(15, 23, 42, 0.04)',
              padding: '0.35rem',
              zIndex: 2000,
              transformOrigin: pos.up ? 'bottom' : 'top',
              animation: 'csIn 0.14s ease-out',
            }}
          >
            {normalizedOptions.length === 0 && (
              <div style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', color: 'var(--slate-500)' }}>No options</div>
            )}
            {normalizedOptions.map((opt, index) => {
              const isSelected = opt.value === value;
              const isActive = index === activeIndex;
              return (
                <div
                  key={opt.value}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setActiveIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: isBadge ? '0.5rem 0.75rem' : '0.6rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: isBadge ? '0.8rem' : '0.875rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? accentColor : opt.color || 'var(--slate-800)',
                    backgroundColor: isActive ? 'var(--slate-100)' : isSelected ? 'var(--primary-red-badge)' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '1px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                    {opt.icon && <span>{opt.icon}</span>}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{opt.label}</span>
                  </span>
                  {isSelected && <Check size={15} color={accentColor} style={{ flexShrink: 0 }} />}
                </div>
              );
            })}
            <style>{`@keyframes csIn { from { opacity: 0; transform: scaleY(0.96); } to { opacity: 1; transform: scaleY(1); } }`}</style>
          </div>,
          document.body
        )
      : null;

  return (
    <div
      ref={containerRef}
      style={isBadge ? { position: 'relative', display: 'inline-block', ...style } : { position: 'relative', width: '100%', ...style }}
    >
      {trigger}
      {list}
    </div>
  );
};
