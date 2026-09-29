# SDD.md — Software Design Document (Documento de Design de Software)

## 1. Visão Geral do Sistema

### 1.1. Contexto e Objetivo
O **Projeto MeusMóveis** é uma aplicação web de catálogo interativo derivado do arquivo base autorizado `site-catalogos-original.html`. O sistema tem como propósito servir de vitrine virtual para divulgação e vendas diretas, direcionando o cliente para negociação e fechamento de pedidos humanizados via **WhatsApp**.

### 1.2. Metas Técnicas
- **Zero Exibição de Preços:** Supressão total de valores, parcelamentos e filtros financeiros.
- **Conversão Otimizada:** Substituição do fluxo de e-commerce tradicional por um CTA (Call to Action) direto para WhatsApp.
- **Nova Identidade Visual:** Aplicação consistente da paleta **Elegance Blue** através de CSS Custom Properties (Tokens).
- **Alta Performance:** Redução drástica do tempo de carregamento e remoção de scripts de rastreamento de terceiros.
- **Preservação de Integridade:** Manutenção integral da composição em grade, nomes e imagens originais dos produtos.

---

## 2. Arquitetura da Solução e Estrutura de Diretórios

O projeto adota uma arquitetura estática modular, rápida e sem dependência de frameworks pesados, garantindo carregamento instantâneo em qualquer dispositivo móvel ou desktop.

```
Projeto_MeusMoveis/
│
├── index.html                    # Vitrine inicial (84 produtos da Página 1)
├── catalogo.html                 # Catálogo Geral Completo (todos os 523 produtos)
├── sofas.html                    # Departamento Estofados & Sofás (191 produtos)
├── quartos.html                  # Departamento Quartos & Roupeiros (224 produtos)
├── cozinha.html                  # Departamento Cozinha & Modulados (72 produtos)
├── salas.html                    # Departamento Salas de Jantar & Mesas (23 produtos)
├── paineis.html                  # Departamento Painéis, Racks & Home (13 produtos)
├── pronta-entrega.html           # Seleção ⚡ Pronta Entrega (503 produtos)
│
├── css/
│   ├── tokens.css                # Design tokens (Elegance Blue + Dark Mode Alto Contraste)
│   └── custom.css                # Estilos do CTA WhatsApp, pulse FAB e ajustes de layout
│
├── js/
│   ├── theme-toggle.js           # Gerenciador de tema Dark/Light com suporte a localStorage
│   ├── catalog-search.js         # Busca instantânea em tempo real no catálogo
│   ├── catalog-sort.js           # Motor de ordenação dinâmica instantânea (Mais vendidos, Lançamentos, A-Z)
│   ├── catalog-pagination.js     # Paginação instantânea no cliente com seletor de limite por página
│   └── analytics.js              # Telemetria multicanal (GA4, Meta Pixel, Vercel Analytics)
│
├── scripts/
│   └── build_all_catalog_pages.js # Construtor mestre determinístico das 8 páginas
│
├── tests/
│   ├── test_sorting_and_view_removal.js # Suíte de validação de ordenação e toolbar limpa
│   ├── test_layout_and_analytics.js     # Suíte de validação de alinhamento e analytics
│   ├── test_pagination_functional.js    # Suíte de testes funcionais de paginação
│   ├── test_7pages_catalog.js           # Suíte de validação completa (168 testes)
│   └── test_correcoes_index.js          # Suíte de testes de regressão (23 testes)
│
├── AGENTS.md                     # Governança de papéis e diretrizes de trabalho
├── SDD.md                        # Documento de Design de Software (este arquivo)
├── Plan.md                       # Roadmap operacional e backlog de tarefas
└── README.md                     # Visão geral, guia de configuração e início rápido
```

---

## 3. Design System & Tokens Visuais (Paleta Elegance Blue)

A nova identidade visual substitui o tom laranja/marrom da loja original por uma paleta sofisticada, com azul marinho profundo, detalhes em bronze/dourado e neutros premium.

### 3.1. Mapeamento de Tokens CSS (`css/tokens.css`)

