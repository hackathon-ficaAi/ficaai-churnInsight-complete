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
    <div className="container anime-expand" style={{ maxWidth: "1100px" }}>
      
      {/* Cabeçalho Ajustado com Logo Nova e Estilo Arredondado */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
          justifyContent: "center"
        }}
      >
        <img
          src="./FicaAI_logo.png"
          alt="FicaAI Logo"
          style={{ 
            height: "60px", 
            width: "60px",
            borderRadius: "16px", // Mantendo identidade visual da Home
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
          }}
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