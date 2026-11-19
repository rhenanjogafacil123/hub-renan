const WHATSAPP = "5521976721241";
const money = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const complements = ["Confete","Granola","Leite em pó","Aveia","Jujuba","Sucrilhos","Flocos de arroz","Granulado","Amendoim","Choco Ball","Paçoca"];
const syrups = ["Milho verde","Leite condensado","Coco","Café","Pistache","Porto Blue","Limão","Graviola","Banana caramelada","Caramelo","Doce de leite","Amora","Kiwi","Menta","Uva","Chocolate belga","Chocolate suíço","Chocomenta","Chocolate","Morango"];
const acaiExtras = [
  { name: "Nutella", price: 4 },{ name: "Kit Kat", price: 3 },{ name: "Ovomaltine", price: 3 },{ name: "Fruta", price: 3 },
];

const categories = [
  {
    id: "acai", name: "Açaí batido", icon: "🍇",
    items: [
      { id:"acai-200", name:"Copo de 200ml", price:7, description:"Açaí batido com até 3 complementos, caldas e adicionais.", acai:true },
      { id:"acai-300", name:"Copo de 300ml", price:10, description:"Açaí batido com até 3 complementos, caldas e adicionais.", acai:true },
      { id:"acai-400", name:"Copo de 400ml", price:13, description:"Açaí batido com até 3 complementos, caldas e adicionais.", acai:true },
      { id:"acai-500", name:"Copo de 500ml", price:15, description:"Açaí batido com até 3 complementos, caldas e adicionais.", acai:true },
      { id:"acai-770", name:"Copo de 770ml", price:20, description:"Açaí batido com até 3 complementos, caldas e adicionais.", acai:true },
    ]
  },
  {
    id:"picoles", name:"Picolés", icon:"🍧",
    items:[
      { id:"picole", name:"Picolé tradicional", price:3.5, description:"Escolha o sabor.", variants:["Morango","Chocolate","Coco","Maracujá","Flocos","Creme","Chocolate branco","Limão","Graviola","Milho verde","Uva","Leite condensado","Napolitano","Manga"].map(name=>({name,price:3.5})) },
      { id:"bigcream", name:"Big Cream", price:6.5, description:"Linha cremosa com vários sabores.", variants:["Morango","Creme","Avelã","Doce de leite","Chocolate branco","Brigadeiro","Coco","Torta de limão","Pé de moleque","Malt","Cookie","Caramelo"].map(name=>({name,price:6.5})).concat([{name:"Pistache",price:8}]) },
      { id:"skimo", name:"Picolé Skimo", price:5.5, description:"Brigadeiro, coco ou morango.", variants:["Brigadeiro","Coco","Morango"].map(name=>({name,price:5.5})) },
      { id:"picole-acai", name:"Picolé de açaí", price:4, description:"Picolé de açaí da Morais." },
    ]
  },
  {
    id:"sorvetes", name:"Sorvetes", icon:"🍨",
    items:[
      { id:"sorvete-270", name:"Pote de sorvete 270ml", price:6.5, description:"Escolha o sabor.", variants:["Coco","Flocos","Napolitano","Passas ao rum","Brigadeiro","Morango"].map(name=>({name,price:6.5})) },
      { id:"sorvete-familia", name:"Pote de sorvete 1,5L", price:30, description:"Sabores exibidos no cardápio da loja.", variants:["Chocolate","Napolitano","Flocos"].map(name=>({name,price:30})) },
    ]
  },
  {
    id:"bebidas", name:"Bebidas", icon:"🥤",
    items:[
      { id:"nao-alcoolicas", name:"Bebidas não alcoólicas", price:6, description:"Refrigerantes, água e outras bebidas.", variants:[
        ["Coca-Cola 2L",13],["Coca-Cola Zero 2L",13],["Coca-Cola retornável 2L",10],["Coca-Cola Zero retornável 2L",10],["Pepsi 2L",11],["Pepsi Black 2L",11],["Guaraná Antárctica 2L",11],["Guaraná Antárctica Zero 2L",11],["Fanta Uva 2L",10],["Fanta Laranja 2L",10],["Sprite Zero 2L",10],["Sprite 2L",10],["Suco Lalita 2L",10],["Baly 2L",15],["H2O 1,5L",10],["H2O 1,5L limoneto",10],["Água 1,5L",6],["Água com gás 1,5L",6],["Baly 473ml",10],["Coca-Cola 600ml",8],["Coca-Cola lata 350ml",6],["Guaraná Antárctica lata 350ml",6]
      ].map(([name,price])=>({name,price})) },
      { id:"alcoolicas", name:"Bebidas alcoólicas", price:7, description:"Venda proibida para menores de 18 anos.", alcohol:true, variants:[
        ["Chopp de vinho 600ml",10],["Vinho reservado 750ml",35],["Cerveja Império",7],["Cerveja Antárctica",7],["Cerveja Spaten",8],["Cerveja Brahma",7],["Vinho Espanhol Pata Negra Oro",59.9],["Vinho Português Pinta Negra",45.9]
      ].map(([name,price])=>({name,price})) },
    ]
  }
];

