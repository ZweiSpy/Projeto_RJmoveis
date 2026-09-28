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
  const c = fs.readFileSync(p, 'utf8');
  const m = c.match(/<head[\s\S]*?<\/head>/i);
  if (m) {
    const head = m[0];
    console.log(`=== ${p} ===`);
    const fav = head.match(/<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*>/gi);
    const og = head.match(/<meta[^>]*property=["']og:[^"']*["'][^>]*>/gi);
    console.log('Favicons:', fav);
    console.log('OGs:', og);
  }
});
