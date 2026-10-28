'use client';

import React from 'react';

/**
 * Infinite horizontal carousel. Children are rendered twice so the loop is seamless;
 * pauses on hover and stays still for visitors who prefer reduced motion.
 */
export const Marquee: React.FC<{ children: React.ReactNode; seconds?: number; gap?: string; label?: string }> = ({
  children,
  seconds = 35,
  gap = '1rem',
  label,
}) => (
  <div className="marquee" role="region" aria-label={label}>
    <div className="marquee-track" style={{ animationDuration: `${seconds}s` }}>
      <div className="marquee-group">{children}</div>
      <div className="marquee-group" aria-hidden="true">{children}</div>
    </div>

    <style jsx>{`
      .marquee {
        overflow: hidden;
        width: 100%;
        -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
        mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
        padding: 0.25rem 0;
      }
      .marquee-track {
        display: flex;
        width: max-content;
        animation-name: marquee-scroll;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
      .marquee:hover .marquee-track {
        animation-play-state: paused;
      }
      .marquee-group {
        display: flex;
        align-items: center;
        gap: ${gap};
        padding-right: ${gap};
      }
      @keyframes marquee-scroll {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-50%);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .marquee-track {
          animation: none;
        }
        .marquee {
          overflow-x: auto;
        }
      }
    `}</style>
  </div>
);
