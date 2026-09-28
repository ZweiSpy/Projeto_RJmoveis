const fs = require('fs');

function checkFile(filename) {
    if (!fs.existsSync(filename)) return;
    const content = fs.readFileSync(filename, 'utf8');
    const matches = content.match(/[^{}]*(?:product-card-information-add|immediate-delivery)[^{]*\{[^}]*\}/g);
    console.log(`=== Matches in ${filename} ===`);
    if (matches) {
        matches.forEach(m => console.log(m.trim()));
    } else {
        console.log('None found');
    }
}

checkFile('css/custom.css');
checkFile('index.html');
checkFile('site-catalogos-original.html');
