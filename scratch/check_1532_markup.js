const fs = require('fs');

const catHtml = fs.readFileSync('catalogo.html', 'utf8');
const pos = catHtml.indexOf('1532');
console.log('Ocorrências de 1532 em catalogo.html:');
let p = 0;
let count = 0;
while ((p = catHtml.indexOf('1532', p)) !== -1 && count < 5) {
    console.log(`[${count}] pos: ${p}`);
    console.log(catHtml.slice(p - 60, p + 200));
    console.log('---');
    p += 4;
    count++;
}
