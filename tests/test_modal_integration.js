const fs = require('fs');
const path = require('path');

const targetPages = [
    'index.html',
    'catalogo.html',
    'sofas.html',
    'quartos.html',
    'cozinha.html',
    'salas.html',
    'paineis.html',
    'pronta-entrega.html'
];

console.log('=== TESTE DE INTEGRAÇÃO DO MODAL FLUTUANTE NAS 8 PÁGINAS ===\n');

let errors = 0;

// 1. Verificar CSS
const cssPath = path.join(__dirname, '..', 'css', 'custom.css');
if (!fs.existsSync(cssPath)) {
    console.error('[FALHA] css/custom.css não encontrado.');
    errors++;
} else {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    if (!cssContent.includes('.product-modal-backdrop') || !cssContent.includes('.product-modal-dialog')) {
        console.error('[FALHA] Regras do modal flutuante não encontradas em css/custom.css.');
        errors++;
    } else {
        console.log('[OK] Regras do modal flutuante confirmadas em css/custom.css.');
    }
}

// 2. Verificar JS
const jsPath = path.join(__dirname, '..', 'js', 'product-modal.js');
if (!fs.existsSync(jsPath)) {
    console.error('[FALHA] js/product-modal.js não encontrado.');
    errors++;
} else {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    if (!jsContent.includes('openModal') || !jsContent.includes('closeModal')) {
        console.error('[FALHA] Funções openModal/closeModal ausentes em js/product-modal.js.');
        errors++;
    } else {
        console.log('[OK] js/product-modal.js validado com sucesso.');
    }
}

// 3. Verificar inclusão nas 8 páginas
targetPages.forEach(p => {
    const pagePath = path.join(__dirname, '..', p);
    if (!fs.existsSync(pagePath)) {
        console.error(`[FALHA] Página ${p} não encontrada.`);
        errors++;
        return;
    }
    const html = fs.readFileSync(pagePath, 'utf8');
    if (!html.includes('js/product-modal.js')) {
        console.error(`[FALHA] ${p} não possui referência a js/product-modal.js`);
        errors++;
    } else {
        console.log(`[OK] ${p} possui js/product-modal.js`);
    }
});

console.log(`\nTotal de erros de integração: ${errors}`);
if (errors === 0) {
    console.log('[SUCESSO] Todas as 8 páginas estão 100% integradas com o modal flutuante!');
    process.exit(0);
} else {
    process.exit(1);
}
