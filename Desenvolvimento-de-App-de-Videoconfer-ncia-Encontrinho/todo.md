# SpeedDate - TODO

## Setup & Configuração
- [x] Gerar logo do app e configurar branding
- [x] Configurar paleta de cores (rosa/roxo) no theme.config.js
- [x] Configurar navegação com Stack + Tabs

## Telas de Onboarding
- [x] Tela de Onboarding com 3 slides
- [x] Tela de Setup de Perfil (nome, idade, gênero, bio, foto)
- [x] Persistência do perfil com AsyncStorage

## Home / Lobby
- [x] Tela Home com card de evento e contagem regressiva
- [x] Lista de matches recentes
- [x] Histórico de encontros

## Sistema de Speed Dating
- [x] Contexto global de estado do evento (SpeedDatingContext)
- [x] Sala de Espera (Waiting Room) com animação
- [x] Lógica de pareamento simulado (mock matchmaking)
- [x] Timer regressivo durante videochamada

## Integração Jitsi Meet
- [x] Instalar react-native-webview
- [x] Tela de Videochamada com WebView Jitsi Meet
- [x] Overlay de timer e botões de ação sobre a WebView
- [x] Geração de sala única por encontro (roomName)

## Pós-Encontro
- [x] Modal de avaliação (Like / Skip)
- [x] Lógica de match mútuo
- [x] Tela de Resultados com lista de matches

## Matches & Chat
- [x] Tela de Matches com lista de matches mútuos
- [x] Chat simples entre matches (AsyncStorage local)

## Perfil
- [x] Tela de Perfil com edição de dados
- [x] Upload de foto com ImagePicker
- [x] Botão de resetar dados

## Polimento
- [x] Animações de transição
- [x] Haptic feedback nos botões principais
- [x] Modo escuro/claro
- [x] Ícones da tab bar


## Mudanças Solicitadas
- [x] Renomear app para "Encontrinho"
- [x] Alterar paleta de cores para tons avermelhados/picantes
- [x] Gerar novo logo com cereja em vez de câmera
- [x] Atualizar app.config.ts com novo nome e logo
- [x] Atualizar theme.config.js com cores vermelhas
- [x] Atualizar todos os botões para usar cores vermelhas
- [x] Regenerar logo com cereja branca em vez de vermelha
- [x] Regenerar logo vector com fundo vermelho e cereja branca
- [x] Gerar logo com cereja saliente, picante e glossy
- [x] Gerar logo com cereja vermelha glossy e 3D


## Recursos Avançados do Jitsi Meet
- [x] Adicionar controle de câmera (frontal/traseira)
- [x] Adicionar controle de microfone com indicador de volume
- [x] Adicionar chat de texto durante a chamada
- [x] Adicionar compartilhamento de tela
- [x] Adicionar gravação de chamada (opcional)
- [x] Adicionar detecção de participantes (quando entra/sai)
- [x] Adicionar layout de tela inteira e modo picture-in-picture
- [x] Adicionar controle de qualidade de vídeo (HD/SD)
- [x] Adicionar efeitos de fundo virtual
- [x] Adicionar indicador de conexão/latência


## Sistema de Encontros Online em Tempo Real
- [x] Criar tabelas de banco de dados (users, events, matches, call_sessions)
- [x] Implementar autenticação OAuth com Manus
- [x] Criar API tRPC para gerenciar eventos
- [ ] Implementar WebSocket para sincronização em tempo real
- [x] Criar sistema de fila de espera (queue) com pareamento automático
- [x] Implementar geração dinâmica de salas Jitsi Meet
- [ ] Criar sistema de notificações push para eventos
- [x] Implementar histórico de encontros e matches no banco de dados
- [ ] Criar dashboard de administrador para gerenciar eventos
- [x] Implementar sistema de ratings e reviews entre usuários
- [x] Atualizar integração Jitsi para usar https://meet.jitsi.si em vez de 8x8.vc
- [x] Corrigir erro WebView no web - adicionar fallback para abrir Jitsi em nova aba
- [ ] Melhorar UI do fallback web - redesenhar botões com padrão Encontrinho
