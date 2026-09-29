/**
 * ====================================================================
 * test_cro_whatsapp_conversions.js
 * ====================================================================
 * Suíte de Testes Automatizados para os 5 Pilares de CRO & WhatsApp:
 * 1. Smart Floating WhatsApp Chat Bubble (Balão proativo de atendimento)
 * 2. Zero-Results CRO (Recuperação de busca sem resultados & dropdown)
 * 3. Modal Trust Badges & Simulação de Frete
 * 4. Sticky Mobile CRO Bar (Barra fixa mobile de resposta rápida)
 * 5. Copywriting Persuasivo com Negrito (*Produto*) nos CTAs
 * 6. Suporte a Dark Mode & Conformidade de Governança (Zero R$)
 * ====================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
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

let passed = 0;
let failed = 0;

function runTest(name, fn) {
    try {
        fn();
        console.log(`  \x1b[32m✔ PASS:\x1b[0m ${name}`);
        passed++;
    } catch (err) {
        console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${name}`);
        console.error(`    \x1b[33mError: ${err.message}\x1b[0m`);
        failed++;
    }
}

console.log('\n======================================================');
console.log('AUDITORIA DOS 5 PILARES DE CONVERSÃO WHATSAPP (CRO)');
console.log('======================================================\n');

// --------------------------------------------------------------------
// GRUPO 1: SCRIPT DE CRO E INJEÇÃO NAS 8 PÁGINAS
// --------------------------------------------------------------------
console.log('\n[1/6] Injeção de Scripts & Módulo CRO');

runTest('1.1. Arquivo js/cro-enhancements.js existe e é válido', () => {
    const croPath = path.join(BASE_DIR, 'js', 'cro-enhancements.js');
    assert.ok(fs.existsSync(croPath), 'js/cro-enhancements.js não existe');
    const content = fs.readFileSync(croPath, 'utf8');
    assert.ok(content.includes('initCROEnhancements'), 'Função de inicialização ausente');
    assert.ok(content.includes('rj_bubble_dismissed'), 'Chave de sessionStorage ausente');
});

runTest('1.2. Todas as 8 páginas HTML contêm a tag <script src="js/cro-enhancements.js">', () => {
    PAGES.forEach(filename => {
        const filePath = path.join(BASE_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        assert.ok(
            content.includes('js/cro-enhancements.js'),
            `${filename} não inclui a tag <script src="js/cro-enhancements.js">`
        );
    });
});

// --------------------------------------------------------------------
// GRUPO 2: PILAR 1 - SMART FLOATING WHATSAPP CHAT BUBBLE
// --------------------------------------------------------------------
console.log('\n[2/6] Pilar 1: Smart Floating WhatsApp Chat Bubble');

runTest('2.1. js/cro-enhancements.js constrói o balão proativo completo com header, avatar, beacon e botão fechar', () => {
    const croContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'cro-enhancements.js'), 'utf8');
    assert.ok(croContent.includes('rj-whatsapp-bubble'), 'ID rj-whatsapp-bubble ausente');
    assert.ok(croContent.includes('rj-bubble-close-btn'), 'Botão fechar ausente');
    assert.ok(croContent.includes('rj-bubble-avatar'), 'Avatar ausente');
    assert.ok(croContent.includes('rj-status-beacon'), 'Farol de status online pulsante ausente');
    assert.ok(croContent.includes('rj-bubble-cta-btn'), 'Botão CTA ausente no balão');
    assert.ok(croContent.includes('sessionStorage.setItem'), 'Persistência no sessionStorage ausente');
});

runTest('2.2. css/custom.css possui regras de estilo e animações do balão flutuante', () => {
    const cssContent = fs.readFileSync(path.join(BASE_DIR, 'css', 'custom.css'), 'utf8');
    assert.ok(cssContent.includes('.rj-whatsapp-bubble'), 'Classe .rj-whatsapp-bubble ausente no CSS');
    assert.ok(cssContent.includes('.rj-bubble-visible'), 'Classe .rj-bubble-visible ausente');
    assert.ok(cssContent.includes('.rj-bubble-arrow'), 'Seta decorativa .rj-bubble-arrow ausente');
    assert.ok(cssContent.includes('@keyframes beacon-pulse'), 'Keyframes beacon-pulse ausente');
});

// --------------------------------------------------------------------
// GRUPO 3: PILAR 2 - ZERO RESULTS CRO & DROPDOWN FOOTER
// --------------------------------------------------------------------
console.log('\n[3/6] Pilar 2: Recuperação de Busca Vazia & Rodapé da Busca');

runTest('3.1. js/catalog-search.js possui card CRO quando sugestões são vazias', () => {
    const searchContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'catalog-search.js'), 'utf8');
    assert.ok(searchContent.includes('rj-search-empty-cro-dropdown'), 'Card CRO de busca vazia no dropdown ausente');
    assert.ok(searchContent.includes('btn-dropdown-cro-whatsapp'), 'Botão WhatsApp no dropdown vazio ausente');
    assert.ok(searchContent.includes('https://wa.me/5521994990764'), 'Número do WhatsApp correto ausente na busca vazia');
});

runTest('3.2. js/catalog-search.js possui micro-link de WhatsApp no rodapé do dropdown quando há resultados', () => {
    const searchContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'catalog-search.js'), 'utf8');
    assert.ok(searchContent.includes('rj-search-footer-whatsapp-link'), 'Link no rodapé do dropdown ausente');
    assert.ok(searchContent.includes('Procura outro modelo? Fale com a fábrica no WhatsApp'), 'Texto do micro-link ausente');
});

runTest('3.3. js/catalog-search.js possui card CRO no grid quando visibleCount for zero', () => {
    const searchContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'catalog-search.js'), 'utf8');
    assert.ok(searchContent.includes('rj-search-empty-cro'), 'Card .rj-search-empty-cro ausente no grid');
    assert.ok(searchContent.includes('btn-cro-whatsapp'), 'Botão .btn-cro-whatsapp ausente no grid');
    assert.ok(searchContent.includes('Atendimento Sob Encomenda'), 'Badge de atendimento sob encomenda ausente');
});

// --------------------------------------------------------------------
// GRUPO 4: PILAR 3 - TRUST BADGES & SIMULAÇÃO DE FRETE NO MODAL
// --------------------------------------------------------------------
console.log('\n[4/6] Pilar 3: Trust Badges & Frete no Modal de Detalhes');

runTest('4.1. js/product-modal.js possui botão secundário de simulação de frete para o CEP', () => {
    const modalContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'product-modal.js'), 'utf8');
    assert.ok(modalContent.includes('id="modal-frete-link"'), 'Botão #modal-frete-link ausente');
    assert.ok(modalContent.includes('btn-modal-frete'), 'Classe btn-modal-frete ausente');
    assert.ok(modalContent.includes('Simular Frete &amp; Prazo no WhatsApp'), 'Texto do botão de frete ausente');
    assert.ok(modalContent.includes('Gostaria de simular o frete e prazo de entrega'), 'Mensagem formatada de frete ausente');
});

runTest('4.2. js/product-modal.js contém os 3 selos de confiança (Trust Badges)', () => {
    const modalContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'product-modal.js'), 'utf8');
    assert.ok(modalContent.includes('modal-trust-badges'), 'Container .modal-trust-badges ausente');
    assert.ok(modalContent.includes('Entrega Cuidadosa'), 'Badge Entrega Cuidadosa ausente');
    assert.ok(modalContent.includes('Cores &amp; Tecidos'), 'Badge Cores & Tecidos ausente');
    assert.ok(modalContent.includes('Atendimento Humano'), 'Badge Atendimento Humano ausente');
});

// --------------------------------------------------------------------
// GRUPO 5: PILAR 4 & 5 - STICKY MOBILE BAR & COPYWRITING EM NEGRITO
// --------------------------------------------------------------------
console.log('\n[5/6] Pilar 4 & 5: Sticky Mobile Bar & Copywriting Persuasivo');

runTest('5.1. js/cro-enhancements.js gera barra fixa mobile (#rj-mobile-sticky-bar) com atalhos de WhatsApp e Catálogo', () => {
    const croContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'cro-enhancements.js'), 'utf8');
    assert.ok(croContent.includes('rj-mobile-sticky-bar'), 'Identificador rj-mobile-sticky-bar ausente');
    assert.ok(croContent.includes('rj-sticky-btn-whats'), 'Botão WhatsApp mobile ausente');
    assert.ok(croContent.includes('rj-sticky-btn-catalog'), 'Atalho para catálogo mobile ausente');
});

runTest('5.2. css/custom.css ativa a barra mobile apenas em max-width: 768px com padding-bottom de compensação', () => {
    const cssContent = fs.readFileSync(path.join(BASE_DIR, 'css', 'custom.css'), 'utf8');
    assert.ok(cssContent.includes('.rj-mobile-sticky-bar'), 'Classe .rj-mobile-sticky-bar ausente no CSS');
    assert.ok(cssContent.includes('padding-bottom: 64px !important'), 'Compensação do padding-bottom ausente');
});

runTest('5.3. Mensagens de WhatsApp nos cards de produtos usam negrito (*Produto*)', () => {
    PAGES.forEach(filename => {
        const filePath = path.join(BASE_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        // Deve haver ocorrências de * ou %2A (negrito WhatsApp)
        const asterisksMatch = content.match(/wa\.me\/5521994990764\?text=[^"]*(\*|%2A)/g) || [];
        assert.ok(
            asterisksMatch.length > 0,
            `${filename} não possui links de WhatsApp com produto em negrito (*)`
        );
        // O texto do botão deve ser 'Consultar no WhatsApp'
        assert.ok(
            content.includes('Consultar no WhatsApp'),
            `${filename} não possui botões com o texto 'Consultar no WhatsApp'`
        );
    });
});

// --------------------------------------------------------------------
// GRUPO 6: DARK MODE & REGRAS PÉTREAS DE GOVERNANÇA
// --------------------------------------------------------------------
console.log('\n[6/6] Suporte a Dark Mode & Conformidade Inegociável');

runTest('6.1. css/custom.css possui seletores [data-theme="dark"] para todos os novos componentes CRO', () => {
    const cssContent = fs.readFileSync(path.join(BASE_DIR, 'css', 'custom.css'), 'utf8');
    assert.ok(cssContent.includes('[data-theme="dark"] .btn-modal-frete'), 'Dark mode do frete ausente');
    assert.ok(cssContent.includes('[data-theme="dark"] .modal-trust-badges'), 'Dark mode dos trust badges ausente');
    assert.ok(cssContent.includes('[data-theme="dark"] .rj-search-empty-cro'), 'Dark mode do card de busca ausente');
    assert.ok(cssContent.includes('[data-theme="dark"] .rj-whatsapp-bubble'), 'Dark mode do balão ausente');
    assert.ok(cssContent.includes('[data-theme="dark"] .rj-mobile-sticky-bar'), 'Dark mode da sticky bar ausente');
});

runTest('6.2. Nenhuma das 8 páginas possui menções a preços ("R$")', () => {
    PAGES.forEach(filename => {
        const filePath = path.join(BASE_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        const matches = content.match(/R\$\s*[\d\.\,]+/g) || [];
        assert.strictEqual(
            matches.length,
            0,
            `${filename} contém menções a preços: ${JSON.stringify(matches)}`
        );
    });
});

runTest('6.3. Nenhuma das 8 páginas aponta para domínios externos de checkout ou rastreadores terceiros', () => {
    PAGES.forEach(filename => {
        const filePath = path.join(BASE_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        assert.strictEqual(content.includes('iset.io'), false, `${filename} contém tracker iset.io`);
        assert.strictEqual(content.includes('loja-original'), false, `${filename} contém menções a loja original`);
    });
});

console.log('\n------------------------------------------------------');
console.log(`TOTAL DE TESTES: ${passed + failed} | PASSARAM: ${passed} | FALHARAM: ${failed}`);
console.log('------------------------------------------------------\n');

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