```css
:root {
    /* === PALETA ELEGANCE BLUE === */
    --color-primary-navy: #1e293b;         /* Azul Navy Profundo (Cabeçalho, textos de destaque) */
    --color-primary-navy-dark: #0f172a;    /* Navy ultra escuro (Bordas fortes, fundos nobres) */
    --color-primary-navy-light: #334155;   /* Navy médio (Subtítulos, ícones secundários) */
    
    --color-accent-bronze: #b45309;        /* Bronze / Dourado elegante (Destaques, badges) */
    --color-accent-bronze-hover: #d97706;  /* Bronze claro para efeitos hover */
    --color-accent-bronze-subtle: #fef3c7; /* Fundo suave para tags e destaques */

    /* === NEUTROS & ESTRUTURA === */
    --color-bg-body: #f8fafc;              /* Fundo geral da página (off-white frio) */
    --color-bg-card: #ffffff;              /* Fundo dos cards e contêineres */
    --color-text-main: #1e293b;            /* Cor principal do texto */
    --color-text-muted: #64748b;           /* Texto secundário e legendas */
    --color-border-subtle: #e2e8f0;        /* Bordas finas de separação */
    
    /* === CONVERSÃO WHATSAPP === */
    --color-whatsapp: #25d366;             /* Verde oficial do WhatsApp */
    --color-whatsapp-hover: #1ebd5b;       /* Verde WhatsApp Hover */
    --color-whatsapp-dark: #128c7e;        /* Verde escuro WhatsApp */
    --color-whatsapp-text: #ffffff;        /* Texto do botão WhatsApp */

    /* === MAPAS DE COMPATIBILIDADE (SOBRESCREVENDO O TEMA ORIGINAL) === */
    --cor-bg-login: var(--color-primary-navy);
    --cor-realce-cb-menu: var(--color-accent-bronze);
    --cor-txt-menu: var(--color-primary-navy);
    --cor-bg-tag-lanc: var(--color-accent-bronze);
    --cor-bg-tag-exclus: var(--color-primary-navy);
    --cor-bg-btn-nwes: var(--color-primary-navy);
    --cor-bg-corpo: var(--color-bg-body);
    --cor-txt-nome-prto: var(--color-text-main);
    
    --jc-marca: var(--color-primary-navy);
    --jc-marca-escuro: var(--color-primary-navy-dark);
    --jc-marca-claro: var(--color-accent-bronze-subtle);
    --jc-marca-borda: var(--color-border-subtle);
    --jc-marrom: var(--color-primary-navy);
    --jc-texto: var(--color-text-main);
    --jc-texto-suave: var(--color-text-muted);
}
```

---

## 4. Estratégia de Higienização e Supressão de Valores

### 4.1. Elementos a Serem Ocultados e Removidos
Todos os elementos com conotação financeira são suprimidos do DOM ou ocultados de forma irreversível:

| Elemento no Original | Seletor CSS / Alvo | Ação Técnica |
| :--- | :--- | :--- |
| Preço de Venda do Card | `.product-card-price`, `.currentPrice` | Removido / Substituído pelo CTA WhatsApp |
| Parcelamento e PIX | `.installment-plan`, `.cdm-pix` | Removido do DOM |
| Slider de Preço na Sidebar | `.sidebar-filter-block.filter--price` | Bloco completamente removido do HTML |
| Opções de Ordenação por Preço | `select[name="sort"] option[value*="price"]` | Removidas do elemento `<select>` |
| Opção de Maior Desconto | `select[name="sort"] option[value="maxdiscount"]` | Removida do elemento `<select>` |

### 4.2. Manutenção do Alinhamento do Grid (Anti-Quebra Visual)
No layout original, o bloco de preço `.product-card-price` ocupava uma altura mínima de aproximadamente `58px`. A sua remoção abrupta poderia desalinhá-los em telas grandes.

**Solução de Design:**
O container `.foot-card` passa a abrigar exclusivamente o botão CTA **"Chame no WhatsApp agora"**, mantendo altura uniforme e ancorado na base do card com `display: flex; flex-direction: column; justify-content: flex-end;`.

```css
/* css/custom.css */
.product-card-price,
.sidebar-filter-block.filter--price,
.jc-card--buy .currentPrice {
    display: none !important;
}

.foot-card {
    padding-top: 12px;
    margin-top: auto;
    width: 100%;
}
```

---

## 5. Mecanismo de Conversão via WhatsApp (CTA Engine)

### 5.1. UX do Botão de Conversão
Cada card de produto terá um botão proeminente, com ícone do WhatsApp, texto convidativo e efeito hover moderno:

