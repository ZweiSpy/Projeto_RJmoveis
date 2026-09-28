/**
 * Script para injetar o Favicon SVG de Luxo e a infraestrutura completa de
 * OpenGraph e Twitter Cards em todas as 8 páginas do catálogo.
 */
const fs = require('fs');
const path = require('path');

const PAGES_CONFIG = [
  {
    file: 'index.html',
    url: 'index.html',
    title: 'RJ Móveis — Catálogo Oficial de Móveis & Decoração',
    description: 'Explore o catálogo exclusivo da RJ Móveis: sofás retráteis, salas de jantar, quartos e modulares de alto padrão. Atendimento direto via WhatsApp.'
  },
  {
    file: 'catalogo.html',
    url: 'catalogo.html',
    title: 'Catálogo Completo de Móveis — RJ Móveis',
    description: 'Confira a linha completa com mais de 500 opções de estofados, quartos, salas e cozinhas de luxo. Solicite seu atendimento exclusivo via WhatsApp.'
  },
  {
    file: 'sofas.html',
    url: 'sofas.html',
    title: 'Estofados & Sofás Retráteis — RJ Móveis',
    description: 'Sofás retráteis e reclináveis de alto padrão, poltronas confortáveis e tecidos nobres para transformar sua sala. Fale com nossos consultores.'
  },
  {
    file: 'quartos.html',
    url: 'quartos.html',
    title: 'Quartos, Roupeiros & Camas — RJ Móveis',
    description: 'Guarda-roupas espaçosos, camas e móveis funcionais para quartos elegantes e organizados. Conheça nossa seleção e solicite informações.'
  },
  {
    file: 'cozinha.html',
    url: 'cozinha.html',
    title: 'Cozinhas & Modulados — RJ Móveis',
    description: 'Armários, aéreos e cozinhas moduladas com acabamento premium e excelente durabilidade. Atendimento personalizado pelo WhatsApp.'
  },
  {
    file: 'salas.html',
    url: 'salas.html',
    title: 'Salas de Jantar, Mesas & Cadeiras — RJ Móveis',
    description: 'Mesas sofisticadas e cadeiras estofadas com design nobre para sua sala de jantar. Entre em contato para saber mais detalhes.'
  },
  {
    file: 'paineis.html',
    url: 'paineis.html',
    title: 'Painéis de TV & Home Theater — RJ Móveis',
    description: 'Painéis contemporâneos e racks refinados para elevar a sofisticação da sua sala de estar. Atendimento ágil e exclusivo.'
  },
  {
    file: 'pronta-entrega.html',
    url: 'pronta-entrega.html',
    title: '⚡ Móveis com Pronta Entrega — RJ Móveis',
    description: 'Móveis selecionados disponíveis para entrega rápida com agilidade e qualidade garantida. Chame no WhatsApp e garanta o seu.'
  }
];

let updatedCount = 0;

PAGES_CONFIG.forEach(cfg => {
  const filePath = path.join(__dirname, '..', cfg.file);
  if (!fs.existsSync(filePath)) {
    console.error(`[ERRO] Arquivo não encontrado: ${cfg.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Identificar início e fim do bloco legado de meta/favicons
  // Inicia após a tag google-site-verification
  const verificationTag = '<meta name="google-site-verification" content="BQlROMTHpNGZh7_h0v-Jha1pTOz2sk0fnhJLhIXMw3s">';
  const endMarker = '<!-- Tracker Matomo removido -->';

  const startIdx = content.indexOf(verificationTag);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error(`[ERRO] Marcadores não localizados em ${cfg.file}`);
    return;
  }

  const newMetaBlock = `
    <!-- Favicon SVG de Luxo -->
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="alternate icon" href="favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="favicon.svg">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="RJ Móveis">
    <meta property="og:url" content="${cfg.url}">
    <meta property="og:title" content="${cfg.title}">
    <meta property="og:description" content="${cfg.description}">
    <meta property="og:image" content="images/og-share.jpg">
    <meta property="og:image:secure_url" content="images/og-share.jpg">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="RJ Móveis — Catálogo de Móveis de Luxo e Decoração">

    <!-- Twitter / X Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${cfg.title}">
    <meta name="twitter:description" content="${cfg.description}">
    <meta name="twitter:image" content="images/og-share.jpg">
    <meta name="twitter:image:alt" content="RJ Móveis — Catálogo de Móveis de Luxo e Decoração">

    <!-- Canonical URL -->
    <link rel="canonical" href="${cfg.url}">
    `;

  const before = content.substring(0, startIdx + verificationTag.length);
  const after = content.substring(endIdx);

  content = before + newMetaBlock + after;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[SUCESSO] Meta tags & Favicon atualizados em: ${cfg.file}`);
  updatedCount++;
});

console.log(`\nFinalizado: ${updatedCount} de ${PAGES_CONFIG.length} páginas atualizadas com sucesso.`);
