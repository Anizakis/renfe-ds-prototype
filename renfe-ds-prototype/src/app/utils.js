// Utilidades comunes para el proceso de compra
export function formatPrice(value, { locale, currency } = {}) {
  const resolvedCurrency = currency ?? "EUR";
  if (value === null || value === undefined) return "—";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";

  const useIntl = Boolean(
    locale
    && typeof Intl !== "undefined"
    && typeof Intl.NumberFormat === "function"
  );

  if (useIntl) {
    const formattedNumber = new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric);
    const symbol = resolvedCurrency === "EUR" ? "€" : resolvedCurrency;
    return `${formattedNumber} ${symbol}`;
  }

  return `${numeric.toFixed(2)} €`;
}
