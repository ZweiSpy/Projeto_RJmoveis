const fs = require('fs');
const html = fs.readFileSync('scratch/sample_product_1533.html', 'utf8');

const tabMatch = html.match(/<div class="tab-content">([\s\S]*?)<\/div>/i);
if (tabMatch) {
    console.log('--- CONTEÚDO TAB-CONTENT ---');
    console.log(tabMatch[1]);
}
