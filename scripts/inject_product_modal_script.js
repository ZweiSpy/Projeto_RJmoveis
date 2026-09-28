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

targetPages.forEach(fileName => {
    const filePath = path.join(__dirname, '..', fileName);
    if (!fs.existsSync(filePath)) {
        console.warn(`Arquivo não encontrado: ${fileName}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('js/product-modal.js')) {
        console.log(`[OK] ${fileName} já possui js/product-modal.js`);
        return;
    }

    // Inserir após js/catalog-pagination.js ou antes de </body>
    if (content.includes('<script src="js/catalog-pagination.js"></script>')) {
        content = content.replace(
            '<script src="js/catalog-pagination.js"></script>',
            '<script src="js/catalog-pagination.js"></script>\n    <script src="js/product-modal.js"></script>'
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[INJETADO] ${fileName} atualizado com js/product-modal.js`);
    } else if (content.includes('</body>')) {
        content = content.replace(
            '</body>',
            '    <script src="js/product-modal.js"></script>\n</body>'
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[INJETADO] ${fileName} atualizado com js/product-modal.js antes de </body>`);
    } else {
        console.error(`[ERRO] Não foi possível localizar o ponto de inserção em ${fileName}`);
    }
});
