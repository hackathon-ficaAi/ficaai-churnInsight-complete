export default function Resultado({ resultado }) {
  if (!resultado) return null;

  const isChurn =
    resultado.previsao === "Vai sair" ||
    resultado.previsao === "Vai cancelar" ||
    resultado.previsao === "Churn";

  // Formata a porcentagem
  const porcentagem = (resultado.probabilidade * 100).toFixed(1);

  return (
    <div className="resultado-container">
      <h3>Resultado da Análise</h3>
      
      <div
        className={`card-resultado ${isChurn ? "danger" : "success"}`}
        style={{
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: isChurn ? "#ffebee" : "#e8f5e9",
          border: `1px solid ${isChurn ? "#ef9a9a" : "#a5d6a7"}`,
          textAlign: "center",
          marginTop: "20px"
        }}
      >
        <h2 style={{ color: isChurn ? "#c62828" : "#2e7d32", margin: "10px 0" }}>
          {resultado.previsao}
        </h2>
        
        <p style={{ fontSize: "1.2rem" }}>
          Probabilidade de Churn: <strong>{porcentagem}%</strong>
        </p>

        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          {isChurn
            ? "⚠️ Cliente com alto risco de deixar o banco."
            : "✅ Cliente com tendência a permanecer fiel."}
        </p>
      </div>
    </div>
  );
}