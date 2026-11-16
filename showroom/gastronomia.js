'use strict';

// Banco de dados completo dos Nichos 16 a 25
const MODELS_DB = {
  "16.01": {
    "code": "16.01",
    "name": "LANCHE & CIA",
    "nicheCode": "16",
    "nicheName": "LANCHONETES TRADICIONAIS",
    "concept": "lanchonete tradicional, cardápio variado e serviço confiável.",
    "palette": [
      "#D43D33",
      "#FFFFFF",
      "#F3C84B",
      "#292929"
    ],
    "typography": "Montserrat Bold e Inter."
  },
  "16.02": {
    "code": "16.02",
    "name": "PONTO DO LANCHE",
    "nicheCode": "16",
    "nicheName": "LANCHONETES TRADICIONAIS",
    "concept": "lanchonete de bairro familiar, acessível e simpática.",
    "palette": [
      "#2865B1",
      "#FFCB3A",
      "#FFFFFF",
      "#D84B43"
    ],
    "typography": "Nunito Sans e Poppins."
  },
  "16.03": {
    "code": "16.03",
    "name": "LANCHE 90",
    "nicheCode": "16",
    "nicheName": "LANCHONETES TRADICIONAIS",
    "concept": "nostalgia dos anos 1990 reinterpretada de forma moderna.",
    "palette": [
      "#F8E8CB",
      "#E87562",
      "#407B93",
      "#4A3934"
    ],
    "typography": "Cooper Black e DM Sans."
  },
  "16.04": {
    "code": "16.04",
    "name": "SANDUBA LAB",
    "nicheCode": "16",
    "nicheName": "LANCHONETES TRADICIONAIS",
    "concept": "lanches criativos, experimentação e público jovem.",
    "palette": [
      "#1E1E1E",
      "#C4F343",
      "#E5E5E5",
      "#FFFFFF"
    ],
    "typography": "Space Grotesk e Archivo."
  },
  "16.05": {
    "code": "16.05",
    "name": "ESQUINA GOURMET",
    "nicheCode": "16",
    "nicheName": "LANCHONETES TRADICIONAIS",
    "concept": "lanchonete artesanal de bairro com experiência premium.",
    "palette": [
      "#294C3F",
      "#EBDDCA",
      "#C8A269",
      "#282824"
    ],
    "typography": "Playfair Display e Manrope."
  },
  "17.01": {
    "code": "17.01",
    "name": "TRATTORIA ROMA",
    "nicheCode": "17",
    "nicheName": "MASSAS / COMIDA ITALIANA",
    "concept": "tradição italiana, receitas clássicas e hospitalidade.",
    "palette": [
      "#B53E36",
      "#F5E9D4",
      "#356447",
      "#554135"
    ],
    "typography": "Libre Baskerville e DM Sans."
  },
  "17.02": {
    "code": "17.02",
    "name": "PASTA NERO",
    "nicheCode": "17",
    "nicheName": "MASSAS / COMIDA ITALIANA",
    "concept": "restaurante italiano premium de alta gastronomia.",
    "palette": [
      "#171717",
      "#BE9555",
      "#5E2834",
      "#F1E9DD"
    ],
    "typography": "Bodoni Moda e Manrope."
  },
  "17.03": {
    "code": "17.03",
    "name": "NONNA MIA",
    "nicheCode": "17",
    "nicheName": "MASSAS / COMIDA ITALIANA",
    "concept": "massas artesanais e cozinha familiar italiana.",
    "palette": [
      "#697A4C",
      "#B96547",
      "#F6EADB",
      "#543D31"
    ],
    "typography": "Fraunces e Nunito Sans."
  },
  "17.04": {
    "code": "17.04",
    "name": "AMORE PASTA",
    "nicheCode": "17",
    "nicheName": "MASSAS / COMIDA ITALIANA",
    "concept": "massas modernas, saborosas e descomplicadas.",
    "palette": [
      "#EE735B",
      "#F8CC52",
      "#FFF6E6",
      "#4D865C"
    ],
    "typography": "Bricolage Grotesque e Poppins."
  },
  "17.05": {
    "code": "17.05",
    "name": "FARINA ATELIER",
    "nicheCode": "17",
    "nicheName": "MASSAS / COMIDA ITALIANA",
    "concept": "pasta fresca artesanal em uma experiência gastronômica boutique.",
    "palette": [
      "#FCFAF6",
      "#743C49",
      "#D9C7AE",
      "#39332F"
    ],
    "typography": "Cormorant Garamond e Plus Jakarta Sans."
  },
  "18.01": {
    "code": "18.01",
    "name": "RED DRAGON",
    "nicheCode": "18",
    "nicheName": "COMIDA CHINESA / YAKISOBA",
    "concept": "culinária chinesa tradicional com presença visual marcante.",
    "palette": [
      "#B5232C",
      "#D5A34B",
      "#25201D",
      "#FFF2DF"
    ],
    "typography": "Noto Serif e Inter."
  },
  "18.02": {
    "code": "18.02",
    "name": "WOK STREET",
    "nicheCode": "18",
    "nicheName": "COMIDA CHINESA / YAKISOBA",
    "concept": "wok urbano, movimento e preparo em alta temperatura.",
    "palette": [
      "#202020",
      "#F37C28",
      "#D9D9D6",
      "#FFFFFF"
    ],
    "typography": "Anton e Space Grotesk."
  },
  "18.03": {
    "code": "18.03",
    "name": "LUCKY NOODLES",
    "nicheCode": "18",
    "nicheName": "COMIDA CHINESA / YAKISOBA",
    "concept": "culinária asiática divertida, acessível e vibrante.",
    "palette": [
      "#F9CF38",
      "#E34D3D",
      "#3975B9",
      "#FFF8E8"
    ],
    "typography": "Fredoka e DM Sans."
  },
  "18.04": {
    "code": "18.04",
    "name": "JADE KITCHEN",
    "nicheCode": "18",
    "nicheName": "COMIDA CHINESA / YAKISOBA",
    "concept": "restaurante oriental contemporâneo e refinado.",
    "palette": [
      "#2D796A",
      "#F5EEE2",
      "#C8A56E",
      "#2D302E"
    ],
    "typography": "Cormorant Garamond e Manrope."
  },
  "18.05": {
    "code": "18.05",
    "name": "NEO WOK",
    "nicheCode": "18",
    "nicheName": "COMIDA CHINESA / YAKISOBA",
    "concept": "restaurante asiático futurista e tecnológico.",
    "palette": [
      "#111F35",
      "#38D6E8",
      "#CE4CB6",
      "#FFFFFF"
    ],
    "typography": "Space Grotesk e Inter."
  },
  "19.01": {
    "code": "19.01",
    "name": "CASA FIESTA",
    "nicheCode": "19",
    "nicheName": "COMIDA MEXICANA",
    "concept": "restaurante mexicano festivo, caloroso e colorido.",
    "palette": [
      "#EE577A",
      "#F8C83D",
      "#327D54",
      "#FFF1DC"
    ],
    "typography": "Bricolage Grotesque e DM Sans."
  },
  "19.02": {
    "code": "19.02",
    "name": "FUEGO TACO",
    "nicheCode": "19",
    "nicheName": "COMIDA MEXICANA",
    "concept": "comida mexicana intensa, apimentada e urbana.",
    "palette": [
      "#191919",
      "#D93629",
      "#F0782B",
      "#F2E4CF"
    ],
    "typography": "Anton e Inter."
  },
  "19.03": {
    "code": "19.03",
    "name": "LA CANTINA",
    "nicheCode": "19",
    "nicheName": "COMIDA MEXICANA",
    "concept": "cantina mexicana tradicional com atmosfera artesanal.",
    "palette": [
      "#BB664A",
      "#2E8D8A",
      "#F6E7CF",
      "#624335"
    ],
    "typography": "Roboto Slab e Nunito Sans."
  },
  "19.04": {
    "code": "19.04",
    "name": "TACO POP",
    "nicheCode": "19",
    "nicheName": "COMIDA MEXICANA",
    "concept": "taqueria moderna, divertida e jovem.",
    "palette": [
      "#A477E8",
      "#FF893A",
      "#FFD84D",
      "#FFFFFF"
    ],
    "typography": "Fredoka e Poppins."
  },
  "19.05": {
    "code": "19.05",
    "name": "MAÍZ & SOL",
    "nicheCode": "19",
    "nicheName": "COMIDA MEXICANA",
    "concept": "gastronomia mexicana artesanal inspirada no milho e na luz solar.",
    "palette": [
      "#F8EDD8",
      "#DDAF36",
      "#757C47",
      "#A85C42"
    ],
    "typography": "Fraunces e Manrope."
  },
  "20.01": {
    "code": "20.01",
    "name": "TAPIOCA RAIZ",
    "nicheCode": "20",
    "nicheName": "CREPERIAS E TAPIO CARIAS",
    "concept": "tapiocaria brasileira, natural e artesanal.",
    "palette": [
      "#F3E5CD",
      "#578457",
      "#FFF9ED",
      "#B77955"
    ],
    "typography": "Fraunces e DM Sans."
  },
  "20.02": {
    "code": "20.02",
    "name": "CRÊPE PARIS",
    "nicheCode": "20",
    "nicheName": "CREPERIAS E TAPIO CARIAS",
    "concept": "creperia francesa sofisticada e romântica.",
    "palette": [
      "#273D5C",
      "#FFF4E5",
      "#C9AA79",
      "#8B4C54"
    ],
    "typography": "Cormorant Garamond e Montserrat."
  },
  "20.03": {
    "code": "20.03",
    "name": "DOCE DOBRA",
    "nicheCode": "20",
    "nicheName": "CREPERIAS E TAPIO CARIAS",
    "concept": "crepes doces criativos e delicados.",
    "palette": [
      "#F1B6C5",
      "#B77C4E",
      "#FFF5EB",
      "#60443B"
    ],
    "typography": "DM Serif Display e Nunito Sans."
  },
  "20.04": {
    "code": "20.04",
    "name": "MASSA LEVE",
    "nicheCode": "20",
    "nicheName": "CREPERIAS E TAPIO CARIAS",
    "concept": "tapiocas e crepes leves, naturais e saudáveis.",
    "palette": [
      "#FFFFFF",
      "#A3B59A",
      "#F6F2E8",
      "#52684B"
    ],
    "typography": "Plus Jakarta Sans e Inter."
  },
  "20.05": {
    "code": "20.05",
    "name": "CREPE LAB",
    "nicheCode": "20",
    "nicheName": "CREPERIAS E TAPIO CARIAS",
    "concept": "creperia contemporânea com sabores inovadores.",
    "palette": [
      "#1F2224",
      "#F7D23B",
      "#FFFFFF",
      "#C9CED0"
    ],
    "typography": "Space Grotesk e Archivo."
  },
  "21.01": {
    "code": "21.01",
    "name": "MARÉ ALTA",
    "nicheCode": "21",
    "nicheName": "PEIXARIAS E FRUTOS DO MAR",
    "concept": "frutos do mar premium e frescor oceânico.",
    "palette": [
      "#123A57",
      "#FFFFFF",
      "#EBDCC6",
      "#5DA6AA"
    ],
    "typography": "Playfair Display e Manrope."
  },
  "21.02": {
    "code": "21.02",
    "name": "COSTA FRESCA",
    "nicheCode": "21",
    "nicheName": "PEIXARIAS E FRUTOS DO MAR",
    "concept": "frutos do mar tropicais, leves e ensolarados.",
    "palette": [
      "#36B7B4",
      "#F1E2C7",
      "#EC8B73",
      "#FFFFFF"
    ],
    "typography": "Poppins e DM Sans."
  },
  "21.03": {
    "code": "21.03",
    "name": "PORTO DO PEIXE",
    "nicheCode": "21",
    "nicheName": "PEIXARIAS E FRUTOS DO MAR",
    "concept": "tradição de peixaria brasileira e frescor do mercado.",
    "palette": [
      "#244D72",
      "#DB735F",
      "#F7F0E6",
      "#B7C2C7"
    ],
    "typography": "Roboto Slab e Inter."
  },
  "21.04": {
    "code": "21.04",
    "name": "OSTRA & SAL",
    "nicheCode": "21",
    "nicheName": "PEIXARIAS E FRUTOS DO MAR",
    "concept": "alta gastronomia marinha, delicadeza e exclusividade.",
    "palette": [
      "#F1F0EA",
      "#597E76",
      "#303937",
      "#D6C6AB"
    ],
    "typography": "Cormorant Garamond e Plus Jakarta Sans."
  },
  "21.05": {
    "code": "21.05",
    "name": "OCEAN CATCH",
    "nicheCode": "21",
    "nicheName": "PEIXARIAS E FRUTOS DO MAR",
    "concept": "peixaria urbana moderna com comunicação forte e confiável.",
    "palette": [
      "#253139",
      "#2874A6",
      "#FFFFFF",
      "#E8F0F4"
    ],
    "typography": "Sora e Inter."
  },
  "22.01": {
    "code": "22.01",
    "name": "BOTECO RAIZ",
    "nicheCode": "22",
    "nicheName": "BARES, PETISCOS E PORÇÕES",
    "concept": "boteco brasileiro tradicional com energia popular e autêntica.",
    "palette": [
      "#F5C52F",
      "#C83F35",
      "#36764A",
      "#FFF4D9"
    ],
    "typography": "Archivo Black e Nunito Sans."
  },
  "22.02": {
    "code": "22.02",
    "name": "AFTER DARK",
    "nicheCode": "22",
    "nicheName": "BARES, PETISCOS E PORÇÕES",
    "concept": "bar noturno sofisticado, drinks e petiscos premium.",
    "palette": [
      "#141414",
      "#CC8D40",
      "#5B2837",
      "#E9DBC9"
    ],
    "typography": "Bodoni Moda e Manrope."
  },
  "22.03": {
    "code": "22.03",
    "name": "MESA 12",
    "nicheCode": "22",
    "nicheName": "BARES, PETISCOS E PORÇÕES",
    "concept": "bar gastronômico contemporâneo, encontros e boa conversa.",
    "palette": [
      "#25483D",
      "#F2E6D4",
      "#A9754B",
      "#292B29"
    ],
    "typography": "Fraunces e DM Sans."
  },
  "22.04": {
    "code": "22.04",
    "name": "HAPPY HOUR CLUB",
    "nicheCode": "22",
    "nicheName": "BARES, PETISCOS E PORÇÕES",
    "concept": "bar jovem e descontraído para encontros entre amigos.",
    "palette": [
      "#2C68B8",
      "#FF8B38",
      "#FFD458",
      "#FFFFFF"
    ],
    "typography": "Bricolage Grotesque e Poppins."
  },
  "22.05": {
    "code": "22.05",
    "name": "PETISCO & PROSA",
    "nicheCode": "22",
    "nicheName": "BARES, PETISCOS E PORÇÕES",
    "concept": "bar afetivo e acolhedor com gastronomia brasileira.",
    "palette": [
      "#B36D4D",
      "#EFE1CD",
      "#69754D",
      "#523B30"
    ],
    "typography": "Libre Baskerville e Nunito Sans."
  },
  "23.01": {
    "code": "23.01",
    "name": "RAÍZES DO SERTÃO",
    "nicheCode": "23",
    "nicheName": "RESTAURANTES NORDESTINOS",
    "concept": "gastronomia nordestina tradicional, história e pertencimento.",
    "palette": [
      "#B86141",
      "#EBD7B6",
      "#76513A",
      "#66764A"
    ],
    "typography": "Roboto Slab e DM Sans."
  },
  "23.02": {
    "code": "23.02",
    "name": "MANDACARU",
    "nicheCode": "23",
    "nicheName": "RESTAURANTES NORDESTINOS",
    "concept": "Nordeste contemporâneo, natureza, tradição e design.",
    "palette": [
      "#48754A",
      "#E7BC42",
      "#F0E1C6",
      "#B86B4F"
    ],
    "typography": "Fraunces e Plus Jakarta Sans."
  },
  "23.03": {
    "code": "23.03",
    "name": "CASA DO BAIÃO",
    "nicheCode": "23",
    "nicheName": "RESTAURANTES NORDESTINOS",
    "concept": "culinária nordestina familiar e generosa.",
    "palette": [
      "#B94238",
      "#F7E7CF",
      "#E2AD42",
      "#64412E"
    ],
    "typography": "Cooper Black e Nunito Sans."
  },
  "23.04": {
    "code": "23.04",
    "name": "SOL DO NORDESTE",
    "nicheCode": "23",
    "nicheName": "RESTAURANTES NORDESTINOS",
    "concept": "gastronomia regional vibrante, solar e cultural.",
    "palette": [
      "#F08A35",
      "#257AA6",
      "#F4CA45",
      "#FFF3DD"
    ],
    "typography": "Bricolage Grotesque e Inter."
  },
  "23.05": {
    "code": "23.05",
    "name": "SERTÃO NOBRE",
    "nicheCode": "23",
    "nicheName": "RESTAURANTES NORDESTINOS",
    "concept": "alta gastronomia nordestina e ingredientes regionais valorizados.",
    "palette": [
      "#4A3328",
      "#AD794D",
      "#E9D7BB",
      "#24211F"
    ],
    "typography": "Cormorant Garamond e Manrope."
  },
  "24.01": {
    "code": "24.01",
    "name": "SALGADO DE OURO",
    "nicheCode": "24",
    "nicheName": "SALGADERIAS",
    "concept": "salgados frescos, dourados e extremamente apetitosos.",
    "palette": [
      "#F5C442",
      "#70442F",
      "#FFF4DF",
      "#DF8137"
    ],
    "typography": "Poppins e DM Sans."
  },
  "24.02": {
    "code": "24.02",
    "name": "COXINHA CLUB",
    "nicheCode": "24",
    "nicheName": "SALGADERIAS",
    "concept": "salgaderia jovem, divertida e memorável.",
    "palette": [
      "#FF7829",
      "#3269DD",
      "#FFD94F",
      "#FFFFFF"
    ],
    "typography": "Fredoka e Inter."
  },
  "24.03": {
    "code": "24.03",
    "name": "MASSA & AFETO",
    "nicheCode": "24",
    "nicheName": "SALGADERIAS",
    "concept": "salgados artesanais com receitas de família.",
    "palette": [
      "#F6E9D8",
      "#B87659",
      "#748064",
      "#5D453A"
    ],
    "typography": "Fraunces e Nunito Sans."
  },
  "24.04": {
    "code": "24.04",
    "name": "SALGADO EXPRESS",
    "nicheCode": "24",
    "nicheName": "SALGADERIAS",
    "concept": "salgados rápidos para qualquer ocasião.",
    "palette": [
      "#DF4034",
      "#252525",
      "#FFFFFF",
      "#F8C83F"
    ],
    "typography": "Archivo Black e Inter."
  },
  "24.05": {
    "code": "24.05",
    "name": "BENDITA MASSA",
    "nicheCode": "24",
    "nicheName": "SALGADERIAS",
    "concept": "salgados gourmet e produção artesanal refinada.",
    "palette": [
      "#2D5141",
      "#BF9C60",
      "#EDE2CF",
      "#FFFFFF"
    ],
    "typography": "Playfair Display e Manrope."
  },
  "25.01": {
    "code": "25.01",
    "name": "ALOHA BOWL",
    "nicheCode": "25",
    "nicheName": "POKE E CULINÁRIA HAVAIANA",
    "concept": "culinária havaiana tropical, fresca e alegre.",
    "palette": [
      "#38B8AD",
      "#F38F78",
      "#F7D36D",
      "#FFFFFF"
    ],
    "typography": "Poppins e DM Sans."
  },
  "25.02": {
    "code": "25.02",
    "name": "POKE ZEN",
    "nicheCode": "25",
    "nicheName": "POKE E CULINÁRIA HAVAIANA",
    "concept": "alimentação leve, equilíbrio e minimalismo.",
    "palette": [
      "#FFFFFF",
      "#A0B59B",
      "#F1ECE2",
      "#343A35"
    ],
    "typography": "Plus Jakarta Sans e DM Sans."
  },
  "25.03": {
    "code": "25.03",
    "name": "ISLAND FRESH",
    "nicheCode": "25",
    "nicheName": "POKE E CULINÁRIA HAVAIANA",
    "concept": "frescor tropical, ingredientes naturais e energia.",
    "palette": [
      "#45945A",
      "#F3CF58",
      "#FFF4DE",
      "#F18370"
    ],
    "typography": "Bricolage Grotesque e Inter."
  },
  "25.04": {
    "code": "25.04",
    "name": "PACIFIC CLUB",
    "nicheCode": "25",
    "nicheName": "POKE E CULINÁRIA HAVAIANA",
    "concept": "lifestyle havaiano sofisticado e gastronomia premium.",
    "palette": [
      "#21455C",
      "#EAB49B",
      "#EDE0CE",
      "#FFFFFF"
    ],
    "typography": "Cormorant Garamond e Manrope."
  },
  "25.05": {
    "code": "25.05",
    "name": "BOWL SOCIETY",
    "nicheCode": "25",
    "nicheName": "POKE E CULINÁRIA HAVAIANA",
    "concept": "poke urbano moderno, jovem e criativo.",
    "palette": [
      "#A487E7",
      "#B9E95D",
      "#FFFFFF",
      "#303038"
    ],
    "typography": "Space Grotesk e Inter."
  }
};
const NICHE_CATALOG = {
  "06": {
    "niche": "Marmitarias e Comida Caseira",
    "categories": [
      "Todos",
      "Marmitas Executivas",
      "Pratos do Dia",
      "Bebidas & Sobremesas"
    ],
    "products": [
      {
        "id": "m1",
        "category": "Marmitas Executivas",
        "name": "Marmita Caseira Tradicional",
        "desc": "Arroz branquinho, feijão carioca com louro, bife acebolado suculento, farofa crocante e salada fresca.",
        "price": 24.9
      },
      {
        "id": "m2",
        "category": "Marmitas Executivas",
        "name": "Frango Grelhado com Legumes ao Vapor",
        "desc": "Filé de frango marinado em ervas finas, arroz integral, feijão preto e mix de legumes frescos.",
        "price": 23.5
      },
      {
        "id": "m3",
        "category": "Pratos do Dia",
        "name": "Feijoada Completa da Casa",
        "desc": "Feijoada artesanal com carnes nobres, arroz, couve refogada no alho, torresmo e laranja.",
        "price": 29.9
      },
      {
        "id": "m4",
        "category": "Bebidas & Sobremesas",
        "name": "Pudim de Leite Condensado",
        "desc": "Fatia generosa com calda de caramelo brilhante e textura aveludada.",
        "price": 9.9
      }
    ]
  },
  "16": {
    "niche": "Lanchonetes Tradicionais",
    "categories": [
      "Todos",
      "Lanches Tradicionais",
      "Acompanhamentos",
      "Bebidas"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Lanches Tradicionais",
        "name": "X-Salada Especial da Casa",
        "desc": "Pão artesanal tostado, hambúrguer bovino 150g, queijo prato derretido, alface fresca, tomate e maionese da casa.",
        "price": 26.9
      },
      {
        "id": "p2",
        "category": "Lanches Tradicionais",
        "name": "X-Tudo Tradicional Completo",
        "desc": "Hambúrguer, ovo frito, bacon crocante, presunto, queijo, milho, alface e batata palha.",
        "price": 32.9
      },
      {
        "id": "p3",
        "category": "Lanches Tradicionais",
        "name": "Misto Quente na Chapa",
        "desc": "Pão de forma dourado na manteiga, queijo derretido em dobro e presunto selecionado.",
        "price": 16.9
      },
      {
        "id": "p4",
        "category": "Acompanhamentos",
        "name": "Batatas Fritas Crocantes",
        "desc": "Porção de batatas sequinhas e crocantes com toque de sal e molho especial.",
        "price": 18.9
      },
      {
        "id": "p5",
        "category": "Bebidas",
        "name": "Suco de Laranja Natural 500ml",
        "desc": "Feito na hora com laranjas frescas selecionadas e sem adição de água.",
        "price": 9.9
      }
    ]
  },
  "17": {
    "niche": "Massas / Comida Italiana",
    "categories": [
      "Todos",
      "Massas Artesanais",
      "Clássicos da Nonna",
      "Sobremesas"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Massas Artesanais",
        "name": "Spaghetti al Pomodoro & Basilico",
        "desc": "Massa fresca al dente, molho rústico de tomates italianos San Marzano, manjericão fresco e parmesão ralado.",
        "price": 44.9
      },
      {
        "id": "p2",
        "category": "Massas Artesanais",
        "name": "Fettuccine Alfredo Trufado",
        "desc": "Massa longa ao creme de manteiga especial, queijo Grana Padano e toque refinado de azeite trufado.",
        "price": 52.9
      },
      {
        "id": "p3",
        "category": "Clássicos da Nonna",
        "name": "Lasagna Clássica alla Bolognese",
        "desc": "Camadas generosas de massa artesanal, ragu bovino cozido lentamente e bechamel cremoso gratinado.",
        "price": 48.9
      },
      {
        "id": "p4",
        "category": "Clássicos da Nonna",
        "name": "Bruschetta Tradizionale",
        "desc": "Pão italiano rústico tostado no azeite extravirgem, tomates maduros, alho e folhas de manjericão fresco.",
        "price": 24.9
      },
      {
        "id": "p5",
        "category": "Sobremesas",
        "name": "Tiramisù Clássico Italiano",
        "desc": "Biscoitos savoiardi embebidos em café espresso, cacau em pó e autêntico creme de queijo mascarpone.",
        "price": 22.9
      }
    ]
  },
  "18": {
    "niche": "Comida Chinesa / Yakisoba",
    "categories": [
      "Todos",
      "Yakisoba & Wok",
      "Pratos Especiais",
      "Entradas"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Yakisoba & Wok",
        "name": "Yakisoba Especial de Carne & Frango",
        "desc": "Massa frita crocante, tiras de alcatra, peito de frango, brócolis, couve-flor, cenoura e acelga ao molho shoyu especial.",
        "price": 38.9
      },
      {
        "id": "p2",
        "category": "Pratos Especiais",
        "name": "Frango Xadrez Tradicional",
        "desc": "Cubos de frango macios salteados no wok com pimentões coloridos, cebola e amendoim torrado crocante.",
        "price": 36.9
      },
      {
        "id": "p3",
        "category": "Entradas",
        "name": "Rolinho Primavera Crocante (2 un)",
        "desc": "Massa fininha e crocante recheada com carne moída temperada e repolho, servido com molho agridoce.",
        "price": 14.9
      },
      {
        "id": "p4",
        "category": "Pratos Especiais",
        "name": "Arroz Chop Suey Frito",
        "desc": "Arroz salteado na wok com flocos de ovo, presunto em cubos, cenoura e cebolinha verde fininha.",
        "price": 26.9
      },
      {
        "id": "p5",
        "category": "Entradas",
        "name": "Guioza Suíno ao Vapor (6 un)",
        "desc": "Recheadas com carne suína temperada, gengibre e acelga, acompanhadas de molho ponzu especial.",
        "price": 22.9
      }
    ]
  },
  "19": {
    "niche": "Comida Mexicana",
    "categories": [
      "Todos",
      "Tacos Artesanais",
      "Burritos & Quesadillas",
      "Sobremesas"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Tacos Artesanais",
        "name": "Trio de Tacos de Carne Asada",
        "desc": "Tortillas de milho crocantes, carne marinada grelhada, cebola picadinha, coentro fresco e fatias de limão.",
        "price": 36.9
      },
      {
        "id": "p2",
        "category": "Burritos & Quesadillas",
        "name": "Burrito Especial Supreme",
        "desc": "Tortilla gigante de trigo recheada com carne temperada, feijão fradinho, queijo derretido, arroz e sour cream.",
        "price": 38.9
      },
      {
        "id": "p3",
        "category": "Burritos & Quesadillas",
        "name": "Quesadilla de Queijo & Guacamole",
        "desc": "Tortilla tostada e recheada com blend de queijos derretidos, acompanhada de guacamole fresco e pico de gallo.",
        "price": 28.9
      },
      {
        "id": "p4",
        "category": "Tacos Artesanais",
        "name": "Nachos Supremos com Cheddar",
        "desc": "Totopos de milho crocantes cobertos com queijo cheddar cremoso, jalapeños, feijão refrito e sour cream.",
        "price": 34.9
      },
      {
        "id": "p5",
        "category": "Sobremesas",
        "name": "Churros com Doce de Leite",
        "desc": "Churros dourados passados na canela e açúcar com generoso pote de doce de leite artesanal.",
        "price": 18.9
      }
    ]
  },
  "20": {
    "niche": "Creperias e Tapiocarias",
    "categories": [
      "Todos",
      "Tapiocas Salgadas",
      "Crepes Franceses",
      "Doces & Especiais"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Tapiocas Salgadas",
        "name": "Tapioca de Carne de Sol com Coalho",
        "desc": "Massa artesanal hidratada na hora, carne de sol desfiada na manteiga de garrafa e queijo coalho derretido.",
        "price": 24.9
      },
      {
        "id": "p2",
        "category": "Tapiocas Salgadas",
        "name": "Tapioca de Frango com Catupiry",
        "desc": "Peito de frango desfiado temperado com ervas finas e legítimo requeijão Catupiry cremoso.",
        "price": 22.9
      },
      {
        "id": "p3",
        "category": "Crepes Franceses",
        "name": "Crêpe Parisiense de Queijo & Presunto",
        "desc": "Massa fininha dourada na chapa com queijo emmental derretido, presunto royale e orégano fresco.",
        "price": 28.9
      },
      {
        "id": "p4",
        "category": "Doces & Especiais",
        "name": "Tapioca Doce de Morango com Nutella",
        "desc": "Farta camada de Nutella original recheada com morangos frescos fatiados.",
        "price": 21.9
      },
      {
        "id": "p5",
        "category": "Doces & Especiais",
        "name": "Crêpe Doce de Banana Flambada",
        "desc": "Banana caramelizada na chapa com canela em pó e calda morna de caramelo toffee.",
        "price": 19.9
      }
    ]
  },
  "21": {
    "niche": "Peixarias e Frutos do Mar",
    "categories": [
      "Todos",
      "Frutos do Mar",
      "Peixes Grelhados",
      "Porções"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Frutos do Mar",
        "name": "Moqueca Tradicional de Peixe & Camarão",
        "desc": "Postas de peixe fresco e camarões médios cozidos no azeite de dendê, leite de coco, servida com arroz e pirão.",
        "price": 68.9
      },
      {
        "id": "p2",
        "category": "Peixes Grelhados",
        "name": "Salmão Grelhado com Alcaparras",
        "desc": "Filé de salmão grelhado na manteiga clarificada com alcaparras, legumes salteados e purê de batata baroa.",
        "price": 56.9
      },
      {
        "id": "p3",
        "category": "Porções",
        "name": "Camarão Empanado Crocante",
        "desc": "Camarões selecionados empanados na farinha panko crocante com molho tártaro artesanal.",
        "price": 46.9
      },
      {
        "id": "p4",
        "category": "Porções",
        "name": "Isca de Peixe Crocante com Limão",
        "desc": "Tiras de filé de peixe branco empanadas e douradas com molho rosê e gomos de limão siciliano.",
        "price": 38.9
      },
      {
        "id": "p5",
        "category": "Frutos do Mar",
        "name": "Casquinha de Siri Gratinada",
        "desc": "Carne de siri temperada com azeite de dendê, leite de coco e gratinada com queijo parmesão no forno.",
        "price": 22.9
      }
    ]
  },
  "22": {
    "niche": "Bares, Petiscos e Porções",
    "categories": [
      "Todos",
      "Petiscos de Boteco",
      "Porções para Compartilhar",
      "Bebidas"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Petiscos de Boteco",
        "name": "Torresmo de Rolo Pururucado",
        "desc": "Panceta suína enrolada, assada lentamente e frita até pururucar, servida com geleia de pimenta e limão.",
        "price": 38.9
      },
      {
        "id": "p2",
        "category": "Petiscos de Boteco",
        "name": "Bolinhos de Costela com Provolone (6 un)",
        "desc": "Massa de costela bovina desfiada recheada com provolone defumado e maionese de alho negro.",
        "price": 32.9
      },
      {
        "id": "p3",
        "category": "Porções para Compartilhar",
        "name": "Tábua de Picanha Fatiada no Réchaud",
        "desc": "500g de picanha macia fatiada na chapa com cebola caramelizada, farofa crocante e molho chimichurri.",
        "price": 64.9
      },
      {
        "id": "p4",
        "category": "Porções para Compartilhar",
        "name": "Batata Frita com Cheddar & Bacon",
        "desc": "Batatas crocantes cobertas com queijo cheddar cremoso fundido e farofa de bacon crocante.",
        "price": 28.9
      },
      {
        "id": "p5",
        "category": "Bebidas",
        "name": "Cerveja Artesanal Puro Malte 600ml",
        "desc": "Garrafa estupidamente gelada no ponto certo.",
        "price": 16.9
      }
    ]
  },
  "23": {
    "niche": "Restaurantes Nordestinos",
    "categories": [
      "Todos",
      "Pratos do Sertão",
      "Especiais da Casa",
      "Sobremesas"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Pratos do Sertão",
        "name": "Baião de Dois Tradicional Completo",
        "desc": "Arroz, feijão de corda, queijo coalho em cubos, carne seca desfiada, bacon, manteiga de garrafa e coentro.",
        "price": 42.9
      },
      {
        "id": "p2",
        "category": "Pratos do Sertão",
        "name": "Carne de Sol com Aipim na Manteiga",
        "desc": "Carne de sol maturada e grelhada, aipim cozido macio dourado na manteiga de garrafa com cebola roxa.",
        "price": 48.9
      },
      {
        "id": "p3",
        "category": "Especiais da Casa",
        "name": "Escondidinho de Carne Seca",
        "desc": "Camadas cremosas de purê de aipim gratinadas com queijo coalho e recheio farto de carne seca desfiada.",
        "price": 38.9
      },
      {
        "id": "p4",
        "category": "Especiais da Casa",
        "name": "Dadinhos de Tapioca com Pimenta (8 un)",
        "desc": "Dadinhos dourados crocantes por fora e macios por dentro feitos de tapioca e queijo coalho.",
        "price": 24.9
      },
      {
        "id": "p5",
        "category": "Sobremesas",
        "name": "Cartola Pernambucana com Canela",
        "desc": "Sobremesa típica com banana frita na manteiga, queijo coalho derretido, açúcar e canela.",
        "price": 18.9
      }
    ]
  },
  "24": {
    "niche": "Salgaderias",
    "categories": [
      "Todos",
      "Salgados Fritos",
      "Salgados de Forno",
      "Combos & Centos"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Salgados Fritos",
        "name": "Coxinha Cremosa de Frango com Catupiry",
        "desc": "Massa crocante com caldo de galinha caipira, peito de frango desfiado temperado e requeijão Catupiry.",
        "price": 8.9
      },
      {
        "id": "p2",
        "category": "Salgados Fritos",
        "name": "Kibe Recheado com Catupiry & Hortelã",
        "desc": "Carne bovina selecionada com trigo para kibe, hortelã fresca e recheio cremoso generoso.",
        "price": 8.9
      },
      {
        "id": "p3",
        "category": "Salgados de Forno",
        "name": "Empada Folhada de Camarão",
        "desc": "Massa podre que derrete na boca com recheio cremoso de camarões refogados no azeite e cheiro-verde.",
        "price": 9.9
      },
      {
        "id": "p4",
        "category": "Salgados de Forno",
        "name": "Enroladinho de Presunto & Queijo",
        "desc": "Massa fofa assada no forno com queijo muçarela e presunto de primeira qualidade.",
        "price": 7.9
      },
      {
        "id": "p5",
        "category": "Combos & Centos",
        "name": "Cento de Mini Salgados Sortidos (100 un)",
        "desc": "100 unidades de coxinhas, kibes, bolinhas de queijo e risoles sequinhos e crocantes para sua festa.",
        "price": 79.9
      }
    ]
  },
  "25": {
    "niche": "Poke e Culinária Havaiana",
    "categories": [
      "Todos",
      "Pokes Especiais",
      "Bowls Clássicos",
      "Bebidas Tropicais"
    ],
    "products": [
      {
        "id": "p1",
        "category": "Pokes Especiais",
        "name": "Aloha Salmon Supreme Bowl",
        "desc": "Base de arroz shari, cubos generosos de salmão fresco marinado, abacate fatiado, manga, pepino, repolho roxo, gergelim e molho tare especial.",
        "price": 46.9
      },
      {
        "id": "p2",
        "category": "Pokes Especiais",
        "name": "Tuna Fresh Hawaiian Poke",
        "desc": "Base de arroz integral ou folhas, atum fresco em cubos, edamame fresco, cenoura ralada, chips de coco e molho ponzu cítrico.",
        "price": 48.9
      },
      {
        "id": "p3",
        "category": "Bowls Clássicos",
        "name": "Shimeji & Tofu Veggie Bowl",
        "desc": "Base de arroz shari, cogumelos shimeji salteados no azeite e shoyu, cubos de tofu grelhado, manga, abacate e gergelim.",
        "price": 38.9
      },
      {
        "id": "p4",
        "category": "Bowls Clássicos",
        "name": "Ceviche Tropical de Peixe Branco",
        "desc": "Cubos de tilápia fresca marinados no suco de limão e laranja, cebola roxa fininha, coentro e milho tostado crocante.",
        "price": 36.9
      },
      {
        "id": "p5",
        "category": "Bebidas Tropicais",
        "name": "Chá Gelado de Hibisco com Frutas Vermelhas",
        "desc": "Infusão refrescante de hibisco com polpa de frutas vermelhas e folhas de hortelã fresca.",
        "price": 11.9
      }
    ]
  }
};


