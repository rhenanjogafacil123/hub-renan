'use strict';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Catálogo Global carregado de catalogo.js
const CATALOG = Array.isArray(window.SHOWROOM_CATALOG) ? window.SHOWROOM_CATALOG : [];

// Títulos e Subtítulos fiéis às referências do Drive
const TITLES_DB = {
  // Nicho 06 (Marmitarias & Comida Caseira)
  '06.01': ['Comida de casa. Carinho em cada prato.', 'Arroz, feijão e aquele tempero que abraça. Escolha sua marmita.'],
  '06.02': ['Seu almoço. Completo de verdade.', 'Uma refeição caprichada para acompanhar seu dia.'],
  '06.03': ['Seu almoço, sem complicação.', 'Escolha sua refeição e siga o seu dia.'],
  '06.04': ['O sabor que traz boas lembranças.', 'Comida caseira e receitas para acolher o seu dia.'],
  '06.05': ['Comer bem pode ser simples.', 'Comida caseira, cuidado no preparo e uma pausa para saborear.'],

  // Nicho 16 (Lanchonetes Tradicionais)
  '16.01': ['Seu lanche, do seu jeito.', 'Escolha seu favorito e complete o pedido.'],
  '16.02': ['Seu ponto de encontro com o sabor.', 'Escolha seu lanche e faça uma pausa gostosa.'],
  '16.03': ['O clássico que nunca sai de moda.', 'Nostalgia e sabor artesanal em cada mordida.'],
  '16.04': ['Experiências que reinventam o lanche.', 'Combinações ousadas e ingredientes selecionados.'],
  '16.05': ['O toque gourmet na sua esquina.', 'Lanches premium preparados com carinho e técnica.'],

  // Nicho 17 (Massas / Comida Italiana)
  '17.01': ['Uma pausa com sabor de Itália.', 'Escolha sua massa e traga a trattoria para a mesa.'],
  '17.02': ['Receitas de família, feitas com alma.', 'Massas frescas, molhos lentos e afeto em cada prato.'],
  '17.03': ['A arte da pasta artesanal.', 'Tradição italiana com ingredientes nobres e paixão.'],
  '17.04': ['Clássicos italianos que abraçam.', 'Do pomodoro ao alfredo, o sabor autêntico de Roma.'],
  '17.05': ['O melhor da cucina mediterrânea.', 'Massas leves, azeites nobres e aromas inesquecíveis.'],

  // Nicho 18 (Comida Chinesa / Yakisoba)
  '18.01': ['Sabor intenso em cada encontro.', 'Escolha seu prato e descubra sua combinação favorita.'],
  '18.02': ['O verdadeiro fogo da wok oriental.', 'Yakisobas fumegantes e legumes no ponto perfeito.'],
  '18.03': ['Tradição imperial na sua mesa.', 'Receitas ancestrais com tempero marcante e equilíbrio.'],
  '18.04': ['Culinária chinesa viva e aromática.', 'Pratos fartos e molhos agridoces artesanais.'],
  '18.05': ['Rapidez e sabor na medida certa.', 'O melhor da culinária asiática para seu dia a dia.'],

  // Nicho 19 (Comida Mexicana)
  '19.01': ['Um convite para celebrar o sabor.', 'Escolha seus tacos e leve mais cor à mesa.'],
  '19.02': ['Cores vivas e tempero picante na medida.', 'Burritos recheados e guacamole fresco feito na hora.'],
  '19.03': ['A autêntica fiesta mexicana.', 'Nachos crocantes, queijos fundidos e carnes suculentas.'],
  '19.04': ['Sabores de Oaxaca e Jalisco.', 'Tacos de rua artesanais com tortillas frescas feitas à mão.'],
  '19.05': ['Energia e tempero em cada mordida.', 'Quesadillas douradas e salsas especiais da casa.'],

  // Nicho 20 (Creperias e Tapiocarias)
  '20.01': ['Leveza e sabor que se dobram a você.', 'Tapiocas macias e crepes finos feitos no capricho.'],
  '20.02': ['Tradição brasileira com recheio generoso.', 'Goma fresca selecionada e queijo coalho tostado na chapa.'],
  '20.03': ['Crepes franceses de massa finíssima.', 'Receitas doces e salgadas com elegância e equilíbrio.'],
  '20.04': ['Uma pausa leve para o seu dia.', 'Combinações saudáveis, frescas e deliciosas.'],
  '20.05': ['Doce ou salgado, o aconchego perfeito.', 'Recheios nobres e finalização com manteiga de garrafa.'],

  // Nicho 21 (Peixarias e Frutos do Mar)
  '21.01': ['O melhor encontro com o mar.', 'Peixes frescos grelhados e moquecas aromáticas da costa.'],
  '21.02': ['Frescor direto do porto à sua mesa.', 'Camarões selecionados e frutos do mar preparados na brasa.'],
  '21.03': ['Tradição praiana com tempero caseiro.', 'Casquinhas de siri, lulas crocantes e peixadas completas.'],
  '21.04': ['Sabor marítimo em alta gastronomia.', 'Cortes nobres de salmão, robalo e vieiras suculentas.'],
  '21.05': ['Banquete das águas para compartilhar.', 'Porções fartas de frutos do mar com limão e ervas frescas.'],

  // Nicho 22 (Bares, Petiscos e Porções)
  '22.01': ['Boa conversa pede bons sabores.', 'Torresmo crocante, bolinhos dourados e petiscos de boteco.'],
  '22.02': ['O melhor boteco de bairro da cidade.', 'Picanha aperitivo na chapa com queijo e farofa da casa.'],
  '22.03': ['Petiscos de raiz com cerveja gelada.', 'Pasteizinhos artesanais e clássicos da boemia carioca.'],
  '22.04': ['Porções fartas para curtir com amigos.', 'Tábua de frios, batatas especiais e tiras de frango empanadas.'],
  '22.05': ['Sabor de confraternização e alegria.', 'Petiscos de estufa e releituras modernas de comida de bar.'],

  // Nicho 23 (Restaurantes Nordestinos)
  '23.01': ['Raízes que dão sabor e abraçam.', 'Baião de dois, carne de sol e o melhor tempero do sertão.'],
  '23.02': ['A fartura da culinária do sertão.', 'Macaxeira frita na manteiga de garrafa e queijo de coalho assado.'],
  '23.03': ['Tradição nordestina feita com carinho.', 'Escondidinho de carne seca, sarapatel e feijão de corda.'],
  '23.04': ['Cultura e sabor em cada prato.', 'Paneladas aromáticas, rabada com agrião e farofas crocantes.'],
  '23.05': ['O aconchego da comida de terra firme.', 'Comida forte, acolhedora e cheia de história e afeto.'],

  // Nicho 24 (Salgaderias)
  '24.01': ['Pequenos detalhes. Grandes sabores.', 'Coxinhas douradas, empadas derretendo e massas artesanais.'],
  '24.02': ['Massa crocante por fora, cremosa por dentro.', 'Recheios fartos de frango com catupiry, camarão e queijo.'],
  '24.03': ['O salgado perfeito a qualquer hora.', 'Kibes recheados, esfihas folhadas e mini-salgados para festa.'],
  '24.04': ['Salgados artesanais assados e fritos.', 'Receitas de família com padrão de ouro e tempero marcante.'],
  '24.05': ['A pausa mais gostosa do seu dia.', 'Salgados sempre quentinhos saindo do forno direto pra você.'],

  // Nicho 25 (Poke e Culinária Havaiana)
  '25.01': ['Um bowl de boas energias.', 'Salmão, frutas e frescor em cada combinação.'],
  '25.02': ['O sabor tropical do Havaí na sua tigela.', 'Atum fresco marinado, manga, edamame e molho ponzu especial.'],
  '25.03': ['Cores vivas, saúde e sabor autêntico.', 'Bowls personalizados com arroz japonês e chips de batata doce.'],
  '25.04': ['Frescor que renova seu dia.', 'Saladas marinadas, abacate fatiado e crocantes de gergelim torrado.'],
  '25.05': ['A experiência do pacífico na mesa.', 'Receitas tropicais leves, equilibradas e ricas em nutrientes.']
};

