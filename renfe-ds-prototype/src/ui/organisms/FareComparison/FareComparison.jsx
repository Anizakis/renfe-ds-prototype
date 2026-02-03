import { useRef, useState } from "react";
import "./FareComparison.css";
import Button from "../../atoms/Button/Button.jsx";
import Modal from "../../molecules/Modal/Modal.jsx";
import VisuallyHidden from "../../../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import { formatPrice } from "../../../app/utils.js";

const getColumnOrder = (t) => [
  { id: "basic", label: t("fares.comparison.columns.basic"), key: "basic", className: "col-basic" },
  { id: "choose", label: t("fares.comparison.columns.choose"), key: "elige", className: "col-elige" },
  { id: "choose-comfort", label: t("fares.comparison.columns.comfort"), key: "comfort", className: "col-comfort" },
  { id: "premium", label: t("fares.comparison.columns.premium"), key: "premium", className: "col-premium" },
];

const getRows = (t) => [
  {
    id: "seatType",
    labelTitle: t("fares.comparison.rows.seatType.title"),
    labelHelper: t("fares.comparison.rows.seatType.helper"),
    values: {
      basic: { text: t("fares.comparison.values.standard"), icon: "seat-standard" },
      elige: { text: t("fares.comparison.values.standard"), icon: "seat-standard" },
      comfort: { text: t("fares.comparison.values.xlComfort"), icon: "seat-xl" },
      premium: { text: t("fares.comparison.values.xlComfort"), icon: "seat-xl" },
    },
  },
  {
    id: "changes",
    labelTitle: t("fares.comparison.rows.changes.title"),
    labelHelper: t("fares.comparison.rows.changes.helper"),
    values: {
      basic: { text: t("fares.comparison.values.extra10"), icon: "check" },
      elige: { text: t("fares.comparison.values.firstChangeFree"), icon: "check" },
      comfort: { text: t("fares.comparison.values.firstChangeFree"), icon: "check" },
      premium: { text: t("fares.comparison.values.unlimitedChanges"), icon: "check" },
    },
  },
  {
    id: "refund",
    labelTitle: t("fares.comparison.rows.refund.title"),
    labelHelper: t("fares.comparison.rows.refund.helper"),
    values: {
      basic: { text: t("fares.comparison.values.noIncluded"), icon: "close" },
      elige: { text: t("fares.comparison.values.refund70"), icon: "check" },
      comfort: { text: t("fares.comparison.values.refund70"), icon: "check" },
      premium: { text: t("fares.comparison.values.refund100"), icon: "check" },
    },
  },
  {
    id: "seatSelection",
    labelTitle: t("fares.comparison.rows.seatSelection.title"),
    labelHelper: t("fares.comparison.rows.seatSelection.helper"),
    values: {
      basic: { text: t("fares.comparison.values.extra5"), icon: "check" },
      elige: { text: t("fares.comparison.values.extra5"), icon: "check" },
      comfort: { text: t("fares.comparison.values.extra5"), icon: "check" },
      premium: { text: t("fares.comparison.values.included"), icon: "check" },
    },
  },
  {
    id: "lounge",
    labelTitle: t("fares.comparison.rows.lounge.title"),
    labelHelper: t("fares.comparison.rows.lounge.helper"),
    values: {
      basic: { text: t("fares.comparison.values.noIncluded"), icon: "close" },
      elige: { text: t("fares.comparison.values.noIncluded"), icon: "close" },
      comfort: { text: t("fares.comparison.values.noIncluded"), icon: "close" },
      premium: { text: t("fares.comparison.values.included"), icon: "check" },
    },
  },
];

function buildConditionGroups(items, t) {
  const groups = {
    changes: { title: t("fares.comparison.groups.changes"), items: [] },
    refunds: { title: t("fares.comparison.groups.refunds"), items: [] },
    pets: { title: t("fares.comparison.groups.pets"), items: [] },
    services: { title: t("fares.comparison.groups.services"), items: [] },
  };

  items.forEach((item) => {
    const lower = item.toLowerCase();
    if (lower.includes("cambio") || lower.includes("change") || lower.includes("titular") || lower.includes("name") || lower.includes("puente") || lower.includes("pack")) {
      groups.changes.items.push(item);
      return;
    }
    if (lower.includes("reembolso") || lower.includes("anulación") || lower.includes("reembolsable") || lower.includes("refund") || lower.includes("cancel")) {
      groups.refunds.items.push(item);
      return;
    }
    if (lower.includes("mascota") || lower.includes("pet") || lower.includes("perro") || lower.includes("dog")) {
      groups.pets.items.push(item);
      return;
    }
    groups.services.items.push(item);
  });

  return Object.values(groups).filter((group) => group.items.length > 0);
}

