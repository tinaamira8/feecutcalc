import articles from '../src/data/articles.json' with {type:'json'};
import fs from 'node:fs';
import assert from 'node:assert/strict';
import pages from '../src/data/seo-pages.json' with {type:'json'};
const routes=['/','/freelance-calculator','/ecom-calculator','/directory','/about','/contact','/privacy-policy','/terms-of-service','/articles',...articles.map(a=>a.path),...pages.map(p=>p.path)];
for(const route of routes){const html=fs.readFileSync(`dist${route==='/'?'':route}/index.html`,'utf8');assert.equal((html.match(/<title>/g)||[]).length,1);assert.equal((html.match(/rel="canonical"/g)||[]).length,1);assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert.ok(!html.includes('<!--app-->'));assert.ok(!html.includes('feemargin.com'),`${route}: obsolete domain`);assert.equal((html.match(/adsbygoogle\.js\?client=ca-pub-1781335642360761/g)||[]).length,1,`${route}: AdSense script count`);for(const [,link] of html.matchAll(/href="(\/[^"?#]*)"/g)){if(fs.existsSync('dist'+link)&&fs.statSync('dist'+link).isFile())continue;assert.ok(routes.includes(link),`${route}: broken ${link}`);}if(pages.some(p=>p.path===route)){assert.ok(html.includes('FAQPage'));assert.ok(html.includes('BreadcrumbList'));assert.ok(html.includes('SoftwareApplication'));}}
const calc=fs.readFileSync('dist/freelance-calculator/index.html','utf8');assert.ok(calc.includes('2.9<!-- -->%'),'Stripe comparison shows percentage rate');
const robots=fs.readFileSync('dist/robots.txt','utf8');for(const agent of ['Mediapartners-Google','AdsBot-Google'])assert.ok(robots.includes(agent));
console.log(`PASS: ${routes.length} routes; metadata, rendered content, schemas, internal links, comparison rates and crawler rules.`);

assert.ok(robots.includes('Sitemap: https://feecutcalc.com/sitemap.xml'));
assert.equal(fs.readFileSync('dist/ads.txt','utf8').trim(),'google.com, pub-1781335642360761, DIRECT, f08c47fec0942fa0');

assert.equal(articles.length,10);
assert.equal(new Set(articles.map(a=>a.path)).size,10);
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
for(const article of articles){
 const html=fs.readFileSync(`dist${article.path}/index.html`,'utf8');
 assert.ok(html.includes('"@type":"Article"'),`${article.path}: missing article schema`);
 assert.ok(sitemap.includes(article.path),`${article.path}: missing sitemap entry`);
 for(const section of article.sections)assert.ok(html.includes(section.heading),`${article.path}: missing section`);
 assert.ok(html.includes(article.calculator),`${article.path}: missing calculator link`);
}
console.log('PASS: 10 complete articles with schema, sitemap entries and calculator links.');

const sitemapLocations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(sitemapLocations.length,new Set(sitemapLocations).size,'Sitemap must not contain duplicate URLs');
assert.deepEqual([...sitemapLocations].sort(),routes.map(r=>'https://feecutcalc.com'+r).sort(),'Sitemap must contain exactly the rendered public routes, excluding 404');
console.log('PASS: unique sitemap URLs match public routes exactly.');

const redirects=JSON.parse(fs.readFileSync('vercel.json','utf8')).redirects;
assert.equal(new Set(redirects.map(r=>r.source)).size,redirects.length);
for(const redirect of redirects){
 const target=redirect.destination.split('?')[0];
 assert.ok(routes.includes(target),`Redirect target must be live: ${target}`);
 assert.ok(!routes.includes(redirect.source),`Redirect shadows live page: ${redirect.source}`);
}
for(const page of pages){
 const html=fs.readFileSync(`dist${page.path}/index.html`,'utf8');
 assert.ok(html.includes('Compare transaction sizes'));
 assert.ok(!html.includes('Reserved advertising space'));
}
console.log('PASS: consolidated guides, comparison tables and direct legacy redirects.');
