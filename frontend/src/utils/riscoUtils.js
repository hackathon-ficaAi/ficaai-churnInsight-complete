export function getNivelRisco(probabilidade) {
  if (probabilidade >= 0.8) {
    return {
      label: "Alto Grau",
      classe: "risco-alto",
      icon: "🔴",
    };
  }

  if (probabilidade >= 0.6) {
    return {
      label: "Médio Grau",
      classe: "risco-medio",
      icon: "🟡",
    };
  }

  return {
    label: "Baixo Grau",
    classe: "risco-baixo",
    icon: "🟢",
  };
}
