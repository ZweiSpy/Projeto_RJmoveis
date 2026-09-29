const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve('c:/Users/Micro/Documents/Projeto_MeusMoveis');
const WHATSAPP_NUMBER = '5521994990764'; // (21) 99499-0764
const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

console.log('===============================================================');
console.log('  CONSTRUTOR MULTI-PÁGINAS RJ MÓVEIS (8 PÁGINAS)');
console.log(`  WhatsApp Oficial: +${WHATSAPP_NUMBER} (Rio de Janeiro)`);
console.log('  Novas Features: Vitrine 12 itens, Paginação 24/pág,');
console.log('  Botões Limpos sem Número e Telemetria Analytics');
console.log('===============================================================');

// 1. Definição dos arquivos fonte brutos
const SOURCE_FILES = [
    { file: 'site-catalogos-original.html', pageNum: 1 },
    { file: 'site-catalogo-p2', pageNum: 2 },
    { file: 'site-catalogo-pg3.html', pageNum: 3 },
    { file: 'site-catalogo-pg4.html', pageNum: 4 },
    { file: 'site-catalagos-pg5.html', pageNum: 5 },
    { file: 'site-catalagos-pg6.html', pageNum: 6 },
    { file: 'site-catalagos-pg7.html', pageNum: 7 }
];

// Ícones SVG Vetoriais Oficiais
const WHATSAPP_ICON_SVG = `<svg class="whatsapp-icon" viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>`;
const WHATSAPP_FLOATING_ICON_SVG = `<svg class="whatsapp-floating-icon" viewBox="0 0 448 512" width="35" height="35" fill="#ffffff" aria-hidden="true"><path fill="#ffffff" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>`;
const SUN_ICON_SVG = `<svg class="theme-icon icon-sun" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const MOON_ICON_SVG = `<svg class="theme-icon icon-moon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

// Função para categorizar produto pelo título
function categorizeProduct(title) {
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
        t.includes('kit 8 pés') || t.includes('kit 8 pes') || t.includes('escrivaninha') || 
        t.includes('escritorio') || t.includes('mesa de escritório') || t.includes('computador')) {
        return 'quartos';
    }

    return 'sofas'; // fallback seguro
}

// 2. Extração Cirúrgica dos Cards
console.log('\n[1/5] Extraindo e higienizando cards de todos os arquivos fonte...');

const allProducts = [];
const seenIds = new Set();
let page1Cards = [];

