export default function TabelaHistorico({ listaHistorico }) {

 const traduzirPais = (paisOriginal) => {
    if (!paisOriginal) return "-";
    
    // 1. Remove espaços em branco e converte para minúsculo para facilitar a busca
    const chave = paisOriginal.trim().toLowerCase();

    const dicionario = {
      "france": "França",
      "frança": "França", // Caso já venha traduzido
      "spain": "Espanha",
      "espanha": "Espanha",
      "germany": "Alemanha",
      "alemanha": "Alemanha"
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
                {traduzirPais(item.pais)} 
                {" "}
                <small>({traduzirGenero(item.genero)})</small>
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