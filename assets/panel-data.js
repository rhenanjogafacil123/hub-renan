// panel-data.js - Repositório Central e Utilitários do Painel Delivery Oficial
// Modelo oficial do nicho: Todos os dados padrão iniciam vazios para novas empresas

const DEFAULT_ORDERS = [];
const DEFAULT_COURIERS = [];
const DEFAULT_SOLD_OUT = [];
const DEFAULT_COURIER_AVAILABLE = [];
const DEFAULT_COURIER_ACTIVE = [];
const DEFAULT_COURIER_HISTORY = [];
const DEFAULT_CATEGORIES = [];
const DEFAULT_PRODUCTS = [];

// Configuração padrão de Gateways e Maquininhas por Loja (Multi-tenant)
const DEFAULT_GATEWAYS = {
  mercado_pago: {
    enabled: true,
    status: 'connected',
    publicKey: 'APP_USR-782194-PROD-712',
    accessToken: 'APP_USR-882190-xxxx-xxxx-xxxx',
    pixKey: 'financeiro@pizzaria.com.br',
    mode: 'production'
  },
  pagbank: {
    enabled: true,
    status: 'connected',
    token: 'PAGBANK-TOKEN-991240-xxxx',
    email: 'pagamentos@pizzaria.com.br'
  },
  stone_cielo: {
    enabled: false,
    provider: 'stone',
    merchantId: ''
  }
};

const DEFAULT_POS_DEVICES = [
  {
    id: 'pos-1',
    name: 'Balcão 01 (Principal)',
    provider: 'Mercado Pago (Point Pro / Smart)',
    serial: 'PA60-882194',
    location: 'balcao',
    status: 'online',
    lastTest: 'Online e Pronta'
  },
  {
    id: 'pos-2',
    name: 'Balcão 02 (Caixa Apoio)',
    provider: 'PagBank (Moderninha Smart)',
    serial: 'PAG-441209',
    location: 'balcao',
    status: 'online',
    lastTest: 'Online e Pronta'
  },
  {
    id: 'pos-3',
    name: 'Motoboy 01 (Entregas)',
    provider: 'Mercado Pago (Point Mini / Smart)',
    serial: 'MP-993102',
    location: 'entrega',
    status: 'online',
    lastTest: 'Em rota de entrega'
  }
];

const DEFAULT_PAYMENT_METHODS = {
  pix_online: true,
  card_credit_delivery: true,
  card_debit_delivery: true,
  meal_voucher: true,
  cash: true
};

// Funções utilitárias de Storage
function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Helpers para Toast
function showToast(msg) {
  const existing = document.getElementById("panel-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "panel-toast";
  toast.className = "fixed bottom-6 right-6 z-[130] rounded-2xl bg-slate-950 px-4 py-3 text-xs font-extrabold text-white shadow-2xl transition-all duration-300";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2300);
}

// Simulação de Disparo de Cobrança em Maquininha Cloud / Point / PagBank
function simulatePosCharge(device, amount, method = 'Crédito', onStep = null) {
  return new Promise((resolve, reject) => {
    if (!device) {
      if (onStep) onStep({ error: 'Nenhuma maquininha selecionada' });
      return reject(new Error('Nenhuma maquininha selecionada'));
    }
    const valFormatted = Number(amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Passo 1: Enviando comando Cloud
    if (onStep) onStep({ step: 1, message: `Conectando ao terminal ${device.name} (${device.serial})...` });
    
    setTimeout(() => {
      // Passo 2: Maquininha acendeu e aguarda cartão
      if (onStep) onStep({ step: 2, message: `Aproxime ou insira o cartão no terminal [${device.name}] - Valor: ${valFormatted}` });
      
      setTimeout(() => {
        // Passo 3: Pagamento aprovado
        const txId = 'TX-' + Math.floor(100000 + Math.random() * 900000);
        const result = {
          success: true,
          transactionId: txId,
          amount: amount,
          device: device.name,
          provider: device.provider,
          serial: device.serial,
          method: method,
          timestamp: new Date().toLocaleTimeString('pt-BR')
        };
        if (onStep) onStep({ step: 3, message: `✅ Transação ${txId} APROVADA na maquininha! Comprovante impresso.`, result });
        resolve(result);
      }, 2000);
    }, 1200);
  });
}

// Export global para páginas
window.JucaPanel = {
  DEFAULT_ORDERS,
  DEFAULT_COURIERS,
  DEFAULT_SOLD_OUT,
  DEFAULT_COURIER_AVAILABLE,
  DEFAULT_COURIER_ACTIVE,
  DEFAULT_COURIER_HISTORY,
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_GATEWAYS,
  DEFAULT_POS_DEVICES,
  DEFAULT_PAYMENT_METHODS,
  getStorage,
  setStorage,
  showToast,
  simulatePosCharge
};