let currentModelId = '16.01';
let currentCategory = 'Todos';
let cart = {};

const formatMoney = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function getModelData(code) {
  if (MODELS_DB[code]) return MODELS_DB[code];
  if (window.CATALOG && Array.isArray(window.CATALOG)) {
    const found = window.CATALOG.find(x => x.id === code || x.code === code);
    if (found) {
      const nCode = (found.code || code || '16.01').split('.')[0].padStart(2, '0');
      return {
        code: found.code || code,
        name: found.name,
        nicheCode: nCode,
        nicheName: found.nicheName || found.niche || 'Gastronomia',
        concept: found.concept || found.direction || 'Pratos artesanais selecionados e entrega rápida.',
        palette: found.palette || ['#d97706', '#0f172a', '#ffffff'],
        typography: found.fonts || 'Inter'
      };
    }
  }
  return {
    code: code || '16.01',
    name: 'Delivery Especial',
    nicheCode: (code || '16.01').split('.')[0].padStart(2, '0'),
    nicheName: 'Gastronomia',
    concept: 'Pratos artesanais selecionados e entrega rápida.'
  };
}

function getNicheCatalog(nicheCode) {
  if (NICHE_CATALOG[nicheCode]) return NICHE_CATALOG[nicheCode];
  return NICHE_CATALOG["16"];
}