```html
<a href="#" 
   class="btn-whatsapp-cta" 
   data-product-name="Sofá Retrátil Reclinável Lima 2,00m Linho Cinza A59 - Sem Caixa"
   title="Falar com vendedor sobre este móvel">
    <svg class="whatsapp-icon" viewBox="0 0 24 24">...</svg>
    <span>Chame no WhatsApp agora</span>
</a>
```

### 5.2. Lógica de Disparo (`js/whatsapp-cta.js`)
O script centraliza a configuração do vendedor e monta a URL com codificação segura de caracteres (URI component):

```javascript
const WHATSAPP_CONFIG = {
    // Número com DDI e DDD oficial RJ Móveis (Definido por Zwei)
    phoneNumber: "5521994990764", // (21) 99499-0764 
    
    // Template de mensagem
    buildMessage: function(productName) {
        return `Olá! Vi o catálogo e gostaria de mais informações e atendimento sobre: *${productName}*. Pode me ajudar?`;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".btn-whatsapp-cta").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const productName = button.getAttribute("data-product-name") || "um móvel do catálogo";
            const text = encodeURIComponent(WHATSAPP_CONFIG.buildMessage(productName));
            const url = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${text}`;
            window.open(url, "_blank", "noopener,noreferrer");
        });
    });
});
```

---

## 6. Arquitetura de Performance e Otimização

### 6.1. Diagnóstico do Arquivo Base (`site-catalogos-original.html`)
- **Tamanho:** ~892 KB (Arquivo HTML massivo).
- **Gargalos:**
  - Milhares de linhas de CSS redundantes e duplicadas no `<head>`.
  - SVGs de ícones replicados diretamente em nós do DOM.
  - Script de analytics externo (`iset.io / Matomo`) que atrasa o carregamento e gera requisições externas desnecessárias.

### 6.2. Estratégia de Otimização no `index.html`
1. **Eliminação de Trackers:** Remoção completa dos scripts de Matomo e Google Tag Manager pertencentes ao lojista de origem.
2. **Separação de CSS:** Estilos customizados e tokens isolados em arquivos `.css` externos, permitindo cache do navegador.
3. **Lazy Loading de Imagens:** Garantir que todas as imagens de produtos possuam `loading="lazy"` e atributos `decoding="async"`.
4. **Preconnect e DNS-Prefetch:** Manter preconnect apenas para os CDNs de imagem necessários (`cdn.entrypoint.directory` e Google Fonts).

---

## 8. Arquitetura Multi-Páginas, Paginação e Vitrine Reduzida

### 8.1. Estrutura de Páginas do Catálogo
O catálogo divide os **523 produtos únicos** em 8 pontos de entrada estáticos de alta performance:
1. `index.html`: Vitrine com os **12 melhores destaques** + banner interativo para o catálogo completo.
2. `catalogo.html`: Catálogo geral completo com **todos os 523 itens**.
3. `sofas.html`: 191 estofados, sofás e poltronas.
4. `quartos.html`: 224 quartos, guarda-roupas, camas e cabeceiras.
5. `cozinha.html`: 72 armários, balcões e cozinhas moduladas.
6. `salas.html`: 23 mesas de jantar, cadeiras e conjuntos.
7. `paineis.html`: 13 painéis ripados, racks e home theaters.
8. `pronta-entrega.html`: 503 móveis marcados com entrega ágil no RJ.

### 8.2. Motor de Paginação Dinâmica Instantânea (`js/catalog-pagination.js`)
- Conecta-se diretamente ao painel `<select name="limit">` existente na interface (`#rj-select-per-page`).
- Oferece suporte nativo a 24, 36, 48, 60, 72 e 84 itens por página (padrão: 24).
- Executa a paginação diretamente no DOM do cliente em milissegundos sem recarregar a página.
- **Resolução de Especificidade CSS:** Como os cards possuem `.storefront-cards.product-card { display: flex !important; }`, a ocultação dos cards fora da fatia atual é gerida com a classe dedicada `.page-hidden` associada à regra `.storefront-cards.product-card.page-hidden { display: none !important; }` no `css/custom.css`, combinada com `style.setProperty('display', 'none', 'important')`, garantindo 100% de compatibilidade em todos os navegadores modernos.
- Renderiza janela de navegação adaptativa (`1 2 3 ... 22`) com rolagem suave ao topo da grade.
- Integra-se em tempo real com `js/catalog-search.js` para paginar apenas itens correspondentes à busca.

