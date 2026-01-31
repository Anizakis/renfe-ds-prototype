import "./ExtrasList.css";
import Icon from "../../ui/Icon/Icon.jsx";
import { useState } from "react";
import ExtraDetailModal from "./ExtraDetailModal.jsx";
import { useTravel } from "../../app/store.jsx";

// Helper for price formatting
function formatPrice(price) {
  return price === 0 ? "GRATIS" : price.toFixed(2).replace(".", ",") + " €";
}

export default function ExtrasList({ extras, selectedExtras, onToggle }) {
  const [modalExtra, setModalExtra] = useState(null);
  const [modalSelection, setModalSelection] = useState(null); // { ida: [...], vuelta: [...] }
  const MODAL_IDS = ["restauracion", "mascotas"];
  const handleAddClick = (extra) => {
    if (MODAL_IDS.includes(extra.id)) {
      setModalExtra(extra);
      setModalSelection(null); // reset selección al abrir
    } else {
      onToggle(extra.id);
    }
  };
  const handleRemove = (extra) => {
    onToggle(extra.id);
  };
  const handleModalAdd = (extra, ida, vuelta) => {
    onToggle(extra.id);
    setModalExtra(null);
    setModalSelection(null);
  };
  const { state } = useTravel();
  return (
    <>
      <div className="extras-grid">
        {extras.map((extra) => {
          const checked = !!selectedExtras[extra.id];
          return (
            <div
              key={extra.id}
              className={["extras-card", checked ? "extras-card--selected" : ""].join(" ")}
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
                </div>
              </div>
              <div className="extras-card__desc" title={extra.description}>
                {extra.description}
              </div>
              <div className="extras-card__action">
                {checked ? (
                  <span className="extras-card__added" aria-live="polite">
                    Añadido
                    <button
                      type="button"
                      className="extras-card__remove-btn"
                      aria-label={`Eliminar ${extra.name}`}
                      onClick={() => handleRemove(extra)}
                    >
                      <Icon name="close" />
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="extras-card__add-btn"
                    onClick={() => handleAddClick(extra)}
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
      <ExtraDetailModal
        isOpen={!!modalExtra}
        onClose={() => { setModalExtra(null); setModalSelection(null); }}
        extra={modalExtra}
        tripType={state.search?.tripType}
        passengers={state.search?.passengers || { adults: 1, children: 0, infants: 0 }}
        onAdd={handleModalAdd}
      />
    </>
  );
}
