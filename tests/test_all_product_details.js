const fs = require('fs');
const path = require('path');

const DETAILS_PATH = path.join(__dirname, '..', 'data', 'products_details.json');
const MAP_PATH = path.join(__dirname, '..', 'data', 'products_catalog_map.json');

console.log('=== TESTE AUTOMATIZADO: VALIDAÇÃO DOS DETALHES DOS PRODUTOS ===\n');

if (!fs.existsSync(DETAILS_PATH)) {
    console.error('[FALHA CRÍTICA] Arquivo data/products_details.json não encontrado!');
    process.exit(1);
}

const details = JSON.parse(fs.readFileSync(DETAILS_PATH, 'utf8'));
const totalCount = Object.keys(details).length;
console.log(`Total de produtos extraídos em data/products_details.json: ${totalCount}`);

if (fs.existsSync(MAP_PATH)) {
    const mapList = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
    console.log(`Total esperado conforme products_catalog_map.json: ${mapList.length}`);
}

let errors = 0;
let priceViolations = 0;
let missingGalleries = 0;
let videoCount = 0;

const PRICE_REGEX = /(R\$\s*[\d\.\,]+|[\d]+x\s+de\s+R\$|sem juros|no cartão|no pix)/i;

for (const [id, prod] of Object.entries(details)) {
    // 1. Validação de ID e Título
    if (!prod.id || !prod.title || prod.title.trim().length === 0) {
        console.error(`[ERRO ID/TITLE] Produto ID ${id} possui dados de identificação inválidos.`);
        errors++;
    }

    // 2. Validação Estrita de Zero Preços / Zero Menções Financeiras
    if (PRICE_REGEX.test(prod.description) || PRICE_REGEX.test(prod.title)) {
        console.error(`[VIOLAÇÃO FINANCEIRA] Produto [${id}] "${prod.title}" contém menção a preço ou condição de pagamento!`);
        priceViolations++;
        errors++;
    }

    // 3. Validação de Galeria de Fotos
    if (!prod.gallery || !Array.isArray(prod.gallery) || prod.gallery.length === 0) {
        console.warn(`[AVISO GALERIA] Produto [${id}] "${prod.title}" não possui fotos na galeria.`);
        missingGalleries++;
    }

    // 4. Contagem de Vídeos
    if (prod.youtubeVideo && (prod.youtubeVideo.videoId || prod.youtubeVideo.embedUrl)) {
        videoCount++;
    }
}

console.log('\n--- RESUMO DA AUDITORIA ---');
console.log(`Total de itens analisados: ${totalCount}`);
console.log(`Itens com vídeo YouTube cadastrado: ${videoCount}`);
console.log(`Itens sem fotos na galeria: ${missingGalleries}`);
console.log(`Violações financeiras (R$, preços, parcelas): ${priceViolations}`);
console.log(`Total de erros críticos: ${errors}`);

if (errors === 0 && priceViolations === 0) {
    console.log('\n[SUCESSO ABSOLUTO] Todos os produtos analisados estão 100% em conformidade com as regras do projeto!');
    process.exit(0);
} else {
    console.error(`\n[FALHA] Foram encontrados ${errors} erros durante a auditoria.`);
    process.exit(1);
}
