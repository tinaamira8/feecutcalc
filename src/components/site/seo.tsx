export const SITE_NAME = 'FeeMargin';
export const DEFAULT_ORIGIN = 'https://feecutcalc.com';
export function metadata(path: string, title: string, description: string, schemas: unknown[] = []) {
 const esc = (s:string) => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
 const url = DEFAULT_ORIGIN + path;
 return `<title>${esc(title)} | ${SITE_NAME}</title><meta name="description" content="${esc(description)}"/><link rel="canonical" href="${url}"/><meta property="og:title" content="${esc(title)}"/><meta property="og:description" content="${esc(description)}"/><meta property="og:url" content="${url}"/><meta property="og:type" content="website"/><meta property="og:site_name" content="${SITE_NAME}"/><meta name="twitter:card" content="summary"/><meta name="twitter:title" content="${esc(title)}"/><meta name="twitter:description" content="${esc(description)}"/>${schemas.map(s=>`<script type="application/ld+json">${JSON.stringify(s).replaceAll('<','\\u003c')}</script>`).join('')}`;
}
