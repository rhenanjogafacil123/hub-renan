# Teixo Hub & Planilha de Clientes — Pacote de Exportação

Pacote exportado diretamente da VPS Teixo (\143.95.174.216\) em Novembro/2026 para migração e acoplamento na VPS da Automatech (\195.35.40.99\).

---

## 📦 Estrutura de Arquivos

\\\	ext
teixo-hub-e-planilha/
├── index.html              # Interface do Teixo Hub (Vitrine de Clientes, Cards com Site e Painel)
├── projetos.json           # Base JSON dinâmica de todos os clientes exibidos no Hub
├── favicon.ico             # Ícone do Hub
├── nginx-logo.png          # Logo auxiliar
├── planilha/               # Symlink apontando para painel/planilha/
├── painel/
│   └── planilha/
│       └── index.html      # Planilha de Clientes Comercial conectada ao Google Sheets da Automatech
├── nginx/
│   ├── no-cache.conf       # Headers anti-cache essenciais para o Nginx (no-cache, no-store)
│   ├── security.conf       # Proteção de arquivos sensíveis e headers de segurança
│   └── juca-api.conf       # Configuração de proxy reverso e rate limit de APIs
└── README.md
\\\

---

## 🚀 Como Integrar na VPS do Vitor (\195.35.40.99\)

### Opção A — Subpasta na Central Automatech (Ex: \/teixo-hub\ e \/planilha\)
1. Copie a pasta para \/var/www/central-automatech/public/teixo-hub/\.
2. Aponte a rota no Express (\server.js\) ou crie o alias no Nginx.
3. Acesse via \https://central.automatech.tech/teixo-hub/\ e \https://central.automatech.tech/planilha/\.

### Opção B — Subdomínio Dedicado (Ex: \hub.teixo.com.br\ ou \hub.automatech.tech\)
1. Crie uma pasta \/var/www/teixo-hub/\ na VPS da Automatech.
2. Descompacte este pacote nela.
3. Configure o Traefik ou Nginx apontando para essa pasta como raiz (\oot /var/www/teixo-hub;\).

---

## ⚙️ Dependências e Conexões Externas

1. **Planilha de Clientes (\painel/planilha/index.html\):**
   - Conecta-se diretamente via API de visualização CSV do Google Sheets:
     \https://docs.google.com/spreadsheets/d/1BkJ8l9v6h2a0_p-Hnvy6JzY1vDcqg_aE4XN8bB9x1o/gviz/tq?tqx=out:csv\
   - Zero dependência de backend local ou banco de dados para a planilha: roda 100% no navegador (Client-Side) com Tailwind e Lucide via CDN.

2. **Teixo Hub (\index.html\):**
   - Faz fetch direto de \/projetos.json\ na mesma origem para renderizar os cards dos clientes.
   - Suporta filtros por Fase (\Fechado\, \Proposta enviada\, \Pitch de vendas\, \Cliente em potencial\).
