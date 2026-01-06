const form = document.getElementById("form-churn");
const resultadoDiv = document.getElementById("resultado");

const API_PREDICT = "http://localhost:8080/api/predict";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
        tempo_contrato_meses: Number(tempoContrato.value),
        atrasos_pagamento: Number(atrasosPagamento.value),
        uso_mensal: Number(usoMensal.value),
        plano: plano.value
    };

    resultadoDiv.innerHTML = "🔄 Processando...";

    try {
        const response = await fetch(API_PREDICT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error("Erro na previsão");
        }

        const resultado = await response.json();

        resultadoDiv.innerHTML = `
            <h3>Resultado</h3>
            <p><strong>Previsão:</strong> ${resultado.previsao}</p>
            <p><strong>Probabilidade:</strong> ${(resultado.probabilidade * 100).toFixed(2)}%</p>
        `;

    } catch {
        resultadoDiv.innerHTML = "❌ Erro ao conectar com o backend.";
    }
});
