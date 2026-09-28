const fs = require('fs');

const files = [
    'site-catalogos-original.html',
    'site-catalogo-p2',
    'site-catalogo-pg3.html',
    'site-catalogo-pg4.html',
    'site-catalagos-pg5.html',
    'site-catalagos-pg6.html',
    'site-catalagos-pg7.html'
];

const products = new Map();

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    const c = fs.readFileSync(f, 'utf8');
    const cardStartMarker = 'class="storefront-cards collection-grid-card product-card';
    let pos = 0;
    while ((pos = c.indexOf(cardStartMarker, pos)) !== -1) {
        const nextPos = c.indexOf(cardStartMarker, pos + cardStartMarker.length);
        const cardSnippet = c.slice(pos, nextPos !== -1 ? nextPos : pos + 3000);
        
        const idMatch = cardSnippet.match(/data-id="(\d+)"/);
        const urlMatch = cardSnippet.match(/href="([^"]+)"/);
        const titleMatch = cardSnippet.match(/class="[^"]*product-card-title[^"]*"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);

        if (idMatch && urlMatch) {
            const id = idMatch[1];
            const href = urlMatch[1];
            const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'Móvel';
            if (!products.has(id)) {
                products.set(id, { id, href, title });
            }
        }
        pos += cardStartMarker.length;
    }
});

console.log('Total de produtos únicos com URL identificada:', products.size);

let sampleCount = 0;
for (const [id, p] of products.entries()) {
    if (sampleCount < 5) {
        console.log(`[${id}] ${p.title} -> ${p.href}`);
        sampleCount++;
    }
}
