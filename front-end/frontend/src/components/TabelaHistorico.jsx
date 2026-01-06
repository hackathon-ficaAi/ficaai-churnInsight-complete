export default function TabelaHistorico({ listaHistorico }) {
  
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
            <th>Previsão</th>
            <th>Risco</th>
          </tr>
        </thead>
        <tbody>
          {listaHistorico.map((item) => (
            <tr key={item.id}>
              {/* Data formatada em uma única coluna para economizar espaço */}
              <td>{new Date(item.dataAnalise).toLocaleString("pt-BR")}</td>

              {/* País e Gênero */}
              <td>
                {item.pais} <small>({item.genero === "Male" ? "M" : "F"})</small>
              </td>

              <td>{item.idade}</td>

              {/* Saldo formatado */}
              <td>{formatMoney(item.saldo)}</td>

              <td>{item.numProdutos}</td>

              {/* Membro Ativo (Sim/Não) */}
              <td>
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
              <td
                style={{
                  color: item.previsao?.includes("sair") || item.previsao?.includes("cancelar") ? "red" : "green",
                  fontWeight: "bold",
                }}
              >
                {item.previsao}
              </td>

              {/* Probabilidade */}
              <td>
                <strong>{(item.probabilidade * 100).toFixed(1)}%</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}