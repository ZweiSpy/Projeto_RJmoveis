const fs = require('fs');
const s = fs.readFileSync('catalogo.html', 'utf8');
const start = s.indexOf('<div class="storefront-cards collection-grid-card product-card');
const next = s.indexOf('<div class="storefront-cards collection-grid-card product-card', start + 1);
console.log('--- FULL CARD HTML ---');
console.log(s.substring(start, next));