function setModel(code) {
  currentModelId = code;
  const m = getModelData(code);
  const nCat = getNicheCatalog(m.nicheCode);

  // 1. Atualizar <picture> na Hero para o modelo correspondente
  const srcMobile = document.getElementById('hero-src-mobile');
  const srcTablet = document.getElementById('hero-src-tablet');
  const heroImg = document.getElementById('hero-img');

  if (code.startsWith('06')) {
    const webpPath = '/showroom/assets/gastronomia/' + code + '.webp';
    if (srcMobile) srcMobile.srcset = webpPath;
    if (srcTablet) srcTablet.srcset = webpPath;
    if (heroImg) {
      heroImg.src = webpPath;
      heroImg.alt = m.name + ' • ' + (m.concept || '');
    }
  } else {
    const basePath = '/showroom/assets/gastronomia/' + code;
    if (srcMobile) srcMobile.srcset = basePath + '/mobile.png';
    if (srcTablet) srcTablet.srcset = basePath + '/tablet.png';
    if (heroImg) {
      heroImg.src = basePath + '/pc.png';
      heroImg.alt = m.name + ' • ' + (m.concept || '');
    }
  }

  // 2. Atualizar títulos e branding
  document.title = m.name + ' • Showroom Automatech';
  
  const menuTag = document.getElementById('menu-tag');
  if (menuTag) menuTag.textContent = (m.nicheName || nCat.niche).toUpperCase();

  const menuTitle = document.getElementById('menu-title');
  if (menuTitle) menuTitle.textContent = 'Cardápio Oficial • ' + m.name;

  const footerBrand = document.getElementById('footer-brand');
  if (footerBrand) footerBrand.textContent = m.name;

  const infoTitle = document.getElementById('info-dialog-title');
  if (infoTitle) infoTitle.textContent = 'Informações • ' + m.name;

  const infoAddress = document.getElementById('info-address');
  if (infoAddress) infoAddress.textContent = 'Polo Gastronômico • ' + m.name + ' Oficial';

  // 3. Renderizar filtros de categorias
  currentCategory = 'Todos';
  renderCategories(nCat.categories);

  // 4. Renderizar produtos
  renderProducts(nCat.products);

  // 5. Limpar carrinho e feedbacks
  cart = {};
  updateCart();

  const dialogFeedback = document.getElementById('dialog-feedback');
  if (dialogFeedback) dialogFeedback.textContent = '';
}

