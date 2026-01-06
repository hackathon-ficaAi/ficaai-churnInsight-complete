# 🤖 FicaAI - Backend Service

Microsserviço responsável pela inteligência de predição de Churn (Rotatividade de Clientes). Desenvolvido em **Java 21** com **Spring Boot**, utilizando arquitetura de containers para fácil deploy.

---

## 🚀 Como Rodar (Jeito Rápido)

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🚀 Como Rodar (Quick Start)

Este projeto foi desenhado para ser agnóstico ao ambiente, rodando via **Docker**. Você não precisa instalar Java ou Maven localmente.

### Pré-requisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

### Passo a Passo

1.  Abra o terminal na raiz do projeto.
2.  Execute o comando abaixo para compilar e subir o ambiente:

```bash
docker-compose up --build
```
## Links Úteis

Documentação (Swagger)	http://localhost:8080/swagger-ui/index.html	--> Teste os endpoints visualmente.

Banco de Dados (H2)	http://localhost:8080/h2-console --> Acesse o banco em memória.

## Credenciais do banco H2

Driver Class: org.h2.Driver

JDBC URL: jdbc:h2:mem:ficaaidb

User Name: sa

Password: password

# Contrato de Dados (Mockados atualmente)

1. Prever Churn

Analisa os dados de um cliente e retorna a probabilidade de cancelamento.

    Método: POST

    URL: /api/predict

Exemplo de Entrada (JSON):

{
  "tempo_contrato_meses": 12,
  "atrasos_pagamento": 2,
  "uso_mensal": 14.5,
  "plano": "Premium"
}

Exemplo de Saída (JSON):

{
  "previsao": "Vai continuar",
  "probabilidade": 0.95
}

## 2. Estatísticas do Sistema

Retorna métricas gerais sobre as análises realizadas desde a inicialização.

    Método: GET

    URL: /api/stats

## 🛠️ Tecnologias Utilizadas

Linguagem: Java 21 (Eclipse Temurin)

Framework: Spring Boot 3.3.5

Banco de Dados: H2 Database (Em memória, para alta velocidade)

Documentação: SpringDoc OpenApi (Swagger)

Containerização: Docker & Docker Compose

## 📂 Estrutura do Projeto
```
src/main/java/com/ficaai/backend
├── controller   # Pontos de entrada da API (REST)
├── dto          # Objetos de Transferência de Dados (Contrato JSON)
├── model        # Entidades do Banco de Dados
├── repository   # Camada de acesso a dados (JPA)
└── service      # Regras de Negócio e Lógica de IA
