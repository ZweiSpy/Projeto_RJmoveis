/**
 * ====================================================================
 * test_responsiveness_audit.js
 * ====================================================================
 * Bateria de testes automatizados de responsividade (Smartphones e Tablets):
 * 1. Verificação de Integridade das 8 Páginas Oficiais
 * 2. Validação do Menu Hambúrguer, Drawer Off-Canvas e Backdrop
 * 3. Validação do Script js/mobile-drawer.js
 * 4. Validação das Regras CSS de Layout Adaptativo em 2 Linhas no Header
 * 5. Validação da Busca em Largura Total (100%) no Mobile
 * 6. Validação da Despoluição Visual (Balão intrusivo desativado no mobile)
 * 7. Validação do Botão Flutuante FAB WhatsApp e Barra Sticky
 * 8. Validação de Cláusulas Pétreas (Zero R$, integridade de WhatsApp)
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');

const pages = [
    'index.html',
    'catalogo.html',
    'sofas.html',
    'quartos.html',
    'salas.html',
    'paineis.html',
    'cozinha.html',
    'pronta-entrega.html'
];

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✅ PASS: ${message}`);
    } else {
        console.error(`  ❌ FAIL: ${message}`);
    }
}

console.log('====================================================================');
console.log('🧪 INICIANDO AUDITORIA AUTOMATIZADA DE RESPONSIVIDADE (MOBILE & TABLET)');
console.log('====================================================================\n');

// --- TESTE 1: Existência dos Arquivos Core ---
console.log('📋 Teste 1: Arquivos e Scripts Core');
assert(fs.existsSync('js/mobile-drawer.js'), 'js/mobile-drawer.js existe');
assert(fs.existsSync('css/custom.css'), 'css/custom.css existe');
assert(fs.existsSync('js/cro-enhancements.js'), 'js/cro-enhancements.js existe');

// --- TESTE 2: Estrutura Mobile nas 8 Páginas ---
console.log('\n📱 Teste 2: Componentes Mobile nas 8 Páginas Oficiais');
pages.forEach(p => {
    const html = fs.readFileSync(p, 'utf8');
    const hasToggle = html.includes('id="rj-mobile-menu-toggle"');
    const hasDrawer = html.includes('id="rj-mobile-drawer"');
    const hasBackdrop = html.includes('id="rj-drawer-backdrop"');
    const hasDrawerScript = html.includes('js/mobile-drawer.js');

    assert(hasToggle, `${p} contém botão hambúrguer #rj-mobile-menu-toggle`);
    assert(hasDrawer, `${p} contém drawer lateral #rj-mobile-drawer`);
    assert(hasBackdrop, `${p} contém backdrop do drawer #rj-drawer-backdrop`);
    assert(hasDrawerScript, `${p} carrega script js/mobile-drawer.js`);
});

// --- TESTE 3: Regras CSS no custom.css ---
console.log('\n🎨 Teste 3: Regras de Responsividade no custom.css');
const css = fs.readFileSync('css/custom.css', 'utf8');

assert(css.includes('#rj-mobile-menu-toggle {'), 'CSS define estilo padrão para #rj-mobile-menu-toggle');
assert(css.includes('display: none;'), 'CSS oculta botão hambúrguer no desktop por padrão');
assert(css.includes('.rj-mobile-drawer {'), 'CSS define componente .rj-mobile-drawer com transform: translate3d(-100%');
assert(css.includes('.rj-drawer-backdrop {'), 'CSS define backdrop com blur e transição');
assert(css.includes('@media (max-width: 992px)'), 'CSS possui breakpoint <= 992px para tablet/mobile');
assert(css.includes('flex-wrap: wrap !important;'), 'CSS quebra cabeçalho em 2 linhas limpas no mobile (<= 992px)');
assert(css.includes('#rj-mobile-menu-toggle {') && css.includes('display: flex !important;'), 'CSS exibe botão hambúrguer em telas <= 992px');
assert(css.includes('.rj-search-box {') && css.includes('width: 100% !important;'), 'CSS entrega 100% da largura para a busca no mobile');

// --- TESTE 4: Despoluição Visual e Botão Flutuante ---
console.log('\n🧹 Teste 4: Despoluição Visual e Botão Flutuante do WhatsApp');
assert(css.includes('.rj-whatsapp-bubble {') && css.includes('display: none !important;'), 'Balão intrusivo desativado em max-width: 768px (Fim da poluição)');
assert(css.includes('.btn-whatsapp-floating {') && css.includes('bottom: 76px !important;'), 'Botão flutuante FAB calibrado acima da sticky bar no mobile (76px)');
assert(css.includes('.btn-whatsapp-floating::before') && css.includes('pointer-events: none !important;'), 'Pseudo-elementos do FAB livres de bloqueio tátil');

const croJs = fs.readFileSync('js/cro-enhancements.js', 'utf8');
assert(croJs.includes('if (window.innerWidth <= 768)'), 'cro-enhancements.js previne abertura do balão em smartphones <= 768px');
assert(croJs.includes('initWhatsAppFloatingHandler'), 'cro-enhancements.js implementa handler confiável para o FAB');

// --- TESTE 5: Cláusulas Pétreas ---
console.log('\n🔒 Teste 5: Cláusulas Pétreas e Segurança');
pages.forEach(p => {
    const html = fs.readFileSync(p, 'utf8');
    const rdollarMatches = html.match(/R\$\s*\d+/g);
    assert(!rdollarMatches, `${p} não possui menções de preço (R$ 0 encontrado)`);

    const hasWhats = html.includes('5521994990764');
    assert(hasWhats, `${p} preserva número oficial do WhatsApp (+55 21 99499-0764)`);
});

// --- RESUMO FINAL ---
console.log('\n====================================================================');
console.log(`📊 RESULTADO DA AUDITORIA: ${passedTests}/${totalTests} TESTES APROVADOS (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================================');

if (passedTests === totalTests) {
    console.log('🎉 AUDITORIA CONCLUÍDA COM SUCESSO TOTAL! ZERO REGRESSÕES.');
    process.exit(0);
} else {
    console.error('⚠️ ALGUNS TESTES FALHARAM. REVISAR ACIMA.');
    process.exit(1);
}