function renderCategories(categories) {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = categories.map(cat => {
    const isActive = cat === currentCategory;
    return `<button type="button" class="filter-btn ${isActive ? 'active' : ''}" data-cat="${cat}">${cat}</button>`;
  }).join('');
}

function renderProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;

  const filtered = currentCategory === 'Todos' ? products : products.filter(p => p.category === currentCategory);

  container.innerHTML = filtered.map(p => {
    return `
      <article class="product-card">
        <div>
          <span class="product-tag">${p.category}</span>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
        </div>
        <div class="product-bottom">
          <span class="product-price">${formatMoney(p.price)}</span>
          <button type="button" class="btn-add-cart" data-add="${p.id}" data-name="${p.name}" data-price="${p.price}">
            Adicionar +
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function updateCart() {
  const m = getModelData(currentModelId);
  const nCat = getNicheCatalog(m.nicheCode);

  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Atualizar contadores
  const quickCount = document.getElementById('quick-cart-count');
  if (quickCount) quickCount.textContent = totalItems;

  const badgeBtn = document.getElementById('cart-badge-btn');
  if (badgeBtn) badgeBtn.textContent = `(${totalItems})`;

  const totalVal = document.getElementById('cart-total-value');
  if (totalVal) totalVal.textContent = formatMoney(totalPrice);

  // Atualizar lista de itens
  const list = document.getElementById('cart-items-list');
  if (list) {
    if (totalItems === 0) {
      list.innerHTML = '<p style="color: #64748b; font-size: 13px; text-align: center; padding: 20px 0;">Sua sacola está vazia. Escolha um item delicioso no cardápio.</p>';
    } else {
      list.innerHTML = Object.values(cart).map(item => {
        return `
          <div class="cart-row">
            <div>
              <strong style="font-size: 14px;">${item.name}</strong>
              <div style="font-size: 12px; color: #64748b;">${formatMoney(item.price)} cada</div>
            </div>
            <div class="cart-qty">
              <button type="button" data-delta="-1" data-id="${item.id}">−</button>
              <span style="font-weight: 800; min-width: 20px; text-align: center;">${item.qty}</span>
              <button type="button" data-delta="1" data-id="${item.id}">+</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const submitBtn = document.getElementById('btn-submit-cart');
  if (submitBtn) {
    submitBtn.disabled = totalItems === 0;
    submitBtn.style.opacity = totalItems === 0 ? '0.45' : '1';
  }
}

// Toast
let toastTimer = null;
function showToast(text) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// Interatividade Geral
document.addEventListener('click', e => {
  // 1. Abrir Modal de Informações
  if (e.target.closest('[data-info]')) {
    const dialog = document.getElementById('info-dialog');
    if (dialog) dialog.showModal();
    return;
  }

  // 2. Abrir Modal de Sacola
  if (e.target.closest('[data-cart]')) {
    const dialog = document.getElementById('cart-dialog');
    if (dialog) dialog.showModal();
    return;
  }

  // 3. Filtrar Categorias
  const catBtn = e.target.closest('.filter-btn');
  if (catBtn && catBtn.dataset.cat) {
    currentCategory = catBtn.dataset.cat;
    const m = getModelData(currentModelId);
    const nCat = getNicheCatalog(m.nicheCode);
    renderCategories(nCat.categories);
    renderProducts(nCat.products);
    return;
  }

  // 4. Adicionar ao Carrinho
  const addBtn = e.target.closest('[data-add]');
  if (addBtn) {
    const id = addBtn.dataset.add;
    const name = addBtn.dataset.name;
    const price = parseFloat(addBtn.dataset.price);

    if (!cart[id]) {
      cart[id] = { id, name, price, qty: 0 };
    }
    cart[id].qty += 1;
    updateCart();
    showToast(`${name} adicionado à sacola!`);
    return;
  }

  // 5. Alterar Quantidade no Carrinho
  const qtyBtn = e.target.closest('[data-delta]');
  if (qtyBtn) {
    const id = qtyBtn.dataset.id;
    const delta = parseInt(qtyBtn.dataset.delta, 10);
    if (cart[id]) {
      cart[id].qty += delta;
      if (cart[id].qty <= 0) {
        delete cart[id];
      }
      updateCart();
    }
    return;
  }

  // 6. Botões de Ação de Contato no Modal de Informações
  const contactBtn = e.target.closest('.btn-contact-action');
  if (contactBtn && contactBtn.dataset.feedback) {
    const feedback = document.getElementById('dialog-feedback');
    if (feedback) feedback.textContent = contactBtn.dataset.feedback;
    return;
  }

  // 7. Alternar Tema
  if (e.target.closest('#btn-theme-toggle') || e.target.closest('#btn-theme-hotspot')) {
    const isDark = document.body.classList.toggle('alt-theme');
    const label = document.getElementById('theme-label');
    if (label) label.textContent = isDark ? '☀️ Claro' : '🌙 Escuro';
    return;
  }
});

// Fechar modais ao clicar no backdrop
['info-dialog', 'cart-dialog'].forEach(id => {
  const d = document.getElementById(id);
  if (d) {
    d.addEventListener('click', e => {
      const rect = d.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!inDialog) d.close();
    });
  }
});

// Concluir Pedido Demonstrativo
const submitBtn = document.getElementById('btn-submit-cart');
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const feedback = document.getElementById('cart-feedback-msg');
    if (feedback) feedback.textContent = 'Pedido demonstrativo registrado! Nenhum valor foi cobrado.';
    cart = {};
    updateCart();
  });
}

// Escutar mensagens do Showroom Pai
window.addEventListener('message', e => {
  if (e.data && e.data.type === 'switchHero') {
    const template = e.data.template;
    if (template) {
      setModel(template);
      const url = new URL(location.href);
      url.searchParams.set('hero', template);
      history.replaceState(null, '', url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
});

// Inicialização a partir da URL
(function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const heroParam = urlParams.get('hero') || '16.01';
  setModel(heroParam);
})();
