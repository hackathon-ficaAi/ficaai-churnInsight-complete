package com.ficaai.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}

// ./mvnw clean package -DskipTests --> compila o projeto sem rodar os testes
// docker-compose up --build --> sobe o projeto no docker

// http://localhost:8080/swagger-ui/index.html --> link do swagger
// http://localhost:8080/h2-console --> link do banco de dados H2

// JBC URL: jdbc:h2:mem:ficaaidb
// User: sa
// Password: password

// 2026 FicaAI. All rights reserved.