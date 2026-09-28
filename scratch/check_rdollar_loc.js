const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const matches = [...html.matchAll(/R\$/g)];
console.log('Occurrences of R$ in index.html:', matches.length);

matches.forEach((m, idx) => {
    console.log(`\nMatch ${idx + 1} at position ${m.index}:`);
    console.log(html.substring(Math.max(0, m.index - 80), Math.min(html.length, m.index + 80)));
});
