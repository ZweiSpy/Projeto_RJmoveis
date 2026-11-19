/**
 * ====================================================================
 * test_github_pages_analytics.js
 * ====================================================================
 * Suíte de Testes Automatizados para Telemetria GitHub Pages (GA4 + MS Clarity):
 * 1. Garantia de remoção das tags legadas da Vercel (/_vercel/* -> 404) e Matomo
 * 2. Inclusão de js/analytics.js?v=2.5.0 e balanço <div> = 0 nas 8 páginas HTML
 * 3. Validação de configuração (Microsoft Clarity zftkkx1ir8 e guarda para ID numérico GA4)
 * 4. Simulação completa de eventos (pageview diário, cliques em links, WhatsApp,
 *    modal de produto, mídia, busca, ordenação, paginação e tema)
 * ====================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const ANALYTICS_PATH = path.join(BASE_DIR, 'js', 'analytics.js');
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
        console.log(`  [PASS] ${name}`);
        passed++;
    } catch (err) {
        console.error(`  [FAIL] ${name}`);
        console.error(`    Error: ${err.message}`);
        failed++;
    }
}

function createStorageMock() {
    const store = new Map();
    return {
        getItem: (k) => (store.has(k) ? store.get(k) : null),
        setItem: (k, v) => store.set(k, String(v)),
        removeItem: (k) => store.delete(k)
    };
}

function createDomEnvironment(options) {
    const opts = options || {};
    const listeners = {};
    const appendedHeadScripts = [];
    const warnings = [];

    const mockWindow = {
        innerWidth: opts.innerWidth || 1280,
        location: {
            pathname: opts.pathname || '/catalogo.html',
            origin: 'https://rjmoveis.app.br',
            href: `https://rjmoveis.app.br${opts.pathname || '/catalogo.html'}${opts.search || ''}`,
            search: opts.search || ''
        },
        localStorage: createStorageMock(),
        sessionStorage: createStorageMock(),
        console: {
            log: () => {},
            table: () => {},
            warn: (msg) => warnings.push(String(msg)),
            error: () => {}
        }
    };

    if (opts.presetConfig) {
        mockWindow.RJ_ANALYTICS_CONFIG = Object.assign({}, opts.presetConfig);
    }

    const mockDocument = {
        title: opts.title || 'Catálogo Oficial — RJ Móveis',
        referrer: 'https://www.google.com/',
        readyState: 'complete',
        defaultView: mockWindow,
        head: {
            appendChild: (el) => {
                appendedHeadScripts.push(el);
                return el;
            }
        },
        body: {
            appendChild: () => {}
        },
        createElement: (tag) => ({
            tagName: String(tag).toUpperCase(),
            async: false,
            src: '',
            style: {},
            setAttribute: () => {},
            remove: () => {}
        }),
        getElementById: () => null,
        getElementsByTagName: () => [],
        addEventListener: (ev, fn) => {
            listeners[ev] = listeners[ev] || [];
            listeners[ev].push(fn);
        }
    };

    mockWindow.document = mockDocument;
    return { mockWindow, mockDocument, listeners, appendedHeadScripts, warnings };
}

function createFakeElement(props) {
    const p = props || {};
    const classSet = new Set(p.classes || []);
    return {
        tagName: (p.tagName || 'A').toUpperCase(),
        id: p.id || '',
        href: p.href || '',
        textContent: p.textContent || '',
        classList: {
            contains: (c) => classSet.has(c)
        },
        getAttribute: (attr) => {
            if (attr === 'href') return p.href || '';
            if (attr === 'title') return p.title || '';
            if (attr === 'aria-label') return p.ariaLabel || '';
            if (attr === 'data-product-name') return p.productName || '';
            return '';
        },
        closest: (selector) => {
            const sels = selector.split(',').map(s => s.trim());
            for (const s of sels) {
                if (s === 'a' && (p.tagName || 'A').toUpperCase() === 'A') return fakeEl;
                if (s.startsWith('.') && classSet.has(s.slice(1))) return fakeEl;
                if (p.ancestors && p.ancestors[s]) return p.ancestors[s];
            }
            return null;
        }
    };
}

let fakeEl = null;

console.log('\n====================================================================');
console.log('AUDITORIA DE TELEMETRIA GITHUB PAGES (GA4 + MS CLARITY)');
console.log('====================================================================\n');

console.log('[1/3] Limpeza de scripts Vercel (404) & inclusão de js/analytics.js');

runTest('1.1. Todas as 8 páginas HTML removem /_vercel/insights, /_vercel/speed-insights e Matomo', () => {
    PAGES.forEach(file => {
        const html = fs.readFileSync(path.join(BASE_DIR, file), 'utf8');
        assert.ok(!html.includes('/_vercel/insights/script.js'), `${file} ainda contém /_vercel/insights/script.js`);
        assert.ok(!html.includes('/_vercel/speed-insights/script.js'), `${file} ainda contém /_vercel/speed-insights/script.js`);
        assert.ok(!html.includes('analytics.iset.io/matomo.js'), `${file} ainda contém matomo.js`);
    });
});

runTest('1.2. Todas as 8 páginas HTML carregam js/analytics.js?v=2.5.0 com Delta <div> = 0', () => {
    PAGES.forEach(file => {
        const html = fs.readFileSync(path.join(BASE_DIR, file), 'utf8');
        assert.ok(html.includes('src="js/analytics.js?v=2.5.0"'), `${file} não carrega js/analytics.js?v=2.5.0`);
        const openDivs = (html.match(/<div[\s>]/gi) || []).length;
        const closeDivs = (html.match(/<\/div>/gi) || []).length;
        assert.strictEqual(openDivs, closeDivs, `${file} possui desequilíbrio de <div>`);
    });
});

console.log('\n[2/3] Auto-loader do Microsoft Clarity e Validação de ID GA4');

const analyticsCode = fs.readFileSync(ANALYTICS_PATH, 'utf8');

runTest('2.1. Configuração padrão ativa GA4 (G-8VNZNQ8C1K) e Microsoft Clarity (zftkkx1ir8) no load', () => {
    const { mockWindow, mockDocument, appendedHeadScripts } = createDomEnvironment({
        pathname: '/index.html'
    });
    const runner = new Function('window', 'document', analyticsCode);
    runner(mockWindow, mockDocument);

    assert.strictEqual(mockWindow.RJ_ANALYTICS_CONFIG.googleAnalyticsId, 'G-8VNZNQ8C1K');
    assert.strictEqual(mockWindow.RJ_ANALYTICS_CONFIG.clarityProjectId, 'zftkkx1ir8');
    assert.strictEqual(typeof mockWindow.gtag, 'function', 'window.gtag deve estar inicializado por padrão');
    assert.strictEqual(typeof mockWindow.clarity, 'function', 'window.clarity deve estar inicializado por padrão');
    assert.ok(
        appendedHeadScripts.some(s => s.src === 'https://www.googletagmanager.com/gtag/js?id=G-8VNZNQ8C1K'),
        'Script gtag.js do GA4 G-8VNZNQ8C1K deve ser injetado no <head>'
    );
    assert.ok(
        appendedHeadScripts.some(s => s.src === 'https://www.clarity.ms/tag/zftkkx1ir8'),
        'Script do Microsoft Clarity zftkkx1ir8 deve ser injetado no <head>'
    );

    const clarityQueue = Array.from(mockWindow.clarity.q || []);
    assert.ok(
        clarityQueue.some(args => args[0] === 'set' && args[1] === 'page_department' && args[2] === 'inicio'),
        'Clarity deve receber tag de departamento na inicialização'
    );
});

runTest('2.2. Guarda protetora: Property ID numérico (416985372) emite aviso e não carrega gtag quebrado', () => {
    const { mockWindow, mockDocument, appendedHeadScripts, warnings } = createDomEnvironment({
        presetConfig: {
            googleAnalyticsId: '416985372',
            clarityProjectId: 'zftkkx1ir8'
        }
    });
    const runner = new Function('window', 'document', analyticsCode);
    runner(mockWindow, mockDocument);

    assert.ok(
        !appendedHeadScripts.some(s => s.src.includes('googletagmanager.com')),
        'Não deve injetar gtag.js com Property ID puramente numérico'
    );
    assert.ok(
        warnings.some(w => w.includes('416985372') && w.includes('G-')),
        'Deve alertar no console explicando que gtag.js exige formato G-XXXXXXXXXX'
    );
});

runTest('2.3. Measurement ID válido (G-TESTE12345) injeta gtag.js e configura GA4 corretamente', () => {
    const { mockWindow, mockDocument, appendedHeadScripts } = createDomEnvironment({
        presetConfig: {
            googleAnalyticsId: 'G-TESTE12345',
            clarityProjectId: 'zftkkx1ir8'
        }
    });
    const runner = new Function('window', 'document', analyticsCode);
    runner(mockWindow, mockDocument);

    assert.strictEqual(typeof mockWindow.gtag, 'function', 'window.gtag deve ser inicializado');
    assert.ok(
        appendedHeadScripts.some(s => s.src === 'https://www.googletagmanager.com/gtag/js?id=G-TESTE12345'),
        'Script gtag.js deve ser carregado com ID G-TESTE12345'
    );

    const gaEvents = Array.from(mockWindow.dataLayer || []).map(item => Array.from(item));
    assert.ok(
        gaEvents.some(args => args[0] === 'event' && args[1] === 'page_view' && args[2].department === 'catalogo_completo'),
        'page_view inicial deve ser disparado no dataLayer do GA4'
    );
});

console.log('\n[3/3] Rastreamento Completo de Cliques, Modal, Busca, Controles e Resumo Diário');

runTest('3.1. Cliques em links de navegação disparam navegacao_link com beacon e região exata', () => {
    const { mockWindow, mockDocument, listeners } = createDomEnvironment({
        pathname: '/index.html',
        presetConfig: { googleAnalyticsId: 'G-TESTE12345', clarityProjectId: 'zftkkx1ir8' }
    });
    const runner = new Function('window', 'document', analyticsCode);
    runner(mockWindow, mockDocument);

    const clickHandler = listeners.click[0];

    // Clique em menu superior
    fakeEl = createFakeElement({
        tagName: 'A',
        href: 'sofas.html',
        textContent: 'Estofados & Sofás',
        ancestors: { '.rj-nav-list': {} }
    });
    clickHandler({ target: fakeEl });

    // Clique em departamento na sidebar
    fakeEl = createFakeElement({
        tagName: 'A',
        href: 'quartos.html',
        textContent: 'Quartos & Roupeiros (224)',
        ancestors: { '.rj-sidebar-departments': {} }
    });
    clickHandler({ target: fakeEl });

    // Clique em link interno de .product-card (NÃO WhatsApp) -> não deve duplicar navegacao_link
    fakeEl = createFakeElement({
        tagName: 'A',
        href: 'sofa-lima-p123',
        textContent: 'Sofá Lima',
        ancestors: { '.product-card': {} }
    });
    clickHandler({ target: fakeEl });

    const navEvents = Array.from(mockWindow.dataLayer)
        .map(a => Array.from(a))
        .filter(a => a[0] === 'event' && a[1] === 'navegacao_link');

    assert.strictEqual(navEvents.length, 2, 'Devem existir exatamente 2 eventos navegacao_link (link de card ignorado)');
    assert.strictEqual(navEvents[0][2].link_location, 'header_nav');
    assert.strictEqual(navEvents[0][2].transport_type, 'beacon');
    assert.strictEqual(navEvents[1][2].link_location, 'sidebar_departamento');
});

runTest('3.2. WhatsApp, Modal Quick-View, Mídia, Busca e Controles gravam em GA4, Clarity e resumo diário', () => {
    const { mockWindow, mockDocument, listeners } = createDomEnvironment({
        pathname: '/catalogo.html',
        presetConfig: { googleAnalyticsId: 'G-TESTE12345', clarityProjectId: 'zftkkx1ir8' }
    });
    const runner = new Function('window', 'document', analyticsCode);
    runner(mockWindow, mockDocument);

    const clickHandler = listeners.click[0];

    // WhatsApp em card de produto
    fakeEl = createFakeElement({
        tagName: 'A',
        href: 'https://wa.me/5521994990764?text=Teste',
        classes: ['btn-whatsapp-cta'],
        productName: 'Sofá Lima 2,00m',
        ancestors: { '.product-card': {} }
    });
    clickHandler({ target: fakeEl });

    // Modal, mídia, busca (com e sem resultado) e controles
    mockWindow.RJ_Analytics.trackProductModalOpen('1533', 'Sofá Lima 2,00m', 'smart_search');
    mockWindow.RJ_Analytics.trackProductMedia('1533', 'Sofá Lima 2,00m', 'video', 'youtube');
    mockWindow.RJ_Analytics.trackSearch('sofá retrátil', 14, 'grid_filter');
    mockWindow.RJ_Analytics.trackSearch('item inexistente xyz', 0, 'grid_filter');
    mockWindow.RJ_Analytics.trackCatalogControl('sort', 'pricelow', 'Menor preço');
    mockWindow.RJ_Analytics.trackCatalogControl('items_per_page', '48', '48 por página');
    mockWindow.RJ_Analytics.trackCatalogControl('theme', 'dark', 'Modo Escuro');

    const gaEvents = Array.from(mockWindow.dataLayer).map(a => Array.from(a));
    assert.ok(gaEvents.some(a => a[1] === 'click_whatsapp' && a[2].button_location === 'card_produto_whatsapp'));
    assert.ok(gaEvents.some(a => a[1] === 'select_item' && a[2].item_list_name === 'smart_search'));
    assert.ok(gaEvents.some(a => a[1] === 'product_media_view' && a[2].media_type === 'video'));
    assert.ok(gaEvents.some(a => a[1] === 'search' && a[2].search_term === 'sofá retrátil'));
    assert.ok(gaEvents.some(a => a[1] === 'search_zero_results' && a[2].search_term === 'item inexistente xyz'));
    assert.ok(gaEvents.some(a => a[1] === 'catalog_interaction' && a[2].control_type === 'items_per_page' && a[2].control_value === '48'));

    const summary = mockWindow.RJ_Analytics.relatorio();
    const todayKeys = Object.keys(summary.daily);
    assert.strictEqual(todayKeys.length, 1, 'Resumo diário deve registrar bucket da data local atual');
    const today = summary.daily[todayKeys[0]];
    assert.strictEqual(today.views, 1);
    assert.strictEqual(today.sessions, 1);
    assert.strictEqual(today.whatsapp_clicks, 1);
    assert.strictEqual(today.modal_opens, 1);
    assert.strictEqual(today.searches, 2);
    assert.strictEqual(today.controls, 3);
});

runTest('3.3. Painel ?analytics=1 renderiza contadores numéricos igual a 0 sem ficar vazio e escapa HTML', () => {
    const renderedPanels = [];
    const { mockWindow, mockDocument } = createDomEnvironment({
        pathname: '/index.html',
        search: '?analytics=1'
    });
    mockDocument.body.appendChild = (el) => renderedPanels.push(el);
    const runner = new Function('window', 'document', analyticsCode);
    runner(mockWindow, mockDocument);

    mockWindow.RJ_Analytics.trackSearch('<script>xss</script>', 0, 'grid_filter');
    mockWindow.RJ_Analytics.renderDiagnosticPanel();

    assert.strictEqual(renderedPanels.length, 1, 'Painel diagnóstico deve ser montado no DOM');
    const html = renderedPanels[0].innerHTML;
    assert.ok(!html.includes('<script>xss</script>'), 'Termos no painel devem ser escapados contra XSS');
    assert.ok(html.includes('&lt;script&gt;xss&lt;/script&gt;'), 'Tag HTML em termo pesquisado deve virar entidade segura');
    assert.ok(html.includes('>0</div>WhatsApp</div>'), 'Contador zerado de WhatsApp deve exibir 0 explicitamente');
});

console.log('\n--------------------------------------------------------------------');
console.log(`TOTAL DE TESTES: ${passed + failed} | PASSARAM: ${passed} | FALHARAM: ${failed}`);
console.log('--------------------------------------------------------------------\n');

process.exit(failed > 0 ? 1 : 0);
