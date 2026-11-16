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

/**
 * juca-api.js - Cliente de Comunicação com a API e Banco de Dados VPS
 * Funciona de forma transparente: tenta a API VPS (/api/...) e se
 * estiver offline ou sem rede, usa o localStorage local como fallback.
 */

window.JucaAPI = (function() {
  const API_BASE = '/api';
  function getTenant() {
    const params = new URLSearchParams(location.search);
    const pathTenant = location.pathname.match(/^\/(?:lojas|tenants)\/([-a-z0-9_]+)/i);
    if (pathTenant) return pathTenant[1];
    const explicit = params.get('c') || params.get('slug');
    if (explicit) return explicit;
    if (/\/(?:painel|painel-delivery|pedidos|motoboy|admin)(?:\/|$)/.test(location.pathname)) {
      try { const user = JSON.parse(localStorage.getItem('juca_auth_user') || 'null'); if (user?.tenant) return user.tenant; } catch {}
    }
    const remembered = localStorage.getItem('juca_last_tenant'); if (remembered && remembered !== 'pizzadojuca') return remembered; return 'victor_0e09df80';
  }
  function ordersKey() { return 'juca-panel-orders:' + getTenant(); }
  function cachedOrders() {
    try { const rows = JSON.parse(localStorage.getItem(ordersKey()) || '[]'); return Array.isArray(rows) ? rows.map(JucaOrders.normalize).filter(Boolean) : []; } catch { return []; }
  }
  function cacheOrders(rows) { try { localStorage.setItem(ordersKey(), JSON.stringify(rows)); } catch {} }
  function withTenant(data) { return {...data, tenant:getTenant()}; }

  async function request(endpoint, options = {}) {
    const url = new URL(`${API_BASE}${endpoint}`, location.origin);
    url.searchParams.set('c', getTenant());
    const token = localStorage.getItem('juca_auth_token');
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const config = {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (data && (data.error || data.message)) return data;
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return data;
    } catch (err) {
      console.warn(`[JucaAPI] Falha em ${endpoint}:`, err.message);
      return null;
    }
  }

  return {
    getTenant, ordersKey, cachedOrders, cacheOrders,
    trackingUrl: id => JucaOrders.trackingUrl(id, getTenant()),
    fetchOrder: async id => { const res = await request('/pedidos/' + encodeURIComponent(id)); return res?.success ? JucaOrders.normalize(res.order) : null; },
    // 1. Checar saúde do backend
    checkHealth: async function() {
      return await request('/health');
    },

    // 2. Enviar Pedido para o Banco da VPS
    sendOrder: async function(orderData) {
      const res = await request('/pedidos', {method:'POST', body:JSON.stringify(withTenant(orderData))});
      if (res?.success && res.order) {
        const rows = cachedOrders().filter(o => String(o.id) !== String(res.order.id));
        cacheOrders([JucaOrders.normalize(res.order), ...rows]);
      }
      return res;
    },

    // 3. Atualizar Status do Pedido
    updateOrderStatus: async function(orderId, status, courier = null, stage = null) {
      return await request(`/pedidos/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status:JucaOrders.status(status), courier, stage })
      });
    },

    // 4. Cadastrar Aniversariante no Clube de Desconto
    registerBirthday: async function(birthdayData) {
      return await request('/clientes/aniversario', {
        method: 'POST',
        body: JSON.stringify(birthdayData)
      });
    },

    // 5. Salvar Carrinho Abandonado (Recuperador de Vendas)
    trackAbandonedCart: async function(cartData) {
      return await request('/carrinho-abandonado', {
        method: 'POST',
        body: JSON.stringify(cartData)
      });
    },

    // 5.1 Buscar Carrinhos Abandonados
    getAbandonedCarts: async function() {
      const res = await request('/carrinho-abandonado');
      if (res && res.success && Array.isArray(res.carts)) {
        return res.carts;
      }
      return null;
    },

    // 5.2 Marcar Carrinho como Recuperado
    markCartRecovered: async function(id) {
      return await request(`/carrinho-abandonado/${id}/recuperado`, {
        method: 'PATCH'
      });
    },

    // 6. Buscar Pedidos do Servidor
    fetchOrders: async function() {
      const res = await request('/pedidos');
      if (res && res.success && Array.isArray(res.orders)) {
        return res.orders.map(JucaOrders.normalize).filter(Boolean);
      }
      return null;
    },

    // 7. Obter chave pública do Mercado Pago
    getMPPublicKey: async function() {
      return await request('/mp/public-key');
    },

    // 8. Criar preferência de pagamento no Mercado Pago
    createMPPreference: async function(prefData) {
      return await request('/mp/criar-preferencia', {
        method: 'POST',
        body: JSON.stringify(prefData)
      });
    },

    // 9. Processar pagamento via Bricks
    processMPPayment: async function(paymentData) {
      return await request('/mp/processar-pagamento', {
        method: 'POST',
        body: JSON.stringify({...paymentData, tenant:getTenant(), orderMeta:withTenant(paymentData.orderMeta || paymentData)})
      });
    },

    // 10. Salvar Fechamento de Motoboy
    saveMotoboyClosing: async function(closingData) {
      // Salvar em fallback local
      try {
        const localClosings = JSON.parse(localStorage.getItem('juca-motoboy-closings') || '[]');
        localClosings.unshift({
          ...closingData,
          id: Date.now(),
          created_at: new Date().toISOString()
        });
        localStorage.setItem('juca-motoboy-closings', JSON.stringify(localClosings));
      } catch (e) {
        console.warn('Erro ao salvar fechamento localmente:', e);
      }

      // Enviar para a API
      const res = await request('/motoboys/fechamentos', {
        method: 'POST',
        body: JSON.stringify(closingData)
      });
      return res;
    },

    // 11. Buscar Histórico de Fechamentos de Motoboys
    getMotoboyClosings: async function() {
      const res = await request('/motoboys/fechamentos');
      if (res && res.success && Array.isArray(res.closings)) {
        return res.closings;
      }
      try {
        return JSON.parse(localStorage.getItem('juca-motoboy-closings') || '[]');
      } catch (e) {
        return [];
      }
    },

    // 12. Autenticação & Gestão de Sessão (RBAC)
    login: async function(emailOrUsername, password) {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: emailOrUsername, login: emailOrUsername, password, senha: password })
      });
      if (res && res.success && res.token) {
        localStorage.setItem('juca_auth_token', res.token);
        localStorage.setItem('juca_auth_user', JSON.stringify(res.user));
      }
      return res;
    },

    register: async function(userData) {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res && res.success && res.token) {
        localStorage.setItem('juca_auth_token', res.token);
        localStorage.setItem('juca_auth_user', JSON.stringify(res.user));
      }
      return res;
    },

    logout: function() {
      localStorage.removeItem('juca_auth_token');
      localStorage.removeItem('juca_auth_user');
      window.location.href = '/painel/login/';
    },

    getCurrentUser: function() {
      try {
        return JSON.parse(localStorage.getItem('juca_auth_user') || 'null');
      } catch (e) {
        return null;
      }
    },

    getToken: function() {
      return localStorage.getItem('juca_auth_token') || null;
    },

    // 13. Relatório de Faturamento Blindado (ADMIN e SUPERADMIN)
    getBillingSummary: async function() {
      return await request('/admin/faturamento');
    },

    // 14. Gestão de Equipe & Permissões Hierárquicas
    getEquipe: async function() {
      return await request('/equipe');
    },

    promoverMembro: async function(email, role) {
      return await request('/equipe/promover', {
        method: 'POST',
        body: JSON.stringify({ email, role })
      });
    },

    removerMembro: async function(email) {
      return await request('/equipe/remover', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    }
  };
})();

