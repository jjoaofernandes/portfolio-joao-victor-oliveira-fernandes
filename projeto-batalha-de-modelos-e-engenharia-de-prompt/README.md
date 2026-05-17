<a name="topo"></a>

# SM3 — Batalha de Modelos & Engenharia de Prompt (XML)

> Análise comparativa rigorosa entre modelos de linguagem de grande escala (LLMs), avaliando desempenho em tarefas padronizadas com foco em latência, consumo de tokens, coerência e aderência a prompts estruturados em XML.

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Metodologia](#metodologia)
- [Estruturação de Prompts com XML](#estruturação-de-prompts-com-xml)
- [Resultados e Aprendizados](#resultados-e-aprendizados)

---

## Sobre o Projeto

Este projeto consiste em um **benchmark qualitativo e quantitativo** entre diferentes modelos de IA generativa, submetidos a um conjunto de tarefas padronizadas. O diferencial metodológico reside na utilização de **prompts estruturados em XML**, que impõem ao modelo uma interface de entrada e saída explícita e verificável.

**Modelos avaliados:**
- Claude 3 Sonnet (Anthropic)
- Gemini 1.5 Pro (Google DeepMind)
- GPT-4o (OpenAI)

**Tipos de tarefas testadas:**
- Raciocínio lógico e matemático
- Sumarização de textos longos
- Geração de código funcional
- Seguimento de instruções estruturadas (instruction following)

---

## Metodologia

Cada modelo foi submetido ao **mesmo conjunto de prompts**, variando apenas os parâmetros de configuração (temperatura, max_tokens). As respostas foram avaliadas segundo quatro dimensões:

**Coerência:** alinhamento semântico da resposta com a instrução dada.
**Aderência ao formato:** conformidade com a estrutura XML especificada no prompt.
**Latência:** tempo de resposta médio por requisição, em segundos.
**Consumo de tokens:** total de tokens utilizados (input + output) por tarefa.

---

## Estruturação de Prompts com XML

A estruturação em XML impõe delimitadores explícitos às seções do prompt, reduzindo a ambiguidade e facilitando o parsing programático das respostas. Exemplo de estrutura utilizada:

```xml
<prompt>
  <context>Você é um assistente especializado em análise de dados.</context>
  <task>Analise o dataset abaixo e identifique os três principais outliers.</task>
  <data>{{ dataset }}</data>
  <output_format>
    <field name="outliers" type="list" />
    <field name="justificativa" type="text" />
  </output_format>
</prompt>
```

**Vantagens observadas:**
- Redução de alucinações contextuais causadas por ambiguidade na instrução
- Padronização do formato de saída, facilitando automação do pós-processamento
- Maior controlabilidade sobre a estrutura da resposta gerada

---

## Resultados e Aprendizados

### Figura 1 — Tabela Comparativa de Desempenho entre Modelos

| Critério | Claude 3 Sonnet | Gemini 1.5 Pro | GPT-4o |
|---|---|---|---|
| **Coerência semântica** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Aderência ao formato XML** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Latência média (s)** | ~2,1 s | ~1,8 s | ~3,4 s |
| **Consumo médio de tokens** | ~850 | ~920 | ~780 |
| **Raciocínio lógico** | Alto | Moderado | Alto |
| **Geração de código** | Alto | Alto | Alto |
| **Instruction following** | Muito alto | Moderado | Alto |

### Figura 2 — Comparativo visual de latência por tarefa

> *(Inserir gráfico de barras com o tempo de resposta de cada modelo por tipo de tarefa: raciocínio, sumarização, código, instruction following)*

### Principais Achados

**Claude 3 Sonnet** apresentou o melhor desempenho absoluto em *instruction following* com prompts XML, demonstrando alta fidelidade ao formato de saída especificado em 9 de 10 tarefas testadas.

**Gemini 1.5 Pro** destacou-se pela menor latência média, tornando-o mais adequado para aplicações com restrições de tempo real (real-time). Contudo, apresentou maior variabilidade na aderência ao formato XML em tarefas complexas.

**GPT-4o** equilibrou bem coerência e eficiência de tokens, com leve desvantagem em latência. Demonstrou robustez especialmente em tarefas de geração de código.

**Consumo de tokens:** A estruturação em XML aumenta o consumo de tokens de entrada em média 15-20% em relação a prompts em linguagem natural pura, sendo um custo justificado pela melhora na consistência das saídas.

### Aprendizados

- **Prompts XML** são especialmente eficazes em pipelines de automação onde o pós-processamento da resposta precisa ser programático e confiável.
- A **temperatura** deve ser mantida abaixo de 0,3 para tarefas de instruction following, pois valores mais altos aumentam a variabilidade e reduzem a aderência ao formato especificado.
- Nenhum modelo é universalmente superior: a escolha ideal depende do trade-off entre latência, custo por token e complexidade da tarefa.

---

[⬆ Voltar ao início](#topo)
