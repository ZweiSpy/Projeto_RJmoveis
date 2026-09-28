const fs = require('fs');
const s = fs.readFileSync('catalogo.html', 'utf8');
const matches = s.match(/name="limit"/g) || [];
console.log('Total name="limit" in catalogo.html:', matches.length);
const ids = s.match(/id="rj-select-per-page"/g) || [];
console.log('Total id="rj-select-per-page" in catalogo.html:', ids.length);
const selects = s.match(/<select[\s\S]*?<\/select>/g) || [];
console.log('Total <select> tags in catalogo.html:', selects.length);
selects.forEach((sel, i) => {
    console.log(`Select ${i}:`, sel.substring(0, 100));
});