// Cardápios demonstrativos para o modal de Cardápio
const SAMPLE_MENUS = {
  '16': [
    { name: 'X-Salada Especial da Casa', desc: 'Hambúrguer 150g, queijo prato derretido, alface fresca, tomate e maionese artesanal', price: 'R$ 26,90' },
    { name: 'X-Tudo Tradicional Completo', desc: 'Bovino 150g, bacon crocante, ovo, presunto, queijo, milho e batata palha', price: 'R$ 32,90' },
    { name: 'Bauru Tradicional no Francês', desc: 'Roastbeef artesanal, queijo derretido, tomate fresco e picles crocante', price: 'R$ 24,90' },
    { name: 'Batata Rústica da Casa', desc: 'Batatas com alho laminado e alecrim fresco, acompanhadas de maionese verde', price: 'R$ 18,90' }
  ],
  '17': [
    { name: 'Fettuccine Alfredo com Trufas', desc: 'Massa fresca artesanal envolta em creme de parmesão e manteiga de trufas', price: 'R$ 58,00' },
    { name: 'Lasagna alla Bolognese Tradizionale', desc: 'Camadas generosas de massa artesanal, ragù bovino cozido lentamente e bechamel', price: 'R$ 52,00' },
    { name: 'Gnocchi ao Pomodoro & Basílico', desc: 'Nhoque de batata macio com molho de tomates San Marzano e manjericão fresco', price: 'R$ 46,00' },
    { name: 'Cannoli Siciliani Recheados', desc: 'Massa crocante frita recheada com ricota doce, gotas de chocolate e pistache', price: 'R$ 22,00' }
  ],
  '18': [
    { name: 'Yakisoba Especial Tradicional', desc: 'Massa oriental crocante com tiras de carne bovina, frango, legumes frescos e molho shoyu', price: 'R$ 38,90' },
    { name: 'Frango Xadrez com Castanhas', desc: 'Cubos suculentos de peito de frango salteados com pimentões coloridos e castanha de caju', price: 'R$ 42,00' },
    { name: 'Rolinho Primavera Crocante (2 un)', desc: 'Massa finíssima recheada com legumes selecionados, servida com molho agridoce', price: 'R$ 16,00' },
    { name: 'Guioza Artesanal no Vapor (6 un)', desc: 'Pasteizinhos orientais recheados com lombo suíno temperado e cebolinha', price: 'R$ 28,00' }
  ],
  '19': [
    { name: 'Tacos al Pastor Supreme (3 un)', desc: 'Tortillas de milho artesanais, carne de porco marinada em urucum, abacaxi grelhado e coentro', price: 'R$ 36,00' },
    { name: 'Burrito California Especial', desc: 'Tortilla de trigo recheada com carne assada, guacamole fresco, arroz mexicano e queijo', price: 'R$ 39,90' },
    { name: 'Quesadilla de Queijo e Jalapeño', desc: 'Massa tostada na chapa com blend de queijos derretidos e fatias de pimenta suave', price: 'R$ 29,00' },
    { name: 'Nachos Supreme com Guacamole', desc: 'Totopos de milho estaladiços servidos com guacamole, pico de gallo e sour cream', price: 'R$ 34,00' }
  ],
  '20': [
    { name: 'Crepe Francês de Camarão & Catupiry', desc: 'Massa leve e dourada com camarões salteados no alho-poró e catupiry original', price: 'R$ 34,00' },
    { name: 'Tapioca de Carne Seca com Queijo Coalho', desc: 'Goma hidratada fininha com carne seca desfiada na manteiga de garrafa e queijo tostado', price: 'R$ 24,00' },
    { name: 'Crepe Doce Nutella com Morango', desc: 'Massa fina recheada com Nutella pura, fatias de morango fresco e raspas de chocolate', price: 'R$ 22,00' },
    { name: 'Tapioca Fit de Frango com Ricota', desc: 'Frango temperado com ervas, creme de ricota leve e sementes de chia crocantes', price: 'R$ 21,00' }
  ],
  '21': [
    { name: 'Moqueca de Garoupa com Camarão', desc: 'Cozida lentamente no azeite de dendê e leite de coco fresco, acompanhada de arroz e pirão', price: 'R$ 78,00' },
    { name: 'Filé de Salmão Grelhado na Brasa', desc: 'Posta de salmão fresco com molho de maracujá e risoto cremoso de alho-poró', price: 'R$ 68,00' },
    { name: 'Camarão Empanado na Farinha Panko (8 un)', desc: 'Camarões rosa crocantes servidos com molho tártaro especial da casa', price: 'R$ 49,00' },
    { name: 'Casquinha de Siri Gratinada', desc: 'Carne pura de siri temperada com ervas finas e gratinada com queijo parmesão', price: 'R$ 26,00' }
  ],
  '22': [
    { name: 'Torresmo de Rolo Super Crocante', desc: 'Panceta suína enrolada, pururucada na hora, servida com geleia de pimenta e limão', price: 'R$ 36,00' },
    { name: 'Bolinho de Feijoada Artesanal (6 un)', desc: 'Massa cremosa de feijoada recheada com couve refogada no alho e bacon', price: 'R$ 32,00' },
    { name: 'Picanha Aperitivo na Chapa', desc: 'Tiras suculentas de picanha com cebola dourada, farofa crocante e molho chimichurri', price: 'R$ 64,00' },
    { name: 'Dadinhos de Tapioca com Queijo Coalho', desc: 'Cubinhos dourados servidos com melaço de cana artesanal', price: 'R$ 26,00' }
  ],
  '23': [
    { name: 'Baião de Dois Completo do Sertão', desc: 'Feijão de corda, arroz, queijo coalho tostado, carne seca desfiada, bacon e coentro', price: 'R$ 48,00' },
    { name: 'Carne de Sol com Macaxeira Frita', desc: 'Corte nobre acebolado na manteiga de garrafa, acompanhado de macaxeira macia por dentro', price: 'R$ 56,00' },
    { name: 'Escondidinho de Carne Seca com Purê de Mandioca', desc: 'Camadas generosas gratinadas com queijo coalho dourado no forno', price: 'R$ 42,00' },
    { name: 'Cartola Nordestina Tradicional', desc: 'Banana frita na manteiga com queijo de manteiga derretido, açúcar e canela', price: 'R$ 18,00' }
  ],
  '24': [
    { name: 'Coxinha Dourada com Catupiry Real', desc: 'Massa artesanal de caldo de galinha caipira, frango desfiado temperado e catupiry puro', price: 'R$ 9,90' },
    { name: 'Empada Especial de Camarão Cremoso', desc: 'Massa podre que derrete na boca com recheio farto de camarão bem temperadinho', price: 'R$ 10,50' },
    { name: 'Kibe Recheado com Queijo e Hortelã', desc: 'Trigo selecionado, carne moída de primeira, hortelã fresca e recheio cremoso', price: 'R$ 9,50' },
    { name: 'Esfiha Folhada de Carne Bovina', desc: 'Massa folhada levíssima e crocante com recheio árabe de carne e especiarias', price: 'R$ 9,90' }
  ],
  '25': [
    { name: 'Aloha Salmon Supreme Bowl', desc: 'Cubos de salmão fresco, arroz japonês shari, abacate, edamame, manga, pepino e molho ponzu', price: 'R$ 48,00' },
    { name: 'Tuna Tropical Spicy Bowl', desc: 'Atum fresco em cubos com maionese spicy, cenoura ralada, cebola roxa, nori e gergelim', price: 'R$ 46,00' },
    { name: 'Rainbow Veggie & Tofu Bowl', desc: 'Tofu marinado no shoyu e gengibre, sunomono, repolho roxo, kani e chips de batata doce', price: 'R$ 38,00' },
    { name: 'Maui Sunset Fruit Salad Bowl', desc: 'Mix tropical de frutas frescas com chia, granola artesanal e mel de laranjeira', price: 'R$ 24,00' }
  ]
};

