const fs = require('fs');
const path = require('path');

const files = [
    'site-catalogos-original.html',
    'site-catalogo-p2',
    'site-catalogo-pg3.html',
    'site-catalogo-pg4.html',
    'site-catalagos-pg5.html',
    'site-catalagos-pg6.html',
    'site-catalagos-pg7.html'
];

const productsMap = new Map();

files.forEach(f => {
    const fullPath = path.join(__dirname, '..', f);
    if (!fs.existsSync(fullPath)) {
        console.warn(`Arquivo não encontrado: ${f}`);
        return;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const cardStartMarker = 'class="storefront-cards collection-grid-card product-card';
    let pos = 0;
    while ((pos = content.indexOf(cardStartMarker, pos)) !== -1) {
        const nextPos = content.indexOf(cardStartMarker, pos + cardStartMarker.length);
        const cardSnippet = content.slice(pos, nextPos !== -1 ? nextPos : pos + 3000);

        const idMatch = cardSnippet.match(/data-id="(\d+)"/);
        const urlMatch = cardSnippet.match(/href="([^"]+)"/);
        const titleAttrMatch = cardSnippet.match(/title="([^"]+)"/i);
        const titleLinkMatch = cardSnippet.match(/class="[^"]*product-card-title[^"]*"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
        const imgMatch = cardSnippet.match(/class="[^"]*product-primary-img[^"]*"[\s\S]*?src="([^"]+)"/i) ||
                         cardSnippet.match(/<img[^>]*class="[^"]*product-primary-img[^"]*"[^>]*src="([^"]+)"/i) ||
                         cardSnippet.match(/<img[^>]*src="([^"]+)"/i);

        if (idMatch && urlMatch) {
            const id = idMatch[1];
            let href = urlMatch[1].trim();
            if (href.startsWith('//')) {
                href = 'https:' + href;
            } else if (href.startsWith('/')) {
                href = 'https://www.catalogodemoveis.com.br' + href;
            }

            let cleanTitle = '';
            if (titleAttrMatch && titleAttrMatch[1].trim().length > 2) {
                cleanTitle = titleAttrMatch[1].trim();
            } else if (titleLinkMatch) {
                cleanTitle = titleLinkMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            }

            let mainImg = '';
            if (imgMatch) {
                mainImg = imgMatch[1];
            } else {
                const genericImgMatch = cardSnippet.match(/src="(https:\/\/[^"]+)"/i);
                if (genericImgMatch) mainImg = genericImgMatch[1];
            }

            if (!productsMap.has(id)) {
                productsMap.set(id, {
                    id: parseInt(id, 10),
                    title: cleanTitle,
                    url: href,
                    mainImage: mainImg
                });
            }
        }
        pos += cardStartMarker.length;
    }
});

const productsList = Array.from(productsMap.values()).sort((a, b) => a.id - b.id);

console.log(`Total de produtos únicos catalogados: ${productsList.length}`);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const outputPath = path.join(dataDir, 'products_catalog_map.json');
fs.writeFileSync(outputPath, JSON.stringify(productsList, null, 2), 'utf8');
console.log(`Arquivo salvo com sucesso em: ${outputPath}`);
