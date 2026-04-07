# **Documentação Técnica: Sistema de Gestão \- Projeto Integrador UNIVESP**

O presente repositório abriga o código-fonte referente ao sistema de gestão desenvolvido como requisito avaliativo para o Projeto Integrador da Universidade Virtual do Estado de São Paulo (UNIVESP). A arquitetura do software foi estruturada sob o paradigma de separação de responsabilidades, segregando a interface de usuário (Frontend desenvolvido em React/Vite) da lógica de negócios e infraestrutura de dados (Backend implementado em Node.js/Express). O escopo principal da aplicação compreende o gerenciamento centralizado de Vendedores, Leads e Produtos, com ênfase na otimização do monitoramento de eventos diários e no fomento de métricas de conversão.

## **Principais Funcionalidades**

* **Autenticação e Segurança:** Controle de acesso restrito estabelecido por meio de protocolos de autenticação baseados em JSON Web Tokens (JWT).  
* **Gestão de Vendedores:** Operações integrais de criação, leitura, atualização e exclusão (CRUD) destinadas estritamente à administração e auditoria da plataforma.  
* **Administração de Leads:** Rastreamento sistemático de potenciais clientes, o qual engloba o monitoramento automatizado de datas comemorativas e aniversários diários, visando a retenção de público.  
* **Controle de Produtos:** Gerenciamento do catálogo de itens, abrangendo a definição de parâmetros de precificação, a estipulação de prazos operacionais de produção e a determinação do status de disponibilidade.

## **Matriz Tecnológica**

* **Camada de Apresentação (Frontend):** React 18, Vite, React Router DOM e Axios.  
* **Camada Lógica e Persistência (Backend):** Node.js, Express, MongoDB integrado ao Mongoose, JWT em conjunto com bcryptjs para criptografia de credenciais, Zod para a validação estrutural de dados recebidos, além das bibliotecas Helmet e CORS para o estabelecimento de rigorosas diretrizes de segurança da API.

### **Módulo de Autenticação e Vendedores**

* POST /login: Efetua a autenticação do vendedor no sistema.  
* POST /vendedores: Realiza o registro de um novo perfil de vendedor.  
* GET /vendedores: Retorna a listagem dos vendedores cadastrados na base de dados.  
* GET, PUT, DELETE /vendedores/:id: Executa operações de busca específica, atualização cadastral ou remoção de um vendedor, mediante identificador único.

### **Módulo de Leads**

* POST /leads: Formaliza a inclusão de um novo lead.  
* GET /leads: Retorna o conjunto integral de leads prospectados.  
* GET /leads/hoje: Compila a relação de eventos correspondentes à data corrente (aniversários e datas comemorativas associadas aos leads).  
* GET, PUT, DELETE /leads/:id: Permite a visualização detalhada, a alteração de dados ou a exclusão de um lead específico.

### **Módulo de Produtos**

* GET /produtos: Apresenta o catálogo exclusivo de produtos com status ativo.  
* POST /produtos: Insere um novo produto no catálogo do sistema.  
* PUT, DELETE /produtos/:id: Efetiva a modificação ou exclusão de registros referentes a um produto determinado.

## **Procedimentos de Homologação (Postman)**

Para fins de validação técnica e análise das requisições documentadas, recomenda-se a importação do diretório postman/collections/Tests em um workspace do aplicativo Postman. Tais coleções contêm cenários pré-configurados, facilitando a testagem integral e padronizada dos módulos de Login, Leads, Produtos e Vendedores.
222TESTE