import React from "react";
import { getNivelRisco } from "../utils/riscoUtils";

export default function Resultado({ resultado }) {
  if (!resultado) return null;

  // 1. Pega a probabilidade
  const prob = parseFloat(resultado.probabilidade);
  
  // 2. Usa a nossa função utilitária para pegar o texto PADRONIZADO (Risco)
  // Isso garante que se na tabela é "Alto Risco", aqui também será.
  const risco = getNivelRisco(prob);
  
  const porcentagem = (prob * 100).toFixed(1);

  // 3. Define cores baseadas na classe que voltou do utils
  let corBg, corBorda, corTitulo, mensagem;

  if (risco.classe === "risco-alto") {
    mensagem = "⚠️ Cliente com Alto risco de deixar o banco.";
    corBg = "#ffebee";
    corBorda = "#ef9a9a";
    corTitulo = "#c62828";
  } else if (risco.classe === "risco-medio") {
    mensagem = "⚠️ Cliente com risco Moderado de deixar o banco.";
    corBg = "#fffbeb"; // Amarelo claro
    corBorda = "#f59e0b";
    corTitulo = "#92400e";
  } else {
    mensagem = "✅ Cliente com tendência a permanecer fiel.";
    corBg = "#e8f5e9";
    corBorda = "#a5d6a7";
    corTitulo = "#2e7d32";
  }

  return (
    <div className="resultado-container">
      <h3>Resultado da Análise</h3>

      <div
        className={`card-resultado ${risco.classe}`}
        style={{
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: corBg,
          border: `1px solid ${corBorda}`,
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        {/* AQUI ESTAVA O ERRO: Trocamos resultado.previsao por risco.label */}
        <h2 style={{ color: corTitulo, margin: "10px 0", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>{risco.icon}</span> 
          {risco.label} 
        </h2>

        <p style={{ fontSize: "1.2rem" }}>
          Probabilidade de Churn: <strong>{porcentagem}%</strong>
        </p>

        <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "10px" }}>
            {mensagem}
        </p>
      </div>
    </div>
  );
}