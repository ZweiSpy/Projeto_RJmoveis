const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const regex = /class="[^"]*product-card-title[^"]*"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/g;
let m;
const titles = [];
while ((m = regex.exec(s)) !== null) {
    titles.push(m[1].replace(/\s+/g, ' ').trim());
}

console.log('Total products:', titles.length);
const categories = {
    'Sofás & Estofados': titles.filter(t => /sof[áa]|poltrona/i.test(t)).length,
    'Quartos & Guarda-Roupas': titles.filter(t => /guarda-roupa|cama|cabeceira|comoda/i.test(t)).length,
    'Salas de Jantar & Mesas': titles.filter(t => /mesa|cadeira|jantar/i.test(t)).length,
    'Painéis, Racks & Home': titles.filter(t => /painel|rack|home/i.test(t)).length,
    'Cozinha & Modulados': titles.filter(t => /cozinha|arm[áa]rio/i.test(t)).length,
};
console.log('Categories breakdown:', categories);
