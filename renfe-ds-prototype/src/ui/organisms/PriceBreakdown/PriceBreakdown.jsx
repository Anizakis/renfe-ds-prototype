import { useEffect, useState } from "react";
import VisuallyHidden from "../../atoms/VisuallyHidden/VisuallyHidden.jsx";
import Icon from "../../atoms/Icon/Icon.jsx";
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
          <li key={item.key ?? item.label} className="price-breakdown__row">
            {item.icon && (
              <span className="price-breakdown__icon">
                <Icon name={item.icon} size="sm" decorative />
              </span>
            )}
            <div className="price-breakdown__content">
              <span className="price-breakdown__label">{item.label}</span>
              {item.value ? (
                <span className="price-breakdown__value">{item.value}</span>
              ) : null}
              {item.description ? (
                <span className="price-breakdown__description">{item.description}</span>
              ) : null}
            </div>
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
