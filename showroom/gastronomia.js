'use strict';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Catálogo Global carregado de catalogo.js
const CATALOG = Array.isArray(window.SHOWROOM_CATALOG) ? window.SHOWROOM_CATALOG : [];

// Títulos e Subtítulos 100% fiéis às referências do Drive (OCR de alta fidelidade)
const TITLES_DB = {
  "06.01": [
    "Comida de casa. Carinho em cada prato.",
    "Arroz, feijão e aquele tempero que abraça. Escolha sua marmita."
  ],
  "06.02": [
    "Seu almoço. Completo de verdade.",
    "Uma refeição caprichada para acompanhar seu dia."
  ],
  "06.03": [
    "Seu almoço, sem complicação.",
    "Escolha sua refeição e siga o seu dia."
  ],
  "06.04": [
    "O sabor que traz boas lembranças.",
    "Comida caseira e receitas para acolher o seu dia."
  ],
  "06.05": [
    "Comer bem pode ser simples.",
    "Comida caseira, cuidado no preparo e uma pausa para saborear."
  ],
  "16.01": [
    "Seu lanche, do seu jeito.",
    "Escolha seu favorito e complete o pedido."
  ],
  "16.02": [
    "Seu ponto de encontro com o sabor.",
    "Escolha seu lanche e faça uma pausa gostosa."
  ],
  "16.03": [
    "O clássico mata a saudade.",
    "Escolha seu lanche e reviva o sabor."
  ],
  "16.04": [
    "Camadas de novas ideias.",
    "Escolha seu sanduba e experimente a combinação."
  ],
  "16.05": [
    "Seu sabor favorito tem endereço.",
    "Escolha seu lanche artesanal e aproveite a pausa."
  ],
  "17.01": [
    "Uma pausa com sabor de Itália.",
    "Escolha sua massa e traga a trattoria para a mesa."
  ],
  "17.02": [
    "Uma nova forma de apreciar a massa.",
    "Explore o cardápio e escolha seu próximo prato."
  ],
  "17.03": [
    "Sabor que reúne a família.",
    "Escolha sua massa e leve esse carinho à mesa."
  ],
  "17.04": [
    "Mais massa, mais amore.",
    "Escolha seu prato e deixe o sabor acontecer."
  ],
  "17.05": [
    "O cuidado está em cada dobra.",
    "Descubra nossas massas e escolha seu próximo prato."
  ],
  "18.01": [
    "Sabor intenso em cada encontro.",
    "Escolha seu prato e descubra sua combinação favorita."
  ],
  "18.02": [
    "O sabor ganha movimento.",
    "Escolha seu wok e encontre sua combinação."
  ],
  "18.03": [
    "Dê um giro no seu sabor.",
    "Escolha seus noodles e encontre seu favorito."
  ],
  "18.04": [
    "Sabores em perfeito encontro.",
    "Explore o cardápio e escolha seu próximo prato."
  ],
  "18.05": [
    "Seu próximo sabor está aqui.",
    "Explore os pratos e escolha sua combinação."
  ],
  "19.01": [
    "Um convite para celebrar o sabor.",
    "Escolha seus tacos e leve mais cor à mesa."
  ],
  "19.02": [
    "Acenda a vontade de provar.",
    "Escolha seu taco e encontre sua intensidade."
  ],
  "19.03": [
    "A mesa fica melhor compartilhada.",
    "Escolha seus favoritos e reúna os sabores."
  ],
  "19.04": [
    "Uma explosão de cor e sabor.",
    "Escolha seu taco e descubra sua combinação."
  ],
  "19.05": [
    "Do milho à mesa, um novo sabor.",
    "Conheça nossos pratos e escolha seu favorito."
  ],
  "20.01": [
    "Raiz brasileira. Sabor que acolhe.",
    "Escolha sua tapioca e encontre seu recheio favorito."
  ],
  "20.02": [
    "Uma pausa com sabor de Paris.",
    "Escolha seu crepe e transforme o momento."
  ],
  "20.03": [
    "Dobre a pausa. Adoce o dia.",
    "Escolha seu crepe e descubra sua combinação favorita."
  ],
  "20.04": [
    "Simplicidade que dá vontade.",
    "Escolha sua tapioca e descubra novos sabores."
  ],
  "20.05": [
    "Novas camadas de sabor.",
    "Explore combinações e monte seu crepe do seu jeito."
  ],
  "21.01": [
    "O mar inspira. O sabor convida.",
    "Explore nossos pratos e escolha seu favorito."
  ],
  "21.02": [
    "Do mar ao prato, com todo o frescor.",
    "Escolha seu pescado e sinta a leveza da costa."
  ],
  "21.03": [
    "O sabor do mar começa aqui.",
    "Conheça nossas opções e escolha seu pescado."
  ],
  "21.04": [
    "O mar em sua forma mais delicada.",
    "Descubra sabores e escolha seu próximo prato."
  ],
  "21.05": [
    "Frescor que faz a diferença.",
    "Escolha seu pescado e descubra novas combinações."
  ],
  "22.01": [
    "Sabor de boteco, do nosso jeito.",
    "Escolha sua porção e aproveite cada encontro."
  ],
  "22.02": [
    "A noite pede algo especial.",
    "Explore drinks e petiscos para o seu momento."
  ],
  "22.03": [
    "Boa conversa começa à mesa.",
    "Escolha seus petiscos e faça do encontro um momento especial."
  ],
  "22.04": [
    "Seu encontro tem mais sabor.",
    "Escolha suas porções e entre no clima."
  ],
  "22.05": [
    "Petiscos que aproximam.",
    "Sabores brasileiros para compartilhar bons momentos."
  ],
  "23.01": [
    "O sabor das nossas raízes.",
    "Escolha seu prato e sinta o aconchego do Nordeste."
  ],
  "23.02": [
    "Tradição com um novo olhar.",
    "Descubra sabores do Nordeste e escolha seu favorito."
  ],
  "23.03": [
    "Tem sabor de casa.",
    "Baião, carinho e uma mesa cheia de boas escolhas."
  ],
  "23.04": [
    "Um sol de sabores.",
    "Receitas do Nordeste para iluminar o seu dia."
  ],
  "23.05": [
    "A essência do sertão.",
    "Ingredientes da nossa terra, em uma experiência singular."
  ],
  "24.01": [
    "Dourado por fora. Irresistível por dentro.",
    "Salgados fresquinhos para deixar seu dia mais gostoso."
  ],
  "24.02": [
    "Seu novo crush crocante.",
    "Recheio cremoso, massa dourada e vontade de repetir."
  ],
  "24.03": [
    "Feito à mão, com afeto.",
    "Receitas de família para saborear os pequenos momentos."
  ],
  "24.04": [
    "Bateu a fome? Vai de salgado.",
    "Salgados quentinhos e crocantes para qualquer hora do dia."
  ],
  "24.05": [
    "Pequenos detalhes. Grandes sabores.",
    "Massa delicada e recheios especiais, feitos com cuidado."
  ],
  "25.01": [
    "Um bowl de boas energias.",
    "Salmão, frutas e frescor em cada combinação."
  ],
  "25.02": [
    "Leveza em cada escolha.",
    "Ingredientes frescos em combinações que fazem sentido."
  ],
  "25.03": [
    "Frescor que vem da ilha.",
    "Frutas, vegetais e sabores para colorir seu bowl."
  ],
  "25.04": [
    "O Pacífico à sua mesa.",
    "Poke gourmet, ingredientes frescos e um toque especial."
  ],
  "25.05": [
    "Seu bowl, sua vibe.",
    "Combinações criativas para sair do básico."
  ]
};

