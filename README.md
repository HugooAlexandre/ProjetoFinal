# Gestão de Propostas de Projeto Final - Prova de Conceito (PoC)

Este projeto consiste numa aplicação Web Full-Stack para a gestão de propostas de temas de "Projeto Final de Curso" num contexto académico. A aplicação permite que docentes registem, editem e removam propostas de projeto, associando coorientadores e alunos, garantindo integridade referencial e segurança de dados.

O projeto foi desenvolvido com competências de **Vue.js**, **Node.js** e **PostgreSQL**.

---

##  Funcionalidades

### Públicas
*   **Listagem de Docentes:** Utilizadores anónimos podem consultar a lista de docentes registados na instituição.

### Docentes (Área Privada)
*   **Autenticação Segura:** Login com validação de credenciais (Passwords encriptadas com Bcrypt) e gestão de sessão via JWT (JSON Web Tokens).
*   **Dashboard:** Visualização das propostas criadas pelo docente autenticado.
*   **Criação de Propostas:** Formulário complexo que permite associar:
    *   Título e Descrição;
    *   Coorientadores (Múltiplos docentes);
    *   Alunos sugeridos (Múltiplos alunos);
    *   Palavras-chave.
*   **Integridade de Dados:** O registo de propostas utiliza **Transações SQL** (`BEGIN...COMMIT`) para garantir que todas as relações (alunos/coorientadores) são gravadas corretamente ou revertidas em caso de erro.
*   **Remoção:** Possibilidade de apagar propostas (com *Cascade Delete* nas relações).

---

##  Tech Stack

**Front-end:**
*   **Vue.js 3** (Composition API)
*   **Vite** (Build tool)
*   **Vue Router** (Navegação SPA)
*   **Axios** (Cliente HTTP com interceptors para JWT)

**Back-end:**
*   **Node.js** com **Express**
*   **PostgreSQL** (Base de dados relacional)
*   **pg** (Driver Postgres)
*   **Bcryptjs** (Hashing de passwords)
*   **JsonWebToken** (Autenticação stateless)

---

##  Pré-requisitos

Para executar este projeto, necessita de ter instalado:
*   [Node.js](https://nodejs.org/) (v16 ou superior)
*   [PostgreSQL](https://www.postgresql.org/)

---

##  Instalação e Configuração

Siga os passos para colocar o projeto a funcionar localmente.

### 1. Configuração da Base de Dados

1.  Crie uma base de dados no PostgreSQL (ex: `projeto_gestao_academica`).
2.  Execute o script SQL inicial para criar as tabelas (localizado em `server/scripts/schema.sql`) através do seu gestor de BD (pgAdmin ou terminal).

### 2. Configuração do Back-end (Server)

1.  Navegue até à pasta do servidor:
    ```bash
    cd server
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um ficheiro `.env` na raiz da pasta `server` com as suas credenciais:
    ```env
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=projeto_gestao_academica
    DB_PASSWORD=sua_password_postgres
    DB_PORT=5432
    JWT_SECRET=segredo_academico_seguro
    PORT=3000
    ```
4.  **Popular a Base de Dados (Seed):**
    Execute o script que limpa a BD e cria dados de teste (Docentes, Alunos, Keywords) com passwords encriptadas:
    ```bash
    node scripts/seed.js
    ```
5.  Inicie o servidor:
    ```bash
    npm run dev
    ```
    *O servidor deverá iniciar na porta 3000.*

### 3. Configuração do Front-end (Client)

1.  Abra um novo terminal e navegue até à pasta do cliente:
    ```bash
    cd client
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação:
    ```bash
    npm run dev
    ```
4.  Abra o link fornecido no terminal (geralmente `http://localhost:5173`).

---

##  Como Testar

Aceda à aplicação no browser. Pode utilizar as seguintes credenciais geradas pelo script de *seed*:

**Docente Exemplo 1:**
*   **Email:** `joao@uni.pt`
*   **Password:** `1234`

**Docente Exemplo 2:**
*   **Email:** `maria@uni.pt`
*   **Password:** `1234`

### Passos Sugeridos:
1.  Na página inicial, veja a lista pública de docentes.
2.  Clique em "Login" e entre com as credenciais acima.
3.  No Dashboard, clique em "+ Nova Proposta".
4.  Preencha o formulário, selecione múltiplos alunos/coorientadores (segurando Ctrl/Cmd) e grave.
5.  Verifique se a proposta aparece no Dashboard.
6.  Tente apagar a proposta.

---

##  Estrutura do Projeto


projeto-final-gestao/

│

├── server/                     # BACK-END

│   ├── .env     

│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         
│   │   ├── controllers/       
│   │   │   ├── authController.js
│   │   │   ├── publicController.js
│   │   │   └── proposalController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js 
│   │   ├── routes/            
│   │   │   ├── auth.js
│   │   │   ├── public.js
│   │   │   └── proposals.js
│   │   └── app.js             
│   └── scripts/
│       ├── schema.sql          
│       └── seed.js             
│
└── client/                     # FRONT-END (Vue + Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── api/
        │   ├── style.css
        │   └── axios.js       
        ├── router/
        │   └── index.js        
        ├── views/
        │   ├── Login.vue
        │   ├── PublicList.vue
        │   ├── Dashboard.vue
        │   └── ProposalForm.vue
        ├── App.vue

        └── main.js
