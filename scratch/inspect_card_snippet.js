const fs = require('fs');

const c = fs.readFileSync('site-catalogos-original.html', 'utf8');
const p = c.indexOf('class="storefront-cards collection-grid-card product-card');
console.log('--- RAW CARD SNIPPET ---');
console.log(c.slice(p, p + 1400));
