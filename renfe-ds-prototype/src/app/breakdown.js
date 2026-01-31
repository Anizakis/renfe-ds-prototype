// Utilidad para generar breakdownItems en el resumen de compra
export function getBreakdownItems({ t, baseTotal, farePrice, extrasTotal, passengersTotal }) {
  return [
    { label: t("summary.baseFare"), value: formatPrice(baseTotal) },
    { label: t("summary.fare"), value: formatPrice(farePrice) },
    { label: t("summary.extras"), value: formatPrice(extrasTotal) },
    { label: t("summary.passengers"), value: `x${passengersTotal}` },
  ];
}
import { formatPrice } from "./utils.js";
