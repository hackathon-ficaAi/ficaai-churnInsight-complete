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

Desenvolver um MVP capaz de prever clientes em risco de churn a partir de variáveis demográficas (idade, país, gênero), financeiras (saldo, salário estimado) e comportamentais (número de produtos, membro ativo). Essa combinação permite que bancos digitais identifiquem antecipadamente clientes propensos ao cancelamento e adotem ações de retenção antes da perda.


## Arquitetura da Solução

Visualização dos componentes do sistema e do fluxo de dados. [Diagrama de Sequência de Orquestração Backend + IA](https://drive.google.com/file/d/129lMFAp8Qr_Df3LdVijGTWCgLPpsWXqs/view?usp=drive_link)

### Como Funciona:
1. Entrada de dados  
O cliente envia informações (idade, país, gênero, saldo, número de produtos, membro ativo, salário estimado) via requisição JSON para a API em Java (Spring Boot).

2. Processamento  
O back-end valida os dados e os encaminha para o modelo de Machine Learning (LightGBM), exposto em um microserviço Python (FastAPI).

3. Saída de resultados  
O modelo retorna a previsão de churn e a probabilidade associada. O back-end organiza essa resposta e disponibiliza via API. Os resultados podem ser armazenados no banco H2 e visualizados em um dashboard.

## Setup

### Como executar o Projeto
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
  "pais": "França",
  "genero": "Feminino",
  "idade": 40,
  "saldo": 60000.0,
  "num_produtos": 2,
  "membro_ativo": true,
  "salario_estimado": 50000.0
}
```

Saída

```json
{
  "probabilidade_churn": 0.40,
  "previsao_churn": "Chance baixa de cancelamento"
}

```

## Testes

### Exemplos de uso (3 requisições de testes)
1. Cliente com alto grau de cancelamento
```json
  {
    "pais": "frança",
    "genero": "feminino",
    "idade": 46.0,
    "num_produtos": 1,
    "membro_ativo": 0.0,
    "saldo": 0.0,
    "salario_estimado": 72549.27
  }
```

2. Cliente fiel (baixo grau de cancelamento)
```json
  {
    "pais": "frança",
    "genero": "feminino",
    "idade": 23.0,
    "num_produtos": 2,
    "membro_ativo": 1.0,
    "saldo": 0.0,
    "salario_estimado": 160976.75
  }
```

3. Cliente com médio grau de cancelamento
```json
  {
    "pais": "frança",
    "genero": "masculino",
    "idade": 36.0,
    "num_produtos": 1,
    "membro_ativo": 0.0,
    "saldo": 0.0,
    "salario_estimado": 113931.57
  }
```
## Notebook Completo 
[Projeto Final ChurnBank](https://colab.research.google.com/drive/1MQzkmvdJQVgpMZ85ETcQvxSZM8JtCFYY)

### Modelo e Resultados

Durante o desenvolvimento, diferentes algoritmos de classificação foram testados (AdaBoost, Random Forest, XGBoost, Logistic Regression e LightGBM). 

O modelo **LightGBM** foi escolhido como final por apresentar melhor equilíbrio entre **Recall** e **Precisão**, além de maior consistência entre treino e teste.

### Métricas principais do LightGBM
- **Acurácia (teste):** 0.81  
- **Recall:** 0.78 (capacidade de identificar clientes em risco)  
- **Precisão:** 0.55  
- **F1-score:** 0.65  
- **PR-AUC:** 0.73

Esses resultados mostram que o modelo consegue identificar a maioria dos clientes propensos ao cancelamento, permitindo que o banco aja de forma preventiva.


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

**8.Projeto em nuvem OCI - Oracle Cloud Infrastructure:**  ✅ implementado

- Acesse a aplicação  👉 [Previsão de Churn Bancário](http://137.131.255.43:5173/frontend/)

## Dependências e Versões das Ferramentas

### Back-End
- **Java:** 21 (Eclipse Temurin)
- **Spring Boot:** 3.3.5
- **Banco de Dados:** H2 (em memória)
- **Documentação:** SpringDoc OpenAPI (Swagger)
- **Containerização:** Docker & Docker Compose

### Front-End
- **React:** 18.x

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

Este projeto está licenciado sob a licença MIT — veja o arquivo [LICENSE](https://raw.githubusercontent.com/hackathon-ficaAi/ficaai-churnInsight-complete/refs/heads/main/backend-main/LICENSE) para mais detalhes.

## Contribuição

Contribuições são bem-vindas! Para colaborar:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b minha-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona minha feature'`).
4. Faça push para a branch (`git push origin minha-feature`).
5. Abra um Pull Request.
