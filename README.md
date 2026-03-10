# 🛡️ Cyber Shield Trainer

Um laboratório virtual de segurança onde você enfrenta simulações realistas de ataques cibernéticos. Aprenda a identificar ameaças, reagir corretamente e entender vulnerabilidades comuns — de forma segura e interativa.

## ✨ Funcionalidades

| Simulador | Descrição |
|-----------|-----------|
| 📧 **Phishing** | Analise e-mails para identificar tentativas de phishing |
| 🔐 **Login Falso** | Detecte páginas de login falsas |
| 🕵️ **Engenharia Social** | Reconheça manipulações psicológicas |
| 🛰️ **Ataque de Rede** | Responda a incidentes de rede em tempo real (IDS) |
| 🔑 **Senhas** | Teste a resistência de senhas contra brute force |
| 🕵️ **Ameaça Interna** | Identifique e responda a ameaças internas |
| 💉 **SQL Injection** | Aprenda sobre vulnerabilidades de banco de dados |

## 🏗️ Stack

```
Frontend                   Backend
─────────────────────      ─────────────────────────────
Next.js 16 (App Router)    NestJS 10
TypeScript 5               TypeScript 5
Tailwind CSS 4             TypeORM + SQLite / PostgreSQL
Framer Motion              JWT + Refresh Tokens
                           Swagger / OpenAPI
                           bcrypt + Rate Limiting
```

## 🚀 Desenvolvimento local

### Pré-requisitos
- Node.js 18+

### Configuração

```bash
# 1. Clone o repositório
git clone <repository-url>
cd cyber-shield-trainer

# 2. Instale as dependências do frontend
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com a URL do seu backend

# 4. Instale as dependências do backend
cd backend && npm install && cd ..
```

### Executando

```bash
# Terminal 1 — Backend (porta 3001)
cd backend
npm run start:dev

# Terminal 2 — Frontend (porta 3000)
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
# Frontend
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run start     # Servidor de produção
npm run lint      # Linting

# Backend (dentro de /backend)
npm run start:dev # Desenvolvimento com watch
npm run build     # Build
npm run test      # Testes
```

## ☁️ Deploy

### Frontend → Vercel

1. Importe o repositório no [Vercel](https://vercel.com)
2. Adicione a variável de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://sua-api.exemplo.com
   ```
3. Deploy!

### Backend → Railway / Render / Fly.io

O backend NestJS **não pode ser hospedado na Vercel** (requer processo persistente). Use:
- [Railway](https://railway.app)
- [Render](https://render.com)
- [Fly.io](https://fly.io)

Certifique-se de configurar as variáveis de ambiente do backend (banco de dados PostgreSQL, JWT secret, etc.) no serviço escolhido.

## 📁 Estrutura

```
cyber-shield-trainer/
├── src/
│   ├── app/                    # Rotas e páginas (Next.js App Router)
│   │   ├── email-simulator/
│   │   ├── feedback/
│   │   ├── insider-threat/
│   │   ├── login/
│   │   ├── login-simulator/
│   │   ├── network-attack/
│   │   ├── password-simulator/
│   │   ├── scenarios/
│   │   ├── social-engineering/
│   │   ├── sql-injection/
│   │   ├── layout.tsx
│   │   └── page.tsx            # Dashboard principal
│   └── components/
│       ├── AppLayout.tsx
│       └── Sidebar.tsx
├── backend/
│   └── src/
│       ├── auth/               # JWT, login, registro
│       ├── users/              # Gestão de usuários
│       ├── simulations/        # Lógica dos simuladores
│       ├── scores/             # Sistema de pontuação
│       └── reports/            # Relatórios de progresso
├── .env.example                # Template de variáveis de ambiente
├── next.config.ts
└── docker-compose.yml          # Ambiente completo com Docker
```

## 🐳 Docker (opcional)

```bash
docker-compose up --build
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.
