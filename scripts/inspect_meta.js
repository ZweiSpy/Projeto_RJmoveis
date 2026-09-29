const fs = require('fs');

const pages = [
    'index.html',
    'catalogo.html',
    'sofas.html',
    'quartos.html',
    'cozinha.html',
    'salas.html',
    'paineis.html',
    'pronta-entrega.html'
];

pages.forEach(p => {
    const content = fs.readFileSync(p, 'utf8');
    const title = (content.match(/<title>([^<]+)<\/title>/) || [])[1] || 'NÃO ENCONTRADO';
    const ogTitle = (content.match(/property="og:title" content="([^"]+)"/) || [])[1] || 'NÃO ENCONTRADO';
    const metaDesc = (content.match(/<meta name="description" content="([^"]+)"/) || [])[1] || 'NÃO ENCONTRADO';
    const ogDesc = (content.match(/property="og:description" content="([^"]+)"/) || [])[1] || 'NÃO ENCONTRADO';

    console.log(`=== ${p} ===`);
    console.log(`  Title:     ${title}`);
    console.log(`  OG Title:  ${ogTitle}`);
    console.log(`  Meta Desc: ${metaDesc.slice(0, 60)}...`);
    console.log(`  OG Desc:   ${ogDesc.slice(0, 60)}...`);
});
