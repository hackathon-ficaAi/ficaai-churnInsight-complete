package com.ficaai.backend.service;

import com.ficaai.backend.dto.ClienteInputDTO;
import com.ficaai.backend.dto.PrevisaoOutputDTO;
import com.ficaai.backend.exception.ExternalServiceException;
import com.ficaai.backend.model.HistoricoAnalise;
import com.ficaai.backend.repository.HistoricoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChurnServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private HistoricoRepository repository;

    @InjectMocks
    private ChurnService churnService;

    private ClienteInputDTO clienteInput;

    @BeforeEach
    void setUp() {
        // Injeta a URL da API Python (simula o @Value)
        ReflectionTestUtils.setField(churnService, "pythonApiUrl", "http://fake-api/predict");

        // Setup com dados bancários válidos
        clienteInput = new ClienteInputDTO();
        clienteInput.setPais("Alemanha");
        clienteInput.setGenero("Feminino");
        clienteInput.setIdade(30);
        clienteInput.setSaldo(80000.0);
        clienteInput.setNumProdutos(1);
        clienteInput.setMembroAtivo(true);
        clienteInput.setSalarioEstimado(60000.0);
    }

    @Test
    @DisplayName("Deve chamar API Python e retornar previsão com sucesso")
    void deveChamarApiPythonComSucesso() {
        // Mock da resposta do Python
        PrevisaoOutputDTO respostaPython = new PrevisaoOutputDTO("Cliente Fiel", 0.90);

        when(restTemplate.postForObject(eq("http://fake-api/predict"), any(Map.class), eq(PrevisaoOutputDTO.class)))
                .thenReturn(respostaPython);

        when(repository.save(any(HistoricoAnalise.class))).thenReturn(new HistoricoAnalise());

        PrevisaoOutputDTO resultado = churnService.analisarCliente(clienteInput);

        assertNotNull(resultado);
        assertEquals("Cliente Fiel", resultado.getPrevisao());
        assertEquals(0.90, resultado.getProbabilidade());

        // Verifica se chamou o RestTemplate
        verify(restTemplate, times(1)).postForObject(anyString(), any(Map.class), any());
    }

    @Test
    @DisplayName("Deve mapear os dados corretamente para o formato snake_case do Python")
    void deveMapearDadosCorretamente() {
        PrevisaoOutputDTO respostaMock = new PrevisaoOutputDTO("Teste", 0.5);
        when(restTemplate.postForObject(anyString(), any(Map.class), any())).thenReturn(respostaMock);

        churnService.analisarCliente(clienteInput);

        // Captura o Map que foi enviado para o RestTemplate
        ArgumentCaptor<Map<String, Object>> captor = ArgumentCaptor.forClass(Map.class);
        verify(restTemplate).postForObject(anyString(), captor.capture(), any());

        Map<String, Object> payloadEnviado = captor.getValue();

        // Verifica se as chaves estão em snake_case
        assertEquals("Alemanha", payloadEnviado.get("pais"));
        assertEquals("Feminino", payloadEnviado.get("genero"));
        assertEquals(30, payloadEnviado.get("idade"));
        assertEquals(80000.0, payloadEnviado.get("saldo"));
        assertEquals(1, payloadEnviado.get("num_produtos"));
        assertEquals(true, payloadEnviado.get("membro_ativo"));
        assertEquals(60000.0, payloadEnviado.get("salario_estimado"));
    }

    @Test
    @DisplayName("Deve lançar exceção quando a API Python estiver fora do ar")
    void deveLancarExcecaoQuandoApiIndisponivel() {
        when(restTemplate.postForObject(anyString(), any(Map.class), any()))
                .thenThrow(new ResourceAccessException("Connection refused"));

        ExternalServiceException exception = assertThrows(ExternalServiceException.class, () -> {
            churnService.analisarCliente(clienteInput);
        });

        assertTrue(exception.getMessage().contains("indisponível"));
    }

    @Test
    @DisplayName("Deve lançar exceção quando a API Python retornar erro 400/500")
    void deveLancarExcecaoQuandoApiRetornarErro() {
        when(restTemplate.postForObject(anyString(), any(Map.class), any()))
                .thenThrow(new HttpClientErrorException(org.springframework.http.HttpStatus.BAD_REQUEST,
                        "Dados inválidos"));

        ExternalServiceException exception = assertThrows(ExternalServiceException.class, () -> {
            churnService.analisarCliente(clienteInput);
        });

        assertTrue(exception.getMessage().contains("Erro de validação"));
    }

    @Test
    @DisplayName("Deve continuar funcionando mesmo se falhar ao salvar no banco")
    void deveIgnorarErroDeBancoDeDados() {
        PrevisaoOutputDTO respostaMock = new PrevisaoOutputDTO("Teste", 0.5);
        when(restTemplate.postForObject(anyString(), any(Map.class), any())).thenReturn(respostaMock);

        // Simula erro no banco
        doThrow(new RuntimeException("Erro SQL")).when(repository).save(any(HistoricoAnalise.class));

        // Não deve lançar exceção
        assertDoesNotThrow(() -> churnService.analisarCliente(clienteInput));

        verify(repository, times(1)).save(any(HistoricoAnalise.class));
    }
}