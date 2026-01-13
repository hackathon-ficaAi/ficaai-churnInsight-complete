import React from "react";
import { getNivelRisco } from "../utils/riscoUtils";
// Importante: Importar o CSS específico do resultado
import "../styles/resultado.css";

export default function Resultado({ resultado }) {
  if (!resultado) return null;

  // 1. Pega a probabilidade e converte para número
  const prob = parseFloat(resultado.probabilidade);
  
  // 2. Usa a função utilitária para obter a classe e ícone padronizados
  const risco = getNivelRisco(prob);
  
  const porcentagem = (prob * 100).toFixed(1);

  // 3. Define a mensagem com base na classe de risco
  let mensagem;
  if (risco.classe === "risco-alto") {
    mensagem = "⚠️ Alerta Crítico: Cliente com alta probabilidade de evasão. Ação imediata recomendada.";
  } else if (risco.classe === "risco-medio") {
    mensagem = "⚠️ Atenção: Risco moderado identificado. Monitore o engajamento deste cliente.";
  } else {
    // Baixo risco
    mensagem = "✅ Cliente estável: Tendência a permanecer fiel ao banco. Sem ações urgentes.";
  }

  return (
    <div className="resultado-container">
      <h3>Resultado da Análise</h3>

      {/* A classe dinâmica (ex: 'risco-alto') aplica o estilo Neon correto do CSS */}
      <div className={`card-resultado ${risco.classe}`}>
        
        <h2 className="titulo-resultado">
          <span className="icone-risco">{risco.icon}</span> 
          {risco.label} 
        </h2>

        <div className="probabilidade-box">
          <span className="label-prob">Probabilidade de Churn</span>
          <span className="valor-prob">{porcentagem}%</span>
        </div>

        <p className="mensagem-analise">
            {mensagem}
        </p>
      </div>
    </div>
  );
}