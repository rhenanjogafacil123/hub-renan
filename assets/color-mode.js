/* Visitor preference only; never changes the restaurant's branding or account. */
(function(){
 'use strict';
 const root=document.documentElement,scope=document.currentScript?.dataset.colorModeScope||'site';
 const key='automatech-color-mode:v1:'+scope,system=window.matchMedia('(prefers-color-scheme: dark)');
 const valid=value=>value==='dark'||value==='light';let preference=null;
 try{const saved=localStorage.getItem(key);if(valid(saved))preference=saved;}catch{}
 root.dataset.colorModeScope=scope;
 const moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/></svg>';
 function paint(){
  const dark=(preference||(system.matches?'dark':'light'))==='dark';
  root.dataset.colorMode=dark?'dark':'light';root.dataset.theme=root.dataset.colorMode;
  root.classList.toggle('dark',dark);root.style.colorScheme=root.dataset.colorMode;
  for(const button of document.querySelectorAll('[data-color-mode-toggle]')){
   button.setAttribute('aria-checked',String(dark));button.title=dark?'Ativar tema claro':'Ativar tema escuro';
  }
 }
 function mount(){
  if(document.querySelector('[data-color-mode-toggle]'))return;
  let host,before;
  if(scope==='panel'){
   const header=document.querySelector('.topbar');
   host=header?.querySelector('.account')||header?.querySelector('.ml-auto')||header?.firstElementChild||document.querySelector('.login-page');
  }else{
   before=document.getElementById('btn-toggle-menu');
   host=before?.parentElement||document.querySelector('header nav')||document.querySelector('header>div')||document.querySelector('main');
  }
  if(!host)return;
  const button=document.createElement('button');button.type='button';button.className='color-mode-toggle';button.dataset.colorModeToggle='';button.setAttribute('role','switch');button.setAttribute('aria-label','Tema escuro');
  button.innerHTML=moon+'<span class="color-mode-label">Escuro</span><span class="color-mode-track" aria-hidden="true"><span></span></span>';
  button.addEventListener('click',()=>{preference=root.dataset.colorMode==='dark'?'light':'dark';try{localStorage.setItem(key,preference);}catch{}paint();});
  if(before)host.insertBefore(button,before);else host.prepend(button);
  paint();
 }
 paint();
 function ready(){
  mount();
  const app=scope==='panel'&&document.getElementById('app');
  // Shell replacement happens on navigation/login. Observe only the shell root.
  if(app)new MutationObserver(mount).observe(app,{childList:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
 system.addEventListener('change',()=>{if(preference===null)paint();});
 window.addEventListener('storage',event=>{if(event.key!==key)return;preference=valid(event.newValue)?event.newValue:null;paint();});
})();
