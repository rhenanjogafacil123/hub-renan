'use strict';

(() => {
  if (typeof handleItemClick !== 'function' || typeof sf === 'undefined') return;

  const origHandleItemClick = handleItemClick;
  const origChangeModalQty = changeModalQty;
  const origConfirmModalAddToCart = confirmModalAddToCart;
  const origRenderProducts = typeof renderProducts === 'function' ? renderProducts : null;

  let flavorMode = 'single';
  let extraFlavors = [];
  let includeDrink = true;
  let pizzaRules = null;
  let loadingRules = false;
  let selectedBordaOptionId = 'none';
  let selectedRemovals = [];
  let isPizzaModal = false;

  const formatMoney = v => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',');

  function getSizeMeta(variantName = '') {
    const lower = variantName.toLowerCase();
    if (lower.includes('broto')) {
      return { key: 'broto', title: 'Broto (18cm)', desc: '', isBroto: true };
    }
    if (lower.includes('méd') || lower.includes('med')) {
      return { key: 'media', title: 'Média (30cm)', desc: '', isBroto: false };
    }
    if (lower.includes('grand') || lower.includes('gigant')) {
      return { key: 'grande', title: 'Gigante (45cm)', desc: '', isBroto: false };
    }
    return { key: lower, title: variantName, desc: '', isBroto: false };
  }

  function extractIngredients(desc) {
    return [...new Set(String(desc || '').split(/,|\s+e\s+|\s+ou\s+|\s*\/\s*/i).map(x=>x.trim().replace(/\.$/,'')).filter(x=>x&&!/massa|disco|fatias|sabor/i.test(x)))];
  }

  function cleanBordaLabel(name = '') {
    return name
      .replace(/^borda\s+/i, '')
      .replace(/\s*\(\+\s*R\$\s*[\d.,]+\)/gi, '')
      .trim() || name;
  }

  function getSelectedVariant() {
    const p = sf.product;
    if (!p) return null;
    const checked = document.querySelector('#modal-variants-list input[name="product-variant"]:checked');
    return (p.variants || []).find(v => v.id === checked?.value) || null;
  }

  function getBordaGroup() {
    const savory = selectedFlavors().filter(p => !isSweet(p));
    const groups = savory.map(p => (p.groups || []).find(g => g.id === 'grp_borda'));
    if (!groups.length || groups.some(g => !g)) return null;
    return {...groups[0], options: groups[0].options.filter(o => groups.every(g => g.options.some(x => x.id === o.id && x.available !== false && x.orderable !== false)))};
  }

  function getSelectedBordaPrice() {
    if (selectedBordaOptionId === 'none') return 0;
    const grp = getBordaGroup();
    const opt = grp?.options?.find(o => o.id === selectedBordaOptionId);
    return Number(opt?.price || 0);
  }

  function findMatchingVariant(product, targetMetaKey) {
    const variants = (product?.variants || []).filter(v => v.available !== false);
    return variants.find(v => getSizeMeta(v.name).key === targetMetaKey && v.orderable !== false) || null;
  }

  function flavorCount() { return ({single:1,half:2,triple:3,quad:4})[flavorMode] || 1; }
  function selectedFlavors() { return [sf.product, ...extraFlavors.slice(0, flavorCount()-1)].filter(Boolean); }
  function sizeKey() { return getSizeMeta(getSelectedVariant()?.name || '').key; }
  function maxFlavors() { return pizzaRules?.maxFlavors?.[sizeKey()==='grande'?'giant':sizeKey()] || (sizeKey()==='broto'?1:2); }
  function isSweet(p) { return /doce/i.test(p?.category || ''); }
  function pizzaPrice() {
    if (sizeKey()==='grande' && pizzaRules?.promotionActive && Number.isFinite(pizzaRules.giantPrice)) return pizzaRules.giantPrice;
    return Math.max(...selectedFlavors().map(p => Number(findMatchingVariant(p,sizeKey())?.price ?? p.price)));
  }
  function drinkEligible() { return sizeKey()==='grande' && pizzaRules?.guarana?.eligible === true; }
  function calculateAndPaintModalTotal() {
    const button=el('modal-submit-btn'); if(!button || !sf.product) return;
    if(!isPizzaModal) return;
    if(!pizzaRules || loadingRules) {button.textContent='Conferindo regras da pizza…';button.disabled=true;return;}
    button.disabled=sf.product.orderable===false;
    button.textContent=button.disabled?'Compra indisponível':`Adicionar • ${formatMoney((pizzaPrice()+getSelectedBordaPrice())*sf.qty)}`;
    const hint=el('modal-half-pricing-hint');
    if(hint) hint.textContent=sizeKey()==='grande' && pizzaRules.promotionActive
      ? `Gigante: ${formatMoney(pizzaRules.giantPrice)} · até 4 sabores em partes iguais. ${drinkEligible()?'Guaraná Antarctica 1,5 L opcional, sem alteração do preço.':'Qualquer sabor, inclusive doce e mistura.'}`
      : `Sabores em partes iguais. Preço pelo maior valor: ${formatMoney(pizzaPrice())}.`;
  }

  function renderPizzaSizes(forceDefault = false) {
    const list = el('modal-variants-list');
    const p = sf.product;
    if (!list || !p) return;
    const variants = (p.variants || []).filter(v => v.available !== false);
    if (!variants.length) return;

    list.className = 'grid grid-cols-3 gap-2';

    const currentChecked = forceDefault ? null : document.querySelector('#modal-variants-list input[name="product-variant"]:checked')?.value;
    let selectedId = currentChecked;
    const defaultMedia = variants.find(v => v.orderable !== false && /m[eé]d|med/i.test(v.name || ''));
    if (!selectedId || !variants.some(v => v.id === selectedId && v.orderable !== false)) {
      selectedId = (defaultMedia || variants.find(v => v.orderable !== false) || variants[0])?.id;
    }

    list.innerHTML = variants.map(v => {
      const meta = getSizeMeta(v.name);
      const isSelected = v.id === selectedId;
      const disabled = v.orderable === false;
      const cardCls = isSelected
        ? 'border-[#2f4a32] bg-[#2f4a32] text-white shadow'
        : 'border-[#dccdb2] bg-[#faf5ec] text-[#4e3220] dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#faf5ec]';
      const subCls = isSelected ? 'text-white/80' : 'text-[#6f6457] dark:text-[#c4b5a2]';
      const priceText = v.priceStatus === 'review_required' ? 'Em revisão' : formatMoney(meta.key==='grande' && pizzaRules?.promotionActive ? pizzaRules.giantPrice : v.price);

      return `
        <label class="p-2.5 rounded-2xl border text-center transition cursor-pointer ${cardCls} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}">
          <input type="radio" name="product-variant" value="${safe(v.id)}" class="sr-only" ${isSelected ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
          <span class="block text-[11px] font-bold">${safe(meta.title)}</span>
          ${meta.desc ? `<span class="block text-[10px] ${subCls}">${safe(meta.desc)}</span>` : ''}
          <span class="block text-xs font-extrabold mt-1">${safe(priceText)}</span>
        </label>
      `;
    }).join('');

    list.querySelectorAll('input[name="product-variant"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const chosen = variants.find(v => v.id === radio.value);
        if (chosen && (getSizeMeta(chosen.name).isBroto || getSizeMeta(chosen.name).key !== 'grande' && flavorCount()>2)) {
          flavorMode = 'single';
        }
        renderPizzaSizes();
        populateSecondFlavors();
        updateFlavorButtons();
        renderBordaButtons();
        renderRemovals();
        calculateAndPaintModalTotal();
      });
    });
  }

  function populateSecondFlavors() {
    const p=sf.product, key=sizeKey(); if(!p)return;
    const available=(sf.products||[]).filter(item=>item.id!==p.id && item.orderable!==false && /pizza/i.test(item.category||'') && (key==='grande' && pizzaRules?.promotionActive || isSweet(item)===isSweet(p)) && (item.variants||[]).some(v=>getSizeMeta(v.name).key===key && v.available!==false && v.orderable!==false));
    const chosen=new Set([p.id]);
    extraFlavors=Array.from({length:Math.max(0,flavorCount()-1)},(_,index)=>{
      const prior=extraFlavors[index];
      const item=available.find(x=>x.id===prior?.id&&!chosen.has(x.id)) || available.find(x=>!chosen.has(x.id));
      if(item)chosen.add(item.id);return item;
    }).filter(Boolean);
    const box=el('modal-second-flavor-box'); if(!box)return;
    box.innerHTML=extraFlavors.map((item,index)=>`<label class="block text-xs font-bold">Escolha o ${index+2}º sabor (1/${flavorCount()}):<select data-flavor-index="${index}" id="${index===0?'modal-second-flavor-select':'modal-flavor-'+(index+2)}" class="w-full mt-1 p-2.5 rounded-xl border border-amber-300 bg-white text-xs text-slate-800 dark:bg-[#1a1412] dark:text-white">${available.filter(x=>x.id===item.id||!extraFlavors.some(y=>y.id===x.id)).map(x=>`<option value="${safe(x.id)}" ${x.id===item.id?'selected':''}>${safe(x.name)}${isSweet(x)?' · doce':''}</option>`).join('')}</select></label>`).join('')+'<p id="modal-half-pricing-hint" class="text-xs text-amber-900 dark:text-amber-200"></p>';
    box.querySelectorAll('[data-flavor-index]').forEach(select=>select.onchange=()=>{
      extraFlavors[Number(select.dataset.flavorIndex)]=available.find(x=>x.id===select.value);
      populateSecondFlavors();renderBordaButtons();renderRemovals();calculateAndPaintModalTotal();
    });
  }
  function updateFlavorButtons() {
    const section=el('modal-half-section');if(!section)return;
    const count=flavorCount(), limit=maxFlavors();
    const buttons=el('btn-flavor-single')?.parentElement;
    if(buttons){buttons.className='grid grid-cols-2 gap-2 mb-3';buttons.innerHTML=Array.from({length:limit},(_,i)=>`<button type="button" id="${i===0?'btn-flavor-single':i===1?'btn-flavor-half':'btn-flavor-'+(i+1)}" data-flavor-count="${i+1}" aria-pressed="${count===i+1}" class="p-2.5 rounded-xl border text-xs font-bold ${count===i+1?'bg-[#2f4a32] text-white':'bg-[#faf5ec] text-[#4e3220]'}">${i+1} ${i?'sabores':'sabor'}</button>`).join('');buttons.querySelectorAll('[data-flavor-count]').forEach(btn=>btn.onclick=()=>setFlavorMode(['single','half','triple','quad'][Number(btn.dataset.flavorCount)-1]));}
    const badge=el('badge-half-status');if(badge)badge.textContent=`Até ${limit} ${limit>1?'sabores':'sabor'}`;
    el('modal-second-flavor-box')?.classList.remove('hidden');
    let drink=el('juca-drink-choice');if(!drink){drink=document.createElement('div');drink.id='juca-drink-choice';section.append(drink);}
    drink.innerHTML=drinkEligible()?`<label class="flex items-start gap-2 mt-3 p-3 rounded-xl border text-xs"><input type="checkbox" id="juca-include-drink" ${includeDrink && pizzaRules.guarana.available?'checked':''} ${pizzaRules.guarana.available?'':'disabled'}><span>${pizzaRules.guarana.available?'Incluir Guaraná Antarctica 1,5 L grátis':'Guaraná Antarctica 1,5 L indisponível no momento'}. Com ou sem refrigerante: ${formatMoney(pizzaRules.giantPrice)}.</span></label>`:'';
    const check=el('juca-include-drink');if(check)check.onchange=()=>{includeDrink=check.checked;};
  }

  function renderBordaButtons() {
    const section = el('modal-borda-section');
    const list = el('modal-borda-list');
    const optionsContainer = el('product-options');
    const grp = getBordaGroup();

    if (!section || !list) return;

    // Juca: borders are available only on the giant pizza.
    const chosenVariant = getSelectedVariant();
    if (!chosenVariant || getSizeMeta(chosenVariant.name).key !== 'grande' || selectedFlavors().every(isSweet)) {
      selectedBordaOptionId = 'none';
      section.classList.add('hidden');
      if (grp && optionsContainer) {
        const fieldset = optionsContainer.querySelector(`fieldset[data-group="${grp.id}"]`);
        if (fieldset) {
          fieldset.classList.add('hidden');
          fieldset.querySelectorAll('input[data-option]').forEach(input => { input.value = '0'; });
        }
      }
      return;
    }

    const options = (grp?.options || []).filter(o => o.available !== false);
    if (selectedBordaOptionId !== 'none' && !options.some(o => o.id === selectedBordaOptionId && o.orderable !== false)) selectedBordaOptionId = 'none';
    if (!grp || !options.length) {
      section.classList.add('hidden');
      if (optionsContainer) optionsContainer.classList.remove('hidden');
      return;
    }

    if (optionsContainer) {
      const bordaFieldset = optionsContainer.querySelector(`fieldset[data-group="${grp.id}"]`);
      if (bordaFieldset) bordaFieldset.classList.add('hidden');
    }
    section.classList.remove('hidden');

    const cards = [
      { id: 'none', title: 'Sem borda', priceLabel: 'R$ 0,00', disabled: false },
      ...options.map(o => ({
        id: o.id,
        title: cleanBordaLabel(o.name),
        priceLabel: o.orderable === false ? 'Em revisão' : `+ ${formatMoney(o.price)}`,
        disabled: o.orderable === false
      }))
    ];

    list.innerHTML = cards.map(c => {
      const isSelected = selectedBordaOptionId === c.id;
      const cls = isSelected
        ? 'border-[#2f4a32] bg-[#2f4a32] text-white shadow'
        : 'border-[#dccdb2] bg-[#faf5ec] text-[#4e3220] dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#faf5ec]';
      return `
        <button type="button" data-borda-id="${safe(c.id)}" ${c.disabled ? 'disabled' : ''} class="p-2.5 rounded-xl border text-center transition ${cls} ${c.disabled ? 'opacity-50 cursor-not-allowed' : ''}">
          <span class="block text-[11px] font-bold">${safe(c.title)}</span>
          <span class="block text-[10px] mt-0.5">${safe(c.priceLabel)}</span>
        </button>
      `;
    }).join('');

    list.querySelectorAll('button[data-borda-id]').forEach(btn => {
      btn.onclick = () => {
        selectedBordaOptionId = btn.dataset.bordaId;
        if (optionsContainer) {
          optionsContainer.querySelectorAll(`fieldset[data-group="${grp.id}"] input[data-option]`).forEach(input => {
            input.value = input.dataset.option === selectedBordaOptionId ? '1' : '0';
          });
        }
        renderBordaButtons();
        calculateAndPaintModalTotal();
      };
    });
  }

  function removalGroups() {
    return selectedFlavors().map(product=>({product,ingredients:extractIngredients(product.ingredients||product.description||'')}));
  }

  function removalKey(product, ingredient) {
    return JSON.stringify([product.id, ingredient]);
  }

  function selectedRemovalNotes(firstProduct = sf.product) {
    return removalGroups(firstProduct).map(({product, ingredients}) => {
      const chosen = ingredients.filter(ingredient => selectedRemovals.includes(removalKey(product, ingredient)));
      return chosen.length ? `Retirar de ${product.name}: ${chosen.join(', ')}` : '';
    }).filter(Boolean);
  }

  function renderRemovals() {
    const section = el('modal-removals-section');
    const list = el('modal-removals-list');
    if (!section || !list || !sf.product) return;
    const groups = removalGroups();
    const validKeys = new Set(groups.flatMap(({product, ingredients}) => ingredients.map(ingredient => removalKey(product, ingredient))));
    selectedRemovals = selectedRemovals.filter(key => validKeys.has(key));
    if (!validKeys.size) {
      section.classList.add('hidden');
      list.innerHTML = '';
      return;
    }
    section.classList.remove('hidden');
    list.innerHTML = groups.filter(group => group.ingredients.length).map(({product, ingredients}) => `
      <section class="space-y-2" data-removal-product="${safe(product.id)}">
        <p class="text-xs font-bold text-[#2f4a32] dark:text-[#faf5ec]">${safe(product.name)}</p>
        ${ingredients.map(ingredient => {
          const key = removalKey(product, ingredient);
          const checked = selectedRemovals.includes(key);
          const cls = checked
            ? 'border-red-400 bg-red-50 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300'
            : 'border-[#dccdb2] bg-[#faf5ec] text-[#4e3220] dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#faf5ec]';
          return `<label class="flex w-full items-center justify-between gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition ${cls}">
            <span class="flex items-center gap-2 text-xs font-medium"><input type="checkbox" data-removal="${safe(key)}" ${checked ? 'checked' : ''} class="h-4 w-4 shrink-0 accent-red-600">${safe(ingredient)}</span>
            <span class="text-xs font-bold shrink-0 ${checked ? 'text-red-600' : 'text-[#6f6457]'}">${checked ? '✕ Será retirado' : '✓ Normal'}</span>
          </label>`;
        }).join('')}
      </section>`).join('');
    list.querySelectorAll('input[data-removal]').forEach(btn => {
      btn.onchange = () => {
        const key = btn.dataset.removal;
        selectedRemovals = selectedRemovals.includes(key) ? selectedRemovals.filter(value => value !== key) : [...selectedRemovals, key];
        renderRemovals();
      };
    });
  }

  window.setFlavorMode = function(mode) {
    const count=({single:1,half:2,triple:3,quad:4})[mode];if(!count || count>maxFlavors())return;
    flavorMode=mode;populateSecondFlavors();updateFlavorButtons();renderBordaButtons();renderRemovals();calculateAndPaintModalTotal();
  };
  window.onSecondFlavorChange = function() { el('modal-second-flavor-select')?.dispatchEvent(new Event('change')); };

  window.handleItemClick = handleItemClick = function (id) {
    let candidate = (sf.products || []).find(item => item.id === id);
    el('juca-first-choice')?.remove();
    if(candidate && /gigante/i.test(candidate.name||'') && !(candidate.variants||[]).length && /promo/i.test(candidate.category||'')) {
      origHandleItemClick(id);isPizzaModal=false;sf.product=null;
      ['modal-half-section','modal-borda-section','modal-removals-section'].forEach(id=>el(id)?.classList.add('hidden'));
      el('modal-product-desc').textContent='Monte sua gigante: escolha primeiro um sabor. O preço e as opções serão conferidos pelo servidor.';
      const picker=document.createElement('div');picker.id='juca-first-choice';picker.className='p-3 border rounded-xl';
      picker.innerHTML='<label class="text-sm font-bold">Escolha o primeiro sabor:<select id="juca-first-flavor" class="block w-full mt-2 p-3 rounded-xl border"><option value="">Selecione um sabor</option>'+sf.products.filter(p=>/pizza/i.test(p.category||'')&&p.orderable!==false&&(p.variants||[]).some(v=>getSizeMeta(v.name).key==='grande'&&v.orderable!==false)).map(p=>`<option value="${safe(p.id)}">${safe(p.name)}${isSweet(p)?' · doce':''}</option>`).join('')+'</select></label>';
      el('modal-half-section').before(picker);el('modal-submit-btn').disabled=true;el('modal-submit-btn').textContent='Escolha o primeiro sabor';
      el('juca-first-flavor').onchange=event=>{if(!event.target.value)return;handleItemClick(event.target.value);const giant=[...document.querySelectorAll('[name="product-variant"]')].find(r=>getSizeMeta(sf.product.variants.find(v=>v.id===r.value)?.name).key==='grande');if(giant){giant.checked=true;giant.dispatchEvent(new Event('change'));}};
      return;
    }
    if (candidate && (candidate.category || '').toLowerCase() === 'bordas') {
      alert('A borda externa acompanha somente a pizza gigante. Escolha uma pizza gigante e adicione a borda nas opções dela.');
      return;
    }
    origHandleItemClick(id);
    const p = sf.product;
    if (!p) return;

    const catLower = (p.category || '').toLowerCase();
    isPizzaModal = catLower.includes('pizza') || (p.variants || []).some(v => /broto|m[eé]dia|grande|gigant/i.test(v.name || ''));

    flavorMode = 'single';
    extraFlavors = [];
    includeDrink = true;
    selectedBordaOptionId = 'none';
    selectedRemovals = [];

    const halfSection = el('modal-half-section');
    const bordaSection = el('modal-borda-section');
    const removalsSection = el('modal-removals-section');
    const optionsContainer = el('product-options');
    const variantsList = el('modal-variants-list');

    if (!isPizzaModal) {
      if (halfSection) halfSection.classList.add('hidden');
      if (bordaSection) bordaSection.classList.add('hidden');
      if (removalsSection) removalsSection.classList.add('hidden');
      if (variantsList) variantsList.className = 'grid gap-2';
      if (optionsContainer) {
        optionsContainer.querySelectorAll('fieldset').forEach(fs => fs.classList.remove('hidden'));
        optionsContainer.classList.remove('hidden');
      }
      calculateAndPaintModalTotal();
      return;
    }

    if (el('modal-category-badge')) {
      el('modal-category-badge').textContent = catLower.includes('doce') ? 'PIZZA DOCE' : 'PIZZA SALGADA';
    }

    renderPizzaSizes(true);
    if (halfSection) halfSection.classList.remove('hidden');
    populateSecondFlavors();
    updateFlavorButtons();
    renderBordaButtons();
    renderRemovals();
    calculateAndPaintModalTotal();
    refreshRules();
  };

  window.changeModalQty = changeModalQty = function (delta) {
    origChangeModalQty(delta);
    calculateAndPaintModalTotal();
  };

  window.confirmModalAddToCart = confirmModalAddToCart = function() {
    if(!sf.product || !isPizzaModal)return origConfirmModalAddToCart();
    if(!pizzaRules || loadingRules){alert('Aguarde a conferência das regras da pizza.');return;}
    const products=selectedFlavors();
    if(products.length!==flavorCount()){alert('Escolha todos os sabores.');return;}
    const raw=(el('modal-item-notes')?.value||'').trim();
    if(raw.length>300){alert('Use até 300 caracteres na observação. As retiradas são registradas separadamente.');return;}
    const flavors=removalGroups().map(({product,ingredients})=>({product_id:product.id,remove_ingredients:ingredients.filter(i=>selectedRemovals.includes(removalKey(product,i)))}));
    const notes=[...selectedRemovalNotes(),raw?`Obs: ${raw}`:''].filter(Boolean).join(' • ');
    const name=products.map(p=>`${products.length>1?'1/'+products.length+' ':''}${p.name}`).join(' + ')+' · '+getSizeMeta(getSelectedVariant()?.name).title;
    const include=drinkEligible() && includeDrink && pizzaRules.guarana.available;
    const price=pizzaPrice()+getSelectedBordaPrice(), before=sf.cart.length;
    const chosenBorder=selectedBordaOptionId==='none'?null:{group_id:'grp_borda',option_id:selectedBordaOptionId,quantity:1};
    origConfirmModalAddToCart();
    if(sf.cart.length>before){sf.cart.at(-1).addons=sf.cart.at(-1).addons.filter(a=>a.group_id!=='grp_borda');if(chosenBorder)sf.cart.at(-1).addons.push(chosenBorder);Object.assign(sf.cart.at(-1),{flavors,include_drink:!!include,juca_user_notes:raw,notes:notes+(drinkEligible()?(notes?' • ':'')+(include?'Com Guaraná Antarctica 1,5 L grátis':'Sem refrigerante, mesmo preço'):''),name,price});renderCart();}
  };
  const originalInput=validateAndGetStorefrontInput;
  window.validateAndGetStorefrontInput=validateAndGetStorefrontInput=function(){
    const input=originalInput();
    input.items=input.items.map((item,index)=>sf.cart[index].flavors?{...item,flavors:sf.cart[index].flavors,include_drink:sf.cart[index].include_drink,notes:sf.cart[index].juca_user_notes||''}:item);
    return input;
  };
  const originalApi=sfApi;
  window.sfApi=sfApi=async function(path='',data){
    const result=await originalApi(path,data);
    if(result.jucaPizzaRules)pizzaRules=result.jucaPizzaRules;
    return result;
  };
  async function refreshRules(){
    if(loadingRules)return;
    loadingRules=true;calculateAndPaintModalTotal();
    try{await sfApi();}catch(error){pizzaRules=null;sfFeedback(error.message,true);}
    finally{loadingRules=false;if(isPizzaModal){if(flavorCount()>maxFlavors())flavorMode='single';renderPizzaSizes();populateSecondFlavors();updateFlavorButtons();renderBordaButtons();renderRemovals();calculateAndPaintModalTotal();}}
  }
  refreshRules();
  function updatePizzaCardPriceLabels() {
    const grid = el('products-grid');
    if (!grid || !Array.isArray(sf.products)) return;

    grid.querySelectorAll('button[data-product]').forEach(btn => {
      const p = sf.products.find(item => item && item.id === btn.dataset.product);
      if (!p) return;

      const mediaVar = (p.variants || []).find(
        v =>
          v.available !== false &&
          v.orderable !== false &&
          v.priceStatus !== 'review_required' &&
          v.name &&
          /m[eé]d|med/i.test(v.name) &&
          v.price != null
      );
      if (!mediaVar) return;

      const strong = btn.querySelector('strong');
      if (!strong) return;

      const targetText = formatMoney(mediaVar.price);
      if (strong.textContent.trim() !== targetText) {
        strong.textContent = targetText;
      }
      strong.style.whiteSpace = 'nowrap';
    });
  }

  if (origRenderProducts) {
    window.renderProducts = renderProducts = function () {
      origRenderProducts.apply(this, arguments);
      updatePizzaCardPriceLabels();
    };
  }
  updatePizzaCardPriceLabels();

  // Visual-only sync for checkout badges and payment pills (preserves 100% of storefront.js logic)
  function syncCartCountLabels() {
    try {
      const count = Array.isArray(sf.cart) ? sf.cart.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0) : 0;
      const text = count === 1 ? '1 item' : `${count} itens`;
      const h = el('cart-header-count');
      const b = el('cart-items-badge');
      if (h) h.textContent = text;
      if (b) b.textContent = text;
    } catch {}
  }

  function setupValuesToggle() {
    try {
      const panel = el('cart-values-panel');
      const expandBtn = el('btn-expand-values');
      const collapseBtn = el('btn-collapse-values');
      if (!panel || !expandBtn || !collapseBtn) return;

      const setExpanded = open => {
        panel.classList.toggle('hidden', !open);
        expandBtn.classList.toggle('hidden', open);
      };
      expandBtn.onclick = () => setExpanded(true);
      collapseBtn.onclick = () => setExpanded(false);
    } catch {}
  }

  function syncPaymentPills() {
    try {
      const select = el('payment-method');
      const pillsBox = el('payment-pills-container');
      const trocoBox = el('troco-wrapper');
      if (!select || !pillsBox) return;

      const options = [...select.options].filter(o => o.value);
      if (!options.length) {
        pillsBox.classList.add('hidden');
        select.parentElement?.classList.remove('sr-only');
        if (trocoBox) trocoBox.classList.add('hidden');
        return;
      }

      const shortLabels = { pix: 'PIX', cash: 'Dinheiro', card: 'Cartão' };
      const icons = { pix: '⚡', cash: '💵', card: '💳' };

      pillsBox.classList.remove('hidden');
      select.parentElement?.classList.add('sr-only');

      pillsBox.innerHTML = options.map(opt => {
        const active = select.value === opt.value;
        const cls = active
          ? 'py-3 px-4 rounded-full border border-[#2f4a32] bg-[#2f4a32] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs'
          : 'py-3 px-4 rounded-full border border-[#dccdb2] bg-[#faf5ec] text-[#4e3220] hover:border-[#2f4a32]/50 font-bold text-xs flex items-center justify-center gap-2 transition';
        return `<button type="button" data-pay-pill="${safe(opt.value)}" class="${cls}"><span>${icons[opt.value] || '💳'}</span><span>${safe(shortLabels[opt.value] || opt.textContent)}</span></button>`;
      }).join('');

      pillsBox.querySelectorAll('[data-pay-pill]').forEach(btn => {
        btn.onclick = () => {
          select.value = btn.dataset.payPill;
          select.dispatchEvent(new Event('input', { bubbles: true }));
          select.dispatchEvent(new Event('change', { bubbles: true }));
          syncPaymentPills();
        };
      });

      if (trocoBox) trocoBox.classList.toggle('hidden', select.value !== 'cash');
    } catch {}
  }

  const cartItemsNode = el('cart-items');
  if (cartItemsNode) {
    new MutationObserver(syncCartCountLabels).observe(cartItemsNode, { childList: true });
  }
  const paymentSelectNode = el('payment-method');
  if (paymentSelectNode) {
    new MutationObserver(syncPaymentPills).observe(paymentSelectNode, { childList: true });
    paymentSelectNode.addEventListener('change', syncPaymentPills);
  }
  syncCartCountLabels();
  syncPaymentPills();
  setupValuesToggle();
})();
