const fs = require('fs');

['index.html', 'sofas.html', 'catalogo.html'].forEach(page => {
    const c = fs.readFileSync(page, 'utf8');
    const hEnd = c.indexOf('</header>');
    const secHeaderIdx = c.indexOf('class="section-header search-header"');
    console.log(`\n================== ${page} ==================`);
    console.log(c.substring(hEnd + 9, secHeaderIdx + 300).trim());
});
