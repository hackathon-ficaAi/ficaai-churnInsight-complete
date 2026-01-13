import { useEffect, useState } from "react";
import { getHistorico } from "../services/api";
import TabelaHistorico from "./TabelaHistorico";

export default function Historico({ voltarAoFormulario }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getHistorico();
        setLista(dados);
      } catch {
        setErro("Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  return (
    /* --- ALTERAÇÃO AQUI: style={{ maxWidth: "900px" }} --- */
    /* Isso força o quadrado branco a ficar largo o suficiente para a tabela */
    <div className="container" style={{ maxWidth: "1100px" }}>
      
      {/* Logo e título */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          justifyContent: "center" /* Centraliza logo e título */
        }}
      >
        <img
          src="./FicaAI_logo.png"
          alt="FicaAI_Logo"
          style={{ height: "50px" }}
        />
        <h1 className="historico-title" style={{ margin: 0 }}>
          Histórico de Análises
        </h1>
      </div>

      {loading && <p>🔄 Carregando...</p>}
      {erro && <p className="error">{erro}</p>}
      {!loading && !erro && <TabelaHistorico listaHistorico={lista} />}

      <div style={{ marginTop: "20px" }}>
        <button onClick={voltarAoFormulario}>Voltar</button>
      </div>
    </div>
  );
}
