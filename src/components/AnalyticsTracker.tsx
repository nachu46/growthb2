'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Reports each public page view to /api/track (admin pages are never counted). */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    const payload = JSON.stringify({ path: pathname, referrer: document.referrer });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
      }
    } catch {
      // Tracking must never break the page
    }
  }, [pathname]);

  return null;
}
