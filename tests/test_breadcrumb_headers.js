const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('===============================================================');
console.log('  TESTE DE VALIDAÇÃO: BREADCRUMBS, CABEÇALHOS H1 E SIDEBAR');
console.log('===============================================================');

const pages = [
    {
        file: 'index.html',
        isHome: true,
        expectedH1: 'Destaques do Catálogo',
        expectedCount: '12 produtos',
        expectedBreadcrumb: 'Início',
        activeKey: null
    },
    {
        file: 'catalogo.html',
        expectedH1: 'Catálogo Geral Completo',
        expectedCount: '523 produtos',
        expectedBreadcrumb: 'Catálogo Completo',
        activeDeptHref: 'catalogo.html'
    },
    {
        file: 'sofas.html',
        expectedH1: 'Estofados, Sofás & Poltronas',
        expectedCount: '191 produtos',
        expectedBreadcrumb: 'Estofados & Sofás',
        activeDeptHref: 'sofas.html'
    },
    {
        file: 'quartos.html',
        expectedH1: 'Quartos, Guarda-Roupas & Camas',
        expectedCount: '224 produtos',
        expectedBreadcrumb: 'Quartos & Roupeiros',
        activeDeptHref: 'quartos.html'
    },
    {
        file: 'cozinha.html',
        expectedH1: 'Cozinha, Armários & Modulados',
        expectedCount: '72 produtos',
        expectedBreadcrumb: 'Cozinha & Modulados',
        activeDeptHref: 'cozinha.html'
    },
    {
        file: 'salas.html',
        expectedH1: 'Salas de Jantar, Mesas & Cadeiras',
        expectedCount: '23 produtos',
        expectedBreadcrumb: 'Salas de Jantar & Mesas',
        activeDeptHref: 'salas.html'
    },
    {
        file: 'paineis.html',
        expectedH1: 'Painéis para TV, Racks & Home Theater',
        expectedCount: '13 produtos',
        expectedBreadcrumb: 'Painéis, Racks & Home',
        activeDeptHref: 'paineis.html'
    },
    {
        file: 'pronta-entrega.html',
        expectedH1: '⚡ Móveis com Pronta Entrega',
        expectedCount: '503 produtos',
        expectedBreadcrumb: '⚡ Pronta Entrega',
        activeDeptHref: 'pronta-entrega.html'
    }
];

let totalErrors = 0;

pages.forEach(p => {
    console.log(`\nVerificando página: ${p.file}...`);
    const filePath = path.resolve(p.file);
    if (!fs.existsSync(filePath)) {
        console.error(`  [ERRO] Arquivo não existe: ${p.file}`);
        totalErrors++;
        return;
    }

    const html = fs.readFileSync(filePath, 'utf8');

    // 1. Verificar ausência de index.html/ com barra
    const badSlashLink = (html.match(/href="index\.html\/"/gi) || []).length;
    if (badSlashLink > 0) {
        console.error(`  [FALHA] Encontrado(s) ${badSlashLink} link(s) com 'index.html/' terminando em barra!`);
        totalErrors++;
    } else {
        console.log(`  [OK] Sem links quebrados 'index.html/'`);
    }

    // 2. Verificar ausência do antigo h1 catalogo estático
    if (html.includes('<h1>catalogo</h1>')) {
        console.error(`  [FALHA] '<h1>catalogo</h1>' estático ainda está presente!`);
        totalErrors++;
    } else {
        console.log(`  [OK] Antigo '<h1>catalogo</h1>' devidamente removido`);
    }

    // 3. Verificar H1 oficial da página
    if (!html.includes(p.expectedH1)) {
        console.error(`  [FALHA] H1 esperado '${p.expectedH1}' não encontrado no HTML!`);
        totalErrors++;
    } else {
        console.log(`  [OK] H1 oficial: "${p.expectedH1}"`);
    }

    // 4. Verificar Contador oficial no cabeçalho
    if (!html.includes(p.expectedCount)) {
        console.error(`  [FALHA] Contador esperado '${p.expectedCount}' não encontrado!`);
        totalErrors++;
    } else {
        console.log(`  [OK] Contador oficial: "${p.expectedCount}"`);
    }

    // 5. Verificar Breadcrumb
    if (p.isHome) {
        if (html.includes('<span itemprop="name">Catalogo</span>')) {
            console.error(`  [FALHA] Home não pode apontar para Catalogo no breadcrumb!`);
            totalErrors++;
        } else {
            console.log(`  [OK] Breadcrumb da Home limpo, sem link estático para Catalogo`);
        }
    } else {
        if (!html.includes(p.expectedBreadcrumb)) {
            console.error(`  [FALHA] Breadcrumb não contém categoria '${p.expectedBreadcrumb}'!`);
            totalErrors++;
        } else {
            console.log(`  [OK] Breadcrumb correto apontando para: "${p.expectedBreadcrumb}"`);
        }

        // Link Home no breadcrumb deve ser index.html
        if (!html.includes('href="index.html" title="Página Inicial RJ Móveis"')) {
            console.error(`  [FALHA] Link Home no breadcrumb não aponta corretamente para index.html!`);
            totalErrors++;
        } else {
            console.log(`  [OK] Link de retorno para Home no breadcrumb perfeitamente formatado`);
        }
    }

    // 6. Verificar Sidebar Departamentos Ativo
    if (p.activeDeptHref) {
        const activeLinkPattern = new RegExp(`href="${p.activeDeptHref}"[^>]*class="[^"]*rj-dept-link active`, 'i');
        if (!activeLinkPattern.test(html)) {
            console.error(`  [FALHA] Departamento ativo '${p.activeDeptHref}' não possui classe active!`);
            totalErrors++;
        } else {
            console.log(`  [OK] Sidebar departamento ativo correto: "${p.activeDeptHref}"`);
        }
    } else if (p.isHome) {
        // Na Home, nenhum departamento deve estar marcado como active
        const hasActiveDept = /class="[^"]*rj-dept-link active/i.test(html);
        if (hasActiveDept) {
            console.error(`  [FALHA] Na Home nenhum departamento deve estar ativo!`);
            totalErrors++;
        } else {
            console.log(`  [OK] Na Home, nenhum departamento ativo indevidamente`);
        }
    }

    // 7. Verificar ausência de R$
    const rDollarMatches = (html.match(/R\$/g) || []).length;
    if (rDollarMatches > 0) {
        console.error(`  [FALHA] Encontradas ${rDollarMatches} ocorrências de 'R$'!`);
        totalErrors++;
    } else {
        console.log(`  [OK] Zero ocorrências de R$`);
    }
});

console.log('\n===============================================================');
if (totalErrors === 0) {
    console.log('  TODOS OS TESTES PASSARAM COM 100% DE SUCESSO! PARABÉNS!');
} else {
    console.error(`  FALHAS ENCONTRADAS: ${totalErrors} erros detectados.`);
    process.exit(1);
}
console.log('===============================================================');
