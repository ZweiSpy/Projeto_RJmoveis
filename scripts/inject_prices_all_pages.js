/**
 * ====================================================================
 * inject_prices_all_pages.js
 * ====================================================================
 * Atualiza cirurgicamente todas as 8 páginas HTML em produção
 * preservando SEO/GEO, mobile-drawer, analytics e estrutura do grid:
 * 1. Injeta `data-price` e o bloco `.product-card-price` (à vista,
 *    10x sem juros e PIX) acima do botão `.btn-whatsapp-cta`.
 * 2. Adiciona opções `pricelow` (Menor preço) e `pricemax` (Maior preço)
 *    no seletor `#rj-select-sort`.
 * 3. Atualiza cache-busting para `v=2.3.0`.
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');
const { extractSourcePricesMap, buildCardPriceHtml } = require('./extract_prices_and_update_data');

const BASE_DIR = path.resolve(__dirname, '..');
const CACHE_VERSION = '2.5.0';

const TARGET_PAGES = [
    'index.html',
    'catalogo.html',
    'sofas.html',
    'quartos.html',
    'cozinha.html',
    'salas.html',
    'paineis.html',
    'pronta-entrega.html'
];

function injectPricesIntoGrid(gridSegment, pricesMap, pageName) {
    const cardStartMarker = '<div class="storefront-cards collection-grid-card product-card';
    const parts = gridSegment.split(cardStartMarker);
    if (parts.length <= 1) {
        throw new Error(`Nenhum card encontrado no grid de ${pageName}`);
    }

    let updatedCards = 0;

    for (let i = 1; i < parts.length; i++) {
        let cardChunk = parts[i];

        const openTagEnd = cardChunk.indexOf('>');
        if (openTagEnd === -1) {
            throw new Error(`Tag de abertura do card inválida em ${pageName} (card #${i})`);
        }

        let openTagAttrs = cardChunk.slice(0, openTagEnd);
        let cardRest = cardChunk.slice(openTagEnd);

        const idMatch = openTagAttrs.match(/data-id="(\d+)"/);
        if (!idMatch) {
            throw new Error(`Card sem data-id em ${pageName} (card #${i})`);
        }

        const productId = idMatch[1];
        const priceInfo = pricesMap.get(productId);
        if (!priceInfo) {
            throw new Error(`Preço ausente no mapa fonte para produto ID ${productId} (${pageName})`);
        }

        // Remove data-price anterior (idempotência) e injeta o valor numérico
        openTagAttrs = openTagAttrs.replace(/\sdata-price="[^"]*"/g, '');
        openTagAttrs = `${openTagAttrs} data-price="${priceInfo.saleNumeric}"`;

        // Localiza o .foot-card e o botão do WhatsApp dentro dele
        const footMarkerRegex = /(<div\s+class="foot-card[^"]*"[^>]*>)([\s\S]*?)(<a\s+href="https:\/\/wa\.me\/[^"]*"[^>]*class="btn-whatsapp-cta"[^>]*>)/i;
        if (!footMarkerRegex.test(cardRest)) {
            throw new Error(`Bloco .foot-card / .btn-whatsapp-cta não localizado no card ID ${productId} (${pageName})`);
        }

        const priceHtml = buildCardPriceHtml(priceInfo);
        cardRest = cardRest.replace(footMarkerRegex, (match, footOpen, between, ctaStart) => {
            // Remove qualquer .product-card-price preexistente para idempotência
            const cleanedBetween = between.replace(
                /<div\s+class="product-card-price"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi,
                ''
            ).trim();
            const prefix = cleanedBetween ? `${cleanedBetween} ` : ' ';
            return `${footOpen}${prefix}${priceHtml} ${ctaStart}`;
        });

        parts[i] = openTagAttrs + cardRest;
        updatedCards++;
    }

    return {
        html: parts.join(cardStartMarker),
        updatedCards
    };
}

function updateSortSelect(html) {
    const sortRegex = /(<select[^>]*id="rj-select-sort"[^>]*>)[\s\S]*?(<\/select>)/i;
    const optionsHtml = `
        <option value="bestsellers" selected>Mais vendidos</option>
        <option value="new">Novos lançamentos</option>
        <option value="name">Nome do produto (A-Z)</option>
        <option value="pricelow">Menor preço</option>
        <option value="pricemax">Maior preço</option>
    `;
    return html.replace(sortRegex, `$1${optionsHtml}$2`);
}

function bumpCacheVersion(html) {
    let updated = html.replace(/\?v=2\.[234]\.0/g, `?v=${CACHE_VERSION}`);
    updated = updated.replace(
        /<script src="js\/products-data\.js(?:\?v=[\d.]+)?"><\/script>/gi,
        `<script src="js/products-data.js?v=${CACHE_VERSION}"></script>`
    );
    return updated;
}

function applyDesignAndStabilityUpgrades(html, totalCards) {
    let updated = html;

    // 0. Remover scripts legados da Vercel (/ _vercel / -> 404 no GitHub Pages)
    updated = updated.replace(
        /\s*<!--\s*Vercel Web Analytics[\s\S]*?<script defer src="\/_vercel\/speed-insights\/script\.js"><\/script>/gi,
        '\n    <!-- Telemetria GitHub Pages (GA4 + Microsoft Clarity via js/analytics.js) -->'
    );
    updated = updated.replace(/<script[^>]*src="\/_vercel\/(?:insights|speed-insights)\/script\.js"[^>]*><\/script>\r?\n?/gi, '');

    // 1. Corrigir link quebrado do Google Fonts para carregar Plus Jakarta Sans (400..800)
    const brokenFontRegex = /<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?family=Source\+Sans\+3[^"]*"\s+rel="stylesheet">/i;
    const cleanFontsHtml = `<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;
    if (brokenFontRegex.test(updated)) {
        updated = updated.replace(brokenFontRegex, cleanFontsHtml);
    }

    // 2. Blindar ocultação do texto do alternador de tema no mobile em Dark Mode
    updated = updated.replace(
        /(\.rj-theme-toggle-header\s+\.theme-text-dark,\s*\.rj-theme-toggle-header\s+\.theme-text-light)\s*\{\s*display:\s*none\s*!important;\s*\}/i,
        `.rj-theme-toggle-header .theme-text-dark,
            .rj-theme-toggle-header .theme-text-light,
            [data-theme="dark"] .rj-theme-toggle-header .theme-text-dark,
            [data-theme="dark"] .rj-theme-toggle-header .theme-text-light {
                display: none !important;
            }`
    );

    // 3. Neutralizar consoleDebug e $.fn.autoComplete legados para zero erros no console
    if (!updated.includes('window.consoleDebug')) {
        updated = updated.replace(
            '<script> $(document).ready(function () { consoleDebug("sidecart"',
            '<script>window.consoleDebug = window.consoleDebug || function(){};</script>\n    <script> $(document).ready(function () { consoleDebug("sidecart"'
        );
    }
    updated = updated.replace(
        '$("#keywords, #frmbusca-mobi").autoComplete({',
        'if ($.fn && $.fn.autoComplete) $("#keywords, #frmbusca-mobi").autoComplete({'
    );

    // 4. Ajustar seletor de itens por página conforme quantidade real da página
    if (totalCards <= 24) {
        updated = updated.replace(
            /<div class="collection-limit(?:\s+hide-on-small-and-down|\s+rj-limit-hidden)*">/i,
            '<div class="collection-limit rj-limit-hidden">'
        );
    } else {
        updated = updated.replace(
            /<div class="collection-limit(?:\s+hide-on-small-and-down|\s+rj-limit-hidden)*">/i,
            '<div class="collection-limit">'
        );
        const perPageRegex = /(<select[^>]*id="rj-select-per-page"[^>]*>)[\s\S]*?(<\/select>)/i;
        const extraOpts = totalCards > 84
            ? `\n            <option value="120">120 por página</option>\n            <option value="all">Ver todos (${totalCards})</option>`
            : `\n            <option value="all">Ver todos (${totalCards})</option>`;
        updated = updated.replace(perPageRegex, `$1
            <option value="24" selected>24 por página</option>
            <option value="36">36 por página</option>
            <option value="48">48 por página</option>
            <option value="60">60 por página</option>
            <option value="72">72 por página</option>
            <option value="84">84 por página</option>${extraOpts}
        $2`);
    }

    return updated;
}

function run() {
    const pricesMap = extractSourcePricesMap();
    console.log(`Mapa de preços carregado: ${pricesMap.size} produtos únicos.\n`);

    TARGET_PAGES.forEach(filename => {
        const filePath = path.join(BASE_DIR, filename);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Página alvo não encontrada: ${filePath}`);
        }

        let html = fs.readFileSync(filePath, 'utf8');
        const gridStart = html.indexOf('id="rj-products-grid"');
        const gridEnd = html.indexOf('<!-- Fim do Grid de Produtos -->', gridStart);

        if (gridStart === -1 || gridEnd === -1) {
            throw new Error(`Marcadores do grid não localizados em ${filename}`);
        }

        const beforeGrid = html.slice(0, gridStart);
        const gridSegment = html.slice(gridStart, gridEnd);
        const afterGrid = html.slice(gridEnd);

        const { html: updatedGrid, updatedCards } = injectPricesIntoGrid(gridSegment, pricesMap, filename);
        let finalHtml = beforeGrid + updatedGrid + afterGrid;

        finalHtml = updateSortSelect(finalHtml);
        finalHtml = applyDesignAndStabilityUpgrades(finalHtml, updatedCards);
        finalHtml = bumpCacheVersion(finalHtml);

        const openDivs = (finalHtml.match(/<div[\s>]/gi) || []).length;
        const closeDivs = (finalHtml.match(/<\/div>/gi) || []).length;
        const divDelta = openDivs - closeDivs;

        if (divDelta !== 0) {
            throw new Error(`Desequilíbrio de <div> detectado em ${filename}: delta = ${divDelta}`);
        }

        const priceBlockCount = (finalHtml.match(/class="product-card-price"/g) || []).length;
        const ctaCount = (finalHtml.match(/data-product-name="[^"]+"/g) || []).length;

        fs.writeFileSync(filePath, finalHtml, 'utf8');
        console.log(
            `[OK] ${filename.padEnd(20)} -> ${updatedCards} cards | Blocos de preço: ${priceBlockCount} | CTAs: ${ctaCount} | Delta <div>: ${divDelta}`
        );
    });

    console.log(`\nTodas as ${TARGET_PAGES.length} páginas foram atualizadas com sucesso (v${CACHE_VERSION}).`);
}

if (require.main === module) {
    run();
}

module.exports = { run };
