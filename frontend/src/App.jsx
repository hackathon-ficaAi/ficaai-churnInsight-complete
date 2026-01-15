import { useState } from "react";
import PredictForm from "./components/PredictForm";
import Historico from "./components/Historico";
import "./styles/buttons.css"; 
import "./styles/forms.css"; 

function App() {
  const [pagina, setPagina] = useState("form");

  const voltarAoFormulario = () => {
    setPagina("form");
  }

  return (
    <div className="container-wide" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* --- MENU DE NAVEGAÇÃO SUPERIOR --- */}
      <div className="actions" style={{ 
          marginBottom: "20px", 
          display: "flex", 
          gap: "10px", 
          width: "95%",  

          /* Se for histórico = 900px (Largo), Se for form = 500px (Compacto) */
          maxWidth: pagina === "historico" ? "1100px" : "500px",
          
          /* Adiciona uma animação suave ao mudar de tamanho */
          transition: "max-width 0.3s ease"
        }}>
        
        {/* Botão Previsão (Com flex: 1 para esticar) */}
        <button 
          onClick={() => setPagina("form")}
          className={`btn-tab ${pagina === "form" ? "active" : ""}`}
        >
          Previsão
        </button>

        {/* Botão Histórico (Com flex: 1 para esticar) */}
        <button
          onClick={() => setPagina("historico")}
          className={`btn-tab ${pagina === "historico" ? "active" : ""}`}
  >
          Histórico
        </button>

        {/* Botão Dashboard (Tamanho fixo, apenas o ícone) */}
        <a 
            href="https://ficaai.streamlit.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Ver Dashboard de Dados"
            className="btn-tab"
          >
            Dashboards
        </a>

      </div>

      {/* --- CONTEÚDO (Cartão Branco) --- */}
      {pagina === "form" && <PredictForm onVerHistorico={() => setPagina("historico")} />}
      {pagina === "historico" && <Historico voltarAoFormulario={voltarAoFormulario} />}

    </div>
  );
}

export default App;