// Configurações de Ambientação e Cores de Fundo Fiéis às Referências
const THEMES_CONFIG = {
  "06.01": {
    "title": "Comida de casa. Carinho em cada prato.",
    "subtitle": "Arroz, feijão e aquele tempero que abraça. Escolha sua marmita.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "06.02": {
    "title": "Seu almoço. Completo de verdade.",
    "subtitle": "Uma refeição caprichada para acompanhar seu dia.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "06.03": {
    "title": "Seu almoço, sem complicação.",
    "subtitle": "Escolha sua refeição e siga o seu dia.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "06.04": {
    "title": "O sabor que traz boas lembranças.",
    "subtitle": "Comida caseira e receitas para acolher o seu dia.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "06.05": {
    "title": "Comer bem pode ser simples.",
    "subtitle": "Comida caseira, cuidado no preparo e uma pausa para saborear.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "16.01": {
    "title": "Seu lanche, do seu jeito.",
    "subtitle": "Escolha seu favorito e complete o pedido.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "16.02": {
    "title": "Seu ponto de encontro com o sabor.",
    "subtitle": "Escolha seu lanche e faça uma pausa gostosa.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "16.03": {
    "title": "O clássico mata a saudade.",
    "subtitle": "Escolha seu lanche e reviva o sabor.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "16.04": {
    "title": "Camadas de novas ideias.",
    "subtitle": "Escolha seu sanduba e experimente a combinação.",
    "bg": "#121212",
    "ink": "#ffffff",
    "isDark": true
  },
  "16.05": {
    "title": "Seu sabor favorito tem endereço.",
    "subtitle": "Escolha seu lanche artesanal e aproveite a pausa.",
    "bg": "#fafafa",
    "ink": "#0f172a",
    "isDark": false
  },
  "17.01": {
    "title": "Uma pausa com sabor de Itália.",
    "subtitle": "Escolha sua massa e traga a trattoria para a mesa.",
    "bg": "#fcf8f2",
    "ink": "#0f172a",
    "isDark": false
  },
  "17.02": {
    "title": "Uma nova forma de apreciar a massa.",
    "subtitle": "Explore o cardápio e escolha seu próximo prato.",
    "bg": "#111111",
    "ink": "#ffffff",
    "isDark": true
  },
  "17.03": {
    "title": "Sabor que reúne a família.",
    "subtitle": "Escolha sua massa e leve esse carinho à mesa.",
    "bg": "#fbf5ed",
    "ink": "#0f172a",
    "isDark": false
  },
  "17.04": {
    "title": "Mais massa, mais amore.",
    "subtitle": "Escolha seu prato e deixe o sabor acontecer.",
    "bg": "#153e20",
    "ink": "#ffffff",
    "isDark": true
  },
  "17.05": {
    "title": "O cuidado está em cada dobra.",
    "subtitle": "Descubra nossas massas e escolha seu próximo prato.",
    "bg": "#fbf7f0",
    "ink": "#0f172a",
    "isDark": false
  },
  "18.01": {
    "title": "Sabor intenso em cada encontro.",
    "subtitle": "Escolha seu prato e descubra sua combinação favorita.",
    "bg": "#360907",
    "ink": "#ffffff",
    "isDark": true
  },
  "18.02": {
    "title": "O sabor ganha movimento.",
    "subtitle": "Escolha seu wok e encontre sua combinação.",
    "bg": "#111010",
    "ink": "#ffffff",
    "isDark": true
  },
  "18.03": {
    "title": "Dê um giro no seu sabor.",
    "subtitle": "Escolha seus noodles e encontre seu favorito.",
    "bg": "#fbf5eb",
    "ink": "#0f172a",
    "isDark": false
  },
  "18.04": {
    "title": "Sabores em perfeito encontro.",
    "subtitle": "Explore o cardápio e escolha seu próximo prato.",
    "bg": "#f9f3ec",
    "ink": "#0f172a",
    "isDark": false
  },
  "18.05": {
    "title": "Seu próximo sabor está aqui.",
    "subtitle": "Explore os pratos e escolha sua combinação.",
    "bg": "#07162c",
    "ink": "#ffffff",
    "isDark": true
  },
  "19.01": {
    "title": "Um convite para celebrar o sabor.",
    "subtitle": "Escolha seus tacos e leve mais cor à mesa.",
    "bg": "#ee577a",
    "ink": "#ffffff",
    "isDark": true
  },
  "19.02": {
    "title": "Acenda a vontade de provar.",
    "subtitle": "Escolha seu taco e encontre sua intensidade.",
    "bg": "#fff8f0",
    "ink": "#0f172a",
    "isDark": false
  },
  "19.03": {
    "title": "A mesa fica melhor compartilhada.",
    "subtitle": "Escolha seus favoritos e reúna os sabores.",
    "bg": "#22110a",
    "ink": "#ffffff",
    "isDark": true
  },
  "19.04": {
    "title": "Uma explosão de cor e sabor.",
    "subtitle": "Escolha seu taco e descubra sua combinação.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "19.05": {
    "title": "Do milho à mesa, um novo sabor.",
    "subtitle": "Conheça nossos pratos e escolha seu favorito.",
    "bg": "#fbf0e2",
    "ink": "#0f172a",
    "isDark": false
  },
  "20.01": {
    "title": "Raiz brasileira. Sabor que acolhe.",
    "subtitle": "Escolha sua tapioca e encontre seu recheio favorito.",
    "bg": "#fbf3e6",
    "ink": "#0f172a",
    "isDark": false
  },
  "20.02": {
    "title": "Uma pausa com sabor de Paris.",
    "subtitle": "Escolha seu crepe e transforme o momento.",
    "bg": "#fbf4ee",
    "ink": "#0f172a",
    "isDark": false
  },
  "20.03": {
    "title": "Dobre a pausa. Adoce o dia.",
    "subtitle": "Escolha seu crepe e descubra sua combinação favorita.",
    "bg": "#522b21",
    "ink": "#ffffff",
    "isDark": true
  },
  "20.04": {
    "title": "Simplicidade que dá vontade.",
    "subtitle": "Escolha sua tapioca e descubra novos sabores.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "20.05": {
    "title": "Novas camadas de sabor.",
    "subtitle": "Explore combinações e monte seu crepe do seu jeito.",
    "bg": "#1e201f",
    "ink": "#ffffff",
    "isDark": true
  },
  "21.01": {
    "title": "O mar inspira. O sabor convida.",
    "subtitle": "Explore nossos pratos e escolha seu favorito.",
    "bg": "#072438",
    "ink": "#ffffff",
    "isDark": true
  },
  "21.02": {
    "title": "Do mar ao prato, com todo o frescor.",
    "subtitle": "Escolha seu pescado e sinta a leveza da costa.",
    "bg": "#0a424a",
    "ink": "#ffffff",
    "isDark": true
  },
  "21.03": {
    "title": "O sabor do mar começa aqui.",
    "subtitle": "Conheça nossas opções e escolha seu pescado.",
    "bg": "#fbf4ed",
    "ink": "#0f172a",
    "isDark": false
  },
  "21.04": {
    "title": "O mar em sua forma mais delicada.",
    "subtitle": "Descubra sabores e escolha seu próximo prato.",
    "bg": "#16222f",
    "ink": "#ffffff",
    "isDark": true
  },
  "21.05": {
    "title": "Frescor que faz a diferença.",
    "subtitle": "Escolha seu pescado e descubra novas combinações.",
    "bg": "#f4f8fa",
    "ink": "#0f172a",
    "isDark": false
  },
  "22.01": {
    "title": "Sabor de boteco, do nosso jeito.",
    "subtitle": "Escolha sua porção e aproveite cada encontro.",
    "bg": "#fdf4df",
    "ink": "#0f172a",
    "isDark": false
  },
  "22.02": {
    "title": "A noite pede algo especial.",
    "subtitle": "Explore drinks e petiscos para o seu momento.",
    "bg": "#0f0e0d",
    "ink": "#ffffff",
    "isDark": true
  },
  "22.03": {
    "title": "Boa conversa começa à mesa.",
    "subtitle": "Escolha seus petiscos e faça do encontro um momento especial.",
    "bg": "#12261f",
    "ink": "#ffffff",
    "isDark": true
  },
  "22.04": {
    "title": "Seu encontro tem mais sabor.",
    "subtitle": "Escolha suas porções e entre no clima.",
    "bg": "#fbf4e8",
    "ink": "#0f172a",
    "isDark": false
  },
  "22.05": {
    "title": "Petiscos que aproximam.",
    "subtitle": "Sabores brasileiros para compartilhar bons momentos.",
    "bg": "#434720",
    "ink": "#ffffff",
    "isDark": true
  },
  "23.01": {
    "title": "O sabor das nossas raízes.",
    "subtitle": "Escolha seu prato e sinta o aconchego do Nordeste.",
    "bg": "#fbf1e4",
    "ink": "#0f172a",
    "isDark": false
  },
  "23.02": {
    "title": "Tradição com um novo olhar.",
    "subtitle": "Descubra sabores do Nordeste e escolha seu favorito.",
    "bg": "#fbf0e2",
    "ink": "#0f172a",
    "isDark": false
  },
  "23.03": {
    "title": "Tem sabor de casa.",
    "subtitle": "Baião, carinho e uma mesa cheia de boas escolhas.",
    "bg": "#fdf3e7",
    "ink": "#0f172a",
    "isDark": false
  },
  "23.04": {
    "title": "Um sol de sabores.",
    "subtitle": "Receitas do Nordeste para iluminar o seu dia.",
    "bg": "#055482",
    "ink": "#ffffff",
    "isDark": true
  },
  "23.05": {
    "title": "A essência do sertão.",
    "subtitle": "Ingredientes da nossa terra, em uma experiência singular.",
    "bg": "#120806",
    "ink": "#ffffff",
    "isDark": true
  },
  "24.01": {
    "title": "Dourado por fora. Irresistível por dentro.",
    "subtitle": "Salgados fresquinhos para deixar seu dia mais gostoso.",
    "bg": "#fef4e2",
    "ink": "#0f172a",
    "isDark": false
  },
  "24.02": {
    "title": "Seu novo crush crocante.",
    "subtitle": "Recheio cremoso, massa dourada e vontade de repetir.",
    "bg": "#fdf0e7",
    "ink": "#0f172a",
    "isDark": false
  },
  "24.03": {
    "title": "Feito à mão, com afeto.",
    "subtitle": "Receitas de família para saborear os pequenos momentos.",
    "bg": "#fcf2ea",
    "ink": "#0f172a",
    "isDark": false
  },
  "24.04": {
    "title": "Bateu a fome? Vai de salgado.",
    "subtitle": "Salgados quentinhos e crocantes para qualquer hora do dia.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "24.05": {
    "title": "Pequenos detalhes. Grandes sabores.",
    "subtitle": "Massa delicada e recheios especiais, feitos com cuidado.",
    "bg": "#192b21",
    "ink": "#ffffff",
    "isDark": true
  },
  "25.01": {
    "title": "Um bowl de boas energias.",
    "subtitle": "Salmão, frutas e frescor em cada combinação.",
    "bg": "#ffffff",
    "ink": "#0f172a",
    "isDark": false
  },
  "25.02": {
    "title": "Leveza em cada escolha.",
    "subtitle": "Ingredientes frescos em combinações que fazem sentido.",
    "bg": "#e7ebd8",
    "ink": "#0f172a",
    "isDark": false
  },
  "25.03": {
    "title": "Frescor que vem da ilha.",
    "subtitle": "Frutas, vegetais e sabores para colorir seu bowl.",
    "bg": "#fdfbf4",
    "ink": "#0f172a",
    "isDark": false
  },
  "25.04": {
    "title": "O Pacífico à sua mesa.",
    "subtitle": "Poke gourmet, ingredientes frescos e um toque especial.",
    "bg": "#fbf3ed",
    "ink": "#0f172a",
    "isDark": false
  },
  "25.05": {
    "title": "Seu bowl, sua vibe.",
    "subtitle": "Combinações criativas para sair do básico.",
    "bg": "#6d45a6",
    "ink": "#ffffff",
    "isDark": true
  }
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

  // 1. Configuração de Ambientação e Paleta
  const cfg = THEMES_CONFIG[code] || {};
  const colors = (m.palette || []).filter(c => /^#[0-9a-f]{6}$/i.test(c));
  const p = colors.length ? colors : ['#ffffff', '#0f172a', '#d97706', '#292929'];

  const bg = cfg.bg || '#ffffff';
  const isDark = luminance(bg) < 130;
  const ink = isDark ? '#ffffff' : '#0f172a';
  
  // Acento e Botão
  const accent = p.find(c => c !== bg && luminance(c) > 50 && luminance(c) < 220) || p[0] || '#d97706';
  let button = p.find(c => c !== bg && luminance(c) > 60 && luminance(c) < 200) || accent;
  if (luminance(button) < 40 && isDark) {
    button = p.find(c => luminance(c) > 120) || '#eab308';
  }
  const buttonInk = contrastInk(button);

  document.body.style.setProperty('--bg', bg);
  document.body.style.setProperty('--ink', ink);
  document.body.style.setProperty('--accent', accent);
  document.body.style.setProperty('--button', button);
  document.body.style.setProperty('--button-ink', buttonInk);

  if (isDark) {
    document.body.classList.add('is-ambient-dark');
  } else {
    document.body.classList.remove('is-ambient-dark');
  }

  // 2. Tipografia
  const fonts = m.fonts || 'Plus Jakarta Sans';
  const families = [
    'Libre Baskerville', 'Noto Serif', 'Bricolage Grotesque', 'Roboto Slab',
    'Archivo Black', 'DM Serif Display', 'Playfair Display', 'Fraunces',
    'Montserrat', 'Space Grotesk', 'Poppins', 'Fredoka', 'Bebas Neue',
    'Oswald', 'Righteous', 'Plus Jakarta Sans', 'Inter'
  ];
  const displayFont = families.find(f => fonts.includes(f)) || 'Plus Jakarta Sans';
  document.body.style.setProperty('--display', `'${displayFont}', sans-serif`);

  // 3. Branding
  document.title = `${m.name} • Showroom Automatech`;
  $('#topbar-brand').textContent = m.name;
  $('#topbar-tagline').textContent = (m.nicheName || 'Gastronomia').replace(/^\d+\.\s*/, '').toUpperCase();
  $('#hero-brand').textContent = m.name;

  // Monograma
  const mono = m.name.replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(Boolean).map(x => x[0]).slice(0, 2).join('').toUpperCase() || 'TX';
  $('#brand-mark').textContent = mono;
  $('#hero-mark').textContent = mono;

  // 4. Título (H1) e Subtítulo
  const titles = TITLES_DB[code] || [
    m.name + '. Sabor e qualidade em cada momento.',
    m.concept || 'Uma experiência gastronômica artesanal feita para você.'
  ];

  const titleWords = titles[0].split(' ');
  if (titleWords.length > 2) {
    const lastWord = titleWords.pop();
    $('#hero-title').innerHTML = `${titleWords.join(' ')} <span class="accent">${lastWord}</span>`;
  } else {
    $('#hero-title').textContent = titles[0];
  }

  $('#hero-subtitle').textContent = titles[1];

  // 5. Imagem do Prato em #dish-img (Fotografia recortada de alta fidelidade)
  let dishSrc = '';
  if (n === '06') {
    dishSrc = `/showroom/assets/gastronomia/${code}.webp`;
  } else {
    dishSrc = `/showroom/assets/gastronomia/${code}.png`;
  }

  const dishImg = $('#dish-img');
  dishImg.src = dishSrc;
  dishImg.alt = `${m.name} • Fotografia do prato`;

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
