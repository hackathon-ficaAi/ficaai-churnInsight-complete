const historicoDiv = document.getElementById("historico");
const API_HISTORICO = "http://localhost:8080/api/historico";

async function carregarHistorico() {
    historicoDiv.innerHTML = "🔄 Carregando histórico...";

    try {
        const response = await fetch(API_HISTORICO);
        const lista = await response.json();

        if (!lista.length) {
            historicoDiv.innerHTML = "Nenhum registro encontrado.";
            return;
        }

        historicoDiv.innerHTML = gerarTabela(lista);

    } catch {
        historicoDiv.innerHTML = "❌ Erro ao carregar histórico.";
    }
}

function gerarTabela(lista) {
    return `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Plano</th>
                    <th>Atrasos</th>
                    <th>Uso</th>
                    <th>Previsão</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
                ${lista.map(item => `
                    <tr>
                        <td>${new Date(item.dataAnalise).toLocaleString("pt-BR")}</td>
                        <td>${capitalizar(item.plano)}</td>
                        <td>${item.atrasosPagamento}</td>
                        <td>${item.usoMensal}</td>
                        <td>${item.previsao}</td>
                        <td>${(item.probabilidade * 100).toFixed(2)}%</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}
function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}


carregarHistorico();
