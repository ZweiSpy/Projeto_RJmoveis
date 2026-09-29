/**
 * ====================================================================
 * apply_cro_enhancements_all_pages.js
 * ====================================================================
 * Atualiza todas as 8 páginas do catálogo com:
 * 1. Tag <script src="js/cro-enhancements.js"></script>
 * 2. Copywriting refinado nos cards com WhatsApp em negrito (*Produto*)
 *    e CTA persuasivo 'Consultar no WhatsApp'
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');

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

let totalCardsUpdated = 0;
let totalScriptsInjected = 0;

PAGES.forEach(filename => {
    const filePath = path.join(BASE_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`Arquivo não encontrado: ${filename}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Injetar <script src="js/cro-enhancements.js"></script>
    if (!content.includes('js/cro-enhancements.js')) {
        if (content.includes('<script src="js/catalog-search.js"></script>')) {
            content = content.replace(
                '<script src="js/catalog-search.js"></script>',
                '<script src="js/catalog-search.js"></script>\n    <script src="js/cro-enhancements.js"></script>'
            );
            modified = true;
            totalScriptsInjected++;
        } else if (content.includes('</body>')) {
            content = content.replace(
                '</body>',
                '    <script src="js/cro-enhancements.js"></script>\n</body>'
            );
            modified = true;
            totalScriptsInjected++;
        }
    }

    // 2. Atualizar CTAs de produtos para copywriting persuasivo com negrito
    // Padrão antigo:
    // https://wa.me/5521994990764?text=Ol%C3%A1!%20Estava%20no%20site%20da%20RJ%20M%C3%B3veis%20e%20quero%20saber%20mais%20sobre%20o%20produto%3A%20%22...%22.%20Poderia%20me%20ajudar%3F
    const ctaRegex = /href="https:\/\/wa\.me\/5521994990764\?text=Ol(?:%C3%A1|%E1|á)!(?:%20|\+)Estava(?:%20|\+)no(?:%20|\+)site(?:%20|\+)da(?:%20|\+)RJ(?:%20|\+)M(?:%C3%B3|%F3|ó)veis(?:%20|\+)e(?:%20|\+)quero(?:%20|\+)saber(?:%20|\+)mais(?:%20|\+)sobre(?:%20|\+)o(?:%20|\+)produto%3A(?:%20|\+)%22([^"]+?)%22\.(?:%20|\+)Poderia(?:%20|\+)me(?:%20|\+)ajudar%3F"([^>]*)class="btn-whatsapp-cta"([^>]*)>([\s\S]*?)<span>Chame no WhatsApp<\/span><\/a>/g;

    let pageCardCount = 0;
    content = content.replace(ctaRegex, (fullMatch, encodedProdTitle, beforeClass, afterClass, svgBlock) => {
        pageCardCount++;
        totalCardsUpdated++;
        
        // Decodificar o nome do produto
        let prodTitle = '';
        try {
            prodTitle = decodeURIComponent(encodedProdTitle).trim();
        } catch (e) {
            prodTitle = encodedProdTitle.replace(/%20/g, ' ').replace(/%22/g, '').trim();
        }

        const newMsg = encodeURIComponent(`Olá, equipe RJ Móveis! Tenho interesse no *${prodTitle}*. Gostaria de saber opções de cores/tecidos e o prazo de entrega para o Rio de Janeiro.`);
        return `href="https://wa.me/5521994990764?text=${newMsg}"${beforeClass}class="btn-whatsapp-cta"${afterClass}>${svgBlock}<span>Consultar no WhatsApp</span></a>`;
    });

    if (modified || pageCardCount > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[OK] ${filename}: script injetado? ${content.includes('js/cro-enhancements.js')} | ${pageCardCount} cards atualizados.`);
    } else {
        console.log(`[PULADO] ${filename}: sem alterações necessárias.`);
    }
});

console.log(`\nFinalizado: ${totalScriptsInjected} scripts injetados, ${totalCardsUpdated} cards atualizados.`);
