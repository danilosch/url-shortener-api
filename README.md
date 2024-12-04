# URL Shortener API

## Descrição

A **URL Shortener API** é uma aplicação para encurtamento de URLs que permite aos usuários gerar links curtos e rastrear seus acessos. A API oferece funcionalidades para usuários autenticados e não autenticados, com autenticação JWT, validações de entrada.

### Funcionalidades principais

- **Encurtamento de URLs**: Qualquer usuário pode encurtar URLs através de um único endpoint. Se o usuário estiver autenticado, o sistema associa a URL ao seu ID.
- **Endpoing para redirecionamento de URL encurtada para URL original contabilizando os acessos.**
- **Gerenciamento de URLs para usuários autenticados**:
  - **Listar**: Usuários autenticados podem listar as URLs criadas, com contagem de cliques e data de última alteração.
  - **Atualizar**: Usuários autenticados podem atualizar o endereço de destino das suas URLs encurtadas.
  - **Excluir**: Exclusão lógica de URLs, com um campo `deleted_at` para identificar URLs deletadas.
- **Validações**:
  - Validação de dados de entrada em todos os endpoints utilizando bibliotecas como `zod`.
  - Verificação de duplicidade na criação de URLs, com até 3 tentativas para gerar um alias único.
- **Autenticação JWT**:
  - Registro e login de usuários via e-mail e senha.
  - Autenticação baseada em JWT para garantir que somente usuários autenticados possam gerenciar suas URLs.
- **Documentação Swagger**: A API conta com uma documentação interativa gerada pelo Swagger, acessível no endpoint `/api-docs`.

## Tecnologias Utilizadas

- **Node.js** com **Express** para o desenvolvimento da API.
- **JWT** para autenticação de usuários.
- **PostgreSQL** como banco de dados.
- **Docker** para containerização do ambiente.
- **Swagger** para documentação da API.

## Funcionalidades Adicionais Implementadas

- **Docker Compose**: Utilização de Docker Compose para facilitar a configuração e execução do projeto em containers.
- **Documentação Swagger**: A API tem documentação interativa que descreve todos os endpoints e suas funcionalidades. Acesse em `/api-docs` após iniciar o servidor.
- **Validação de Entradas**: A API realiza validações de entradas com bibliotecas como `zod`, garantindo que os dados enviados pelos usuários atendam aos requisitos definidos.
- **Pré-commit hooks com Husky**: Configuração do Husky para garantir que o código siga padrões definidos de formatação e linting antes de ser commitado no Git.
- **Verificação de Duplicidade**: Antes de salvar uma URL, o sistema verifica se o alias gerado já existe, realizando até 3 tentativas para garantir um alias único.

## Como Executar

### Locally (com npm)

1. Clone o repositório:

```bash
git clone https://github.com/danilosch/url-shortener-api.git
```

2. Acesse o diretório do projeto:

```bash
cd url-shortener-api
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor:

```bash
npm run dev
```

### Usando Docker

1. Clone o repositório:

```bash
git clone https://github.com/danilosch/url-shortener-api.git
```

2. Acesse o diretório do projeto:

```bash
cd url-shortener-api
```

3. Construa e inicie os containers do Docker:

```bash
docker-compose up --build
```

A API estará disponível em `http://localhost:3000`.

A documentação Swagger pode ser acessada em `http://localhost:3000/api-docs`.

## Endpoints

- `POST /register`: Registra um novo usuário.
- `POST /login`: Realiza login e retorna um JWT token.
- `POST /shorten`: Encurta uma URL (não requer autenticação, mas pode associar ao usuário autenticado).
- `GET /urls`: Lista as URLs encurtadas pelo usuário autenticado, com contagem de cliques.
- `PUT /urls/:id`: Atualiza uma URL encurtada pelo usuário autenticado.
- `DELETE /urls/:id`: Exclui logicamente uma URL do banco de dados.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
