package com.ficaai.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private String erro;
    private String mensagem;
    private Map<String, String> detalhes;
    private LocalDateTime timestamp;

    public ErrorResponse(String erro, String mensagem) {
        this.erro = erro;
        this.mensagem = mensagem;
        this.detalhes = null;
        this.timestamp = LocalDateTime.now();
    }
}
