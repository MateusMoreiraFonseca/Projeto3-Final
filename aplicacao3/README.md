# Projeto de Aplicação

Este projeto é uma aplicação de exemplo utilizando React no frontend e Node.js com Express e MongoDB no backend. A seguir, estão as instruções para iniciar o projeto.

## Instruções para Início

1. **Iniciar o frontend**:
   - Abra um terminal e navegue até o diretório do frontend:
     ```bash
     cd aplicacao3
     ```
   - Instale as dependências e inicie o servidor:
     ```bash
     npm install
     npm start
     ```
   - O frontend estará acessível em [http://localhost:3000](http://localhost:3000).

2. **Iniciar o backend**:
   - Abra um segundo terminal e navegue até o diretório do backend:
     ```bash
     cd aplicacao3/backendAplicacao3
     ```
   - Instale as dependências e inicie o servidor:
     ```bash
     npm install
     npm start
     ```
   - O backend estará acessível em [http://localhost:3001](http://localhost:3001).

## Estrutura do Projeto

- **aplicacao3**: Contém o código do frontend em React.
  - **`src`**: Contém os componentes React e arquivos de configuração.
  - **`public`**: Contém arquivos estáticos e o `index.html`.
- **backendAplicacao3**: Contém o código do backend com Node.js, Express e MongoDB.
  - **`models`**: Contém os modelos Mongoose.
  - **`routes`**: Contém as rotas do Express.
  - **`services`**: Contém os serviços de autenticação e outros serviços.
  - **`controllers`**: Contém os controladores para as rotas.
  - **`config`**: Contém arquivos de configuração, como variáveis de ambiente.

## Funcionalidades

- **Login**: Implementa a autenticação de usuários usando JWT e senhas criptografadas.
- **Gerenciamento de Dados**: Inclui operações básicas de CRUD (criar, ler, atualizar e excluir) para dados de exemplo.

## Contribuições

Contribuições são bem-vindas! Por favor, faça um fork do repositório e envie um pull request com suas alterações.

## Contato

Para qualquer dúvida, entre em contato com [mateus.fonseca1992@gmail.com]