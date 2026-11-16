(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.JucaOrders = api;
})(typeof window === 'object' ? window : globalThis, function() {
  'use strict';
  const aliases = {preparo:'preparando',preparing:'preparando',requested:'recebido',approved:'recebido',ready:'pronto',dispatching:'entrega',delivered:'concluido',entregue:'concluido',cancelled:'cancelado',canceled:'cancelado'};
  const statuses = ['recebido','preparando','pronto','entrega','concluido','cancelado'];
  function status(value) { const s = String(value || 'recebido').trim().toLowerCase(); return aliases[s] || s; }
  function text(value, depth = 0) {
    if (value == null || depth > 5) return '';
    if (Array.isArray(value)) return value.map(v => text(v, depth + 1)).filter(Boolean).join(' / ');
    if (typeof value === 'object') return text(value.name || value.nome || value.title || value.label || value.description || value.sabor || '', depth + 1);
    return String(value);
  }
  function item(value) {
    if (value == null) return 'Item sem descrição';
    if (typeof value !== 'object') return String(value);
    const name = text(value) || 'Item sem descrição';
    const qty = Number(value.quantity ?? value.qty ?? value.quantidade) || 1;
    const title = /^\d+\s*[x×]/i.test(name) ? name : qty + '× ' + name;
    const details = [text(value.variant_name || value.size || value.tamanho), text(value.flavors || value.sabores || value.halves), text(value.details), text(value.addons || value.adicionais), text(value.notes || value.observations || value.observacoes || value.observacao)].filter(Boolean);
    return title + (details.length ? ' (' + details.join(' · ') + ')' : '');
  }
  function normalize(o) {
    if (!o || typeof o !== 'object' || o.id == null && o.order_number == null) return null;
    const total = Number(o.total);
    const normalized = {...o, id:o.id ?? o.order_number, status:status(o.status), items:(Array.isArray(o.items) ? o.items : o.items == null ? [] : [o.items]).map(item), minutes:Number(o.minutes)||0};
    for (const k of ['customer','channel','payment','phone','address','neighborhood','notes','courier']) normalized[k] = text(o[k]);
    normalized.customer ||= 'Cliente'; normalized.channel ||= 'Site Oficial'; normalized.payment ||= 'A combinar';
    normalized.price = text(o.price) || (Number.isFinite(total) ? total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) : 'Valor a conferir');
    return normalized;
  }
  function escape(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function trackingUrl(id, tenant = 'pizzadojuca') { return 'https://hub.automatech.tech/rastreio/?id=' + encodeURIComponent(id) + '&c=' + encodeURIComponent(tenant); }
  return {status,statuses,item,normalize,escape,trackingUrl};
});
