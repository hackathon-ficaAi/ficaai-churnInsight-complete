export const formatMoney = (value, currency = "EUR") => {
  if (value == null || isNaN(value)) return "-";

  const abs = Math.abs(value);

  if (abs > 10_000_000_000_000) return "> 10 tri";

  if (abs >= 1_000_000) {
    return new Intl.NumberFormat("pt-BR", {
      notation: "compact",
      compactDisplay: "short",
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
