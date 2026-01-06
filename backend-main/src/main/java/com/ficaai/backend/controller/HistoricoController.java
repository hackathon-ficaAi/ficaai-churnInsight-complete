package com.ficaai.backend.controller;

import com.ficaai.backend.model.HistoricoAnalise;
import com.ficaai.backend.repository.HistoricoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController {

    private final HistoricoRepository repository;

    public HistoricoController(HistoricoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<HistoricoAnalise> listar() {
        return repository.findAll();
    }
}
