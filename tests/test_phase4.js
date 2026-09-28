/**
 * Suíte de Testes Automatizados — Fase 4: Higienização de Dados e index.html
 * Executado via Node.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("==========================================================");
console.log(" INICIANDO TESTES AUTOMATIZADOS — FASE 4: INDEX.HTML     ");
console.log("==========================================================");

const indexPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'index.html');
const originalPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'site-catalogos-original.html');

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

// 1. Verificação de Arquivo
runTest("Arquivo index.html existe e possui conteúdo válido", () => {
    assert.ok(fs.existsSync(indexPath), "index.html não foi encontrado");
    const stats = fs.statSync(indexPath);
    assert.ok(stats.size > 500000, `Tamanho inesperado do index.html: ${stats.size} bytes`);
});

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const originalHtml = fs.readFileSync(originalPath, 'utf8');

// 2. Supressão Rígida de Valores Monetários (Regra Pétrea)
runTest("Zero ocorrências de 'R$' em todo o documento index.html", () => {
    const rDollarMatches = indexHtml.match(/R\$\s*[\d\.\,]+/g) || [];
    assert.strictEqual(rDollarMatches.length, 0, `Encontradas ocorrências de R$: ${JSON.stringify(rDollarMatches)}`);
});

runTest("Zero elementos com data-element='sale-price'", () => {
    const salePriceMatches = indexHtml.match(/data-element="sale-price"/g) || [];
    assert.strictEqual(salePriceMatches.length, 0);
});

runTest("Zero elementos com class='installment-plan' ou 'cdm-pix'", () => {
    assert.ok(!indexHtml.includes('class="installment-plan"'), "Ainda contém class='installment-plan'");
    assert.ok(!indexHtml.includes('class="cdm-pix"'), "Ainda contém class='cdm-pix'");
});

// 3. Supressão de Filtros Financeiros na Sidebar e Ordenação
runTest("Filtro de preço na barra lateral (sidebar-filter-block filter--price) foi removido", () => {
    assert.ok(!indexHtml.includes('class="sidebar-filter-block filter--price"'), "Filtro de preço ainda existe na barra lateral");
    assert.ok(!indexHtml.includes('id="f-filter-price"'), "Formulário de filtro de preço ainda existe");
    assert.ok(!indexHtml.includes('id="slider-range"'), "Slider de preço ainda existe");
});

runTest("Opções financeiras de ordenação (menor/maior preço, maior desconto) removidas do select", () => {
    assert.ok(!indexHtml.includes('value="pricelow"'), "Opção Menor Preço ainda presente");
    assert.ok(!indexHtml.includes('value="pricemax"'), "Opção Maior Preço ainda presente");
    assert.ok(!indexHtml.includes('value="maxdiscount"'), "Opção Maior Desconto ainda presente");
});

// 4. Integração do Botão CTA WhatsApp em Todos os Cards
runTest("Todos os 36 cards de produto na collection-grid possuem botão CTA do WhatsApp", () => {
    const gridStart = indexHtml.indexOf('class="collection-grid mode-grid flex"');
    const gridEnd = indexHtml.indexOf('class="pagination', gridStart);
    const gridHtml = indexHtml.substring(gridStart, gridEnd !== -1 ? gridEnd : indexHtml.length);
    
    const ctaMatches = gridHtml.match(/class="[^"]*btn-whatsapp-cta[^"]*"/g) || [];
    assert.strictEqual(ctaMatches.length, 36, `Esperados 36 botões CTA nos cards, encontrados ${ctaMatches.length}`);
});

runTest("Todos os 36 botões CTA dos produtos possuem atributo data-product-name preenchido", () => {
    const gridStart = indexHtml.indexOf('class="collection-grid mode-grid flex"');
    const gridEnd = indexHtml.indexOf('class="pagination', gridStart);
    const gridHtml = indexHtml.substring(gridStart, gridEnd !== -1 ? gridEnd : indexHtml.length);

    const dataNameMatches = gridHtml.match(/class="[^"]*btn-whatsapp-cta[^"]*"[^>]*data-product-name="([^"]+)"/g) || [];
    assert.strictEqual(dataNameMatches.length, 36, `Esperados 36 atributos data-product-name nos cards, encontrados ${dataNameMatches.length}`);
});

// 5. Preservação Fiel dos Nomes Originais dos Produtos (Cláusula Pétrea)
runTest("Preservação integral dos nomes dos 36 produtos originais", () => {
    function extractProductTitles(content) {
        const list = [];
        const regex = /class="[^"]*product-card-title[^"]*"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/g;
        let m;
        while ((m = regex.exec(content)) !== null) {
            const normalized = m[1].replace(/\s+/g, ' ').trim();
            list.push(normalized);
        }
        return list;
    }

    const origNames = extractProductTitles(originalHtml);
    const indexNames = extractProductTitles(indexHtml);

    assert.strictEqual(origNames.length, 36, `Original deveria ter 36 nomes, encontrados ${origNames.length}`);
    assert.strictEqual(indexNames.length, 36, `Index deveria ter 36 nomes, encontrados ${indexNames.length}`);

    for (let i = 0; i < origNames.length; i++) {
        assert.strictEqual(indexNames[i], origNames[i], `Nome do produto ${i+1} diverge: original="${origNames[i]}" vs index="${indexNames[i]}"`);
    }
});

// 6. Remoção de Trackers Externos
runTest("Remoção completa dos scripts de rastreamento Matomo (iset.io)", () => {
    assert.ok(!indexHtml.includes('analytics.iset.io/matomo.js'), "Script matomo.js ainda referenciado");
    assert.ok(!indexHtml.includes('_paq.push'), "Código de tracking _paq ainda presente");
});

// 7. Vinculação dos Novos Assets (Tokens, Custom CSS e JS WhatsApp)
runTest("Vínculo dos arquivos css/tokens.css, css/custom.css e js/whatsapp-cta.js", () => {
    assert.ok(indexHtml.includes('href="css/tokens.css"'), "css/tokens.css não está linkado");
    assert.ok(indexHtml.includes('href="css/custom.css"'), "css/custom.css não está linkado");
    assert.ok(indexHtml.includes('src="js/whatsapp-cta.js"'), "js/whatsapp-cta.js não está linkado");
});

console.log("==========================================================");
console.log(` RESULTADO: Total: ${passed + failed} | Aprovados: ${passed} | Falhas: ${failed}`);
console.log("==========================================================");

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
