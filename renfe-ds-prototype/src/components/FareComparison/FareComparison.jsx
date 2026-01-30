import { useMemo, useRef, useState } from "react";
import "./FareComparison.css";
import Button from "../Button/Button.jsx";
import Modal from "../Modal/Modal.jsx";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden.jsx";

const COLUMN_ORDER = [
  { id: "basic", label: "Básico", key: "basic", className: "col-basic" },
  { id: "choose", label: "Elige", key: "elige", className: "col-elige" },
  { id: "choose-comfort", label: "Elige Confort", key: "comfort", className: "col-comfort" },
  { id: "premium", label: "Premium", key: "premium", className: "col-premium" },
];

const rows = [
  {
    id: "seatType",
    labelTitle: "Tipo de asiento",
    labelHelper: "Comodidad",
    values: {
      basic: { type: "text", text: "Estándar" },
      elige: { type: "text", text: "Estándar" },
      comfort: { type: "text", text: "XL Confort" },
      premium: { type: "text", text: "XL Confort" },
    },
  },
  {
    id: "changes",
    labelTitle: "Cambios",
    labelHelper: "Flexibilidad",
    values: {
      basic: { type: "text", text: "Con coste" },
      elige: { type: "text", text: "1º cambio gratis" },
      comfort: { type: "text", text: "1º cambio gratis" },
      premium: { type: "text", text: "Ilimitados" },
    },
  },
  {
    id: "refund",
    labelTitle: "Anulación / Reembolso",
    labelHelper: "Condición",
    values: {
      basic: { type: "excluded", text: "No" },
      elige: { type: "text", text: "70%" },
      comfort: { type: "text", text: "70%" },
      premium: { type: "text", text: "Hasta 100%" },
    },
  },
  {
    id: "seatSelection",
    labelTitle: "Selección de asiento",
    labelHelper: "Incluido",
    values: {
      basic: { type: "extra", text: "Extra: 5 €" },
      elige: { type: "extra", text: "Extra: 5 €" },
      comfort: { type: "extra", text: "Extra: 5 €" },
      premium: { type: "included", text: "Incluido" },
    },
  },
  {
    id: "lounge",
    labelTitle: "Acceso a Salas Club",
    labelHelper: "Servicios",
    values: {
      basic: { type: "excluded", text: "No incluido" },
      elige: { type: "excluded", text: "No incluido" },
      comfort: { type: "excluded", text: "No incluido" },
      premium: { type: "included", text: "Incluido" },
    },
  },
];

const iconByType = {
  included: { name: "check_circle", label: "Incluido", tone: "included" },
  excluded: { name: "cancel", label: "No incluido", tone: "excluded" },
  extra: { name: "add_circle", label: "Extra", tone: "extra" },
};

function buildConditionGroups(items) {
  const groups = {
    changes: { title: "Cambios y gestión", items: [] },
    refunds: { title: "Reembolsos y anulaciones", items: [] },
    pets: { title: "Mascotas", items: [] },
    services: { title: "Servicios", items: [] },
  };

  items.forEach((item) => {
    const lower = item.toLowerCase();
    if (lower.includes("cambio") || lower.includes("titular") || lower.includes("puente") || lower.includes("pack")) {
      groups.changes.items.push(item);
      return;
    }
    if (lower.includes("reembolso") || lower.includes("anulación") || lower.includes("reembolsable")) {
      groups.refunds.items.push(item);
      return;
    }
    if (lower.includes("mascota") || lower.includes("perro")) {
      groups.pets.items.push(item);
      return;
    }
    groups.services.items.push(item);
  });

  return Object.values(groups).filter((group) => group.items.length > 0);
}