let currentModel = null;

function luminance(hex) {
  const c = hex.replace('#', '');
  return [0, 2, 4]
    .map(i => parseInt(c.slice(i, i + 2), 16))
    .reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
}

function contrastInk(hex) {
  const lum = luminance(hex);
  return lum > 140 ? '#0f172a' : '#ffffff';
}

function getModelData(id) {
  const m = CATALOG.find(x => x.id === id || x.code === id);
  if (m) return m;

  // Fallback
  return {
    id: id || '16.01',
    code: id || '16.01',
    name: 'Delivery Especial',
    nicheName: 'Lanchonetes Tradicionais',
    palette: ['#D43D33', '#FFFFFF', '#F3C84B', '#292929'],
    fonts: 'Montserrat Bold e Inter.'
  };
}

function setModel(id) {
  const m = getModelData(id);
  currentModel = m;
  const code = m.code || m.id;
  const n = code.split('.')[0].padStart(2, '0');

  // 1. Paleta de Cores
  const colors = (m.palette || []).filter(c => /^#[0-9a-f]{6}$/i.test(c));
  const p = colors.length ? colors : ['#ffffff', '#0f172a', '#d97706', '#292929'];
  const sorted = [...p].sort((a, b) => luminance(a) - luminance(b));

  const bg = sorted.at(-1); // Cor mais clara como fundo
  const ink = luminance(bg) < 140 ? '#ffffff' : sorted[0];
  const accent = p.find(c => c !== bg && luminance(c) > 60 && luminance(c) < 210) || p[0] || '#d97706';
  const button = accent;
  const buttonInk = contrastInk(button);

  document.body.style.setProperty('--bg', bg);
  document.body.style.setProperty('--ink', ink);
  document.body.style.setProperty('--accent', accent);
  document.body.style.setProperty('--button', button);
  document.body.style.setProperty('--button-ink', buttonInk);

  // 2. Tipografia
  const fonts = m.fonts || 'Plus Jakarta Sans';
  const families = ['Fraunces', 'Montserrat', 'Playfair Display', 'Space Grotesk', 'Poppins', 'Fredoka', 'Bebas Neue', 'Oswald', 'Righteous', 'Plus Jakarta Sans', 'Inter'];
  const displayFont = families.find(f => fonts.includes(f)) || 'Plus Jakarta Sans';
  document.body.style.setProperty('--display', `'${displayFont}', sans-serif`);

  // 3. Atualizar Título e Branding
  document.title = `${m.name} • Showroom Automatech`;
  $('#topbar-brand').textContent = m.name;
  $('#topbar-tagline').textContent = (m.nicheName || 'Gastronomia').replace(/^\d+\.\s*/, '').toUpperCase();
  $('#hero-brand').textContent = m.name;

  // Monograma da Marca
  const mono = m.name.replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(Boolean).map(x => x[0]).slice(0, 2).join('').toUpperCase() || 'TX';
  $('#brand-mark').textContent = mono;
  $('#hero-mark').textContent = mono;

  // 4. Título (H1) e Subtítulo
  const titles = TITLES_DB[code] || [
    m.name + '. Sabor e qualidade em cada momento.',
    m.concept || 'Uma experiência gastronômica artesanal feita para você.'
  ];

  // Adicionar destaque na última palavra do título
  const titleWords = titles[0].split(' ');
  if (titleWords.length > 2) {
    const lastWord = titleWords.pop();
    $('#hero-title').innerHTML = `${titleWords.join(' ')} <span class="accent">${lastWord}</span>`;
  } else {
    $('#hero-title').textContent = titles[0];
  }

  $('#hero-subtitle').textContent = titles[1];

  // 5. Imagem do Prato em #dish-img
  let dishSrc = '';
  if (n === '06') {
    dishSrc = `/showroom/assets/gastronomia/${code}.webp`;
  } else {
    dishSrc = `/showroom/assets/gastronomia/${code}.png`;
  }

  const dishImg = $('#dish-img');
  dishImg.src = dishSrc;
  dishImg.alt = `${m.name} • Fotografia do prato`;

  // Fallback se a imagem não carregar
  dishImg.onerror = () => {
    dishImg.src = `/showroom/assets/gastronomia/16.01.png`;
  };

  // Reset Tema Escuro
  document.body.classList.remove('dark');
  $('#theme').setAttribute('aria-pressed', 'false');
  $('.theme-label').textContent = 'Escuro';
}

// Controle de Modais
function openModal(type) {
  if (!currentModel) return;
  const dialog = $('#modal-dialog');
  const title = $('#dialog-title');
  const content = $('#dialog-content');
  const code = currentModel.code || currentModel.id;
  const n = code.split('.')[0].padStart(2, '0');

  if (type === 'cardapio') {
    title.textContent = `Cardápio • ${currentModel.name}`;
    const items = SAMPLE_MENUS[n] || SAMPLE_MENUS['16'];
    content.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px; margin:16px 0;">
        ${items.map(item => `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; padding:10px 0; border-bottom:1px solid #f1f5f9;">
            <div style="flex:1; padding-right:12px;">
              <strong style="display:block; font-size:14px; color:#0f172a;">${item.name}</strong>
              <small style="display:block; font-size:11px; color:#64748b; margin-top:2px;">${item.desc}</small>
            </div>
            <strong style="font-size:13px; color:#16a34a; white-space:nowrap;">${item.price}</strong>
          </div>
        `).join('')}
      </div>
      <p style="font-size:11px; color:#64748b; text-align:center; margin:10px 0 0;">
        Apresentação demonstrativa • Sem cobrança ou pedidos reais.
      </p>
    `;
  } else if (type === 'pedido') {
    title.textContent = `Pedido Demonstrativo`;
    content.innerHTML = `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:18px; margin:16px 0; text-align:center;">
        <span style="font-size:32px; display:block; margin-bottom:8px;">🛍️</span>
        <strong style="display:block; font-size:16px; color:#0f172a; margin-bottom:4px;">Checkout Transparente Integrado</strong>
        <p style="font-size:12px; color:#64748b; margin:0;">
          Na plataforma da <strong>Automatech</strong>, o cliente escolhe os itens, paga online via PIX dinâmico Mercado Pago Bricks, e o pedido é despachado direto para a cozinha e para a rota do motoboy.
        </p>
      </div>
      <button type="button" class="btn-action green" style="width:100%; height:46px; border-radius:9999px;" onclick="document.getElementById('modal-dialog').close()">
        Entendi, voltar à prévia
      </button>
    `;
  } else {
    title.textContent = `Informações • ${currentModel.name}`;
    content.innerHTML = `
      <div class="contact-list" style="margin:16px 0;">
        <div class="contact-item">
          <div class="contact-info">
            <strong>WhatsApp de Atendimento</strong>
            <small>Canal direto de pedidos e dúvidas</small>
          </div>
          <button type="button" class="btn-action green" onclick="window.open('https://wa.me/555199735892', '_blank')">Abrir ›</button>
        </div>

        <div class="contact-item">
          <div class="contact-info">
            <strong>Instagram Oficial</strong>
            <small>Fotos, novidades e bastidores</small>
          </div>
          <button type="button" class="btn-action" onclick="window.open('https://instagram.com', '_blank')">Seguir ›</button>
        </div>

        <div class="contact-item">
          <div class="contact-info">
            <strong>Telefone do Balcão</strong>
            <small>Retiradas e pedidos presenciais</small>
          </div>
          <button type="button" class="btn-action">Ligar ›</button>
        </div>

        <div class="contact-item">
          <div class="contact-info">
            <strong>Endereço e Retirada</strong>
            <small>Polo Gastronômico • Loja Oficial</small>
          </div>
          <button type="button" class="btn-action">Rota ›</button>
        </div>
      </div>
    `;
  }

  dialog.showModal();
}

// Event Listeners
document.addEventListener('click', e => {
  const modalBtn = e.target.closest('[data-modal]');
  if (modalBtn) {
    openModal(modalBtn.dataset.modal);
    return;
  }

  if (e.target.closest('#theme')) {
    const isDark = document.body.classList.toggle('dark');
    $('#theme').setAttribute('aria-pressed', String(isDark));
    $('.theme-label').textContent = isDark ? 'Claro' : 'Escuro';
  }
});

// Fechar dialog ao clicar fora
const modalDialog = $('#modal-dialog');
if (modalDialog) {
  modalDialog.addEventListener('click', e => {
    const rect = modalDialog.getBoundingClientRect();
    const inDialog = (
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width
    );
    if (!inDialog) modalDialog.close();
  });
}

// Escutar mensagens do frame pai
window.addEventListener('message', e => {
  if (e.data && e.data.type === 'switchHero') {
    const template = e.data.template;
    if (template) {
      setModel(template);
      const url = new URL(location.href);
      url.searchParams.set('hero', template);
      history.replaceState(null, '', url);
      window.scrollTo(0, 0);
    }
  }
});

// Inicialização a partir da URL
(function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const heroParam = urlParams.get('hero') || '16.01';
  setModel(heroParam);
})();
