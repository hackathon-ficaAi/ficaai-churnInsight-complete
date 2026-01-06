package com.ficaai.backend.controller;

import com.ficaai.backend.dto.ClienteInputDTO;
import com.ficaai.backend.dto.PrevisaoOutputDTO;
import com.ficaai.backend.service.ChurnService; // Importe o Service
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChurnController {

    @Autowired
    private ChurnService churnService; // Injeção de Dependência

    @PostMapping("/predict")
    public ResponseEntity<PrevisaoOutputDTO> preverChurn(@RequestBody @Valid ClienteInputDTO dados) {
        // Log dos dados recebidos para depuração
        log.info(
                "Requisição recebida para previsão de churn | pais={} | genero={} | idade={} | numProdutos={} | membroAtivo={} | saldo={} | salarioEstimado={}",
                dados.getPais(),
                dados.getGenero(),
                dados.getIdade(),
                dados.getNumProdutos(),
                dados.getMembroAtivo(),
                dados.getSaldo(),
                dados.getSalarioEstimado());
        PrevisaoOutputDTO resultado = churnService.analisarCliente(dados);
        return ResponseEntity.ok(resultado);
    }
}