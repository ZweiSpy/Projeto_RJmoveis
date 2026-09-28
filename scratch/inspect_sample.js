const fs = require('fs');
const html = fs.readFileSync('scratch/sample_product_1533.html', 'utf8');

console.log('Tamanho do HTML:', html.length);

// 1. Descrição
const descMatch = html.match(/<section class="description"[\s\S]*?<\/section>/i);
if (descMatch) {
    console.log('\n--- SEÇÃO DESCRIPTION ENCONTRADA ---');
    console.log(descMatch[0].slice(0, 800));
} else {
    // Tentar outra tag
    const tabMatch = html.match(/<div class="tab-content"[\s\S]*?<\/div>/i);
    console.log('Tab content:', tabMatch ? tabMatch[0].slice(0, 500) : 'não achou');
}

// 2. Imagens da Galeria
const images = [];
const imgRegex = /data-fancybox="gallery"[^>]*href="([^"]+)"/gi;
let m;
while ((m = imgRegex.exec(html)) !== null) {
    if (!images.includes(m[1])) {
        images.push(m[1]);
    }
}
console.log('\n--- IMAGENS DA GALERIA ---', images.length);
images.forEach(img => console.log(' - ' + img));

// 3. Vídeo do Produto
const videoIframes = [];
const iframeRegex = /<iframe[^>]*src="([^"]*youtube[^"]*)"[^>]*>/gi;
while ((m = iframeRegex.exec(html)) !== null) {
    videoIframes.push(m[1]);
}
console.log('\n--- VÍDEOS ENCONTRADOS ---', videoIframes.length, videoIframes);

// 4. Medidas e Especificações
const specsMatch = html.match(/<table[^>]*class="[^"]*specifications[^"]*"[\s\S]*?<\/table>/i);
console.log('\n--- TABELA DE SPECS ---', specsMatch ? specsMatch[0].slice(0, 300) : 'Sem tabela');
