/**
 * test_layout_and_analytics.js — Validação Automatizada de Alinhamento, Paginação e Analytics
 * Verifica:
 * 1. Vitrine da home com exatamente 12 itens e banner de catálogo completo
 * 2. Catálogo completo com 523 itens
 * 3. Remoção do número de telefone do texto dos botões de WhatsApp
 * 4. Mensagem com indicação de origem do site ("Olá! Estava no site da RJ Móveis e quero...")
 * 5. Presença e sintaxe de js/analytics.js (Google, Meta, Vercel) e js/catalog-pagination.js
 * 6. Regras de alinhamento uniforme de cards no css/custom.css
 * 7. Cláusula Pétrea: Zero "R$" em todas as 8 páginas
 * 8. Balanço de tags HTML (Delta <div> = 0)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PAGES = [
    { file: 'index.html', expectedCards: 12, isHome: true },
    { file: 'catalogo.html', expectedCards: 523 },
    { file: 'sofas.html', expectedCards: 191 },
    { file: 'quartos.html', expectedCards: 224 },
    { file: 'cozinha.html', expectedCards: 72 },
    { file: 'salas.html', expectedCards: 23 },
    { file: 'paineis.html', expectedCards: 13 },
    { file: 'pronta-entrega.html', expectedCards: 503 }
];

let totalFailures = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
        totalFailures++;
    }
}

console.log('===============================================================');
console.log('  TESTES DE VALIDAÇÃO: ALINHAMENTO, PAGINAÇÃO & ANALYTICS');
console.log('===============================================================\n');

// 1. Verificação de Integridade das Páginas HTML
PAGES.forEach(({ file, expectedCards, isHome }) => {
    console.log(`--- Verificando ${file} ---`);
    const filePath = path.join(ROOT_DIR, file);
    assert(fs.existsSync(filePath), `Arquivo ${file} existe`);

    const content = fs.readFileSync(filePath, 'utf8');

    // Quantidade de cards
    const cardMatches = content.match(/class="[^"]*product-card-title[^"]*"/g) || [];
    assert(cardMatches.length === expectedCards, `${file} tem exatamente ${expectedCards} cards (encontrados: ${cardMatches.length})`);

    // Zero R$ (Cláusula Pétrea)
    const rDollarMatches = content.match(/R\$/g) || [];
    assert(rDollarMatches.length === 0, `${file} tem zero ocorrências de 'R$' (encontradas: ${rDollarMatches.length})`);

    // Tag balance (divs)
    const openDivs = (content.match(/<div[\s>]/gi) || []).length;
    const closeDivs = (content.match(/<\/div>/gi) || []).length;
    assert(openDivs === closeDivs, `${file} possui balanço perfeito de <div> (open: ${openDivs}, close: ${closeDivs})`);

    // Inclusão dos scripts obrigatórios
    assert(content.includes('src="js/analytics.js"'), `${file} inclui js/analytics.js`);
    assert(content.includes('src="js/catalog-pagination.js"'), `${file} inclui js/catalog-pagination.js`);
    assert(content.includes('src="js/theme-toggle.js"'), `${file} inclui js/theme-toggle.js`);
    assert(content.includes('src="js/catalog-search.js"'), `${file} inclui js/catalog-search.js`);

    // Botões de WhatsApp sem número visível no texto
    const btnNumberInText = content.match(/<a[^>]*btn-whatsapp-cta[^>]*>[\s\S]*?\(21\)\s*99499-0764[\s\S]*?<\/a>/gi);
    assert(!btnNumberInText, `${file} não exibe número de telefone no texto dos botões de WhatsApp`);

    // Presença de texto limpo nos botões
    assert(content.includes('<span>Chame no WhatsApp</span>') || content.includes('<span>Falar no WhatsApp</span>'), `${file} possui botões com texto limpo de CTA`);

    // Mensagem com identificação de origem do site
    assert(content.includes(encodeURIComponent('Olá! Estava no site da RJ Móveis e quero')), `${file} possui links com mensagem identificando origem do site`);

    // Verificação específica da home
    if (isHome) {
        assert(content.includes('rj-home-catalog-cta'), `${file} possui banner convidando para ver catálogo completo`);
        assert(content.includes('catalogo.html'), `${file} direciona banner para catalogo.html`);
    }

    console.log('');
});

// 2. Verificação do Coletor de Analytics (js/analytics.js)
console.log('--- Verificando js/analytics.js ---');
const analyticsPath = path.join(ROOT_DIR, 'js', 'analytics.js');
assert(fs.existsSync(analyticsPath), 'js/analytics.js existe');
const analyticsContent = fs.readFileSync(analyticsPath, 'utf8');

assert(analyticsContent.includes('RJ_ANALYTICS_CONFIG'), 'Possui objeto RJ_ANALYTICS_CONFIG para configuração rápida');
assert(analyticsContent.includes('googleAnalyticsId'), 'Suporta integração com Google Analytics 4');
assert(analyticsContent.includes('metaPixelId'), 'Suporta integração com Meta Pixel');
assert(analyticsContent.includes('vercelAnalytics'), 'Suporta integração com Vercel Analytics');
assert(analyticsContent.includes('window.va'), 'Integra com window.va da Vercel');
assert(analyticsContent.includes('window.gtag'), 'Integra com window.gtag do Google');
assert(analyticsContent.includes('window.fbq'), 'Integra com window.fbq da Meta');
assert(analyticsContent.includes('trackWhatsAppClick'), 'Rastreia conversões de clique no WhatsApp');
assert(analyticsContent.includes('relatorio: function'), 'Possui função relatorio() para consulta no console');

console.log('');

// 3. Verificação do Script de Paginação (js/catalog-pagination.js)
console.log('--- Verificando js/catalog-pagination.js ---');
const paginationPath = path.join(ROOT_DIR, 'js', 'catalog-pagination.js');
assert(fs.existsSync(paginationPath), 'js/catalog-pagination.js existe');
const paginationContent = fs.readFileSync(paginationPath, 'utf8');

assert(paginationContent.includes('select[name="limit"]'), 'Conecta com o seletor de limite da página');
assert(paginationContent.includes('itemsPerPage'), 'Controla quantidade de itens por página');
assert(paginationContent.includes('rj-pagination-nav'), 'Gera container de navegação de páginas');
assert(paginationContent.includes('window.RJ_CatalogPagination'), 'Expõe API global para integração com a busca');

console.log('');

// 4. Verificação de Regras de Alinhamento de Cards (css/custom.css)
console.log('--- Verificando Regras de Alinhamento em css/custom.css ---');
const cssPath = path.join(ROOT_DIR, 'css', 'custom.css');
assert(fs.existsSync(cssPath), 'css/custom.css existe');
const cssContent = fs.readFileSync(cssPath, 'utf8');

assert(cssContent.includes('.product-card-thumbnail'), 'css/custom.css possui regra para .product-card-thumbnail');
assert(cssContent.includes('height: 220px !important'), 'Thumbnail possui altura uniforme de 220px');
assert(cssContent.includes('.product-card-title'), 'css/custom.css possui regra para .product-card-title');
assert(cssContent.includes('height: 62px !important'), 'Título possui altura fixa para 3 linhas (62px) evitando corte horizontal de palavras');
assert(cssContent.includes('.product-card-information-add') && cssContent.includes('position: static !important'), 'Badge de Pronta Entrega usa position: static para manter o fluxo no corpo do card');
assert(cssContent.includes('.foot-card'), 'css/custom.css possui regra para .foot-card');
assert(cssContent.includes('margin-top: auto !important'), 'Rodapé do card usa margin-top: auto para alinhamento horizontal perfeito');
assert(cssContent.includes('#rj-select-per-page'), 'css/custom.css estiliza o seletor de limite de itens por página');
assert(cssContent.includes('max-width: 100% !important') && cssContent.includes('min-width: 0 !important'), 'css/custom.css garante que cards ocupem 100% da largura de cada coluna no grid');
assert(cssContent.includes('[data-theme="dark"] .storefront-cards.product-card'), 'css/custom.css possui regras de Dark Mode para os cards');
assert(cssContent.includes('[data-theme="dark"] .product-card-thumbnail'), 'css/custom.css possui regras de Dark Mode para os thumbnails de imagem');
assert(cssContent.includes('.storefront-cards.product-card.page-hidden') && cssContent.includes('display: none !important'), 'css/custom.css possui regra de .page-hidden com display: none !important');
assert(cssContent.includes('.storefront-cards.product-card.search-hidden') && cssContent.includes('display: none !important'), 'css/custom.css possui regra de .search-hidden com display: none !important');

console.log('\n===============================================================');
if (totalFailures === 0) {
    console.log('  TODOS OS TESTES PASSARAM COM SUCESSO! (0 falhas)');
    console.log('===============================================================');
    process.exit(0);
} else {
    console.error(`  ATENÇÃO: ${totalFailures} TESTES FALHARAM!`);
    console.log('===============================================================');
    process.exit(1);
}
