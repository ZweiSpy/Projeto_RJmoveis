/**
 * test_pagination_functional.js — Teste Funcional Rigoroso do Sistema de Paginação
 * Valida a execução real da lógica de catalog-pagination.js sobre a grade de 523 produtos:
 * 1. Inicialização: exatamente 24 cards visíveis, 499 com .page-hidden
 * 2. Alteração de seletor para 36: exatamente 36 visíveis, 487 com .page-hidden
 * 3. Navegação para Página 2: fatia correta de cards visíveis (37 a 72)
 * 4. Alteração de seletor para 48, 60, 72, 84
 * 5. Verificação da regra CSS de especificidade display: none !important
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
let totalFailures = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
        totalFailures++;
    }
}

console.log('===============================================================');
console.log('  TESTE FUNCIONAL DE PAGINAÇÃO: CATÁLOGO COMPLETO');
console.log('===============================================================\n');

// 1. Verificação Estrita das Regras CSS em css/custom.css
console.log('--- 1. Verificando Regras de Visibilidade no css/custom.css ---');
const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'css', 'custom.css'), 'utf8');

assert(cssContent.includes('.storefront-cards.product-card.page-hidden'), 'Regra para .storefront-cards.product-card.page-hidden existe');
assert(cssContent.includes('.product-card.page-hidden'), 'Regra para .product-card.page-hidden existe');
assert(cssContent.includes('.storefront-cards.product-card.search-hidden'), 'Regra para .storefront-cards.product-card.search-hidden existe');

// Checa que o bloco tem display: none !important
const hiddenBlockMatch = cssContent.match(/\.storefront-cards\.product-card\.page-hidden[\s\S]*?\{[\s\S]*?display:\s*none\s*!important/i);
assert(hiddenBlockMatch !== null, 'Regra CSS define "display: none !important;" para sobrepor display: flex !important;');

console.log('');

// 2. Simulação do DOM e Execução de js/catalog-pagination.js
console.log('--- 2. Executando catalog-pagination.js com 523 cards reais ---');

// Extrai contagem real de cards em catalogo.html
const catalogHtml = fs.readFileSync(path.join(ROOT_DIR, 'catalogo.html'), 'utf8');
const cardMatches = catalogHtml.match(/class="[^"]*product-card-title[^"]*"/g) || [];
const TOTAL_CARDS = cardMatches.length;
assert(TOTAL_CARDS === 523, `catalogo.html possui exatamente 523 cards (encontrados: ${TOTAL_CARDS})`);

// Construção de Mock DOM realista
class MockClassList {
    constructor() {
        this.classes = new Set();
    }
    add(cls) { this.classes.add(cls); }
    remove(cls) { this.classes.delete(cls); }
    contains(cls) { return this.classes.has(cls); }
    toString() { return Array.from(this.classes).join(' '); }
}

class MockStyle {
    constructor() {
        this.properties = {};
    }
    setProperty(prop, val, priority) {
        this.properties[prop] = { val, priority };
    }
    removeProperty(prop) {
        delete this.properties[prop];
    }
    get display() {
        return this.properties.display ? this.properties.display.val : '';
    }
    set display(val) {
        this.properties.display = { val, priority: '' };
    }
}

class MockElement {
    constructor(tagName, id = '', className = '') {
        this.tagName = tagName.toUpperCase();
        this.id = id;
        this.classList = new MockClassList();
        if (className) {
            className.split(/\s+/).forEach(c => c && this.classList.add(c));
        }
        this.style = new MockStyle();
        this.children = [];
        this.parentNode = null;
        this.attributes = {};
        this.eventListeners = {};
        this.options = [];
        this.value = '';
        this.innerHTML = '';
    }

    setAttribute(name, val) { this.attributes[name] = val; }
    getAttribute(name) { return this.attributes[name] || null; }
    removeAttribute(name) { delete this.attributes[name]; }

    addEventListener(event, callback) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(callback);
    }

    dispatch(event, eventObj = {}) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(cb => cb({ target: this, ...eventObj }));
        }
    }

    closest(selector) {
        let cur = this;
        while (cur) {
            if (selector === 'form' && cur.tagName === 'FORM') return cur;
            if (selector.startsWith('.') && cur.classList.contains(selector.slice(1))) return cur;
            if (selector.startsWith('button[') && cur.tagName === 'BUTTON' && cur.getAttribute('data-page')) return cur;
            cur = cur.parentNode;
        }
        return null;
    }

    querySelectorAll(selector) {
        const res = [];
        function traverse(el) {
            el.children.forEach(child => {
                if (selector === '.product-card' && child.classList.contains('product-card')) {
                    res.push(child);
                }
                traverse(child);
            });
        }
        traverse(this);
        return res;
    }

    insertBefore(newNode, refNode) {
        const idx = this.children.indexOf(refNode);
        if (idx !== -1) {
            this.children.splice(idx, 0, newNode);
        } else {
            this.children.push(newNode);
        }
        newNode.parentNode = this;
    }

    add(option, index) {
        if (index !== undefined) {
            this.options.splice(index, 0, option);
        } else {
            this.options.push(option);
        }
    }

    getBoundingClientRect() {
        return { top: 300, bottom: 2000, height: 1700, width: 1200 };
    }
}

// Cria os 523 cards simulados
const mockGrid = new MockElement('div', 'rj-products-grid', 'collection-grid mode-grid rj-products-grid');
const mockCards = [];
for (let i = 0; i < TOTAL_CARDS; i++) {
    const card = new MockElement('div', `card-${i}`, 'storefront-cards collection-grid-card product-card');
    mockCards.push(card);
    mockGrid.children.push(card);
    card.parentNode = mockGrid;
}

// Form e Select de Limite
const mockForm = new MockElement('form', 'f-collection-per-page');
const mockLimitSelect = new MockElement('select', 'rj-select-per-page');
mockLimitSelect.setAttribute('name', 'limit');
['24', '36', '48', '60', '72', '84'].forEach(val => {
    mockLimitSelect.options.push({ value: val, text: `${val} por página` });
});
mockLimitSelect.value = '24';
mockForm.children.push(mockLimitSelect);
mockLimitSelect.parentNode = mockForm;

const mockBody = new MockElement('body');
mockBody.children.push(mockForm);
mockForm.parentNode = mockBody;
mockBody.children.push(mockGrid);
mockGrid.parentNode = mockBody;

// Document Mock
const mockDocument = {
    readyState: 'complete',
    getElementById(id) {
        if (id === 'rj-products-grid') return mockGrid;
        if (id === 'rj-select-per-page') return mockLimitSelect;
        if (id === 'f-collection-per-page') return mockForm;
        return null;
    },
    querySelector(selector) {
        if (selector === 'select[name="limit"]') return mockLimitSelect;
        if (selector === '.collection-grid.mode-grid') return mockGrid;
        return null;
    },
    querySelectorAll(selector) {
        return [];
    },
    createElement(tagName) {
        return new MockElement(tagName);
    },
    addEventListener(event, cb) {}
};

// Window Mock
const mockWindow = {
    location: { pathname: '/catalogo.html', search: '' },
    pageYOffset: 0,
    scrollTo(opts) {},
    RJ_CatalogPagination: null
};

// Executa script dentro do contexto VM simulado
const paginationScriptCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'catalog-pagination.js'), 'utf8');
const context = vm.createContext({
    document: mockDocument,
    window: mockWindow,
    Option: function(text, val) { return { text, value: val }; },
    parseInt: parseInt,
    Math: Math,
    URLSearchParams: URLSearchParams,
    Array: Array
});

vm.runInContext(paginationScriptCode, context);

// Testes de Estado Inicial (Página 1, Limite 24)
console.log('--- 3. Verificando Estado Inicial (Limite 24) ---');
let visibleCards = mockCards.filter(c => !c.classList.contains('page-hidden'));
let hiddenCards = mockCards.filter(c => c.classList.contains('page-hidden'));

assert(visibleCards.length === 24, `Exatamente 24 cards estão visíveis na página inicial (encontrados: ${visibleCards.length})`);
assert(hiddenCards.length === 523 - 24, `Exatamente ${523 - 24} cards têm classe .page-hidden (encontrados: ${hiddenCards.length})`);

// Checa se os primeiros 24 são os visíveis
let first24Visible = true;
for (let i = 0; i < 24; i++) {
    if (mockCards[i].classList.contains('page-hidden')) first24Visible = false;
}
assert(first24Visible, 'Os cards 1 a 24 são os que estão visíveis');

// Checa texto de informação de contagem
const counterEl = mockGrid.parentNode.children.find(el => el.id === 'rj-pagination-info');
assert(counterEl !== undefined, 'Elemento rj-pagination-info foi criado com sucesso');
assert(counterEl && counterEl.innerHTML.includes('<strong>1</strong>–<strong>24</strong>'), `Texto informativo exibe faixa correta (1–24): "${counterEl.innerHTML}"`);
assert(counterEl && counterEl.innerHTML.includes('Página <strong>1</strong> de <strong>22</strong>'), 'Exibe 22 páginas totais para 523 itens divididos de 24 em 24');

// Teste de Alteração de Limite: Usuário escolhe 36 por página
console.log('\n--- 4. Teste de Alteração de Limite: 36 por página ---');
mockLimitSelect.value = '36';
mockLimitSelect.dispatch('change', { target: mockLimitSelect });

visibleCards = mockCards.filter(c => !c.classList.contains('page-hidden'));
hiddenCards = mockCards.filter(c => c.classList.contains('page-hidden'));

assert(visibleCards.length === 36, `Exatamente 36 cards estão visíveis após selecionar 36 (encontrados: ${visibleCards.length})`);
assert(hiddenCards.length === 523 - 36, `Exatamente ${523 - 36} cards têm classe .page-hidden`);
assert(counterEl.innerHTML.includes('<strong>1</strong>–<strong>36</strong>'), 'Texto informativo atualizado para 1–36');
assert(counterEl.innerHTML.includes('Página <strong>1</strong> de <strong>15</strong>'), 'Exibe 15 páginas totais (523 / 36 = 14.5 -> 15)');

// Teste de Navegação para a Página 2
console.log('\n--- 5. Teste de Navegação para a Página 2 ---');
const navEl = mockGrid.parentNode.children.find(el => el.id === 'rj-pagination-nav');
assert(navEl !== undefined, 'Elemento rj-pagination-nav foi criado com sucesso');

// Simula clique no botão da página 2
navEl.dispatch('click', {
    target: {
        closest: (sel) => {
            return {
                disabled: false,
                getAttribute: (attr) => attr === 'data-page' ? '2' : null
            };
        }
    }
});

visibleCards = mockCards.filter(c => !c.classList.contains('page-hidden'));
assert(visibleCards.length === 36, `Exatamente 36 cards visíveis na Página 2 (encontrados: ${visibleCards.length})`);
assert(!mockCards[36].classList.contains('page-hidden'), 'Card index 36 (37º item) está visível na Página 2');
assert(!mockCards[71].classList.contains('page-hidden'), 'Card index 71 (72º item) está visível na Página 2');
assert(mockCards[0].classList.contains('page-hidden'), 'Card index 0 (1º item) está oculto com .page-hidden na Página 2');
assert(counterEl.innerHTML.includes('<strong>37</strong>–<strong>72</strong>'), `Texto informativo exibe faixa 37–72: "${counterEl.innerHTML}"`);
assert(counterEl.innerHTML.includes('Página <strong>2</strong> de <strong>15</strong>'), 'Exibe Página 2 de 15');

// Teste de Alteração de Limite: 48, 60, 72, 84
console.log('\n--- 6. Teste de Limites: 48, 60, 72, 84 por página ---');
[48, 60, 72, 84].forEach(limit => {
    mockLimitSelect.value = String(limit);
    mockLimitSelect.dispatch('change', { target: mockLimitSelect });
    visibleCards = mockCards.filter(c => !c.classList.contains('page-hidden'));
    assert(visibleCards.length === limit, `Limite ${limit} por página respeitado com exatidão (visíveis: ${visibleCards.length})`);
});

console.log('\n===============================================================');
if (totalFailures === 0) {
    console.log('  TODOS OS TESTES FUNCIONAIS DE PAGINAÇÃO PASSARAM! (0 falhas)');
} else {
    console.error(`  HOUVE ${totalFailures} FALHAS NO TESTE FUNCIONAL DE PAGINAÇÃO!`);
}
console.log('===============================================================');
process.exit(totalFailures === 0 ? 0 : 1);
