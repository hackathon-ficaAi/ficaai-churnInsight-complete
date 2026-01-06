package com.ficaai.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes para validações do ClienteInputDTO (Modelo Bancário)
 */
class ClienteInputDTOTest {

    private Validator validator;
    private ClienteInputDTO cliente;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        // Setup inicial com dados válidos
        cliente = new ClienteInputDTO();
        cliente.setPais("France");
        cliente.setGenero("Male");
        cliente.setIdade(35);
        cliente.setSaldo(50000.0);
        cliente.setNumProdutos(1);
        cliente.setMembroAtivo(true);
        cliente.setSalarioEstimado(60000.0);
    }

    @Test
    @DisplayName("Deve validar DTO com todos os campos corretos")
    void deveValidarDTOComTodosCamposCorretos() {
        Set<ConstraintViolation<ClienteInputDTO>> violations = validator.validate(cliente);
        assertTrue(violations.isEmpty(), "Não deveria ter erros de validação");
    }

    // --- TESTES DE IDADE ---

    @Test
    @DisplayName("Deve invalidar quando Idade for menor que 18")
    void deveInvalidarQuandoIdadeMenorQueDezoito() {
        cliente.setIdade(17);
        Set<ConstraintViolation<ClienteInputDTO>> violations = validator.validate(cliente);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("mínimo 18")));
    }

    // --- TESTES DE CAMPOS OBRIGATÓRIOS ---

    @Test
    @DisplayName("Deve invalidar quando País for vazio")
    void deveInvalidarQuandoPaisVazio() {
        cliente.setPais("");
        Set<ConstraintViolation<ClienteInputDTO>> violations = validator.validate(cliente);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("país é obrigatório")));
    }

    @Test
    @DisplayName("Deve invalidar quando Saldo for nulo")
    void deveInvalidarQuandoSaldoNulo() {
        cliente.setSaldo(null);
        Set<ConstraintViolation<ClienteInputDTO>> violations = validator.validate(cliente);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("saldo é obrigatório")));
    }

    @Test
    @DisplayName("Deve invalidar quando NumProdutos for negativo")
    void deveInvalidarQuandoNumProdutosNegativo() {
        cliente.setNumProdutos(-1);
        Set<ConstraintViolation<ClienteInputDTO>> violations = validator.validate(cliente);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("não pode ser negativo")));
    }

    @Test
    @DisplayName("Deve invalidar quando SalarioEstimado for zero ou negativo")
    void deveInvalidarQuandoSalarioInvalido() {
        cliente.setSalarioEstimado(0.0);
        Set<ConstraintViolation<ClienteInputDTO>> violations = validator.validate(cliente);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("positivo")));
    }
}