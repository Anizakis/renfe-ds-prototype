import { useMemo, useState, useRef, useEffect } from "react";
import Button from "../../ui/atoms/Button/Button.jsx";
import Icon from "../../ui/Icon/Icon.jsx";
import { useI18n } from "../../app/i18n.jsx";
import "./PassengerSelector.css";

function normalizePassengers(value) {
  if (!value) return { adults: 1, children: 0, infants: 0 };
  if (typeof value === "number") {
    return { adults: Math.max(1, value), children: 0, infants: 0 };
  }
  return {
    adults: Math.max(1, Number(value.adults ?? 1)),
    children: Math.max(0, Number(value.children ?? 0)),
    infants: Math.max(0, Number(value.infants ?? 0)),
  };
}

export default function PassengerSelector({ value, onChange, label }) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(() => normalizePassengers(value));
  const passengers = useMemo(() => normalizePassengers(value), [value]);
  const headerLabel = label ?? t("home.passengers");
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const summaryLabel = totalPassengers === 1
    ? `${passengers.adults} ${t("home.adults")}`
    : `${totalPassengers} ${t("home.passengers")}`;

  // Ref para el panel
  const panelRef = useRef(null);

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const updateDraft = (key, delta, min = 0) => {
    setDraft((prev) => {
      const next = { ...prev, [key]: Math.max(min, prev[key] + delta) };
      return next;
    });
  };

  const openPanel = () => {
    setDraft(normalizePassengers(value));
    setIsOpen(true);
  };

  const applyDraft = () => {
    onChange?.(draft);
    setIsOpen(false);
  };

  return (
    <div className="passenger-selector">
      <div className="passenger-selector__header">
        <span className="passenger-selector__label">{headerLabel}</span>
      </div>
      <button
        type="button"
        className="passenger-selector__trigger"
        onClick={() => (isOpen ? setIsOpen(false) : openPanel())}
        aria-expanded={isOpen ? "true" : "false"}
      >
        <span className="passenger-selector__value">{summaryLabel}</span>
      </button>
      {isOpen && (
        <div
          className={`passenger-selector__panel ${isOpen ? "is-open" : ""}`}
          role="dialog"
          aria-label={t("home.passengers")}
          ref={panelRef}
        >
          <div className="passenger-selector__row">
            <div className="passenger-selector__row-label">
              <span>{t("home.passengersAdults")}</span>
              <span className="passenger-selector__row-help">{t("home.passengersAdultsHelp")}</span>
            </div>
            <div className="passenger-selector__controls">
              <Button
                variant="tertiary"
                size="s"
                disabled={draft.adults <= 1}
                className="passenger-selector__stepper-btn"
                onClick={() => updateDraft("adults", -1, 1)}
              >
                <Icon name="remove" size="sm" decorative />
              </Button>
              <span className="passenger-selector__count">{draft.adults}</span>
              <Button
                variant="tertiary"
                size="s"
                className="passenger-selector__stepper-btn"
                onClick={() => updateDraft("adults", 1, 1)}
              >
                <Icon name="add" size="sm" decorative />
              </Button>
            </div>
          </div>
          <div className="passenger-selector__row">
            <div className="passenger-selector__row-label">
              <span>{t("home.passengersChildren")}</span>
              <span className="passenger-selector__row-help">{t("home.passengersChildrenHelp")}</span>
            </div>
            <div className="passenger-selector__controls">
              <Button
                variant="tertiary"
                size="s"
                disabled={draft.children <= 0}
                className="passenger-selector__stepper-btn"
                onClick={() => updateDraft("children", -1, 0)}
              >
                <Icon name="remove" size="sm" decorative />
              </Button>
              <span className="passenger-selector__count">{draft.children}</span>
              <Button
                variant="tertiary"
                size="s"
                className="passenger-selector__stepper-btn"
                onClick={() => updateDraft("children", 1, 0)}
              >
                <Icon name="add" size="sm" decorative />
              </Button>
            </div>
          </div>
          <div className="passenger-selector__row">
            <div className="passenger-selector__row-label">
              <span>{t("home.passengersInfants")}</span>
              <span className="passenger-selector__row-help">{t("home.passengersInfantsHelp")}</span>
            </div>
            <div className="passenger-selector__controls">
              <Button
                variant="tertiary"
                size="s"
                disabled={draft.infants <= 0}
                className="passenger-selector__stepper-btn"
                onClick={() => updateDraft("infants", -1, 0)}
              >
                <Icon name="remove" size="sm" decorative />
              </Button>
              <span className="passenger-selector__count">{draft.infants}</span>
              <Button
                variant="tertiary"
                size="s"
                className="passenger-selector__stepper-btn"
                onClick={() => updateDraft("infants", 1, 0)}
              >
                <Icon name="add" size="sm" decorative />
              </Button>
            </div>
          </div>
          <div className="passenger-selector__actions">
            <Button variant="tertiary" size="s" onClick={() => setIsOpen(false)}>
              {t("home.passengersCancel")}
            </Button>
            <Button variant="primary" size="s" onClick={applyDraft}>
              {t("home.passengersApply")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
