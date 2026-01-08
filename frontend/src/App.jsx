import { useState } from "react";
import PredictForm from "./components/PredictForm";
import Historico from "./components/Historico";

function App() {
  const [pagina, setPagina] = useState("form");

  const voltarAoFormulario = () => {
    setPagina("form");
  }

  return (
    <div>
      <div className="actions" style={{ marginBottom: "20px" }}>
        <button onClick={() => setPagina("form")}>Previsão</button>
        <button
          className="secondary"
          onClick={() => setPagina("historico")}
        >
          Histórico
        </button>
      </div>

      {pagina === "form" && <PredictForm onVerHistorico={() => setPagina("historico")} />}
      {pagina === "historico" && <Historico voltarAoFormulario={voltarAoFormulario} />}

    </div>
  );
}

export default App;