SOURCE_FILES.forEach(({ file, pageNum }) => {
    const filePath = path.join(BASE_DIR, file);
    if (!fs.existsSync(filePath)) {
        console.error(`ERRO: Arquivo não encontrado: ${filePath}`);
        return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    
    const gridMarker = 'class="collection-grid mode-grid flex"';
    const gridStart = content.indexOf(gridMarker);
    const paginateMarker = 'class="collection-paginate';
    const gridEnd = content.indexOf(paginateMarker, gridStart);
    
    if (gridStart === -1 || gridEnd === -1) {
        console.error(`ERRO: Marcadores de grid/paginação não encontrados em ${file}`);
        return;
    }

    const gridHtml = content.substring(gridStart, gridEnd);
    const cardStartMarker = '<div class="storefront-cards collection-grid-card product-card';
    const cardIndices = [];
    let pos = 0;
    while ((pos = gridHtml.indexOf(cardStartMarker, pos)) !== -1) {
        cardIndices.push(pos);
        pos += cardStartMarker.length;
    }

    console.log(`  -> Página ${pageNum} (${file}): ${cardIndices.length} cards detectados.`);

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

        let rawCard = gridHtml.substring(start, end).trim();
        
        // Extrai data-id
        const idMatch = rawCard.match(/data-id="(\d+)"/);
        const dataId = idMatch ? idMatch[1] : `p${pageNum}_${i}`;

        // Extrai título original
        const titleMatch = rawCard.match(/class="[^"]*product-card-title[^"]*"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
        let title = 'Móvel RJ Móveis';
        if (titleMatch) {
            title = titleMatch[1].replace(/\s+/g, ' ').trim();
        }

        // Verifica flag de pronta entrega
        const isProntaEntrega = rawCard.includes('immediate-delivery') || rawCard.includes('Pronta Entrega');

        // Sanitização Rigorosa do Card:
        // Mensagem que indica que o cliente veio diretamente do site:
        const safeTitle = title.replace(/"/g, '&quot;');
        const encodedMsg = encodeURIComponent(`Olá, equipe RJ Móveis! Tenho interesse no *${title}*. Gostaria de saber opções de cores/tecidos e o prazo de entrega para o Rio de Janeiro.`);
        const whatsappHref = `${WHATSAPP_BASE_URL}?text=${encodedMsg}`;
        
        // Botão sem o número visível no texto com CTA persuasivo:
        const ctaBtnHTML = `<a href="${whatsappHref}" class="btn-whatsapp-cta" data-product-name="${safeTitle}" title="Consultar no WhatsApp agora" target="_blank" rel="noopener noreferrer">${WHATSAPP_ICON_SVG}<span>Consultar no WhatsApp</span></a>`;

        // Substituição do bloco de preço e action
        let cleanCard = rawCard.replace(
            /<div class="product-card-price"[\s\S]*?<div class="product-card-action[^"]*w-100[^"]*"[^>]*>\s*<\/div>/gi,
            ctaBtnHTML
        );

        // Fallback para qualquer outro container de preço residual dentro do card
        cleanCard = cleanCard.replace(/<div class="currentPrice"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '');
        cleanCard = cleanCard.replace(/<div class="price" data-element="sale-price"[\s\S]*?<\/div>/gi, '');
        cleanCard = cleanCard.replace(/<div class="installment-plan"[\s\S]*?<\/div>/gi, '');

        // Remover quaisquer resquícios de R$, parcelas ou links de lojista externo
        cleanCard = cleanCard.replace(/https:\/\/www\.catalogodemoveis\.com\.br\/[^\s"'>]+/gi, '#');
        cleanCard = cleanCard.replace(/#f96a1b/gi, '#1e293b');
        cleanCard = cleanCard.replace(/#4a2e22/gi, '#1e293b');
        cleanCard = cleanCard.replace(/#b85125/gi, '#b45309');
        cleanCard = cleanCard.replace(/#e8590c/gi, '#0f172a');
        cleanCard = cleanCard.replace(/#fff1e8/gi, '#f1f5f9');
        cleanCard = cleanCard.replace(/#f5d3bd/gi, '#e2e8f0');

        // Garantir fechamento de tags do card
        if (!cleanCard.endsWith('</div>\n</div>') && !cleanCard.endsWith('</div></div>')) {
            const opens = (cleanCard.match(/<div[\s>]/gi) || []).length;
            const closes = (cleanCard.match(/<\/div>/gi) || []).length;
            for (let c = 0; c < (opens - closes); c++) {
                cleanCard += '</div>';
            }
        }

        const category = categorizeProduct(title);

        const productObj = {
            id: dataId,
            title,
            category,
            isProntaEntrega,
            cleanHtml: cleanCard,
            sourcePage: pageNum
        };

        if (!seenIds.has(dataId)) {
            seenIds.add(dataId);
            allProducts.push(productObj);
            if (pageNum === 1) {
                page1Cards.push(productObj);
            }
        }
    }
});

console.log(`\nTotal de produtos únicos extraídos: ${allProducts.length}`);

// 3. Agrupamento por Categorias — Página Inicial com exatamente 12 itens
const buckets = {
    all: allProducts,
    sofas: allProducts.filter(p => p.category === 'sofas'),
    quartos: allProducts.filter(p => p.category === 'quartos'),
    cozinha: allProducts.filter(p => p.category === 'cozinha'),
    salas: allProducts.filter(p => p.category === 'salas'),
    paineis: allProducts.filter(p => p.category === 'paineis'),
    'pronta-entrega': allProducts.filter(p => p.isProntaEntrega),
    index: page1Cards.slice(0, 12) // Vitrine inicial com exatamente 12 móveis
};

console.log('\n[2/5] Estatísticas por Página de Saída:');
console.log(`  - catalogo.html (Catálogo Completo): ${buckets.all.length} produtos`);
console.log(`  - sofas.html (Estofados & Sofás): ${buckets.sofas.length} produtos`);
console.log(`  - quartos.html (Quartos & Roupeiros): ${buckets.quartos.length} produtos`);
console.log(`  - cozinha.html (Cozinha & Modulados): ${buckets.cozinha.length} produtos`);
console.log(`  - salas.html (Salas de Jantar): ${buckets.salas.length} produtos`);
console.log(`  - paineis.html (Painéis & Home): ${buckets.paineis.length} produtos`);
console.log(`  - pronta-entrega.html (⚡ Pronta Entrega): ${buckets['pronta-entrega'].length} produtos`);
console.log(`  - index.html (Página Inicial / Vitrine): ${buckets.index.length} produtos (Destaques)`);

// 4. Carregar Template Base Limpo a partir de site-catalogos-original.html
console.log('\n[3/5] Gerando template HTML base institucional...');
let baseHtml = fs.readFileSync(path.join(BASE_DIR, 'site-catalogos-original.html'), 'utf8');

// A. Charset UTF-8
baseHtml = baseHtml.replace(/<meta http-equiv="Content-Type" content="text\/html; charset=iso-8859-1">/i, 
    '<meta charset="UTF-8">\n    <meta http-equiv="X-UA-Compatible" content="IE=edge">');

// B. Limpar metatags antigas e menções de moeda R$
baseHtml = baseHtml.replace(/<meta name="currency" content="R\$">/gi, '<meta name="currency" content="BRL">');
baseHtml = baseHtml.replace(/<meta property="og:image[^"]*"\s+content="[^"]*catalogo-moveis\.png">/gi, '');
baseHtml = baseHtml.replace(/<link rel="image_src"\s+href="[^"]*catalogo-moveis\.png">/gi, '');
baseHtml = baseHtml.replace(/https:\/\/www\.catalogodemoveis\.com\.br\/q\/catalogo\/?/gi, 'catalogo.html');
baseHtml = baseHtml.replace(/https:\/\/www\.catalogodemoveis\.com\.br\/?/gi, 'index.html');
baseHtml = baseHtml.replace(/href="index\.html\/"/gi, 'href="index.html"');


// C. Inserir script ante-FOUC e folhas de estilo oficiais no <head>
const headInject = `
    <!-- Script de Inicialização Instantânea de Tema (Evita FOUC / Flash Branco) -->
    <script>
        (function() {
            try {
                var savedTheme = localStorage.getItem('rj_theme');
                var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                var theme = savedTheme ? savedTheme : (systemDark ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
        })();
    </script>
    <!-- Vercel Web Analytics & Speed Insights Oficiais -->
    <script>
        window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
        window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/insights/script.js"></script>
    <script defer src="/_vercel/speed-insights/script.js"></script>
    <!-- Estilos Oficiais RJ Móveis & Design Tokens (Elegance Blue) -->
    <link rel="stylesheet" href="css/tokens.css">
    <link rel="stylesheet" href="css/custom.css">
</head>`;
baseHtml = baseHtml.replace('</head>', headInject);

// D. Substituir cores antigas globais
baseHtml = baseHtml.replace(/#f96a1b/gi, '#1e293b');
baseHtml = baseHtml.replace(/#4a2e22/gi, '#1e293b');
baseHtml = baseHtml.replace(/#b85125/gi, '#b45309');
baseHtml = baseHtml.replace(/#e8590c/gi, '#0f172a');
baseHtml = baseHtml.replace(/#fff1e8/gi, '#f1f5f9');
baseHtml = baseHtml.replace(/#f5d3bd/gi, '#e2e8f0');

// E. Remover scripts e trackers Matomo / Slider / Antigo Carrinho
baseHtml = baseHtml.replace(/<script[^>]*src="[^"]*matomo\.js"[^>]*><\/script>/gi, '<!-- Tracker Matomo removido -->');
baseHtml = baseHtml.replace(/<script\s+type="text\/javascript">\s*var _paq = _paq \|\| \[\];[\s\S]*?window\._paq = _paq;\s*<\/script>/gi, '<!-- Tracker Matomo inline removido -->');
baseHtml = baseHtml.replace(/<script>\s*\$\(document\)\.ready\(function\s*\(\)\s*\{\s*\$\("#slider-range"\)[\s\S]*?<\/script>/gi, '<!-- Script de slider de preço suprimido -->');
baseHtml = baseHtml.replace(/\/\*-- Card: "ou R\$ X no PIX"[^\*]+\*\//g, '');
baseHtml = baseHtml.replace(/<option value="maxdiscount">[^<]+<\/option>/gi, '');
baseHtml = baseHtml.replace(/<option value="pricelow">[^<]+<\/option>/gi, '');
baseHtml = baseHtml.replace(/<option value="pricemax">[^<]+<\/option>/gi, '');

// Limpar resíduos de carrinho antigo no template base (substituindo R$ por texto neutro)
baseHtml = baseHtml.replace(/<div class="price-total">R\$\s*<span id="cart-total-value">0,00\s*<\/span>\s*<\/div>/gi, 
    '<div class="price-total"><span id="cart-total-value">Consulte via WhatsApp</span></div>');
baseHtml = baseHtml.replace(/"R\$\s*"\s*\+\s*FormataMoeda/gi, '"" + FormataMoeda');

// Neutralizar regras legadas inline que quebravam o layout dos cards
baseHtml = baseHtml.replace(/\.product-card-information-add\s*\{\s*position:\s*absolute;[\s\S]*?top:\s*0;\s*left:\s*0;\s*\}/gi, '/* .product-card-information-add position fixed */');
baseHtml = baseHtml.replace(/\.product-card-thumbnail\s*\{\s*margin:\s*0\s*!important;\s*\}/gi, '/* .product-card-thumbnail margin fixed */');
baseHtml = baseHtml.replace(/\.product-card-information-add\s+div\.immediate-delivery\s*\{\s*background-color:\s*#9068aa;\s*\}/gi, '/* immediate-delivery background fixed */');

// F. Modernizar Toolbar do Catálogo: remover seletor de grid e modo lista, e injetar ordenação dinâmica e limite por página
const modernToolbarRegex = /<div class="collection-sort">[\s\S]*?<div class="collection-grid-column[\s\S]*?<div class="collection-view-mode">[\s\S]*?<\/div>\s*<div class="collection-limit hide-on-small-and-down">[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/gi;

const modernToolbarHTML = `
<div class="collection-sort">
    <select name="sort" id="rj-select-sort" title="Ordenar produtos">
        <option value="bestsellers" selected>Mais vendidos</option>
        <option value="new">Novos lançamentos</option>
        <option value="name">Nome do produto (A-Z)</option>
    </select>
</div>
<div class="flex" align-items="center">
    <div class="collection-limit hide-on-small-and-down">
        <select name="limit" id="rj-select-per-page" title="Quantidade de produtos por página">
            <option value="24" selected>24 por página</option>
            <option value="36">36 por página</option>
            <option value="48">48 por página</option>
            <option value="60">60 por página</option>
            <option value="72">72 por página</option>
            <option value="84">84 por página</option>
        </select>
    </div>
</div>`;

baseHtml = baseHtml.replace(modernToolbarRegex, modernToolbarHTML);

// G. Construir Cabeçalho Dinâmico (Sem número no botão)
function buildHeader(activeKey) {
    const navItems = [
        { key: 'index', label: 'Início', href: 'index.html' },
        { key: 'all', label: 'Catálogo Completo', href: 'catalogo.html' },
        { key: 'sofas', label: 'Estofados &amp; Sofás', href: 'sofas.html' },
        { key: 'quartos', label: 'Quartos &amp; Roupeiros', href: 'quartos.html' },
        { key: 'salas', label: 'Salas de Jantar', href: 'salas.html' },
        { key: 'paineis', label: 'Painéis &amp; Home', href: 'paineis.html' },
        { key: 'cozinha', label: 'Cozinha &amp; Modulados', href: 'cozinha.html' },
        { key: 'pronta-entrega', label: '⚡ Pronta Entrega', href: 'pronta-entrega.html', highlight: true }
    ];

    const navLinksHtml = navItems.map(item => {
        const isActive = (item.key === activeKey) ? ' active' : '';
        const isHighlight = item.highlight ? ' class="highlight"' : '';
        return `<li${isHighlight}><a href="${item.href}" class="${isActive.trim()}">${item.label}</a></li>`;
    }).join('\n                    ');

    const generalMsg = encodeURIComponent("Olá! Estava no site da RJ Móveis e quero atendimento com um consultor.");
    const directWhatsUrl = `${WHATSAPP_BASE_URL}?text=${generalMsg}`;

    return `
    <!-- CABEÇALHO OFICIAL RJ MÓVEIS -->
    <header class="rj-header">
        <div class="rj-topbar">
            <span>🛋️ <strong>RJ Móveis</strong> — Catálogo Exclusivo | Atendimento Direto e Humanizado</span>
        </div>
        <div class="rj-header-main">
            <a href="index.html" class="rj-brand-logo" title="RJ Móveis - Página Inicial">
                <span class="rj-logo-monogram">RJ</span>
                <div class="rj-logo-text">
                    <span class="rj-brand-name">RJ MÓVEIS</span>
                    <span class="rj-brand-tagline">Design &amp; Conforto</span>
                </div>
            </a>
            <div class="rj-search-box">
                <form id="rj-catalog-search-form" onsubmit="return false;">
                    <input type="text" id="rj-catalog-search-input" placeholder="Buscar sofás, mesas, guarda-roupas no catálogo..." autocomplete="off">
                    <button type="submit" class="rj-search-btn" aria-label="Pesquisar" title="Pesquisar no catálogo">
                        <svg class="rj-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>
                    </button>
                </form>
            </div>
            <div class="rj-header-action">
                <button id="theme-toggle" class="rj-theme-toggle rj-theme-toggle-header" type="button" aria-label="Alternar tema claro/escuro" title="Alternar modo claro/escuro">
                    ${SUN_ICON_SVG}
                    ${MOON_ICON_SVG}
                    <span class="theme-text-dark">Modo Escuro</span>
                    <span class="theme-text-light">Modo Claro</span>
                </button>
                <a href="${directWhatsUrl}" class="rj-btn-direct-whats btn-whatsapp-cta" data-product-name="Catálogo Geral RJ Móveis" target="_blank" rel="noopener noreferrer">
                    ${WHATSAPP_ICON_SVG}
                    <span>Chame no WhatsApp</span>
                </a>
            </div>
        </div>
        <nav class="rj-navbar">
            <div class="rj-nav-container">
                <ul class="rj-nav-list">
                    ${navLinksHtml}
                </ul>
            </div>
        </nav>
    </header>`;
}

// H. Construir Sidebar Dinâmica com Contadores Exatos
function buildSidebar(activeKey) {
    const generalMsg = encodeURIComponent("Olá! Estava no site da RJ Móveis e quero consultoria técnica sobre medidas e produtos.");
    const consultorWhatsUrl = `${WHATSAPP_BASE_URL}?text=${generalMsg}`;

    const categories = [
        { key: 'all', label: 'Catálogo Completo', count: buckets.all.length, href: 'catalogo.html' },
        { key: 'sofas', label: 'Estofados &amp; Sofás', count: buckets.sofas.length, href: 'sofas.html' },
        { key: 'quartos', label: 'Quartos &amp; Roupeiros', count: buckets.quartos.length, href: 'quartos.html' },
        { key: 'cozinha', label: 'Cozinha &amp; Modulados', count: buckets.cozinha.length, href: 'cozinha.html' },
        { key: 'salas', label: 'Salas de Jantar &amp; Mesas', count: buckets.salas.length, href: 'salas.html' },
        { key: 'paineis', label: 'Painéis, Racks &amp; Home', count: buckets.paineis.length, href: 'paineis.html' },
        { key: 'pronta-entrega', label: '⚡ Pronta Entrega', count: buckets['pronta-entrega'].length, href: 'pronta-entrega.html' }
    ];

    const catItemsHtml = categories.map(cat => {
        const isCurrent = (cat.key === activeKey);
        const activeClass = isCurrent ? ' active' : '';
        return `
            <li class="rj-dept-item${activeClass}">
                <a href="${cat.href}" class="rj-dept-link${activeClass}" title="${cat.label} (${cat.count} produtos)">
                    <span class="rj-dept-label"><span class="rj-dept-bullet"></span>${cat.label}</span>
                    <strong class="rj-dept-count">(${cat.count})</strong>
                </a>
            </li>`;
    }).join('\n                    ');

    return `
        <!-- Departamentos Oficiais RJ Móveis -->
        <div class="sidebar-filter-block filter--categories" style="padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px;">
            <div class="header flex" align-items="center" justify-content="space-between" style="padding-bottom: 10px; border-bottom: 1px solid #e2e8f0; margin-bottom: 12px;">
                <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary-navy); text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">Departamentos</h3>
            </div>
            <div class="content">
                <ul class="rj-sidebar-departments">
                    ${catItemsHtml}
                </ul>
            </div>
        </div>
        <div class="sidebar-filter-block filter--consultor" style="padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--color-primary-navy); margin: 0 0 6px 0;">Consultor Online RJ</h4>
            <p style="font-size: 0.8rem; color: #64748b; line-height: 1.4; margin: 0 0 12px 0;">Dúvidas sobre medidas, tecidos, montagem e frete para o RJ? Fale com nossa equipe.</p>
            <a href="${consultorWhatsUrl}" class="btn-whatsapp-cta" data-product-name="Consultoria Sidebar RJ Móveis" target="_blank" rel="noopener noreferrer" style="font-size: 0.8rem; padding: 8px 12px; width: 100%;">
                ${WHATSAPP_ICON_SVG}
                <span>Falar no WhatsApp</span>
            </a>
        </div>`;
}

// I. Construir Breadcrumb Dinâmico Oficial
function buildBreadcrumb(cfg) {
    if (cfg.isHome) {
        return `
    <!-- BREADCRUMB OFICIAL RJ MÓVEIS (HOME) -->
    <ul id="breadcrumb" itemscope="" itemtype="http://schema.org/BreadcrumbList" class="flex custom-container" wrap="true">
        <li class="flex" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem">
            <span itemprop="name" style="font-weight: 700; color: var(--color-primary-navy);">Início</span>
            <meta itemprop="position" content="1">
        </li>
    </ul>`;
    }

    return `
    <!-- BREADCRUMB OFICIAL RJ MÓVEIS (CATEGORIA) -->
    <ul id="breadcrumb" itemscope="" itemtype="http://schema.org/BreadcrumbList" class="flex custom-container" wrap="true">
        <li class="flex" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem">
            <a itemprop="item" href="index.html" title="Página Inicial RJ Móveis">
                <meta itemprop="name" content="Página inicial"> <span>Home</span>
            </a>
            <i data-fa-i2svg=""><svg class="svg-inline--fa fa-chevron-double-right fa-xs" aria-hidden="true" focusable="false" data-prefix="fad" data-icon="chevron-double-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><g class="fa-duotone-group"><path class="fa-secondary" fill="currentColor" d="M32 448c0 8.2 3.1 16.4 9.4 22.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3l-192-192C80.4 35.1 72.2 32 64 32s-16.4 3.1-22.6 9.4c-12.5 12.5-12.5 32.8 0 45.3L210.7 256 41.4 425.4C35.1 431.6 32 439.8 32 448z"></path><path class="fa-primary" fill="currentColor" d="M470.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L402.7 256 233.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></g></svg></i>
            <meta itemprop="position" content="1">
        </li>
        <li class="flex" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem">
            <span itemprop="name">${cfg.breadcrumbLabel}</span>
            <meta itemprop="position" content="2">
        </li>
    </ul>`;
}

// J. Construir Cabeçalho da Categoria com Contagem Real
function buildCategoryHeader(cfg) {
    const countText = `${cfg.items.length} ${cfg.items.length === 1 ? 'produto' : 'produtos'}`;
    return `
            <div class="section-header search-header rj-catalog-header">
                <div class="header text-center">
                    <h1 class="rj-category-h1">${cfg.headline}</h1>
                    <div class="rj-category-counter">(${countText})</div>
                    <p class="rj-category-desc">${cfg.subheadline}</p>
                </div>
            </div>`;
}


// I. Construir Rodapé Oficial Unificado (Sem número no botão)
function buildFooter() {
    const generalMsg = encodeURIComponent("Olá! Estava no site da RJ Móveis e quero informações sobre as opções e entrega.");
    const footerWhatsUrl = `${WHATSAPP_BASE_URL}?text=${generalMsg}`;
    const floatingWhatsUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent("Olá! Estava no site da RJ Móveis e gostaria de atendimento via WhatsApp.")}`;

    return `
    <!-- RODAPÉ OFICIAL RJ MÓVEIS -->
    <footer class="foot cdm-foot">
        <section class="cdm-foot-cta" aria-label="Atendimento WhatsApp" style="background-color: var(--color-primary-navy);">
            <div class="cdm-foot-wrap cdm-foot-cta-inner">
                <div>
                    <h2 style="color: #ffffff;">Fale com a RJ Móveis</h2>
                    <p style="color: #cbd5e1;">Tire dúvidas sobre medidas, tecidos, entregas e receba atendimento exclusivo com nossos consultores.</p>
                </div> 
                <a class="rj-btn-direct-whats rj-foot-cta-btn btn-whatsapp-cta" href="${footerWhatsUrl}" target="_blank" rel="noopener noreferrer" data-product-name="Atendimento Geral Rodapé RJ Móveis" title="Falar no WhatsApp">
                    ${WHATSAPP_ICON_SVG}
                    <span>Falar no WhatsApp</span>
                </a>
            </div>
        </section>
        <div class="cdm-foot-main">
            <div class="cdm-foot-wrap cdm-foot-grid">
                <div class="cdm-foot-brand">
                    <a class="rj-brand-logo" href="index.html" style="margin-bottom: 12px;">
                        <span class="rj-logo-monogram">RJ</span>
                        <div class="rj-logo-text">
                            <span class="rj-brand-name" style="color: var(--color-primary-navy);">RJ MÓVEIS</span>
                            <span class="rj-brand-tagline">Design &amp; Conforto</span>
                        </div>
                    </a>
                    <p style="color: #64748b;">Catálogo digital de móveis e estofados selecionados. Atendimento humanizado e vendas diretas com entrega especializada.</p>
                </div>
                <div class="cdm-foot-col" role="navigation" aria-label="Departamentos">
                    <h3 style="color: var(--color-primary-navy);">Departamentos</h3>
                    <ul>
                        <li><a href="catalogo.html">Catálogo Completo</a></li>
                        <li><a href="sofas.html">Estofados &amp; Sofás</a></li>
                        <li><a href="quartos.html">Quartos &amp; Roupeiros</a></li>
                        <li><a href="cozinha.html">Cozinha &amp; Modulados</a></li>
                        <li><a href="salas.html">Salas de Jantar</a></li>
                        <li><a href="paineis.html">Painéis &amp; Home</a></li>
                        <li><a href="pronta-entrega.html">⚡ Pronta Entrega</a></li>
                    </ul>
                </div>
                <div class="cdm-foot-col" role="navigation" aria-label="Atendimento">
                    <h3 style="color: var(--color-primary-navy);">Atendimento</h3>
                    <ul>
                        <li><a href="${footerWhatsUrl}" target="_blank" rel="noopener noreferrer">Fale no WhatsApp</a></li>
                        <li><span style="color: #64748b; font-size: 0.875rem;">Segunda a Sexta: 08h às 19h</span></li>
                        <li><span style="color: #64748b; font-size: 0.875rem;">Sábados: 08h às 14h</span></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="cdm-foot-bottom">
            <div class="cdm-foot-wrap" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <p style="margin: 0; color: #94a3b8; font-size: 0.8125rem;">&copy; 2026 RJ Móveis. Todos os direitos reservados. Catálogo para fins de consulta e divulgação autorizada.</p>
                <p style="margin: 0; font-size: 0.8125rem; color: #94a3b8;">Desenvolvido por <a href="https://zweicoorp.com.br" target="_blank" rel="noopener noreferrer" style="color: var(--color-accent-gold); text-decoration: none; font-weight: 600;">Zwei Coorporações LTDA</a></p>
            </div>
        </div>
    </footer>

    <!-- BOTÃO FLUTUANTE PULSANTE DO WHATSAPP (CANTO INFERIOR DIREITO) -->
    <a href="${floatingWhatsUrl}" class="btn-whatsapp-floating btn-whatsapp-cta" data-product-name="Atendimento Flutuante RJ Móveis" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp com a RJ Móveis" title="Chame no WhatsApp">
        ${WHATSAPP_FLOATING_ICON_SVG}
    </a>

    <!-- SCRIPTS OFICIAIS RJ MÓVEIS (TELEMETRIA, TEMA, MODAL, BUSCA, ORDENAÇÃO, PAGINAÇÃO E CRO) -->
    <script src="js/analytics.js"></script>
    <script src="js/theme-toggle.js"></script>
    <script src="js/products-data.js"></script>
    <script src="js/product-modal.js"></script>
    <script src="js/catalog-sort.js"></script>
    <script src="js/catalog-pagination.js"></script>
    <script src="js/catalog-search.js"></script>
    <script src="js/cro-enhancements.js"></script>
</body>`;
}

// 5. Configuração das Páginas de Saída
const PAGES_CONFIG = [
    {
        filename: 'index.html',
        activeKey: 'index',
        pageTitle: 'RJ Móveis — Catálogo de Móveis & Decoração',
        breadcrumbLabel: 'Início',
        headline: 'Destaques do Catálogo',
        subheadline: 'Confira nossa seleção exclusiva com 12 móveis e estofados em destaque.',
        items: buckets.index,
        isHome: true
    },
    {
        filename: 'catalogo.html',
        activeKey: 'all',
        pageTitle: 'Catálogo Completo — Todos os Móveis | RJ Móveis',
        breadcrumbLabel: 'Catálogo Completo',
        headline: 'Catálogo Geral Completo',
        subheadline: `Explore todos os ${buckets.all.length} móveis disponíveis em nosso catálogo com pronta consulta.`,
        items: buckets.all
    },
    {
        filename: 'sofas.html',
        activeKey: 'sofas',
        pageTitle: 'Estofados & Sofás — RJ Móveis',
        breadcrumbLabel: 'Estofados & Sofás',
        headline: 'Estofados, Sofás & Poltronas',
        subheadline: `Veja nossa coleção de ${buckets.sofas.length} sofás retráteis, reclináveis, de canto e poltronas nobres.`,
        items: buckets.sofas
    },
    {
        filename: 'quartos.html',
        activeKey: 'quartos',
        pageTitle: 'Quartos & Roupeiros — RJ Móveis',
        breadcrumbLabel: 'Quartos & Roupeiros',
        headline: 'Quartos, Guarda-Roupas & Camas',
        subheadline: `Seleção com ${buckets.quartos.length} guarda-roupas, cabeceiras, camas baú e modulados para seu dormitório.`,
        items: buckets.quartos
    },
    {
        filename: 'cozinha.html',
        activeKey: 'cozinha',
        pageTitle: 'Cozinha & Modulados — RJ Móveis',
        breadcrumbLabel: 'Cozinha & Modulados',
        headline: 'Cozinha, Armários & Modulados',
        subheadline: `Confira ${buckets.cozinha.length} opções de armários, balcões, paneleiros e torres quentes.`,
        items: buckets.cozinha
    },
    {
        filename: 'salas.html',
        activeKey: 'salas',
        pageTitle: 'Salas de Jantar & Mesas — RJ Móveis',
        breadcrumbLabel: 'Salas de Jantar & Mesas',
        headline: 'Salas de Jantar, Mesas & Cadeiras',
        subheadline: `Conjuntos elegantes com ${buckets.salas.length} mesas de jantar, cadeiras e buffets para receber bem.`,
        items: buckets.salas
    },
    {
        filename: 'paineis.html',
        activeKey: 'paineis',
        pageTitle: 'Painéis, Racks & Home — RJ Móveis',
        breadcrumbLabel: 'Painéis, Racks & Home',
        headline: 'Painéis para TV, Racks & Home Theater',
        subheadline: `Destaque sua sala de estar com ${buckets.paineis.length} painéis ripados, racks modernos e estantes.`,
        items: buckets.paineis
    },
    {
        filename: 'pronta-entrega.html',
        activeKey: 'pronta-entrega',
        pageTitle: '⚡ Móveis com Pronta Entrega — RJ Móveis',
        breadcrumbLabel: '⚡ Pronta Entrega',
        headline: '⚡ Móveis com Pronta Entrega',
        subheadline: `Mais de ${buckets['pronta-entrega'].length} móveis disponíveis para envio ágil e imediato no Rio de Janeiro.`,
        items: buckets['pronta-entrega']
    }
];

// 6. Loop de Renderização e Gravação de Todas as Páginas
console.log('\n[4/5] Renderizando e gravando as 8 páginas HTML...');

PAGES_CONFIG.forEach(cfg => {
    let pageHtml = baseHtml;

    // 1. Título e Metadados
    pageHtml = pageHtml.replace(/<title>[^<]+<\/title>/i, `<title>${cfg.pageTitle}</title>`);
    pageHtml = pageHtml.replace(/<meta property="og:title" content="[^"]*">/gi, `<meta property="og:title" content="${cfg.pageTitle}">`);

    // 2. Cabeçalho Oficial RJ Móveis
    pageHtml = pageHtml.replace(/<header[\s\S]*?<\/header>/i, buildHeader(cfg.activeKey));

    // 3. Breadcrumb Oficial Dinâmico (Sem index.html/ com barra e com nome real da categoria)
    pageHtml = pageHtml.replace(/<ul id="breadcrumb"[\s\S]*?<\/ul>/i, buildBreadcrumb(cfg));

    // 4. Cabeçalho H1 Oficial da Categoria com Contagem Real (Elimina catalogo 523 produtos estático)
    pageHtml = pageHtml.replace(/<div class="section-header search-header">[\s\S]*?<\/div>\s*<\/div>/i, buildCategoryHeader(cfg));

    // 5. Sidebar de Departamentos Dinâmica
    pageHtml = pageHtml.replace(/<div class="sidebar-filter-block filter--price">[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/gi, buildSidebar(cfg.activeKey));

    // 6. Injetar Cards no Grid
    const cardsHtml = cfg.items.map(p => p.cleanHtml).join('\n                        ');
    
    // Se for a página inicial, adiciona o banner convidando para ver o catálogo completo
    let homeBannerCtaHtml = '';
    if (cfg.isHome) {
        homeBannerCtaHtml = `
        <div class="rj-home-catalog-cta">
            <h3>Procurando mais opções para sua casa?</h3>
            <p>Temos mais de <strong>500 móveis</strong> disponíveis em nosso catálogo completo com fotos, medidas e atendimento direto.</p>
            <a href="catalogo.html" class="rj-btn-view-all">
                <span>Ver Catálogo Completo (523 Móveis)</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
        </div>`;
    }

    const gridStartMarker = 'class="collection-grid mode-grid flex"';
    const gStart = pageHtml.indexOf(gridStartMarker);
    const paginateMarker = 'class="collection-paginate';
    const gEnd = pageHtml.indexOf(paginateMarker, gStart);

    if (gStart !== -1 && gEnd !== -1) {
        const beforeGrid = pageHtml.substring(0, gStart);
        const afterGrid = pageHtml.substring(gEnd);
        
        const paginateEnd = afterGrid.indexOf('</div>', afterGrid.indexOf('</nav>')) + 6;
        const afterPaginate = afterGrid.substring(paginateEnd);

        const newGridBlock = `class="collection-grid mode-grid rj-products-grid" id="rj-products-grid">
                        ${cardsHtml}
                    </div>
                    <!-- Fim do Grid de Produtos -->
                    ${homeBannerCtaHtml}`;

        pageHtml = beforeGrid + newGridBlock + afterPaginate;
    } else {
        console.error(`Falha ao posicionar grid na página ${cfg.filename}`);
    }

    // 7. Rodapé Oficial
    pageHtml = pageHtml.replace(/<footer[\s\S]*?<\/body>/i, buildFooter());


    // 7. Salvar Arquivo
    const targetFile = path.join(BASE_DIR, cfg.filename);
    fs.writeFileSync(targetFile, pageHtml, 'utf8');

    // Validações imediatas
    const openDivs = (pageHtml.match(/<div[\s>]/gi) || []).length;
    const closeDivs = (pageHtml.match(/<\/div>/gi) || []).length;
    const delta = openDivs - closeDivs;
    const rDollarCount = (pageHtml.match(/R\$/g) || []).length;
    const cardCount = (pageHtml.match(/class="[^"]*product-card-title[^"]*"/g) || []).length;

    console.log(`  [OK] ${cfg.filename.padEnd(20)} -> ${cardCount} cards | Delta <div>: ${delta} | R$: ${rDollarCount} | ${(pageHtml.length / 1024).toFixed(1)} KB`);
});

console.log('\n[5/5] Todas as 8 páginas foram construídas com sucesso!');
