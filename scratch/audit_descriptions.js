const fs = require('fs');

const details = JSON.parse(fs.readFileSync('data/products_details.json', 'utf8'));
const total = Object.keys(details).length;

console.log('Total de produtos em products_details.json:', total);

let emptyDesc = 0;
let shortDesc = 0;
let goodDesc = 0;
let withBr = 0;
let withHtml = 0;

const sampleKeys = [
    '1532', // Sofá Lima Bege
    '1533', // Sofá Lima Cinza
    '195',  // Cômoda
    '248',  // Cômoda Firenze
    '470',  // Mesa Office
    '908',  // Guarda-roupa Da Vinci
    '2308', // Mesa de Jantar Helo
    '3040', // Sofá Montreal
    '3568', // Colchão Casal
    '4282'  // Sofá Milão Chaise
];

console.log('\n--- AMOSTRA DE DESCRIÇÕES ---');
sampleKeys.forEach(k => {
    const p = details[k];
    if (!p) {
        console.log(`[ID ${k}] Não encontrado!`);
        return;
    }
    console.log(`\n[ID ${k}] ${p.title}`);
    console.log(`- Galeria: ${p.gallery ? p.gallery.length : 0} fotos`);
    console.log(`- Vídeo: ${p.youtubeVideo ? p.youtubeVideo.videoId : 'Nenhum'}`);
    console.log(`- Tamanho descrição: ${p.description ? p.description.length : 0} chars`);
    console.log(`- Trecho inicial:\n${p.description ? p.description.slice(0, 300) : 'VAZIO'}\n`);
});

for (const [id, p] of Object.entries(details)) {
    if (!p.description || p.description.trim().length === 0) {
        emptyDesc++;
    } else if (p.description.length < 80) {
        shortDesc++;
    } else {
        goodDesc++;
    }
    if (p.description && p.description.includes('<br')) withBr++;
    if (p.description && /<[a-z][\s\S]*>/i.test(p.description)) withHtml++;
}

console.log('--- ESTATÍSTICAS GERAIS DAS DESCRIÇÕES ---');
console.log(`Descrições vazias: ${emptyDesc}`);
console.log(`Descrições muito curtas (< 80 chars): ${shortDesc}`);
console.log(`Descrições ricas e completas: ${goodDesc}`);
console.log(`Descrições com quebras <br>: ${withBr}`);
console.log(`Descrições com tags HTML: ${withHtml}`);
