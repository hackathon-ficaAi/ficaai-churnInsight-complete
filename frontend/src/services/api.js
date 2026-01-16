const API_BASE = "http://localhost:8080/api";
//const API_BASE = "http://137.131.255.43:8080/api"; // Produção

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
