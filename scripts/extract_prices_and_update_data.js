/**
 * ====================================================================
 * extract_prices_and_update_data.js
 * ====================================================================
 * Lê as 7 páginas-fonte originais do catálogo, extrai e normaliza os
 * preços oficiais (à vista, 10x sem juros e PIX) de todos os 523 itens,
 * e injeta o campo estruturado `price` em data/products_details.json.
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');

const SOURCE_FILES = [
    { file: 'site-catalogos-original.html', pageNum: 1 },
    { file: 'site-catalogo-p2', pageNum: 2 },
    { file: 'site-catalogo-pg3.html', pageNum: 3 },
    { file: 'site-catalogo-pg4.html', pageNum: 4 },
    { file: 'site-catalagos-pg5.html', pageNum: 5 },
    { file: 'site-catalagos-pg6.html', pageNum: 6 },
    { file: 'site-catalagos-pg7.html', pageNum: 7 }
];

/**
 * Normaliza strings monetárias brasileiras corrigindo quebras/espaços
 * extras (ex.: "R$ 582, 00" -> "R$ 582,00").
 */
function normalizeMoneyString(raw) {
    if (!raw || typeof raw !== 'string') return '';
    return raw
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/,\s+/g, ',')
        .replace(/R\$\s*/g, 'R$ ')
        .trim();
}

/**
 * Converte string "R$ 3.126,00" em número JS (3126).
 */
function parseBrazilianPrice(moneyStr) {
    if (!moneyStr) return 0;
    const cleaned = moneyStr
        .replace(/[^\d.,]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
    const val = parseFloat(cleaned);
    return Number.isFinite(val) ? Math.round(val * 100) / 100 : 0;
}

/**
 * Extrai mapa completo { [id]: priceInfo } das 7 páginas-fonte originais.
 */
function extractSourcePricesMap() {
    const pricesMap = new Map();
    const cardStartMarker = '<div class="storefront-cards collection-grid-card product-card';

    SOURCE_FILES.forEach(({ file, pageNum }) => {
        const fullPath = path.join(BASE_DIR, file);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Arquivo fonte não encontrado: ${fullPath}`);
        }

        const content = fs.readFileSync(fullPath, 'utf8');
        let pos = 0;

        while ((pos = content.indexOf(cardStartMarker, pos)) !== -1) {
            const nextPos = content.indexOf(cardStartMarker, pos + cardStartMarker.length);
            const paginatePos = content.indexOf('class="collection-paginate', pos);
            const endMarker = nextPos !== -1
                ? nextPos
                : (paginatePos !== -1 ? paginatePos : pos + 4500);
            const cardSnippet = content.slice(pos, endMarker);

            const idMatch = cardSnippet.match(/data-id="(\d+)"/);
            const saleMatch = cardSnippet.match(/data-element="sale-price"[^>]*>([\s\S]*?)<\/div>/i);
            const instMatch = cardSnippet.match(/<div class="installment-plan"[^>]*>([\s\S]*?)<\/div>/i);

            if (idMatch && saleMatch) {
                const id = idMatch[1];
                const saleFormatted = normalizeMoneyString(saleMatch[1]);
                const saleNumeric = parseBrazilianPrice(saleFormatted);

                const rawInstText = instMatch ? normalizeMoneyString(instMatch[1]) : '';
                const parsedInst = rawInstText.match(
                    /Em\s+(\d+)x\s+de\s+(R\$\s*[\d.,]+)\s+sem\s+juros(?:\s+ou\s+(R\$\s*[\d.,]+)\s+no\s+PIX)?/i
                );

                const installmentsCount = parsedInst ? parseInt(parsedInst[1], 10) : 10;
                const installmentValueFormatted = parsedInst
                    ? normalizeMoneyString(parsedInst[2])
                    : '';
                const pixFormatted = parsedInst && parsedInst[3]
                    ? normalizeMoneyString(parsedInst[3])
                    : '';
                const pixNumeric = pixFormatted ? parseBrazilianPrice(pixFormatted) : 0;

                const installmentsText = installmentValueFormatted
                    ? `Em ${installmentsCount}x de ${installmentValueFormatted} sem juros`
                    : '';

                if (!pricesMap.has(id)) {
                    pricesMap.set(id, {
                        id,
                        sourcePage: pageNum,
                        saleFormatted,
                        saleNumeric,
                        installmentsCount,
                        installmentValueFormatted,
                        installmentsText,
                        pixFormatted,
                        pixNumeric
                    });
                }
            }

            pos += cardStartMarker.length;
        }
    });

    return pricesMap;
}

/**
 * Gera o HTML padronizado do bloco de preço dentro do .foot-card.
 */
function buildCardPriceHtml(priceInfo) {
    if (!priceInfo || !priceInfo.saleFormatted) return '';

    const instStrong = priceInfo.installmentValueFormatted
        ? `${priceInfo.installmentsCount}x de ${priceInfo.installmentValueFormatted}`
        : '';

    const pixSpan = priceInfo.pixFormatted
        ? ` <span class="cdm-pix">ou <strong>${priceInfo.pixFormatted}</strong> no <strong>PIX</strong></span>`
        : '';

    const installmentHtml = instStrong
        ? `<div class="installment-plan"><span>Em <strong>${instStrong}</strong> sem juros${pixSpan}</span></div>`
        : '';

    return `<div class="product-card-price"><div class="currentPrice" data-element="price"><div class="price" data-element="sale-price">${priceInfo.saleFormatted}</div>${installmentHtml}</div></div>`;
}

function updateProductsDetailsJson() {
    const detailsPath = path.join(BASE_DIR, 'data', 'products_details.json');
    if (!fs.existsSync(detailsPath)) {
        throw new Error(`Arquivo não encontrado: ${detailsPath}`);
    }

    const pricesMap = extractSourcePricesMap();
    const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
    const keys = Object.keys(details);

    let updatedCount = 0;
    let missingCount = 0;

    keys.forEach(id => {
        const priceInfo = pricesMap.get(String(id));
        if (!priceInfo) {
            missingCount++;
            console.warn(`[AVISO] Preço não encontrado nas fontes originais para ID ${id}`);
            return;
        }

        details[id].price = {
            saleFormatted: priceInfo.saleFormatted,
            saleNumeric: priceInfo.saleNumeric,
            installmentsCount: priceInfo.installmentsCount,
            installmentValueFormatted: priceInfo.installmentValueFormatted,
            installmentsText: priceInfo.installmentsText,
            pixFormatted: priceInfo.pixFormatted,
            pixNumeric: priceInfo.pixNumeric
        };
        updatedCount++;
    });

    fs.writeFileSync(detailsPath, JSON.stringify(details, null, 2), 'utf8');
    console.log(`[OK] Preços extraídos: ${pricesMap.size} | Atualizados em products_details.json: ${updatedCount} | Ausentes: ${missingCount}`);

    if (missingCount > 0) {
        throw new Error(`${missingCount} produtos ficaram sem preço em products_details.json`);
    }
}

if (require.main === module) {
    updateProductsDetailsJson();
}

module.exports = {
    SOURCE_FILES,
    normalizeMoneyString,
    parseBrazilianPrice,
    extractSourcePricesMap,
    buildCardPriceHtml,
    updateProductsDetailsJson
};