export default function FareComparison({ fares, selectedFareId, onSelect }) {
  const { t } = useI18n();
  const COLUMN_ORDER = getColumnOrder(t);
  const rows = getRows(t);
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [activeFareId, setActiveFareId] = useState(null);
  const triggerRef = useRef(null);

  const handleOpenConditions = (fareId, event) => {
    triggerRef.current = event.currentTarget;
    setActiveFareId(fareId);
    setConditionsOpen(true);
  };

  const activeFare = fares.find((fare) => fare.id === activeFareId) ?? fares[0];
  const getFareName = (fare) => (fare?.nameKey ? t(fare.nameKey) : fare?.name ?? "");
  const getFareFeatures = (fare) => (fare?.featureKeys ? fare.featureKeys.map((key) => t(key)) : fare?.features ?? []);
  const headlineItems = rows.map((row) => {
    const column = COLUMN_ORDER.find((item) => item.id === activeFare.id);
    const value = column ? row.values[column.key]?.text : "—";
    return `${row.labelTitle}: ${value}`;
  });
  const fullItems = getFareFeatures(activeFare);
  const groupedConditions = buildConditionGroups([...headlineItems, ...fullItems], t);

  return (
    <section className="fareComparisonSection">
      <div className="fareComparisonCard">
        <div className="fareComparisonGrid" role="table" aria-label={t("fares.comparison.tableLabel")}>
          <div className="fareComparisonCell fareComparisonCell--corner" />
        {COLUMN_ORDER.map((column) => {
          const fare = fares.find((item) => item.id === column.id);
          if (!fare) return null;
          const isSelected = fare.id === selectedFareId;
          return (
            <div
              key={`${fare.id}-header`}
              className={`fareComparisonCell fareComparisonCell--header fareComparisonCell--column-top ${column.className}${isSelected ? " is-selected" : ""}`}
            >
              <div className="fareComparisonHeaderStack">
                <span className={`fareComparisonName fareComparisonName--${column.className.replace('col-','')}`}>{getFareName(fare)}</span>
                <span className="fareComparisonPrice">+{formatPrice(fare.price)}</span>
                <span className="fareComparisonMicrocopy">{t("fares.comparison.basePriceNote")}</span>
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
              // Lógica explícita por celda: usa value.icon si existe
              let showTick = value?.icon === 'check';
              let showCross = value?.icon === 'close';
              let showSeatStandard = value?.icon === 'seat-standard';
              let showSeatXL = value?.icon === 'seat-xl';
              const isSelected = column.id === selectedFareId;
              return (
                <div
                  key={`${row.id}-${column.key}`}
                  className={`fareComparisonCell fareComparisonCell--value ${column.className}${isSelected ? " is-selected" : ""}`}
                >
                  {showTick && (
                    <span className="fareComparisonIcon fareComparisonIcon--included" aria-hidden="true">check</span>
                  )}
                  {showTick && <VisuallyHidden>{t("fares.comparison.included")}</VisuallyHidden>}
                  {showCross && (
                    <span className="fareComparisonIcon fareComparisonIcon--excluded" aria-hidden="true">close</span>
                  )}
                  {showCross && <VisuallyHidden>{t("fares.comparison.excluded")}</VisuallyHidden>}
                  {showSeatStandard && (
                    <span className="fareComparisonIcon fareComparisonIcon--seat" aria-hidden="true">event_seat</span>
                  )}
                  {showSeatStandard && <VisuallyHidden>{t("fares.comparison.seatStandard")}</VisuallyHidden>}
                  {showSeatXL && (
                    <span className="fareComparisonIcon fareComparisonIcon--seat" aria-hidden="true">weekend</span>
                  )}
                  {showSeatXL && <VisuallyHidden>{t("fares.comparison.seatComfort")}</VisuallyHidden>}
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
              className={`fareComparisonCell fareComparisonCell--cta fareComparisonCell--column-bottom ${column.className}${isSelected ? " is-selected" : ""}`}
            >
              <Button
                size="s"
                variant={isSelected ? "primary" : "secondary"}
                aria-pressed={isSelected ? "true" : "false"}
                onClick={() => onSelect(fare.id)}
              >
                {isSelected ? t("fares.comparison.selected") : t("fares.comparison.select")}
              </Button>
              <button
                type="button"
                className="fareComparisonLink"
                onClick={(event) => handleOpenConditions(fare.id, event)}
              >
                {t("fares.comparison.viewConditions")}
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
            {getFareName(activeFare)} · +{formatPrice(activeFare?.price ?? 0)}
          </h2>
          <p id="fare-conditions-description" className="fareComparisonModalSubtitle">
            {t("fares.comparison.modalSubtitle")}
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
              {t("fares.comparison.close")}
            </Button>
          </div>
        </Modal>
      </div>
    </section>
  );
}