### 8.3. Alinhamento Uniforme e Equilíbrio Visual dos Cards
Para neutralizar colagem com a imagem, eliminar palavras cortadas e preencher o vão até o botão:
- `.storefront-cards.product-card`: `min-height: 415px !important;` (calibrado exatamente para a soma de thumbnail, margem de respiro, título de 3 linhas, selo e CTA WhatsApp, eliminando qualquer vazio desproporcional).
- `.storefront-cards.product-card .product-card-thumbnail`: Altura uniforme de `220px !important;` com `margin-bottom: 14px !important;` e `padding: 8px 8px 10px 8px !important;`. O link do produto (`a.product-link`) possui `margin-bottom: 12px !important;`, assegurando 18px de respiro físico e arejado em relação à imagem.
- `.storefront-cards.product-card .product-card-title`: Capacidade total para 3 linhas com altura fixa de `62px !important; min-height: 62px !important; max-height: 62px !important;`, `font-size: 0.875rem`, `line-height: 1.35` e `-webkit-line-clamp: 3 !important;`. Garante que nomes extensos com medidas e marcas sejam exibidos integralmente sem qualquer corte horizontal de palavras ou caracteres. Títulos de 1 ou 2 linhas são centralizados verticalmente via flexbox, mantendo perfeita uniformidade entre todos os cards.
- `.storefront-cards.product-card .product-card-marks`: Flutuante em posição absoluta no topo superior esquerdo da foto (`top: 14px; left: 14px;`), exibindo selos ("Oferta", "100% MDF") sobre a foto sem ocupar altura do corpo.
- `.storefront-cards.product-card .product-card-information-add`: Forçado para `position: static !important; top: auto !important;` no fluxo normal do corpo do card com altura de `28px !important;` e `margin: 4px 0 8px 0 !important;`. Estiliza "Pronta Entrega" como pílula dourada com ícone ⚡, posicionando-se elegantemente entre o título e o botão WhatsApp, preenchendo o vazio vertical e mantendo a régua horizontal idêntica mesmo em cards sem o selo.
- `.storefront-cards.product-card .foot-card`: Fixado na base com `margin-top: auto !important;` e `padding: 2px 10px 12px 10px !important;`, posicionando o botão do WhatsApp imediatamente abaixo do conteúdo com espaçamento milimetricamente equilibrado.

### 8.4. Remoção de Seletores Obsoletos e Motor de Ordenação Dinâmica (`js/catalog-sort.js`)
Para proporcionar uma interface limpa, focada e sem poluição visual:
1. **Eliminação do Seletor de Colunas do Grid (`.collection-grid-column`):** Removidos todos os botões e links de alternância de 2, 3 e 4 colunas (`?grid=2`, `?grid=3`, `?grid=4`). O catálogo adota um grid responsivo padrão único e uniforme (4 colunas em telas grandes, 3 em intermediárias e 2 em mobile).
2. **Eliminação do Alternador de Modo de Exibição (`.collection-view-mode`):** Removidos todos os botões de alternância de visualização (`?view=grid`, `?view=list`). O catálogo é apresentado exclusivamente em formato de cards visuais.
3. **Motor de Ordenação Dinâmica Instantânea (`#rj-select-sort`):**
   - Implementado no cliente em `js/catalog-sort.js` sem requisição ao servidor.
   - Suporta 3 critérios oficiais derivados do catálogo principal:
     - **Mais vendidos (`bestsellers`):** Preserva a curadoria de destaque original da loja.
     - **Novos lançamentos (`new`):** Ordena os produtos de forma decrescente pelo identificador `data-id` (IDs mais recentes primeiro).
     - **Nome do produto (`name`):** Ordena alfabeticamente de A a Z utilizando `localeCompare('pt-BR', { sensitivity: 'base', numeric: true })`.
   - **Arquitetura de Alta Performance (60 FPS / Zero Congelamento de Aba):**
     - **Batch DOM Update via DocumentFragment:** Em vez de realizar 523 `appendChild` no DOM vivo (o que provocava Forced Synchronous Layout / Layout Thrashing), os cards ordenados são montados em memória fora da árvore DOM e anexados em uma **única operação atômica de reflow**.
     - **Paginação Linear O(N):** O motor de paginação utiliza uma passada única sobre os elementos com verificação prévia de estado de classe, evitando mais de 270.000 buscas com `indexOf` e eliminando manipulações desnecessárias de estilo.
     - **Desacoplamento Assíncrono da UI:** A execução do cálculo é descolada da thread principal através de um micro-tick (`setTimeout 16ms`), permitindo que a interface do usuário feche o menu dropdown nativo instantaneamente com feedback visual sutil de opacidade.
     - **Isolamento de Formulários:** Remoção completa da tag `<form>` em torno dos controles, prevenindo submissões fantasmas e interferência de handlers legados de e-commerce (`blockUI`).
   - **Zero Preços:** Opções de menor preço, maior preço e maior desconto foram suprimidas de acordo com o protocolo de governança.

