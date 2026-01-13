export function getNivelRisco(probabilidade) {
  if (probabilidade >= 0.8) {
    return {
      label: "Alto Risco",
      classe: "risco-alto",
      icon: "🔴",
    };
  }

  if (probabilidade >= 0.6) {
    return {
      label: "Médio Risco",
      classe: "risco-medio",
      icon: "🟡",
    };
  }

  return {
    label: "Baixo Risco",
    classe: "risco-baixo",
    icon: "🟢",
  };
}
