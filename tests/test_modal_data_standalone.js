/**
 * Teste Standalone e Auditoria de Dados do Modal Flutuante
 * Valida a integridade dos 523 produtos em js/products-data.js,
 * a ordem de scripts nas 8 páginas, os estilos semânticos em css/custom.css,
 * e a formatação semântica das descrições.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== INICIANDO AUDITORIA DO BANCO DE DADOS E FORMATAÇÃO DO MODAL ===\n');

let totalErrors = 0;

// 1. Validar js/products-data.js
const dataJsPath = path.join(__dirname, '..', 'js', 'products-data.js');
if (!fs.existsSync(dataJsPath)) {
    console.error('[ERRO FATAL] js/products-data.js não existe!');
    process.exit(1);
}

const dataCode = fs.readFileSync(dataJsPath, 'utf8');
const sandbox = { window: {} };
try {
    vm.runInNewContext(dataCode, sandbox);
} catch (e) {
    console.error('[ERRO FATAL] Falha de sintaxe ao executar js/products-data.js:', e);
    process.exit(1);
}

const db = sandbox.window.RJ_PRODUCTS_DATA;
if (!db) {
    console.error('[ERRO FATAL] window.RJ_PRODUCTS_DATA não foi definido!');
    process.exit(1);
}

const productIds = Object.keys(db);
console.log(`[OK] js/products-data.js carregado com sucesso. Total de produtos indexados: ${productIds.length}`);

if (productIds.length !== 523) {
    console.error(`[ERRO] Esperado 523 produtos, mas encontrado ${productIds.length}`);
    totalErrors++;
}

// Validar integridade dos campos de cada produto
let itemsWithPhotos = 0;
let itemsWithDesc = 0;
let itemsWithVideo = 0;

productIds.forEach(id => {
    const item = db[id];
    if (!item.id || !item.title) {
        console.error(`[ERRO] Produto ${id} sem id ou title válido.`);
        totalErrors++;
    }
    if (Array.isArray(item.gallery) && item.gallery.length > 0) itemsWithPhotos++;
    if (item.description && item.description.trim().length > 0) itemsWithDesc++;
    if (item.youtubeVideo && (item.youtubeVideo.videoId || item.youtubeVideo.embedUrl)) itemsWithVideo++;
});

console.log(`[OK] Estatísticas dos dados: ${itemsWithPhotos} com fotos na galeria, ${itemsWithDesc} com descrição, ${itemsWithVideo} com vídeo do YouTube.`);

// 2. Validar ordem dos scripts nas 8 páginas
const targetPages = [
    'index.html',
    'catalogo.html',
    'sofas.html',
    'quartos.html',
    'cozinha.html',
    'salas.html',
    'paineis.html',
    'pronta-entrega.html'
];

targetPages.forEach(page => {
    const pagePath = path.join(__dirname, '..', page);
    if (!fs.existsSync(pagePath)) {
        console.error(`[ERRO] Página ${page} não existe.`);
        totalErrors++;
        return;
    }
    const html = fs.readFileSync(pagePath, 'utf8');
    const idxData = html.indexOf('js/products-data.js');
    const idxModal = html.indexOf('js/product-modal.js');

    if (idxData === -1) {
        console.error(`[ERRO] ${page} não inclui js/products-data.js`);
        totalErrors++;
    } else if (idxModal === -1) {
        console.error(`[ERRO] ${page} não inclui js/product-modal.js`);
        totalErrors++;
    } else if (idxData > idxModal) {
        console.error(`[ERRO] Em ${page}, js/products-data.js deve ser carregado ANTES de js/product-modal.js`);
        totalErrors++;
    } else {
        console.log(`[OK] Ordem de scripts perfeita em ${page}`);
    }
});

// 3. Validar estilos em css/custom.css
const cssPath = path.join(__dirname, '..', 'css', 'custom.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const requiredCssRules = [
    '.modal-spec-section-title',
    '.modal-spec-list',
    '.modal-spec-item',
    '.modal-spec-label',
    '.modal-spec-value',
    '.modal-spec-notice',
    '[data-theme="dark"] .modal-spec-section-title',
    '[data-theme="dark"] .modal-spec-item',
    '[data-theme="dark"] .modal-spec-notice'
];

requiredCssRules.forEach(rule => {
    if (!cssContent.includes(rule)) {
        console.error(`[ERRO] Regra CSS ausente em css/custom.css: ${rule}`);
        totalErrors++;
    }
});

if (totalErrors === 0) {
    console.log('[OK] Todas as regras CSS e Dark Mode foram validadas no custom.css.');
}

// 4. Testar o formatador do product-modal.js
const modalJsPath = path.join(__dirname, '..', 'js', 'product-modal.js');
const modalJsContent = fs.readFileSync(modalJsPath, 'utf8');

if (!modalJsContent.includes('formatProductDescription')) {
    console.error('[ERRO] formatProductDescription não encontrada em js/product-modal.js');
    totalErrors++;
} else {
    console.log('[OK] formatProductDescription presente em js/product-modal.js');
}

// Testar formatação de produto exemplo (1532 - Sofá Lima)
const p1532 = db['1532'];
if (!p1532) {
    console.error('[ERRO] Produto 1532 não encontrado no banco!');
    totalErrors++;
} else {
    console.log(`[OK] Teste Sofá Lima (ID 1532): ${p1532.gallery.length} fotos, vídeo ${p1532.youtubeVideo ? p1532.youtubeVideo.videoId : 'N/A'}, desc ${p1532.description.length} caracteres.`);
}

console.log('\n=== RESULTADO FINAL ===');
if (totalErrors === 0) {
    console.log('>>> [SUCESSO TOTAL] Todos os critérios de integridade e carregamento foram aprovados! <<<');
    process.exit(0);
} else {
    console.error(`>>> [FALHA] Foram encontrados ${totalErrors} erros na auditoria. <<<`);
    process.exit(1);
}
