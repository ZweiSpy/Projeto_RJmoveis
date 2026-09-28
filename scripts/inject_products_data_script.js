/**
 * Script para injetar <script src="js/products-data.js"></script>
 * antes de <script src="js/product-modal.js"></script> em todas as 8 páginas do catálogo.
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

let updatedCount = 0;

PAGES.forEach(filename => {
  const filePath = path.join(__dirname, '..', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Arquivo não encontrado: ${filename}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Verifica se já possui
  if (content.includes('products-data.js')) {
    console.log(`[JÁ EXISTE] ${filename}`);
    return;
  }

  // Substitui a inclusão
  const target = '<script src="js/product-modal.js"></script>';
  const replacement = '<script src="js/products-data.js"></script>\n    <script src="js/product-modal.js"></script>';

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[SUCESSO] Injetado em ${filename}`);
    updatedCount++;
  } else {
    console.error(`[FALHA] Tag alvo não encontrada em ${filename}`);
  }
});

console.log(`\nConcluído: ${updatedCount} páginas atualizadas com sucesso.`);
