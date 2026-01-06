package com.ficaai.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ficaai.backend.dto.ClienteInputDTO;
import com.ficaai.backend.dto.PrevisaoOutputDTO;
import com.ficaai.backend.service.ChurnService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testes de Integração para ChurnController (Modelo Bancário)
 */
@WebMvcTest(ChurnController.class)
class ChurnControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChurnService churnService;

    @Autowired
    private ObjectMapper objectMapper;

    private ClienteInputDTO clienteInput;

    @BeforeEach
    void setUp() {
        // Setup com dados bancários válidos
        clienteInput = new ClienteInputDTO();
        clienteInput.setPais("França");
        clienteInput.setGenero("Feminino");
        clienteInput.setIdade(40);
        clienteInput.setSaldo(60000.0);
        clienteInput.setNumProdutos(2);
        clienteInput.setMembroAtivo(true);
        clienteInput.setSalarioEstimado(50000.0);
    }

    @Test
    @DisplayName("POST /api/predict - Deve retornar 200 OK com previsão válida")
    void deveRetornarPrevisaoComSucesso() throws Exception {
        PrevisaoOutputDTO previsaoEsperada = new PrevisaoOutputDTO("Cliente Fiel", 0.95);

        when(churnService.analisarCliente(any(ClienteInputDTO.class)))
                .thenReturn(previsaoEsperada);

        mockMvc.perform(post("/api/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteInput)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.previsao", is("Cliente Fiel")))
                .andExpect(jsonPath("$.probabilidade", is(0.95)));
    }

    @Test
    @DisplayName("POST /api/predict - Deve retornar 400 quando País estiver vazio")
    void deveRetornar400QuandoPaisVazio() throws Exception {
        clienteInput.setPais("");

        mockMvc.perform(post("/api/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteInput)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/predict - Deve retornar 400 quando Idade for menor que 18")
    void deveRetornar400QuandoIdadeMenorQueDezoito() throws Exception {
        clienteInput.setIdade(17);

        mockMvc.perform(post("/api/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteInput)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/predict - Deve retornar 400 quando Saldo for nulo")
    void deveRetornar400QuandoSaldoNulo() throws Exception {
        clienteInput.setSaldo(null);

        mockMvc.perform(post("/api/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteInput)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/predict - Deve processar JSON com snake_case (padrão Python) corretamente")
    void deveProcessarJsonComSnakeCaseCorretamente() throws Exception {
        PrevisaoOutputDTO previsaoEsperada = new PrevisaoOutputDTO("Vai sair", 0.81);

        when(churnService.analisarCliente(any(ClienteInputDTO.class)))
                .thenReturn(previsaoEsperada);

        // Simulando um JSON vindo do Front com as chaves em snake_case (como definimos
        // no @JsonProperty)
        String jsonComSnakeCase = """
                {
                    "pais": "Brasil",
                    "genero": "Masculino",
                    "idade": 45,
                    "saldo": 85000.0,
                    "num_produtos": 3,
                    "membro_ativo": false,
                    "salario_estimado": 120000.0
                }
                """;

        mockMvc.perform(post("/api/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonComSnakeCase))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.previsao", is("Vai sair")));
    }
}