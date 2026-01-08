export default function TabelaHistorico({ listaHistorico }) {
  const traduzirPais = (paisOriginal) => {
    if (!paisOriginal) return "-";

    // 1. Remove espaços em branco e converte para minúsculo para facilitar a busca
    const chave = paisOriginal.trim().toLowerCase();

    const dicionario = {
      france: "França",
      frança: "França", // Caso já venha traduzido
      spain: "Espanha",
      espanha: "Espanha",
      germany: "Alemanha",
      alemanha: "Alemanha",
    };

    // Retorna a tradução ou o original (com a primeira letra maiúscula)
    return dicionario[chave] || paisOriginal;
  };

  const traduzirGenero = (generoOriginal) => {
    if (!generoOriginal) return "";
    const chave = generoOriginal.trim().toLowerCase();

    if (chave === "male" || chave === "masculino") return "M";
    if (chave === "female" || chave === "feminino") return "F";
    return "?";
  };

  // Verifica se a lista existe e tem itens
  if (!listaHistorico || !listaHistorico.length) {
    return <p className="no-data">Nenhum histórico disponível.</p>;
  }

  // Função auxiliar para formatar dinheiro (Euro ou Real)
  const formatMoney = (value) => {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "EUR", // Dataset original é em Euros, mas pode mudar para BRL
    }).format(value);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Cliente (País/Gênero)</th>
            <th>Idade</th>
            <th>Saldo</th>
            <th>Prod.</th>
            <th>Ativo?</th>
            <th>Previsão de Churn</th>
            <th>Risco(%)</th>
          </tr>
        </thead>
        <tbody>
          {listaHistorico.map((item) => (
            <tr
              key={item.id}
              className={
                item.probabilidade >= 0.8
                  ? "card-risco-alto"
                  : item.probabilidade >= 0.6
                  ? "card-risco-medio"
                  : "card-risco-baixo"
              }
            >
              {/* Data formatada em uma única coluna para economizar espaço */}
              <td data-label="Data/Hora">
                {new Date(item.dataAnalise).toLocaleString("pt-BR")}
              </td>

              {/* País e Gênero */}
              <td data-label="Cliente">
                {traduzirPais(item.pais)}{" "}
                <small>({traduzirGenero(item.genero)})</small>
              </td>

              <td data-label="Idade">{item.idade}</td>

              {/* Saldo formatado */}
              <td data-label="Saldo">{formatMoney(item.saldo)}</td>

              <td data-label="Produtos">{item.numProdutos}</td>

              {/* Membro Ativo (Sim/Não) */}
              <td data-label="Ativo">
                <span
                  style={{
                    color: item.membroAtivo ? "green" : "gray",
                    fontWeight: "bold",
                  }}
                >
                  {item.membroAtivo ? "Sim" : "Não"}
                </span>
              </td>

              {/* Previsão com cor condicional */}
              <td data-label="Previsão de Churn" className="previsao-text">
                {item.previsao?.includes("Alto") ? (
                  <>
                    <strong>Alto Grau</strong>
                  </>
                ) : item.previsao?.includes("Medio") ||
                  item.previsao?.includes("Médio") ? (
                  <>
                    <strong>Médio Grau </strong>
                  </>
                ) : item.previsao?.includes("Baixo") ? (
                  <>
                    <strong>Baixo Grau</strong>
                  </>
                ) : (
                  item.previsao
                )}
              </td>

              {/* Probabilidade */}
              <td
                data-label="Risco (%)"
                className={
                  item.probabilidade >= 0.8
                    ? "risco-alto"
                    : item.probabilidade >= 0.6
                    ? "risco-medio"
                    : "risco-baixo"
                }
              >
                <strong>{(item.probabilidade * 100).toFixed(1)}%</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
