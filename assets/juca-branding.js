/**
 * juca-branding.js - Gerenciador Universal de Marca e Personalização Multi-Tenant
 * Aplica nome, logos, títulos, cidade e regras do cliente de forma dinâmica
 */
(function() {
  function applyBranding() {
    var search = window.location.search || "";
    var params = new URLSearchParams(search);
    var slug = (params.get("c") || params.get("slug") || "").trim().toLowerCase();

    // Se não encontrou slug na URL, tentar pelo usuário autenticado localmente
    if (!slug) {
      try {
        var rawUser = localStorage.getItem("juca_auth_user");
        if (rawUser) {
          var u = JSON.parse(rawUser);
          if (u && u.tenant) slug = u.tenant.toLowerCase();
        }
      } catch (e) {}
    }

    // Se estiver em rota /lojas/<slug>/ ou /tenants/<slug>/
    if (!slug) {
      var match = window.location.pathname.match(/\/(?:lojas|tenants)\/([-a-z0-9_]+)/i);
      if (match) slug = match[1].toLowerCase();
    }

    // 1. Preservar query params nos links internos
    if (slug) {
      document.querySelectorAll("a[href]").forEach(function(a) {
        var href = a.getAttribute("href");
        if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("tel:") && !href.startsWith("mailto:")) {
          if (!href.includes("?c=") && !href.includes("&c=")) {
            a.setAttribute("href", href + (href.includes("?") ? "&" : "?") + "c=" + encodeURIComponent(slug));
          }
        }
      });
    }

    // 2. Redirecionar links "Ver cardápio" para /cardapio/ com ?c=slug garantido
    document.querySelectorAll("a").forEach(function(a) {
      var href = a.getAttribute("href") || "";
      var text = (a.textContent || "").toLowerCase();
      if (text.includes("cardápio") || text.includes("cardapio") || href.includes("cardapio")) {
        var target = "/cardapio/" + (slug ? "?c=" + encodeURIComponent(slug) : "");
        a.setAttribute("href", target);
      }
    });

    // 3. Ativar Lucide Icons
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }

    // 4. Se não há slug ou é demonstração pura Juca, encerra
    if (!slug || slug === "demo_delivery_39054c477da1" || slug === "pizzadojuca") {
      return;
    }

    // 5. Consultar dados públicos da empresa
    fetch("/api/client-public?c=" + encodeURIComponent(slug))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data || !data.success || !data.client) return;
        var client = data.client;

        // A) Atualizar <title>
        if (client.name) {
          if (document.title.includes("Pizza do Juca")) {
            document.title = document.title.replace(/Pizza do Juca/g, client.name);
          } else if (!document.title.includes(client.name)) {
            document.title = client.name + " | " + document.title;
          }
        }

        // B) Atualizar Logos (todas as tags <img> de logo)
        if (client.logoUrl) {
          document.querySelectorAll("img").forEach(function(img) {
            var src = img.getAttribute("src") || "";
            var alt = img.getAttribute("alt") || "";
            if (src.includes("logo") || alt.toLowerCase().includes("juca") || alt.toLowerCase().includes("logo")) {
              img.src = client.logoUrl;
              img.removeAttribute("onerror");
            }
          });
          document.querySelectorAll("link[rel='icon']").forEach(function(link) {
            link.href = client.logoUrl;
          });
        }

        // C) Atualizar Nome da Loja apenas em elementos de marca dedicados ou que contenham Pizza do Juca
        var cleanName = (client.name || "").replace(/[:\-]\s*r?henan/gi, "").trim();
        if (cleanName && cleanName !== "Pizza do Juca") {
          document.querySelectorAll(".brand-title, .brand-name, [data-brand-name]").forEach(function(el) {
            el.textContent = cleanName;
          });
          document.querySelectorAll("h1, h2, h3, .text-\\[16px\\].font-extrabold").forEach(function(el) {
            if (el.textContent.includes("Pizza do Juca")) {
              el.textContent = el.textContent.replace(/Pizza do Juca/gi, cleanName);
            }
          });
        }

        // D) Atualizar Cidade / Região
        if (client.city) {
          document.querySelectorAll(".text-slate-500, .brand-city, address, p, span").forEach(function(el) {
            if (el.textContent.includes("Paciência - RJ") || el.textContent.includes("Paciência, RJ") || el.textContent.includes("Campo Grande - RJ")) {
              el.textContent = el.textContent.replace(/Paciência\s*[-,s]*\s*RJ/gi, client.city).replace(/Campo Grande\s*[-,s]*\s*RJ/gi, client.city);
            }
          });
        }

        // E) Na página de login
        var loginHeading = document.querySelector("h1.text-xl");
        if (loginHeading && loginHeading.textContent.includes("Pizza do Juca")) {
          loginHeading.textContent = client.name;
        }

        // Se Lucide existir, reexecutar
        if (window.lucide && typeof window.lucide.createIcons === "function") {
          window.lucide.createIcons();
        }
      })
      .catch(function(err) {
        console.warn("[Branding] Falha ao carregar marca da empresa:", err.message);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyBranding);
  } else {
    applyBranding();
  }
})();
