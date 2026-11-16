'use strict';
// This storefront shares the catalog, prices and orders of the company's operational panel.
const sf = {
  company: null,
  settings: null,
  commissionPolicy: null,
  payments: null,
  unavailableReason: null,
  previewTotal: null,
  products: [],
  cart: [],
  category: '',
  query: '',
  product: null,
  qty: 1,
  mode: 'delivery',
  quote: null,
  key: null,
  saving: false
};

const el = id => document.getElementById(id);
const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
// Validate numeric legacy values before adding them; never use string concatenation for money.
function storefrontAmount(value){
 if(typeof value!=='number'&&!(typeof value==='string'&&/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value)))return null;
 const number=Number(value);return Number.isFinite(number)&&number>=0&&number<=1000000&&Math.abs(number*100-Math.round(number*100))<=.00001?Math.round(number*100)/100:null;
}
const sfSlug = () => document.querySelector('meta[name="hub-site-tenant"]')?.content || location.pathname.match(/^\/(?:lojas|tenants)\/([a-z0-9_-]+)/)?.[1] || new URLSearchParams(location.search).get('c') || new URLSearchParams(location.search).get('slug') || '';
const show = (id, visible) => el(id)?.classList.toggle('hidden', !visible);

async function sfApi(path = '', data) {
  try{
    const response = await fetch('/api/storefront' + path + '?c=' + encodeURIComponent(sfSlug()), {
      method: data ? 'POST' : 'GET',
      headers: data ? { 'Content-Type': 'application/json', 'Idempotency-Key': sf.key || '' } : {},
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(path==='/orders'?50000:15000)
    });
    let result;try{result=await response.json();}catch{throw Error('Não foi possível confirmar a resposta da loja. Tente novamente.');}
    if (!response.ok) throw Error(result.error || result.message || 'Não foi possível carregar a loja.');
    return result;
  }catch(error){
    if(['TimeoutError','AbortError'].includes(error.name))throw Error('A conexão demorou. Tente novamente.');
    if(error instanceof TypeError)throw Error('Não foi possível conectar. Confira sua conexão e tente novamente.');
    throw error;
  }
}

function sfFeedback(text, isError = false) {
  const fb = el('order-feedback');
  if (fb) {
    fb.textContent = text;
    fb.hidden = !text;
    fb.setAttribute('role',isError?'alert':'status');
    fb.setAttribute('aria-live',isError?'assertive':'polite');
    fb.className = 'text-xs font-semibold p-2.5 rounded-xl text-center ' + (isError ? 'text-red-700 bg-red-100 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800' : 'text-[#2f4a32] bg-[#e8d9be]/30 dark:bg-white/5 dark:text-[#faf5ec]');
  }
}

function invalidateQuote() {
  sf.revision=(sf.revision||0)+1;
  sf.quote = null;
  sf.key = null;
  show('confirm-order', false);
  renderCartTotals();
}

function storefrontImageNotice(area) {
  if (!area || area.querySelector('[data-image-disclaimer]')) return;
  area.classList.add('sf-image-area');
  const notice = document.createElement('small');
  notice.dataset.imageDisclaimer = '';
  notice.className = 'sf-image-disclaimer';
  notice.textContent = 'Imagem ilustrativa';
  area.appendChild(notice);
}

