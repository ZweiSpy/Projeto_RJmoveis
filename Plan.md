# Plan.md — Roadmap Operacional e Backlog de Tarefas

## 1. Visão Geral do Roadmap

Este documento serve como o plano de execução ativo para o desenvolvimento e transformação do catálogo de móveis. Cada etapa possui entregáveis claros, critérios de aceitação e status atualizado.

---

## 2. Status Geral do Projeto

- **Fase Atual:** Fase 1 Concluída / Pronto para Iniciar Fase 2
- **Liderança (PO & Tech Lead):** Zwei
- **Engenharia (DEV & Arquiteto):** Antigravity
- **Paleta Aprovada:** Elegance Blue (Navy `#1e293b` + Bronze/Dourado `#b45309`/`#d97706`)
- **Canal de Conversão:** WhatsApp direto com mensagem contextualizada do produto

---

## 3. Detalhamento das Fases

### Fase 1: Governança, Papéis e Especificação Técnica
- [x] **1.1.** Criação e aprovação do plano de implementação inicial (`plano_governanca_catalogo.md`).
- [x] **1.2.** Criação do `AGENTS.md` definindo papéis de Zwei e Antigravity, restrições e regras inegociáveis.
- [x] **1.3.** Criação do `SDD.md` com arquitetura de software, mapeamento de tokens, remoção de valores e motor de WhatsApp.
- [x] **1.4.** Criação do `Plan.md` com roadmap operacional e critérios de aceite.
- [x] **1.5.** Criação do `README.md` com documentação do projeto e instruções de configuração.
- **Entregável:** Documentação de governança completa e aprovada pelo Tech Lead.
- **Status:** **CONCLUÍDO**

---

### Fase 2: Design System e Tokens Visuais (Elegance Blue)
- [x] **2.1.** Criar `css/tokens.css` com a definição centralizada das variáveis de cores Elegance Blue.
- [x] **2.2.** Mapear e sobrescrever as variáveis do tema antigo (`--cor-bg-login`, `--cor-txt-menu`, `--jc-marca`, etc.).
- [x] **2.3.** Criar `css/custom.css` com estilos para os componentes novos, foco em botões e normalização da grade.
- [x] **2.4.** Criar suíte de testes automatizados (`tests/test_phase2.ps1` — 36/36 testes aprovados).
- [x] **2.5.** Criar harness de teste visual (`tests/test_preview_phase2.html`).
- **Critério de Aceite:** Cores antigas (laranja e marrom café) completamente neutralizadas em favor da paleta Elegance Blue e layout testado.
- **Status:** **CONCLUÍDO (VALIDADO COM TESTES)**

---

### Fase 3: Mecanismo de Conversão via WhatsApp
- [x] **3.1.** Criar `js/whatsapp-cta.js` com o objeto centralizado `WHATSAPP_CONFIG` (número de telefone e gerador de mensagem).
- [x] **3.2.** Implementar listener para os botões `.btn-whatsapp-cta`, capturando o atributo `data-product-name`.
- [x] **3.3.** Estilizar o botão de ação no `css/custom.css` com visual moderno, ícone SVG do WhatsApp, cantos suaves e microinterações de hover.
- [x] **3.4.** Criar suíte de testes unitários Node.js (`tests/test_phase3.js` — 11/11 testes aprovados).
- [x] **3.5.** Criar runner PowerShell (`tests/test_phase3.ps1`).
- [x] **3.6.** Criar harness de teste interativo (`tests/test_preview_phase3.html`).
- **Critério de Aceite:** O clique em qualquer CTA de produto abre a conversa no WhatsApp com o nome do produto selecionado preenchido na mensagem.
- **Status:** **CONCLUÍDO (VALIDADO COM TESTES)**

---

### Fase 4: Higienização de Dados, Correções Críticas e Construção do `index.html`
- [x] **4.1.** Gerar `index.html` a partir de `site-catalogos-original.html`.
- [x] **4.2.** Remover todos os blocos de preços (`.product-card-price`, `.currentPrice`, `.installment-plan`, `.cdm-pix`) com balanço de tags rigorosamente zero (Delta = 0).
- [x] **4.3.** Inserir o botão CTA do WhatsApp no rodapé de cada um dos 36 cards de produto com nome exato preservado.
- [x] **4.4.** Remover o bloco de filtro por faixa de preço da barra lateral (`.sidebar-filter-block.filter--price`).
- [x] **4.5.** Limpar opções financeiras de ordenação (`pricelow`, `pricemax`, `maxdiscount`) no select de ordenação.
- [x] **4.6.** Remover scripts de rastreamento do lojista original (Matomo / `iset.io`) e canais de terceiros.
- [x] **4.7.** Ligar os arquivos `css/tokens.css`, `css/custom.css` e `js/whatsapp-cta.js` ao cabeçalho/rodapé do `index.html`.
- [x] **4.8.** Resolver os 4 pontos de revisão solicitados pelo Tech Lead:
  - [x] **4.8.1. Alinhamento de Grids:** Eliminação do tag imbalance de `</div>` (divOpen: 340, divClose: 340), restaurando a integridade da `.collection-grid`.
  - [x] **4.8.2. Codificação UTF-8:** Substituição da meta iso-8859-1 por UTF-8 nativo, eliminando mojibake nos nomes ("Sofá Retrátil Reclinável", etc.).
  - [x] **4.8.3. Paleta Elegance Blue Efetiva:** Neutralização de hex embutidos (`#f96a1b`, `#4a2e22`) e reforço de tokens com `!important`.
  - [x] **4.8.4. Marca e Menu RJ Móveis:** Substituição completa do cabeçalho e rodapé legados por novos componentes institucionais com monograma "RJ" e navegação contextual.
