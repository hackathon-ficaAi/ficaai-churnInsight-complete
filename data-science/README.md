
<h1 align="center">
  Microsserviço API ChurnInsight- Churn Prediction 
</h1>

<div align="center">

![Python](https://img.shields.io/badge/python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.125.0-009688)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Static Badge](https://img.shields.io/badge/status-em_desenvolvilmento-yellow)
![ML](https://img.shields.io/badge/machine%20learning-scikit--learn-orange)

</div>

## Visão geral

Este módulo do projeto **ChurnInsight** implementa um caso de uso de **previsão de churn no setor bancário**.

O objetivo é prever se um cliente irá cancelar o relacionamento com o banco (`churned`), utilizando dados demográficos e comportamentais, disponibilizando essa previsão via uma **API FastAPI** containerizada com Docker.

---

## Estrutura do Projeto

```text
churn_bancos/
├── app.py              # Ponto de entrada da API (FastAPI)
├── config.py           # Configurações globais
├── Dockerfile          # Build da imagem Docker
├── requirements.txt    # Dependências do projeto
├── data/               # Dados de treino e teste (.csv)
├── models/             # Modelos treinados (.joblib)
├── schemas/            # Esquema pipeline em json
├── scripts/            # Scripts de treino e predição
└── utils/              # Funções auxiliares (configurações de importação, features)

```

## FastAPI e como executar

Para fazer a comunicação com o back-end no projeto foi utilizado FastAPI, um moderno e rápido (alta performance) framework web para construção de APIs com Python, baseado nos type hints padrões do Python.

### Executando a API com Docker

A API estará disponível em:

Swagger

```text
http://localhost:8000/docs
```
Documentação

```text
http://localhost:8000/redoc
```
### Exemplo de Requisição via POST
Endpoint:
```text
POST /predict
```

Payload de exemplo - Entrada de dados:
```json
{
  "pais": "France",
  "genero": "Male",
  "idade": 45,
  "saldo": 75432.50,
  "num_produtos": 2,
  "membro_ativo": 1,
  "salario_estimado": 62000.00
}
```
Saída

```json
{
  "probabilidade_churn": 0.40,
  "previsao_churn": "Chance baixa de cancelamento"
}

```

## Tecnologias utilizadas

- **Python 3.11** — Linguagem principal
- **FastAPI** — API para disponibilização do modelo
- **Docker** — Containerização da aplicação
- **Scikit-learn** — Modelagem e pipelines de ML
- **Pandas / NumPy** — Manipulação e análise de dados
- **Matplotlib / Seaborn** — Gerar gráficos para visualização e análise de dados
- **Feature-engine** — Engenharia de features e pré-processamento
- **Mlflow** — Ferramenta para Gerenciar o Ciclo de Vida do Aprendizado de Máquina


