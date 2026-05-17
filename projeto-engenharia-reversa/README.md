# 🦆 QuackCode — Personalização de QR Code

O **QuackCode** é um gerador de QR Codes moderno, focado em alta customização e design imersivo. Este projeto nasceu de um desafio de engenharia reversa do site *qr-code-styling.com* e evoluiu para uma aplicação Full Stack completa, com sistema de usuários, banco de dados e telemetria.

---

## 🚀 Evolução do Projeto
Diferente de um simples clone, o QuackCode passou por um processo de "desclonagem" e refinamento técnico:
1.  **Engenharia Reversa:** Reconstrução da UI original utilizando prompts de IA para entender a estrutura de componentes.
2.  **Identidade Visual:** Implementação de um design autoral com Tema Dark, gradientes modernos e foco em UX.
3.  **Infraestrutura:** Integração total com o ecossistema Firebase para transformar o front-end em um produto funcional.

## ✨ Funcionalidades
- **Customização em tempo real:** Altere cores, estilos de pontos (dots) e formatos dos cantos.
- **Branding:** Upload de logos personalizados para o centro do QR Code.
- **Persistência:** Usuários autenticados podem salvar seus designs para edição posterior.
- **Formatos de exportação:** Download em alta resolução nos formatos PNG e SVG.
- **Configuração Remota:** Ajustes de interface via Remote Config sem necessidade de novo deploy.

## 🛠️ Tecnologias Utilizadas
- **Core:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand)
- **Backend-as-a-Service (Firebase):**
  - **Authentication:** Login social e e-mail.
  - **Cloud Firestore:** Banco de dados NoSQL para salvar configurações.
  - **Cloud Storage:** Armazenamento de logos dos usuários.
  - **Hosting:** Deploy de alta performance.
  - **Analytics & Remote Config:** Monitoramento e testes de interface.
- **Engine de QR:** [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)

## 📔 Diário de Bordo (Resumo)
Este repositório faz parte de um exercício acadêmico. O principal aprendizado foi a transição do desenvolvimento assistido por IA para a implementação de uma arquitetura escalável. A utilização do Firebase permitiu focar na lógica de negócio e na experiência do usuário, delegando a complexidade da infraestrutura para uma solução de mercado sólida.

---

## 🔧 Como rodar o projeto
1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/quackcode.git](https://github.com/seu-usuario/quackcode.git)
