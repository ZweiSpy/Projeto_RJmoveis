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

// 2. Exibição Oficial de Valores Monetários nos 12 Cards da Vitrine
runTest("Exibição de 12 blocos de preço oficial (R$, 10x sem juros e PIX) no index.html", () => {
    const priceBlocks = indexHtml.match(/class="product-card-price"/g) || [];
    assert.strictEqual(priceBlocks.length, 12, `Esperados 12 blocos de preço, encontrados ${priceBlocks.length}`);
    const rDollarMatches = indexHtml.match(/R\$\s*[\d\.\,]+/g) || [];
    assert.ok(rDollarMatches.length >= 36, `Esperadas ao menos 36 ocorrências de R$ nos 12 cards, encontradas ${rDollarMatches.length}`);
});

runTest("12 elementos com data-element='sale-price'", () => {
    const salePriceMatches = indexHtml.match(/data-element="sale-price"/g) || [];
    assert.strictEqual(salePriceMatches.length, 12);
});

runTest("12 elementos com class='installment-plan' e 'cdm-pix'", () => {
    const instMatches = indexHtml.match(/class="installment-plan"/g) || [];
    const pixMatches = indexHtml.match(/class="cdm-pix"/g) || [];
    assert.strictEqual(instMatches.length, 12, `Esperados 12 installment-plan, encontrados ${instMatches.length}`);
    assert.strictEqual(pixMatches.length, 12, `Esperados 12 cdm-pix, encontrados ${pixMatches.length}`);
});

// 3. Slider Lateral Suprimido e Ordenação Completa Ativa
runTest("Filtro de preço na barra lateral (sidebar-filter-block filter--price) foi removido", () => {
    assert.ok(!indexHtml.includes('class="sidebar-filter-block filter--price"'), "Filtro de preço ainda existe na barra lateral");
    assert.ok(!indexHtml.includes('id="f-filter-price"'), "Formulário de filtro de preço ainda existe");
    assert.ok(!indexHtml.includes('id="slider-range"'), "Slider de preço ainda existe");
});

runTest("Opções de ordenação por preço (Menor/Maior preço) presentes e maxdiscount removido", () => {
    assert.ok(indexHtml.includes('value="pricelow"'), "Opção Menor Preço ausente");
    assert.ok(indexHtml.includes('value="pricemax"'), "Opção Maior Preço ausente");
    assert.ok(!indexHtml.includes('value="maxdiscount"'), "Opção Maior Desconto ainda presente");
});

// 4. Integração do Botão CTA WhatsApp em Todos os Cards
runTest("Todos os 12 cards da vitrine possuem botão CTA do WhatsApp", () => {
    const gridStart = indexHtml.indexOf('id="rj-products-grid"');
    const gridEnd = indexHtml.indexOf('<!-- Fim do Grid de Produtos -->', gridStart);
    const gridHtml = indexHtml.substring(gridStart, gridEnd !== -1 ? gridEnd : indexHtml.length);
    
    const ctaMatches = gridHtml.match(/class="[^"]*btn-whatsapp-cta[^"]*"/g) || [];
    assert.strictEqual(ctaMatches.length, 12, `Esperados 12 botões CTA nos cards, encontrados ${ctaMatches.length}`);
});

runTest("Todos os 12 botões CTA dos produtos possuem atributo data-product-name preenchido", () => {
    const gridStart = indexHtml.indexOf('id="rj-products-grid"');
    const gridEnd = indexHtml.indexOf('<!-- Fim do Grid de Produtos -->', gridStart);
    const gridHtml = indexHtml.substring(gridStart, gridEnd !== -1 ? gridEnd : indexHtml.length);

    const dataNameMatches = gridHtml.match(/class="[^"]*btn-whatsapp-cta[^"]*"[^>]*data-product-name="([^"]+)"/g) || [];
    assert.strictEqual(dataNameMatches.length, 12, `Esperados 12 atributos data-product-name nos cards, encontrados ${dataNameMatches.length}`);
});

// 5. Preservação Fiel dos Nomes Originais dos Produtos (Cláusula Pétrea)
runTest("Preservação integral dos nomes dos 12 produtos da vitrine inicial", () => {
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

    const origNames = extractProductTitles(originalHtml).slice(0, 12);
    const indexNames = extractProductTitles(indexHtml);

    assert.strictEqual(origNames.length, 12, `Deveria ter 12 nomes de referência, encontrados ${origNames.length}`);
    assert.strictEqual(indexNames.length, 12, `Index deveria ter 12 nomes, encontrados ${indexNames.length}`);

    for (let i = 0; i < origNames.length; i++) {
        assert.strictEqual(indexNames[i], origNames[i], `Nome do produto ${i+1} diverge: original="${origNames[i]}" vs index="${indexNames[i]}"`);
    }
});

// 6. Remoção de Trackers Externos
runTest("Remoção completa dos scripts de rastreamento Matomo (iset.io)", () => {
    assert.ok(!indexHtml.includes('analytics.iset.io/matomo.js'), "Script matomo.js ainda referenciado");
    assert.ok(!indexHtml.includes('_paq.push'), "Código de tracking _paq ainda presente");
});

// 7. Vinculação dos Novos Assets (Tokens, Custom CSS e JS Modal/Sort)
runTest("Vínculo dos arquivos css/tokens.css, css/custom.css, js/product-modal.js e js/catalog-sort.js", () => {
    assert.ok(indexHtml.includes('href="css/tokens.css'), "css/tokens.css não está linkado");
    assert.ok(indexHtml.includes('href="css/custom.css'), "css/custom.css não está linkado");
    assert.ok(indexHtml.includes('src="js/product-modal.js'), "js/product-modal.js não está linkado");
    assert.ok(indexHtml.includes('src="js/catalog-sort.js'), "js/catalog-sort.js não está linkado");
});

console.log("==========================================================");
console.log(` RESULTADO: Total: ${passed + failed} | Aprovados: ${passed} | Falhas: ${failed}`);
console.log("==========================================================");

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
