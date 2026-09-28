const fs = require('fs');

const html = fs.readFileSync('catalogo.html', 'utf8');
const cardRegex = /<div[^>]*class="[^"]*product-card[^"]*"[^>]*data-id="([^"]+)"[\s\S]*?<div[^>]*class="[^"]*product-card-title[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/gi;

let m;
const products = [];
while ((m = cardRegex.exec(html)) !== null) {
    products.push({
        id: parseInt(m[1], 10) || m[1],
        title: m[2].replace(/\s+/g, ' ').trim()
    });
}

console.log('Total products parsed:', products.length);
console.log('First 5 products:');
products.slice(0, 5).forEach(p => console.log(`ID: ${p.id} | Title: ${p.title}`));

console.log('\nTop 5 by highest ID (newest):');
const byIdDesc = [...products].sort((a, b) => (typeof b.id === 'number' && typeof a.id === 'number') ? b.id - a.id : 0);
byIdDesc.slice(0, 5).forEach(p => console.log(`ID: ${p.id} | Title: ${p.title}`));

console.log('\nTop 5 by Name A-Z:');
const byName = [...products].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
byName.slice(0, 5).forEach(p => console.log(`Title: ${p.title}`));
