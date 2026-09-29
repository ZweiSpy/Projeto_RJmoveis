/**
 * apply_seo_and_geo.js
 * Aplica SEO Profissional e GEO (Generative Engine Optimization)
 * em todas as 8 páginas do catálogo da RJ Móveis e no construtor.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://rjmoveis.com.br';

const PAGES_DATA = {
    'index.html': {
        title: 'RJ Móveis — Catálogo Oficial de Móveis & Decoração de Alto Padrão',
        description: 'Catálogo exclusivo da RJ Móveis com mais de 500 modelos de sofás, quartos, salas e cozinhas. Design contemporâneo e atendimento humanizado via WhatsApp.',
        keywords: 'móveis rio de janeiro, catálogo rj móveis, sofás retráteis, decoração residencial, móveis alto padrão, comprar móveis rj',
        breadcrumbs: [
            { position: 1, name: 'Início', item: `${BASE_URL}/index.html` }
        ]
    },
    'catalogo.html': {
        title: 'Catálogo Completo com Busca Inteligente — Mais de 500 Móveis | RJ Móveis',
        description: 'Explore todo o acervo da RJ Móveis com busca inteligente em tempo real: estofados, dormitórios, modulados e salas de jantar com atendimento consultivo direto.',
        keywords: 'catálogo completo móveis, busca de móveis, comprar móveis rj, móveis pronta entrega, móveis de luxo rio de janeiro',
        breadcrumbs: [
            { position: 1, name: 'Início', item: `${BASE_URL}/index.html` },
            { position: 2, name: 'Catálogo Completo', item: `${BASE_URL}/catalogo.html` }
        ]
    },
    'sofas.html': {
        title: 'Estofados & Sofás Retráteis e Reclináveis — RJ Móveis',
        description: 'Coleção exclusiva de sofás retráteis, reclináveis e de canto em linho e veludo. Conforto absoluto, design sofisticado e consultoria direta no WhatsApp.',
        keywords: 'sofás retráteis rj, sofá reclinável linho, estofados de luxo, poltronas confortáveis, sofá de canto, estofados rio de janeiro',
        breadcrumbs: [
            { position: 1, name: 'Início', item: `${BASE_URL}/index.html` },
            { position: 2, name: 'Estofados & Sofás', item: `${BASE_URL}/sofas.html` }
        ]
    },
    'quartos.html': {
        title: 'Quartos, Roupeiros & Guarda-Roupas Espaçosos — RJ Móveis',
        description: 'Guarda-roupas de casal e solteiro, camas e cômodas funcionais com acabamento nobre em madeira e laca. Solicite catálogo via WhatsApp.',
        keywords: 'guarda-roupas casal rj, roupeiro portas de correr, móveis para quarto, camas e cômodas, quartos planejados rio de janeiro',
        breadcrumbs: [
            { position: 1, name: 'Início', item: `${BASE_URL}/index.html` },
            { position: 2, name: 'Quartos & Roupeiros', item: `${BASE_URL}/quartos.html` }
        ]
    },
    'cozinha.html': {
        title: 'Cozinhas Moduladas, Balcões & Aéreos — RJ Móveis',
        description: 'Cozinhas moduladas completas, armários aéreos, balcões e paneleiros funcionais com design inteligente e durabilidade. Consulte seu projeto no WhatsApp.',
        keywords: 'cozinhas moduladas rj, armários de cozinha, balcão cooktop, móveis para cozinha, cozinha compacta rio de janeiro',
        breadcrumbs: [
            { position: 1, name: 'Início', item: `${BASE_URL}/index.html` },
            { position: 2, name: 'Cozinha & Modulados', item: `${BASE_URL}/cozinha.html` }
        ]
    },
    'salas.html': {
        title: 'Salas de Jantar, Mesas & Cadeiras Estofadas — RJ Móveis',
        description: 'Mesas de jantar modernas e conjuntos de cadeiras estofadas com design refinado para momentos memoráveis. Atendimento direto e rápido no WhatsApp.',
        keywords: 'mesas de jantar rj, cadeiras estofadas, sala de jantar moderna, mesas 4 e 6 lugares, buffet sala de jantar',
        breadcrumbs: [
            { position: 1, name: 'Início', item: `${BASE_URL}/index.html` },
            { position: 2, name: 'Salas de Jantar & Mesas', item: `${BASE_URL}/salas.html` }
        ]
    },
    'paineis.html': {
        title: 'Painéis para TV, Racks & Home Theater — RJ Móveis',
        description: 'Painéis contemporâneos ripados e com iluminação LED, racks e bancadas para TVs de grande porte. Eleve a sofisticação da sua sala com a RJ Móveis.',
        keywords: 'painéis de tv rj, rack para sala, home theater moderno, painel ripado led, bancada tv rio de janeiro',
        breadcrumbs: [
            { position: 1, name: 'Início', item: `${BASE_URL}/index.html` },
            { position: 2, name: 'Painéis & Home', item: `${BASE_URL}/paineis.html` }
        ]
    },
    'pronta-entrega.html': {
        title: '⚡ Móveis com Pronta Entrega e Envio Rápido — RJ Móveis',
        description: 'Seleção especial de móveis com disponibilidade para entrega rápida. Sofás, roupeiros e mesas com atendimento ágil e prioritário no WhatsApp.',
        keywords: 'móveis pronta entrega rj, entrega rápida móveis, pronta entrega rj móveis, sofás pronta entrega, móveis envio imediato',
        breadcrumbs: [
            { position: 1, name: 'Início', item: `${BASE_URL}/index.html` },
            { position: 2, name: 'Pronta Entrega', item: `${BASE_URL}/pronta-entrega.html` }
        ]
    }
};

function generateSeoGeoHead(filename, data) {
    const breadcrumbListJson = JSON.stringify(data.breadcrumbs.map(b => ({
        "@type": "ListItem",
        "position": b.position,
        "name": b.name,
        "item": b.item
    })), null, 4);

    return `    <!-- ==================================================================== -->
    <!-- SEO PROFISSIONAL & CONFIGURAÇÕES CANÔNICAS -->
    <!-- ==================================================================== -->
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>${data.title}</title>
    <meta name="description" content="${data.description}">
    <meta name="keywords" content="${data.keywords}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="author" content="RJ Móveis">
    <meta name="copyright" content="RJ Móveis">
    <meta name="application-name" content="RJ Móveis">
    <meta name="theme-color" content="#1e293b">
    <meta name="msapplication-TileColor" content="#1e293b">

    <!-- Favicon SVG de Luxo -->
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="alternate icon" href="favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="favicon.svg">

    <!-- Open Graph / Redes Sociais / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="RJ Móveis">
    <meta property="og:url" content="${filename}">
    <meta property="og:title" content="${data.title}">
    <meta property="og:description" content="${data.description}">
    <meta property="og:image" content="images/og-share.jpg">
    <meta property="og:image:secure_url" content="images/og-share.jpg">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="RJ Móveis — Catálogo de Móveis de Luxo e Decoração">

    <!-- Twitter / X Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${data.title}">
    <meta name="twitter:description" content="${data.description}">
    <meta name="twitter:image" content="images/og-share.jpg">
    <meta name="twitter:image:alt" content="RJ Móveis — Catálogo de Móveis de Luxo e Decoração">

    <!-- Canonical URL -->
    <link rel="canonical" href="${filename}">

    <!-- ==================================================================== -->
    <!-- GEO (GENERATIVE ENGINE OPTIMIZATION) & SCHEMA.ORG JSON-LD PARA IA -->
    <!-- Otimizado para Perplexity, ChatGPT Search, Gemini e Claude -->
    <!-- ==================================================================== -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FurnitureStore",
      "@id": "${BASE_URL}/#organization",
      "name": "RJ Móveis",
      "alternateName": "Catálogo RJ Móveis",
      "url": "${BASE_URL}/",
      "logo": "${BASE_URL}/images/og-share.jpg",
      "image": "${BASE_URL}/images/og-share.jpg",
      "description": "Catálogo exclusivo de móveis residenciais e decoração com mais de 500 produtos em estofados, dormitórios, cozinhas moduladas e salas. Atendimento consultivo e humanizado via WhatsApp.",
      "telephone": "+55-21-99499-0764",
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Rio de Janeiro e Região Metropolitana"
      },
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "RJ",
        "addressCountry": "BR"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-21-99499-0764",
        "contactType": "sales",
        "contactOption": "HearingImpairedSupported",
        "availableLanguage": "Portuguese"
      }
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "${BASE_URL}/#website",
      "name": "RJ Móveis",
      "url": "${BASE_URL}/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${BASE_URL}/catalogo.html?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": ${breadcrumbListJson}
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Como comprar ou solicitar orçamento na RJ Móveis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O atendimento da RJ Móveis é 100% humanizado e direto pelo WhatsApp oficial (+55 21 99499-0764). Basta clicar no botão de contato em qualquer móvel do catálogo para falar com um consultor especialista."
          }
        },
        {
          "@type": "Question",
          "name": "Quais tipos de móveis estão disponíveis no catálogo da RJ Móveis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O catálogo conta com mais de 500 opções em sofás retráteis e reclináveis, guarda-roupas de casal e solteiro, camas, cozinhas moduladas, mesas de jantar com cadeiras estofadas e painéis de TV."
          }
        },
        {
          "@type": "Question",
          "name": "A RJ Móveis possui produtos com pronta entrega?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! A RJ Móveis disponibiliza uma seção exclusiva de móveis com pronta entrega para envio ágil e prioritário no Rio de Janeiro e região metropolitana."
          }
        },
        {
          "@type": "Question",
          "name": "Qual é a região de atendimento da RJ Móveis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Atendemos toda a cidade do Rio de Janeiro e municípios da Região Metropolitana (Niterói, São Gonçalo, Baixada Fluminense e adjacências), com cálculo de frete e prazos diretamente no WhatsApp."
          }
        }
      ]
    }
    </script>`;
}

// Regex para localizar o bloco antigo: da meta charset ISO-8859-1 até o <link rel="canonical" href="...">
const oldHeadRegex = /<meta name="charset" content="ISO-8859-1">[\s\S]*?<link rel="canonical" href="[^"]*">/;

let modifiedCount = 0;

Object.keys(PAGES_DATA).forEach(filename => {
    const fullPath = path.join(__dirname, '..', filename);
    if (!fs.existsSync(fullPath)) {
        console.error(`[ERRO] Arquivo não encontrado: ${filename}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const newHead = generateSeoGeoHead(filename, PAGES_DATA[filename]);

    if (oldHeadRegex.test(content)) {
        content = content.replace(oldHeadRegex, newHead);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`[OK] SEO & GEO aplicado com sucesso: ${filename}`);
        modifiedCount++;
    } else {
        console.log(`[AVISO] Bloco antigo não encontrado em ${filename}. Verificando se já foi atualizado.`);
    }
});

console.log(`\nProcessamento finalizado: ${modifiedCount} páginas atualizadas com SEO Profissional e GEO.`);
