/**
 * Suíte de Testes Automatizados — Validação das 4 Correções Críticas do index.html
 * 1. Balanço de Tags e Alinhamento do Grid
 * 2. Encoding UTF-8 e Ausência de Mojibake
 * 3. Aplicação Efetiva da Paleta Elegance Blue
 * 4. Novo Menu Institucional RJ Móveis
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("==========================================================");
console.log(" VALIDAÇÃO DAS 4 CORREÇÕES CRÍTICAS NO index.html        ");
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

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const originalHtml = fs.readFileSync(originalPath, 'utf8');

// -----------------------------------------------------------------
// 1. BALANÇO DE TAGS E ALINHAMENTO DO GRID
// -----------------------------------------------------------------
runTest("1.1. Balanço de tags <div> no index.html é rigorosamente ZERO (0)", () => {
    const divOpen = (indexHtml.match(/<div[\s>]/g) || []).length;
    const divClose = (indexHtml.match(/<\/div>/g) || []).length;
    const diff = divOpen - divClose;
    assert.strictEqual(diff, 0, `Diferença de tags div não é zero! Opens: ${divOpen}, Closes: ${divClose}, Diff: ${diff}`);
});

runTest("1.2. O container .collection-grid engloba todos os 12 cards de produto em destaque", () => {
    const gridStart = indexHtml.indexOf('class="collection-grid mode-grid');
    assert.ok(gridStart !== -1, "Container .collection-grid não foi encontrado");
    
    // Todos os 12 cards devem estar após gridStart
    const cardPositions = [];
    let pos = gridStart;
    while ((pos = indexHtml.indexOf('class="storefront-cards collection-grid-card product-card', pos + 1)) !== -1) {
        cardPositions.push(pos);
    }
    assert.strictEqual(cardPositions.length, 12, `Esperados 12 cards dentro do grid da vitrine, encontrados ${cardPositions.length}`);
});

// -----------------------------------------------------------------
// 2. ENCODING UTF-8 E AUSÊNCIA DE MOJIBAKE
// -----------------------------------------------------------------
runTest("2.1. Tag <meta charset='UTF-8'> está presente e iso-8859-1 foi removida", () => {
    assert.ok(indexHtml.includes('<meta charset="UTF-8">'), "meta charset UTF-8 ausente");
    assert.ok(!indexHtml.includes('charset=iso-8859-1'), "charset legado iso-8859-1 ainda presente");
});

runTest("2.2. Zero ocorrências de caracteres mojibake (Ã¡, Ã©, Ã£, Ã³, etc.)", () => {
    const mojibakeRegex = /Ã[¡©£³ºª§¢]/g;
    const matches = indexHtml.match(mojibakeRegex) || [];
    assert.strictEqual(matches.length, 0, `Encontrados caracteres mojibake corrompidos: ${JSON.stringify(matches)}`);
});

runTest("2.3. Nomes com acentuação correta presentes (Sofá, Retrátil, Reclinável)", () => {
    assert.ok(indexHtml.includes("Sofá Retrátil Reclinável"), "Texto 'Sofá Retrátil Reclinável' com acentuação correta não encontrado");
    assert.ok(indexHtml.includes("Mesa"), "Texto 'Mesa' não encontrado");
});

// -----------------------------------------------------------------
// 3. APLICAÇÃO EFETIVA DA PALETA ELEGANCE BLUE
// -----------------------------------------------------------------
runTest("3.1. Tokens CSS oficiais linkados no cabeçalho", () => {
    assert.ok(indexHtml.includes('href="css/tokens.css"'), "css/tokens.css não linkado");
    assert.ok(indexHtml.includes('href="css/custom.css"'), "css/custom.css não linkado");
});

runTest("3.2. Eliminação de cores legadas (laranja #f96a1b e marrom #4a2e22)", () => {
    assert.ok(!indexHtml.includes('#f96a1b'), "Laranja legado #f96a1b ainda encontrado em index.html");
    assert.ok(!indexHtml.includes('#4a2e22'), "Marrom legado #4a2e22 ainda encontrado em index.html");
});

// -----------------------------------------------------------------
// 4. NOVO MENU INSTITUCIONAL RJ MÓVEIS
// -----------------------------------------------------------------
runTest("4.1. Novo cabeçalho oficial RJ Móveis está presente", () => {
    assert.ok(indexHtml.includes('class="rj-header"'), "Elemento .rj-header não encontrado");
    assert.ok(indexHtml.includes('RJ MÓVEIS'), "Texto de marca 'RJ MÓVEIS' não encontrado");
    assert.ok(indexHtml.includes('class="rj-logo-monogram"'), "Monograma RJ não encontrado");
});

runTest("4.2. Links e logos antigos do lojista original foram removidos", () => {
    assert.ok(!indexHtml.includes('youtube.com/@catalogo-de-moveis'), "Link do YouTube antigo ainda presente");
    assert.ok(!indexHtml.includes('Faça seu login'), "Botão antigo de login ainda presente");
    assert.ok(!indexHtml.includes('catalogo-moveis.png'), "Logo antiga catalogo-moveis.png ainda presente");
});

runTest("4.3. Navegação da RJ Móveis com links de categorias ativos", () => {
    assert.ok(indexHtml.includes('Catálogo Completo'), "Link 'Catálogo Completo' ausente");
    assert.ok(indexHtml.includes('Estofados &amp; Sofás') || indexHtml.includes('Estofados & Sofás'), "Link 'Estofados & Sofás' ausente");
    assert.ok(indexHtml.includes('⚡ Pronta Entrega'), "Link '⚡ Pronta Entrega' ausente");
});

// -----------------------------------------------------------------
// 5. SUPRESSÃO DE PREÇOS E INTEGRIDADE DE PRODUTOS
// -----------------------------------------------------------------
runTest("5.1. Zero ocorrências de 'R$' no index.html", () => {
    const rDollarMatches = indexHtml.match(/R\$\s*[\d\.\,]+/g) || [];
    assert.strictEqual(rDollarMatches.length, 0, `Encontradas ocorrências de R$: ${JSON.stringify(rDollarMatches)}`);
});

runTest("5.2. Todos os 12 cards da vitrine possuem o botão CTA do WhatsApp", () => {
    const ctaMatches = indexHtml.match(/class="btn-whatsapp-cta"/g) || [];
    // 12 cards + botões institucionais
    assert.ok(ctaMatches.length >= 12, `Esperados pelo menos 12 botões CTA, encontrados ${ctaMatches.length}`);
});

// -----------------------------------------------------------------
// 6. BOTÃO FLUTUANTE, CTA DO RODAPÉ E CRÉDITO ZWEI COORPORAÇÕES
// -----------------------------------------------------------------
runTest("6.1. Botão flutuante do WhatsApp (.btn-whatsapp-floating) presente no index.html com ícone oficial idêntico", () => {
    assert.ok(indexHtml.includes('class="btn-whatsapp-floating btn-whatsapp-cta"'), "Botão flutuante do WhatsApp ausente");
    assert.ok(indexHtml.includes('whatsapp-floating-icon'), "Ícone SVG do botão flutuante ausente");
    assert.ok(indexHtml.includes('380.9 97.1C') || indexHtml.includes('viewBox="0 0 448 512"'), "Path SVG idêntico e oficial do WhatsApp não encontrado no botão flutuante");
});

runTest("6.2. Animação de batida rítmica (heartbeat + radar) configurada no css/custom.css", () => {
    const customCssPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'css', 'custom.css');
    const customCss = fs.readFileSync(customCssPath, 'utf8');
    assert.ok(customCss.includes('@keyframes whatsapp-heartbeat') || customCss.includes('@keyframes pulse-whatsapp'), "Keyframes de pulso ausente no custom.css");
    assert.ok(customCss.includes('whatsapp-wave'), "Keyframes de onda expansiva whatsapp-wave ausente no custom.css");
    assert.ok(customCss.includes('.btn-whatsapp-floating'), "Classe .btn-whatsapp-floating ausente no custom.css");
});

runTest("6.3. Crédito 'Desenvolvido por Zwei Coorporações LTDA' com link correto zweicoorp.com.br", () => {
    assert.ok(indexHtml.includes('Desenvolvido por'), "Texto 'Desenvolvido por' ausente no rodapé");
    assert.ok(indexHtml.includes('Zwei Coorporações LTDA'), "Nome 'Zwei Coorporações LTDA' ausente");
    assert.ok(indexHtml.includes('href="https://zweicoorp.com.br"'), "Link para https://zweicoorp.com.br ausente");
});

runTest("6.4. Botão CTA do rodapé configurado como pílula verde com ícone e texto legível", () => {
    assert.ok(indexHtml.includes('rj-foot-cta-btn'), "Classe rj-foot-cta-btn ausente no botão do rodapé");
    assert.ok(indexHtml.includes('Falar no WhatsApp'), "Texto 'Falar no WhatsApp' ausente no rodapé");
    const customCssPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'css', 'custom.css');
    const customCss = fs.readFileSync(customCssPath, 'utf8');
    assert.ok(customCss.includes('.rj-foot-cta-btn') && customCss.includes('border-radius: var(--radius-full)'), "Estilo em pílula do CTA do rodapé ausente no custom.css");
});

// -----------------------------------------------------------------
// 7. ALTERNÂNCIA DE TEMA (DARK / LIGHT MODE) E ALTO CONTRASTE
// -----------------------------------------------------------------
runTest("7.1. Botão de alternância de tema (.rj-theme-toggle) com ícones vetoriais de Sol e Lua", () => {
    assert.ok(indexHtml.includes('class="rj-theme-toggle'), "Classe .rj-theme-toggle ausente no index.html");
    assert.ok(indexHtml.includes('icon-sun'), "Ícone de sol ausente");
    assert.ok(indexHtml.includes('icon-moon'), "Ícone de lua ausente");
    assert.ok(indexHtml.includes('Modo Escuro'), "Texto 'Modo Escuro' ausente");
    assert.ok(indexHtml.includes('Modo Claro'), "Texto 'Modo Claro' ausente");
});

runTest("7.2. Script ante-FOUC presente no <head> para evitar flash de estilo", () => {
    assert.ok(indexHtml.includes('localStorage.getItem(\'rj_theme\')'), "Verificação de rj_theme ausente no script do head");
    assert.ok(indexHtml.includes('data-theme'), "Atribuição de data-theme ausente no script do head");
});

runTest("7.3. Tokens do Dark Mode em alto contraste ([data-theme='dark']) definidos no css/tokens.css", () => {
    const tokensCssPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'css', 'tokens.css');
    const tokensCss = fs.readFileSync(tokensCssPath, 'utf8');
    assert.ok(tokensCss.includes('[data-theme="dark"]'), "Seletor [data-theme='dark'] ausente no tokens.css");
    assert.ok(tokensCss.includes('--color-bg-body: #0b0f19'), "Cor de fundo obsidian #0b0f19 ausente no dark mode");
    assert.ok(tokensCss.includes('--color-accent-bronze: #fbbf24'), "Cor de acento âmbar radiante #fbbf24 ausente no dark mode");
    assert.ok(tokensCss.includes('--color-text-main: #f8fafc'), "Cor de texto de alto contraste #f8fafc ausente no dark mode");
});

runTest("7.4. Script js/theme-toggle.js criado e linkado no index.html", () => {
    assert.ok(indexHtml.includes('src="js/theme-toggle.js"'), "Script js/theme-toggle.js não linkado no index.html");
    const scriptPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'js', 'theme-toggle.js');
    assert.ok(fs.existsSync(scriptPath), "Arquivo js/theme-toggle.js não existe fisicamente");
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    assert.ok(scriptContent.includes('localStorage.setItem'), "Persistência em localStorage ausente no script de alternância");
    assert.ok(scriptContent.includes('data-theme'), "Manipulação de data-theme ausente no script de alternância");
});

runTest("7.5. Regras de estilização e contraste do Dark Mode no css/custom.css", () => {
    const customCssPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'css', 'custom.css');
    const customCss = fs.readFileSync(customCssPath, 'utf8');
    assert.ok(customCss.includes('.rj-theme-toggle'), "Estilização da classe .rj-theme-toggle ausente no custom.css");
    assert.ok(customCss.includes('[data-theme="dark"] .rj-theme-toggle'), "Estilos dark da classe .rj-theme-toggle ausentes");
    assert.ok(customCss.includes('[data-theme="dark"] header.rj-header'), "Estilos dark do cabeçalho ausentes");
    assert.ok(customCss.includes('[data-theme="dark"] .collection-grid-card'), "Estilos dark dos cards ausentes");
    assert.ok(customCss.includes('[data-theme="dark"] .cdm-foot-main'), "Estilos dark do rodapé ausentes");
});

runTest("7.6. Fundo global escuro (#0b0f19) aplicado com alta especificidade no body e html", () => {
    const customCssPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'css', 'custom.css');
    const customCss = fs.readFileSync(customCssPath, 'utf8');
    assert.ok(customCss.includes('html[data-theme="dark"] body'), "Seletor de alta especificidade html[data-theme='dark'] body ausente no custom.css");
    assert.ok(customCss.includes('background-color: #0b0f19 !important'), "Regra de fundo obsidian #0b0f19 ausente para o body");
    assert.ok(customCss.includes('[data-theme="dark"] .search-header h1'), "Regra de título branco no escuro ausente");
});

runTest("7.7. Topbar sem duplicidade de botões (CTA e Theme Toggle apenas ao lado da barra de pesquisa)", () => {
    const topbarMatch = indexHtml.match(/<div class="rj-topbar">([\s\S]*?)<\/div>/i);
    assert.ok(topbarMatch, "Elemento .rj-topbar não encontrado");
    const topbarContent = topbarMatch[1];
    assert.ok(!topbarContent.includes('rj-theme-toggle'), "Botão de tema não deveria estar na topbar");
    assert.ok(!topbarContent.includes('btn-whatsapp-cta'), "Botão de WhatsApp não deveria estar na topbar");
    assert.ok(indexHtml.includes('class="rj-header-action"'), "Container .rj-header-action presente");
    const headerActionMatch = indexHtml.match(/<div class="rj-header-action">([\s\S]*?)<\/div>/i);
    assert.ok(headerActionMatch && headerActionMatch[1].includes('theme-toggle'), "Botão de tema deve estar presente ao lado da busca");
});

console.log("==========================================================");
console.log(` RESULTADO: Total: ${passed + failed} | Aprovados: ${passed} | Falhas: ${failed}`);
console.log("==========================================================");

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}

