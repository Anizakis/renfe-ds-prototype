import { useState } from "react";
import Button from "../Button/Button.jsx";
import Icon from "../../ui/Icon/Icon.jsx";
import { useI18n } from "../../app/i18n.jsx";
import "./PassengerSelector.css";

export default function PassengerSelector({ value, onChange, label }) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const passengers = value ?? 1;
  const headerLabel = label ?? t("home.passengers");

  return (
    <div className="passenger-selector">
      <div className="passenger-selector__header">
        <span className="passenger-selector__label">{headerLabel}</span>
      </div>
      <button
        type="button"
        className="passenger-selector__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen ? "true" : "false"}
      >
        <span className="passenger-selector__value">{passengers} {t("home.adults")}</span>
      </button>
      {isOpen && (
        <div className="passenger-selector__panel" role="dialog" aria-label={t("home.passengers")}>
          <div className="passenger-selector__row">
            <span>{t("home.adults")}</span>
            <div className="passenger-selector__controls">
              <Button
                variant="tertiary"
                size="s"
                disabled={passengers <= 1}
                onClick={() => onChange?.(Math.max(1, passengers - 1))}
              >
                <Icon name="remove" size="sm" decorative />
              </Button>
              <span className="passenger-selector__count">{passengers}</span>
              <Button
                variant="tertiary"
                size="s"
                onClick={() => onChange?.(passengers + 1)}
              >
                <Icon name="add" size="sm" decorative />
              </Button>
            </div>
          </div>
          <div className="passenger-selector__actions">
            <Button variant="primary" size="s" onClick={() => setIsOpen(false)}>
              {t("common.accept")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