---

## 9. Motor de Telemetria e Analytics (`js/analytics.js`)

### 9.1. Suporte Plug-and-Play Multicanal
O script centraliza a telemetria em um único arquivo modular, com auto-carregamento dinâmico:
- **Google Analytics 4 (GA4):** Dispara `page_view` e evento de conversão `click_whatsapp` com `product_name`, `button_location` e URL.
- **Meta Pixel (Facebook / Instagram):** Dispara `PageView` e evento customizado `WhatsAppClick`.
- **Vercel Analytics:** Integração nativa com `window.va('event', ...)` para métricas na hospedagem Vercel.
- **Armazenamento Local Autônomo:** Gravação dos últimos 200 eventos em `localStorage` para consulta independente.

### 9.2. Consulta de Relatórios
- **No Console:** Digitar `RJ_Analytics.relatorio()` exibe tabela formatada com total de visualizações, cliques no WhatsApp, páginas mais acessadas e produtos mais procurados.
- **Na URL:** Adicionar `?analytics=1` em qualquer página imprime o relatório automaticamente.

---

---

## 11. Sincronização Dinâmica de Navegação (Breadcrumb, H1 e Sidebar)

### 11.1. Breadcrumb Oficial Dinâmico (`buildBreadcrumb`)
- **Página Inicial (`index.html`):** O breadcrumb renderiza de forma limpa apenas `Início`, sem flechas ou apontamentos indevidos para categorias.
- **Páginas de Categoria (`sofas.html`, `quartos.html`, etc.):** O breadcrumb gera `<a href="index.html">Home</a> > <span>[Nome da Categoria]</span>`, com URL estritamente limpa para a Home (sem a barra terminal `/` legada `index.html/`), restaurando a navegabilidade instantânea em qualquer ambiente de hospedagem.

### 11.2. Cabeçalho H1 Oficial da Categoria com Contagem Real (`buildCategoryHeader`)
- Elimina o nó legada estático `<h1>catalogo</h1>(<b>523</b> produtos)` em favor de um bloco moderno `.section-header.search-header.rj-catalog-header`.
- Exibe o título oficial da categoria e a contagem real e precisa de itens pertencentes àquele filtro:
  - `index.html`: `Destaques do Catálogo` `(12 produtos)`
  - `catalogo.html`: `Catálogo Geral Completo` `(523 produtos)`
  - `sofas.html`: `Estofados, Sofás & Poltronas` `(191 produtos)`
  - `quartos.html`: `Quartos, Guarda-Roupas & Camas` `(224 produtos)`
  - `cozinha.html`: `Cozinha, Armários & Modulados` `(72 produtos)`
  - `salas.html`: `Salas de Jantar, Mesas & Cadeiras` `(23 produtos)`
  - `paineis.html`: `Painéis para TV, Racks & Home Theater` `(13 produtos)`
  - `pronta-entrega.html`: `⚡ Móveis com Pronta Entrega` `(503 produtos)`
- Remove qualquer duplicação de títulos dentro do grid, mantendo uma hierarquia visual limpa e elegante.

