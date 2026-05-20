# 📦 PI - Plataforma de Gestão para Papelaria Criativa

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Plataforma completa para gerenciamento de uma papelaria criativa, desenvolvida como projeto integrador do Bacharelado em Tecnologia da Informação (UNIVESP). Permite captação de leads, administração de produtos e vendedores, com painel administrativo e autenticação segura.

**🔗 Deploys ativos:**
- **Front-end:** [stylodesigner.vercel.app/index.html](https://stylodesigner.vercel.app/index.html)
- **API Back-end:** [stylodesigner.alwaysdata.net/api](https://stylodesigner.alwaysdata.net/api)

---

## ✨ Funcionalidades Principais

- **Landing Page:** Página institucional para apresentação da marca e captação de leads.
- **Painel Administrativo (Dashboard):**
  - CRUD completo de produtos (com upload de imagens).
  - CRUD de leads (com busca textual e paginação).
  - Cadastro e gerenciamento de vendedores.
  - Visualização de aniversariantes do dia.
- **Autenticação JWT:** Proteção de rotas administrativas e identidade de vendedores.
- **Validação de dados:** Todas as entradas são validadas com Zod.
- **Segurança:** Headers protegidos com Helmet, CORS configurado e boas práticas de API REST.

---

## 🚀 Começando

Siga as instruções abaixo para rodar o projeto localmente.

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [MongoDB 6+](https://www.mongodb.com/try/download/community) (instalado localmente ou via MongoDB Atlas)
- [Git](https://git-scm.com/)

### Configuração do Ambiente

#### 1. Clone o repositório:

    git clone https://github.com/RomaArtur/PI.git
    cd PI

#### 2. Instale as dependências:

    npm install

#### 3. Crie um arquivo `.env` na raiz com o seguinte conteúdo:

    # Servidor
    PORT=3000
    NODE_ENV=development

    # Banco de dados
    MONGODB_URI=mongodb://localhost:27017/papelaria

    # JWT
    JWT_SECRET=sua_chave_secreta_aqui
    JWT_EXPIRES_IN=7d

#### 4. Inicie o servidor:

    npm run dev

#### 5. Acesse a API em `http://localhost:3000`. O front-end (se rodando localmente) deve apontar para essa URL.

---

## 📚 Documentação da API

#### A coleção do **Postman** está disponível na pasta `postman/`. Importe o arquivo para testar todos os endpoints interativamente.

Principais rotas:

| Método | Rota                  | Descrição                    | Autenticação |
|--------|-----------------------|------------------------------|--------------|
| POST   | `/api/auth/login`     | Login de vendedor            | Não          |
| GET    | `/api/leads`          | Listar leads (com paginação) | Sim (JWT)    |
| POST   | `/api/leads`          | Criar novo lead (público)    | Não          |
| GET    | `/api/produtos`       | Listar produtos              | Não          |
| POST   | `/api/produtos`       | Cadastrar produto            | Sim (JWT)    |
| PUT    | `/api/produtos/:id`   | Atualizar produto            | Sim (JWT)    |
| DELETE | `/api/produtos/:id`   | Remover produto              | Sim (JWT)    |

---

## 🛠️ Tecnologias Utilizadas

- **Back-end:** Node.js, Express 5, Mongoose (MongoDB), JWT, Zod, Multer, Helmet.
- **Front-end:** HTML5, CSS3, JavaScript (componentizado), implantado no Vercel.
- **Ferramentas:** Postman, Git, GitHub.

---

## 📸 Screenshots

<img width="1912" height="948" alt="image" src="https://github.com/user-attachments/assets/797ab8e9-1ff9-4862-964d-e46941b730a7" />
<img width="1912" height="948" alt="image" src="https://github.com/user-attachments/assets/282e8083-8c22-4751-9ea7-f56cae8de1dd" />
<img width="1912" height="948" alt="image" src="https://github.com/user-attachments/assets/8577bf92-8aa8-4d2e-8e2b-8e00131371a7" />

---

## 📌 Status do Projeto

✅ **MVP funcional:** entregue como projeto integrador.  
⏳ **Próximos passos:** (em planejamento): migração do front-end para React, adição de testes automatizados e disparo automatizado de mensagens com N8N. 

---
