const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const pos = html.indexOf('storefront-cards');
console.log('POSITION:', pos);
if (pos !== -1) {
    console.log(html.substring(pos + 3000, pos + 5000));
}


