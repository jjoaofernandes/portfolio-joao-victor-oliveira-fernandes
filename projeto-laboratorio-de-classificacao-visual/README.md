<a name="topo"></a>

# SM2 — Laboratório de Classificação Visual

> Treinamento, validação e análise de um modelo de classificação de imagens utilizando Teachable Machine (Google), com avaliação de métricas de desempenho e interpretação dos resultados de inferência.

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Pipeline de Desenvolvimento](#pipeline-de-desenvolvimento)
- [Configuração do Modelo e Hiperparâmetros](#configuração-do-modelo-e-hiperparâmetros)
- [Resultados e Métricas de Avaliação](#resultados-e-métricas-de-avaliação)
- [Análise e Aprendizados](#análise-e-aprendizados)

---

## Sobre o Projeto

Este projeto documenta o ciclo completo de desenvolvimento de um classificador de imagens, da coleta de dados à fase de inferência. A plataforma **Teachable Machine** foi utilizada como ambiente de treinamento, permitindo a construção de um modelo de aprendizado de máquina baseado em transfer learning sobre a arquitetura MobileNet, sem necessidade de escrita de código de baixo nível.

**Objetivo:** Classificar visualmente amostras de imagens em categorias predefinidas com alta precisão e baixa taxa de falsos positivos.

**Ferramenta principal:** [Teachable Machine — Google](https://teachablemachine.withgoogle.com/)

---

## Pipeline de Desenvolvimento

O desenvolvimento seguiu as etapas padrão de um projeto de visão computacional supervisionado:

**1. Coleta e Curadoria de Dados**
Seleção manual de amostras por classe, garantindo equilíbrio entre as categorias para evitar viés de classe (class imbalance). As imagens foram capturadas em condições variadas de iluminação para aumentar a robustez do modelo.

**2. Pré-processamento**
As imagens foram redimensionadas automaticamente para o padrão de entrada da rede (224×224 px). Nenhuma augmentação manual foi aplicada; o Teachable Machine realiza data augmentation internamente.

**3. Treinamento**
O modelo passou pela fase de treinamento com os hiperparâmetros detalhados na seção seguinte, utilizando o dataset curado na etapa anterior.

**4. Validação e Avaliação**
Avaliação de desempenho sobre o conjunto de validação (hold-out) com análise de métricas de classificação.

**5. Fase de Inferência**
Testes de classificação em tempo real com amostras inéditas, observando confiança (confidence score) e comportamento do modelo fora do domínio de treinamento.

---

## Configuração do Modelo e Hiperparâmetros

| Hiperparâmetro | Valor Utilizado | Justificativa |
|---|---|---|
| Épocas (Epochs) | 50 | Suficiente para convergência sem overfitting no tamanho de dataset utilizado |
| Tamanho do Batch (Batch Size) | 16 | Equilíbrio entre velocidade de treinamento e estabilidade do gradiente |
| Taxa de Aprendizado (Learning Rate) | 0,001 | Valor padrão recomendado para fine-tuning em transfer learning com MobileNet |
| Arquitetura base | MobileNet (transfer learning) | Modelo leve e eficiente para classificação de imagens em dispositivos com recursos limitados |

> A escolha da taxa de aprendizado de 0,001 é justificada pelo fato de o modelo base (MobileNet) já estar pré-treinado no dataset ImageNet. Uma taxa mais alta poderia destruir os pesos pré-aprendidos (fenômeno conhecido como *catastrophic forgetting*).

---

## Resultados e Métricas de Avaliação

### Figura 1 — Amostras classificadas pelo modelo (fase de inferência)

> *(Inserir capturas de tela das classificações realizadas durante os testes, identificadas como Figura 1-A, 1-B, etc.)*

### Figura 2 — Matriz de Confusão

> *(Inserir imagem da matriz de confusão gerada a partir do conjunto de validação)*

A matriz de confusão evidencia:
- **Verdadeiros Positivos (VP):** classificações corretas para cada classe
- **Falsos Positivos (FP):** amostras de outra classe incorretamente atribuídas à classe analisada
- **Falsos Negativos (FN):** amostras da classe analisada não reconhecidas pelo modelo

### Tabela de Métricas por Classe

| Classe | Precisão | Recall | F1-Score |
|---|---|---|---|
| Classe A | — | — | — |
| Classe B | — | — | — |
| Classe C | — | — | — |
| **Média ponderada** | — | — | — |

> *Preencher com os valores obtidos no Teachable Machine ou em script de avaliação externo.*

**F1-Score** é a métrica principal adotada por ser a média harmônica entre precisão e recall, penalizando modelos com desempenho desbalanceado entre as duas medidas — especialmente relevante em datasets com leve desbalanceamento de classes.

---

## Análise e Aprendizados

- A escolha de **transfer learning** sobre MobileNet reduziu drasticamente o tempo de treinamento em comparação com o treinamento from scratch, mantendo alta acurácia mesmo com dataset reduzido.
- O **balanceamento de classes** na fase de coleta de dados foi determinante para evitar que o modelo desenvolvesse viés em direção à classe majoritária.
- Amostras capturadas em condições de iluminação extrema (muito clara ou muito escura) impactaram negativamente o confidence score durante a fase de inferência, evidenciando a necessidade de **data augmentation** mais agressivo em versões futuras.
- A análise da **matriz de confusão** revelou que as confusões mais frequentes ocorreram entre classes visualmente similares, sugerindo a necessidade de features discriminativas adicionais ou de um dataset maior para melhorar a fronteira de decisão.

---

[⬆ Voltar ao início](#topo)
