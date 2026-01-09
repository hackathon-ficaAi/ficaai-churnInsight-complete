import { getNivelRisco } from "../utils/riscoUtils";

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
  const historicoOrdenado = [...listaHistorico].sort(
    (a, b) => b.probabilidade - a.probabilidade
  );

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
            <th>Risco</th>
          </tr>
        </thead>
        <tbody>
          {historicoOrdenado.map((item) => {
            const risco = getNivelRisco(item.probabilidade);

            return (
              <tr key={item.id} className={`card-${risco.classe}`}>
                <td data-label="Data/Hora" className="data-hora">
                  {new Date(item.dataAnalise).toLocaleDateString("pt-BR")}
                  <br />
                  {new Date(item.dataAnalise).toLocaleTimeString("pt-BR")}
                </td>

                <td data-label="Cliente">
                  {traduzirPais(item.pais)}{" "}
                  <small>({traduzirGenero(item.genero)})</small>
                </td>

                <td data-label="Idade">{item.idade}</td>

                <td data-label="Saldo">{formatMoney(item.saldo)}</td>

                <td data-label="Produtos">{item.numProdutos}</td>

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

                {/* PREVISÃO – padrão do index.css */}
                <td
                  data-label="Previsão"
                  className={`previsao-text ${risco.classe}`}
                >
                  <strong>
                    {risco.icon} {risco.label}
                  </strong>
                </td>

                {/* RISCO (%) */}
                <td data-label="Risco" className={risco.classe}>
                  <strong>{(item.probabilidade * 100).toFixed(1)}%</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
