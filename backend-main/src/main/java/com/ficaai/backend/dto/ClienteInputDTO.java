package com.ficaai.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ClienteInputDTO {
    @NotBlank(message = "O país é obrigatório")
    @JsonProperty("pais")
    private String pais;

    @NotBlank(message = "O gênero é obrigatório")
    @JsonProperty("genero")
    private String genero;

    @NotNull(message = "A idade é obrigatória e deve ser no mínimo 1")
    @Min(value = 1, message = "A idade deve ser no mínimo 1")
    @JsonProperty("idade")
    private Integer idade;

    @NotNull(message = "O número de produtos é obrigatório e não pode ser negativo")
    @Min(value = 0, message = "O número de produtos não pode ser negativo")
    @JsonProperty("num_produtos")
    private Integer numProdutos;

    @NotNull(message = "Membro ativo é obrigatório")
    @JsonProperty("membro_ativo")
    private Boolean membroAtivo;

    @NotNull(message = "O saldo é obrigatório")
    @JsonProperty("saldo")
    private Double saldo;

    @NotNull(message = "O salário estimado é obrigatório e deve ser positivo")
    @Positive(message = "O salário estimado deve ser um valor positivo")
    @JsonProperty("salario_estimado")
    private Double salarioEstimado;
}