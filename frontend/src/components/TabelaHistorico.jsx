import { useState, useMemo } from "react";
import { getNivelRisco } from "../utils/riscoUtils";
import "../styles/historico.css"; 

export default function TabelaHistorico({ listaHistorico }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  // Estado para controlar a ordenação
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  const ITENS_POR_PAGINA = 10;

  const traduzirPais = (paisOriginal) => {
    if (!paisOriginal) return "-";
    const chave = paisOriginal.trim().toLowerCase();
    const dicionario = {
      france: "França", frança: "França",
      spain: "Espanha", espanha: "Espanha",
      germany: "Alemanha", alemanha: "Alemanha",
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

  const formatarDataBR = (dataString) => {
    if (!dataString) return "-";
    let dataParaConverter = dataString;
    if (typeof dataString === "string" && !dataString.endsWith("Z")) {
      dataParaConverter += "Z";
    }
    const data = new Date(dataParaConverter);
    return data.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  };

  const MAX_EXIBICAO_TRILHOES = 10;
  const formatMoney = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    const abs = Math.abs(value);
    const LIMITE = MAX_EXIBICAO_TRILHOES * 1_000_000_000_000;

    if (abs > LIMITE) {
      return `> ${MAX_EXIBICAO_TRILHOES} tri`;
    }
    if (abs >= 1_000_000) {
      return new Intl.NumberFormat("pt-BR", {
        notation: "compact", compactDisplay: "short",
        style: "currency", currency: "EUR",
        maximumFractionDigits: 2,
      }).format(value);
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency", currency: "EUR",
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(value);
  };

  // --- LÓGICA DE ORDENAÇÃO ---
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig.key) return;
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // Cria a lista ordenada dinamicamente
  const historicoOrdenado = useMemo(() => {
    if (!listaHistorico) return [];
    let items = [...listaHistorico];

    if (sortConfig.key !== null) {
      items.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Tratamentos Especiais
        if (sortConfig.key === 'dataAnalise') {
            aValue = new Date(aValue || 0).getTime();
            bValue = new Date(bValue || 0).getTime();
        }
        else if (sortConfig.key === 'pais') {
            aValue = traduzirPais(aValue).toLowerCase();
            bValue = traduzirPais(bValue).toLowerCase();
        }
        else if (sortConfig.key === 'membroAtivo') {
             // Garante que booleanos ou 0/1 sejam comparáveis
             aValue = aValue ? 1 : 0;
             bValue = bValue ? 1 : 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Ordenação Padrão (Sem clique): Data Decrescente
      items.sort((a, b) => {
        const dataA = new Date(a.dataAnalise || 0);
        const dataB = new Date(b.dataAnalise || 0);
        return dataB - dataA;
      });
    }
    return items;
  }, [listaHistorico, sortConfig]);

  // --- LÓGICA DE PAGINAÇÃO ---
  const indexUltimoItem = paginaAtual * ITENS_POR_PAGINA;
  const indexPrimeiroItem = indexUltimoItem - ITENS_POR_PAGINA;
  const itensAtuais = historicoOrdenado.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(historicoOrdenado.length / ITENS_POR_PAGINA);

  const irParaPagina = (numero) => setPaginaAtual(numero);
  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  if (!listaHistorico || !listaHistorico.length) {
    return <p className="no-data">Nenhum histórico disponível.</p>;
  }

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="history-table">
          <thead>
            <tr>
              
              <th onClick={() => requestSort('dataAnalise')} className={getClassNamesFor('dataAnalise')}>
                Data/Hora <span className="sort-arrow"></span>
              </th>
              
              <th onClick={() => requestSort('pais')} className={getClassNamesFor('pais')}>
                Cliente (País/Gênero) <span className="sort-arrow"></span>
              </th>
              
              <th onClick={() => requestSort('idade')} className={getClassNamesFor('idade')}>
                Idade <span className="sort-arrow"></span>
              </th>
              
              <th onClick={() => requestSort('saldo')} className={getClassNamesFor('saldo')}>
                Saldo <span className="sort-arrow"></span>
              </th>
              
              <th onClick={() => requestSort('numProdutos')} className={getClassNamesFor('numProdutos')}>
                Prod. <span className="sort-arrow"></span>
              </th>
              
              <th onClick={() => requestSort('membroAtivo')} className={getClassNamesFor('membroAtivo')}>
                Ativo? <span className="sort-arrow"></span>
              </th>
              
              {/* Ambos 'Previsão' e 'Risco' ordenam pela probabilidade matemática */}
              <th onClick={() => requestSort('probabilidade')} className={getClassNamesFor('probabilidade')}>
                Previsão de Churn <span className="sort-arrow"></span>
              </th>
              
              <th onClick={() => requestSort('probabilidade')} className={getClassNamesFor('probabilidade')}>
                Risco <span className="sort-arrow"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {itensAtuais.map((item) => {
              const risco = getNivelRisco(item.probabilidade);
              return (
                <tr key={item.id} className={`card-${risco.classe}`}>
                  <td data-label="Data/Hora" className="data-hora">
                    {formatarDataBR(item.dataAnalise)}
                  </td>
                  <td data-label="Cliente">
                    {traduzirPais(item.pais)}{" "}
                    <small>({traduzirGenero(item.genero)})</small>
                  </td>
                  <td data-label="Idade">{item.idade}</td>
                  <td data-label="Saldo" className="valor-monetario" title={item.saldo?.toLocaleString("pt-BR")}>
                    {formatMoney(item.saldo)}
                  </td>
                  <td data-label="Produtos">{item.numProdutos}</td>
                  <td data-label="Ativo">
                    <span style={{ color: item.membroAtivo ? "green" : "gray", fontWeight: "bold" }}>
                      {item.membroAtivo ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td data-label="Previsão" className={`previsao-text ${risco.classe}`}>
                    <strong>{risco.icon} {risco.label}</strong>
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

      {/* --- RODAPÉ DE PAGINAÇÃO --- */}
      {totalPaginas > 1 && (
        <div className="paginacao-container">
          <button 
            onClick={paginaAnterior} 
            disabled={paginaAtual === 1}
            className="btn-paginacao"
          >
            Anterior
          </button>
          
          <span className="info-paginacao">
            Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
          </span>

          <button 
            onClick={proximaPagina} 
            disabled={paginaAtual === totalPaginas}
            className="btn-paginacao"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}