export default function FareComparison({ fares, selectedFareId, onSelect }) {
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [activeFareId, setActiveFareId] = useState(null);
  const triggerRef = useRef(null);

  const handleOpenConditions = (fareId, event) => {
    triggerRef.current = event.currentTarget;
    setActiveFareId(fareId);
    setConditionsOpen(true);
  };

  const activeFare = fares.find((fare) => fare.id === activeFareId) ?? fares[0];
  const headlineItems = rows.map((row) => {
    const column = COLUMN_ORDER.find((item) => item.id === activeFare.id);
    const value = column ? row.values[column.key]?.text : "—";
    return `${row.labelTitle}: ${value}`;
  });
  const fullItems = activeFare?.features?.length ? activeFare.features : [];
  const groupedConditions = useMemo(
    () => buildConditionGroups([...headlineItems, ...fullItems]),
    [activeFare, headlineItems]
  );

  return (
    <div className="fareComparison">
      <div className="fareComparisonGrid" role="table" aria-label="Comparativa de tarifas">
        <div className="fareComparisonCell fareComparisonCell--corner" />
        {COLUMN_ORDER.map((column) => {
          const fare = fares.find((item) => item.id === column.id);
          if (!fare) return null;
          return (
            <div
              key={`${fare.id}-header`}
              className={`fareComparisonCell fareComparisonCell--header ${column.className}`}
            >
              <span className="fareComparisonAccent" aria-hidden="true" />
              <div className="fareComparisonHeaderStack">
                <span className="fareComparisonName">{fare.name}</span>
                <span className="fareComparisonPrice">+{fare.price.toFixed(2)} €</span>
                <span className="fareComparisonMicrocopy">Sobre el precio base</span>
              </div>
            </div>
          );
        })}

        {rows.map((row) => (
          <div key={row.id} className="fareComparisonRow">
            <div className="fareComparisonCell fareComparisonCell--label">
              <span className="fareComparisonLabel">{row.labelTitle}</span>
              <span className="fareComparisonHelper">{row.labelHelper}</span>
            </div>
            {COLUMN_ORDER.map((column) => {
              const value = row.values[column.key];
              const icon = value?.type ? iconByType[value.type] : null;
              const isSelected = column.id === selectedFareId;
              return (
                <div
                  key={`${row.id}-${column.key}`}
                  className={`fareComparisonCell fareComparisonCell--value ${column.className}${isSelected ? " is-selected" : ""}`}
                >
                  {icon && (
                    <span className={`fareComparisonIcon fareComparisonIcon--${icon.tone}`} aria-hidden="true">
                      {icon.name}
                    </span>
                  )}
                  {icon && <VisuallyHidden>{icon.label}</VisuallyHidden>}
                  <span>{value?.text ?? "—"}</span>
                </div>
              );
            })}
          </div>
        ))}

        <div className="fareComparisonCell fareComparisonCell--cta-spacer" />
        {COLUMN_ORDER.map((column) => {
          const fare = fares.find((item) => item.id === column.id);
          if (!fare) return null;
          const isSelected = fare.id === selectedFareId;
          return (
            <div
              key={`${fare.id}-cta`}
              className={`fareComparisonCell fareComparisonCell--cta ${column.className}${isSelected ? " is-selected" : ""}`}
            >
              <Button
                size="s"
                variant={isSelected ? "primary" : "secondary"}
                aria-pressed={isSelected ? "true" : "false"}
                onClick={() => onSelect(fare.id)}
              >
                {isSelected ? "Seleccionada" : "Elegir tarifa"}
              </Button>
              <button
                type="button"
                className="fareComparisonLink"
                onClick={(event) => handleOpenConditions(fare.id, event)}
              >
                Ver condiciones
              </button>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={conditionsOpen}
        onClose={() => setConditionsOpen(false)}
        titleId="fare-conditions-title"
        descriptionId="fare-conditions-description"
        triggerRef={triggerRef}
      >
        <h2 id="fare-conditions-title" className="fareComparisonModalTitle">
          {activeFare?.name} · +{activeFare?.price?.toFixed(2) ?? "0.00"} €
        </h2>
        <p id="fare-conditions-description" className="fareComparisonModalSubtitle">
          Condiciones completas de la tarifa seleccionada.
        </p>
        <div className="fareComparisonModalGroups">
          {groupedConditions.map((group) => (
            <div key={group.title} className="fareComparisonModalGroup">
              <h3 className="fareComparisonModalGroupTitle">{group.title}</h3>
              <ul className="fareComparisonModalList">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="fareComparisonModalActions">
          <Button variant="primary" onClick={() => setConditionsOpen(false)}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
