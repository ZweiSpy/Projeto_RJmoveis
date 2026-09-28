const fs = require('fs');
const path = require('path');

const files = [
  { name: 'site-catalogos-original.html', pageNum: 1 },
  { name: 'site-catalogo-p2', pageNum: 2 },
  { name: 'site-catalogo-pg3.html', pageNum: 3 },
  { name: 'site-catalogo-pg4.html', pageNum: 4 },
  { name: 'site-catalagos-pg5.html', pageNum: 5 },
  { name: 'site-catalagos-pg6.html', pageNum: 6 },
  { name: 'site-catalagos-pg7.html', pageNum: 7 }
];

const allCards = [];
const seenIds = new Set();

files.forEach(({ name, pageNum }) => {
  const filePath = path.resolve('c:/Users/Micro/Documents/Projeto_MeusMoveis', name);
  const content = fs.readFileSync(filePath, 'utf8');

  const gridMarker = 'class="collection-grid mode-grid flex"';
  const gridStart = content.indexOf(gridMarker);
  const paginateMarker = 'class="collection-paginate';
  const gridEnd = content.indexOf(paginateMarker, gridStart);

  const gridHtml = content.substring(gridStart, gridEnd);
  const cardStartMarker = '<div class="storefront-cards collection-grid-card product-card';
  const cardIndices = [];
  let pos = 0;
  while ((pos = gridHtml.indexOf(cardStartMarker, pos)) !== -1) {
    cardIndices.push(pos);
    pos += cardStartMarker.length;
  }

  for (let i = 0; i < cardIndices.length; i++) {
    const start = cardIndices[i];
    let end;
    if (i < cardIndices.length - 1) {
      end = cardIndices[i + 1];
    } else {
      end = gridHtml.lastIndexOf('</div>\n                    </div>');
      if (end === -1) end = gridHtml.lastIndexOf('</div>\r\n                    </div>');
      if (end === -1) end = gridHtml.lastIndexOf('</div>');
    }

    let cardBlock = gridHtml.substring(start, end).trim();
    const idMatch = cardBlock.match(/data-id="(\d+)"/);
    const dataId = idMatch ? idMatch[1] : `p${pageNum}_${i}`;

    const titleMatch = cardBlock.match(/class="[^"]*product-card-title[^"]*"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    let title = '';
    if (titleMatch) {
      title = titleMatch[1].replace(/\s+/g, ' ').trim();
    }

    const isProntaEntrega = cardBlock.includes('immediate-delivery') || cardBlock.includes('Pronta Entrega');

    allCards.push({
      page: pageNum,
      indexInPage: i + 1,
      id: dataId,
      title,
      isProntaEntrega,
      rawCardHtml: cardBlock
    });

    seenIds.add(dataId);
  }
});

function getCategory(title) {
  const t = title.toLowerCase();
  
  // 1. Estofados & Sofás
  if (t.includes('sofá') || t.includes('sofa') || t.includes('poltrona') || t.includes('puff') || t.includes('recamier') || t.includes('chaise')) {
    return 'sofas';
  }
  
  // 2. Cozinha & Modulados
  if (t.includes('cozinha') || t.includes('armário de cozinha') || t.includes('armario de cozinha') || 
      t.includes('balcão') || t.includes('balcao') || t.includes('paneleiro') || 
      t.includes('fruteira') || t.includes('gabinete') || t.includes('armário aéreo') || 
      t.includes('armario aereo') || t.includes('armário multiuso') || t.includes('armario multiuso') || 
      t.includes('multiuso') || t.includes('torre quente') || t.includes('aéreo de geladeira') || 
      t.includes('aereo de geladeira') || t.includes('cantinho do café') || t.includes('cantinho do cafe') ||
      t.includes('cristaleira')) {
    return 'cozinha';
  }

  // 3. Salas de Jantar & Mesas
  if (t.includes('sala de jantar') || t.includes('jantar') || t.includes('aparador') || 
      t.includes('buffet') || t.includes('banco') || t.includes('banqueta') ||
      (t.includes('mesa') && !t.includes('cabeceira') && !t.includes('escritório') && !t.includes('computador')) ||
      (t.includes('cadeira') && !t.includes('escritório'))) {
    return 'salas';
  }

  // 4. Painéis, Racks & Home
  if (t.includes('painel') || t.includes('rack') || t.includes('home') || t.includes('estante') || t.includes('suporte tv')) {
    return 'paineis';
  }

  // 5. Quartos & Roupeiros / Cama / Colchão
  if (t.includes('guarda-roupa') || t.includes('guarda roupa') || t.includes('roupeiro') || 
      t.includes('cama') || t.includes('cabeceira') || t.includes('colchão') || t.includes('colchao') || 
      t.includes('cômoda') || t.includes('comoda') || t.includes('beliche') || t.includes('treliche') || 
      t.includes('mesa de cabeceira') || t.includes('criado-mudo') || t.includes('quarto') || 
      t.includes('guarda-roupas') || t.includes('sapateira') || t.includes('base box') || 
      t.includes('box baú') || t.includes('box bau') || t.includes('modulado rizon') || 
      t.includes('kit 8 pés') || t.includes('kit 8 pes')) {
    return 'quartos';
  }

  // 6. Escritório / Home Office (or can be grouped into its own category or quartos)
  if (t.includes('escrivaninha') || t.includes('mesa de escritório') || t.includes('computador') || t.includes('escritorio') || t.includes('estudo')) {
    return 'escritorio';
  }

  return 'outros';
}

const stats = {
  sofas: 0,
  quartos: 0,
  salas: 0,
  paineis: 0,
  cozinha: 0,
  escritorio: 0,
  outros: 0
};

const remaining = [];
allCards.forEach(c => {
  const cat = getCategory(c.title);
  stats[cat]++;
  if (cat === 'outros') remaining.push(c);
});

console.log('--- REFINED CATEGORIZATION ---');
console.log(`🛋️ Estofados & Sofás: ${stats.sofas}`);
console.log(`🛏️ Quartos & Roupeiros: ${stats.quartos}`);
console.log(`🪑 Salas de Jantar: ${stats.salas}`);
console.log(`📺 Painéis, Racks & Home: ${stats.paineis}`);
console.log(`🍽️ Cozinha & Modulados: ${stats.cozinha}`);
console.log(`💻 Escritório / Home Office: ${stats.escritorio}`);
console.log(`❓ Outros: ${stats.outros}`);

if (remaining.length > 0) {
  remaining.forEach(r => console.log(`Unclassified: [${r.id}] ${r.title}`));
}
