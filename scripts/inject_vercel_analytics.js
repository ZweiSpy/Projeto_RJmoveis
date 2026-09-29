const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
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

const vercelSnippet = `
    <!-- Vercel Web Analytics & Speed Insights Oficiais -->
    <script>
        window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
        window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/insights/script.js"></script>
    <script defer src="/_vercel/speed-insights/script.js"></script>`;

const anteFoucCloseRegex = /(document\.documentElement\.setAttribute\('data-theme', theme\);\s*\}\s*catch\s*\(e\)\s*\{\}\s*\}\)\(\);\s*<\/script>)/;

pages.forEach(filename => {
    const filePath = path.join(BASE_DIR, filename);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('/_vercel/insights/script.js')) {
        console.log(`[PULADO] ${filename} já possui o script da Vercel.`);
        return;
    }

    if (anteFoucCloseRegex.test(content)) {
        content = content.replace(anteFoucCloseRegex, `$1\n${vercelSnippet}`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[OK] ${filename}: Vercel Web Analytics & Speed Insights injetados no <head>.`);
    } else {
        console.warn(`[AVISO] ${filename}: padrão ante-FOUC não encontrado para injeção.`);
    }
});
