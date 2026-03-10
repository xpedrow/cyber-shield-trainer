# Cyber Shield Trainer

Um laboratório virtual de segurança onde você enfrenta simulações realistas de ataques cibernéticos. Aprenda a identificar ameaças, reagir corretamente e entender vulnerabilidades comuns.

## 🚀 Iniciando

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd cyber-shield-trainer
   ```

2. **Instale as dependências:**
   ```bash
   # Frontend
   npm install

   # Backend
   cd backend
   npm install
   cd ..
   ```

3. **Inicie o backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

4. **Inicie o frontend (em outro terminal):**
   ```bash
   npm run dev
   ```

5. **Acesse o sistema:**
   - Abra [http://localhost:3000](http://localhost:3000)
   - Você será redirecionado para a página de login

## 📋 Como Usar

### Primeiro Acesso - Cadastro

1. **Acesse a página de login** em `http://localhost:3000/login`
2. **Clique em "Não tem conta? Criar conta"**
3. **Preencha os dados:**
   - Nome completo
   - E-mail válido
   - Senha (mínimo 8 caracteres)
   - Confirmação da senha
4. **Clique em "Criar Conta"**
5. **Após o cadastro, você será logado automaticamente**

### Login

1. **Na página de login**, insira seu e-mail e senha
2. **Clique em "Entrar"**
3. **Você será redirecionado para o dashboard**

### Simuladores Disponíveis

- **🕵️ Simulador de Ameaça Interna** - Identifique e responda a ameaças de dentro da organização
- **💉 Simulador de SQL Injection** - Pratique defesa contra injeções SQL
- **📧 Simulador de E-mail** - Identifique phishing e emails maliciosos
- **🔐 Simulador de Login** - Reconheça páginas falsas de login
- **🌐 Simulador de Rede** - Entenda ataques de rede
- **🔑 Simulador de Senha** - Aprenda sobre segurança de senhas
- **🎭 Engenharia Social** - Pratique defesa contra manipulação social

## 🏗️ Arquitetura

### Frontend (Next.js + TypeScript)
- **Framework:** Next.js 14 com App Router
- **Linguagem:** TypeScript
- **Styling:** CSS Variables + Tailwind CSS
- **Animações:** Framer Motion
- **Estado:** React Hooks

### Backend (NestJS + TypeORM)
- **Framework:** NestJS
- **Banco:** SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação:** JWT
- **Cache:** Redis
- **Documentação:** Swagger

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Frontend
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting

# Backend
cd backend
npm run start:dev    # Inicia em modo desenvolvimento
npm run build        # Build para produção
npm run test         # Executa testes
```

### Estrutura do Projeto

```
cyber-shield-trainer/
├── src/
│   ├── app/                 # Páginas Next.js
│   ├── components/          # Componentes reutilizáveis
│   └── ...
├── backend/
│   ├── src/
│   │   ├── auth/           # Autenticação
│   │   ├── simulations/    # Lógica dos simuladores
│   │   ├── users/          # Gestão de usuários
│   │   └── ...
│   └── ...
└── ...
```

## 🔒 Segurança

- **Autenticação JWT** com refresh tokens
- **Rate limiting** nas APIs
- **Validação de entrada** em todos os endpoints
- **Hash de senhas** com bcrypt
- **CORS configurado** para desenvolvimento

## 📚 Aprendizado

Cada simulador inclui:
- **Cenários realistas** baseados em ameaças reais
- **Feedback educacional** explicando o que aconteceu
- **Pontuação** para acompanhar o progresso
- **Dicas e explicações** sobre melhores práticas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
