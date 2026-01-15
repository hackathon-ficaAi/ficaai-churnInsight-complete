<h1 align="center">
  ChurnInsight — Previsão de churn no setor bancário
</h1>

<div align="center">

![Python](https://img.shields.io/badge/python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.125.0-009688)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Static Badge](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![ML](https://img.shields.io/badge/machine%20learning-scikit--learn-orange)
![Java](https://img.shields.io/badge/java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen)
![H2 Database](https://img.shields.io/badge/H2-Database-blue)
![Swagger](https://img.shields.io/badge/OpenAPI-Swagger-lightgrey)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF)
![Node.js](https://img.shields.io/badge/Node.js-20%20(Alpine%20Linux)-green)
![ESLint](https://img.shields.io/badge/ESLint-9.39.1-purple)




</div>

## 📑 Índice

- [Introdução](#introdução)
- [Objetivo](#objetivo)
- [Arquitetura da Solução](#arquitetura-da-solução)
- [Setup](#setup)
- [Testes](#testes)
- [Notebook Completo](#notebook-completo)
- [Funcionalidades do MVP](#funcionalidades-do-mvp)
- [Dependências e Versões das Ferramentas](#dependências-e-versões-das-ferramentas)
- [Licença](#licença)
- [Contribuição](#contribuição)


## Introdução

Bancos digitais e fintechs trabalham com clientes que mantêm contas, cartões e serviços recorrentes. Sabe-se que é muito mais caro captar um novo cliente do que manter um já existente. Por isso, é vantajoso para os bancos saber o que leva um cliente à decisão de deixar a empresa.


## Objetivo

Desenvolver um MVP capaz de prever clientes em risco de churn (cancelamento) com base em variáveis demográficas (idade, país, gênero), financeiras (saldo, salário estimado) e comportamentais (número de produtos contratados, status de membro ativo).

O resultado da previsão é segmentado por grau de risco:

🔴 Alto risco – Cliente com alta probabilidade de evasão (>=80)

🟡 Médio risco – comportamento instável ou sinais iniciais de churn (>=60)

🟢 Baixo risco – tendência a permanecer fiel ao banco (0 a 59.99)

Essa segmentação permite que bancos digitais adotem ações de retenção proativas antes da perda efetiva.

## Arquitetura da Solução

Visualização dos componentes do MVP e do fluxo de dados. [Diagrama de Sequência de Orquestração Backend + IA](https://drive.google.com/file/d/1HrjwrgZYAO3soYxHoJ6O7AoB_7uhhNTh/view?usp=drive_link)

### Como Funciona:
1. Entrada de dados  
O cliente envia informações (idade, país, gênero, saldo, número de produtos, membro ativo, salário estimado) via requisição JSON para a API em Java (Spring Boot).

2. Processamento  
O back-end valida os dados e os encaminha para o modelo de Machine Learning (LightGBM), exposto em um microserviço Python (FastAPI).

3. Saída de resultados  
O modelo retorna a previsão de churn e a probabilidade associada. O back-end organiza essa resposta e disponibiliza via API. Os resultados podem ser armazenados no banco H2 e visualizados em um dashboard.

## Setup

### Como executar o projeto localmente
### Pré-requisitos 
- **Docker** e **Docker Compose** instalados

### Passo a Passo

1. Build do back-end (Spring Boot)
   Abra o terminal **na pasta do back-end** e rode:
   ```bash
   ./mvnw clean package
   ```
   Se ocorrer erro relacionado a testes, rode:
   ```bash
   ./mvnw clean package -DskipTests
   ```
   
2.  Na raiz do projeto execute:

```bash
docker-compose up --build
```
### URLs úteis


1. Aplicação Web (Frontend) --> Visualize a aplicação FrontEnd.
```text
http://localhost:5173/frontend 
```
2. Documentação BackEnd (Swagger) --> Teste os endpoints visualmente.
```text
http://localhost:8080/swagger-ui
```
3. Banco de Dados (H2) --> Acesse o banco em memória.
```text
http://localhost:8080/h2-console
```
3.1 Credenciais do banco H2

Driver Class: 
```text
org.h2.Driver
```
JDBC URL:
```text
jdbc:h2:mem:ficaaidb
```
User Name: 
```text
sa
```
Password: 
```text
password
```

4. Documentação Python (Swagger) --> Teste os endpoints visualmente.
```text  
http://localhost:8000/docs
```
```text
http://localhost:8000/redoc
```


### Exemplo de requisição via POST e resposta (JSON)

Endpoint:
```text
POST /predict
```

```json
{
  "pais": "frança",
  "genero": "feminino",
  "idade": 40,
  "saldo": 60000.00,
  "salario_estimado": 50000.00,
  "num_produtos": 2,
  "membro_ativo": true
}
```

Saída

```json
{
  "probabilidade_churn": 0.40,
  "previsao_churn": "Baixo Grau de Cancelamento"
}

```

## Testes

### Exemplos de uso (3 requisições de testes)

#### 1. Cliente fiel (baixo risco de cancelamento)

  ```json
    {
      "pais": "frança",
      "genero": "feminino",
      "idade": 23,
      "saldo": 0.00,
      "salario_estimado": 160976.75,
      "num_produtos": 2,
      "membro_ativo": 1 (TRUE) 
    }
  ```

#### 2. Cliente com médio risco de cancelamento

```json
  {
    "pais": "frança",
    "genero": "masculino",
    "idade": 36,
    "saldo": 0.00,
    "salario_estimado": 113931.57,
    "num_produtos": 1,
    "membro_ativo": 0 (FALSE)
  }
```
#### 3. Cliente com alto risco de cancelamento
```json
  {
    "pais": "frança",
    "genero": "feminino",
    "idade": 46,
    "saldo": 0.00,
    "salario_estimado": 72549.27,
    "num_produtos": 1,
    "membro_ativo": 0 (FALSE)
  }
```

## Notebook Completo 
[Projeto Final ChurnBank](https://colab.research.google.com/drive/1MQzkmvdJQVgpMZ85ETcQvxSZM8JtCFYY)

### Modelo e Resultados

Durante o desenvolvimento, diferentes algoritmos de classificação foram testados (AdaBoost, Random Forest, XGBoost, Logistic Regression e LightGBM). 

O modelo **LightGBM** foi escolhido como final por apresentar melhor equilíbrio entre **Recall** e **Precisão**, além de maior consistência entre treino e teste.

### Métricas principais do LightGBM
- **Acurácia (teste):** 0.81  
- **ROC-AUC:** 0.89
- **Recall:** 0.78 (capacidade de identificar clientes em risco)  
- **Precisão:** 0.55  
- **F1-score:** 0.65  
- **PR-AUC:** 0.73

Esses resultados mostram que o modelo consegue identificar a maioria dos clientes propensos ao cancelamento, permitindo que o banco aja de forma preventiva.

- 🧠 **Modelo LightGBM (modelo escolhido por apresentar melhor equilíbrio entre Recall e Precisão)**
[model_pipeline.joblib](https://drive.google.com/file/d/1A_vB2-Mpx6iKJLr8NEIMxlTMIAhxfRu-/view?usp=sharing)

## Nota de Corte

Definimos três faixas de risco com base na probabilidade prevista de churn pelo modelo:

- **Alto risco**: probabilidade ≥ 80%

- **Médio risco**: probabilidade ≥ 60% e < 80%

- **Baixo risco**: probabilidade < 60%

### Justificativa estratégica

Optamos por esses limites considerando o trade-off entre recall e precisão do modelo (recall alto — 0.78 — e precisão moderada — 0.55). Priorizar um recall elevado significa identificar a maior parte dos clientes que realmente irão cancelar (minimizando falsos negativos), mesmo que isso gere um número maior de falsos positivos. Essa abordagem é apropriada quando o custo de deixar um cliente churnar (perda de receita e impacto de longo prazo) é superior ao custo de executar ações preventivas sobre alguns clientes que, no final, não teriam cancelado.

### Impacto operacional esperado

- Alto risco (≥80%): receberá as ações mais intensivas (por exemplo, contato proativo por equipe especializada, ofertas personalizadas de retenção). Esse grupo tende a apresentar maior ROI por ação, dada a alta probabilidade de churn.

- Médio risco (60–79%): receberá ações moderadas e escaláveis (por exemplo, campanhas segmentadas, ofertas digitais ou ligação automatizada). Aqui o objetivo é converter clientes que ainda são “recuperáveis” com esforços menos custosos.

- Baixo risco (<60%): monitoramento e ações de baixo custo (mensagens de engagement, conteúdo educativo). Evitamos investimentos pesados nesta faixa para não diluir recursos.

### Observação final

A estratégia de corte atual é orientada a maximizar a retenção dado o perfil de desempenho do modelo (alto recall, precisão moderada). Entretanto, a configuração ótima depende de variáveis de negócio (custo da ação, valor do cliente, capacidade operacional) — por isso recomendamos revisitar os thresholds com dados reais de intervenção e incorporar uma camada de otimização baseada em custo/benefício.

O Dashboard que será apresentado abaixo poderá auxiliar nisso, uma vez que possui uma ferramenta de Limiar de Risco, permitindo a empresa fazer o próprio balanceamento em relação a retenção de clientes e custo de ação.


## Funcionalidades do MVP

**1.Endpoints:** ✅ implementado
  - `api/predict`
  - `api/historico`
    
**2.Carregamento de modelo preditivo:** ✅ implementado

**3.Validação de entrada:** ✅ implementado

**4.Resposta estruturada:** ✅ implementado

**5.Persistência de previsões:**  ✅ implementado

**6.Containerização:** ✅ implementado

**7.Dashboard (Streamlit):** ✅ implementado

- Acesse o Dashboard👉 [Dashboard](https://ficaai.streamlit.app/)

**8.Projeto em nuvem OCI - Oracle Cloud Infrastructure:**  ✅ implementado

- Acesse a aplicação  👉 [Previsão de Churn Bancário](http://137.131.255.43:5173/frontend/)

## Dependências e Versões das Ferramentas

### Back-End
- **Java:** 21 (Eclipse Temurin)
- **Framework:** Spring Boot 3.3.5
- **Banco de Dados:** H2 (em memória)
- **Persistência:** Spring Data JPA (Hibernate)
- **Documentação:** SpringDoc OpenAPI (Swagger)
- **Containerização:** Docker & Docker Compose (v1.29)
- **Utilitário:** Lombok (Redução de código boilerplate)

### Front-End
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Runtime (Docker):** Node.js 20 (Alphine Linux)
- **Linting:** ESLint 9.39.1

### Data Science / Python
- **Python:** 3.11.14

#### Bibliotecas principais (para análise e modelagem)
- pandas (>=2.0)
- numpy (>=1.25)
- scikit-learn (>=1.8)
- matplotlib (>=3.7)
- seaborn (>=0.12)
- joblib (>=1.5) *(serialização de modelos)*
- jupyter / google-colab *(para notebooks)*

#### Bibliotecas adicionais (para API e modelos avançados)
- fastapi==0.125.0
- uvicorn==0.38.0
- feature-engine==1.9.3 *(engenharia de features)*
- xgboost==3.1.2 *(modelo gradient boosting)*
- lightgbm==4.6.0 *(modelo gradient boosting)*
- streamlit (>=1.52) *(dashboard e visualização de risco)*
  
#### Gerenciamento de Experimentos e Modelos 
- mlflow (>=3.8.1) *(para rastreamento de experimentos, versionamento e deploy de modelos)*

## Licença

Este projeto está licenciado sob os termos da licença MIT.  
Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## Contribuição

Contribuições são bem-vindas! Para colaborar:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b minha-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona minha feature'`).
4. Faça push para a branch (`git push origin minha-feature`).
5. Abra um Pull Request.
