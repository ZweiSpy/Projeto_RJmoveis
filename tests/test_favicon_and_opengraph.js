/**
 * Teste Automatizado de Auditoria do Favicon SVG e Infraestrutura OpenGraph
 */
const fs = require('fs');
const path = require('path');

console.log('=== TESTE DE AUDITORIA: FAVICON SVG DE LUXO & OPENGRAPH ===\n');

let errors = 0;

// 1. Validar Favicon SVG
const faviconPath = path.join(__dirname, '..', 'favicon.svg');
if (!fs.existsSync(faviconPath)) {
  console.error('[FALHA] favicon.svg não foi encontrado na raiz!');
  errors++;
} else {
  const svg = fs.readFileSync(faviconPath, 'utf8');
  if (!svg.includes('<svg') || !svg.includes('</svg>') || !svg.includes('xmlns="http://www.w3.org/2000/svg"')) {
    console.error('[FALHA] favicon.svg com sintaxe XML/SVG inválida!');
    errors++;
  } else if (!svg.includes('bg-navy') || !svg.includes('gold-metal')) {
    console.error('[FALHA] favicon.svg sem os gradientes esperados!');
    errors++;
  } else {
    console.log(`[OK] favicon.svg validado com sucesso (${svg.length} bytes, gradientes nobres confirmados).`);
  }
}

// 2. Validar Imagem de Compartilhamento OpenGraph
const ogImagePath = path.join(__dirname, '..', 'images', 'og-share.jpg');
if (!fs.existsSync(ogImagePath)) {
  console.error('[FALHA] images/og-share.jpg não foi encontrado!');
  errors++;
} else {
  const stats = fs.statSync(ogImagePath);
  if (stats.size < 1000) {
    console.error(`[FALHA] images/og-share.jpg muito pequeno (${stats.size} bytes).`);
    errors++;
  } else {
    console.log(`[OK] images/og-share.jpg validado com sucesso (${stats.size} bytes).`);
  }
}

// 3. Validar Meta Tags nas 8 Páginas
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

const requiredTags = [
  'href="favicon.svg"',
  'property="og:type" content="website"',
  'property="og:site_name" content="RJ Móveis"',
  'property="og:image" content="images/og-share.jpg"',
  'property="og:image:width" content="1200"',
  'property="og:image:height" content="630"',
  'name="twitter:card" content="summary_large_image"',
  'name="twitter:image" content="images/og-share.jpg"'
];

pages.forEach(p => {
  const filePath = path.join(__dirname, '..', p);
  if (!fs.existsSync(filePath)) {
    console.error(`[FALHA] Arquivo não encontrado: ${p}`);
    errors++;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Validar tags essenciais
  requiredTags.forEach(tag => {
    if (!content.includes(tag)) {
      console.error(`[FALHA] ${p} não possui a tag: ${tag}`);
      errors++;
    }
  });

  // Validar og:title e og:description
  if (!content.includes('property="og:title"')) {
    console.error(`[FALHA] ${p} sem og:title`);
    errors++;
  }
  if (!content.includes('property="og:description"')) {
    console.error(`[FALHA] ${p} sem og:description`);
    errors++;
  }

  // Validar se canonical corresponde ao nome do arquivo
  if (!content.includes(`<link rel="canonical" href="${p}">`)) {
    console.error(`[FALHA] ${p} com tag canonical divergente!`);
    errors++;
  }

  // Auditar ausência de frases com preços nas meta tags
  const ogDescMatch = content.match(/property="og:description"\s+content="([^"]+)"/);
  if (ogDescMatch) {
    const desc = ogDescMatch[1];
    if (desc.includes('preços') || desc.includes('R$') || desc.includes('parcelas')) {
      console.error(`[FALHA] ${p} possui menção financeira na og:description: "${desc}"`);
      errors++;
    }
  }

  // Auditar ausência de link quebrado index.htmlfavicon
  if (content.includes('index.htmlfavicon')) {
    console.error(`[FALHA] ${p} ainda possui caminho quebrado index.htmlfavicon`);
    errors++;
  }

  console.log(`[OK] ${p}: Favicon, OpenGraph, Twitter Card e Canonical aprovados.`);
});

console.log('\n=== RESULTADO FINAL DA AUDITORIA ===');
if (errors === 0) {
  console.log('>>> [SUCESSO TOTAL] Favicon SVG de luxo e OpenGraph 100% aprovados sem erros! <<<');
  process.exit(0);
} else {
  console.error(`>>> [FALHA] Foram encontrados ${errors} erros durante a validação. <<<`);
  process.exit(1);
}
