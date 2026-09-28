const fs = require('fs');

['index.html', 'catalogo.html', 'sofas.html', 'quartos.html'].forEach(f => {
    const c = fs.readFileSync(f, 'utf8');
    const cards = c.match(/class="[^"]*product-card[^"]*"/g) || [];
    const withDataId = c.match(/data-id="\d+"/g) || [];
    console.log(`${f}: ${cards.length} cards, ${withDataId.length} com data-id`);
});