### 11.3. Sidebar de Departamentos Isolada (`buildSidebar`)
- Utiliza a classe proprietária `.rj-sidebar-departments` e links `.rj-dept-link`, desvinculando-se do CSS legado da loja original (`.options__item`, `.checked`, `.color-mini`).
- Destaca com exclusividade a categoria ativa correspondente (`class="active"`), exibindo o bullet dourado luminoso (`.rj-dept-bullet`) e a contagem de produtos em alto contraste.
- Na Home (`index.html`), nenhum departamento fica marcado indevidamente como ativo, permitindo ao usuário navegar com clareza.
- Suporte total a Light Mode e Dark Mode via tokens CSS.

---

## 12. Modal Flutuante de Detalhes do Produto (`js/product-modal.js`)

### 12.1. Propósito e Requisitos de Negócio
- **Substituição de Páginas Externas:** Transforma as páginas únicas e lentas de cada item em janelas/cards flutuantes (Quick-View Modal), exibindo apenas as informações de valor: fotos em alta resolução, vídeos e especificações técnicas de medidas e conforto.
- **Zero Exibição de Valores:** Supressão absoluta de preços, parcelas, PIX ou cartões dentro das descrições.
- **Vídeo Sob Demanda (Lazy Load):** Quando o produto possui vídeo gravado no YouTube, o player não é carregado previamente para economizar banda e tempo de renderização; ele é ativado exclusivamente mediante clique no botão *"Assistir Vídeo do Produto"*.
- **Conversão Humanizada:** CTA em verde WhatsApp (`#25D366`) que abre diretamente o contato com mensagem contendo o nome exato do item selecionado.

### 12.2. Base de Dados Consolidada (`data/products_details.json`)
- Mapeamento completo e determinístico de todos os 523 itens únicos do catálogo extraídos dos 7 arquivos fonte.
- Estrutura de dados por item:
  ```json
  {
    "id": 1533,
    "title": "Sofá Retrátil Reclinável Lima 2,00m Linho Cinza A59 - Sem Caixa",
    "url": "https://www.catalogodemoveis.com.br/sofa-retratil-reclinavel-lima-2-00m-linho-cinza-a59-sem-caixa-p1533",
    "mainImage": "https://cdn.entrypoint.directory/assets/73084/produtos/1533/...",
    "description": "Medidas, estrutura, conforto e acabamento sem menções financeiras...",
    "gallery": [ "url_foto_1", "url_foto_2", ... ],
    "youtubeVideo": {
      "embedUrl": "https://www.youtube.com/embed/XxGZgxCdew8",
      "videoId": "XxGZgxCdew8"
    }
  }
  ```
- **Carregamento Otimizado:** Arquivo estático carregado assincronamente pelo navegador e mantido em cache de memória local (`productsCache`), proporcionando abertura instantânea (< 10ms) ao clicar em qualquer produto.

### 12.3. Componente e Acessibilidade
- **Backdrop com Efeito Blur:** Fundo com `backdrop-filter: blur(8px)` e paleta Elegance Blue.
- **Controle de Teclado e Foco:** Fechamento com tecla `ESC`, clique no botão `&times;` ou clique fora da área do diálogo.
- **Trava de Rolagem:** Classe `body.modal-open { overflow: hidden; }` impede rolagem indesejada do fundo da página enquanto o modal estiver aberto.
- **Compatibilidade:** Suporte pleno a Light Mode e Dark Mode.

### 12.4. Arquitetura Standalone Zero-CORS (`js/products-data.js`)
- **Problema Resolvido:** Quando o catálogo é executado localmente via protocolo `file:///` (dois cliques em qualquer arquivo `.html`), as chamadas assíncronas `fetch('data/products_details.json')` são bloqueadas pelas políticas de segurança CORS da maioria dos navegadores modernos (Chrome, Edge, Firefox), resultando em falhas silenciosas e ativação de fallbacks estáticos.
- **Solução Arquitetural:** Compilação do banco de dados completo de 523 itens em um script nativo (`js/products-data.js`), expondo o objeto global imutável `window.RJ_PRODUCTS_DATA`.
- **Performance Imediata (0ms):** Acesso síncrono em memória local sem sobrecarga de rede, dispensando qualquer requisição HTTP ou servidor local ativo.
- **Fallback Resiliente:** Caso o script não esteja presente, `js/product-modal.js` mantém fallback assíncrono via `fetch()`, garantindo compatibilidade total em ambientes hospedados HTTP/HTTPS.

