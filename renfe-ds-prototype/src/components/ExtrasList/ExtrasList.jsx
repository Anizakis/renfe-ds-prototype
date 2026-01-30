import "./ExtrasList.css";
import Checkbox from "../Checkbox/Checkbox.jsx";
import Icon from "../../ui/Icon/Icon.jsx";

// Helper for price formatting
function formatPrice(price) {
  return price === 0 ? "GRATIS" : price.toFixed(2).replace(".", ",") + " €";
}

export default function ExtrasList({ extras, selectedExtras, onToggle }) {
  return (
    <div className="extras-grid">
      {extras.map((extra) => {
        const checked = !!selectedExtras[extra.id];
        return (
          <div
            key={extra.id}
            className={[
              "extras-card",
              checked ? "extras-card--selected" : "",
            ].join(" ")}
            tabIndex={-1}
            aria-checked={checked}
            role="group"
          >
            <div className="extras-card__header">
              <div className="extras-card__icon-title">
                <Icon name={extra.iconName} className="extras-card__icon" aria-hidden="true" />
                <span className="extras-card__title">{extra.name}</span>
              </div>
              <div className="extras-card__meta">
                <span className="extras-card__per">Por viajero</span>
                <span className={"extras-card__price" + (extra.price === 0 ? " extras-card__price--free" : "")}>
                  {formatPrice(extra.price)}
                </span>
                <Checkbox
                  checked={checked}
                  onChange={() => onToggle(extra.id)}
                  aria-label={checked ? `Quitar ${extra.name}` : `Añadir ${extra.name}`}
                  className="extras-card__checkbox"
                />
              </div>
            </div>
            <div className="extras-card__desc" title={extra.description}>
              {extra.description}
            </div>
            <div className="extras-card__action">
              {checked ? (
                <span className="extras-card__added" aria-live="polite">Añadido</span>
              ) : (
                <button
                  type="button"
                  className="extras-card__add-btn"
                  onClick={() => onToggle(extra.id)}
                  tabIndex={0}
                >
                  +Añadir
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
