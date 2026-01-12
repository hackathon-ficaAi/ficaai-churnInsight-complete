export default function Resultado({ resultado }) {
  if (!resultado) return null;

  const previsaoTexto = resultado.previsao?.toLowerCase() || "";

  const isAltoRisco =
    previsaoTexto.includes("alto") ||
    previsaoTexto.includes("churn") ||
    previsaoTexto.includes("sair");

  const isMedioRisco = previsaoTexto.includes("médio");

  // Formata a porcentagem
  const porcentagem = (resultado.probabilidade * 100).toFixed(1);

  let mensagem;
  let classe;
  let corBg;
  let corBorda;
  let corTitulo;

  if (isAltoRisco) {
    mensagem = "⚠️ Cliente com Alto risco de deixar o banco.";
    classe = "danger";
    corBg = "#ffebee";
    corBorda = "#ef9a9a";
    corTitulo = "#c62828";
  } else if (isMedioRisco) {
    mensagem = "⚠️ Cliente com risco Moderado de deixar o banco.";
    classe = "warning";
    corBg = "#fff8e1";
    corBorda = "#ffe082";
    corTitulo = "#f9a825";
  } else {
    mensagem = "✅ Cliente com tendência a permanecer fiel.";
    classe = "success";
    corBg = "#e8f5e9";
    corBorda = "#a5d6a7";
    corTitulo = "#2e7d32";
  }

  return (
    <div className="resultado-container">
      <h3>Resultado da Análise</h3>

      <div
        className={`card-resultado ${classe}`}
        style={{
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: corBg,
          border: `1px solid ${corBorda}`,
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <h2 style={{ color: corTitulo, margin: "10px 0" }}>
          {resultado.previsao}
        </h2>

        <p style={{ fontSize: "1.2rem" }}>
          Probabilidade de Churn: <strong>{porcentagem}%</strong>
        </p>

        <p style={{ fontSize: "0.9rem", color: "#555" }}>{mensagem}</p>
      </div>
    </div>
  );
}
