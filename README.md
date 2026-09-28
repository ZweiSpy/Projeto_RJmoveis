# 🛋️ Projeto MeusMóveis — Catálogo Digital Interativo

Bem-vindo ao repositório do **Projeto MeusMóveis**. Este projeto é uma plataforma de catálogo de produtos voltada para atuação como vendedor e divulgador autorizado, oferecendo uma experiência moderna, elegante e focada em conversão humanizada via **WhatsApp**.

---

## 📑 Documentação e Governança

Para garantir excelência técnica, clareza operacional e alinhamento contínuo entre negócio e engenharia, este projeto segue um fluxo formal de governança estruturado nos seguintes documentos:

- 📜 [AGENTS.md](file:///c:/Users/Micro/Documents/Projeto_MeusMoveis/AGENTS.md) — **Protocolo de Governança e Regras de Operação**: Define a matriz RACI, os papéis de **Zwei** (PO & Tech Lead) e **Antigravity** (DEV, Arquiteto e Engenheiro de Software), além das regras inegociáveis de escopo.
- 📐 [SDD.md](file:///c:/Users/Micro/Documents/Projeto_MeusMoveis/SDD.md) — **Software Design Document**: Especificações arquiteturais, sistema de tokens visuais (**Elegance Blue**), estratégia de supressão de preços e mecanismo de conversão via WhatsApp.
- 🗺️ [Plan.md](file:///c:/Users/Micro/Documents/Projeto_MeusMoveis/Plan.md) — **Roadmap Operacional & Backlog**: Acompanhamento fase a fase do desenvolvimento, checklist de entregas, critérios de aceite e gestão de riscos.

---

## 🎯 Regras Centrais do Projeto

> [!IMPORTANT]
> **Modificações Obrigatórias:**
> - **Remoção de Todos os Valores:** Nenhum preço, parcela ou menção a PIX é exibido no catálogo.
> - **Troca de Cores:** Substituição da identidade original pela paleta **Elegance Blue** (Navy `#1e293b` + Bronze `#b45309`).
> - **Conversão via WhatsApp:** Cada card de produto possui o botão **"Chame no WhatsApp agora"** com mensagem automática contendo o nome exato do móvel.
> - **Otimização:** Código limpo, remoção de scripts de rastreamento de terceiros e alta velocidade de carregamento.

> [!CAUTION]
> **Restrições Absolutas (Não Fazer):**
> - **NÃO mudar a composição:** A grade, estrutura e alinhamento de catálogo são estritamente preservados.
> - **NÃO mudar nomes de produtos:** Os títulos originais são mantidos 100% fiéis.
> - **NÃO inventar nomes ou dados:** Nenhuma informação falsa ou não existente é inserida.

---

## 📁 Estrutura de Arquivos

```
Projeto_MeusMoveis/
│
├── index.html                    # Catálogo final personalizado e otimizado
├── site-catalogos-original.html  # Cópia fonte original (referência do lojista)
│
├── css/
│   ├── tokens.css                # Paleta de cores Elegance Blue e variáveis de design
│   └── custom.css                # Estilos do botão WhatsApp, layout anti-quebra e supressões
│
├── js/
│   └── whatsapp-cta.js           # Lógica do disparador do WhatsApp e mensagens dinâmicas
│
├── AGENTS.md                     # Manual de papéis e governança
├── SDD.md                        # Documento de Arquitetura de Software
├── Plan.md                       # Roadmap de tarefas e status
└── README.md                     # Documento principal (este arquivo)
```

---

## ⚙️ Guia de Configuração Rápida

### 1. Como alterar o número do WhatsApp do Vendedor
No arquivo `js/whatsapp-cta.js`, altere o campo `phoneNumber`:
```javascript
const WHATSAPP_CONFIG = {
    phoneNumber: "5511999999999", // Insira DDI + DDD + Número sem espaços ou traços
    ...
};
```

### 2. Como alterar a paleta de cores
No arquivo `css/tokens.css`, ajuste as variáveis da paleta conforme a necessidade da marca:
```css
:root {
    --color-primary-navy: #1e293b;  /* Cor primária */
    --color-accent-bronze: #b45309; /* Cor de destaque */
}
```

---

## 🚀 Como Executar Localmente

Como o projeto é construído em HTML5, CSS3 e JavaScript puro, não são necessárias ferramentas pesadas para visualização:

1. **Direto no Navegador:**
   - Dê um duplo clique no arquivo `index.html`.

2. **Via Servidor Local (Recomendado):**
   - No PowerShell:
     ```powershell
     npx serve .
     # ou
     python -m http.server 8080
     ```
   - Acesse no navegador: `http://localhost:8080`

---

## 👥 Equipe & Governança

- **Product Owner (PO) & Tech Lead:** Zwei
- **Desenvolvedor, Arquiteto & Engenheiro de Software:** Antigravity
