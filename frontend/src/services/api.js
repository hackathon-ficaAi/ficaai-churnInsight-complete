const API_BASE = "http://localhost:8080/api";

export async function predictChurn(dados) {
  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  if (!response.ok) {
    throw new Error("Erro na previsão de churn");
  }
  return response.json();
}
export async function getHistorico() {
  const response = await fetch(`${API_BASE}/historico`);
  if (!response.ok) {
    throw new Error("Erro ao buscar histórico");
  }
  return response.json();
}
