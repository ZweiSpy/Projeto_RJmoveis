# AGENTS.md — Protocolo de Governança e Regras de Operação

## 1. Visão Geral e Propósito

Este documento estabelece o fluxo de governança, definição de papéis, responsabilidades e limites operacionais para o desenvolvimento do **Projeto MeusMóveis**.

O objetivo do projeto é transformar o catálogo base (`site-catalogos-original.html`) em uma aplicação web otimizada, moderna, sem exibição de preços, com nova identidade visual (**Elegance Blue**) e integração direta de conversão via **WhatsApp**, atuando como canal de vendas e divulgação autorizado.

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
| Supressão de Valores, Parcelas e Filtros de Preço | **I** (Informa regras) | **R** (Executa com rigor) |
| Implementação do CTA de WhatsApp com mensagem dinâmica | **A** (Define texto/número) | **R** (Desenvolve e testa) |
| Alteração de Composição ou Nomes de Produtos | **Veto Absoluto** | **Veto Absoluto** |
| Validação de Release / Entrega | **A** (Aprovação Final) | **R** (Submete para revisão) |

*Legenda: **R** = Responsável pela execução; **A** = Aprovador final; **C** = Consultado; **I** = Informado.*

---

## 4. Limites de Escopo e Restrições Inegociáveis

> [!IMPORTANT]
> ### O que DEVEMOS fazer:
> 1. **Remover todos os preços e valores:** Não exibir preço à vista, parcelamentos, menções a PIX ou bandeiras de cartão.
> 2. **Remover filtros de preço:** Eliminar o slider de preço da barra lateral e opções de ordenação por valor.
> 3. **Trocar a paleta de cores:** Aplicar o padrão **Elegance Blue** (Navy `#1e293b`, Dourado/Bronze `#b45309`/`#d97706` e neutros) configurado em variáveis CSS reutilizáveis.
> 4. **Substituir links/ações por CTA de WhatsApp:** Incluir botão de contato direto com mensagem pré-configurada contendo o nome exato do produto.
> 5. **Otimizar performance:** Reduzir o payload do HTML original (de ~892 KB) para uma versão ultrarrápida e modular.
> 6. **Remover trackers de terceiros:** Limpar scripts analíticos da loja original (ex.: Matomo da `iset.io`).

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
[Verificação Automatizada] ──────────► Zero ocorrências de R$, links válidos, sintaxe limpa
       │
       ▼
[Validação Visual & UX (Zwei)] ──────► Aprovação final de entrega
```

---

## 6. Padrões de Comunicação e Registro

- **Transparência Técnica:** Todas as decisões arquiteturais e mudanças estruturais devem ser registradas no `SDD.md`.
- **Rastreabilidade de Progresso:** Toda tarefa concluída deve ter seu status atualizado no `Plan.md`.
- **Versionamento Limpo:** Código bem comentado onde necessário, mantendo separação clara entre estrutura (HTML), estilização (CSS) e lógica (JS).
