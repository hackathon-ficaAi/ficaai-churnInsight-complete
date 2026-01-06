package com.ficaai.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity // Isso diz ao JPA: "Crie uma tabela com esse nome"
@Table(name = "tb_historico")
public class HistoricoAnalise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment (1, 2, 3...)
    private Long id;

    // Dados de Entrada (Input)
    private String pais;
    private String genero;
    private Integer idade;
    private Integer numProdutos;
    private Boolean membroAtivo;
    private Double saldo;
    private Double salarioEstimado;

    // Dados de Saída (Output / IA)
    private String previsao;
    private Double probabilidade;

    // Metadados
    private LocalDateTime dataAnalise;

    private Integer tempoContratoMeses;

    @PrePersist // Antes de salvar, preenche a data atual
    public void prePersist() {
        this.dataAnalise = LocalDateTime.now();
    }
}