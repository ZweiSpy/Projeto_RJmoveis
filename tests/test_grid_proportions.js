/**
 * Suíte de Testes Automatizados — Validação de Proporções do Grid e Componentes
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("==========================================================");
console.log(" VALIDAÇÃO DE PROPORÇÕES DO GRID, CARDS E IMAGENS         ");
console.log("==========================================================");

const indexPath = path.join(__dirname, '..', 'index.html');
const customCssPath = path.join(__dirname, '..', 'css', 'custom.css');

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const customCss = fs.readFileSync(customCssPath, 'utf8');

let passed = 0;
let failed = 0;

function runTest(name, fn) {
    try {
        fn();
        console.log(`  \x1b[32m[PASS]\x1b[0m ${name}`);
        passed++;
    } catch (err) {
        console.error(`  \x1b[31m[FAIL]\x1b[0m ${name}: ${err.message}`);
        failed++;
    }
}

// 1. Grid não está forçado como CSS Grid com colunas microscópicas
runTest("1. Grid utiliza Flexbox responsivo preservando o sistema original", () => {
    assert.ok(customCss.includes('.collection-grid.mode-grid {'), "Regra .collection-grid.mode-grid não encontrada");
    assert.ok(customCss.includes('display: flex !important;'), "Display flex não declarado para .collection-grid.mode-grid");
    assert.ok(!customCss.includes('grid-template-columns: repeat(4, minmax(0, 1fr)) !important;'), "grid-template-columns ainda presente forçando conflito");
});

// 2. Proporção do Card: 4 colunas em desktop
runTest("2. Largura e flex dos cards são definidos como calc(25% - var(--grid-gap))", () => {
    assert.ok(customCss.includes('flex: 0 0 calc(25% - var(--grid-gap)) !important;'), "Regra de flex 25% para 4 colunas ausente");
    assert.ok(customCss.includes('max-width: calc(25% - var(--grid-gap)) !important;'), "Regra de max-width 25% para 4 colunas ausente");
});

// 3. Imagens proporcionais e sem distorção
runTest("3. Thumbnails com altura controlada e imagens com object-fit contain", () => {
    assert.ok(customCss.includes('.product-card-thumbnail {'), "Estilo .product-card-thumbnail ausente");
    assert.ok(customCss.includes('object-fit: contain !important;'), "object-fit contain ausente nas imagens");
    assert.ok(customCss.includes('height: 240px !important;'), "Altura do thumbnail ausente");
});

// 4. Botão Topbar não estica a 100%
runTest("4. Botão WhatsApp na Topbar possui largura automática (não estica)", () => {
    assert.ok(customCss.includes('.rj-topbar .btn-whatsapp-cta {'), "Regra .rj-topbar .btn-whatsapp-cta ausente");
    assert.ok(customCss.includes('width: auto !important;'), "width: auto não definido para o botão da topbar");
});

// 5. Sidebar possui categorias e consultoria
runTest("5. Sidebar preenchida com Categorias e Atendimento em vez de caixa vazia", () => {
    assert.ok(indexHtml.includes('filter--categories'), "Bloco filter--categories ausente na sidebar");
    assert.ok(indexHtml.includes('filter--consultor'), "Bloco filter--consultor ausente na sidebar");
    assert.ok(indexHtml.includes('Estofados &amp; Sofás') || indexHtml.includes('Estofados & Sofás'), "Categoria Estofados ausente na sidebar");
});

// 6. Texto do botão WhatsApp não quebra em linhas separadas
runTest("6. Botão CTA possui white-space: nowrap para evitar quebra de texto", () => {
    assert.ok(customCss.includes('white-space: nowrap !important;'), "white-space: nowrap ausente");
});

console.log("==========================================================");
console.log(` RESULTADO: Total: ${passed + failed} | Aprovados: ${passed} | Falhas: ${failed}`);
console.log("==========================================================");

if (failed > 0) process.exit(1);
