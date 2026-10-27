import { useEffect, useState } from 'react';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';

const toolLinks = [
  ['/freelance-calculator', 'Freelance calculator'],
  ['/ecom-calculator', 'E-commerce calculator'],
  ['/directory', 'All fee guides'],
] as const;

const detailLinks = [
  ['/about', 'About & methodology'],
  ['/contact', 'Contact'],
  ['/privacy-policy', 'Privacy policy'],
  ['/terms-of-service', 'Terms of service'],
] as const;

function Brand() {
  return <span className="brand"><span className="brandmark" aria-hidden="true">ƒ</span>FeeMargin<span className="brand-dot">.</span></span>;
}

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let saved = false;
    try { saved = localStorage.getItem('feemargin-theme') === 'dark'; } catch { /* Storage may be disabled. */ }
    setDark(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('feemargin-theme', next ? 'dark' : 'light'); } catch { /* The toggle still works without persistence. */ }
  }

  return (
    <header className="site-header">
      <Brand />
      <nav className="site-nav" aria-label="Main navigation">
        <a href="/freelance-calculator">Freelance calculator</a>
        <a href="/ecom-calculator">E-commerce calculator</a>
        <a href="/directory">Fee guides</a>
        <a href="/about">How it works</a>
      </nav>
      <div className="header-actions">
        <button type="button" className="icon-button" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={dark} onClick={toggleTheme}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a href="/freelance-calculator" className="header-cta">Start calculating <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-top">
        <div><Brand /><p>Clarity for every dollar you earn.</p><span className="tiny">Independent estimates. Informed decisions.</span></div>
        <nav aria-label="Calculator and guide links"><b>TOOLS & GUIDES</b>{toolLinks.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
        <nav aria-label="Information and legal links"><b>THE DETAILS</b>{detailLinks.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
      </div>
      <div className="footer-bottom"><span>© 2026 FeeMargin</span><span>Planning estimates, not financial advice. All amounts in USD.</span><span><span className="status-dot" /> Calculated on your device</span></div>
    </footer>
  );
}
