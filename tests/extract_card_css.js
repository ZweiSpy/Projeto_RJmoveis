const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');

const styleTags = s.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
const allCss = styleTags.map(t => t.replace(/<\/?style[^>]*>/gi, '')).join('\n');

const classes = [
    'product-card-thumbnail',
    'product-primary-img',
    'product-secondary-img',
    'card-body',
    'product-card-title',
    'product-card-information-add',
    'immediate-delivery',
    'foot-card',
    'template-cards'
];

classes.forEach(cls => {
    console.log(`=== CSS FOR .${cls} ===`);
    let idx = 0;
    while ((idx = allCss.indexOf('.' + cls, idx)) !== -1) {
        const start = Math.max(0, allCss.lastIndexOf('{', idx) - 60);
        const prevSemi = Math.max(0, allCss.lastIndexOf(';', idx) - 60);
        const from = Math.max(start, prevSemi);
        const to = Math.min(allCss.length, allCss.indexOf('}', idx) + 1);
        console.log(allCss.substring(from, to).replace(/\s+/g, ' ').trim());
        idx += cls.length + 1;
    }
});
