# 🚀 Guia Rápido - Cyber Shield Trainer

## Como Testar o Sistema

### 1. Iniciar Backend
```bash
cd backend
npm run start:dev
```
O backend ficará disponível em `http://localhost:3001`

### 2. Iniciar Frontend
```bash
npm run dev
```
O frontend ficará disponível em `http://localhost:3000`

### 3. Primeiro Acesso
1. Acesse `http://localhost:3000`
2. Você será redirecionado para `/login`
3. Clique em **"Não tem conta? Criar conta"**
4. Preencha os dados:
   - **Nome:** João Silva
   - **E-mail:** joao@empresa.com
   - **Senha:** MinhaSenha123
   - **Confirmar senha:** MinhaSenha123
5. Clique em **"Criar Conta"**

### 4. Login
Após o cadastro, você será logado automaticamente. Se precisar fazer login novamente:
1. Acesse `http://localhost:3000/login`
2. Digite seu e-mail e senha
3. Clique em **"Entrar"**

### 5. Testar Simuladores
Após o login, você pode acessar:
- **Dashboard** (`/`) - Visão geral
- **Simulador de Ameaça Interna** (`/insider-threat`)
- **Simulador de SQL Injection** (`/sql-injection`)
- E outros simuladores disponíveis

## 🔧 Funcionalidades Implementadas

### ✅ Autenticação Completa
- **Cadastro de usuários** com validação
- **Login com JWT** e refresh tokens
- **Proteção de rotas** - redirecionamento automático
- **Logout automático** para tokens expirados

### ✅ Validações
- **E-mail válido** obrigatório
- **Senha mínima** de 8 caracteres
- **Confirmação de senha** no cadastro
- **Campos obrigatórios** validados

### ✅ UX/UI
- **Interface unificada** para login/cadastro
- **Feedback visual** para erros e sucesso
- **Loading states** durante operações
- **Design cyberpunk** consistente

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o backend está rodando
- Confirme que o token não expirou
- Tente fazer login novamente

### Erro de Conexão
- Certifique-se que o backend está em `http://localhost:3001`
- Verifique se não há conflitos de porta

### Simuladores não Carregam
- Confirme que você está logado
- Verifique o console do navegador para erros
- Certifique-se que o backend tem dados de simulação

## 📊 Endpoints da API

### Autenticação
- `POST /api/v1/auth/register` - Cadastro
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

### Simuladores
- `GET /api/v1/simulations/insider-threat/threats` - Lista ameaças
- `GET /api/v1/simulations/sql-injection/scenarios` - Lista cenários SQL
- `POST /api/v1/simulations/insider-threat/handle` - Processa ação
- `POST /api/v1/simulations/sql-injection/test` - Testa injeção

## 🎯 Próximos Passos

1. **Testar todos os simuladores**
2. **Verificar responsividade mobile**
3. **Implementar recuperação de senha**
4. **Adicionar mais cenários de simulação**
5. **Implementar sistema de pontuação avançado**

---
*Desenvolvido com ❤️ para educação em cibersegurança*</content>
<parameter name="filePath">c:\Users\00128134\Documents\cyber-shield-trainer\QUICKSTART.md