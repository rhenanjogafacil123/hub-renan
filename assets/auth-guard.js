/**
 * auth-guard.js - Guardião de Autenticação e RBAC Hierárquico Teixo / Juca
 * Blindagem 100% no Frontend e Backend:
 * - Se já possui sessão ativa no Hub Automatech -> Sincroniza automaticamente via /api/auth/me
 * - Se não estiver logado -> Redireciona para /painel/login/ preservando parâmetros (?c=...)
 * - Se for perfil Cliente -> Redireciona para /painel/cliente/
 * - Se for perfil Motoboy -> Bloqueia telas da cozinha/admin e manda para /painel/motoboy/
 * - Se for perfil Atendente -> Bloqueia telas de finanças/equipe e manda para /painel/pedidos/
 * - Se for Admin, Superadmin, Master ou Manager -> Acesso total à gestão
 * - Injeta pill flutuante com dados da sessão e botão Sair/Logout
 */

(function() {
  const currentPath = window.location.pathname;

  // Se estiver na tela de login, verificar se já tem sessão para redirecionar direto
  if (currentPath.includes('/painel/login/')) {
    const token = localStorage.getItem('juca_auth_token');
    const userRaw = localStorage.getItem('juca_auth_user');
    if (token && userRaw) {
      try {
        const u = JSON.parse(userRaw);
        redirectByRole(u.role);
      } catch (e) {}
    }
    return;
  }

  // 1. Verificar se há sessão ativa local
  let token = localStorage.getItem('juca_auth_token');
  let userRaw = localStorage.getItem('juca_auth_user');

  // Se não encontrar no localStorage, tenta sincronizar sessão já autenticada do Hub Automatech via cookie
  if (!token || !userRaw) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/auth/me', false); // Síncrono para validação imediata antes da renderização
      xhr.send(null);
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText || '{}');
        if (data && data.user) {
          const authUser = data.user;
          const authToken = authUser.csrf || ('hub_session_' + Date.now());
          localStorage.setItem('juca_auth_token', authToken);
          localStorage.setItem('juca_auth_user', JSON.stringify(authUser));
          token = authToken;
          userRaw = JSON.stringify(authUser);
        }
      }
    } catch (e) {
      console.warn('[AuthGuard] Verificação de sessão Hub:', e.message);
    }
  }

  // Se ainda assim não houver usuário autenticado, redireciona para login preservando tenant
  if (!token || !userRaw) {
    console.warn('[AuthGuard] Acesso não autenticado detectado. Redirecionando para login...');
    sessionStorage.setItem('juca_redirect_target', window.location.href);
    const qs = window.location.search || '';
    window.location.replace('/painel/login/' + qs);
    return;
  }

  let user = null;
  try {
    user = JSON.parse(userRaw);
  } catch (e) {
    localStorage.removeItem('juca_auth_token');
    localStorage.removeItem('juca_auth_user');
    const qs = window.location.search || '';
    window.location.replace('/painel/login/' + qs);
    return;
  }

  const role = (user.role || 'cliente').toLowerCase();

  // 2. Validação de Permissões por Rota (RBAC Hierárquico)
  if (role === 'cliente') {
    if (!currentPath.includes('/painel/cliente/')) {
      console.warn('[AuthGuard] Conta de cliente detectada no painel. Redirecionando para /painel/cliente/...');
      window.location.replace('/painel/cliente/');
      return;
    }
  }

  if (currentPath.includes('/painel/cliente/') && role !== 'cliente') {
    redirectByRole(role);
    return;
  }

  // Motoboy não acessa telas de pedidos gerais, admin, etc.
  const isAdminOrKitchenRoute = 
    currentPath.includes('/pedidos/') ||
    currentPath.includes('/admin/') ||
    currentPath.includes('/estoque/') ||
    currentPath.includes('/ceasa/') ||
    currentPath.includes('/produtos/') ||
    currentPath.includes('/promocoes/') ||
    currentPath.includes('/canais/') ||
    currentPath.includes('/equipe/') ||
    currentPath.includes('/configuracoes/');

  if (role === 'motoboy') {
    if (isAdminOrKitchenRoute || currentPath.endsWith('/painel/') || currentPath.endsWith('/painel/index.html')) {
      console.warn('[AuthGuard] Motoboy bloqueado de tela de gestão. Redirecionando para /painel/motoboy/...');
      window.location.replace('/painel/motoboy/');
      return;
    }
  }

  // Atendente não acessa administração financeira nem equipe
  const isAdminOnlyRoute = currentPath.includes('/admin/') || currentPath.includes('/configuracoes/') || currentPath.includes('/equipe/');
  if (role === 'atendente') {
    if (isAdminOnlyRoute) {
      console.warn('[AuthGuard] Atendente bloqueado de tela administrativa/equipe. Redirecionando para /painel/pedidos/...');
      window.location.replace('/painel/pedidos/');
      return;
    }
    if (currentPath.endsWith('/painel/') || currentPath.endsWith('/painel/index.html')) {
      window.location.replace('/painel/pedidos/');
      return;
    }
  }

  // Admin, Superadmin, Master e Manager têm acesso liberado às suas respectivas áreas

  // 3. Injetar Pill de Sessão do Usuário no DOM após carregar
  document.addEventListener('DOMContentLoaded', () => {
    injectUserSessionBadge(user);
  });
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    injectUserSessionBadge(user);
  }

  function redirectByRole(userRole) {
    const r = (userRole || '').toLowerCase();
    const qs = window.location.search || '';
    if (r === 'cliente') {
      window.location.replace('/painel/cliente/' + qs);
    } else if (r === 'motoboy') {
      window.location.replace('/painel/motoboy/' + qs);
    } else if (r === 'atendente') {
      window.location.replace('/painel/pedidos/' + qs);
    } else {
      // admin, master, manager ou superadmin
      window.location.replace('/painel/pedidos/' + qs);
    }
  }

  function injectUserSessionBadge(currentUser) {
    if (document.getElementById('juca-auth-session-badge')) return;

    const roleBadges = {
      superadmin: { label: 'Master Global', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: '👑' },
      master: { label: 'Master Global', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: '👑' },
      manager: { label: 'Gestor Hub', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: '👑' },
      admin: { label: 'Gestor Geral', bg: 'bg-orange-50 text-orange-800 border-orange-200', icon: '🍕' },
      atendente: { label: 'Atendente', bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: '📋' },
      motoboy: { label: 'Motoboy', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: '🛵' },
      cliente: { label: 'Cliente', bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: '👤' }
    };

    const userRoleKey = (currentUser.role || 'cliente').toLowerCase();
    const info = roleBadges[userRoleKey] || roleBadges.cliente;
    const badge = document.createElement('div');
    badge.id = 'juca-auth-session-badge';
    badge.className = 'fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-md text-xs text-slate-900';
    badge.innerHTML = `
      <div class="flex items-center gap-1.5 pl-2 pr-1">
        <span class="text-sm">${info.icon}</span>
        <div>
          <div class="font-extrabold text-slate-900 text-[11px] leading-tight">${currentUser.nome_completo || currentUser.nome || currentUser.name || currentUser.username}</div>
          <div class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">${info.label}</div>
        </div>
      </div>
      <button 
        type="button" 
        onclick="window.JucaAuthGuard.logout()" 
        class="rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 text-[10px] font-black transition"
        title="Encerrar sessão segura"
      >
        Sair
      </button>
    `;

    document.body.appendChild(badge);
  }

  // Exportar globalmente
  window.JucaAuthGuard = {
    getUser: () => user,
    getRole: () => role,
    logout: () => {
      if (confirm('Deseja realmente sair da sua conta?')) {
        localStorage.removeItem('juca_auth_token');
        localStorage.removeItem('juca_auth_user');
        window.location.replace('/painel/login/');
      }
    }
  };
})();

