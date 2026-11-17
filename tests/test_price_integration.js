/**
 * ====================================================================
 * test_price_integration.js
 * ====================================================================
 * Validação E2E de precisão e comportamento dos preços oficiais:
 * 1. Fidelidade 1:1 dos 523 preços entre as 7 fontes originais,
 *    data/products_details.json, window.RJ_PRODUCTS_DATA e as 8 páginas HTML.
 * 2. Execução simulada em DOM de js/catalog-sort.js (pricelow, pricemax, bestsellers).
 * 3. Execução simulada em DOM de js/product-modal.js (renderização de preço + fallback).
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const { extractSourcePricesMap } = require('../scripts/extract_prices_and_update_data');

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
        const res = fn();
        if (res && typeof res.then === 'function') {
            return res.then(() => {
                console.log(`  [PASS] ${name}`);
                passed++;
            }).catch(err => {
                console.error(`  [FAIL] ${name}: ${err.message}`);
                failed++;
            });
        }
        console.log(`  [PASS] ${name}`);
        passed++;
    } catch (err) {
        console.error(`  [FAIL] ${name}: ${err.message}`);
        failed++;
    }
    return Promise.resolve();
}

// Helper para DOM mínimo em Node VM
function createMockDom() {
    const idMap = new Map();

    function makeNode(tagName = 'div') {
        const classes = new Set();
        const attrs = {};
        const listeners = {};
        const node = {
            tagName: tagName.toUpperCase(),
            dataset: {},
            style: {
                setProperty(k, v) { this[k] = v; },
                removeProperty(k) { delete this[k]; }
            },
            children: [],
            parentNode: null,
            _innerHTML: '',
            _textContent: '',
            classList: {
                add(...c) { c.forEach(x => classes.add(x)); },
                remove(...c) { c.forEach(x => classes.delete(x)); },
                contains(c) { return classes.has(c); }
            },
            setAttribute(k, v) {
                attrs[k] = String(v);
                if (k === 'id') idMap.set(String(v), node);
                if (k.startsWith('data-')) {
                    const camel = k.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
                    node.dataset[camel] = String(v);
                }
            },
            getAttribute(k) {
                if (k === 'id') return attrs.id || node.id || null;
                return attrs[k] !== undefined ? attrs[k] : null;
            },
            removeAttribute(k) { delete attrs[k]; },
            appendChild(child) {
                if (child.tagName === '#FRAGMENT') {
                    const kids = [...child.children];
                    kids.forEach(k => node.appendChild(k));
                    child.children.length = 0;
                    return child;
                }
                if (child.parentNode && Array.isArray(child.parentNode.children)) {
                    const idx = child.parentNode.children.indexOf(child);
                    if (idx !== -1) child.parentNode.children.splice(idx, 1);
                }
                child.parentNode = node;
                node.children.push(child);
                return child;
            },
            addEventListener(ev, fn) {
                listeners[ev] = listeners[ev] || [];
                listeners[ev].push(fn);
            },
            dispatchEvent(evObj) {
                (listeners[evObj.type] || []).forEach(fn => fn(evObj));
            },
            closest() { return null; },
            querySelector(sel) {
                if (sel === '.product-card-title a') return node._titleEl || null;
                if (sel === '.product-card-price .price, [data-element="sale-price"]') return node._priceEl || null;
                return null;
            },
            querySelectorAll(sel) {
                if (sel === '.product-card') {
                    return node.children.filter(c => c.classList.contains('product-card'));
                }
                return [];
            },
            get textContent() {
                if (node.children.length > 0) {
                    return node.children.map(c => c.textContent).join('');
                }
                return node._textContent;
            },
            set textContent(val) {
                node.children = [];
                node._textContent = String(val);
            },
            get innerHTML() { return node._innerHTML; },
            set innerHTML(val) {
                node._innerHTML = String(val);
                if (val === '') node.children = [];
                // Registrar IDs principais injetados pelo template do modal
                const idMatches = [...node._innerHTML.matchAll(/id="([^"]+)"/g)];
                idMatches.forEach(m => {
                    if (!idMap.has(m[1])) {
                        const el = makeNode('div');
                        el.id = m[1];
                        idMap.set(m[1], el);
                    }
                });
            }
        };
        return node;
    }

    const body = makeNode('body');
    const docListeners = {};

    const document = {
        readyState: 'complete',
        body,
        createElement(tag) { return makeNode(tag); },
        createTextNode(txt) {
            return { tagName: '#text', textContent: String(txt), parentNode: null };
        },
        createDocumentFragment() { return makeNode('#fragment'); },
        getElementById(id) { return idMap.get(id) || null; },
        querySelector(sel) {
            if (sel === '.collection-grid.mode-grid') return idMap.get('rj-products-grid') || null;
            if (sel === 'select[name="sort"]') return idMap.get('rj-select-sort') || null;
            return null;
        },
        addEventListener(ev, fn) {
            docListeners[ev] = docListeners[ev] || [];
            docListeners[ev].push(fn);
        }
    };

    return { document, idMap, makeNode };
}

async function main() {
    console.log('===============================================================');
    console.log('  TESTES E2E: PREÇOS NOS CARDS, MODAL QUICK-VIEW E ORDENAÇÃO');
    console.log('===============================================================\n');

    const sourcePricesMap = extractSourcePricesMap();
    const detailsJson = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'data', 'products_details.json'), 'utf8'));

    // Carregar window.RJ_PRODUCTS_DATA
    const dataSandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(BASE_DIR, 'js', 'products-data.js'), 'utf8'), dataSandbox);
    const rjProductsData = dataSandbox.window.RJ_PRODUCTS_DATA;

    await runTest('1. Fidelidade 1:1 entre fontes originais, products_details.json e products-data.js (523 itens)', () => {
        assert.strictEqual(sourcePricesMap.size, 523, 'Mapa fonte deve ter 523 itens');
        assert.strictEqual(Object.keys(detailsJson).length, 523, 'products_details.json deve ter 523 itens');
        assert.strictEqual(Object.keys(rjProductsData).length, 523, 'window.RJ_PRODUCTS_DATA deve ter 523 itens');

        for (const [id, src] of sourcePricesMap.entries()) {
            const jsonItem = detailsJson[id];
            const jsItem = rjProductsData[id];
            assert.ok(jsonItem && jsonItem.price, `ID ${id} sem price em products_details.json`);
            assert.ok(jsItem && jsItem.price, `ID ${id} sem price em products-data.js`);
            assert.strictEqual(jsonItem.price.saleFormatted, src.saleFormatted, `Divergência saleFormatted ID ${id}`);
            assert.strictEqual(jsonItem.price.saleNumeric, src.saleNumeric, `Divergência saleNumeric ID ${id}`);
            assert.strictEqual(jsonItem.price.pixFormatted, src.pixFormatted, `Divergência pixFormatted ID ${id}`);
            assert.strictEqual(jsItem.price.saleFormatted, src.saleFormatted, `Divergência JS saleFormatted ID ${id}`);
        }
    });

    await runTest('2. Fidelidade 1:1 dos preços e data-price nos cards de todas as 8 páginas HTML', () => {
        const cardMarker = '<div class="storefront-cards collection-grid-card product-card';
        PAGES.forEach(page => {
            const html = fs.readFileSync(path.join(BASE_DIR, page), 'utf8');
            const chunks = html.split(cardMarker).slice(1);
            assert.ok(chunks.length > 0, `${page} sem cards`);

            chunks.forEach((chunk, idx) => {
                const idMatch = chunk.match(/data-id="(\d+)"/);
                const priceAttrMatch = chunk.match(/data-price="([\d.]+)"/);
                const saleMatch = chunk.match(/data-element="sale-price">([^<]+)<\/div>/);
                const instMatch = chunk.match(/class="installment-plan">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/);
                const ctaMatch = chunk.match(/class="btn-whatsapp-cta"/);

                assert.ok(idMatch, `${page} card #${idx} sem data-id`);
                const id = idMatch[1];
                const expected = sourcePricesMap.get(id);
                assert.ok(expected, `${page} ID ${id} ausente no mapa fonte`);
                assert.ok(priceAttrMatch, `${page} ID ${id} sem data-price`);
                assert.strictEqual(parseFloat(priceAttrMatch[1]), expected.saleNumeric, `${page} ID ${id} data-price divergente`);
                assert.ok(saleMatch, `${page} ID ${id} sem sale-price`);
                assert.strictEqual(saleMatch[1].trim(), expected.saleFormatted, `${page} ID ${id} saleFormatted divergente`);
                assert.ok(instMatch && instMatch[1].includes(expected.pixFormatted), `${page} ID ${id} sem PIX esperado (${expected.pixFormatted})`);
                assert.ok(ctaMatch, `${page} ID ${id} perdeu o botão .btn-whatsapp-cta`);
            });
        });
    });

    await runTest('3. Execução real de js/catalog-sort.js ordenando Menor Preço e Maior Preço no DOM', () => {
        const { document, idMap, makeNode } = createMockDom();
        const grid = makeNode('div');
        grid.id = 'rj-products-grid';
        idMap.set('rj-products-grid', grid);

        const sortSelect = makeNode('select');
        sortSelect.id = 'rj-select-sort';
        sortSelect.value = 'bestsellers';
        idMap.set('rj-select-sort', sortSelect);

        const sampleItems = [
            { id: '1533', title: 'Sofá A', price: 3126 },
            { id: '553', title: 'Cama B', price: 582 },
            { id: '2000', title: 'Guarda-roupa C', price: 4500 }
        ];

        sampleItems.forEach(item => {
            const card = makeNode('div');
            card.classList.add('product-card');
            card.setAttribute('data-id', item.id);
            card.setAttribute('data-price', String(item.price));
            card._titleEl = { textContent: item.title, getAttribute: () => item.title };
            grid.appendChild(card);
        });

        let paginationRecalculated = 0;
        const windowObj = {
            location: { search: '' },
            RJ_CatalogPagination: { recalculate: () => { paginationRecalculated++; } }
        };

        const sortCode = fs.readFileSync(path.join(BASE_DIR, 'js', 'catalog-sort.js'), 'utf8');
        vm.runInNewContext(sortCode, { window: windowObj, document, URLSearchParams, setTimeout });

        windowObj.RJ_CatalogSort.applySort('pricelow');
        assert.deepStrictEqual(
            grid.children.map(c => c.getAttribute('data-id')),
            ['553', '1533', '2000'],
            'pricelow deve ordenar do menor para o maior preço'
        );

        windowObj.RJ_CatalogSort.applySort('pricemax');
        assert.deepStrictEqual(
            grid.children.map(c => c.getAttribute('data-id')),
            ['2000', '1533', '553'],
            'pricemax deve ordenar do maior para o menor preço'
        );

        windowObj.RJ_CatalogSort.applySort('bestsellers');
        assert.deepStrictEqual(
            grid.children.map(c => c.getAttribute('data-id')),
            ['1533', '553', '2000'],
            'bestsellers deve restaurar ordem original'
        );
        assert.strictEqual(paginationRecalculated, 3, 'Paginação deve ser recalculada em cada ordenação');
    });

    await runTest('4. Execução real de js/product-modal.js populando preço completo e WhatsApp no Quick-View', async () => {
        const { document, idMap } = createMockDom();
        const windowObj = { RJ_PRODUCTS_DATA: rjProductsData };

        const modalCode = fs.readFileSync(path.join(BASE_DIR, 'js', 'product-modal.js'), 'utf8');
        vm.runInNewContext(modalCode, { window: windowObj, document, setTimeout });

        await windowObj.RJProductModal.open('553');

        assert.strictEqual(idMap.get('modal-price-box').style.display, 'flex');
        assert.strictEqual(idMap.get('modal-price-main').textContent, 'R$ 582,00');
        assert.strictEqual(idMap.get('modal-price-installments').textContent, 'Em 10x de R$ 58,20 sem juros');
        assert.strictEqual(idMap.get('modal-price-pix').textContent, 'ou R$ 523,80 no PIX');
        assert.ok(idMap.get('modal-whatsapp-link').href.includes('5521994990764'), 'CTA WhatsApp do modal mantido');
        assert.ok(idMap.get('modal-frete-link').href.includes('5521994990764'), 'CTA Frete do modal mantido');

        // Fallback gracioso sem preço
        await windowObj.RJProductModal.open('999999', 'Móvel Teste', '');
        assert.strictEqual(idMap.get('modal-price-box').style.display, 'none', 'Sem preço deve ocultar #modal-price-box');
    });

    await runTest('5. Busca Inteligente exibe preços oficiais nas sugestões e páginas <= 24 itens ocultam seletor de limite', () => {
        const searchJs = fs.readFileSync(path.join(BASE_DIR, 'js', 'catalog-search.js'), 'utf8');
        assert.ok(searchJs.includes('rj-search-item-price') && searchJs.includes('rj-search-price-main'), 'Busca inteligente deve renderizar preço principal');
        assert.ok(searchJs.includes('rj-search-price-pix'), 'Busca inteligente deve renderizar preço no PIX');

        ['index.html', 'paineis.html', 'salas.html'].forEach(p => {
            const html = fs.readFileSync(path.join(BASE_DIR, p), 'utf8');
            assert.ok(html.includes('collection-limit rj-limit-hidden'), `${p} deve ocultar .collection-limit (<= 24 itens)`);
        });
        ['catalogo.html', 'sofas.html', 'quartos.html', 'cozinha.html', 'pronta-entrega.html'].forEach(p => {
            const html = fs.readFileSync(path.join(BASE_DIR, p), 'utf8');
            assert.ok(html.includes('<div class="collection-limit">') && html.includes('value="all"'), `${p} deve expor seletor de limite em desktop/mobile com opção Ver todos`);
        });
    });

    console.log('\n===============================================================');
    console.log(`  RESULTADO: Total: ${passed + failed} | Aprovados: ${passed} | Falhas: ${failed}`);
    console.log('===============================================================');

    if (failed > 0) process.exit(1);
}

main();
