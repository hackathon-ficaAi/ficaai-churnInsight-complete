package com.ficaai.backend.exception;

public class ExternalServiceException extends RuntimeException {

    public ExternalServiceException(String mensagem) {
        super(mensagem);
    }

    public ExternalServiceException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