function renderProducts() {
  const rows = sf.products.filter(p => (!sf.category || p.category === sf.category) && (!sf.query || [p.name, p.description, p.ingredients].join(' ').toLocaleLowerCase().includes(sf.query)));
  const grid = el('products-grid');
  if (!grid) return;
  grid.innerHTML = rows.map(p => `
    <article class="group overflow-hidden rounded-3xl border border-[#dccdb2] bg-[#faf5ec] shadow-sm hover:shadow-md transition dark:bg-[#1a1412] dark:border-[#382b24]">
      <button type="button" data-product="${safe(p.id)}" class="w-full text-left">
        <div class="aspect-square bg-[#e8d9be]/40 relative overflow-hidden flex items-center justify-center p-3 sm:p-4 dark:bg-white/5">
          ${p.image ? `<img src="${safe(p.image)}" alt="${safe(p.name)}" loading="lazy" decoding="async" class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md" onerror="this.onerror=null; this.src='/assets/hero-calabresa-catupiry.webp';">` : '<div class="grid h-full place-items-center text-4xl" aria-hidden="true">🍽️</div>'}
        </div>
        <div class="p-5">
          <p class="text-xs font-bold uppercase tracking-wide text-[#b23a26] dark:text-[#f87171]">${safe(p.category || 'Cardápio')}</p>
          <h3 class="mt-1 font-display text-xl font-bold text-[#2f4a32] dark:text-[#faf5ec]">${safe(p.name)}</h3>
          <p class="mt-2 text-sm text-[#6f6457] line-clamp-2 dark:text-[#c4b5a2]">${safe(p.description || p.ingredients || '')}</p>
          ${p.priceStatus==='review_required'?`<p class="mt-2 text-sm">${safe(p.priceNotice)}</p>`:''}
          <div class="mt-4 flex items-center justify-between">
            <strong class="text-lg text-[#b23a26] dark:text-[#f87171]">${p.variants?.some(v => v.name && /m[eé]dia/i.test(v.name)) ? brl(p.variants.find(v => v.name && /m[eé]dia/i.test(v.name)).price) : (p.displayPrice==null?(p.priceStatus==='review_required'?'Preço em revisão':'Indisponível'):(p.variants?.length?'A partir de ':'')+brl(p.displayPrice))}</strong>
            <span class="rounded-full bg-[#2f4a32] px-4 py-2 text-sm font-bold text-white hover:bg-[#3d6041] transition">${p.orderable===false?'Ver detalhes':'Adicionar +'}</span>
          </div>
        </div>
      </button>
    </article>
  `).join('') || '<div class="col-span-full rounded-3xl border border-dashed border-[#dccdb2] p-12 text-center dark:border-[#382b24]"><h3 class="font-display text-xl font-bold text-[#2f4a32] dark:text-[#faf5ec]">' + (sf.products.length ? 'Nenhum produto encontrado' : 'Cardápio em preparação') + '</h3><p class="mt-2 text-sm text-[#6f6457] dark:text-[#c4b5a2]">' + (sf.products.length ? 'Tente outra categoria ou busca.' : 'A loja está cadastrando seus produtos. Volte em breve.') + '</p></div>';

  grid.querySelectorAll('img').forEach(img => storefrontImageNotice(img.parentElement));
  grid.querySelectorAll('[data-product]').forEach(button => button.onclick = () => handleItemClick(button.dataset.product));
}

function handleSearch(value) {
  sf.query = value.trim().toLocaleLowerCase();
  renderProducts();
}

function filterCategory(value) {
  sf.category = value;
  document.querySelectorAll('.cat-btn').forEach(btn => {
    const active = btn.dataset.category === value;
    btn.className = `cat-btn shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition ${active ? 'bg-[#2f4a32] text-white border-[#2f4a32]' : 'border-[#dccdb2] text-[#2f4a32] bg-[#faf5ec] dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#faf5ec]'}`;
    btn.setAttribute('aria-pressed', String(active));
  });
  renderProducts();
}

function handleItemClick(id) {
  sf.product = sf.products.find(p => p.id === id);
  if (!sf.product) return;
  el('product-modal')?.querySelectorAll('img').forEach(img => storefrontImageNotice(img.parentElement));
  sf.productTrigger = document.activeElement;
  sf.qty = 1;
  if (el('modal-qty-val')) el('modal-qty-val').textContent = '1';
  if (el('modal-item-notes')) el('modal-item-notes').value = '';
  if (el('modal-product-name')) el('modal-product-name').textContent = sf.product.name;
  if (el('modal-product-desc')) el('modal-product-desc').textContent = [sf.product.description || sf.product.ingredients || '',sf.product.priceNotice].filter(Boolean).join(' ');
  if (el('modal-category-badge')) el('modal-category-badge').textContent = sf.product.category || 'Cardápio';

  const variants = (sf.product.variants || []).filter(v => v.available !== false);
  el('modal-variants-list')?.parentElement?.classList.toggle('hidden', !variants.length);
  if (el('modal-variants-list')) {
    el('modal-variants-list').innerHTML = variants.map(v => `
      <label class="flex items-center gap-2 rounded-xl border border-[#dccdb2] p-3 cursor-pointer hover:bg-black/5 dark:border-[#382b24]">
        <input type="radio" name="product-variant" value="${safe(v.id)}" ${v.orderable===false?'disabled':v.id===variants.find(option=>option.orderable!==false)?.id?'checked':''}> ${safe(v.name)} — ${v.priceStatus==='review_required'?'Preço em revisão':brl(v.price)}
      </label>
    `).join('');
  }

  const grpList = el('product-options');
  if (grpList) {
    grpList.innerHTML = (sf.product.groups || []).map(g => `
      <fieldset data-group="${safe(g.id)}" class="rounded-xl border border-[#dccdb2] p-3 dark:border-[#382b24]">
        <legend class="text-sm font-bold text-[#2f4a32] dark:text-[#faf5ec] px-1">${safe(g.name)} · ${g.min} a ${g.max}</legend>
        ${g.options.filter(o => o.available !== false).map(o => `
          <label class="mt-2 flex items-center justify-between gap-2 text-sm text-[#4e3220] dark:text-[#faf5ec]">
            <span>${safe(o.name)} ${o.orderable===false?'· Preço em revisão':'(+ '+brl(o.price)+')'}</span>
            <input type="number" min="0" max="${g.max}" value="0" data-option="${safe(o.id)}" ${o.orderable===false?'disabled':''} aria-label="Quantidade de ${safe(o.name)}" class="w-16 rounded-lg border border-[#dccdb2] p-1 text-center bg-white dark:bg-[#1a1412] dark:border-[#382b24]">
          </label>
        `).join('')}
      </fieldset>
    `).join('');
  }

  if (el('modal-submit-btn')) {el('modal-submit-btn').textContent=sf.product.orderable===false?'Compra indisponível':'Adicionar ao pedido';el('modal-submit-btn').disabled=sf.product.orderable===false;}
  show('product-modal', true);
  el('product-modal')?.setAttribute('aria-hidden','false');
  el('modal-product-name')?.focus({preventScroll:true});
}

function changeModalQty(delta) {
  sf.qty = Math.max(1, Math.min(20, sf.qty + delta));
  if (el('modal-qty-val')) el('modal-qty-val').textContent = sf.qty;
}

function closeProductModal() {
  show('product-modal', false);
  el('product-modal')?.setAttribute('aria-hidden','true');
  if(sf.productTrigger?.isConnected)sf.productTrigger.focus({preventScroll:true});
}

function confirmModalAddToCart() {
  const p = sf.product;
  if (!p) return;
  const variantId = document.querySelector('[name="product-variant"]:checked')?.value;
  const variant = p.variants?.find(v => v.id === variantId);
  if(p.orderable===false||(p.variants?.length&&(!variant||variant.orderable===false))){alert(p.priceNotice||'Escolha um tamanho com preço liberado pela loja.');return;}
  const base=storefrontAmount(variant?variant.price:p.price);if(base===null){alert('Preço em revisão pela loja. Confira outra opção.');return;}
  const addons = [];
  let extra = 0;

  for (const group of p.groups || []) {
    let total = 0;
    for (const option of group.options) {
      const input = [...el('product-options').querySelectorAll('[data-option]')].find(n => n.dataset.option === option.id && n.closest('[data-group]').dataset.group === group.id);
      const quantity = Number(input?.value || 0);
      if (!Number.isInteger(quantity) || quantity < 0) {
        alert('Confira as quantidades dos adicionais.');
        return;
      }
      total += quantity;
      if (quantity) {
        const value=storefrontAmount(option.price);if(value===null||option.orderable===false){alert('Preço deste adicional em revisão pela loja.');return;}
        addons.push({ group_id: group.id, option_id: option.id, quantity });
        extra += quantity * Math.round(value*100);
      }
    }
    if (total < group.min || total > group.max) {
      alert('Escolha de ' + group.min + ' a ' + group.max + ' opções em ' + group.name + '.');
      return;
    }
  }

  sf.cart.push({
    key: crypto.randomUUID(),
    product_id: p.id,
    variant_id: variantId || null,
    name: p.name + (variant ? ' · ' + variant.name : ''),
    quantity: sf.qty,
    addons,
    notes: el('modal-item-notes')?.value.trim() || '',
    price: (Math.round(base*100) + extra)/100
  });

  invalidateQuote();
  closeProductModal();
  renderCart();
  openCart();
}

function openCart() {
  sf.lastFocus = document.activeElement;
  show('cart-drawer-overlay', true);
  const drawer = el('cart-drawer');
  drawer?.classList.remove('translate-x-full');
  if (drawer) { drawer.inert = false; drawer.removeAttribute('inert'); }
  drawer?.setAttribute('aria-hidden', 'false');
  drawer?.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
}

function closeCart() {
  show('cart-drawer-overlay', false);
  const drawer = el('cart-drawer');
  drawer?.classList.add('translate-x-full');
  if (drawer) { drawer.inert = true; drawer.setAttribute('inert', ''); }
  drawer?.setAttribute('aria-hidden', 'true');
  sf.lastFocus?.focus?.();
}

function cartQty(key, delta) {
  const item = sf.cart.find(i => i.key === key);
  if (!item) return;
  const focused=document.activeElement?.dataset.key===key?document.activeElement.dataset.qty:null;
  item.quantity += delta;
  if (item.quantity <= 0) sf.cart = sf.cart.filter(i => i !== item);
  invalidateQuote();
  renderCart();
  if(focused){const control=[...document.querySelectorAll('#cart-items [data-qty]')].find(button=>button.dataset.key===key&&button.dataset.qty===focused);(control||el('cart-drawer')?.querySelector('button'))?.focus();}
}

function renderCart() {
  const count = sf.cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = sf.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (el('cart-counter')) {
    el('cart-counter').textContent = count;
    show('cart-counter', !!count);
  }
  show('cart-empty-state', !count);
  show('cart-footer', !!count);
  document.querySelectorAll('[data-checkout-details]').forEach(section => section.classList.toggle('hidden', !count));

  if (el('cart-items')) {
    el('cart-items').innerHTML = sf.cart.map(i => `
      <div class="rounded-2xl border border-[#dccdb2] p-3 bg-white/70 dark:bg-[#251d18] dark:border-[#382b24]">
        <strong class="text-sm text-[#2f4a32] dark:text-[#faf5ec]">${safe(i.name)}</strong>
        ${i.notes ? `<p class="mt-1 text-xs text-[#6f6457] dark:text-[#c4b5a2]">${safe(i.notes)}</p>` : ''}
        <div class="mt-2 flex items-center justify-between">
          <span class="font-bold text-[#b23a26] dark:text-[#f87171]">${brl(i.price * i.quantity)}</span>
          <div class="flex items-center gap-2">
            <button type="button" data-qty="-1" data-key="${i.key}" aria-label="Diminuir quantidade de ${safe(i.name)}" class="w-7 h-7 rounded-lg border border-[#dccdb2] bg-[#faf5ec] flex items-center justify-center font-bold text-sm hover:bg-[#e8d9be] dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#faf5ec]">−</button>
            <b class="w-6 text-center text-sm font-bold text-[#2f4a32] dark:text-[#faf5ec]">${i.quantity}</b>
            <button type="button" data-qty="1" data-key="${i.key}" aria-label="Aumentar quantidade de ${safe(i.name)}" class="w-7 h-7 rounded-lg border border-[#dccdb2] bg-[#faf5ec] flex items-center justify-center font-bold text-sm hover:bg-[#e8d9be] dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#faf5ec]">+</button>
          </div>
        </div>
      </div>
    `).join('');

    el('cart-items').querySelectorAll('[data-qty]').forEach(button => {
      button.onclick = () => cartQty(button.dataset.key, Number(button.dataset.qty));
    });
  }

  renderCartTotals(subtotal);
}

function renderCartTotals(subtotal=sf.cart.reduce((sum,item)=>sum+item.price*item.quantity,0)){
  if(el('cart-subtotal'))el('cart-subtotal').textContent=brl(subtotal);
  const quotedTotal=sf.quote?.order?.total;
  const confirmed=typeof quotedTotal==='number'&&Number.isFinite(quotedTotal)&&quotedTotal>=0;
  const zone=sf.settings?.zones?.find(zone=>zone.active&&zone.id===el('delivery-zone')?.value);
  const quotedFee=sf.quote?.order?.delivery_fee;
  const fee=confirmed&&typeof quotedFee==='number'&&Number.isFinite(quotedFee)?quotedFee:zone?.fee;
  const policy=sf.commissionPolicy,deliveryFee=sf.mode!=='delivery'?0:!sf.settings?.pricing?.enabled?storefrontAmount(zone?.fee):null;
  // This is a preview only; the server still confirms discounts, fees and the final total.
  const estimated=sfSlug()==='juca_a54163c2'&&!confirmed&&sf.cart.length>0&&deliveryFee!==null&&policy?.payer==='customer'&&policy.base==='products_after_discounts'&&policy.deliveryIncluded===false&&policy.channels?.includes('site')&&typeof policy.percent==='number'&&policy.percent>=0&&policy.percent<=100;
  const serviceCents=estimated?Math.round(Math.round(subtotal*100)*policy.percent/100):0;
  const estimatedTotal=estimated?(Math.round(subtotal*100)+Math.round(deliveryFee*100)+serviceCents)/100:null;
  sf.previewTotal=estimatedTotal;
  const estimateNote=sf.mode==='delivery'?'Inclui entrega e taxa de serviço.':'Sem frete. Inclui taxa de serviço.';
  if(el('cart-delivery-fee'))el('cart-delivery-fee').textContent=sf.mode!=='delivery'?brl(0):typeof fee==='number'&&Number.isFinite(fee)?brl(fee):sf.settings?.pricing?.enabled?'A conferir pela loja':sfSlug()==='juca_a54163c2'?'Selecione o bairro':'Selecione a região';
  if(el('cart-delivery-zone'))el('cart-delivery-zone').textContent=sf.mode==='delivery'?(sf.quote?.order?.zone_name||zone?.name||''):'';
  show('cart-delivery-fee-row',sf.mode==='delivery');
  show('cart-service-fee-row',confirmed?sf.quote.order.service_fee?.payer==='customer':estimated);
  if(el('cart-service-fee'))el('cart-service-fee').textContent=confirmed?brl(sf.quote.order.service_fee?.amount||0):estimated?brl(serviceCents/100):'A confirmar';
  if(el('cart-total-label'))el('cart-total-label').textContent=confirmed?'Total conferido':estimated?'Total estimado':'Total a confirmar';
  if(el('cart-total'))el('cart-total').textContent=confirmed?brl(quotedTotal):estimated?brl(estimatedTotal):'—';
  if(el('cart-total-note'))el('cart-total-note').textContent=confirmed?'Valores conferidos. Confirme para registrar o pedido.':estimated?estimateNote+' '+(el('order-coupon')?.value.trim()?'O cupom será conferido ao finalizar.':'Confira para confirmar os valores.'):'Confira o pedido para confirmar frete, descontos e total.';
  const active=document.activeElement;show('btn-checkout-whatsapp',!confirmed);show('confirm-order',confirmed);
  if(el('confirm-order'))el('confirm-order').textContent=sf.quote?.input?.payment_method==='mercado_pago'?'Confirmar e pagar no Mercado Pago':'Confirmar pedido';
  if(confirmed&&active===el('btn-checkout-whatsapp'))el('confirm-order')?.focus();
  else if(!confirmed&&active===el('confirm-order'))el('btn-checkout-whatsapp')?.focus();
}

function setFulfillment(mode) {
  if(mode==='delivery'&&!sf.settings?.deliveryEnabled||mode==='pickup'&&!sf.settings?.pickupEnabled||mode==='dine_in'&&!sf.settings?.dineInEnabled)return;
  sf.mode = mode;
  invalidateQuote();
  show('delivery-address-group', mode === 'delivery');
  show('pickup-info-box', mode !== 'delivery');
  if(el('storefront-neighborhoods')){
    if(mode!=='delivery'){el('delivery-zone').value='';el('neighborhood-search').value='';filterNeighborhoods();}
    syncNeighborhoodSelection();
  } else if (el('delivery-zone')?.parentElement) {
    el('delivery-zone').parentElement.classList.toggle('hidden', mode !== 'delivery');
  }

  const btnDeliv = el('btn-receive-delivery');
  const btnPickup = el('btn-receive-pickup');
  if (btnDeliv && btnPickup) {
    if (mode === 'delivery') {
      btnDeliv.className = 'py-2.5 px-2 rounded-xl border border-[#2f4a32] bg-[#2f4a32] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition text-center shadow-sm';
      btnPickup.className = 'py-2.5 px-2 rounded-xl border border-[#dccdb2] bg-[#faf5ec] text-[#4e3220] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition text-center dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#faf5ec]';
    } else {
      btnPickup.className = 'py-2.5 px-2 rounded-xl border border-[#2f4a32] bg-[#2f4a32] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition text-center shadow-sm';
      btnDeliv.className = 'py-2.5 px-2 rounded-xl border border-[#dccdb2] bg-[#faf5ec] text-[#4e3220] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition text-center dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#faf5ec]';
    }
  }
  const dine=el('btn-receive-dine-in');
  if(dine){
    const active='py-2.5 px-2 rounded-xl border border-[#2f4a32] bg-[#2f4a32] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition text-center shadow-sm';
    const inactive='py-2.5 px-2 rounded-xl border border-[#dccdb2] bg-[#faf5ec] text-[#4e3220] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition text-center';
    for(const [value,button] of [['delivery',btnDeliv],['pickup',btnPickup],['dine_in',dine]]){button.className=mode===value?active:inactive;button.setAttribute('aria-pressed',String(mode===value));}
  }
  if(mode!=='delivery'){const title=el('pickup-info-box')?.querySelector('p');if(title)title.textContent=mode==='dine_in'?'Seu pedido será servido no local, sem taxa de entrega.':'Retire seu pedido para viagem na loja, sem taxa de entrega.';}

  renderCart();
}

function validateAndGetStorefrontInput() {
  if (!sf.cart.length) {
    alert('Seu carrinho está vazio! Adicione ao menos uma opção antes de enviar.');
    throw new Error('Adicione um produto ao pedido.');
  }

  const nameEl = el('customer-name');
  const phoneEl = el('customer-phone');
  const cpfEl = el('customer-cpf');
  const bdayEl = el('customer-birthday');
  const addrEl = el('customer-address');
  const compEl = el('customer-complement');
  const zoneEl = el('delivery-zone');
  const payEl = el('payment-method');

  // Reset visual error borders
  [nameEl, phoneEl, addrEl].filter(Boolean).forEach(input => {
    input.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
  });

  const name = nameEl?.value.trim() || '';
  if (!name) {
    if (nameEl) {
      nameEl.classList.add('border-red-500', 'ring-2', 'ring-red-400');
      nameEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nameEl.focus();
    }
    sfFeedback('Por favor, informe seu nome para o pedido.', true);
    throw new Error('Informe seu nome.');
  }

  const rawPhone = phoneEl?.value.replace(/\D/g, '') || '';
  if (rawPhone.length < 10) {
    if (phoneEl) {
      phoneEl.classList.add('border-red-500', 'ring-2', 'ring-red-400');
      phoneEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      phoneEl.focus();
    }
    sfFeedback('Por favor, digite seu WhatsApp com DDD.', true);
    throw new Error('Telefone com DDD inválido.');
  }
  const countryPhone = rawPhone.length === 10 || rawPhone.length === 11 ? '55' + rawPhone : rawPhone;

  const cpf = cpfEl?.value.trim() || '';
  const birthday = bdayEl?.value.trim() || '';

  // Remember for quick repeat / lookup
  try {
    if (rawPhone) localStorage.setItem('last_customer_phone', rawPhone);
    if (cpf) localStorage.setItem('last_customer_cpf', cpf);
  } catch (e) {}

  let address = '';
  let zoneId = null;
  if (sf.mode === 'delivery') {
    const rawAddr = addrEl?.value.trim() || '';
    if (!rawAddr) {
      if (addrEl) {
        addrEl.classList.add('border-red-500', 'ring-2', 'ring-red-400');
        addrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        addrEl.focus();
      }
      sfFeedback('Por favor, digite seu endereço completo de entrega.', true);
      throw new Error('Endereço de entrega obrigatório.');
    }
    address = [rawAddr, compEl?.value.trim()].filter(Boolean).join(' · ');

    if (zoneEl && !zoneEl.value && zoneEl.options.length > 0) {
      zoneEl.selectedIndex = 0;
    }
    zoneId = zoneEl?.value || null;
    if(sfSlug()==='juca_a54163c2'&&!sf.settings?.zones?.some(zone=>zone.active&&zone.id===zoneId)){
      zoneEl?.setAttribute('aria-invalid','true');
      const target=el('neighborhood-search')||zoneEl;target?.setAttribute('aria-invalid','true');target?.scrollIntoView({block:'center'});target?.focus();
      sfFeedback('Selecione um bairro atendido para conferir a taxa de entrega.',true);
      throw new Error('Selecione o bairro de entrega.');
    }
  } else {
    address = sf.mode==='dine_in'?'Consumo no local':'Retirada no Balcão da Loja';
  }

  const payment = payEl?.value || '';
  const coupon = el('order-coupon')?.value.trim() || '';
  const notes = el('order-notes')?.value.trim() || '';

  return {
    customer_name: name,
    customer_phone: countryPhone,
    cpf,
    birthday,
    mode: sf.mode,
    address,
    zone_id: zoneId,
    payment_method: payment,
    change_for:payment==='cash'?(el('change-for')?.value||el('customer-change')?.value||null):null,
    coupon,
    notes,
    items: sf.cart.map(i => ({
      product_id: i.product_id,
      variant_id: i.variant_id,
      quantity: i.quantity,
      addons: i.addons,
      notes: i.notes
    }))
  };
}

function storefrontUnavailableMessage(){
 const hours=sf.company?.hoursSchedule;
 if(sf.unavailableReason==='closed')return 'A loja está fechada agora.'+(hours?.start&&hours?.end?' Horário de atendimento: '+hours.start+' às '+hours.end+'.':' Consulte os horários em Informações.');
 if(sf.unavailableReason==='paused')return 'A loja pausou os pedidos. Tente novamente mais tarde.';
 if(sf.unavailableReason==='price_review')return 'Os preços estão em revisão pela loja. Aguarde a liberação.';
 if(sf.unavailableReason==='empty_menu')return 'Não há produtos disponíveis para comprar agora.';
 if(sf.unavailableReason==='fulfillment_unavailable')return 'A loja ainda precisa liberar as opções de entrega ou consumo no local.';
 return 'Não foi possível confirmar a disponibilidade da loja. Tente novamente.';
}

// The server checks every amount. A higher total requires a fresh confirmation.
async function checkoutWhatsApp() {
  if(sf.saving)return;
  const button=el('btn-checkout-whatsapp');
  const preview=sf.previewTotal,originalLabel=button.textContent;
  sf.saving=true;button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Conferindo pedido…';invalidateQuote();
  try {
    if(!sf.ready){
      sfFeedback('Conferindo se a loja está recebendo pedidos…');
      const current=await sfApi();sf.ready=current.ready;sf.unavailableReason=current.unavailableReason;sf.company=current.client;
      if(!sf.ready)throw Error(storefrontUnavailableMessage());
    }
    const input=validateAndGetStorefrontInput(),revision=sf.revision;
    sfFeedback('Conferindo valores e disponibilidade…');
    const result=await sfApi('/quote',input);
    if(sf.revision!==revision)throw Error('O pedido mudou. Confira os valores novamente.');
    sf.quote={...result,input};sf.key=crypto.randomUUID();
    const automatic=sfSlug()==='juca_a54163c2'&&typeof preview==='number'&&Number.isFinite(preview)&&typeof result.order?.total==='number'&&Math.round(result.order.total*100)<=Math.round(preview*100);
    sfFeedback(sfSlug()==='juca_a54163c2'?(automatic?'Valores conferidos. Enviando seu pedido…':'Os valores foram atualizados. Confira o total e confirme abaixo.'):result.summary.replace(/ Posso registrar o pedido\?$/,''));
    renderCart();
    if(automatic){sf.saving=false;await confirmStorefrontOrder();return;}
    if(document.activeElement===document.body||document.activeElement===button)el('confirm-order')?.focus();
  } catch(error) { sfFeedback(error.message,true); }
  finally {sf.saving=false;button.disabled=false;button.removeAttribute('aria-busy');button.textContent=originalLabel;}
}
async function confirmStorefrontOrder(){
  if(!sf.quote||sf.saving)return;
  const quote=sf.quote;sf.saving=true;el('confirm-order').disabled=true;
  const isMercadoPago=quote.input.payment_method==='mercado_pago';
  sfFeedback(isMercadoPago?'Preparando seu pagamento no Mercado Pago…':'Enviando seu pedido. O pagamento será em dinheiro.');
  const controls=[...document.querySelectorAll('#cart-drawer input,#cart-drawer select,#cart-drawer textarea,#cart-drawer button')].map(el=>({el,disabled:el.disabled}));controls.forEach(({el})=>el.disabled=true);
  try {
    const result=await sfApi('/orders',{...quote.input,quoteVersion:quote.version});
    if(!result.success||!result.id||!result.trackingUrl)throw Error('Não foi possível confirmar o registro. Tente novamente.');
    let checkout=null;
    if(quote.input.payment_method==='mercado_pago'){
      try{checkout=new URL(result.checkout?.url);if(checkout.protocol!=='https:'||!['www.mercadopago.com.br','www.mercadopago.com','mercadopago.com.br','mercadopago.com','sandbox.mercadopago.com.br','sandbox.mercadopago.com'].includes(checkout.hostname))throw Error();}catch{throw Error('O pagamento online ainda não está disponível. Tente novamente para recuperar o mesmo pedido.');}
    }
    el('success-summary-text').textContent='Pedido #'+result.id+' · '+brl(result.total)+' · '+(quote.input.payment_method==='cash'?(quote.input.mode==='dine_in'?'Pague em dinheiro no local.':quote.input.mode==='pickup'?'Pague em dinheiro ao retirar o pedido.':'Pague em dinheiro ao receber.'):'Pagamento pendente de conferência.');
    el('success-tracking-btn').href=result.trackingUrl;show('success-tracking-btn',true);
    const success=el('modal-order-success'),title=success.querySelector('h3'),badge=success.querySelector('span.inline-block');
    if(title)title.textContent=checkout?'Pedido aguardando pagamento':'Pedido recebido pela loja';if(badge)badge.textContent=checkout?'Pagamento pendente':'Pedido registrado';
    let payLink=el('success-payment-btn');
    if(checkout){if(!payLink){payLink=document.createElement('a');payLink.id='success-payment-btn';payLink.className=el('success-tracking-btn').className;payLink.style.marginBottom='10px';el('success-tracking-btn').before(payLink);}payLink.href=checkout.href;payLink.textContent='Pagar no Mercado Pago';}else payLink?.remove();
    try {const key='storefront-orders:'+sfSlug();const history=JSON.parse(localStorage.getItem(key)||'[]');localStorage.setItem(key,JSON.stringify([{id:result.id,total:result.total,url:result.trackingUrl},...history.filter(o=>o.id!==result.id)].slice(0,20)));}catch{}
    sf.cart=[];invalidateQuote();renderCart();closeCart();
    if(checkout){sfFeedback('Abrindo o Mercado Pago. O pedido aguarda a confirmação do pagamento.');show('modal-order-success',true);window.location.assign(checkout.href);return;}
    sf.successClickAt=performance.now();show('modal-order-success',true);
    sfFeedback(quote.input.payment_method==='cash'?'Pedido registrado. Pagamento em dinheiro '+(quote.input.mode==='dine_in'?'no local.':quote.input.mode==='pickup'?'ao retirar o pedido.':'ao receber.'):'Pedido registrado. A loja vai conferir o pagamento e o preparo.');
  } catch(error) { sfFeedback(error.message,true); }
  finally {sf.saving=false;controls.forEach(({el,disabled})=>el.disabled=disabled);el('confirm-order').disabled=false;}
}
function closeInfoModal(){show('info-modal',false);}
function closeMobileMenu(){show('mobile-menu',false);}
function closeSuccessCelebrationModal(){show('modal-order-success',false);}
function openOrderLookupModal(){
  show('modal-order-lookup',true);const box=el('lookup-query-input')?.closest('.pt-4');if(box)box.hidden=true;const sub=el('modal-order-lookup')?.querySelector('h3 + p');if(sub)sub.textContent='Seus pedidos neste navegador';performOrderLookup();
}
function closeOrderLookupModal(){show('modal-order-lookup',false);show('order-lookup-modal',false);}
function performOrderLookup(){
  const container=el('lookup-results-container');if(!container)return;
  let rows=[];try{rows=JSON.parse(localStorage.getItem('storefront-orders:'+sfSlug())||'[]');}catch{}
  container.innerHTML=rows.map(o=>`<a class="block rounded-xl border p-4" href="${safe(o.url)}">Pedido #${safe(o.id)} · ${brl(o.total)} · Acompanhar</a>`).join('')||'<p class="p-4 text-sm">Os pedidos feitos neste navegador aparecem aqui. Em outro dispositivo, use o link individual recebido ao concluir a compra.</p>';
}

function storeContact(value){
  if(typeof value!=='string'||!/^\+?[\d\s().-]+$/.test(value.trim()))return null;
  const raw=value.trim();let digits=raw.replace(/\D/g,'');
  const explicit=raw.startsWith('+')||digits.startsWith('00');
  if(digits.startsWith('00'))digits=digits.slice(2);
  const internationalNANP=!explicit&&/^1[2-9]\d{2}[2-9]\d{6}$/.test(digits)&&! /^[1-9]\d9\d{8}$/.test(digits);
  const domestic=!explicit&&!internationalNANP&&[10,11].includes(digits.length);
  if(domestic)digits='55'+digits;
  if(!/^[1-9]\d{7,14}$/.test(digits)||/^(\d)\1+$/.test(digits))return null;
  if(digits.startsWith('55')){
    const national=digits.slice(2),ddd=Number(national.slice(0,2));
    const validDDD=[11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99];
    if(!validDDD.includes(ddd)||! /^(?:[2-5]\d{7}|9\d{8})$/.test(national.slice(2)))return null;
    return {href:'https://wa.me/'+digits,label:`+55 (${national.slice(0,2)}) ${national.slice(2,-4)}-${national.slice(-4)}`};
  }
  // International contacts retain their country code. No Brazilian prefix is
  // guessed for explicit +/00 numbers or legacy numbers longer than 11 digits.
  return {href:'https://wa.me/'+digits,label:'+'+digits};
}
function renderStoreContact(value){
  const info=el('info-modal');if(!info)return;
  let container=el('store-contact');
  if(!container){container=document.createElement('p');container.id='store-contact';info.querySelector('[role="dialog"]').appendChild(container);}
  container.replaceChildren();const contact=storeContact(value);
  if(!contact){container.textContent='Contato não informado ou inválido. Confirme com a loja.';return;}
  const link=document.createElement('a');link.href=contact.href;link.target='_blank';link.rel='noopener noreferrer';link.textContent='WhatsApp da loja: '+contact.label;container.appendChild(link);
}
function renderStorePaymentInformation(){
  // Tenant HTML snapshots also use this shared script; no tenant files need edits.
  const title=[...document.querySelectorAll('h4')].find(node=>/^3\. Pagamento/.test(node.textContent.trim()));
  const section=title?.closest('section');if(!section)return;
  section.innerHTML='<h4 class="font-bold text-sm">3. Pagamento</h4><p class="text-xs">Escolha uma forma habilitada pela loja.</p><p class="text-xs">PIX: conferido pela loja. Cartão: na entrega ou retirada. Dinheiro: informe o troco.</p><p class="text-xs">O envio do pedido não confirma o pagamento.</p>';
}

function prepareNeighborhoodCheckout(){
 const zone=el('delivery-zone'),group=el('delivery-address-group');if(!zone||!group)return;
 const label=zone.closest('label')||document.querySelector('label[for="delivery-zone"]');
 if(label){
  for(const node of label.childNodes)if(node.nodeType===Node.TEXT_NODE)node.textContent='Bairro de entrega * ';
  group.appendChild(label);label.hidden=true;label.style.display='none';
 }
 zone.setAttribute('aria-required','true');zone.setAttribute('aria-describedby','delivery-zone-help');
 const address=el('customer-address');if(address){address.placeholder='Rua e número';address.autocomplete='address-line1';}
 if(!el('delivery-zone-help')){const help=document.createElement('p');help.id='delivery-zone-help';help.className='storefront-total-note';help.textContent='Escolha um bairro atendido. Se ele não estiver na lista, confirme a entrega com a loja.';group.appendChild(help);}
 if(!el('cart-delivery-zone')){const label=el('cart-delivery-fee-row')?.firstElementChild;if(label){const name=document.createElement('small');name.id='cart-delivery-zone';name.style.display='block';label.appendChild(name);}}
 if(el('storefront-neighborhoods'))return;
 const fieldset=document.createElement('fieldset');fieldset.id='storefront-neighborhoods';fieldset.className='storefront-neighborhoods';
 fieldset.innerHTML='<legend>Bairro de entrega <span aria-hidden="true">*</span></legend><label class="sf-neighborhood-search-label" for="neighborhood-search">Pesquisar bairro</label><input id="neighborhood-search" type="search" placeholder="Digite o nome do seu bairro" autocomplete="off" aria-controls="neighborhood-options" aria-describedby="neighborhood-results"><p id="neighborhood-results" class="sf-neighborhood-results" role="status"></p><div id="neighborhood-options" class="sf-neighborhood-options"></div><p id="neighborhood-empty" class="sf-neighborhood-empty" hidden>Não encontramos esse bairro. Confira o nome ou confirme a entrega com a loja.</p><p id="neighborhood-selected" class="sf-neighborhood-selected" role="status"></p>';
 group.insertBefore(fieldset,el('delivery-zone-help'));
 el('neighborhood-options').innerHTML=sf.settings.zones.filter(z=>z.active).map(z=>`<label class="sf-neighborhood-option"><input type="radio" name="storefront-neighborhood" value="${safe(z.id)}"><span>${safe(z.name)}</span><strong>${brl(z.fee)}</strong></label>`).join('');
 el('neighborhood-search').addEventListener('input',filterNeighborhoods);
 fieldset.addEventListener('change',event=>{
  if(event.target.name!=='storefront-neighborhood')return;
  zone.value=event.target.value;zone.dispatchEvent(new Event('input',{bubbles:true}));syncNeighborhoodSelection();
 });
 zone.addEventListener('input',syncNeighborhoodSelection);
 filterNeighborhoods();syncNeighborhoodSelection();
}

function filterNeighborhoods(){
 const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
 const query=normalize(el('neighborhood-search').value).trim().replace(/\s+/g,' ');let count=0;
 for(const row of el('neighborhood-options').children){const name=normalize(row.querySelector('span').textContent);row.hidden=!name.includes(query);if(!row.hidden)count++;}
 el('neighborhood-results').textContent=count===1?'1 bairro encontrado':count+' bairros encontrados';
 el('neighborhood-empty').hidden=count>0;
 el('neighborhood-options').hidden=count===0;
 el('neighborhood-options').scrollTop=0;
}

function syncNeighborhoodSelection(){
 const selected=sf.settings.zones.find(z=>z.active&&z.id===el('delivery-zone').value);
 for(const radio of document.querySelectorAll('[name="storefront-neighborhood"]'))radio.checked=radio.value===selected?.id;
 const summary=el('neighborhood-selected');summary.textContent=selected?selected.name+' · Entrega '+brl(selected.fee):'Escolha seu bairro para calcular a entrega.';
 if(selected)el('neighborhood-search').removeAttribute('aria-invalid');
}

async function loadStorefront(){
 try{
  if(!sfSlug())throw Error('Acesse o link de uma loja para consultar o cardápio.');const data=await sfApi();sf.company=data.client;sf.settings=data.settings;sf.commissionPolicy=data.commissionPolicy||null;sf.payments=data.payments||null;sf.products=data.products;sf.ready=data.ready;sf.unavailableReason=data.unavailableReason;
  document.title=data.client.name+' | Cardápio Online';const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walk.nextNode()){if(node.textContent.includes('Horários a informar'))node.parentElement.style.whiteSpace='pre-line';node.textContent=node.textContent.replace(/Sua loja/g,data.client.name).replace(/Região a informar/g,data.client.city||'Região a informar').replace(/Horários a informar/g,data.client.hours||'Horários não informados; confirme com a loja.').replace(/Endereço a informar/g,data.settings.storeAddress||'Endereço a informar');}
  document.querySelectorAll('[data-service-mode]').forEach(node=>{
    node.hidden=node.dataset.serviceMode==='delivery'?!data.settings.deliveryEnabled:!data.settings.pickupEnabled;
    node.classList.toggle('hidden',node.hidden);
  });
  document.querySelectorAll('[data-store-logo]').forEach(img=>{img.src=data.client.logoUrl||(sfSlug()==='juca_a54163c2'?'/assets/logo_juca.webp':'/logo-agencia.png');img.alt=data.client.name;});
  if(window.updateOpenStatus){window.updateOpenStatus();}else{el('hero-status-text').textContent=data.ready?'Recebendo pedidos':'Preparando o atendimento';el('hero-status-dot').textContent='';}
  const categories=[...new Set(sf.products.map(p=>p.category||'Cardápio'))];sf.category=categories[0]||'';el('cat-tabs-container').setAttribute('role','group');el('cat-tabs-container').setAttribute('aria-label','Categorias do cardápio');el('cat-tabs-container').innerHTML=categories.map(c=>`<button type="button" class="cat-btn shrink-0 rounded-full border border-[#dccdb2] px-5 py-2.5 text-sm font-bold" data-category="${safe(c)}">${safe(c)}</button>`).join('');el('cat-tabs-container').querySelectorAll('[data-category]').forEach(button=>button.onclick=()=>filterCategory(button.dataset.category));filterCategory(sf.category);
  const neighborhoodCheckout=sfSlug()==='juca_a54163c2';
  el('delivery-zone').innerHTML=`<option value="">${neighborhoodCheckout?'Selecione seu bairro':'Selecione a região'}</option>`+data.settings.zones.filter(z=>z.active).map(z=>`<option value="${safe(z.id)}">${safe(z.name)} — ${brl(z.fee)}</option>`).join('');
  if(neighborhoodCheckout)prepareNeighborhoodCheckout();
  const labels={cash:'Dinheiro',card:'Cartão na entrega ou no local',pix:'PIX — a conferir pela loja',mercado_pago:'Mercado Pago — Pix ou cartão online'};el('payment-method').innerHTML=data.settings.paymentMethods.filter(m=>labels[m]&&(m!=='mercado_pago'||data.payments?.mercadoPago?.available===true)).map(m=>`<option value="${m}">${labels[m]}</option>`).join('');
  if(data.payments?.mercadoPago?.available&&data.settings.paymentMethods.includes('mercado_pago')&&!el('online-payment-help')){const help=document.createElement('p');help.id='online-payment-help';help.className='storefront-total-note';help.textContent='Mercado Pago: pague com Pix ou cartão no ambiente seguro do provedor. O pedido aguarda a confirmação do pagamento.';el('payment-method').parentElement.after(help);}
  if(sfSlug()==='juca_a54163c2'&&data.settings.dineInEnabled&&!el('btn-receive-dine-in')){const pickup=el('btn-receive-pickup'),dine=document.createElement('button');dine.id='btn-receive-dine-in';dine.type='button';dine.textContent='Comer no local';dine.addEventListener('click',()=>setFulfillment('dine_in'));pickup.after(dine);pickup.innerHTML='<span>Retirar no local<small class="storefront-mode-note">Para viagem</small></span>';pickup.setAttribute('aria-label','Retirar no local — para viagem');el('btn-receive-delivery').textContent='Entrega';pickup.parentElement.classList.toggle('storefront-three-modes',data.settings.deliveryEnabled&&data.settings.pickupEnabled);}
  sf.mode=data.settings.pickupEnabled?'pickup':sfSlug()==='juca_a54163c2'&&data.settings.dineInEnabled?'dine_in':'delivery';setFulfillment(sf.mode);show('btn-receive-delivery',data.settings.deliveryEnabled);show('btn-receive-pickup',data.settings.pickupEnabled);show('btn-receive-dine-in',data.settings.dineInEnabled);
  el('btn-checkout-whatsapp').disabled=false;
  if(!data.ready)sfFeedback(storefrontUnavailableMessage(),true);
  const info=el('info-modal');const p=info?.querySelector('p.mt-2');if(p){p.textContent=[data.client.name,data.settings.storeAddress,data.client.hours,data.client.coverage].filter(Boolean).join('\n');p.style.whiteSpace='pre-line';}
  renderStoreContact(data.client.botPhone);renderStorePaymentInformation();
  const pickup=el('pickup-info-box');if(pickup){const text=pickup.querySelector('p:last-child');if(text)text.textContent=data.settings.storeAddress||'Endereço a informar';}
  renderProducts();renderCart();
 }catch(error){sf.ready=false;sf.unavailableReason='unavailable';el('hero-status-text').textContent='Atendimento indisponível';el('products-grid').textContent=error.message;el('btn-checkout-whatsapp').disabled=false;sfFeedback('Não foi possível carregar a loja. Tente novamente.',true);}
}
el('btn-open-cart')?.addEventListener('click', openCart);
el('btn-toggle-menu')?.addEventListener('click', () => show('mobile-menu', el('mobile-menu')?.classList.contains('hidden')));
el('btn-open-info')?.addEventListener('click', () => show('info-modal', true));
el('search-input')?.addEventListener('input', event => handleSearch(event.target.value));
// A fast response can put a success action under the next click of the submit gesture.
el('modal-order-success')?.addEventListener('click', event => {
  const now=performance.now(),previous=sf.successClickAt;sf.successClickAt=now;
  // Touch click counts can restart mid-burst. Wait for a pause, not for another order.
  if (event.detail > 1 || event.detail > 0 && now-previous < 500) {
    event.preventDefault();event.stopImmediatePropagation();
  }
}, true);
function storefrontFocusables(dialog){
 return [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')].filter(node=>node.offsetParent!==null&&node.getAttribute('aria-hidden')!=='true'&&!node.closest('[inert]'));
}
document.addEventListener('keydown',event=>{
 const product=el('product-modal'),drawer=el('cart-drawer');
 const productOpen=product&&!product.classList.contains('hidden');
 const dialog=productOpen?product.querySelector('[role="dialog"]'):drawer&&!drawer.classList.contains('translate-x-full')?drawer:null;
 if(!dialog)return;
 if(event.key==='Escape'){event.preventDefault();productOpen?closeProductModal():closeCart();return;}
 if(event.key!=='Tab')return;
 const nodes=storefrontFocusables(dialog),first=nodes[0],last=nodes.at(-1);
 if(!first){event.preventDefault();dialog.focus();return;}
 if(!nodes.includes(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus();}
 else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});

function prepareStorefrontAccessibility(){
 // Custom tenant HTML also uses this shared runtime; normalize its existing nodes.
 if(!el('storefront-accessibility')){const link=document.createElement('link');link.id='storefront-accessibility';link.rel='stylesheet';link.href='/assets/storefront.css';document.head.appendChild(link);}
 const deliveryRow=el('cart-delivery-fee-row');
 if(deliveryRow&&!el('cart-service-fee-row')){const row=document.createElement('div');row.id='cart-service-fee-row';row.className=deliveryRow.className;row.innerHTML='<span>Taxa Automatech (2% sobre produtos)</span><strong id="cart-service-fee">A confirmar</strong>';deliveryRow.after(row);}
 const product=el('product-modal'),dialog=product?.querySelector('[role="dialog"]')||product?.children[1];
 if(dialog){dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','modal-product-name');dialog.setAttribute('aria-describedby','modal-product-desc');dialog.tabIndex=-1;}
 product?.setAttribute('aria-hidden','true');
 if(el('modal-product-name'))el('modal-product-name').tabIndex=-1;
 for(const button of document.querySelectorAll('#product-modal button,#cart-drawer button')){
  const action=button.getAttribute('onclick')||'';
  if(/closeProductModal|closeCart|changeModalQty/.test(action)){button.classList.add('storefront-icon-control');button.type='button';button.setAttribute('aria-label',action.includes('closeProductModal')?'Fechar opções do produto':action.includes('closeCart')?'Fechar carrinho':action.includes('-1')?'Diminuir quantidade':'Aumentar quantidade');}
 }
 const checkout=el('btn-checkout-whatsapp'),confirm=el('confirm-order');if(checkout&&confirm&&checkout.closest('#cart-footer'))checkout.after(confirm);
 if(sfSlug()==='juca_a54163c2'&&checkout?.closest('#cart-footer')){const feedback=el('order-feedback');if(feedback){feedback.hidden=!feedback.textContent.trim();checkout.before(feedback);checkout.setAttribute('aria-describedby','order-feedback');}}
 const total=el('cart-total');if(total?.previousElementSibling)total.previousElementSibling.id='cart-total-label';
 if(total&&!el('cart-total-note')){const note=document.createElement('p');note.id='cart-total-note';note.className='storefront-total-note';note.setAttribute('role','status');total.parentElement.after(note);}
 const notes=el('modal-item-notes');if(notes&&!document.querySelector('label[for="modal-item-notes"]')){const title=notes.parentElement.querySelector('p');if(title){const label=document.createElement('label');label.htmlFor=notes.id;label.className=title.className;label.textContent=title.textContent;title.replaceWith(label);}}
}
prepareStorefrontAccessibility();
// Keep the caption outside the rotating hero so it stays readable.
for (const img of document.querySelectorAll('img[src*="hero-"],img[src*="about-"]')) {
  if (img.closest('#products-grid')) continue;
  const area = img.parentElement.classList.contains('animate-girar') ? img.parentElement.parentElement : img.parentElement;
  storefrontImageNotice(area);
}

for (const input of document.querySelectorAll('#cart-drawer input,#cart-drawer select,#cart-drawer textarea')) {
  input.addEventListener('input', () => {
    input.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
    input.removeAttribute('aria-invalid');
    invalidateQuote();
    renderCart();
  });
}

// Global exposure for modal functions
window.openOrderLookupModal = openOrderLookupModal;
window.closeOrderLookupModal = closeOrderLookupModal;
window.performOrderLookup = performOrderLookup;
window.checkoutWhatsApp = checkoutWhatsApp;
window.confirmStorefrontOrder = confirmStorefrontOrder;
window.closeSuccessCelebrationModal = closeSuccessCelebrationModal;

renderProducts();
renderCart();
loadStorefront();
