const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve('c:/Users/Micro/Documents/Projeto_MeusMoveis');
const REAL_WHATSAPP_NUMBER = '5521994990764';
const FORMATTED_PHONE = '(21) 99499-0764';

console.log('================================================================');
console.log(' SUÍTE DE TESTES: EXPANSÃO DO CATÁLOGO RJ MÓVEIS (8 PÁGINAS)');
console.log('================================================================');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  [PASS] ${testName}`);
    } else {
        failedTests++;
        console.error(`  [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    }
}

const EXPECTED_PAGES = [
    { file: 'index.html', expectedCards: 12, activeHref: 'index.html', titleContains: 'RJ Móveis' },
    { file: 'catalogo.html', expectedCards: 523, activeHref: 'catalogo.html', titleContains: 'Catálogo Completo' },
    { file: 'sofas.html', expectedCards: 191, activeHref: 'sofas.html', titleContains: 'Estofados & Sofás' },
    { file: 'quartos.html', expectedCards: 224, activeHref: 'quartos.html', titleContains: 'Quartos & Roupeiros' },
    { file: 'cozinha.html', expectedCards: 72, activeHref: 'cozinha.html', titleContains: 'Cozinha & Modulados' },
    { file: 'salas.html', expectedCards: 23, activeHref: 'salas.html', titleContains: 'Salas de Jantar' },
    { file: 'paineis.html', expectedCards: 13, activeHref: 'paineis.html', titleContains: 'Painéis, Racks & Home' },
    { file: 'pronta-entrega.html', expectedCards: 503, activeHref: 'pronta-entrega.html', titleContains: 'Pronta Entrega' }
];

console.log('\n--- 1. Verificação de Existência dos 8 Arquivos ---');
EXPECTED_PAGES.forEach(p => {
    const fullPath = path.join(BASE_DIR, p.file);
    assert(fs.existsSync(fullPath), `Arquivo ${p.file} existe no disco`);
});

console.log('\n--- 2. Auditoria Rigorosa de Preços (ZERO R$) e Integridade de Tags ---');
EXPECTED_PAGES.forEach(p => {
    const fullPath = path.join(BASE_DIR, p.file);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');

    // Teste de R$
    const rDollarMatches = content.match(/R\$/g) || [];
    assert(rDollarMatches.length === 0, `${p.file}: ZERO ocorrências de 'R$'`, `Encontradas: ${rDollarMatches.length}`);

    // Teste de balanço de div
    const openDivs = (content.match(/<div[\s>]/gi) || []).length;
    const closeDivs = (content.match(/<\/div>/gi) || []).length;
    const delta = openDivs - closeDivs;
    assert(delta === 0, `${p.file}: Balanço de tags <div> é rigorosamente ZERO (0)`, `Delta: ${delta}`);
});

console.log('\n--- 3. Auditoria de Contagem de Cards e Títulos Originais ---');
EXPECTED_PAGES.forEach(p => {
    const fullPath = path.join(BASE_DIR, p.file);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');

    const cardCount = (content.match(/class="[^"]*product-card-title[^"]*"/g) || []).length;
    assert(cardCount === p.expectedCards, `${p.file}: Contém exatamente ${p.expectedCards} produtos`, `Obtidos: ${cardCount}`);

    // Verificar se não há mojibake
    const mojibakeCount = (content.match(/Ã¡|Ã©|Ã£|Ã³|Ã§|Ãº|Â/g) || []).length;
    assert(mojibakeCount === 0, `${p.file}: Charset UTF-8 limpo sem Mojibake`, `Ocorrências: ${mojibakeCount}`);

    // Verificar título da página
    assert(content.includes(`<title>`) && content.includes(p.titleContains), `${p.file}: Tag <title> contém '${p.titleContains}'`);
});

console.log('\n--- 4. Auditoria de Atendimento WhatsApp (Número Real: 21 99499-0764) ---');
EXPECTED_PAGES.forEach(p => {
    const fullPath = path.join(BASE_DIR, p.file);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');

    // Número real presente no link wa.me
    assert(content.includes(REAL_WHATSAPP_NUMBER), `${p.file}: Contém número internacional real (${REAL_WHATSAPP_NUMBER})`);
    // Botões limpos sem número no texto (conforme instrução do usuário)
    const hasPhoneInButton = /<a[^>]*btn-whatsapp-cta[^>]*>[\s\S]*?\(21\)\s*99499-0764[\s\S]*?<\/a>/i.test(content);
    assert(!hasPhoneInButton, `${p.file}: Botões limpos sem número de telefone no texto`);

    // Placeholder antigo eliminado
    assert(!content.includes('5511999999999'), `${p.file}: Zero ocorrências do número de teste antigo (11999999999)`);

    // Botão flutuante presente
    assert(content.includes('btn-whatsapp-floating'), `${p.file}: Botão flutuante pulsante presente`);

    // Botões de produto têm data-product-name
    const ctaMatches = (content.match(/data-product-name="[^"]+"/g) || []).length;
    assert(ctaMatches >= p.expectedCards, `${p.file}: Todos os cards possuem CTA do WhatsApp com data-product-name`, `CTAs: ${ctaMatches}`);
});

console.log('\n--- 5. Auditoria de Navegação, Estados Ativos e Busca ---');
EXPECTED_PAGES.forEach(p => {
    const fullPath = path.join(BASE_DIR, p.file);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');

    // Item de menu ativo
    const activeRegex = new RegExp(`<a href="${p.activeHref}" class="[^"]*active[^"]*"`);
    assert(activeRegex.test(content), `${p.file}: Link do menu para '${p.activeHref}' está com class='active'`);

    // Busca instantânea
    assert(content.includes('id="rj-catalog-search-input"'), `${p.file}: Campo de busca instantânea presente`);
    assert(content.includes('src="js/catalog-search.js"'), `${p.file}: Script de busca instantânea linkado`);
});

console.log('\n--- 6. Auditoria de Design System, Tema Dark/Light e Rodapé Institucional ---');
EXPECTED_PAGES.forEach(p => {
    const fullPath = path.join(BASE_DIR, p.file);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');

    // Tokens CSS e Custom CSS
    assert(content.includes('href="css/tokens.css"'), `${p.file}: tokens.css linkado`);
    assert(content.includes('href="css/custom.css"'), `${p.file}: custom.css linkado`);

    // Script ante-FOUC
    assert(content.includes("localStorage.getItem('rj_theme')"), `${p.file}: Script ante-FOUC presente no <head>`);
    assert(content.includes('src="js/theme-toggle.js"'), `${p.file}: theme-toggle.js linkado`);

    // Alternador de tema no cabeçalho
    assert(content.includes('id="theme-toggle"'), `${p.file}: Botão de alternância de tema no cabeçalho`);

    // Crédito do rodapé
    assert(content.includes('https://zweicoorp.com.br'), `${p.file}: Link zweicoorp.com.br no rodapé`);
    assert(content.includes('Zwei Coorporações LTDA'), `${p.file}: Nome 'Zwei Coorporações LTDA' no rodapé`);
});

console.log('\n================================================================');
console.log(` RESULTADO FINAL: Total: ${totalTests} | Aprovados: ${passedTests} | Falhas: ${failedTests}`);
console.log('================================================================');

if (failedTests > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
