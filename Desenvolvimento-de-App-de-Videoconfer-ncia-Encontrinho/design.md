# SpeedDate — Design Document

## Conceito
Aplicativo de videoconferência para Speed Dating (Encontros Rápidos) com integração Jitsi Meet. Usuários entram em eventos, são pareados automaticamente para conversas de vídeo cronometradas, e ao final votam em quem desejam continuar conhecendo.

---

## Paleta de Cores

| Token       | Light       | Dark        | Uso                          |
|-------------|-------------|-------------|------------------------------|
| primary     | #E91E8C     | #F06292     | Ações principais, destaque   |
| secondary   | #9C27B0     | #CE93D8     | Gradiente, acentos           |
| background  | #FFFFFF     | #0D0D0D     | Fundo de tela                |
| surface     | #FFF0F7     | #1A1A2E     | Cards, modais                |
| foreground  | #1A1A1A     | #F5F5F5     | Texto principal              |
| muted       | #757575     | #9E9E9E     | Texto secundário             |
| border      | #F8BBD0     | #3D1A3D     | Bordas                       |
| success     | #4CAF50     | #81C784     | Match confirmado             |
| warning     | #FF9800     | #FFB74D     | Timer quase acabando         |
| error       | #F44336     | #E57373     | Erros, rejeição              |
| timer       | #FF5722     | #FF8A65     | Contador regressivo          |

---

## Telas do App

### 1. Splash / Onboarding (3 slides)
- Slide 1: "Encontros em 3 minutos" — ilustração de videochamada
- Slide 2: "Seja você mesmo" — perfil com foto
- Slide 3: "Descubra conexões reais" — CTA para começar
- Botões: Pular / Próximo / Começar

### 2. Tela de Perfil (Setup)
- Campo: Nome de exibição
- Campo: Idade
- Campo: Gênero (Homem / Mulher / Não-binário / Outro)
- Campo: Interesses em (Homens / Mulheres / Todos)
- Campo: Bio curta (máx. 150 chars)
- Upload de foto de perfil (ImagePicker)
- Botão: Salvar e Continuar

### 3. Home — Lobby
- Header: Avatar + nome do usuário
- Card de destaque: "Próximo Evento" com horário e contagem regressiva
- Botão grande: "Entrar no Evento" (ativo quando evento disponível)
- Seção: Meus Matches (lista horizontal de avatares)
- Seção: Histórico de Encontros (lista de cards)
- Tab bar: Home | Matches | Perfil

### 4. Sala de Espera (Waiting Room)
- Animação de pulso/loading
- Texto: "Aguardando parceiro..."
- Contador de participantes online
- Botão: Cancelar
- Quando pareado: transição automática para videochamada

### 5. Videochamada (Jitsi Meet WebView)
- WebView fullscreen com Jitsi Meet
- Overlay superior: Timer regressivo (ex: 3:00 → 0:00)
- Overlay inferior: Botões de Like ❤️ / Skip ⏭️
- Quando timer zera: modal de avaliação

### 6. Modal de Avaliação Pós-Encontro
- Pergunta: "Quer continuar conhecendo [Nome]?"
- Botões: Sim ❤️ / Não ✗
- Transição para próximo parceiro ou fim do evento

### 7. Tela de Resultados / Matches
- Lista de matches mútuos com foto e nome
- Botão: "Iniciar Chat" (abre chat simples)
- Botão: "Ver Perfil"

### 8. Chat Simples (pós-match)
- Mensagens de texto básicas
- Header com foto e nome do match
- Input de mensagem

### 9. Tela de Perfil (Edição)
- Mesmos campos do setup
- Botão de logout

---

## Fluxos Principais

### Fluxo de Onboarding
Splash → Onboarding (3 slides) → Setup de Perfil → Home

### Fluxo de Speed Dating
Home → [Entrar no Evento] → Sala de Espera → Videochamada (Jitsi) → Modal de Avaliação → [próximo parceiro] → Resultados

### Fluxo de Match
Videochamada → Modal "Sim" → [outro usuário também votou Sim] → Notificação de Match → Tela de Matches → Chat

---

## Componentes Reutilizáveis

- `AvatarCard` — foto circular com nome e indicador online
- `TimerBadge` — contador regressivo com cor dinâmica
- `MatchCard` — card de match com foto, nome e botões
- `EventCard` — card de evento com horário e status
- `GradientButton` — botão com gradiente rosa/roxo
- `HeartButton` / `SkipButton` — botões de ação na videochamada

---

## Navegação

```
Stack Root
├── (onboarding)/         ← slides iniciais
│   └── index.tsx
├── (setup)/              ← configuração de perfil
│   └── profile.tsx
└── (tabs)/               ← app principal
    ├── _layout.tsx       ← Tab bar: Home | Matches | Perfil
    ├── index.tsx         ← Home / Lobby
    ├── matches.tsx       ← Matches e Chat
    └── profile.tsx       ← Perfil do usuário
Stack Modals
├── waiting-room.tsx      ← Sala de espera
├── video-call.tsx        ← Videochamada Jitsi
└── post-call.tsx         ← Modal de avaliação
```
