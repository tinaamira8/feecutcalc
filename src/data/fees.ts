export type Platform = {id:string; name:string; service:number; processing:number; fixed:number; minimum?:number; tier?:{threshold:number;rate:number}; orderFixed?:{threshold:number;low:number}; listing?:number; platformFixed?:number; allFixedToPlatform?:boolean; taxOnService?:boolean; taxOnProcessing?:boolean; note:string; source:string; group:string};
export const freelance:Platform[] = [
{id:'stripe',name:'Stripe',service:0,processing:2.9,fixed:.3,note:'US domestic online cards. International cards and currency conversion cost extra.',source:'https://stripe.com/pricing',group:'Payment Processors'},
{id:'paypal',name:'PayPal',service:0,processing:3.49,fixed:.49,note:'Illustrative US PayPal Checkout rate; payment product and country change pricing.',source:'https://www.paypal.com/us/business/paypal-business-fees',group:'Payment Processors'},
{id:'upwork',name:'Upwork',service:10,processing:0,fixed:0,note:'10% scenario assumption. Actual contract fees range from 0–15%; enter your quoted rate. Withdrawal fees excluded.',source:'https://support.upwork.com/hc/en-us/articles/211062538-Learn-about-the-Freelancer-Service-Fee',group:'Freelance'},
{id:'fiverr',name:'Fiverr',service:20,processing:0,fixed:0,note:'Seller receives 80% of order value; withdrawal charges may apply.',source:'https://help.fiverr.com/hc/en-us/articles/9234443621137-Your-earnings-page',group:'Freelance'},
{id:'toptal',name:'Toptal',service:0,processing:0,fixed:0,note:'Negotiated talent payout model; 0% is a custom assumption, not a published client markup. Enter your agreed deductions.',source:'https://www.toptal.com/faq',group:'Freelance'},
{id:'freelancer',name:'Freelancer.com',service:10,processing:0,fixed:0,minimum:5,note:'Fixed-price project scenario: 10% or $5 minimum. Hourly projects differ.',source:'https://www.freelancer.com/feesandcharges',group:'Freelance'},
{id:'wise',name:'Wise',service:0,processing:.6,fixed:0,note:'0.6% illustrative transfer assumption only. Route, funding and currency determine your live quote.',source:'https://wise.com/us/pricing/',group:'Payment Processors'},
{id:'payoneer',name:'Payoneer',service:0,processing:3.99,fixed:.49,note:'Card-request ceiling example: up to 3.99% + $0.49, not a universal rate. Confirm your account fee; withdrawal and account fees excluded.',source:'https://www.payoneer.com/pricing/',group:'Payment Processors'}];
export const ecom:Platform[] = [
{id:'etsy',name:'Etsy',service:6.5,processing:3,fixed:.45,listing:.2,taxOnProcessing:true,note:'US one-item sale: $0.20 listing, 6.5% transaction, and 3% + $0.25 processing. Processing includes entered sales tax; transaction fees exclude it. Ads are a generic uncapped cost, not an automatic Offsite Ads rule. Renewal and regional fees excluded.',source:'https://www.etsy.com/legal/fees/',group:'E-Commerce Marketplaces'},
{id:'shopify',name:'Shopify',service:0,processing:2.9,fixed:.3,note:'US standard online cards with Shopify Payments: Basic 2.9%, Grow 2.7%, Advanced 2.5%, plus $0.30. Third-party mode adds the plan surcharge to an illustrative external processor rate; enter that processor’s actual fees. Subscriptions excluded.',source:'https://www.shopify.com/pricing',group:'E-Commerce Marketplaces'},
{id:'amazon-fba',name:'Amazon FBA',service:15,processing:0,fixed:0,minimum:.3,note:'US Everything Else category example: 15% with a $0.30 referral minimum per item. FBA fulfillment, storage, inbound and selling-plan costs must be entered separately.',source:'https://sell.amazon.com/pricing',group:'E-Commerce Marketplaces'},
{id:'amazon-fbm',name:'Amazon FBM',service:15,processing:0,fixed:0,minimum:.3,note:'US Everything Else category example: 15% with a $0.30 referral minimum per item. Other categories differ; merchant shipping and selling-plan costs are separate.',source:'https://sell.amazon.com/pricing',group:'E-Commerce Marketplaces'},
{id:'ebay',name:'eBay',service:13.6,processing:0,fixed:.4,tier:{threshold:7500,rate:2.35},orderFixed:{threshold:10,low:.3},allFixedToPlatform:true,taxOnService:true,note:'US non-Store most-categories, one-item order: 13.6% through $7,500 then 2.35% on the excess; $0.30 per order up to $10, otherwise $0.40. Tax enters the fee base. Other categories and seller surcharges excluded.',source:'https://www.ebay.com/help/selling/fees/selling-fees?id=4822',group:'E-Commerce Marketplaces'},
{id:'tiktok',name:'TikTok Shop',service:6,processing:0,fixed:0,note:'US 6% category example, not all categories or promotional rates. No platform-funded discount assumed. Affiliate costs and tax on seller fees are separate; check Seller Center.',source:'https://seller-us.tiktok.com/university/essay?knowledge_id=5988482086864682',group:'E-Commerce Marketplaces'},
{id:'gumroad',name:'Gumroad',service:10,processing:2.9,fixed:.8,platformFixed:.5,note:'Standard direct card sale: 10% + $0.50, plus 2.9% + $0.30 processing. Discover uses 30% including processing; eligible high-volume direct sales use 5% + $0.50 plus processing. Override for your sale type.',source:'https://gumroad.com/help/article/66-gumroads-fees',group:'E-Commerce Marketplaces'},
{id:'stan',name:'Stan Store',service:0,processing:2.9,fixed:.3,note:'No assumed platform transaction fee; Stripe example processing. Allocate subscription per order separately.',source:'https://help.stan.store/article/83-stan-stripes-transaction-fees',group:'E-Commerce Marketplaces'}];
export const money=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
export const round=(n:number)=>Math.round((n+Number.EPSILON)*100)/100;
/** Fixed totals are partitioned once, so an override cannot create negative fees. */
export function feeParts(revenue:number,p:Platform,tax=0){
 const serviceBase=revenue+(p.taxOnService?tax:0);
 const fixed=p.orderFixed&&serviceBase<=p.orderFixed.threshold?p.orderFixed.low:p.fixed;
 const listing=Math.min(fixed,p.listing||0);
 const platformFixed=p.allFixedToPlatform?fixed-listing:Math.min(fixed-listing,p.platformFixed||0);
 const percentage=p.tier?(Math.min(serviceBase,p.tier.threshold)*p.service+Math.max(0,serviceBase-p.tier.threshold)*p.tier.rate)/100:serviceBase*p.service/100;
 const service=round(Math.max(percentage,p.minimum||0)+platformFixed);
 const processing=round((revenue+(p.taxOnProcessing?tax:0))*p.processing/100+fixed-listing-platformFixed);
 return {listing,service,processing};
}
export function configurePlatform(base:Platform,v:Record<string,string>):Platform{
 const p={...base};const num=(k:string)=>Math.min(1e8,Math.max(0,Number(v[k])||0));
 if(p.id==='paypal'&&v.international==='true')p.processing+=1.5;
 if(p.id==='shopify'){
  const advanced=v.plan==='advanced',grow=v.plan==='shopify';
  p.processing=v.gateway==='third'?2.9:advanced?2.5:grow?2.7:2.9;
  if(v.gateway==='third')p.service=advanced?.6:grow?1:2;
 }
 if(v.custom!==undefined&&v.custom!==''){p.service=num('custom');delete p.tier;}
 if(v.processing!==undefined&&v.processing!=='')p.processing=num('processing');
 if(v.fixed!==undefined&&v.fixed!==''){p.fixed=num('fixed');delete p.orderFixed;}
 if(v.minimum!==undefined&&v.minimum!=='')p.minimum=num('minimum');
 return p;
}
export function payout(gross:number,p:Platform,fx=0){const parts=feeParts(gross,p);const service=round(parts.service+parts.listing),processing=parts.processing;const conversion=round(gross*fx/100);return {gross,service,processing,conversion,fees:round(service+processing+conversion),net:round(gross-service-processing-conversion)};}
export function reverse(target:number,p:Platform,fx=0){if(p.service+p.processing+fx>=100)return NaN;let lo=0,hi=Math.max(1,target+100);while(payout(hi,p,fx).net<target)hi*=2;for(let i=0;i<60;i++){let mid=(lo+hi)/2;if(payout(mid,p,fx).net>=target)hi=mid;else lo=mid;}let cents=Math.ceil(hi*100-1e-7);while(payout(cents/100,p,fx).net<target)cents++;return cents/100;}
export function profit(price:number,shipping:number,cogs:number,cost:number,p:Platform,ad:number,adType:string,reg:number,tax=0){
 const calculate=(itemPrice:number)=>{
  const revenue=itemPrice+shipping;
  const {listing,service:transaction,processing}=feeParts(revenue,p,tax);
  const regulatory=round(revenue*reg/100),advertising=round(adType==='percent'?revenue*ad/100:ad);
  const fees=round(listing+transaction+processing+regulatory+advertising);
  const net=round(revenue-fees-cogs-cost);
  return {revenue,listing,transaction,processing,regulatory,advertising,fees,net};
 };
 const result=calculate(price);
 const rate=(p.service+p.processing+reg+(adType==='percent'?ad:0))/100;
 let breakEven=NaN;
 if(rate<1){
  // Search the same fee model, including minimums, tiers, tax and cent rounding.
  let lo=0,hi=Math.max(1,cogs+cost+p.fixed+ad+tax);
  while(calculate(hi).net<0&&hi<1e12)hi*=2;
  // An order-fee jump can create an earlier break-even point below the threshold.
  const thresholdPrice=p.orderFixed?round(p.orderFixed.threshold-shipping-(p.taxOnService?tax:0)):-1;
  if(thresholdPrice>=0&&calculate(thresholdPrice).net>=0)hi=Math.min(hi,thresholdPrice);
  if(calculate(0).net>=0)breakEven=0;
  else if(calculate(hi).net>=0){
   for(let i=0;i<60;i++){const mid=(lo+hi)/2;if(calculate(mid).net>=0)hi=mid;else lo=mid;}
   let cents=Math.ceil(hi*100-1e-7);while(calculate(cents/100).net<0)cents++;
   breakEven=cents/100;
  }
 }
 return {...result,margin:result.revenue?result.net/result.revenue*100:0,roi:cogs+cost?result.net/(cogs+cost)*100:NaN,breakEven};
}
