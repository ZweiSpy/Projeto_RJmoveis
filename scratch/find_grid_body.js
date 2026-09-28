const fs = require('fs');

function findGridInBody(filename) {
    const html = fs.readFileSync(filename, 'utf8');
    const pos = html.indexOf('<div class="collection-grid');
    console.log(`=== ${filename}: <div class="collection-grid at ${pos} ===`);
    if (pos !== -1) {
        console.log(html.substring(pos - 1200, pos));
    }

}

findGridInBody('index.html');
findGridInBody('site-catalogos-original.html');
