const fs = require('fs');
const html = fs.readFileSync('catalogo.html', 'utf8');
console.log(html.substring(955700, 956200));
