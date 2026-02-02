import { useEffect, useState } from "react";
import VisuallyHidden from "../../atoms/VisuallyHidden/VisuallyHidden.jsx";
import "./PriceBreakdown.css";
import { formatPrice } from "../../../app/utils.js";

export default function PriceBreakdown({ title, items, total, totalLabel = "Total" }) {
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    setLiveMessage(`${title}: ${formatPrice(total)}`);
  }, [title, total]);

  return (
    <section className="price-breakdown" aria-live="polite" aria-atomic="true">
      <div className="price-breakdown__header">
        <h2 className="price-breakdown__title">{title}</h2>
      </div>
      <ul className="price-breakdown__list">
        {items.map((item) => (
          <li key={item.label} className="price-breakdown__row">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </li>
        ))}
      </ul>
      <div className="price-breakdown__total">
        <span>{totalLabel}</span>
        <span>{formatPrice(total)}</span>
      </div>
      <VisuallyHidden>{liveMessage}</VisuallyHidden>
    </section>
  );
}
