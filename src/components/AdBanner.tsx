import { useEffect, useRef } from 'react';

export interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, never>[];
  }
}

/** Supply a real ad-unit slot ID from AdSense; the shared head loads its script. */
export function AdBanner({
  slot,
  format = 'auto',
  responsive = 'true',
  className = 'my-6',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initializedAd = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    const ad = adRef.current;
    if (!slot.trim() || !ad || initializedAd.current === ad) return;
    if (ad.hasAttribute('data-adsbygoogle-status')) {
      initializedAd.current = ad;
      return;
    }

    // Mark before pushing so Strict Mode cannot enqueue the same element twice.
    initializedAd.current = ad;
    try {
      // Queue requests even when Google's asynchronous script is still loading.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [slot, format, responsive]);

  if (!slot.trim()) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`adsense-container text-center overflow-hidden ${className}`}
    >
      <ins
        key={`${slot}:${format}:${responsive}`}
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1781335642360761"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </aside>
  );
}
