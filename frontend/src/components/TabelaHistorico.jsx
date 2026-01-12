import { getNivelRisco } from "../utils/riscoUtils";

export default function TabelaHistorico({ listaHistorico }) {
  const traduzirPais = (paisOriginal) => {
    if (!paisOriginal) return "-";

    const chave = paisOriginal.trim().toLowerCase();

    const dicionario = {
      france: "França",
      frança: "França",
      spain: "Espanha",
      espanha: "Espanha",
      germany: "Alemanha",
      alemanha: "Alemanha",
    };

    return dicionario[chave] || paisOriginal;
  };

  const traduzirGenero = (generoOriginal) => {
    if (!generoOriginal) return "";
    const chave = generoOriginal.trim().toLowerCase();

    if (chave === "male" || chave === "masculino") return "M";
    if (chave === "female" || chave === "feminino") return "F";
    return "?";
  };

  // --- CORREÇÃO DE HORA AQUI ---
  const formatarDataBR = (dataString) => {
    if (!dataString) return "-";
    
    // TRUQUE: Se a string vier sem "Z", adicionamos na força bruta.
    // Isso avisa o navegador: "Ei, essa data é UTC (Londres), converta para Brasil!"
    let dataParaConverter = dataString;
    if (typeof dataString === 'string' && !dataString.endsWith('Z')) {
        dataParaConverter += 'Z';
    }

    const data = new Date(dataParaConverter);

    return data.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
  };

  if (!listaHistorico || !listaHistorico.length) {
    return <p className="no-data">Nenhum histórico disponível.</p>;
  }

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "EUR",
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
                {/* APLICA A FORMATAÇÃO CORRIGIDA */}
                <td data-label="Data/Hora" className="data-hora">
                  {formatarDataBR(item.dataAnalise)}
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

                <td
                  data-label="Previsão"
                  className={`previsao-text ${risco.classe}`}
                >
                  <strong>
                    {risco.icon} {risco.label}
                  </strong>
                </td>

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