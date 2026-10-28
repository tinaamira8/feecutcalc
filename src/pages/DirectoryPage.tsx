import {useState} from 'react';
import pages from '../data/seo-pages.json';
const categories = ['All', 'Freelance & Invoicing', 'E-Commerce & Marketplaces'] as const;
export default function DirectoryPage(){
 const [category,setCategory]=useState<string>('All');
 const [query,setQuery]=useState('');
 const results=pages.filter(p=>(category==='All'||p.kind===(category===categories[1]?'freelance':'ecom'))&&`${p.title} ${p.platform} ${p.amount} ${p.mode}`.toLowerCase().includes(query.trim().toLowerCase()));
 return <section className="section"><aside className="article-next"><h2>Looking for an explanation?</h2><p>Read 10 practical articles on pricing, shipping, advertising, returns and payment fees, each with a worked example.</p><a href="/articles">Explore the article library →</a></aside><div className="filter-row"><div className="filters" aria-label="Guide categories">{categories.map(c=><button key={c} aria-pressed={category===c} className={category===c?'selected':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><label className="search">Search guides<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Platform, amount or scenario"/></label></div><p role="status">{results.length} of {pages.length} guides · USD estimates</p><div className="guide-grid">{results.map(p=><a className="guide" href={p.path} key={p.path}><span className="tiny">{p.kind==='freelance'?categories[1]:categories[2]}</span><h2>{p.title}</h2><p>{p.verdict}</p><span className="guide-link">View fee breakdown ↗</span></a>)}</div>{!results.length&&<div><h2>No matching guides</h2><p>Try a platform such as Stripe or Etsy, or an amount such as 500.</p><button onClick={()=>{setQuery('');setCategory('All')}}>Reset search and filters</button></div>}</section>;
}
