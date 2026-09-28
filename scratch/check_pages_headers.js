const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve('c:/Users/Micro/Documents/Projeto_MeusMoveis');
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

PAGES.forEach(page => {
    const c = fs.readFileSync(path.join(ROOT_DIR, page), 'utf8');
    
    // Breadcrumb
    const bStart = c.indexOf('id="breadcrumb"');
    const bEnd = c.indexOf('</ul>', bStart);
    const breadcrumb = bStart !== -1 ? c.substring(bStart, bEnd + 5) : 'NOT FOUND';
    
    // Section Header (H1)
    const sStart = c.indexOf('class="section-header search-header"');
    const sEnd = c.indexOf('</div>\n            </div>', sStart);
    const secHeader = sStart !== -1 ? c.substring(sStart, sEnd + 25) : 'NOT FOUND';

    console.log(`\n================== ${page} ==================`);
    console.log('--- BREADCRUMB ---');
    console.log(breadcrumb.replace(/\s+/g, ' ').substring(0, 300));
    console.log('--- SECTION HEADER H1 ---');
    console.log(secHeader.replace(/\s+/g, ' '));
});