let activeCategory = categories[0].id;
let cart = [];
let modalState = null;

const tabsEl = document.getElementById("categoryTabs");
const menuEl = document.getElementById("menuList");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartTotalEl = document.getElementById("cartTotal");
const cartTotalMiniEl = document.getElementById("cartTotalMini");
const cartCountEl = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const productModal = document.getElementById("productModal");
const checkoutModal = document.getElementById("checkoutModal");
const productModalContent = document.getElementById("productModalContent");
const toastEl = document.getElementById("toast");
const searchInputEl = document.getElementById("searchInput");
const menuEmptyEl = document.getElementById("menuEmpty");
let searchTerm = "";

function toast(text){
  toastEl.textContent = text; toastEl.classList.add("show");
  clearTimeout(toastEl._timer); toastEl._timer = setTimeout(()=>toastEl.classList.remove("show"),2200);
}

function getCategory(){ return categories.find(c=>c.id===activeCategory) || categories[0]; }
function cartTotal(){ return cart.reduce((sum,item)=>sum + item.unitPrice*item.quantity,0); }
function cartCount(){ return cart.reduce((sum,item)=>sum+item.quantity,0); }

function renderTabs(){
  tabsEl.innerHTML = categories.map(cat=>`<button class="category-tab ${cat.id===activeCategory?'active':''}" type="button" data-category="${cat.id}">${cat.icon} ${cat.name}</button>`).join("");
  tabsEl.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{
    activeCategory=btn.dataset.category;
    searchTerm="";if(searchInputEl)searchInputEl.value="";
    renderTabs();renderMenu();
  }));
}

function renderMenu(){
  const term = searchTerm.trim().toLowerCase();
  let entries;

  if(term){
    entries = [];
    for(const cat of categories){
      for(const item of cat.items){
        const haystack = `${item.name} ${item.description||''} ${(item.variants||[]).map(v=>v.name).join(' ')}`.toLowerCase();
        if(haystack.includes(term)) entries.push({cat,item});
      }
    }
  } else {
    const cat = getCategory();
    entries = cat.items.map(item=>({cat,item}));
  }

  menuEl.innerHTML = entries.map(({cat,item})=>`<article class="menu-card">
    <div class="menu-card-icon">${cat.icon}</div>
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <div class="menu-card-bottom"><div class="menu-price"><small>${item.variants?'a partir de':'preço'}</small><strong>${money(item.price)}</strong></div><button class="add-btn" type="button" data-item="${item.id}">Escolher</button></div>
  </article>`).join("");

  if(menuEmptyEl) menuEmptyEl.hidden = entries.length > 0;
  menuEl.querySelectorAll("[data-item]").forEach(btn=>btn.addEventListener("click",()=>openProduct(btn.dataset.item)));
}

function findItem(id){
  for(const cat of categories){ const item=cat.items.find(i=>i.id===id); if(item) return {cat,item}; }
  return null;
}

function openProduct(id){
  const found=findItem(id); if(!found) return;
  const {cat,item}=found;
  modalState={cat,item,quantity:1,variant:item.variants?.[0]||null,complements:[],syrups:[],extras:[],observation:"",ageConfirmed:false};
  renderProductModal();
  productModal.hidden=false; document.body.classList.add("modal-open");
}

function modalUnitPrice(){
  if(!modalState) return 0;
  const base = modalState.variant ? modalState.variant.price : modalState.item.price;
  const extras = modalState.extras.reduce((sum,name)=>sum+(acaiExtras.find(e=>e.name===name)?.price||0),0);
  return base+extras;
}