- [x] **4.9.** Suíte de testes automatizados (`tests/test_correcoes_index.js` — 16/16 testes aprovados e `tests/test_phase4.js` — 11/11 testes aprovados).
- [x] **4.10.** Botão Flutuante e Pulsante de WhatsApp (`.btn-whatsapp-floating`) no canto inferior direito com animação de radar ripple (`@keyframes pulse-whatsapp`).
- [x] **4.11.** Ajustes e Refinamento do Rodapé:
  - [x] **4.11.1.** Transformação do botão CTA de rodapé em pílula verde (`.rj-foot-cta-btn`) com ícone do WhatsApp e tipografia branca legível.
  - [x] **4.11.2.** Ajuste de contraste para o monograma/marca "RJ MÓVEIS" e título "Categorias" no fundo bege (`color: #1e293b !important`).
  - [x] **4.11.3.** Inclusão discreta do crédito legal: *"Desenvolvido por Zwei Coorporações LTDA"* com hiperlink para [zweicoorp.com.br](https://zweicoorp.com.br).
- [x] **4.12.** Alternância de Tema Claro / Escuro (Dark Mode de Alto Contraste):
  - [x] **4.12.1.** Definição dos tokens de Dark Mode (`[data-theme="dark"]`) em `css/tokens.css` com obsidian `#0b0f19`, superfícies de cards `#151e2e`, textos `#f8fafc` e acento âmbar radiante `#fbbf24`.
  - [x] **4.12.2.** Componente de alternância `.rj-theme-toggle` no cabeçalho e topbar com ícones vetoriais SVG de Sol e Lua e rótulos dinâmicos.
  - [x] **4.12.3.** Script inline no `<head>` para eliminação de FOUC (Flash of Unstyled Content) com sincronização em `localStorage` e preferência do SO (`matchMedia`).
  - [x] **4.12.4.** Motor dedicado `js/theme-toggle.js` para alternância em tempo real e atualização de acessibilidade (`aria-pressed`).
  - [x] **4.12.5.** Validação automatizada expandida (`tests/test_correcoes_index.js` com 21 asserções e `tests/test_theme_toggle_dom.js` com 6 testes de integração DOM).
- **Critério de Aceite:** Grids alinhados, acentos corretos, paleta Elegance Blue ativa, nova marca RJ Móveis integrada, botão flutuante pulsante ativo, CTA em pílula no rodapé, crédito com link zweicoorp.com.br, alternância dark/light mode funcional sem FOUC e zero preços no HTML.
- **Status:** **CONCLUÍDO (VALIDADO COM TESTES)**

---

### Fase 5: Expansão Multi-Páginas do Catálogo (7 Páginas Temáticas + Index)
- [x] **5.1.** Ingestão e auditoria dos 7 arquivos fonte (`site-catalogos-original.html` a `site-catalagos-pg7.html`) totalizando **523 produtos únicos**.
- [x] **5.2.** Criação do script mestre construtor (`scripts/build_all_catalog_pages.js`) com higienização estrita de dados (Delta `<div>` = 0, zero `R$`).
- [x] **5.3.** Integração do número real do WhatsApp do Tech Lead: **`(21) 99499-0764`** (`5521994990764`) em todos os pontos de contato.
- [x] **5.4.** Categorização algorítmica dos 523 produtos em 7 páginas de catálogo dedicadas + `index.html`:
  - `catalogo.html` (Geral / All: 523 itens)
  - `sofas.html` (Estofados & Sofás: 191 itens)
  - `quartos.html` (Quartos & Roupeiros: 224 itens)
  - `cozinha.html` (Cozinha & Modulados: 72 itens)
  - `salas.html` (Salas de Jantar: 23 itens)
  - `paineis.html` (Painéis & Home: 13 itens)
  - `pronta-entrega.html` (⚡ Pronta Entrega: 503 itens)
  - `index.html` (Vitrine Inicial: 84 itens da Página 1)
- [x] **5.5.** Criação do motor de busca instantânea em tempo real ([js/catalog-search.js](file:///c:/Users/Micro/Documents/Projeto_MeusMoveis/js/catalog-search.js)).
- [x] **5.6.** Criação da suíte de testes de validação [tests/test_7pages_catalog.js](file:///c:/Users/Micro/Documents/Projeto_MeusMoveis/tests/test_7pages_catalog.js) (168/168 aprovados).
- [x] **5.7.** Suíte de regressão [tests/test_correcoes_index.js](file:///c:/Users/Micro/Documents/Projeto_MeusMoveis/tests/test_correcoes_index.js) (23/23 aprovados).
- **Critério de Aceite:** 8 páginas estáticas operacionais, 0 menções a `R$`, menus integrados com `class="active"`, número real do WhatsApp e suporte a Dark Mode.
- **Status:** **CONCLUÍDO (100% VALIDADO COM TESTES)**

---

### Fase 6: Alinhamento de Cards, Paginação, Vitrine Reduzida e Telemetria Analytics
- [x] **6.1. Alinhamento Uniforme dos Cards:**
  - Aplicação de altura fixa na imagem (`.product-card-thumbnail`: 220px com `object-fit: contain`).
  - Título padronizado com altura fixa e line clamp para 2 linhas (`height: 46px; min-height: 46px`).
  - Slots de selos/marcas (`.product-card-marks`) e informações adicionais com altura mínima fixa (28px / 26px) para evitar colapsos.
  - Rodapé do card (`.foot-card`) fixado na base com `margin-top: auto`, garantindo 100% de alinhamento horizontal dos botões de WhatsApp em todas as linhas.
- [x] **6.2. Paginação Instantânea com Painel de Limite Existente:**
  - Conexão direta com o painel `<select name="limit">` do cabeçalho da coleção.
  - Inclusão da opção de **24 por página** como padrão recomendado da indústria, mantendo as opções existentes (36, 48, 60, 72, 84).
  - Controle instantâneo em JavaScript (`js/catalog-pagination.js`) sem recarregar a página, com janela numérica inteligente (`1 2 3 ... 22`) e rolagem suave até o topo da grade.
  - Integração total com o script de busca instantânea (`js/catalog-search.js`).
- [x] **6.3. Vitrine da Página Inicial (12 Itens) + Banner do Catálogo Completo:**
  - `index.html` exibe exatamente 12 produtos curados em destaque.
  - Inserção de banner chamativo e sofisticado na home (`.rj-home-catalog-cta`) com link direto para `catalogo.html` (523 móveis).
- [x] **6.4. Botões Limpos sem Número e Mensagem Contextualizada:**
  - Supressão do número do telefone dos textos dos botões de ação (`<span>Chame no WhatsApp</span>` / `<span>Falar no WhatsApp</span>`).
  - Mensagem predefinida indicando origem: *"Olá! Estava no site da RJ Móveis e quero saber mais sobre o produto: '{título}'. Poderia me ajudar?"*.
- [x] **6.5. Coletor de Analytics Plug-and-Play (Google, Meta, Vercel & Local):**
  - Implementação de `js/analytics.js` com auto-loader e integração tripla:
    - **Google Analytics 4** (`gtag` / GA4 auto-load se informado `googleAnalyticsId`).
    - **Meta Pixel** (`fbq` / Facebook & Instagram auto-load se informado `metaPixelId`).
    - **Vercel Analytics** (`window.va` com suporte nativo a eventos customizados de clique e pageview).
    - **Armazenamento Local Autônomo** (`localStorage`) para visualização de relatórios imediatos via console (`RJ_Analytics.relatorio()`) ou URL `?analytics=1`.
- [x] **6.6. Validação e Testes Automatizados:**
  - Suíte dedicada [tests/test_layout_and_analytics.js](file:///c:/Users/Micro/Documents/Projeto_MeusMoveis/tests/test_layout_and_analytics.js) (todas as asserções aprovadas com 0 falhas).
  - Regressão [tests/test_7pages_catalog.js](file:///c:/Users/Micro/Documents/Projeto_MeusMoveis/tests/test_7pages_catalog.js) (168/168 aprovados).
  - Regressão [tests/test_correcoes_index.js](file:///c:/Users/Micro/Documents/Projeto_MeusMoveis/tests/test_correcoes_index.js) (23/23 aprovados).
- **Status:** **CONCLUÍDO (100% VALIDADO COM TESTES)**

---

### Fase 7: Homologação e Validação pelo Tech Lead (Zwei)
- [x] **7.1.** Apresentação das atualizações de layout, paginação e analytics para revisão visual de Zwei.
- [ ] **7.2.** Homologação e aprovação formal final de release.
- **Status:** **AGUARDANDO APROVAÇÃO FINAL DO TECH LEAD**

---

## 4. Gestão de Riscos e Mitigações

| Risco Identificado | Impacto | Estratégia de Mitigação |
| :--- | :---: | :--- |
| **Desalinhamento de altura dos cards após remover preço** | Alto | O CTA de WhatsApp assume a área inferior do card com altura fixa e posicionamento com `margin-top: auto` em Flexbox. |
| **Links antigos continuarem direcionando para o lojista original** | Alto | Conversão do container de ação inferior exclusivamente para o botão do WhatsApp com `data-product-name`. |
| **Alteração acidental de nomes de produtos** | Crítico | Processo de extração automatizado preservando os nós `<div class="product-card-title">` sem nenhuma modificação textual. |
| **Bloqueio de pop-up no WhatsApp em navegadores mobile** | Médio | Utilização do protocolo direto `https://wa.me/` com abertura em target apropriado. |

---

## 5. Registro de Mudanças (Changelog)

- **2026-09-28 (Busca Inteligente em Tempo Real com Sugestões, Fotos e Latência Ultrarrápida):**
  - **Mecanismo de Live Search & Autocomplete (`js/catalog-search.js`):**
    - Implementado motor de busca inteligente conectado à barra existente `#rj-catalog-search-input` em todas as 8 páginas do catálogo.
    - Exibe dropdown flutuante com sugestões em tempo real contendo miniatura de foto do móvel (`48x48px`), título com destaque das palavras coincidentes (`<mark>`) e badge de categoria.
    - Ao clicar em qualquer sugestão: aciona instantaneamente o Modal Flutuante de Detalhes (`window.RJProductModal.open()`) sem sair da tela.
    - Ao submeter a busca (Enter/Lupa): filtra os produtos no grid em `catalogo.html` ou redireciona suavemente para `catalogo.html?q=termo` quando acionado a partir de outras páginas (Home, Sofás, Quartos, etc.).
  - **Performance Extrema & Alta Estabilidade (< 0.25ms):**
    - Consumo 100% síncrono da base em memória `window.RJ_PRODUCTS_DATA` (523 itens) com zero requisições HTTP adicionais.
    - Algoritmo de normalização de texto NFD insensível a acentos e maiúsculas (ex: `"sofa"`, `"comoda"`, `"armario"` e `"perola"` encontram perfeitamente os produtos correspondentes).
    - Latência média comprovada em benchmark automatizado de **0.210 ms por busca** (meta: < 5ms).
  - **Acessibilidade & Design Elegance Blue:**
    - Navegação por teclado com setas `↑` e `↓`, seleção com `Enter`, cancelamento com `ESC` e clique fora.
    - Estilização completa no `css/custom.css` com backdrop blur, bordas e sombras suaves, e suporte integral ao Dark Mode (`[data-theme="dark"]`).
  - **Validação Automatizada:**
    - Criada a suíte `tests/test_smart_search_performance.js` (aprovada com 100% de sucesso).
    - Executada e aprovada toda a bateria de regressão (`test_modal_data_standalone.js`, `test_favicon_and_opengraph.js`, `test_breadcrumb_headers.js`, `test_all_product_details.js`).

- **2026-09-28 (Favicon SVG de Luxo & Infraestrutura Canônica OpenGraph):**
  - **Favicon SVG Vetorial Nobre (`favicon.svg`):**
    - Desenvolvida silhueta estilizada de poltrona lounge contemporânea de designer com assento pillow-top, encosto anatômico com gomos e base metálica com sapatas refinadas.
    - Aplicado gradiente dourado metálico tridimensional (`#fffbeb` a `#92400e`) sobre squircle navy profundo (`#090d16` a `#1e293b`), conferindo legibilidade e contraste absoluto tanto em abas claras quanto escuras do navegador, além de telas Retina e atalhos mobile.
  - **Infraestrutura Canônica de OpenGraph & Twitter Cards:**
    - Criado o diretório oficial `images/` e a imagem de compartilhamento social em alta definição `images/og-share.jpg` (showroom de luxo com mobília em paleta Elegance Blue).
    - Implementadas meta tags canônicas completas (`og:type`, `og:site_name`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:width`, `og:image:height`, `twitter:card`, `twitter:image`, `link rel="canonical"`) em todas as 8 páginas do catálogo.
    - Eliminado o caminho quebrado legado (`index.htmlfavicon/...`) e sanitizadas as descrições sociais, removendo qualquer resquício de menções a preços (`melhores preços`, `R$`, etc.).
  - **Validação Automatizada:**
    - Criada a suíte `tests/test_favicon_and_opengraph.js` (validando o SVG, a imagem `og-share.jpg`, todas as meta tags nas 8 páginas e zero menções a preços com 100% de aprovação).
    - Aprovada toda a bateria de regressão (`test_modal_data_standalone.js`, `test_breadcrumb_headers.js`, `test_sorting_and_view_removal.js`).

- **2026-09-28 (Arquitetura Standalone Zero-CORS, Galeria de Fotos e Formatador Semântico do Modal):**
  - **Causa Raiz Identificada:**
    1. *Bloqueio de CORS em `file:///`:* Ao abrir qualquer página do catálogo diretamente com duplo clique no Windows via protocolo local `file:///`, navegadores modernos bloqueiam chamadas assíncronas `fetch('data/products_details.json')` por restrição de segurança (`origin 'null'`), fazendo com que o modal acionasse o fallback estático e não exibisse as descrições nem as fotos secundárias dos produtos.
    2. *Formatação Bruta da Descrição:* Os dados originais continham múltiplos `<br />` sucessivos e texto sem formatação hierárquica, dificultando a leitura rápida de medidas, materiais e garantias.
  - **Soluções Implementadas:**
    1. *Banco de Dados Nativo Standalone (`js/products-data.js`):*
       - Compilados todos os 523 produtos em `window.RJ_PRODUCTS_DATA` (1.517 KB), tornando o catálogo 100% autônomo, portátil e imune a bloqueios de CORS, com abertura instantânea em 0ms.
       - Mantido fallback resiliente via `fetch()` em `js/product-modal.js` para garantir compatibilidade com ambientes HTTP/HTTPS.
    2. *Motor de Formatação Semântica de Especificações (`formatProductDescription`):*
       - Normalização dinâmica de ruídos e quebras de linha excessivas.
       - Títulos de seções técnicas (`Medidas`, `Conforto`, `Funcionamento`, `Estrutura`, etc.) convertidos em tags `<h4>` estilizadas (`.modal-spec-section-title`).
       - Linhas de especificação agrupadas em listas estruturadas `<ul>` (`.modal-spec-list`) com bullets dourados/âmbar (`.modal-spec-item`), etiquetas destacadas (`.modal-spec-label`) e valores alinhados (`.modal-spec-value`).
       - Avisos de montagem e características relevantes encapsulados em cartões de alerta informativos (`.modal-spec-notice`), com borda lateral âmbar e contraste equilibrado.
    3. *Design Tokens & Suporte ao Dark Mode:*
       - Criadas regras completas em `css/custom.css` para as novas classes de especificação, incluindo suporte integral ao modo escuro (`[data-theme="dark"]`).
    4. *Injeção nas 8 Páginas do Catálogo:*
       - Injetada a tag `<script src="js/products-data.js"></script>` antes de `<script src="js/product-modal.js"></script>` em `index.html`, `catalogo.html`, `sofas.html`, `quartos.html`, `cozinha.html`, `salas.html`, `paineis.html` e `pronta-entrega.html`.
    5. *Validação Automatizada com Testes Dedicados:*
       - Criada a suíte `tests/test_modal_data_standalone.js` (validando os 523 itens com fotos e descrições, 289 itens com vídeos, scripts ordenados nas 8 páginas e regras de CSS).
       - Executada bateria completa de regressão (`test_all_product_details.js`, `test_modal_integration.js`, `test_modal_behavior_simulation.js`, `test_sorting_and_view_removal.js`, `test_breadcrumb_headers.js`) com 100% de aprovação (0 erros).

- **2026-09-27 (Sincronização Dinâmica de Breadcrumb, Cabeçalhos H1 e Departamentos da Sidebar):**
  - **Causa Raiz Identificada:**
    1. *Breadcrumb Estático e Link com Barra Incorreta:* O HTML base continha `<ul id="breadcrumb">` estático com link para `https://www.catalogodemoveis.com.br/` que, ao ser substituído por `index.html`, resultava em `href="index.html/"` (com barra terminal inválida). Além disso, o segundo item exibia estaticamente `<span itemprop="name">Catalogo</span>` em todas as páginas e categorias.
    2. *Cabeçalho H1 Fixo no Topo:* O container `<div class="section-header search-header">` original continha `<h1>catalogo</h1>(<b>523</b> produtos)` estático e nunca era substituído pelo construtor, fazendo com que qualquer categoria ou até a Home exibisse "catalogo (523 produtos)".
    3. *Sidebar de Departamentos com Conflito Visual:* A lista de departamentos na barra lateral herdava estilos legados de `.options__item` da loja antiga (que exibiam rádio/bullets cinzas/azuis desalinhados) e não destacava de forma exclusiva a categoria atual ativa no modo claro e escuro.
  - **Soluções Implementadas:**
    1. *Gerador Dinâmico de Breadcrumb (`buildBreadcrumb`):*
       - Na Home (`index.html`): Exibe unicamente `Início` (sem chevron ou links residuais para catálogo).
       - Nas categorias (`sofas.html`, `quartos.html`, etc.): Exibe `<a href="index.html">Home</a> > <span>[Nome Real da Categoria]</span>`, com link limpo sem barra (`index.html`).
    2. *Cabeçalho Oficial H1 Dinâmico por Categoria (`buildCategoryHeader`):*
       - Substituição do antigo `.section-header.search-header` por um cabeçalho oficial com classe `.rj-catalog-header`, contendo o título H1 real da página e o contador dinâmico exato:
         - `index.html`: `Destaques do Catálogo` com `(12 produtos)`
         - `catalogo.html`: `Catálogo Geral Completo` com `(523 produtos)`
         - `sofas.html`: `Estofados, Sofás & Poltronas` com `(191 produtos)`
         - `quartos.html`: `Quartos, Guarda-Roupas & Camas` com `(224 produtos)`
         - `cozinha.html`: `Cozinha, Armários & Modulados` com `(72 produtos)`
         - `salas.html`: `Salas de Jantar, Mesas & Cadeiras` com `(23 produtos)`
         - `paineis.html`: `Painéis para TV, Racks & Home Theater` com `(13 produtos)`
         - `pronta-entrega.html`: `⚡ Móveis com Pronta Entrega` com `(503 produtos)`
    3. *Sidebar de Departamentos Oficial e Isolada (`buildSidebar`):*
       - Criação da classe `.rj-sidebar-departments` e `.rj-dept-link` completamente desacoplada do CSS legado da loja original.
       - Indicador de página ativa com classe `.active`, bullet dourado luminoso (`.rj-dept-bullet`) e contagem destacada, marcado EXCLUSIVAMENTE na categoria em exibição (e nenhum departamento ativo na Home).
       - Estilos dedicados de alto contraste para Light Mode e Dark Mode em `css/custom.css`.
    4. *Validação Automatizada:*
       - Criada a suíte `tests/test_breadcrumb_headers.js` com validação de todos os 8 arquivos (0 erros).
       - Executadas e aprovadas com 100% de sucesso todas as suítes de regressão do projeto (`test_sorting_and_view_removal.js`, `test_7pages_catalog.js`, `test_layout_and_analytics.js`, `test_correcoes_index.js`).

  - **Causa Raiz Identificada:**
    1. *Layout Thrashing por Mutações Síncronas Individuais:* A reordenação realizava 523 chamadas de `grid.appendChild(card)` diretamente no DOM vivo, forçando o navegador a recalcular o layout do container flex centenas de vezes em sequência.
    2. *Algoritmo O(N^2) na Paginação:* `renderPage()` executava `visibleCards.indexOf(card)` dentro de um `forEach` em 523 cards, gerando mais de 270.000 buscas lineares de nós DOM na thread principal a cada ordenação.
    3. *Duplicidade de Eventos:* Ouvir simultaneamente `change` e `input` no `<select>` disparava toda a rotina pesada duas vezes no mesmo frame no Chrome/Edge.
    4. *Tags `<form>` Legadas:* O `<form name="f-collection-sort">` podia ser interceptado por scripts legados (`base.min.js`/`blockUI`).
  - **Soluções Implementadas:**
    1. *Batch DOM Update com DocumentFragment:* Os cards são montados em memória em um fragmento off-DOM e inseridos no grid com **1 único reflow**, reduzindo 99.8% do trabalho de renderização do navegador.
    2. *Algoritmo Linear O(N) em Passada Única:* Substituído o loop aninhado por um laço linear único com verificação de estado, evitando tocar no DOM de cards que já estavam ocultos.
    3. *Desacoplamento Assíncrono da UI Thread:* Uso de micro-tick para liberar o fechamento do dropdown nativo antes do cálculo, garantindo resposta imediata e transição suave de opacidade.
    4. *Remoção de Tags `<form>`:* Toolbar limpa com seletores puros sem formulários ou submits fantasmas.
    5. *Validação:* Todas as suítes de testes aprovadas com 0 falhas (tempo de reorganização reduzido de centenas de ms para < 2ms).
  - **Demanda do Usuário:**
    1. Remover o seletor de colunas do grid (2, 3, 4 colunas) e o alternador de formato (cards/lista). A aplicação não utilizará esses alternadores e manterá formato único e padronizado de cards em grid.
    2. Fazer a busca/seletor de ordenação funcionar exatamente conforme o catálogo do site principal: "Mais vendidos", "Novos lançamentos" e "Nome do produto".
  - **Soluções Implementadas:**
    1. *Remoção Física e Visual dos Controles Obsoletos:*
       - Removidas do HTML base todas as tags `<div class="collection-grid-column">` (colunas 2, 3, 4) e `<div class="collection-view-mode">` (galeria/lista) e seus respectivos links de parâmetros (`?grid=`, `?view=`).
       - Adicionadas regras com `!important` no `css/custom.css` ocultando qualquer resquício de `.collection-grid-column` ou `.collection-view-mode`.
    2. *Motor de Ordenação Dinâmica Instantânea (`js/catalog-sort.js`):*
       - Criado módulo independente que indexa na inicialização `dataset.originalIndex`, `dataset.sortTitle` e `dataset.sortId` para cada card em tempo linear O(N).
       - Implementada ordenação em memória sem recarregar a página (< 2ms para 523 itens):
         - `bestsellers` (Mais vendidos): Retorna os itens à ordem original de curadoria do catálogo.
         - `new` (Novos lançamentos): Ordena em ordem decrescente pelos IDs reais do catálogo (maior ID = produto mais recente).
         - `name` (Nome do produto): Ordena em ordem alfabética estrita de A a Z com `localeCompare('pt-BR', { sensitivity: 'base', numeric: true })`.
       - Reanexação automática dos nós no DOM e integração com `window.RJ_CatalogPagination.recalculate()`, garantindo que após ordenar, a paginação resete para a Página 1 paginando os itens já ordenados.
       - Zero ocorrências de opções de preço (`pricelow`, `pricemax`, `maxdiscount`).
    3. *Validação:*
       - Criada nova suíte automatizada `tests/test_sorting_and_view_removal.js` validando remoção física e CSS dos controles, integridade do seletor `#rj-select-sort` e precisão algorítmica dos 3 critérios em todas as 8 páginas (0 falhas).
       - Executadas com 100% de sucesso as suítes de regressão (`test_layout_and_analytics.js`, `test_pagination_functional.js`, `test_7pages_catalog.js`, `test_correcoes_index.js`).
- **2026-09-27 (Implementação Completa dos Cards Flutuantes / Quick-View Modal nos 523 Produtos):**
  - **Mapeamento e Extração dos 523 Produtos:**
    - Criado e executado `scripts/build_catalog_map.js`, catalogando determinística e fidedignamente 100% dos 523 itens únicos presentes nos 7 arquivos de origem (`data/products_catalog_map.json`).
    - Criado e executado `scripts/fetch_product_details.js` com concorrência controlada (3 workers), salvamento incremental a cada 10 produtos e mecanismo de resiliência. Extraídos 523 produtos de 523 com 0 erros e 0 violações financeiras em `data/products_details.json`.
    - 289 produtos catalogados com vídeos exclusivos do YouTube e 100% dos 523 produtos catalogados com fotos de alta resolução.
  - **Componente e Estilização do Modal Flutuante:**
    - Criado `js/product-modal.js` com abertura instantânea (< 10ms) a partir do cache local `products_details.json`.
    - Suporte a vídeo sob demanda (lazy load): o player do YouTube só é injetado no DOM quando o cliente clica em *"Assistir Vídeo do Produto"*, preservando desempenho e banda.
    - Miniaturas interativas da galeria de fotos, botão oficial do WhatsApp com link personalizado contendo o nome exato do item e caixa de especificações técnicas completas (medidas, estrutura, acabamento).
    - Fundo com blur suave (`backdrop-filter: blur(8px)`), travamento de scroll (`body.modal-open`) e suporte pleno ao Dark Mode.
    - Injetado `js/product-modal.js` em todas as 8 páginas do catálogo através de `scripts/inject_product_modal_script.js`.
  - **Bateria de Testes Automatizados:**
    - `tests/test_all_product_details.js`: 523/523 itens aprovados, 0 violações de preço, 0 erros críticos.
    - `tests/test_modal_integration.js`: 8/8 páginas validadas com sucesso.
    - `tests/test_modal_behavior_simulation.js`: Simulação comportamental de galeria, player sob demanda e WhatsApp CTA aprovada com 100% de sucesso.
- **2026-09-27 (Resolução de Palavras Cortadas, Espaçamento da Foto e Reposicionamento do Selo de Pronta Entrega):**
  - **Causa Raiz Identificada:**
    1. *Palavras Cortadas ao Meio:* Títulos do catálogo de móveis com especificações completas possuem até 3 linhas. O limite anterior de `height: 46px` truncava a 3ª linha na metade horizontal das letras ("Caixa", "Gavetas com Espelho e Pés -", "Espelho - Carioca", "6 Gavetas - D Doro").
    2. *Texto Colado na Foto:* Thumbnail com `margin: 0` e card-body com `padding-top: 2px` deixavam o título encostado na foto.
    3. *Selo Flutuando no Topo:* Regra legada inline com `.product-card-information-add { position: absolute; top: 0; left: 0; }` tirava o selo do fluxo normal e deixava um vão vazio antes do botão do WhatsApp.
  - **Soluções Implementadas:**
    1. *Título de 3 Linhas Sem Corte:* Container configurado para `height: 62px !important; min-height: 62px !important; max-height: 62px !important;` com `-webkit-line-clamp: 3 !important;`. Três linhas completas cabem com folga e sem corte de palavras. Títulos de 1 ou 2 linhas são centralizados verticalmente com régua perfeitamente alinhada.
    2. *Respiro Confortável da Imagem:* `margin: 0 0 14px 0 !important;` no thumbnail e `padding: 4px 10px 6px 10px !important;` no card-body criam 18px de separação elegante e premium da imagem.
    3. *Selo no Fluxo do Card:* `.storefront-cards.product-card .product-card-information-add` forçado para `position: static !important; top: auto !important;`, integrando o selo entre o título e o botão WhatsApp, preenchendo o vazio vertical.
    4. *Neutralização de Estilos Legados:* Regras inline legadas neutralizadas em `scripts/build_all_catalog_pages.js` e todas as 8 páginas reconstruídas com sucesso (0 R$, 0 erros de div).
    5. *Validação:* Suítes `test_layout_and_analytics.js`, `test_pagination_functional.js`, `test_7pages_catalog.js` (168/168) e `test_correcoes_index.js` (23/23) aprovadas com 100% de sucesso.
- **2026-09-27 (Organização Interna dos Cards, Respiro de Imagem e Eliminação de Vazio):**
  - **Ajuste de Respiro da Imagem:** Aumento do espaçamento inferior do thumbnail de 10px para 16px com separador sutil (`border-bottom: 1px solid #f1f5f9`), descendo o título para ocupar o centro do corpo do card com elegância e sem colar na foto.
  - **Eliminação do Vazio Inferior:** Redução do `min-height` do card de 460px para 395px (altura real do conteúdo equilibrado), eliminando mais de 60px de espaço em branco morto entre o texto/selo e o botão de WhatsApp.
  - **Selos e Badges Flutuantes:** Posicionamento de `.product-card-marks` (ex: "Oferta", "100% MDF") em posição absoluta no topo superior esquerdo da foto, sem interferir no fluxo vertical.
  - **Badge Premium de Pronta Entrega:** Transformação de `.immediate-delivery` em pílula âmbar/dourada com ícone de raio ⚡ e altura fixa de 26px para manter alinhamento estrito em todas as colunas.
  - **Uniformidade e Réguas Horizontais:** 100% preservada a mesma altura de thumbnails (220px), títulos (46px clamped em 2 linhas) e botões ancorados com `margin-top: auto`.
- **2026-09-27 (Correção Crítica da Paginação e Respeito a Limites de Itens):**
  - **Causa Raiz Identificada:** A regra de alta especificidade `.storefront-cards.product-card { display: flex !important; }` no CSS impedia que `card.style.display = 'none'` ocultasse os cards em navegadores modernos (a regra de folha de estilo com `!important` sobrepõe estilo inline sem `!important`).
  - **Solução Implementada:**
    - Adicionada regra com tripla classe e `!important` no `css/custom.css`: `.storefront-cards.product-card.page-hidden, .product-card.page-hidden, .storefront-cards.product-card.search-hidden { display: none !important; }`.
    - Atualização do `js/catalog-pagination.js` e `js/catalog-search.js` para alternar as classes `.page-hidden` e `.search-hidden`, além de `card.style.setProperty('display', 'none', 'important')`.
    - Inicialização segura com verificação de `document.readyState` (evitando perda de evento `DOMContentLoaded` quando o script carrega de forma assíncrona/cacheada).
    - Eventos de escuta para `'change'` e `'input'` no seletor de limite (`#rj-select-per-page`).
    - Criação de nova suíte automatizada `tests/test_pagination_functional.js` validando que a página inicial mostra estritamente 24 cards, a seleção de 36 ajusta instantaneamente para 36 cards, a navegação para página 2 exibe os cards 37 a 72, e os limites 48, 60, 72 e 84 funcionam com 100% de precisão (0 falhas).
- **2026-09-27 (Alinhamento de Cards, Paginação & Analytics):**
  - Implementação de regras de alinhamento rígido em `css/custom.css` (`height: 220px` para imagem, `height: 46px` para título, slots de selos e `margin-top: auto` no CTA).
  - Criação de `js/catalog-pagination.js` conectado ao painel de limite existente com suporte a 24, 36, 48, 60, 72 e 84 itens por página.
  - Redução da vitrine inicial de `index.html` para 12 produtos com banner de catálogo completo (`.rj-home-catalog-cta`).
  - Remoção de números de telefone do texto dos botões de WhatsApp, substituídos por "Chame no WhatsApp" e mensagem dinâmica de origem.
  - Implementação de `js/analytics.js` com suporte a Google Analytics 4, Meta Pixel, Vercel Analytics e relatório em console.
  - Criação da suíte `tests/test_layout_and_analytics.js` e aprovação de 100% dos testes.
- **2026-09-26:**
  - Criação do framework de governança (`AGENTS.md`).
  - Criação do Documento de Design de Software (`SDD.md`).
  - Criação do Roadmap Operacional (`Plan.md`).
  - Definição da paleta **Elegance Blue** e integração do CTA de WhatsApp para conversão de vendas diretas.
  - Correção dos grids, alinhamento dos cards em 260px com Flexbox responsivo e supressão total de preços (Delta = 0).
  - Atualização completa de todos os ícones para o vetor oficial idêntico do WhatsApp (`viewBox="0 0 448 512"` com balão e monofone).
  - Implementação do pulso com batida rítmica (heartbeat tum-tum + ondas de choque radar) no botão flutuante.
  - Inclusão dos créditos de desenvolvimento institucional para **Zwei Coorporações LTDA** (`zweicoorp.com.br`).

