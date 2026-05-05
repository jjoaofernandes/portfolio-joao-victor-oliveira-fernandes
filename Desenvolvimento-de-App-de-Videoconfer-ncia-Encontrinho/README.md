<div align="center">

<br/>

# 💕 Encontrinho

### Seu date virtual começa aqui. Conecte-se. Conheça. Se apaixone.

<br/>

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-ff2d55?style=for-the-badge)](/)
[![Plataforma](https://img.shields.io/badge/plataforma-iOS%20%7C%20Android-ff2d55?style=for-the-badge)](/)
[![Licença](https://img.shields.io/badge/licença-MIT-ff2d55?style=for-the-badge)](LICENSE)

<br/>

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](/)
[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](/)
[![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)](/)
[![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](/)

<br/>

> *Chega de rolar fotos infinitas. No **Encontrinho**, você participa de eventos de Speed Dating por videochamada ao vivo — encontros de 3 minutos com pessoas reais. Sem filtros. Sem mentiras. Só conexões de verdade.*

<br/>

---

</div>

## 📱 Telas do App

<div align="center">

| ⚙️ Setup | 🏠 Início | 🔍 Matchmaking | ❤️ Matches | 👤 Perfil |
|:---:|:---:|:---:|:---:|:---:|
| <img src="screenshots/tela-setup.png" width="160"/> | <img src="screenshots/tela-home.png" width="160"/> | <img src="screenshots/tela-matchmaking.png" width="160"/> | <img src="screenshots/tela-matches.png" width="160"/> | <img src="screenshots/tela-perfil.png" width="160"/> |
| Cadastro com foto, nome, idade, gênero e interesses | Countdown do próximo Speed Dating e estatísticas | Animação de radar e parceiro encontrado em tempo real | Lista de matches ou estado vazio motivacional | Stats, duração configurável e edição de perfil |

</div>

<br/>

## ✨ Funcionalidades

### ✅ Implementadas

- **⏱️ Speed Dating ao Vivo** — Eventos com encontros de duração configurável (1, 2, 3 ou 5 minutos)
- **📅 Countdown em Tempo Real** — Contador regressivo para o próximo evento ao vivo
- **🎫 Entrar no Evento** — Um toque e você já está na fila de matchmaking
- **🔍 Matchmaking Automático** — Animação de busca com ondas de radar enquanto encontra parceiro
- **✨ Parceiro Encontrado** — Exibe avatar e nome do parceiro antes de conectar a chamada
- **🎥 Videochamada Instantânea** — Conexão automática via WebRTC ao encontrar o parceiro
- **💘 Match Mútuo** — Só vira match se os dois curtirem após o encontro
- **❤️ Tela de Matches** — Lista todos os matches com estado vazio motivacional
- **📊 Estatísticas** — Matches, encontros e % de curtidas no perfil e na home
- **👤 Perfil Completo** — Foto, nome de exibição, idade, gênero, interesses e bio curta
- **⏱️ Duração Configurável** — Escolha entre 1, 2, 3 ou 5 minutos por encontro
- **🗑️ Resetar Histórico** — Limpa todo o histórico de encontros
- **✏️ Editar Perfil** — Atualiza informações a qualquer momento

### 🔨 Em Desenvolvimento

- [ ] 💬 Chat privado após o match
- [ ] 🔔 Notificações push quando o evento está prestes a começar
- [ ] 🎭 Filtros de compatibilidade por cidade e interesses
- [ ] 🌙 Modo claro (tema escuro já implementado)
- [ ] 🤖 Sugestões de conversa por IA durante a chamada

<br/>

## 🗺️ Fluxo do Usuário

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  1. Cadastro → Setup do perfil (foto, nome, idade, gênero)  │
│                                                              │
│  2. Home → Vê countdown do próximo Speed Dating             │
│            + estatísticas pessoais (matches, encontros)      │
│                                                              │
│  3. "🎫 Entrar no Evento" → entra na fila                   │
│                                                              │
│  4. Tela "Encontrando parceiro..." (animação de radar)      │
│       └── "✨ Parceiro encontrado!" → conecta chamada       │
│                                                              │
│  5. Videochamada ao vivo (1 a 5 minutos)                    │
│                                                              │
│  6. Curtiu?                                                  │
│      ✅ Match mútuo → aparece em Matches ❤️                 │
│      ❌ Não curtiu → volta para a fila                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

<br/>

## 🏗️ Estrutura do Projeto

```
encontrinho/
├── app/                          # Rotas do Expo Router
│   ├── _layout.tsx               # Layout raiz (providers globais)
│   ├── index.tsx                 # Tela de entrada / splash
│   ├── onboarding.tsx            # Onboarding inicial
│   ├── setup.tsx                 # Setup do perfil
│   ├── waiting-room.tsx          # Sala de espera / matchmaking
│   ├── video-call.tsx            # Videochamada ao vivo
│   ├── post-call.tsx             # Tela pós-chamada (like/pass)
│   ├── chat.tsx                  # Chat com match
│   ├── (tabs)/                   # Navegação por abas
│   │   ├── index.tsx             # Home (countdown + stats)
│   │   ├── matches.tsx           # Seus matches ❤️
│   │   └── profile.tsx           # Perfil do usuário
│   └── oauth/
│       └── callback.tsx          # Callback OAuth
│
├── components/                   # Componentes reutilizáveis
├── lib/
│   ├── trpc.ts                   # Configuração tRPC
│   ├── theme-provider.tsx        # Tema escuro/claro
│   ├── speed-dating-context.tsx  # Context do Speed Dating
│   └── _core/
│       ├── manus-runtime.ts      # Runtime de integração
│       └── nativewind-pressable.ts
│
├── server/                       # Backend / API
├── shared/                       # Código compartilhado
├── hooks/                        # Custom hooks
├── constants/                    # Constantes globais
├── assets/                       # Imagens e fontes
├── app.config.ts                 # Configuração do Expo
├── tailwind.config.js            # NativeWind / Tailwind
├── drizzle.config.ts             # ORM Drizzle
└── tsconfig.json
```

<br/>

## 🛠️ Stack Tecnológica

### 📱 Mobile / Frontend
| Tecnologia | Função |
|---|---|
| **React Native** | Framework mobile cross-platform |
| **Expo + Expo Router** | Toolchain e navegação por rotas |
| **TypeScript** | Tipagem estática |
| **NativeWind** | Tailwind CSS para React Native |
| **WebRTC** | Videochamada peer-to-peer em tempo real |
| **React Native Gesture Handler** | Gestos e animações |
| **React Native Reanimated** | Animações fluidas |
| **React Native Safe Area Context** | Suporte a notch e bordas |

### 🖥️ Backend / Dados
| Tecnologia | Função |
|---|---|
| **tRPC** | API type-safe entre cliente e servidor |
| **TanStack Query** | Cache e sincronização de dados |
| **Drizzle ORM** | Acesso ao banco de dados com tipagem |
| **Socket.io** | Eventos em tempo real (matchmaking) |

### ☁️ Infraestrutura
| Tecnologia | Função |
|---|---|
| **OAuth 2.0** | Autenticação social |
| **TURN/STUN** | NAT traversal para WebRTC |
| **Docker** | Containerização do backend |

<br/>

## ⚡ Como Rodar

### Pré-requisitos

- Node.js >= 18.x
- pnpm >= 8.x
- Expo CLI
- iOS Simulator (Mac) ou Android Studio

### 1. Clone o repositório

```bash
git clone https://github.com/jjoaofernandes/portfolio-joao-victor-oliveira-fernandes.git
cd portfolio-joao-victor-oliveira-fernandes/Projeto-Videoconferencia
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
cp expo-env.d.ts .env
# Edite o arquivo com suas credenciais
```

### 4. Inicie o projeto

```bash
# Desenvolvimento
pnpm start

# iOS
pnpm ios

# Android
pnpm android

# Web
pnpm web
```

<br/>

## 🔐 Segurança e Privacidade

- 🔒 **Criptografia nas videochamadas** via DTLS-SRTP (WebRTC)
- 🚫 **Sem gravação** — nenhuma chamada é armazenada
- 🛡️ **Autenticação OAuth** — login seguro com provedores confiáveis
- ✅ **LGPD compliant** — controle total dos seus dados
- 🗑️ **Resetar histórico** — apague todos os seus dados a qualquer momento

<br/>

## 🤝 Como Contribuir

1. Faça um **fork** do projeto
2. Crie sua branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: minha feature incrível'`
4. Push: `git push origin feature/minha-feature`
5. Abra um **Pull Request** 🚀

### Padrão de commits

```
feat:      nova funcionalidade
fix:       correção de bug
docs:      documentação
style:     formatação
refactor:  refatoração
test:      testes
chore:     tarefas de build
```

<br/>

## 📋 Roadmap

### v1.0 — MVP ✅
- [x] Onboarding e setup de perfil
- [x] Tela inicial com countdown em tempo real
- [x] Estatísticas (matches, encontros, curtidas)
- [x] Matchmaking automático com animação de radar
- [x] Videochamada ao vivo via WebRTC
- [x] Match mútuo (like/pass)
- [x] Tela de matches com estado vazio
- [x] Perfil com duração configurável dos encontros
- [x] Tema escuro

### v1.5 — Em andamento 🔨
- [ ] Chat privado após match
- [ ] Notificações push
- [ ] Filtros de compatibilidade

### v2.0 — Planejado 📐
- [ ] Sugestões de conversa por IA
- [ ] Eventos temáticos
- [ ] Plano premium

<br/>

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](LICENSE) para mais informações.

<br/>

---

<div align="center">

Desenvolvido por **João Victor Oliveira Fernandes**

[![GitHub](https://img.shields.io/badge/GitHub-jjoaofernandes-181717?style=for-the-badge&logo=github)](https://github.com/jjoaofernandes)

<br/>

*Porque toda grande história de amor começa com um olá.* 💕

<br/>

⭐ Se curtiu o projeto, deixa uma estrela no repositório!

</div>
