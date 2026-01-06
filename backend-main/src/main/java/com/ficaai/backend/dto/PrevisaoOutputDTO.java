package com.ficaai.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrevisaoOutputDTO {

    // @JsonAlias permite ler "previsao_churn" vindo do Python
    // Mas quando enviar pro Frontend, continua saindo como "previsao"
    @JsonAlias({ "previsao_churn", "previsao" })
    private String previsao;

    @JsonAlias({ "probabilidade_churn", "probabilidade" })
    private Double probabilidade;
}