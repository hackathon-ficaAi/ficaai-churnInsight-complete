import { useState } from "react";
import PredictForm from "./components/PredictForm";
import Historico from "./components/Historico";
import "./styles/buttons.css"; 
// Importamos o forms.css para garantir que o layout base (container) seja respeitado se necessário
import "./styles/forms.css"; 

function App() {
  const [pagina, setPagina] = useState("form");

  const voltarAoFormulario = () => {
    setPagina("form");
  }

  return (
    <div className="container-wide" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* --- MENU DE NAVEGAÇÃO SUPERIOR --- */}
      {/* AJUSTE AQUI: Largura igual ao container branco (95% e max 500px) */}
      <div className="actions" style={{ 
          marginBottom: "20px", 
          display: "flex", 
          gap: "10px", 
          width: "95%", 
          maxWidth: "500px" 
        }}>
        
        {/* Botão Previsão (Com flex: 1 para esticar) */}
        <button 
          onClick={() => setPagina("form")}
          className={pagina === "form" ? "" : "btn-neutral"}
          style={{ flex: 1 }} 
        >
          Previsão
        </button>

        {/* Botão Histórico (Com flex: 1 para esticar) */}
        <button
          className={pagina === "historico" ? "" : "btn-neutral"}
          onClick={() => setPagina("historico")}
          style={{ flex: 1 }}
        >
          Histórico
        </button>

        {/* Botão Dashboard (Tamanho fixo, apenas o ícone) */}
        <a 
            href="https://ficaai.streamlit.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Ver Dashboard de Dados"
            className="btn-dashboard"
          >
            📊
        </a>

      </div>

      {/* --- CONTEÚDO (Cartão Branco) --- */}
      {pagina === "form" && <PredictForm onVerHistorico={() => setPagina("historico")} />}
      {pagina === "historico" && <Historico voltarAoFormulario={voltarAoFormulario} />}

    </div>
  );
}

export default App;