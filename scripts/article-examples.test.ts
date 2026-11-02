import test from 'node:test';
import assert from 'node:assert/strict';
import articles from '../src/data/articles.json';
import pages from '../src/data/seo-pages.json';
import config from '../vercel.json';
import {freelance,ecom,configurePlatform,payout,profit,reverse} from '../src/data/fees';
import {quoteUrl,readQuote} from '../src/lib/quote-url';
test('every article example reproduces its stated result from the shared URL',()=>{
 for(const article of articles)for(const example of article.examples){
  const url=new URL(quoteUrl(article.calculator,example.inputs),'https://feecutcalc.com');
  const v=readQuote(example.inputs,url.search,url.hash);
  const isE=article.calculator.includes('ecom');
  const base=(isE?ecom:freelance).find(p=>p.id===v.platform)!;
  const p=configurePlatform(base,v);const n=(key:string)=>Number(v[key]);
  const actual=isE?profit(n('amount'),n('shipping'),n('cogs'),n('cost'),p,n('ad'),v.adType,n('reg'),n('tax')).net:v.mode==='reverse'?reverse(n('amount'),p,n('fx')):payout(n('amount'),p,n('fx')).net;
  assert.equal(actual,example.expected,article.path+': '+example.label);
 }
});
test('consolidated guide redirects preserve amounts and product costs without chains',()=>{
 assert.equal(config.redirects.length,160);
 assert.equal(new Set(config.redirects.map(r=>r.source)).size,160);
 assert.equal(new Set(pages.map(p=>p.platform+':'+p.mode)).size,32);
 for(const r of config.redirects){
  const dest=new URL(r.destination,'https://feecutcalc.com');
  const page=pages.find(p=>p.path===dest.pathname);
  assert.ok(page,r.source);assert.ok(r.permanent);
  assert.ok(!config.redirects.some(other=>other.source===dest.pathname));
  const amount=Number(r.source.match(/(?:calculator-|item-)?(\d+)(?:-dollar-item(?:-with-ads)?|-payout-calculator)?$/)?.[1]);
  assert.equal(Number(dest.searchParams.get('amount')),amount,r.source);
  if(page.kind==='ecom')assert.equal(Number(dest.searchParams.get('cogs')),amount*.3);
 }
});