### 12.5. Motor de Formatação Semântica de Especificações (`formatProductDescription`)
- **Limpeza Inteligente de Ruído:** O texto bruto extraído com múltiplos `<br />` sucessivos é higienizado e normalizado.
- **Segmentação Semântica Automática:**
  - Títulos de seções técnicas (`Medidas`, `Conforto`, `Funcionamento`, `Estrutura`, `Acabamento`, `Acompanha`, `Peso suportado`) são convertidos em tags `<h4>` estilizadas (`.modal-spec-section-title`) com separador sutil e caixa alta refinada.
  - Linhas com marcadores de especificação (`- Largura: 2,00m`, `- Madeira de eucalipto`) são agrupadas em listas estruturadas `<ul>` (`.modal-spec-list`) com bullets dourados/âmbar (`#d97706` / `#fbbf24`), etiquetas em negrito (`.modal-spec-label`) e valores alinhados (`.modal-spec-value`).
  - Avisos importantes de montagem ou características técnicas (`Aviso importante:`, `Importante:`) são encapsulados em cartões de alerta informativos (`.modal-spec-notice`), com borda lateral âmbar e contraste ajustado para Light e Dark Mode.
  - Parágrafos contextuais são mantidos em tags `<p>` (`.modal-spec-p`) com entrelinhamento otimizado para leitura.

---

## 13. Identidade Visual de Favicon & Infraestrutura OpenGraph

### 13.1. Favicon SVG Vetorial de Luxo (`favicon.svg`)
- **Conceito & Símbolo:** Poltrona lounge contemporânea de designer com encosto anatômico curvo, assento pillow-top confortável e base metálica com sapatas refinadas.
- **Paleta Nobre (Elegance Blue):**
  - Fundo squircle em Navy profundo (`#090d16` a `#1e293b`) com raio suave (`rx="124"`) e borda dourada translúcida.
  - Mobília preenchida com gradiente dourado metálico tridimensional (`#fffbeb` ➔ `#fde68a` ➔ `#f59e0b` ➔ `#d97706` ➔ `#92400e`).
  - Sombra projetada suave (`feDropShadow`) conferindo acabamento escultural de joalheria.
- **Resolução & Escalabilidade:** Formato SVG nativo (`viewBox="0 0 512 512"`) com nitidez perfeita em abas de navegadores (16x16 / 32x32), favoritos, bookmarks e telas Retina de alta densidade. Suporte via `<link rel="icon" type="image/svg+xml" href="favicon.svg">` e `<link rel="apple-touch-icon" href="favicon.svg">`.

### 13.2. Infraestrutura OpenGraph & Twitter Cards
- **Padronização em 8 Páginas:** Todas as páginas do catálogo contam com meta tags sociais canônicas estruturadas para WhatsApp, Facebook, Instagram, LinkedIn e Twitter/X.
- **Imagem Canônica de Compartilhamento (`images/og-share.jpg`):**
  - Resolução recomendada de alta definição (1200x630px / 1920x1080px em proporção 16:9 / 1.91:1).
  - Ambientação de alto luxo em showroom de móveis com sofás e poltronas nobres em paleta Elegance Blue.
- **Higienização de Conteúdo:** Supressão total de expressões legadas com menções a preços nas tags `og:description`, substituídas por textos elegantes de posicionamento de marca e convite para atendimento humanizado via WhatsApp.

---

## 14. Motor de Busca Inteligente em Tempo Real (`js/catalog-search.js`)

### 14.1. Propósito e Requisitos de Negócio
- **Sugestões em Tempo Real com Fotos (Live Search & Autocomplete):** A barra de pesquisa original `#rj-catalog-search-input` sugere instantaneamente enquanto o usuário digita (a partir de 2 caracteres) as melhores opções em um dropdown suspenso, exibindo a foto do produto em miniatura (`48x48px`), título com termos coincidentes destacados (`<mark>`), badge de categoria e ação direta.
- **Abertura Imediata do Modal Flutuante:** Ao clicar em qualquer sugestão da lista, o sistema abre diretamente o modal com todas as fotos, vídeo e medidas técnicas via `window.RJProductModal.open()`.
- **Pesquisa Global no Catálogo Completo:** Ao submeter a busca com `Enter` ou clicar na lupa, se o usuário estiver em `catalogo.html`, o grid de produtos é filtrado em tempo real com recálculo automático da paginação. Se estiver na Home ou em páginas de categorias específicas, o usuário é redirecionado suavemente para `catalogo.html?q=termo`, garantindo a exibição de todos os produtos do catálogo completo.

