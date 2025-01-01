# API  de Lista de Tarefas

API de um gerenciador de tarefas simples, com registro de usuários e tarefas.


## Índice

- [Sobre](#sobre)
- [Desenvolvedor](#desenvolvedor)
- [Instalação](#instalação)
- [Uso](#uso)
- [Rotas da API](#rotas-da-api)
- [Tecnologias](#tecnologias)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Sobre

API  de um gerenciador de tarefas simples, feito em Node.js com uso de banco de dados noSQL MongoDB.

## Desenvolvedor
### Rycherd Dheurymy
(ele/dele)

#### Sobre mim

Olá, pessoas. Sou o Dheurymy. Desenvolvedor Front-End dedicado a desenvolver interfaces de usuário interativas e eficientes. Aluno de Análise e Desenvolvimento de Sistemas pela Faculdade Laboro. Em paralelo a isso, trabalho a seis anos na Cervejaria Ambev, atualmente como Técnico Eletromecânico Senior . Foi por meio do trabalho que acabei conhecendo a área da programação e me apaixonei pelo que vi. Na vida pessoal, sou um homem gay, pai de 2 gatos, apaixonado por praia e viagens.

#### Conecte-se comigo
[![E-mail](https://img.shields.io/badge/-Email-000?style=for-the-badge&logo=microsoft-outlook&logoColor=E94D5F)](mailto:dheurymy@outlook.com)
[![Instagram](https://img.shields.io/badge/Instagram-000?style=for-the-badge&logo=instagram)](https://www.instagram.com/dheurymy/)



## Instalação

Para instalar e rodar este projeto localmente, siga estas etapas:

1. Clone o repositório:
    ```sh
    git clone https://github.com/dheurymy/api-task-manager.git
    cd api-task-manager
    ```

2. Instale as dependências:
    ```sh
    npm install bcryptjs cors dotenv express jsonwebtoken mongoose
    ```

3. Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
    ```env
    PORT=5000
    MONGO_URI=sua_uri_do_mongodb
    JWT_SECRET=sua_chave_jwt
    ```

4. Rode a aplicação:
    ```sh
    npm start
    ```

## Uso

Para testar a API, você pode usar a ferramenta [Insomnia](https://insomnia.rest/).

### Testando a API com o Insomnia

1. **Verificar se a API está rodando**:
    - Abra o Insomnia e clique em "New Request".
    - Nomeie a requisição como "Verificar API" e selecione "GET".
    - No campo "URL", insira `http://localhost:5000/`.
    - Clique em "Send" e verifique a resposta.

2. **Registrar um novo usuário**:
    - Clique em "New Request".
    - Nomeie a requisição como "Registrar Usuário" e selecione "POST".
    - No campo "URL", insira `http://localhost:5000/register`.
    - Vá para a aba "Body" e selecione "JSON".
    - Adicione o seguinte JSON:
    ```json
    {
      "name": "Seu Nome",
      "email": "seuemail@example.com",
      "password": "suasenha"
    }
    ```
    - Clique em "Send" e verifique a resposta.

3. **Login de usuário**:
    - Clique em "New Request".
    - Nomeie a requisição como "Login Usuário" e selecione "POST".
    - No campo "URL", insira `http://localhost:5000/login`.
    - Vá para a aba "Body" e selecione "JSON".
    - Adicione o seguinte JSON:
    ```json
    {
      "email": "seuemail@example.com",
      "password": "suasenha"
    }
    ```
    - Clique em "Send" e verifique a resposta.

4. **Obter todas as tarefas do usuário autenticado**:
    - Clique em "New Request".
    - Nomeie a requisição como "Obter Tarefas" e selecione "GET".
    - No campo "URL", insira `http://localhost:5000/tasks`.
    - Adicione um cabeçalho de autorização com o token JWT:
        - Key: `Authorization`
        - Value: `Bearer seu_token_jwt`
    - Clique em "Send" e verifique a resposta.

## Rotas da API

### Rota Principal

- **GET /**: Verifica se a API está rodando.
  - Exemplo de resposta:
    ```sh
    Hey this is my API running 🥳
    ```

### Rotas de Autenticação

- **POST /register**: Registra um novo usuário.
  - Corpo da requisição:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```
  - Exemplo de resposta (sucesso):
    ```json
    {
      "message": "Usuário registrado com sucesso"
    }
    ```
  - Exemplo de resposta (erro):
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

- **POST /login**: Realiza login de usuário.
  - Corpo da requisição:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Exemplo de resposta (sucesso):
    ```json
    {
      "token": "seu_token_jwt"
    }
    ```
  - Exemplo de resposta (erro):
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

### Rotas de Tarefas

- **GET /tasks**: Obtém todas as tarefas do usuário autenticado.
  - Exemplo de resposta:
    ```json
    [
      {
        "_id": "task_id",
        "text": "Descrição da tarefa",
        "category": "Categoria da tarefa",
        "isCompleted": false,
        "userId": "user_id"
      },
      ...
    ]
    ```

- **POST /addtask**: Cria uma nova tarefa.
  - Corpo da requisição:
    ```json
    {
      "text": "Descrição da tarefa",
      "category": "Categoria da tarefa"
    }
    ```
  - Exemplo de resposta:
    ```json
    {
      "_id": "task_id",
      "text": "Descrição da tarefa",
      "category": "Categoria da tarefa",
      "isCompleted": false,
      "userId": "user_id"
    }
    ```

- **PATCH /:id**: Atualiza uma tarefa existente.
  - Corpo da requisição (exemplo de atualizações permitidas):
    ```json
    {
      "text": "Nova descrição da tarefa",
      "category": "Nova categoria da tarefa",
      "isCompleted": true
    }
    ```
  - Exemplo de resposta:
    ```json
    {
      "_id": "task_id",
      "text": "Nova descrição da tarefa",
      "category": "Nova categoria da tarefa",
      "isCompleted": true,
      "userId": "user_id"
    }
    ```

- **DELETE /:id**: Deleta uma tarefa existente.
  - Exemplo de resposta:
    ```json
    {
      "message": "Tarefa deletada"
    }
    ```

## Tecnologias

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Cors](https://www.npmjs.com/package/cors)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)

## Contribuição

Se você quiser contribuir com este projeto, por favor, abra uma issue ou envie um pull request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
