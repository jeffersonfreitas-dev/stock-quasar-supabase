# StockSet

Projeto criado no aprendizado do Vue Quasar framework. Permite o cadastro de categoria, produtos, configurações e personaização do tema e opção de visualização dos produtos cadastrado através de links públicos e contato via whatsapp.

## Tecnologias
O projeto foi criado no formato serverless, onde toda a parte do backend foi usado a stack do Google Firebase. O projeto foi configurado, inicialmente, para a realização de login via cadastro de credenciais (e-mail e senha com confirmação de e-mail) e login social (Google).

- Quasar Vue no frontend
- Firebase Authentication no login do usuário
- Firebase Store para armazenar as fotos dos produtos
- Firebase Firestore para armazenamento de registros (NoSQL)
- Firebase Hosting para hospedagem da aplicação
- Github Actions para realização do pipeline CI/CD
- Vuex para armazenamento LocalStorage

## Rodar o projeto
### Instalar dependencias
```bash
yarn
# or
npm install
```

### Configuração do Firebase
Inclua suas credenciais do Firebase no arquivo src/boot/firebase.js

### Iniciar o projeto no perfil developer
```bash
quasar dev
```

### Lint
```bash
yarn lint
# or
npm run lint
```


