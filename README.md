# PI - Plataforma de Gestao para Papelaria Criativa

Plataforma para captacao de leads, gestao de produtos e administracao de vendedores. O projeto tem landing page publica, dashboard administrativo, autenticacao JWT e upload de imagens com galeria por produto.

## Links atuais

- Front-end de producao: [https://stylodesigner.vercel.app/index.html](https://stylodesigner.vercel.app/index.html)
- API de producao: [https://stylodesigner.alwaysdata.net/api](https://stylodesigner.alwaysdata.net/api)
- Uploads de producao: [https://stylodesigner.alwaysdata.net/uploads](https://stylodesigner.alwaysdata.net/uploads)

## Funcionalidades

- Landing page publica com catalogo de produtos.
- Cards de produto com multiplas imagens em carrossel, autoplay e navegacao por setas.
- Dashboard com CRUD de produtos, leads e vendedores.
- Produto com galeria de imagens, remocao de imagens existentes e substituicao por novas imagens.
- Biblioteca de midia no backend para rastrear arquivos enviados.
- Validacao de dados com Zod.
- Autenticacao de areas administrativas com JWT.

## Stack

- Backend: Node.js, Express 5, MongoDB/Mongoose, Multer, Zod, JWT, Helmet, CORS.
- Frontend: HTML, CSS e JavaScript em componentes nativos.
- Testes manuais/API: Postman.

## Estrutura do projeto

```text
backend/
  src/
frontend/
postman/
```

## Como rodar localmente

### 1. Backend

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env` com um conteudo parecido com este:

```env
PORT=5000
IP=0.0.0.0
MONGODB_URI=mongodb://localhost:27017/papelaria
ENABLE_AGENT_DEBUG=false
```

Suba a API:

```bash
npm run dev
```

API local:

- `http://localhost:5000/api`
- uploads locais: `http://localhost:5000/uploads`

### 2. Frontend

Sirva a pasta `frontend/` com Live Server, Vite static preview ou qualquer servidor HTTP simples. Em desenvolvimento, o frontend ja aponta para `http://localhost:5000/api` quando aberto em `localhost` ou `127.0.0.1`.

Exemplo com VS Code Live Server:

- abra `frontend/index.html`
- abra `frontend/dashboard.html`

## Rotas principais

### Infra

| Metodo | Rota | Auth | Descricao |
| --- | --- | --- | --- |
| GET | `/api` | Nao | Health basico da API |
| GET | `/api/health` | Nao | Estado da API, Mongo e pasta de uploads |

### Auth

| Metodo | Rota | Auth | Descricao |
| --- | --- | --- | --- |
| POST | `/api/login` | Nao | Login do vendedor/dono e retorno do token JWT |

### Produtos

| Metodo | Rota | Auth | Descricao |
| --- | --- | --- | --- |
| GET | `/api/produtos` | Nao | Lista produtos ativos para o catalogo |
| GET | `/api/produtos?admin=true` | Nao | Lista produtos para administracao |
| POST | `/api/produtos` | Sim | Cria produto com `multipart/form-data` |
| PUT | `/api/produtos/:id` | Sim | Atualiza produto e gerencia galeria |
| DELETE | `/api/produtos/:id` | Sim | Exclui produto e arquivos associados |

Campos aceitos no cadastro/edicao de produto:

- `nome`
- `categoria`
- `precoBase`
- `prazoProducaoDias`
- `descricao`
- `imagem` para uma capa enviada como arquivo
- `imagens` para multiplos arquivos ou URLs ja existentes mantidas na galeria

### Midia

| Metodo | Rota | Auth | Descricao |
| --- | --- | --- | --- |
| GET | `/api/media` | Sim | Lista itens da biblioteca de midia |
| POST | `/api/media` | Sim | Envia imagens para a biblioteca com `imagens[]` |
| DELETE | `/api/media/:id` | Sim | Remove item da biblioteca e arquivo fisico |

### Leads

| Metodo | Rota | Auth | Descricao |
| --- | --- | --- | --- |
| GET | `/api/leads` | Sim | Lista leads com paginacao, busca e ordenacao |
| POST | `/api/leads` | Nao | Cria lead publico |
| GET | `/api/leads/hoje` | Nao | Busca eventos/aniversarios do dia |
| GET | `/api/leads/:id` | Sim | Busca um lead |
| PUT | `/api/leads/:id` | Sim | Atualiza um lead |
| DELETE | `/api/leads/:id` | Sim | Remove um lead |

### Vendedores

| Metodo | Rota | Auth | Descricao |
| --- | --- | --- | --- |
| GET | `/api/vendedores` | Sim | Lista vendedores |
| POST | `/api/vendedores` | Nao | Cadastra o dono/vendedor inicial |
| GET | `/api/vendedores/:id` | Sim | Busca um vendedor |
| PUT | `/api/vendedores/:id` | Sim | Atualiza um vendedor |
| DELETE | `/api/vendedores/:id` | Sim | Remove um vendedor |

## Produtos e imagens

### Catalogo publico

- O card do produto suporta multiplas imagens.
- O catalogo usa a primeira imagem como slide inicial.
- Se o produto tiver mais de uma imagem, o card mostra:
  - setas de navegacao
  - indicadores
  - autoplay automatico

### Dashboard

No formulario de produto agora e possivel:

- selecionar varias imagens novas
- remover imagens atuais antes de salvar
- remover imagens novas antes do envio
- manter parte da galeria e substituir o resto

## Validacoes importantes

- `descricao` do produto: minimo de 10 caracteres.
- `nome` do produto: minimo de 3 caracteres.
- `categoria` do produto: minimo de 2 caracteres.
- `precoBase`: numero positivo.
- `prazoProducaoDias`: inteiro maior ou igual a 0.

## Postman

Os arquivos recomendados para testes ficam em `postman/`:

- [PI.postman_collection.json](/C:/Users/Artur/Documents/Dev/PI/postman/PI.postman_collection.json)
- [PI.local.postman_environment.json](/C:/Users/Artur/Documents/Dev/PI/postman/PI.local.postman_environment.json)
- [PI.producao.postman_environment.json](/C:/Users/Artur/Documents/Dev/PI/postman/PI.producao.postman_environment.json)
- [README.md](/C:/Users/Artur/Documents/Dev/PI/postman/README.md)

Fluxo recomendado no Postman:

1. Importar a collection e um dos environments.
2. Rodar `Health > Health`.
3. Rodar `Auth > Login`.
4. Rodar os requests autenticados de produtos, midia, leads e vendedores.

## Diferenca entre homolog local e producao

### Homolog local

- `apiBaseUrl = http://localhost:5000/api`
- `uploadsBaseUrl = http://localhost:5000/uploads`

### Producao

- `apiBaseUrl = https://stylodesigner.alwaysdata.net/api`
- `uploadsBaseUrl = https://stylodesigner.alwaysdata.net/uploads`

## Deploy automatizado no AlwaysData

O repositório agora inclui um workflow do GitHub Actions em [deploy-alwaysdata.yml](/C:/Users/Artur/Documents/Dev/PI/.github/workflows/deploy-alwaysdata.yml).

Esse workflow:

1. roda em `push` para `main`
2. sincroniza o projeto no AlwaysData via FTP
3. reinicia o site Node.js pela API do AlwaysData

Os secrets necessários estão documentados em [alwaysdata-secrets.md](/C:/Users/Artur/Documents/Dev/PI/.github/alwaysdata-secrets.md).

Observacao:

- esse fluxo automatiza bem alteracoes de codigo e arquivos estaticos;
- se `backend/package.json` mudar, o servidor pode precisar de instalacao manual de dependencias.

## Observacoes

- A rota de login real e `/api/login`, nao `/api/auth/login`.
- O frontend carrega imagens do mesmo host da API correspondente ao ambiente.
- Em edicao de produto, a remocao de todas as imagens tambem e suportada.