function renderProductModal(){
  const s=modalState; if(!s) return;
  let html=`<span class="section-kicker">${s.cat.icon} ${s.cat.name}</span><h2 id="productModalTitle">${s.item.name}</h2><div class="modal-price">${money(modalUnitPrice())}</div>`;
  if(s.item.alcohol) html+=`<div class="age-warning">🔞 Venda proibida para menores de 18 anos.</div>`;
  if(s.item.variants){
    html+=`<section class="option-section"><h4>Escolha uma opção</h4><small>Selecione uma opção para este item.</small><div class="option-grid">${s.item.variants.map((v,i)=>`<label class="option-choice"><span><input type="radio" name="variant" value="${i}" ${s.variant===v?'checked':''}> ${v.name}</span><span>${money(v.price)}</span></label>`).join("")}</div></section>`;
  }
  if(s.item.acai){
    html+=`<section class="option-section"><h4>Até 3 complementos</h4><small>Escolha no máximo três opções.</small><div class="option-grid">${complements.map(name=>`<label class="option-choice"><span><input type="checkbox" data-kind="complement" value="${name}" ${s.complements.includes(name)?'checked':''}> ${name}</span><span>Incluso</span></label>`).join("")}</div></section>`;
    html+=`<section class="option-section"><h4>Caldas</h4><small>Selecione as caldas desejadas.</small><div class="option-grid">${syrups.map(name=>`<label class="option-choice"><span><input type="checkbox" data-kind="syrup" value="${name}" ${s.syrups.includes(name)?'checked':''}> ${name}</span><span>Incluso</span></label>`).join("")}</div></section>`;
    html+=`<section class="option-section"><h4>Adicionais</h4><small>Itens cobrados à parte.</small><div class="option-grid">${acaiExtras.map(extra=>`<label class="option-choice"><span><input type="checkbox" data-kind="extra" value="${extra.name}" ${s.extras.includes(extra.name)?'checked':''}> ${extra.name}</span><span>+ ${money(extra.price)}</span></label>`).join("")}</div></section>`;
  }
  if(s.item.alcohol){ html+=`<section class="option-section"><label class="option-choice"><span><input id="ageConfirm" type="checkbox" ${s.ageConfirmed?'checked':''}> Confirmo que tenho 18 anos ou mais</span><span>18+</span></label></section>`; }
  html+=`<div class="modal-fields"><label>Observação do item<textarea id="itemObservation" rows="2" placeholder="Ex.: sem uma calda, preferência de entrega...">${s.observation||''}</textarea></label></div>`;
  html+=`<div class="modal-actions"><div class="modal-qty"><button type="button" id="qtyMinus">−</button><span id="modalQty">${s.quantity}</span><button type="button" id="qtyPlus">+</button></div><button class="modal-add" type="button" id="modalAdd">Adicionar ${money(modalUnitPrice()*s.quantity)}</button></div>`;
  productModalContent.innerHTML=html;

  productModalContent.querySelectorAll('input[name="variant"]').forEach(r=>r.addEventListener("change",e=>{s.variant=s.item.variants[Number(e.target.value)];renderProductModal();}));
  productModalContent.querySelectorAll('[data-kind="complement"]').forEach(cb=>cb.addEventListener("change",e=>{
    const name=e.target.value;
    if(e.target.checked && s.complements.length>=3){e.target.checked=false;toast("Escolha no máximo 3 complementos.");return;}
    s.complements=e.target.checked?[...s.complements,name]:s.complements.filter(x=>x!==name);
  }));
  productModalContent.querySelectorAll('[data-kind="syrup"]').forEach(cb=>cb.addEventListener("change",e=>{const name=e.target.value;s.syrups=e.target.checked?[...s.syrups,name]:s.syrups.filter(x=>x!==name);}));
  productModalContent.querySelectorAll('[data-kind="extra"]').forEach(cb=>cb.addEventListener("change",e=>{const name=e.target.value;s.extras=e.target.checked?[...s.extras,name]:s.extras.filter(x=>x!==name);renderProductModal();}));
  const age=document.getElementById("ageConfirm"); if(age) age.addEventListener("change",e=>s.ageConfirmed=e.target.checked);
  document.getElementById("itemObservation").addEventListener("input",e=>s.observation=e.target.value);
  document.getElementById("qtyMinus").addEventListener("click",()=>{s.quantity=Math.max(1,s.quantity-1);renderProductModal();});
  document.getElementById("qtyPlus").addEventListener("click",()=>{s.quantity++;renderProductModal();});
  document.getElementById("modalAdd").addEventListener("click",addModalItem);
}

