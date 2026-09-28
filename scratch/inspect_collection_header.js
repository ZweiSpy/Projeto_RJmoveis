const fs = require('fs');

function inspectHeader(filename) {
    if (!fs.existsSync(filename)) return;
    const html = fs.readFileSync(filename, 'utf8');
    const gridPos = html.indexOf('collection-grid');
    if (gridPos !== -1) {
        console.log(`=== ABOVE GRID IN ${filename} ===`);
        console.log(html.substring(gridPos - 2500, gridPos));
    }
}

inspectHeader('index.html');
inspectHeader('site-catalogos-original.html');
