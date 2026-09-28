const fs = require('fs');
const orig = fs.readFileSync('site-catalogos-original.html', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

function getCard(html) {
    const start = html.indexOf('class="storefront-cards collection-grid-card product-card');
    const end = html.indexOf('class="storefront-cards collection-grid-card product-card', start + 1);
    return html.substring(start, end !== -1 ? end : start + 3000);
}

console.log('=== ORIGINAL CARD #1 ===');
console.log(getCard(orig));
console.log('=== INDEX CARD #1 ===');
console.log(getCard(index));