function addModalItem(){
  const s=modalState; if(!s) return;
  if(s.item.alcohol && !s.ageConfirmed){toast("Confirme que você tem 18 anos ou mais.");return;}
  const details=[];
  if(s.variant) details.push(`Opção: ${s.variant.name}`);
  if(s.complements.length) details.push(`Complementos: ${s.complements.join(", ")}`);
  if(s.syrups.length) details.push(`Caldas: ${s.syrups.join(", ")}`);
  if(s.extras.length) details.push(`Adicionais: ${s.extras.join(", ")}`);
  if(s.observation.trim()) details.push(`Obs.: ${s.observation.trim()}`);
  cart.push({id:`${Date.now()}-${Math.random().toString(36).slice(2)}`,name:s.item.name,details,quantity:s.quantity,unitPrice:modalUnitPrice(),alcohol:!!s.item.alcohol});
  closeModal(productModal); renderCart(); toast("Item adicionado ao carrinho.");
}

function renderCart(){
  const total=cartTotal(); const count=cartCount();
  cartCountEl.textContent=count; cartTotalEl.textContent=money(total); cartTotalMiniEl.textContent=money(total); checkoutBtn.disabled=!cart.length;
  cartEmptyEl.hidden=!!cart.length;
  cartItemsEl.innerHTML=cart.map(item=>`<article class="cart-item"><div class="cart-item-head"><strong>${item.name}</strong><button type="button" data-remove="${item.id}" aria-label="Remover">×</button></div><div class="cart-item-meta">${item.details.join("\n")}</div><div class="cart-item-bottom"><div class="qty"><button type="button" data-delta="-1" data-id="${item.id}">−</button><span>${item.quantity}</span><button type="button" data-delta="1" data-id="${item.id}">+</button></div><span class="cart-item-price">${money(item.unitPrice*item.quantity)}</span></div></article>`).join("");
  cartItemsEl.querySelectorAll("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{cart=cart.filter(i=>i.id!==btn.dataset.remove);renderCart();}));
  cartItemsEl.querySelectorAll("[data-delta]").forEach(btn=>btn.addEventListener("click",()=>{const item=cart.find(i=>i.id===btn.dataset.id);if(!item)return;item.quantity=Math.max(1,item.quantity+Number(btn.dataset.delta));renderCart();}));
}

function closeModal(el){el.hidden=true; if(productModal.hidden && checkoutModal.hidden) document.body.classList.remove("modal-open");}
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>closeModal(document.getElementById(btn.dataset.close))));
[productModal,checkoutModal].forEach(el=>el.addEventListener("click",e=>{if(e.target===el)closeModal(el)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!productModal.hidden)closeModal(productModal);if(!checkoutModal.hidden)closeModal(checkoutModal);}});

checkoutBtn.addEventListener("click",()=>{
  if(!cart.length)return;
  document.getElementById("checkoutTotal").textContent=money(cartTotal());
  checkoutModal.hidden=false;document.body.classList.add("modal-open");
});

document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const itemText=cart.map(item=>{
    const detailLines=item.details.map(x=>`• ${x}`).join("\n");
    return `${item.quantity}x ${item.name}\n${detailLines}${detailLines?'\n':''}💵 ${money(item.unitPrice*item.quantity)}`;
  }).join("\n\n");
  const lines=[
    "🛒 *NOVO PEDIDO*",
    `👤 Cliente: ${data.get("name")}`,
    "🛵 Forma de recebimento: Entrega",
    `📍 Endereço: ${data.get("address")}`,
  ];
  const ref=String(data.get("reference")||"").trim(); if(ref) lines.push(`🏠 Complemento/Referência: ${ref}`);
  lines.push("━━━━━━━━━━━━━━","🍧 *PEDIDO*",itemText,"━━━━━━━━━━━━━━",`💳 Pagamento: ${data.get("payment")}`);
  const change=String(data.get("change")||"").trim(); if(change) lines.push(`💵 Troco para: ${change}`);
  const notes=String(data.get("notes")||"").trim(); if(notes) lines.push(`📝 Observações: ${notes}`);
  lines.push(`💰 *TOTAL: ${money(cartTotal())}*`);
  if(cart.some(i=>i.alcohol)) lines.push("🔞 Pedido contém bebida alcoólica — cliente confirmou ter 18 anos ou mais.");
  const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url,"_blank","noopener,noreferrer");
});

if(searchInputEl){
  searchInputEl.addEventListener("input",e=>{searchTerm=e.target.value;renderMenu();});
}

renderTabs();renderMenu();renderCart();
