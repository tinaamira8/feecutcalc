import fs from 'node:fs';
import assert from 'node:assert/strict';
import pages from '../src/data/seo-pages.json' with {type:'json'};
const routes=['/','/freelance-calculator','/ecom-calculator','/directory','/about','/contact','/privacy-policy','/terms-of-service',...pages.map(p=>p.path)];
for(const route of routes){const html=fs.readFileSync(`dist${route==='/'?'':route}/index.html`,'utf8');assert.equal((html.match(/<title>/g)||[]).length,1);assert.equal((html.match(/rel="canonical"/g)||[]).length,1);assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert.ok(!html.includes('<!--app-->'));assert.ok(!html.includes('feemargin.com'),`${route}: obsolete domain`);assert.equal((html.match(/adsbygoogle\.js\?client=ca-pub-1781335642360761/g)||[]).length,1,`${route}: AdSense script count`);for(const [,link] of html.matchAll(/href="(\/[^"?#]*)"/g)){if(fs.existsSync('dist'+link)&&fs.statSync('dist'+link).isFile())continue;assert.ok(routes.includes(link),`${route}: broken ${link}`);}if(pages.some(p=>p.path===route)){assert.ok(html.includes('FAQPage'));assert.ok(html.includes('BreadcrumbList'));assert.ok(html.includes('SoftwareApplication'));}}
const calc=fs.readFileSync('dist/freelance-calculator/index.html','utf8');assert.ok(calc.includes('2.9<!-- -->%'),'Stripe comparison shows percentage rate');
const robots=fs.readFileSync('dist/robots.txt','utf8');for(const agent of ['Mediapartners-Google','AdsBot-Google'])assert.ok(robots.includes(agent));
console.log(`PASS: ${routes.length} routes; metadata, rendered content, schemas, internal links, comparison rates and crawler rules.`);

assert.ok(robots.includes('Sitemap: https://feecutcalc.com/sitemap.xml'));
assert.equal(fs.readFileSync('dist/ads.txt','utf8').trim(),'google.com, pub-1781335642360761, DIRECT, f08c47fec0942fa0');
