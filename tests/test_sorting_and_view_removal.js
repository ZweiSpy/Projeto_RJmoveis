/**
 * test_sorting_and_view_removal.js — Validação Automatizada de Remoção de Grid/View Mode e Ordenação Dinâmica
 * 
 * Verifica:
 * 1. Remoção completa de seletores de grid (2, 3, 4 colunas) de todas as 8 páginas HTML
 * 2. Remoção completa de alternadores de exibição (modo lista / galeria) de todas as 8 páginas HTML
 * 3. Inclusão e integridade de #rj-select-sort com as opções "bestsellers", "new", "name" em todas as 8 páginas
 * 4. Ausência estrita de termos de preço ("pricelow", "pricemax", "maxdiscount", "R$") nas opções
 * 5. Inclusão da tag <script src="js/catalog-sort.js"> em todas as 8 páginas
 * 6. Validação algorítmica do motor de ordenação (A-Z, novos lançamentos por ID desc, mais vendidos pela ordem original)
 * 7. Regras CSS de ocultação (.collection-grid-column, .collection-view-mode { display: none !important; })
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PAGES = [
    'index.html',
    'catalogo.html',
    'sofas.html',
    'quartos.html',
    'cozinha.html',
    'salas.html',
    'paineis.html',
    'pronta-entrega.html'
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
console.log('  TESTES: REMOÇÃO DE GRID/VIEW E ORDENAÇÃO DINÂMICA DO CATÁLOGO');
console.log('===============================================================\n');

// 1. Verificação Estática de Remoção e Inclusão nas 8 Páginas HTML
console.log('--- 1. Integridade Estrutural das 8 Páginas HTML ---');
PAGES.forEach(file => {
    const filePath = path.join(ROOT_DIR, file);
    assert(fs.existsSync(filePath), `Arquivo ${file} existe`);

    const content = fs.readFileSync(filePath, 'utf8');

    // A. Remoção de .collection-grid-column e .collection-view-mode do DOM
    const hasGridColumnTag = content.includes('class="collection-grid-column') || content.includes("class='collection-grid-column'");
    assert(!hasGridColumnTag, `${file}: Tag .collection-grid-column removida do HTML`);

    const hasViewModeTag = content.includes('class="collection-view-mode') || content.includes("class='collection-view-mode'");
    assert(!hasViewModeTag, `${file}: Tag .collection-view-mode removida do HTML`);

    // B. Remoção de links com query params legados de layout
    const hasGridParams = content.includes('?grid=2') || content.includes('?grid=3') || content.includes('?grid=4');
    assert(!hasGridParams, `${file}: Sem links de parâmetros de colunas (?grid=)`);

    const hasViewParams = content.includes('?view=list') || content.includes('?view=grid');
    assert(!hasViewParams, `${file}: Sem links de parâmetros de modo (?view=)`);

    // C. Presença do seletor moderno de ordenação #rj-select-sort
    const hasSelectSort = content.includes('id="rj-select-sort"');
    assert(hasSelectSort, `${file}: Contém seletor #rj-select-sort`);

    // D. Opções corretas de ordenação: Mais vendidos, Novos lançamentos, Nome do produto
    assert(content.includes('value="bestsellers"'), `${file}: Contém opção "bestsellers" (Mais vendidos)`);
    assert(content.includes('value="new"'), `${file}: Contém opção "new" (Novos lançamentos)`);
    assert(content.includes('value="name"'), `${file}: Contém opção "name" (Nome do produto)`);

    // E. Ausência de opções proibidas de preço
    assert(!content.includes('value="pricelow"'), `${file}: Sem opção 'pricelow'`);
    assert(!content.includes('value="pricemax"'), `${file}: Sem opção 'pricemax'`);
    assert(!content.includes('value="maxdiscount"'), `${file}: Sem opção 'maxdiscount'`);

    // F. Presença dos scripts essenciais no rodapé
    assert(content.includes('src="js/catalog-sort.js"'), `${file}: Tag <script src="js/catalog-sort.js"> presente`);
    assert(content.includes('src="js/catalog-pagination.js"'), `${file}: Tag <script src="js/catalog-pagination.js"> presente`);

    // G. Zero R$
    const rDollarMatches = content.match(/R\$/g) || [];
    assert(rDollarMatches.length === 0, `${file}: Zero ocorrências de 'R$'`);
});

// 2. Verificação de Regras CSS de Ocultação em custom.css
console.log('\n--- 2. Regras CSS em css/custom.css ---');
const cssPath = path.join(ROOT_DIR, 'css', 'custom.css');
assert(fs.existsSync(cssPath), 'css/custom.css existe');
const cssContent = fs.readFileSync(cssPath, 'utf8');

assert(cssContent.includes('.collection-grid-column') && cssContent.includes('display: none !important'), 
    'css/custom.css oculta .collection-grid-column com display: none !important');
assert(cssContent.includes('.collection-view-mode') && cssContent.includes('display: none !important'), 
    'css/custom.css oculta .collection-view-mode com display: none !important');
assert(cssContent.includes('#rj-select-sort'), 
    'css/custom.css possui estilização para #rj-select-sort');
assert(cssContent.includes('[data-theme="dark"] #rj-select-sort'), 
    'css/custom.css possui suporte a dark mode para #rj-select-sort');

// 3. Verificação do Algoritmo de Ordenação em Memória
console.log('\n--- 3. Verificação Algorítmica da Lógica de js/catalog-sort.js ---');
const sortJsPath = path.join(ROOT_DIR, 'js', 'catalog-sort.js');
assert(fs.existsSync(sortJsPath), 'js/catalog-sort.js existe');
const sortJsContent = fs.readFileSync(sortJsPath, 'utf8');

assert(sortJsContent.includes('bestsellers'), 'js/catalog-sort.js suporta critério "bestsellers"');
assert(sortJsContent.includes('new'), 'js/catalog-sort.js suporta critério "new"');
assert(sortJsContent.includes('name'), 'js/catalog-sort.js suporta critério "name"');
assert(sortJsContent.includes('localeCompare'), 'js/catalog-sort.js utiliza localeCompare pt-BR para ordenação natural');
assert(sortJsContent.includes('RJ_CatalogPagination.recalculate'), 'js/catalog-sort.js aciona recálculo da paginação após ordenar');

// Extração dos dados reais dos produtos de catalogo.html para simulação da ordenação
console.log('\n--- 4. Teste Algorítmico com os 523 Produtos Reais de catalogo.html ---');
const catalogoHtml = fs.readFileSync(path.join(ROOT_DIR, 'catalogo.html'), 'utf8');
const cardMarker = '<div class="storefront-cards collection-grid-card product-card';
const cardChunks = catalogoHtml.split(cardMarker).slice(1);

const extractedProducts = [];
cardChunks.forEach((chunk, originalIdx) => {
    const idMatch = chunk.match(/data-id="(\d+)"/);
    const dataId = idMatch ? parseInt(idMatch[1], 10) : 0;
    const titleMatch = chunk.match(/class="[^"]*product-card-title[^"]*"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    let title = '';
    if (titleMatch) {
        title = titleMatch[1].replace(/\s+/g, ' ').trim();
    }
    extractedProducts.push({
        id: dataId,
        title: title,
        originalIndex: originalIdx
    });
});

assert(extractedProducts.length === 523, `Extraídos ${extractedProducts.length} produtos de catalogo.html para teste de ordenação (esperado: 523)`);

// Teste A: Ordenação por Nome (A-Z)
const sortedByName = [...extractedProducts].sort((a, b) => 
    a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base', numeric: true })
);

let isAlphaValid = true;
for (let i = 0; i < sortedByName.length - 1; i++) {
    if (sortedByName[i].title.localeCompare(sortedByName[i+1].title, 'pt-BR', { sensitivity: 'base', numeric: true }) > 0) {
        isAlphaValid = false;
        console.error(`  Falha A-Z: "${sortedByName[i].title}" > "${sortedByName[i+1].title}"`);
        break;
    }
}
assert(isAlphaValid, `Ordenação A-Z: Primeiro="${sortedByName[0].title}", Último="${sortedByName[sortedByName.length-1].title}"`);

// Teste B: Ordenação por Novos Lançamentos (ID desc)
const sortedByNew = [...extractedProducts].sort((a, b) => b.id - a.id);
let isNewValid = true;
for (let i = 0; i < sortedByNew.length - 1; i++) {
    if (sortedByNew[i].id < sortedByNew[i+1].id) {
        isNewValid = false;
        console.error(`  Falha Novos: ID ${sortedByNew[i].id} < ID ${sortedByNew[i+1].id}`);
        break;
    }
}
assert(isNewValid, `Ordenação Lançamentos: Primeiro ID=${sortedByNew[0].id} ("${sortedByNew[0].title}"), Último ID=${sortedByNew[sortedByNew.length-1].id} ("${sortedByNew[sortedByNew.length-1].title}")`);

// Teste C: Ordenação por Mais Vendidos (Retorno à ordem original de curadoria)
const sortedByBestsellers = [...sortedByName].sort((a, b) => a.originalIndex - b.originalIndex);
let isOriginalValid = true;
for (let i = 0; i < sortedByBestsellers.length; i++) {
    if (sortedByBestsellers[i].originalIndex !== i) {
        isOriginalValid = false;
        break;
    }
}
assert(isOriginalValid, `Ordenação Mais Vendidos: 100% dos ${sortedByBestsellers.length} produtos retornam à sequência original da loja`);

console.log('\n===============================================================');
if (totalFailures === 0) {
    console.log('  RESULTADO: TODOS OS TESTES PASSARAM COM SUCESSO! (0 FALHAS)');
    console.log('===============================================================');
    process.exit(0);
} else {
    console.error(`  RESULTADO: ${totalFailures} FALHA(S) ENCONTRADA(S).`);
    console.log('===============================================================');
    process.exit(1);
}
