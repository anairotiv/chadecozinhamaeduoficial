// ===== CONFIGURAÇÃO — edite só este arquivo =====
const CONFIG = {
  data: "2026-12-05T14:30:00-03:00",          // data/hora do evento (fuso de São Paulo)
  prazo: "25 de novembro de 2026",
  local: "Rua Santa Cruz, nº 5, Chácaras Califórnia, Embu-Guaçu — SP",
  formEndpoint: "https://script.google.com/macros/s/AKfycbw-PUQyHMM1lCKW3BKa5IkGBqQOScOirAtbetLeBdBVNVynb9NtTJbbot0F4NIhHsq4/exec",      // endereço que recebe a confirmação de presença (Google Apps Script) — ver LEIA-ME
  pix: "11984074656",               // chave Pix dos anfitriões
  pixNome: "Marina Wentz de Moura"            // nome do titular da chave (opcional)
};
// img: link da foto do produto (deixe "" para mostrar o espaço elegante sem foto)
// reservado: true esconde o presente da lista (se preferir fazer à mão)
const PRESENTES = [
  {"cat": "Eletrodomésticos", "nome": "Ferro de Passar Roupa (Black+Decker)", "url": "https://www.amazon.com.br/dp/B07WG9313J", "img": "imagens/ferro-de-passar-roupa.jpg", "reservado": false},
  {"cat": "Eletrodomésticos", "nome": "Chaleira Elétrica (Mondial Premium CE-06)", "url": "https://www.amazon.com.br/Chaleira-El%C3%A9trica-Premium-CE-06-Mondial/dp/B084KYGZM1", "img": "imagens/chaleira-eletrica.jpg", "reservado": false},
  {"cat": "Eletrodomésticos", "nome": "Sanduicheira e Grill (Britânia BGR27I)", "url": "https://www.amazon.com.br/dp/B0B5B7ZCZZ", "img": "imagens/sanduicheira-e-grill.jpg", "reservado": false},
  {"cat": "Eletrodomésticos", "nome": "Cafeteira Elétrica (Oster Compacta OCAF300)", "url": "https://www.magazineluiza.com.br/cafeteira-eletrica-oster-compacta-ocaf300-19-cafes-preto/p/230460000/ep/cafe/", "img": "imagens/cafeteira-eletrica.jpg", "reservado": false},
  {"cat": "Eletrodomésticos", "nome": "Liquidificador (Mondial Turbo Inox L-1100-BI, 1100 W, 12 velocidades, com filtro)", "url": "https://www.magazineluiza.com.br/liquidificador-mondial-turbo-inox-l-1100-bi-preto-com-filtro-12-velocidades-1100w/p/021756300/ep/liqu/", "img": "imagens/liquidificador.jpg", "reservado": false},
  {"cat": "Panelas e assadeiras", "nome": "Conjunto de Assadeiras Marinex Opaline (3 peças)", "url": "https://meli.la/2ZW642a", "img": "imagens/conjunto-de-assadeiras-marinex-opaline.jpg", "reservado": false},
  {"cat": "Panelas e assadeiras", "nome": "Jogo de Assadeiras de Bolo (Tramontina Starflon Max, 3 peças)", "url": "https://meli.la/2M5XHoz", "img": "imagens/jogo-de-assadeiras-de-bolo.jpg", "reservado": false},
  {"cat": "Panelas e assadeiras", "nome": "Panela de Pressão 4,2 L com revestimento cerâmico", "url": "https://meli.la/2RknNCU", "img": "imagens/panela-de-pressao.jpg", "reservado": false},
  {"cat": "Potes e recipientes", "nome": "Kit de Potes para Mantimentos (6 potes herméticos de vidro 450 ml, tampa de bambu)", "url": "https://meli.la/2Perur7", "img": "imagens/kit-de-potes-para-mantimentos.jpg", "reservado": false},
  {"cat": "Potes e recipientes", "nome": "Kit de Potes de Inox (3 bowls com tampa hermética)", "url": "https://meli.la/1zKPph5", "img": "imagens/kit-de-potes-de-inox.jpg", "reservado": false},
  {"cat": "Potes e recipientes", "nome": "Kit de Potes Herméticos para micro-ondas", "url": "https://www.amazon.com.br/Herm%C3%A9ticos-Micro-ondas-Refei%C3%A7%C3%B5es-Armazenamento-Organiza%C3%A7%C3%A3o/dp/B0HFD9GT4V", "img": "imagens/kit-de-potes-hermeticos.jpg", "reservado": false},
  {"cat": "Potes e recipientes", "nome": "Kit Potes Marinex 300 ml (3 potes)", "url": "https://shopee.com.br/Kit-03-Pe%C3%A7as-Facilita-300ml-Marinex-Nadir-i.596426098.16037708363", "img": "imagens/kit-potes-marinex-300ml.jpg", "reservado": false},
  {"cat": "Potes e recipientes", "nome": "Kit Potes Marinex 500 ml (3 potes)", "url": "https://meli.la/1QL7mr3", "img": "imagens/kit-potes-marinex-500ml.jpg", "reservado": false},
  {"cat": "Potes e recipientes", "nome": "Kit Potes Marinex 750 ml (3 potes)", "url": "https://meli.la/2V44NmY", "img": "imagens/kit-potes-marinex-750ml.jpg", "reservado": false},
  {"cat": "Utensílios e acessórios de cozinha", "nome": "Kit de Utensílios Brinox (8 peças)", "url": "https://meli.la/2rFFYix", "img": "imagens/kit-de-utensilios.jpg", "reservado": false},
  {"cat": "Utensílios e acessórios de cozinha", "nome": "Kit de Facas (aço inox, profissionais)", "url": "https://www.amazon.com.br/Profissionais-Inoxid%C3%A1vel-Inteiri%C3%A7as-Antiferrugem-Ergon%C3%B4mico/dp/B0GXP3YGLT", "img": "imagens/kit-de-facas.jpg", "reservado": false},
  {"cat": "Utensílios e acessórios de cozinha", "nome": "Kit de Escorredores e Peneiras (4 peças de inox)", "url": "https://meli.la/27NdGGn", "img": "imagens/kit-de-escorredores-e-peneiras.jpg", "reservado": false},
  {"cat": "Utensílios e acessórios de cozinha", "nome": "Kit de Porta Temperos (giratório em inox com 12 potes de vidro)", "url": "https://www.mercadolivre.com.br/porta-condimentos-giratorio-aco-inox-com-12-potes-vidro-360/up/MLBU4048542620", "img": "imagens/kit-de-porta-temperos.jpg", "reservado": false},
  {"cat": "Louças e itens para servir", "nome": "Jogo de Pratos (Tramontina Ingrid, porcelana)", "url": "https://www.amazon.com.br/Pratos-Tramontina-Ingrid-Porcelana-Pe%C3%A7as/dp/B0BG6CHH4X", "img": "imagens/jogo-de-pratos.jpg", "reservado": false},
  {"cat": "Louças e itens para servir", "nome": "Jogo de Talheres (Tramontina)", "url": "https://www.amazon.com.br/dp/B076X6TXTC", "img": "imagens/jogo-de-talheres.jpg", "reservado": false},
  {"cat": "Louças e itens para servir", "nome": "Kit para Sobremesa", "url": "https://meli.la/1v2MNiV", "img": "imagens/kit-para-sobremesa.jpg", "reservado": false},
  {"cat": "Louças e itens para servir", "nome": "Prato para Bolo (cristal Wolff Pearl)", "url": "https://www.amazon.com.br/WOLFF-Pearl-Prato-Cristal-Transparente/dp/B076Z41X98", "img": "imagens/prato-para-bolo.jpg", "reservado": false},
  {"cat": "Organização e decoração", "nome": "Estante para Funkos (expositora com 50 nichos)", "url": "https://meli.la/2hxgbN1", "img": "imagens/estante-para-funkos.jpg", "reservado": false},
  {"cat": "Banheiro", "nome": "Kit Lixeira 5 L com pedal e Escova Sanitária de inox", "url": "https://meli.la/21prgUL", "img": "imagens/kit-lixeira-e-escova-sanitaria.jpg", "reservado": false},
  {"cat": "Lavanderia", "nome": "Varal de Chão (reforçado com abas, dobrável/retrátil, Slim Mor, branco)", "url": "https://www.mercadolivre.com.br/varal-de-chao-reforcado-com-abas-dobravel-retratil-slim-mor-cor-branco/up/MLBU1989071807", "img": "imagens/varal-de-chao.jpg", "reservado": false},
  {"cat": "Lavanderia", "nome": "Tábua de Passar Roupa", "url": "https://meli.la/2bRQGhj", "img": "imagens/tabua-de-passar-roupa.jpg", "reservado": false}
];
// meta e arrecadado em reais. Atualize "arrecadado" só após confirmar o Pix no seu banco.
const VAQUINHA = [
  {"nome": "Jogo de Panelas", "meta": 600, "arrecadado": 0, "img": "imagens/jogo-de-panelas.jpg"},
  {"nome": "Micro-ondas", "meta": 600, "arrecadado": 0, "img": "imagens/micro-ondas.jpg"},
  {"nome": "Air Fryer com Forno", "meta": 530, "arrecadado": 0, "img": "imagens/air-fryer-com-forno.jpg"},
  {"nome": "Aspirador de Pó Robô", "meta": 1600, "arrecadado": 0, "img": "imagens/aspirador-de-po-robo.jpg"},
  {"nome": "Lava e Seca", "meta": 3500, "arrecadado": 0, "img": "imagens/lava-e-seca.jpg"},
  {"nome": "Sofá", "meta": 4000, "arrecadado": 0, "img": "imagens/sofa.jpg"}
];
