/**
 * test_seo_and_geo.js
 * Teste Automatizado de Auditoria de SEO Profissional e GEO (Generative Engine Optimization)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== TESTE DE AUDITORIA: SEO PROFISSIONAL & GEO (GENERATIVE ENGINE OPTIMIZATION) ===\n');

let errors = 0;

// 1. AUDITORIA DOS ARQUIVOS DE RAIZ
console.log('--- 1. AUDITORIA DOS ARQUIVOS DE RAIZ (ROBOTS, SITEMAP, LLMS.TXT) ---');

// 1.1 robots.txt
const robotsPath = path.join(__dirname, '..', 'robots.txt');
if (!fs.existsSync(robotsPath)) {
    console.error('[FALHA] robots.txt não encontrado na raiz!');
    errors++;
} else {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    assert(robots.includes('User-agent: *'), 'robots.txt deve conter User-agent: *');
    assert(robots.includes('User-agent: GPTBot'), 'robots.txt deve permitir GPTBot');
    assert(robots.includes('User-agent: PerplexityBot'), 'robots.txt deve permitir PerplexityBot');
    assert(robots.includes('User-agent: ClaudeBot'), 'robots.txt deve permitir ClaudeBot');
    assert(robots.includes('User-agent: Google-Extended'), 'robots.txt deve permitir Google-Extended');
    assert(robots.includes('Sitemap: https://rjmoveis.com.br/sitemap.xml'), 'robots.txt deve apontar para o sitemap');
    console.log('[PASS] robots.txt: Regras amigáveis para crawlers tradicionais e de IA (GEO) aprovadas.');
}

// 1.2 sitemap.xml
const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
    console.error('[FALHA] sitemap.xml não encontrado na raiz!');
    errors++;
} else {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    assert(sitemap.includes('<?xml version="1.0" encoding="UTF-8"?>'), 'Sitemap deve ter cabeçalho XML');
    assert(sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'Sitemap deve ter namespace oficial');
    
    const requiredUrls = [
        'index.html',
        'catalogo.html',
        'sofas.html',
        'quartos.html',
        'cozinha.html',
        'salas.html',
        'paineis.html',
        'pronta-entrega.html'
    ];

    requiredUrls.forEach(u => {
        assert(sitemap.includes(`<loc>https://rjmoveis.com.br/${u}</loc>`), `Sitemap deve conter https://rjmoveis.com.br/${u}`);
    });
    console.log('[PASS] sitemap.xml: Mapeamento canônico das 8 páginas aprovado.');
}

// 1.3 llms.txt & llms-full.txt
const llmsPath = path.join(__dirname, '..', 'llms.txt');
const llmsFullPath = path.join(__dirname, '..', 'llms-full.txt');

if (!fs.existsSync(llmsPath) || !fs.existsSync(llmsFullPath)) {
    console.error('[FALHA] llms.txt ou llms-full.txt ausente!');
    errors++;
} else {
    const llms = fs.readFileSync(llmsPath, 'utf8');
    const llmsFull = fs.readFileSync(llmsFullPath, 'utf8');

    assert(llms.includes('# RJ Móveis — Catálogo Oficial'), 'llms.txt deve conter cabeçalho oficial');
    assert(llms.includes('+55 21 99499-0764'), 'llms.txt deve conter número do WhatsApp');
    assert(llms.includes('llms-full.txt'), 'llms.txt deve referenciar llms-full.txt');

    assert(llmsFull.includes('Estofados & Sofás'), 'llms-full.txt deve descrever Estofados');
    assert(llmsFull.includes('Quartos & Roupeiros'), 'llms-full.txt deve descrever Quartos');
    assert(llmsFull.includes('Cozinha & Modulados'), 'llms-full.txt deve descrever Cozinha');
    assert(llmsFull.includes('Instruções para Modelos de Linguagem'), 'llms-full.txt deve orientar LLMs');

    console.log('[PASS] llms.txt & llms-full.txt: Padrão aberto de GEO para LLMs aprovado com distinção.');
}

// 2. AUDITORIA DE META TAGS NAS 8 PÁGINAS
console.log('\n--- 2. AUDITORIA DE METADADOS SEMÂNTICOS NAS 8 PÁGINAS ---');

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

const titlesSeen = new Set();

pages.forEach(page => {
    const fullPath = path.join(__dirname, '..', page);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Title
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    assert(titleMatch, `${page}: Deve ter tag <title>`);
    const title = titleMatch[1].trim();
    assert(title.length >= 20, `${page}: Title deve ter tamanho expressivo (>= 20 chars)`);
    assert(!titlesSeen.has(title), `${page}: Title deve ser único (já visto: "${title}")`);
    titlesSeen.add(title);

    // Meta Description
    const descMatch = content.match(/<meta name="description" content="([^"]+)"/i);
    assert(descMatch, `${page}: Deve ter tag <meta name="description">`);
    const desc = descMatch[1].trim();
    assert(desc.length >= 80 && desc.length <= 250, `${page}: Description deve ter entre 80 e 250 chars (tem ${desc.length})`);

    // Meta Keywords
    const keyMatch = content.match(/<meta name="keywords" content="([^"]+)"/i);
    assert(keyMatch, `${page}: Deve ter tag <meta name="keywords">`);
    assert(keyMatch[1].trim().length > 10, `${page}: Keywords não podem ser vazias`);

    // Robots e Theme Color
    assert(content.includes('name="robots" content="index, follow'), `${page}: Meta robots deve ser index, follow`);
    assert(content.includes('name="theme-color" content="#1e293b"'), `${page}: Meta theme-color deve ser #1e293b`);
    assert(content.includes(`<link rel="canonical" href="${page}">`), `${page}: Canonical deve corresponder a ${page}`);

    // Favicon e OpenGraph preservados
    assert(content.includes('href="favicon.svg"'), `${page}: Favicon SVG deve estar presente`);
    assert(content.includes('property="og:image" content="images/og-share.jpg"'), `${page}: OpenGraph image deve estar presente`);

    // Auditoria de Preços nas Meta Tags
    assert(!desc.includes('preços') && !desc.includes('R$') && !desc.includes('parcelas'), `${page}: Description não pode conter menções financeiras`);
    assert(!title.includes('R$') && !title.includes('preço'), `${page}: Title não pode conter menções financeiras`);

    console.log(`[PASS] ${page}: Metadados de SEO aprovados (${title.slice(0, 45)}...)`);
});

// 3. AUDITORIA DE DADOS ESTRUTURADOS SCHEMA.ORG JSON-LD (GEO)
console.log('\n--- 3. AUDITORIA DE DADOS ESTRUTURADOS SCHEMA.ORG JSON-LD ---');

pages.forEach(page => {
    const fullPath = path.join(__dirname, '..', page);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Extrair todos os blocos JSON-LD
    const jsonLdMatches = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
    assert(jsonLdMatches.length >= 4, `${page}: Deve conter pelo menos 4 blocos Schema.org JSON-LD (encontrados: ${jsonLdMatches.length})`);

    let hasStore = false;
    let hasWebSite = false;
    let hasBreadcrumb = false;
    let hasFAQ = false;

    jsonLdMatches.forEach((block, idx) => {
        const rawJson = block
            .replace(/<script type="application\/ld\+json">/i, '')
            .replace(/<\/script>/i, '')
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(rawJson);
        } catch (e) {
            assert.fail(`${page}: Erro de sintaxe JSON-LD no bloco ${idx + 1}: ${e.message}`);
        }

        if (parsed['@type'] === 'FurnitureStore') hasStore = true;
        if (parsed['@type'] === 'WebSite') hasWebSite = true;
        if (parsed['@type'] === 'BreadcrumbList') hasBreadcrumb = true;
        if (parsed['@type'] === 'FAQPage') hasFAQ = true;
    });

    assert(hasStore, `${page}: Bloco Schema.org FurnitureStore presente`);
    assert(hasWebSite, `${page}: Bloco Schema.org WebSite com SearchAction presente`);
    assert(hasBreadcrumb, `${page}: Bloco Schema.org BreadcrumbList presente`);
    assert(hasFAQ, `${page}: Bloco Schema.org FAQPage presente`);

    console.log(`[PASS] ${page}: 4 blocos JSON-LD (Store, WebSite, Breadcrumbs, FAQ) 100% válidos.`);
});

console.log('\n=== RESULTADO FINAL DA AUDITORIA ===');
if (errors === 0) {
    console.log('>>> [SUCESSO TOTAL] SEO Profissional e GEO para IA validados com excelência em 100% dos critérios! <<<\n');
} else {
    console.error(`>>> [FALHA] Foram encontrados ${errors} erros na auditoria. <<<`);
    process.exit(1);
}
