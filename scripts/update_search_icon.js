/**
 * update_search_icon.js
 * Atualiza o botão da barra de pesquisa em todas as 8 páginas do catálogo e no gerador,
 * substituindo o emoji 🔍 pelo ícone SVG vetorial perfeitamente alinhado e centralizado no canto direito.
 */

const fs = require('fs');
const path = require('path');

const targetFiles = [
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

const targetPattern = /<button type="submit" aria-label="Pesquisar">\s*🔍\s*<\/button>/g;

const replacement = `<button type="submit" class="rj-search-btn" aria-label="Pesquisar" title="Pesquisar no catálogo">
                        <svg class="rj-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>
                    </button>`;

let updatedCount = 0;

targetFiles.forEach(relPath => {
    const fullPath = path.join(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) {
        console.error(`[ERRO] Arquivo não encontrado: ${relPath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    if (targetPattern.test(content)) {
        content = content.replace(targetPattern, replacement);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`[OK] Atualizado com sucesso: ${relPath}`);
        updatedCount++;
    } else {
        console.log(`[AVISO] Padrão não encontrado ou já atualizado: ${relPath}`);
    }
});

console.log(`\nConcluído! ${updatedCount} arquivos atualizados.`);
