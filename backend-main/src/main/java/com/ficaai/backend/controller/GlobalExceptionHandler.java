package com.ficaai.backend.controller;

import com.ficaai.backend.dto.ErrorResponse;
import com.ficaai.backend.exception.ExternalServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handler para JSON malformado/inválido
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleJsonInvalido(HttpMessageNotReadableException ex) {
        log.debug("JSON inválido recebido: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .erro("JSON_INVALIDO")
                .mensagem("Formato JSON inválido na requisição")
                .detalhes(null)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errorResponse);
    }

    // Handler para erros de validação (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.debug("Erro de validação: {}", ex.getMessage());

        Map<String, String> detalhes = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            detalhes.put(fieldName, errorMessage);
        });

        ErrorResponse errorResponse = ErrorResponse.builder()
                .erro("VALIDACAO_ERRO")
                .mensagem("Dados de entrada inválidos")
                .detalhes(detalhes)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errorResponse);
    }

    // Handler para erros de conexão com serviços externos (ex: Python API down)
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<ErrorResponse> handleResourceAccessException(ResourceAccessException ex) {
        log.warn("Erro ao acessar serviço externo: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .erro("SERVICO_INDISPONIVEL")
                .mensagem("Serviço de previsão temporariamente indisponível")
                .detalhes(null)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(errorResponse);
    }

    // Handler para erros HTTP do cliente (4xx do Python)
    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ErrorResponse> handleHttpClientError(HttpClientErrorException ex) {
        log.error("Erro 4xx do serviço externo: status={}, body={}",
                ex.getStatusCode(), ex.getResponseBodyAsString());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .erro("ERRO_SERVICO_EXTERNO")
                .mensagem("Erro ao processar requisição no serviço de previsão")
                .detalhes(null)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(errorResponse);
    }

    // Handler para erros HTTP do servidor (5xx do Python)
    @ExceptionHandler(HttpServerErrorException.class)
    public ResponseEntity<ErrorResponse> handleHttpServerError(HttpServerErrorException ex) {
        log.error("Erro 5xx do serviço externo: status={}, body={}",
                ex.getStatusCode(), ex.getResponseBodyAsString());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .erro("ERRO_SERVICO_EXTERNO")
                .mensagem("Erro interno no serviço de previsão")
                .detalhes(null)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(errorResponse);
    }

    // Handler para nossa exceção customizada
    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ErrorResponse> handleExternalServiceException(ExternalServiceException ex) {
        log.warn("Exceção de serviço externo: {}", ex.getMessage(), ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .erro("SERVICO_INDISPONIVEL")
                .mensagem("Serviço de previsão temporariamente indisponível")
                .detalhes(null)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(errorResponse);
    }

    // Capturador genérico para qualquer outro erro não previsto
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        // Loga o erro completo no servidor para debug
        log.error("Erro inesperado: {}", ex.getMessage(), ex);

        // Retorna mensagem genérica e limpa para o cliente (sem expor detalhes internos)
        ErrorResponse errorResponse = ErrorResponse.builder()
                .erro("ERRO_INTERNO")
                .mensagem("Erro interno no servidor")
                .detalhes(null)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorResponse);
    }
}
