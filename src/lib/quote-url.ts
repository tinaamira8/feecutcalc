export function readQuote(initial:Record<string,string>,search:string,hash:string){
 const legacy=new URLSearchParams(search);const fragment=new URLSearchParams(hash.replace(/^#/,''));
 return Object.fromEntries(Object.entries(initial).map(([key,value])=>[key,fragment.get(key)??legacy.get(key)??value]));
}
export function quoteUrl(path:string,values:Record<string,string>){return path+'#'+new URLSearchParams(values).toString();}
