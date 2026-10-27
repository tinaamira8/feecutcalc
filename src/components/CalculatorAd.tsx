import { AdBanner } from './AdBanner';

/** Configure a real AdSense ad-unit ID before requesting banner impressions. */
export function CalculatorAd() {
  const slot = import.meta.env.VITE_ADSENSE_CALCULATOR_SLOT?.trim();
  if (!slot || !/^\d+$/.test(slot)) return null;

  return <AdBanner slot={slot} className="my-8" />;
}
