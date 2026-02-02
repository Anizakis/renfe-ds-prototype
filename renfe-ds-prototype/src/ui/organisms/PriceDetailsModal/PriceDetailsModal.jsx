import Modal from "../Modal/Modal.jsx";
import { Button } from "../../atoms";
import { useI18n } from "../../../app/i18n.jsx";
import "./PriceDetailsModal.css";

export default function PriceDetailsModal({
  isOpen,
  onClose,
  triggerRef,
  items,
  total,
}) {
  const { t } = useI18n();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="price-details-title"
      descriptionId="price-details-description"
      triggerRef={triggerRef}
    >
      <div className="price-details">
        <div className="price-details__header">
          <div>
            <h2 id="price-details-title" className="price-details__title">
              {t("summary.breakdownTitle")}
            </h2>
            <p id="price-details-description" className="price-details__subtitle">
              {t("summary.breakdownSubtitle")}
            </p>
          </div>
          <Button variant="tertiary" size="s" onClick={onClose}>
            {t("common.close")}
          </Button>
        </div>
        <div className="price-details__list">
          {items.map((item) => (
            <div key={item.label} className="price-details__row">
              <span className="price-details__label">{item.label}</span>
              <span className="price-details__value">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="price-details__total">
          <span>{t("summary.total")}</span>
          <span>{total}</span>
        </div>
      </div>
    </Modal>
  );
}