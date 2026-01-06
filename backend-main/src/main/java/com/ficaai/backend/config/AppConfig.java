package com.ficaai.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration // Indica que esta classe tem configurações do sistema
public class AppConfig {

    @Bean // Cria uma instância única do RestTemplate para o projeto todo usar
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}