# API da Lanchonete
API desenvolvida para controlar as operações de uma rede de lanchonetes, permitindo autenticação de usuários, gerenciamento de produtos, pedidos e pagamentos (mock), com documentação via Swagger.

## Tecnologias

- Node.js
- Express
- Prisma ORM
- SQLite
- JWT (JSON Web Token)
- Bcrypt
- Swagger (OpenAPI)
- Dotenv

## Requisitos

- Node.js
- Banco de dados configurado
- NPM

## Instalação

Clone o projeto:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta:

```bash
cd atividade-backend
```

Instale as dependências:

```bash
npm install
```

# Variáveis de ambiente

Criar um arquivo `.env` baseado no `.env.example`.

Exemplo:

```env
DATABASE_URL="sua_string_de_conexao"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

# Banco de Dados
Executar as migrations:
```bash
npx prisma migrate dev
```
Caso utilize seed:
```bash
npx prisma db seed
```

# Executando a API
```bash
npm start
```
ou
```bash
node src/app.js
```

# Documentação Swagger
Após iniciar a API, acesse:

```
http://localhost:3000/api-docs
```

# Testes
Importar a coleção do Postman (arquivo JSON) disponível no repositório.

Fluxos principais:
- Login
- Cadastro de produtos
- Criação de pedidos
- Pagamento mock
- Atualização do status do pedido

# Estrutura do Projeto
```
src/
├── middlewares/
├── routes/
├── data/
├── app.js
├── prismaClient.js
└── swagger.js
```

## Segurança

- Senhas protegidas com Bcrypt.
- Autenticação utilizando JWT.
- Controle de acesso por perfis (ADMIN e CLIENTE).

# Feito por

Vivian Maria Rocha Cabral

# Como Executar os Testes

1. Inicie a API:
```bash
npm start
```

2. Acesse a documentação Swagger:
```
http://localhost:3000/api-docs
```

3. Importe a coleção do Postman disponível no repositório.

4. Execute os testes na seguinte ordem:
- Cadastro de usuário
- Login
- Copiar o token JWT
- Criar pedido
- Buscar pedido
- Atualizar status do pedido
- Processar pagamento mock
- Executar os testes de erro

5. Para testar os cenários de erro, execute as requisições correspondentes sem token, com dados inválidos ou utilizando IDs inexistentes.

## Ambiente
Antes de executar os testes:
- Configure o arquivo `.env`;
- Execute as migrations do Prisma;
- Caso exista, execute o seed do banco de dados.

## Repositório
Link do projeto:
https://github.com/vivianrchcabral-art/atividade-backend

## Coleção do Postman
A coleção utilizada para validar a API encontra-se neste repositório em formato JSON e está organizada nas seguintes pastas:
- Auth
- Produtos
- Pedidos
- Pagamentos
- Erros