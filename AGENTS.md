# AGENTS.md — Protocolo de Governança e Regras de Operação

## 1. Visão Geral e Propósito

Este documento estabelece o fluxo de governança, definição de papéis, responsabilidades e limites operacionais para o desenvolvimento do **Projeto MeusMóveis**.

O objetivo do projeto é transformar o catálogo base (`site-catalogos-original.html`) em uma aplicação web otimizada, moderna, com exibição clara dos preços oficiais (à vista, 10x sem juros e PIX), nova identidade visual (**Elegance Blue**) e integração direta de conversão via **WhatsApp**, atuando como canal de vendas e divulgação autorizado.

---

## 2. Estrutura de Papéis e Responsabilidades

```mermaid
graph TD
    subgraph Direcao["👑 Liderança & Decisão Estratégica"]
        Zwei["Zwei\n(Product Owner & Tech Lead)"]
    end

    subgraph Execucao["🛠️ Engenharia & Arquitetura"]
        Antigravity["Antigravity\n(Arquiteto, DEV & Engenheiro de Software)"]
    end

    Zwei -->|1. Define visão, prioridades e regras de negócio| Antigravity
    Zwei -->|2. Valida identidade visual e experiência do usuário| Antigravity
    Zwei -->|3. Portão final de aprovação (Gatekeeper)| Antigravity
    
    Antigravity -->|1. Projeta arquitetura e design tokens| Zwei
    Antigravity -->|2. Implementa código limpo, modular e de alta performance| Zwei
    Antigravity -->|3. Mantém documentação técnica e planos sincronizados| Zwei
```

### 2.1. Zwei — Product Owner (PO) & Tech Lead
- **Autoridade Final:** Detém o poder de decisão sobre escopo, cronograma, prioridades e critérios de aceite.
- **Definição de Negócio:** Define regras comerciais, números de contato de WhatsApp e estratégias de conversão.
- **Validação Estética:** Homologa a paleta de cores, tipografia e layout responsivo.
- **Gatekeeper:** Nenhuma versão vai para produção sem a sua aprovação explícita.

### 2.2. Antigravity — Arquiteto de Software, DEV & Engenheiro de Software
- **Arquitetura Técnica:** Desenha a estrutura de arquivos, modularidade de CSS/JS e estratégias de caching e performance.
- **Engenharia de Código:** Escreve código limpo, semântico, moderno e livre de dependências desnecessárias.
- **Guardião das Restrições:** Garante o cumprimento estrito das restrições (preservação de títulos, composição e integridade dos dados).
- **Documentação Ativa:** Mantém `SDD.md`, `Plan.md`, `AGENTS.md` e `README.md` sempre atualizados a cada iteração.

---

## 3. Matriz de Decisão e Governança (RACI)

| Atividade / Decisão | Zwei (PO & Tech Lead) | Antigravity (DEV & Arquiteto) |
| :--- | :---: | :---: |
| Definição de Escopo e Regras de Negócio | **A / R** (Aprova / Responsável) | **C** (Consultado) |
| Escolha e Alteração de Paleta de Cores | **A** (Aprova) | **R** (Propõe / Implementa) |
| Arquitetura de Software e Otimização de Performance | **A** (Homologa) | **R** (Desenha / Executa) |
| Exibição de Preços Oficiais e Ordenação por Valor | **A** (Define formato) | **R** (Extrai, normaliza e exibe com fidelidade) |
| Implementação do CTA de WhatsApp com mensagem dinâmica | **A** (Define texto/número) | **R** (Desenvolve e testa) |
| Alteração de Composição ou Nomes de Produtos | **Veto Absoluto** | **Veto Absoluto** |
| Validação de Release / Entrega | **A** (Aprovação Final) | **R** (Submete para revisão) |

*Legenda: **R** = Responsável pela execução; **A** = Aprovador final; **C** = Consultado; **I** = Informado.*

---

## 4. Limites de Escopo e Restrições Inegociáveis

> [!IMPORTANT]
> ### O que DEVEMOS fazer:
> 1. **Exibir os preços oficiais fielmente:** Mostrar nos cards e no Modal Quick-View os preços originais extraídos das fontes do projeto (preço principal, parcelamento em 10x sem juros e valor no PIX), sem alterar ou inventar valores.
> 2. **Manter ordenação limpa com suporte a preços:** Oferecer ordenação por `Mais vendidos`, `Novos lançamentos`, `Nome (A-Z)`, `Menor preço` e `Maior preço`, mantendo o slider lateral legado oculto.
> 3. **Aplicar a paleta Elegance Blue:** Manter Navy `#1e293b`, Dourado/Bronze `#b45309`/`#d97706` e neutros configurados em variáveis CSS reutilizáveis (Light e Dark Mode).
> 4. **Manter o CTA de WhatsApp em todos os produtos:** Preservar o botão de contato direto (`Consultar no WhatsApp`) abaixo do preço com mensagem pré-configurada contendo o nome exato do produto.
> 5. **Otimizar performance:** Manter o catálogo rápido e modular em HTML/CSS/JS puro com cache-busting adequado.
> 6. **Manter zero trackers de terceiros do lojista original:** Preservar a remoção de scripts analíticos legados (ex.: Matomo da `iset.io`).

> [!CAUTION]
> ### O que É ESTRITAMENTE PROIBIDO (Cláusulas Pétreas):
> 1. **NÃO alterar a composição:** A grade de produtos, a estrutura de cabeçalho, a barra lateral e a hierarquia visual devem permanecer intactas.
> 2. **NÃO alterar nomes de produtos:** Os títulos dos móveis devem ser preservados caractere por caractere conforme o original.
> 3. **NÃO inventar nomes ou informações:** É vedada a inserção de produtos, marcas ou especificações fictícias.
> 4. **NÃO redirecionar para checkout do lojista:** As ações de compra devem ser convertidas exclusivamente para o atendimento humanizado via WhatsApp.

---

## 5. Fluxo de Trabalho Operacional (Pipeline de Desenvolvimento)

```
[Demanda / Ajuste] 
       │
       ▼
[Refinamento Técnico (Antigravity)] ──► Avalia impacto em SDD.md e Plan.md
       │
       ▼
[Aprovação do Tech Lead (Zwei)] 
       │
       ▼
[Implementação (Antigravity)] ───────► Execução com foco em performance e qualidade
       │
       ▼
[Verificação Automatizada] ──────────► Integridade dos 523 preços, links válidos, Delta <div> = 0, sintaxe limpa
       │
       ▼
[Validação Visual & UX (Zwei)] ──────► Aprovação final de entrega
```

---

## 6. Padrões de Comunicação e Registro

- **Transparência Técnica:** Todas as decisões arquiteturais e mudanças estruturais devem ser registradas no `SDD.md`.
- **Rastreabilidade de Progresso:** Toda tarefa concluída deve ter seu status atualizado no `Plan.md`.
- **Versionamento Limpo:** Código bem comentado onde necessário, mantendo separação clara entre estrutura (HTML), estilização (CSS) e lógica (JS).