### 14.2. Arquitetura em Memória & Performance Extrema (< 0.25ms)
- **Zero Overhead de Rede:** O motor consome diretamente a base pré-carregada `window.RJ_PRODUCTS_DATA` (523 itens), sem fazer nenhuma requisição HTTP.
- **Normalização de Diacríticos:** Remove acentos e caracteres especiais (`normalize('NFD')`), permitindo que buscas como `"sofa"`, `"comoda"`, `"perola"` ou `"saleto"` encontrem com 100% de precisão os produtos correspondentes.
- **Ranqueamento Heurístico:**
  - Prefix match no início do título (+100 pontos).
  - Exact match de frase (+60 pontos).
  - Word match isolado (+30 pontos).
  - Densidade de relevância proporcional ao comprimento do título.
- **Navegação Acessível por Teclado:** Suporte total às teclas `ArrowDown` e `ArrowUp` para percorrer sugestões, `Enter` para selecionar, `Escape` para fechar e clique fora para dispensar.
- **Design & Dark Mode:** Estilizado em `css/custom.css` com backdrop blur, bordas suaves, sombras profundas e contraste balanceado para o tema claro e escuro (`[data-theme="dark"]`).
- **Alinhamento do Ícone de Lupa (SVG Vetorial):** Substituição de emojis não-padronizados por SVG vetorial nítido (`24x24`, stroke `2.2px`), posicionado no canto direito interno do input (`right: 6px; top: 50%; transform: translateY(-50%)`) com botão circular ergonômico de 34x34px, microinteração hover/active, respiro de 46px no input para impedir sobreposição de texto digitado e redundância de submissão via submit/click.

---

## 15. Arquitetura de SEO Profissional & GEO (Generative Engine Optimization para IA)

Para assegurar descoberta ativa tanto em buscadores clássicos (Google, Bing) quanto em motores de busca generativa e agentes de IA (ChatGPT Search, Perplexity AI, Google Gemini, Claude e Microsoft Copilot), a aplicação adota uma arquitetura em 4 camadas:

### 15.1. Protocolo de Descoberta para LLMs (`llms.txt` e `llms-full.txt`)
- Implementação da especificação de ponta para IAs (`/llms.txt` e `/llms-full.txt` na raiz).
- Sintetiza a entidade **RJ Móveis**, catálogo com mais de 500 móveis, categorias, diferenciais construtivos e orientações para modelos de linguagem indicarem o canal oficial de WhatsApp (+55 21 99499-0764) sem expor preços fixos.

### 15.2. Diretivas de Rastreamento & Indexação (`robots.txt` e `sitemap.xml`)
- `robots.txt`: Permissão explícita para agentes generativos (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `cohere-ai`), bloqueando apenas diretórios de desenvolvimento/testes e mapeando o sitemap.
- `sitemap.xml`: Protocolo padrão sitemaps.org com UTF-8, cobrindo as 8 páginas com canonicalidade e prioridades escalonadas.

### 15.3. Metadados Semânticos Canônicos
- Remoção definitiva de tags legadas com menções a "preços".
- `<title>` único e personalizado por categoria.
- `<meta name="description">` persuasiva e otimizada (80 a 200 caracteres) sem menções financeiras.
- `<meta name="keywords">` com termos de cauda longa e intenção de compra.
- `<meta name="theme-color" content="#1e293b">` para personalização do navegador mobile.

### 15.4. Grafo de Conhecimento Estruturado (Schema.org JSON-LD)
Cada página incorpora 4 blocos de metadados semânticos interligados:
1. **`FurnitureStore` / `Organization`:** Identidade corporativa, logotipo, área geográfica de atendimento (Rio de Janeiro e Região Metropolitana) e ponto de contato de WhatsApp.
2. **`WebSite` com `potentialAction: SearchAction`:** Conecta a busca interna da RJ Móveis ao recurso Sitelinks Searchbox do Google.
3. **`BreadcrumbList`:** Estrutura navegável de migalhas de pão com rastreamento posicional.
4. **`FAQPage` (Answer Engine Optimization):** Perguntas e respostas objetivas projetadas para serem citadas diretamente pelas respostas sintetizadas de IAs generativas.





