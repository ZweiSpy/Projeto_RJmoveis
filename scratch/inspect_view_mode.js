const fs = require('fs');

['index.html'].forEach(f => {
    const html = fs.readFileSync(f, 'utf8');
    const pos = html.indexOf('<div class="collection-grid-column');
    const end = html.indexOf('class="collection-grid mode-grid', pos);
    console.log(html.substring(pos, end));
});




