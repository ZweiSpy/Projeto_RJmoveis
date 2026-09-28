const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');

const styleTags = s.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
const allCss = styleTags.map(t => t.replace(/<\/?style[^>]*>/gi, '')).join('\n');

function searchCss(term) {
    console.log(`=== MATCHES FOR "${term}" ===`);
    let idx = 0;
    while ((idx = allCss.indexOf(term, idx)) !== -1) {
        const start = Math.max(0, allCss.lastIndexOf('{', idx) - 60);
        const prevSemi = Math.max(0, allCss.lastIndexOf(';', idx) - 60);
        const from = Math.max(start, prevSemi);
        const to = Math.min(allCss.length, allCss.indexOf('}', idx) + 1);
        console.log(allCss.substring(from, to).replace(/\s+/g, ' ').trim());
        idx += term.length;
    }
}

searchCss('.product-card');
searchCss('.collection-grid-card');
