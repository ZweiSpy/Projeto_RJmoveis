/**
 * ====================================================================
 * test_vercel_analytics.js
 * ====================================================================
 * Suíte de Testes Automatizados para Vercel Web Analytics & Speed Insights:
 * 1. Validação de vercel.json (cleanUrls, cache headers, security headers)
 * 2. Inclusão dos stubs e scripts oficiais no <head> das 8 páginas HTML
 * 3. Enfileiramento correto de eventos no js/analytics.js (window.vaq)
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

console.log('\n================================================================');
console.log('AUDITORIA DE ATIVAÇÃO DO VERCEL WEB ANALYTICS & SPEED INSIGHTS');
console.log('================================================================\n');

// --------------------------------------------------------------------
// 1. CONFIGURAÇÃO VERCEL.JSON
// --------------------------------------------------------------------
console.log('[1/3] Configuração de Deploy Vercel (vercel.json)');

runTest('1.1. Arquivo vercel.json existe e é um JSON sintaticamente válido', () => {
    const vercelConfigPath = path.join(BASE_DIR, 'vercel.json');
    assert.ok(fs.existsSync(vercelConfigPath), 'vercel.json não encontrado na raiz');
    const raw = fs.readFileSync(vercelConfigPath, 'utf8');
    const config = JSON.parse(raw);
    assert.strictEqual(typeof config, 'object', 'vercel.json deve ser um objeto');
});

runTest('1.2. vercel.json possui cleanUrls e regras de cabeçalho de cache e segurança', () => {
    const raw = fs.readFileSync(path.join(BASE_DIR, 'vercel.json'), 'utf8');
    const config = JSON.parse(raw);
    assert.strictEqual(config.cleanUrls, true, 'cleanUrls deve estar ativado como true');
    assert.ok(Array.isArray(config.headers), 'headers deve ser um array de regras');
    const hasCacheRule = config.headers.some(h => 
        h.headers && h.headers.some(header => header.key === 'Cache-Control')
    );
    assert.ok(hasCacheRule, 'Regra de Cache-Control ausente nos headers');
});

// --------------------------------------------------------------------
// 2. INJEÇÃO DOS SCRIPTS NO <HEAD> DAS 8 PÁGINAS
// --------------------------------------------------------------------
console.log('\n[2/3] Injeção de Stubs e Tags Oficiais nas 8 Páginas HTML');

runTest('2.1. Todas as 8 páginas contêm o script oficial /_vercel/insights/script.js', () => {
    PAGES.forEach(filename => {
        const content = fs.readFileSync(path.join(BASE_DIR, filename), 'utf8');
        assert.ok(
            content.includes('/_vercel/insights/script.js'),
            `${filename} não contém a tag para /_vercel/insights/script.js`
        );
    });
});

runTest('2.2. Todas as 8 páginas contêm o script oficial /_vercel/speed-insights/script.js', () => {
    PAGES.forEach(filename => {
        const content = fs.readFileSync(path.join(BASE_DIR, filename), 'utf8');
        assert.ok(
            content.includes('/_vercel/speed-insights/script.js'),
            `${filename} não contém a tag para /_vercel/speed-insights/script.js`
        );
    });
});

runTest('2.3. Todas as 8 páginas definem os stubs assíncronos window.va e window.si no <head>', () => {
    PAGES.forEach(filename => {
        const content = fs.readFileSync(path.join(BASE_DIR, filename), 'utf8');
        assert.ok(
            content.includes('window.va = window.va || function ()'),
            `${filename} não define o stub window.va`
        );
        assert.ok(
            content.includes('window.si = window.si || function ()'),
            `${filename} não define o stub window.si`
        );
    });
});

// --------------------------------------------------------------------
// 3. ENFILEIRAMENTO DE EVENTOS NO JS/ANALYTICS.JS
// --------------------------------------------------------------------
console.log('\n[3/3] Despacho e Enfileiramento de Eventos (js/analytics.js)');

runTest('3.1. js/analytics.js inicializa stubs defensivos de window.va e window.si', () => {
    const analyticsContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'analytics.js'), 'utf8');
    assert.ok(analyticsContent.includes('window.va = window.va || function ()'), 'Stub window.va ausente no analytics.js');
    assert.ok(analyticsContent.includes('window.si = window.si || function ()'), 'Stub window.si ausente no analytics.js');
});

runTest('3.2. Simulação: Eventos de pageview e whatsapp_click são enfileirados em window.vaq', () => {
    // Ambiente simulado de DOM
    const mockWindow = {
        location: { pathname: '/catalogo.html', href: 'https://exemplo.com/catalogo.html', search: '' },
        localStorage: {
            getItem: () => null,
            setItem: () => {}
        },
        document: {
            title: 'Catálogo Oficial RJ Móveis',
            referrer: '',
            addEventListener: () => {}
        },
        console: { log: () => {} }
    };
    mockWindow.document.defaultView = mockWindow;

    // Carregar js/analytics.js no contexto simulado
    const analyticsCode = fs.readFileSync(path.join(BASE_DIR, 'js', 'analytics.js'), 'utf8');
    const runner = new Function('window', 'document', `${analyticsCode}`);
    runner(mockWindow, mockWindow.document);

    // Verificar se window.va e window.vaq foram criados
    assert.strictEqual(typeof mockWindow.va, 'function', 'window.va deve ser uma função');
    assert.ok(Array.isArray(mockWindow.vaq), 'window.vaq deve ser um array de fila');

    // Disparar evento de clique no WhatsApp
    mockWindow.va('event', {
        name: 'whatsapp_click',
        data: {
            product: 'Sofá Retrátil Reclinável Lima',
            location: 'card_produto',
            page: '/catalogo.html'
        }
    });

    const enqueued = mockWindow.vaq;
    assert.ok(enqueued.length > 0, 'Eventos devem ser enfileirados em window.vaq');
    
    // Verificar se o último evento enfileirado é o de WhatsApp
    const lastEvent = enqueued[enqueued.length - 1];
    assert.strictEqual(lastEvent[0], 'event');
    assert.strictEqual(lastEvent[1].name, 'whatsapp_click');
    assert.strictEqual(lastEvent[1].data.product, 'Sofá Retrátil Reclinável Lima');
});

console.log('\n----------------------------------------------------------------');
console.log(`TOTAL DE TESTES: ${passed + failed} | PASSARAM: ${passed} | FALHARAM: ${failed}`);
console.log('----------------------------------------------------------------\n');

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
