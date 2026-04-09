<<<<<<< HEAD
Projeto Integrador - UNIVESP
=======
<<<<<<< HEAD
Projeto Integrador - UNIVESP
  
  
=======
# **Documentação Técnica: Sistema de Gestão \- Projeto Integrador UNIVESP**
>>>>>>> d7f9a0fa145a1573aca4dc135916c4fa2a62afcd

O presente projeto justifica-se pela necessidade de melhorar a organização e a comunicação de um pequeno empreendimento que realiza vendas ao longo de todo o ano, mas enfrenta dificuldades no gerenciamento de contatos e pedidos, especialmente em períodos sazonais, como datas comemorativas.

Nesses períodos, o aumento da demanda evidencia falhas nos processos de organização e controle das informações, comprometendo o atendimento e dificultando o acompanhamento adequado de clientes e pedidos.

A relevância do projeto reside na contribuição direta para o empreendimento analisado, ao propor uma solução que transforme um processo desorganizado em um fluxo estruturado, previsível e eficiente.

Além disso, do ponto de vista acadêmico, o projeto permite aplicar conceitos de:
- Desenvolvimento Web
- Banco de Dados
- Automação de Processos

Esses conceitos são utilizados na resolução de um problema real, conforme os princípios do Projeto Integrador da UNIVESP.

---

### Problema de Pesquisa

Dessa forma, define-se como problema de pesquisa:

> **Como estruturar uma solução digital que organize a comunicação com clientes e melhore o fluxo de atendimentos em períodos de maior volume?**

---

### Delimitação do Projeto

O projeto delimita-se ao desenvolvimento de uma solução baseada em:

- Landing Page
- Automação de mensagens
- Gestão de leads

A proposta é voltada à:
- Organização do atendimento
- Melhoria do fluxo de vendas
- Otimização do gerenciamento de clientes em um pequeno negócio

---

### Objetivo da Solução

A solução busca transformar um processo manual e desorganizado em um sistema digital estruturado, proporcionando:

- Maior eficiência operacional
- Melhor controle das informações
- Padronização do atendimento ao cliente

```
PI
├─ backend
│  ├─ eslint.config.mjs
│  ├─ package.json
│  └─ src
│     ├─ config
│     │  └─ db.js
│     ├─ controllers
│     │  ├─ AuthController.js
│     │  ├─ LeadController.js
│     │  ├─ ProdutoController.js
│     │  └─ VendedorController.js
│     ├─ middlewares
│     │  ├─ authMiddleware.js
│     │  └─ validarDados.js
│     ├─ models
│     │  ├─ Lead.js
│     │  ├─ Produto.js
│     │  └─ Vendedor.js
│     ├─ routes
│     │  ├─ authRoutes.js
│     │  ├─ index.js
│     │  ├─ leadRoutes.js
│     │  ├─ produtoRoutes.js
│     │  └─ vendedorRoutes.js
│     ├─ server.js
│     ├─ services
│     │  └─ leadService.js
│     ├─ utils
│     └─ validations
│        ├─ leadValidation.js
│        ├─ produtoValidation.js
│        └─ vendedorValidation.js
├─ frontend
│  ├─ assets
│  │  ├─ icons
│  │  └─ img
│  ├─ css
│  │  ├─ dashboard.css
│  │  ├─ global.css
│  │  ├─ landing.css
│  │  └─ login.css
│  ├─ dashboard.html
│  ├─ index.html
│  ├─ js
│  │  ├─ api
│  │  │  └─ client.js
│  │  ├─ components
│  │  │  ├─ BrandLogo.js
│  │  │  ├─ CategoryCard.js
│  │  │  ├─ DashboardSidebar.js
│  │  │  ├─ LeadForm.js
│  │  │  ├─ PublicFooter.js
│  │  │  └─ PublicHeader.js
│  │  └─ pages
│  │     ├─ dashboard.js
│  │     ├─ index.js
│  │     └─ login.js
│  └─ login.html
├─ postman
│  ├─ collections
│  │  └─ Tests
│  │     ├─ .resources
│  │     │  └─ definition.yaml
│  │     ├─ Leads
│  │     │  ├─ .resources
│  │     │  │  ├─ Criar Lead.resources
│  │     │  │  │  └─ examples
│  │     │  │  │     └─ Criar Lead (Modelo).example.yaml
│  │     │  │  └─ definition.yaml
│  │     │  ├─ Buscar Eventos do Dia.request.yaml
│  │     │  ├─ Buscar Lead por ID.request.yaml
│  │     │  ├─ Criar Lead.request.yaml
│  │     │  ├─ Editar Lead.request.yaml
│  │     │  ├─ Excluir Lead.request.yaml
│  │     │  └─ Listar Leads.request.yaml
│  │     ├─ Login.request.yaml
│  │     └─ Vendedores
│  │        ├─ .resources
│  │        │  ├─ definition.yaml
│  │        │  └─ Registrar Vendedor.resources
│  │        │     └─ examples
│  │        │        └─ Registrar Vendedor (Modelo).example.yaml
│  │        ├─ Buscar Vendedor por ID.request.yaml
│  │        ├─ Editar Vendedor.request.yaml
│  │        ├─ Excluir Vendedor.request.yaml
│  │        ├─ Listar Vendedores.request.yaml
│  │        └─ Registrar Vendedor.request.yaml
│  ├─ flows
│  └─ sdks
└─ README.md

```