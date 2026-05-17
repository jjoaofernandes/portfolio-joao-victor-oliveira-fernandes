# 📚 Sistema de Gestão de Estudo

> Aplicação web no-code desenvolvida em **Bubble** para gerenciamento completo de rotinas de estudo, com suporte a revisões espaçadas, metas e sessões de estudo.

---

## 🎯 Sobre o Projeto

O **Sistema de Gestão de Estudo** é uma plataforma voltada para estudantes que desejam organizar e acompanhar sua jornada de aprendizado de forma estruturada. O sistema oferece controle de sessões de estudo, metas por matéria, revisões espaçadas (Spaced Repetition) e métricas de desempenho.

---

## ✨ Funcionalidades

- **👤 Cadastro de Usuários** — Perfis com nível de formação (Graduação, Pós, Concurso Público, etc.)
- **📚 Gerenciamento de Matérias** — Cadastro de disciplinas com carga horária, dificuldade e área do conhecimento
- **📝 Registro de Sessões de Estudo** — Controle de horário, método de estudo (Pomodoro, Flashcard, Leitura Ativa...), produtividade e tópico estudado
- **🎯 Metas de Estudo** — Definição de metas semanais, mensais ou totais por matéria, com acompanhamento automático de percentual atingido
- **📊 Revisões Espaçadas** — Sistema baseado no método *Spaced Repetition*, com intervalos automáticos de revisão (1, 3, 7, 14, 30 dias...) e nota de retenção

---

## 🗄️ Estrutura do Banco de Dados

| Tabela | Descrição |
|---|---|
| `Usuários` | Cadastro dos estudantes |
| `Matérias` | Disciplinas e áreas de conhecimento |
| `Sessões de Estudo` | Registro de cada sessão realizada |
| `Metas` | Metas de estudo por período e matéria |
| `Revisões` | Controle de revisões espaçadas |
| `Option Sets` | Conjuntos de status e opções do sistema |

### Regras de Negócio

- ✅ Sessão de Estudo sempre vinculada a um Usuário e uma Matéria
- ✅ Meta vinculada a Usuário + Matéria (nunca lista de sessões dentro da Meta)
- ✅ Revisão vinculada à Sessão de Estudo via chave estrangeira (`ID_Sessao`)
- ✅ Status sempre via Option Sets — nunca texto livre nas condições
- 🔒 Nenhum token, chave de API ou dado sensível nos Option Sets

---

## 🛠️ Tecnologias Utilizadas

- **[Bubble](https://bubble.io)** — Plataforma no-code para desenvolvimento visual
- **Data API do Bubble** — Exposição dos dados via REST para integrações e backup
- **Spaced Repetition Algorithm** — Lógica de revisão com intervalos progressivos

---

## 🔒 Segurança e Privacidade

As regras de privacidade foram configuradas diretamente no Bubble:

- **StudySession**: acesso restrito ao próprio criador (`Creator is Current User`)
- **Subject / User**: regras de privacidade aplicadas por tipo de dado
- Dados sensíveis nunca armazenados em Option Sets

---

## ⚠️ Vendor Lock-in e Estratégia de Saída

O projeto foi desenvolvido sobre a plataforma Bubble, o que implica dependência do motor de execução da plataforma (o código-fonte gerado não é exportável). As seguintes medidas foram adotadas para mitigar esse risco:

### Portabilidade de Dados
- **Data API habilitada** para exportação via `GET` em formato JSON (compatível com PostgreSQL, MySQL, MongoDB)
- **Exportação manual via CSV** pelo painel *App Data* como backup offline

### Documentação da Lógica de Negócio
As regras de negócio (cálculo de revisões espaçadas, métricas de metas) estão documentadas de forma independente da plataforma para facilitar futura migração.

### Plano de Migração (se necessário)
```
1. Backend → Node.js (replicando a estrutura de tabelas atual)
2. Banco de Dados → Migração via Data API do Bubble
3. Frontend → React consumindo a nova API
4. Desligamento → Após validação da integridade dos dados
```

---

## 📁 Estrutura dos Documentos do Projeto

```
📦 projeto
 ┣ 📄 gestao_estudo_banco_dados.pdf    # Estrutura completa do banco de dados
 ┣ 📄 Estratégia_de_Saída_Vendor.pdf   # Estratégia de saída e mitigação de lock-in
 ┣ 📄 passo_5.pdf                      # Configuração de privacidade no Bubble
 ┗ 📄 passo_7.pdf                      # Workflows configurados na plataforma
```

---

## 🚀 Como Acessar

> O sistema está hospedado na plataforma Bubble. Para acessar, entre no link: https://mgj240819.bubbleapps.io/version-test?debug_mode=true.


---

## 👤 Autor

Desenvolvido como projeto de sistema de gestão de estudos pessoal/acadêmico.

---

> *"A revisão espaçada não é sobre estudar mais — é sobre estudar na hora certa."*
