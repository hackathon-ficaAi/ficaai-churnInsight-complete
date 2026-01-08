import { useState } from "react";
import { predictChurn } from "../services/api";
import Resultado from "./Resultado";

export default function PredictForm(onVerHistorico) {
  const [formData, setFormData] = useState({
    pais: "", // Valor padrão
    genero: "", // Valor padrão
    idade: "",
    num_produtos: "1",
    membro_ativo: true, // Boolean (Checkbox)
    saldo: "",
    salario_estimado: "",
  });

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Manipula mudanças nos inputs (Texto, Número e Checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      // Monta o payload exatamente como o Java DTO espera
      // Nota: O Java vai filtrar o que manda pro Python, mas precisa receber no DTO
      const payload = {
        pais: formData.pais,
        genero: formData.genero,
        idade: Number(formData.idade),
        num_produtos: Number(formData.num_produtos),
        membro_ativo: formData.membro_ativo, // Envia true/false
        saldo: Number(formData.saldo),
        salario_estimado: Number(formData.salario_estimado),

        // Campos removidos (credit_score, tenure, cartao) NÃO são enviados.
      };

      const response = await predictChurn(payload);
      setResultado(response);
    } catch (err) {
      console.error(err);
      setErro(
        "Erro ao conectar com o backend. Verifique se o Docker está rodando."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Cabeçalho */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <img
          src="public/FicaAI_logo.png"
          alt="FicaAI_Logo"
          style={{ height: "50px" }}
        />
        <h1 style={{ margin: 0 }}>Previsão de Churn Bancário</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* --- DADOS DEMOGRÁFICOS --- */}
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>País</label>
            <select name="pais" value={formData.pais} onChange={handleChange} required>
            <option value="" disabled hidden>Selecionar</option>
              <option value="frança">França (France)</option>
              <option value="espanha">Espanha (Spain)</option>
              <option value="alemanha">Alemanha (Germany)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Gênero</label>
            <select name="genero" value={formData.genero} onChange={handleChange} required>
              <option value="" disabled hidden>Selecionar</option>
              <option value="masculino">Masculino (Male)</option>
              <option value="feminino">Feminino (Female)</option>
            </select>
          </div>
        </div>

        <label htmlFor="idade">Idade</label>
        <input
          id="idade"
          type="number"
          name="idade"
          value={formData.idade}
          onChange={handleChange}
          placeholder="Ex: 35"
          min="18"
          required
        />

        {/* --- DADOS FINANCEIROS --- */}
        <label htmlFor="saldo">Saldo em Conta (€)</label>
        <input
          id="saldo"
          type="number"
          name="saldo"
          value={formData.saldo}
          onChange={handleChange}
          placeholder="Ex: 85000.50"
          step="0.01"
          required
        />

        <label htmlFor="salario_estimado">Salário Estimado (€)</label>
        <input
          id="salario_estimado"
          type="number"
          name="salario_estimado"
          value={formData.salario_estimado}
          onChange={handleChange}
          placeholder="Ex: 60000.00"
          step="0.01"
          required
        />

        <label htmlFor="num_produtos">Número de Produtos</label>
        <input
          id="num_produtos"
          type="number"
          name="num_produtos"
          value={formData.num_produtos}
          onChange={handleChange}
          placeholder="Ex: 1 ou 2"
          min="1"
          max="4"
          required
        />

        {/* --- CHECKBOX --- */}
        <div
          style={{
            margin: "15px 0",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            type="checkbox"
            id="membro_ativo"
            name="membro_ativo"
            checked={formData.membro_ativo}
            onChange={handleChange}
            style={{ width: "20px", height: "20px" }}
          />
          <label
            htmlFor="membro_ativo"
            style={{ margin: 0, cursor: "pointer" }}
          >
            Cliente é um Membro Ativo?
          </label>
        </div>

        {/* --- AÇÕES --- */}
        <div
          className="actions"
          style={{ marginTop: "20px", display: "flex", gap: "10px" }}
        >
          <button type="submit" disabled={loading}>
            {loading ? "Processando..." : "Prever Churn"}
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() =>
              setFormData({
                pais: "",
                genero: "",
                idade: "",
                num_produtos: "1",
                membro_ativo: true,
                saldo: "",
                salario_estimado: "",
              })
            }
          >
            Limpar
          </button>
        </div>
      </form>

      {erro && <div className="error">{erro}</div>}
      <Resultado resultado={resultado} />
    </div>
  );
}
