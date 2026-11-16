'use strict';
// Scoped to a storefront whose domain was resolved by the server; legacy Hub pages stay unchanged.
document.addEventListener('DOMContentLoaded',()=>{
 const tenant=document.querySelector('meta[name="hub-site-tenant"]')?.content;
 const panel=document.querySelector('meta[name="hub-site-panel"]')?.content;
 if(!tenant||!panel)return;
 const clean=link=>{
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||url.searchParams.getAll('c').some(c=>c!==tenant))return;
  url.searchParams.delete('c'); // Keep tracking tokens and every other parameter.
  if(link.id==='back-to-menu'||link.id==='store-link'){url.pathname='/';}
  if(/^\/painel(?:-delivery)?(?:\/|$)/.test(url.pathname)){
   const target=new URL(panel);target.pathname=['/painel-delivery/admin/','/painel/'].includes(url.pathname)?'/':url.pathname;target.search=url.search;target.hash=url.hash;
   if(link.href!==target.href)link.href=target.href;
  }else if(link.href!==url.href)link.href=url.href;
 };
 const links=root=>{if(root.matches?.('a[href]'))clean(root);root.querySelectorAll('a[href]').forEach(clean);};
 links(document);
 new MutationObserver(records=>{for(const r of records){if(r.type==='attributes')links(r.target);else for(const n of r.addedNodes)if(n.nodeType===1)links(n);}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
},{once:true});
