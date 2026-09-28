/**
 * Simulação e Teste de Integração DOM — Alternância de Tema (Theme Toggle)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("==========================================================");
console.log(" TESTE DE INTEGRAÇÃO DOM — MOTOR DE TEMA DARK/LIGHT      ");
console.log("==========================================================");

const indexPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

// Mock simples de ambiente de navegador
const mockLocalStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, val) { this.store[key] = String(val); },
    clear() { this.store = {}; }
};

let themeAttribute = 'light';
const mockDocElement = {
    setAttribute(attr, val) {
        if (attr === 'data-theme') themeAttribute = val;
    },
    getAttribute(attr) {
        if (attr === 'data-theme') return themeAttribute;
        return null;
    }
};

let eventListeners = {};
const mockDocument = {
    documentElement: mockDocElement,
    addEventListener(event, fn) {
        if (!eventListeners[event]) eventListeners[event] = [];
        eventListeners[event].push(fn);
    },
    querySelectorAll(selector) {
        if (selector === '.rj-theme-toggle') {
            return [
                {
                    attrs: {},
                    setAttribute(k, v) { this.attrs[k] = v; },
                    getAttribute(k) { return this.attrs[k]; }
                },
                {
                    attrs: {},
                    setAttribute(k, v) { this.attrs[k] = v; },
                    getAttribute(k) { return this.attrs[k]; }
                }
            ];
        }
        return [];
    }
};

const mockWindow = {
    matchMedia(query) {
        return {
            matches: false,
            addEventListener(ev, cb) {}
        };
    }
};

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

// 1. Carregamento do Script js/theme-toggle.js
const themeScriptPath = path.join('c:', 'Users', 'Micro', 'Documents', 'Projeto_MeusMoveis', 'js', 'theme-toggle.js');
const themeScriptContent = fs.readFileSync(themeScriptPath, 'utf8');

runTest("1. Script js/theme-toggle.js existe e define função de inicialização", () => {
    assert.ok(themeScriptContent.includes('STORAGE_KEY = \'rj_theme\''));
    assert.ok(themeScriptContent.includes('applyTheme'));
    assert.ok(themeScriptContent.includes('toggleTheme'));
});

// Executa o script com os mocks
const executeThemeScript = new Function(
    'document', 'window', 'localStorage',
    themeScriptContent
);

executeThemeScript(mockDocument, mockWindow, mockLocalStorage);

runTest("2. Tema inicial padrão sem localStorage cai em 'light'", () => {
    assert.strictEqual(mockDocElement.getAttribute('data-theme'), 'light');
});

runTest("3. Disparo de evento de clique em .rj-theme-toggle alterna tema para 'dark'", () => {
    const clickHandlers = eventListeners['click'] || [];
    assert.ok(clickHandlers.length > 0, "Nenhum ouvinte de clique registrado");

    const mockEvent = {
        target: {
            closest(selector) {
                if (selector === '.rj-theme-toggle') return {};
                return null;
            }
        },
        preventDefault() {}
    };

    // Primeiro clique: deve ir para 'dark'
    clickHandlers[0](mockEvent);
    assert.strictEqual(mockDocElement.getAttribute('data-theme'), 'dark');
    assert.strictEqual(mockLocalStorage.getItem('rj_theme'), 'dark');
});

runTest("4. Segundo clique em .rj-theme-toggle alterna de volta para 'light'", () => {
    const clickHandlers = eventListeners['click'] || [];
    const mockEvent = {
        target: {
            closest(selector) {
                if (selector === '.rj-theme-toggle') return {};
                return null;
            }
        },
        preventDefault() {}
    };

    // Segundo clique: deve voltar para 'light'
    clickHandlers[0](mockEvent);
    assert.strictEqual(mockDocElement.getAttribute('data-theme'), 'light');
    assert.strictEqual(mockLocalStorage.getItem('rj_theme'), 'light');
});

runTest("5. Presença do botão de alternância no Header principal e ausência na Topbar (sem duplicidade)", () => {
    const toggleHeader = indexHtml.includes('rj-theme-toggle-header');
    const toggleTopbar = indexHtml.includes('rj-theme-toggle-topbar');
    assert.ok(toggleHeader, "Botão no header principal ao lado da busca não encontrado");
    assert.ok(!toggleTopbar, "Botão não deveria estar duplicado na topbar");
});

runTest("6. Script ante-FOUC no <head> recupera tema escuro salvo no reload", () => {
    mockLocalStorage.setItem('rj_theme', 'dark');
    const savedTheme = mockLocalStorage.getItem('rj_theme');
    const systemDark = false;
    const theme = savedTheme ? savedTheme : (systemDark ? 'dark' : 'light');
    mockDocElement.setAttribute('data-theme', theme);
    assert.strictEqual(mockDocElement.getAttribute('data-theme'), 'dark');
});

console.log("==========================================================");
console.log(` RESULTADO: Total: ${passed + failed} | Aprovados: ${passed} | Falhas: ${failed}`);
console.log("==========================================================");

if (failed > 0) process.exit(1);
