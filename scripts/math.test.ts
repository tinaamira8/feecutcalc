import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freelance,ecom,payout,reverse,profit,feeParts,configurePlatform,money} from '../src/data/fees';
import pages from '../src/data/seo-pages.json';
test('Stripe known payout',()=>assert.equal(payout(1000,freelance[0]).net,970.7));
test('reverse invoice meets target at minimum cent across providers, FX and sizes',()=>{for(const p of freelance)for(const amount of [0,.01,10,100,1000,99999])for(const fx of [0,2,4]){const gross=reverse(amount,p,fx);assert.ok(payout(gross,p,fx).net>=amount,`${p.id} ${amount}`);if(gross>0)assert.ok(payout(gross-.01,p,fx).net<amount,`${p.id} minimal ${amount}`);}});
test('Freelancer minimum is applied',()=>assert.equal(payout(10,freelance[5]).service,5));
test('Etsy fees, shipping, costs and ads reconcile',()=>{const r=profit(50,5,15,7,ecom[0],15,'percent',0);assert.equal(r.fees,13.93);assert.equal(r.net,19.07);assert.ok(Math.abs(profit(r.breakEven,5,15,7,ecom[0],15,'percent',0).net)<=.02)});
test('undefined ROI and impossible reverse',()=>{assert.ok(Number.isNaN(profit(0,0,0,0,ecom[0],0,'fixed',0).roi));assert.ok(Number.isNaN(reverse(100,{...freelance[0],service:100})))});
test('192 unique guides with complete linking, FAQ and editorial length',()=>{assert.equal(pages.length,192);assert.equal(new Set(pages.map(p=>p.path)).size,pages.length);for(const p of pages){const count=p.prose.split(/\s+/).length;assert.ok(count>=190&&count<=230,`${p.path}: ${count} words`);assert.equal(p.faqs.length,3);assert.equal(p.related.length,4);assert.ok(p.related.every(link=>pages.some(x=>x.path===link)));}});

const market=(id:string)=>ecom.find(p=>p.id===id)!;
test('eBay non-Store one-item thresholds and high-value tier',()=>{
 const p=market('ebay');
 assert.equal(feeParts(10,p).service,1.66);
 assert.equal(feeParts(10.01,p).service,1.76);
 assert.equal(feeParts(7500,p).service,1020.4);
 assert.equal(feeParts(8000,p).service,1032.15);
 assert.equal(feeParts(50,p,5).service,7.88);
 assert.equal(feeParts(50,p).processing,0);
});
test('Amazon minimum is a referral minimum, not an extra fee',()=>{
 for(const id of ['amazon-fba','amazon-fbm']){assert.equal(feeParts(1,market(id)).service,.3);assert.equal(feeParts(50,market(id)).service,7.5);}
});
test('Etsy tax affects only processing and never increases revenue',()=>{
 const a=profit(50,0,15,5,market('etsy'),0,'fixed',0,5);
 assert.equal(a.revenue,50);assert.equal(a.transaction,3.25);assert.equal(a.processing,1.9);assert.equal(a.net,24.65);
});
test('fixed overrides cannot make negative fees and allocation reconciles',()=>{
 for(const id of ['etsy','gumroad','ebay'])for(const fixed of [0,.1,.3,.8,1]){
 const p=configurePlatform(market(id),{fixed:String(fixed)});const parts=feeParts(0,p);
 assert.ok(parts.listing>=0&&parts.processing>=0&&parts.service>=0);
 assert.equal(Math.round((parts.listing+parts.processing+parts.service)*100),Math.round(fixed*100));
 }
 assert.deepEqual(feeParts(50,market('gumroad')),{listing:0,service:5.5,processing:1.75});
});
test('explicit overrides replace eBay tiers and order thresholds; minimum separately editable',()=>{
 const p=configurePlatform(market('ebay'),{custom:'10',fixed:'0'});
 assert.equal(feeParts(8000,p).service,800);
 assert.equal(feeParts(1,configurePlatform(market('amazon-fbm'),{minimum:'0'})).service,.15);
});
test('Shopify external gateway does not inherit native plan card discount',()=>{
 const p=market('shopify');
 assert.equal(configurePlatform(p,{plan:'advanced',gateway:'native'}).processing,2.5);
 const third=configurePlatform(p,{plan:'advanced',gateway:'third'});
 assert.equal(third.processing,2.9);assert.equal(third.service,.6);
 assert.equal(configurePlatform(p,{plan:'shopify',gateway:'third',processing:'3.4'}).processing,3.4);
});
test('break-even uses the same fee rules and returns a nonnegative rounded result',()=>{
 for(const p of ecom)for(const cost of [0,1,8.35,100,8000])for(const tax of [0,5]){
 const a=profit(50,2,3,cost,p,12,'percent',0,tax);
 assert.ok(Number.isFinite(a.breakEven),p.id);
 const b=profit(a.breakEven,2,3,cost,p,12,'percent',0,tax);
 assert.ok(b.net>=0,`${p.id}: ${a.breakEven} gave ${b.net}`);
 }
});
test('all generated guide verdicts match the current engine and declared defaults',()=>{
 for(const page of pages){const p=[...freelance,...ecom].find(p=>p.id===page.platform)!;
 const expected=page.kind==='freelance'?(page.mode==='reverse'?reverse(page.amount,p):payout(page.amount,p).net):profit(page.amount,0,page.amount*.3,5,p,page.mode==='advertising'?15:0,'percent',0).net;
 assert.ok(page.verdict.includes(money(expected)),page.path);
 }
});

test('break-even respects the lower side of the eBay order-fee jump',()=>{
 assert.equal(profit(50,0,8.34,0,market('ebay'),0,'fixed',0).breakEven,10);
});
