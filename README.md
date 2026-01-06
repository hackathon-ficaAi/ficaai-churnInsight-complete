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
- [Arquitetura Inicial](#arquitetura-inicial)
- [Setup](#setup)
- [Testes](#testes)
- [Funcionalidades do MVP](#funcionalidades-do-mvp)
- [Dependências e Versões das Ferramentas](#dependências-e-versões-das-ferramentas)
- [Licença](#licença)
- [Contribuição](#contribuição)


## Introdução

Bancos digitais e fintechs trabalham com clientes que mantêm contas, cartões e serviços recorrentes. Sabe-se que é muito mais caro fazer login com um novo cliente do que manter um já existente. Por isso, é vantajoso para os bancos saber o que leva um cliente à decisão de deixar a empresa.


## Objetivo

Desenvolver um MVP - Produto Mínimo Viável para identificar clientes com risco de **churn** (cancelamento) com variáveis que ajudam a prever se o cliente vai sair ou não.


## Arquitetura Inicial

Visualização dos componentes do sistema e do fluxo de dados. [Diagrama de Sequência de Orquestração Backend + IA](https://drive.google.com/file/d/129lMFAp8Qr_Df3LdVijGTWCgLPpsWXqs/view?usp=drive_link)


## Setup

### Como executar o Projeto

### Passo a Passo

1.  Abra o terminal na raiz do projeto.
2.  Execute o comando abaixo para compilar e subir o ambiente:

```bash
docker-compose up --build
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
1. Cliente com alto risco de cancelamento

2. Cliente fiel (baixo risco de cancelamento)

3. Cliente intermediário (probabilidade moderada)


## Funcionalidades do MVP

**1.Endpoints:** ✅ implementado
  - `api/predict`
  - `api/historico`
**2.Carregamento de modelo preditivo:** ✅ implementado

**3.Validação de entrada:** ✅ implementado

**4.Resposta estruturada:** ✅ implementado

**5.Persistência de previsões:**  🔜 em desenvolvimento

**6.Containerização:** ✅ implementado

**7.Projeto em nuvem OCI - Oracle Cloud Infrastructure:**  🔜 em desenvolvimento


## Licença 

Este projeto está licenciado sob a licença MIT — veja o arquivo [LICENSE](https://raw.githubusercontent.com/hackathon-ficaAi/ficaai-churnInsight-complete/refs/heads/main/backend-main/LICENSE) para mais detalhes.

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

#### Gerenciamento de Experimentos e Modelos 
- mlflow (>=3.8.1) *(para rastreamento de experimentos, versionamento e deploy de modelos)*

## Contribuição

Contribuições são bem-vindas! Para colaborar:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b minha-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona minha feature'`).
4. Faça push para a branch (`git push origin minha-feature`).
5. Abra um Pull Request.
