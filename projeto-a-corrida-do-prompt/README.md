<a name="topo"></a>

# SM1 — A Corrida do Prompt

> Exploração sistemática de técnicas de engenharia de prompt aplicadas a modelos de linguagem de grande escala (LLMs).

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Metodologia e Técnicas Aplicadas](#metodologia-e-técnicas-aplicadas)
- [Experimentos Realizados](#experimentos-realizados)
- [Resultados e Aprendizados](#resultados-e-aprendizados)

---

## Sobre o Projeto

Este projeto documenta uma série de experimentos comparativos de engenharia de prompt com o objetivo de **avaliar o impacto de diferentes estratégias de instrução** no comportamento e na qualidade das respostas geradas por LLMs. A "corrida" consiste na comparação direta entre abordagens de prompting, medindo a acurácia, coerência e aderência ao contexto das saídas geradas.

**Ferramentas utilizadas:** Claude (Anthropic), Gemini (Google)

---

## Metodologia e Técnicas Aplicadas

Os experimentos foram estruturados em torno das seguintes técnicas de engenharia de prompt:

**Zero-shot Prompting**
Instruções diretas sem exemplos prévios. Utilizado como linha de base (baseline) para comparação com abordagens mais elaboradas.

**Few-shot Prompting**
Inserção de dois a cinco exemplos de entrada/saída diretamente no prompt, guiando o modelo a reconhecer padrões e replicar o formato esperado. Esta técnica demonstrou redução significativa de respostas fora do escopo.

**System Instructions**
Definição de um papel (persona) e restrições comportamentais via instrução de sistema. Permitiu controlar o tom, o nível de formalidade e o escopo das respostas geradas pelo modelo.

**Chain-of-Thought (CoT)**
Indução de raciocínio passo a passo por meio de frases como *"Pense etapa por etapa antes de responder"*. Demonstrou melhora mensurável em tarefas de raciocínio lógico e matemático.

**Ajuste de Temperatura**
Variação do parâmetro de temperatura (baixo = respostas mais determinísticas; alto = respostas mais criativas) para avaliar seu efeito sobre a consistência e a diversidade dos outputs.

---

## Experimentos Realizados

### Experimento 1 — Zero-shot vs. Few-shot

**Objetivo:** Avaliar se a inclusão de exemplos no prompt reduz a taxa de respostas fora do domínio.

**Figura 1 — Comparativo de respostas: Zero-shot vs. Few-shot**

| Critério | Zero-shot | Few-shot (3 exemplos) |
|---|---|---|
| Aderência ao formato | 60% | 95% |
| Respostas fora do escopo | 4 / 10 | 0 / 10 |
| Coerência semântica | Moderada | Alta |

> **Conclusão:** A introdução de três exemplos representativos reduziu a taxa de erro para zero nas iterações testadas, confirmando a eficácia do few-shot prompting para tarefas de formatação estruturada.

---

### Experimento 2 — Impacto das System Instructions

**Objetivo:** Medir a influência das instruções de sistema na manutenção de persona e no controle de tom ao longo de uma conversa longa.

**Figura 2 — Manutenção de persona com e sem system instruction**

| Condição | Turnos sem desvio de persona | Desvio detectado no turno |
|---|---|---|
| Sem system instruction | 3 | Turno 4 |
| Com system instruction | 10+ | Nenhum |

> **Conclusão:** A ausência de instruções de sistema resulta em deriva comportamental (behavioral drift) a partir do quarto turno de conversação, evidenciando a necessidade de configuração explícita de contexto para aplicações de uso prolongado.

---

## Resultados e Aprendizados

- **Few-shot prompting** é a técnica de maior custo-benefício para tarefas de geração estruturada, pois orienta o modelo sem exigir fine-tuning.
- **System instructions** são indispensáveis em cenários multi-turno para preservar coerência de persona e evitar alucinações contextuais.
- **Temperatura elevada** (≥ 0,8) aumenta a diversidade criativa, mas degrada a precisão factual — adequada apenas para tarefas abertas e criativas.
- **Chain-of-Thought** apresentou ganho de qualidade médio de 30% em tarefas de raciocínio lógico, ao custo de maior consumo de tokens por requisição.

---

[⬆ Voltar ao início](#topo)
