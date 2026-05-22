# Sistema em Linguagem Simples

## O que este sistema faz

Este sistema ajuda uma papelaria criativa a mostrar seus produtos na internet, receber interesse de clientes e organizar tudo em um painel administrativo.

Em vez de depender de mensagens soltas, a empresa passa a ter um fluxo mais organizado:

- o cliente visualiza o catalogo
- demonstra interesse
- o sistema registra esse contato
- o administrador acompanha tudo no painel

## Como ele funciona na pratica

### 1. O cliente entra no site

Na parte publica, o visitante ve os produtos, imagens, categorias e informacoes principais.

### 2. O cliente envia um contato

Quando ele preenche o formulario, o sistema registra esse lead para acompanhamento.

### 3. O painel recebe essas informacoes

No dashboard, a equipe pode:

- visualizar leads
- editar produtos
- ativar ou desativar itens
- enviar e remover imagens
- administrar vendedores

### 4. O banco guarda os dados

As informacoes principais ficam no MongoDB e os arquivos de imagem ficam organizados na pasta de uploads.

## Partes principais do projeto

### Frontend

E a parte visual, aquilo que o usuario enxerga:

- landing page
- login
- dashboard

### Backend

E a parte que processa as regras:

- login
- validacao
- cadastro de produtos
- cadastro de leads
- biblioteca de midia
- comunicacao com o banco

### Postman

E o kit de testes da API.

Ele ajuda a testar rapidamente:

- saude da API
- login
- produtos
- midia
- leads
- vendedores

## Resumo em uma frase

O sistema foi montado para unir vitrine online, captura de interessados e gestao interna em um unico fluxo simples.
