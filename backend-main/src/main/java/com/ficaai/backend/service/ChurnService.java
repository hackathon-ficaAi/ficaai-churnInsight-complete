package com.ficaai.backend.service;

import com.ficaai.backend.dto.ClienteInputDTO;
import com.ficaai.backend.dto.PrevisaoOutputDTO;
import com.ficaai.backend.exception.ExternalServiceException;
import com.ficaai.backend.model.HistoricoAnalise;
import com.ficaai.backend.repository.HistoricoRepository;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

@Slf4j
@Service
public class ChurnService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private HistoricoRepository repository;

    @Value("${python.api.url}")
    private String pythonApiUrl;

    // Método principal que analisa o cliente
    public PrevisaoOutputDTO analisarCliente(ClienteInputDTO dados) {
        long inicioTotal = System.currentTimeMillis();
        log.info("Iniciando análise de churn (Modelo Bancário)");

        // 1. Chama a API Python com os dados reais
        PrevisaoOutputDTO resultado = chamarApiPython(dados);

        // 2. Salva no histórico
        salvarNoHistorico(dados, resultado);

        long tempoTotal = System.currentTimeMillis() - inicioTotal;
        log.info("Análise finalizada | previsao={} | tempoTotal={}ms", resultado.getPrevisao(), tempoTotal);

        return resultado;
    }

    // Método que chama a API Python real
    private PrevisaoOutputDTO chamarApiPython(ClienteInputDTO dados) {
        long inicio = System.currentTimeMillis();
        log.info("Enviando dados para API Python...");

        try {
            // --- MAPEAMENTO DE DADOS ---
            // O Python espera chaves em minúsculo com underline (ex: credit_score)
            // O Java usa CamelCase (ex: creditScore). Vamos traduzir aqui.

            Map<String, Object> payloadPython = new HashMap<>();

            // Mapeando campos do DTO (Java) para o JSON da API (Python)

            payloadPython.put("pais", dados.getPais());
            payloadPython.put("genero", dados.getGenero());
            payloadPython.put("idade", dados.getIdade());
            payloadPython.put("saldo", dados.getSaldo());
            payloadPython.put("num_produtos", dados.getNumProdutos());

            // Tratamento para booleanos (se o Python esperar 0 ou 1)
            payloadPython.put("membro_ativo", dados.getMembroAtivo() ? 1 : 0);
            payloadPython.put("salario_estimado", dados.getSalarioEstimado());

            // --- FIM DO MAPEAMENTO ---

            // Envia o Mapa (payloadPython) ao invés do objeto 'dados' direto
            PrevisaoOutputDTO resposta = restTemplate.postForObject(pythonApiUrl, payloadPython,
                    PrevisaoOutputDTO.class);

            long duracao = System.currentTimeMillis() - inicio;
            log.info("Sucesso! API Python respondeu em {}ms", duracao);

            return resposta;

        } catch (ResourceAccessException e) {
            log.error("API Python inacessível em {}: {}", pythonApiUrl, e.getMessage());
            throw new ExternalServiceException("Serviço de IA indisponível no momento", e);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("Erro API Python: {} | Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ExternalServiceException("Erro de validação na IA: " + e.getResponseBodyAsString(), e);
        }
    }

    // Método que salva a análise no banco de dados
    private void salvarNoHistorico(ClienteInputDTO dados, PrevisaoOutputDTO resultado) {
        try {
            HistoricoAnalise historico = new HistoricoAnalise();

            // Copia propriedades iguais
            BeanUtils.copyProperties(dados, historico);

            historico.setPrevisao(resultado.getPrevisao());
            historico.setProbabilidade(resultado.getProbabilidade());

            repository.save(historico);
            log.info("Histórico ID {} salvo.", historico.getId());
        } catch (Exception e) {
            log.error("Falha ao salvar histórico (não bloqueante): {}", e.getMessage());
        }
    }
}