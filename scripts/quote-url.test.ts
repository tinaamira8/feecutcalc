import test from 'node:test';
import assert from 'node:assert/strict';
import {readQuote,quoteUrl} from '../src/lib/quote-url';
test('quote values stay in a fragment, excluded from request path and query',()=>{
 const values={amount:'1234.56',platform:'etsy',custom:'',note:'a & b'};
 const url=new URL(quoteUrl('/ecom-calculator',values),'https://feecutcalc.com');
 assert.equal(url.search,'');assert.equal(url.pathname,'/ecom-calculator');
 assert.deepEqual(readQuote(values,'',url.hash),values);
});
test('legacy quote migration preserves known inputs and fragment takes priority',()=>{
 const values=readQuote({amount:'50',platform:'etsy',fixed:''},'?amount=600&platform=stripe&unknown=private','#amount=700');
 assert.deepEqual(values,{amount:'700',platform:'stripe',fixed:''});
 assert.equal(new URL(quoteUrl('/freelance-calculator',values),'https://feecutcalc.com').search,'');
 assert.ok(!quoteUrl('/freelance-calculator',values).includes('private'));
});
