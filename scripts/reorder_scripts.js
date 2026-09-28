/**
 * Reordena os scripts no rodapé das 8 páginas do catálogo para que:
 * 1. js/products-data.js
 * 2. js/product-modal.js
 * estejam carregados antes de catalog-search.js, catalog-sort.js e catalog-pagination.js.
 */
const fs = require('fs');
const path = require('path');

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

const targetPattern = /<script src="js\/catalog-search\.js"><\/script>\s*<script src="js\/catalog-sort\.js"><\/script>\s*<script src="js\/catalog-pagination\.js"><\/script>\s*<script src="js\/products-data\.js"><\/script>\s*<script src="js\/product-modal\.js"><\/script>/;

const replacement = `<script src="js/products-data.js"></script>
    <script src="js/product-modal.js"></script>
    <script src="js/catalog-sort.js"></script>
    <script src="js/catalog-pagination.js"></script>
    <script src="js/catalog-search.js"></script>`;

let updated = 0;

PAGES.forEach(page => {
    const filePath = path.join(__dirname, '..', page);
    if (!fs.existsSync(filePath)) {
        console.error(`[ERRO] Arquivo não encontrado: ${page}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    if (targetPattern.test(content)) {
        content = content.replace(targetPattern, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[SUCESSO] Scripts reordenados em: ${page}`);
        updated++;
    } else {
        console.warn(`[AVISO] Padrão não coincidiu exatamente em ${page}`);
    }
});

console.log(`\nConcluído: ${updated} de ${PAGES.length} páginas reordenadas.`);
