const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const pages = [
    'index.html',
    'catalogo.html',
    'sofas.html',
    'quartos.html',
    'cozinha.html',
    'salas.html',
    'paineis.html',
    'pronta-entrega.html',
    'scripts/build_all_catalog_pages.js'
];

pages.forEach(p => {
    const fullPath = path.join(BASE_DIR, p);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');
    const initialLen = content.length;

    // Remover css e js do quicksearch iset.io
    content = content.replace(/<link[^>]*front-libs\.iset\.io[^>]*>\s*/gi, '');
    content = content.replace(/<script[^>]*front-libs\.iset\.io[^>]*><\/script>\s*/gi, '');

    if (content.length !== initialLen) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`[LIMPO] ${p}: removidas tags de front-libs.iset.io.`);
    } else {
        console.log(`[INALTERADO] ${p}`);
    }
});
