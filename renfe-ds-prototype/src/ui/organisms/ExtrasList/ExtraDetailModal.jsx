import Modal from "../Modal/Modal.jsx";
import Button from "../../atoms/Button/Button.jsx";
import { Checkbox } from "../../atoms";
import Icon from "../../Icon/Icon.jsx";
import "./ExtraDetailModal.css";
import { useState } from "react";
import { useI18n } from "../../../app/i18n.jsx";
import { formatPrice } from "../../../app/utils.js";

export default function ExtraDetailModal({
  isOpen,
  onClose,
  extra,
  tripType,
  passengers = { adults: 1, children: 0, infants: 0 },
  travelers = [],
  onAdd,
}) {
  const { t } = useI18n();
  const [selectedIda, setSelectedIda] = useState([]);
  const [selectedVuelta, setSelectedVuelta] = useState([]);
  if (!extra) return null;
  const isRestauracion = extra.id === "restauracion";
  const isMascotas = extra.id === "mascotas";
  const titleId = "extra-detail-title";
  const descId = "extra-detail-desc";
  const extraName = extra.nameKey ? t(extra.nameKey) : extra.name;
  const extraDetailsKey = `extrasDetails.${extra.id}`;
  const translatedDetails = t(extraDetailsKey);
  const extraDescription = translatedDetails === extraDetailsKey
    ? (extra.descriptionKey ? t(extra.descriptionKey) : extra.description)
    : translatedDetails;

  const buildLabel = (traveler, fallback) => {
    const fields = traveler?.fields;
    const name = [fields?.nombre, fields?.apellido1, fields?.apellido2]
      .filter(Boolean)
      .join(" ")
      .trim();
    return name || fallback;
  };

  // Construir lista de pasajeros
  const passengerList = [];
  let travelerIndex = 0;
  for (let i = 0; i < passengers.adults; i++) {
    const fallback = `${t("travelers.passengerAdult")} ${i + 1}`;
    const traveler = travelers[travelerIndex];
    passengerList.push({
      type: "adult",
      label: buildLabel(traveler, fallback),
    });
    travelerIndex += 1;
  }
  for (let i = 0; i < passengers.children; i++) {
    const fallback = `${t("travelers.passengerChild")} ${i + 1}`;
    const traveler = travelers[travelerIndex];
    passengerList.push({
      type: "child",
      label: buildLabel(traveler, fallback),
    });
    travelerIndex += 1;
  }
  for (let i = 0; i < passengers.infants; i++) {
    const fallback = `${t("travelers.passengerInfant")} ${i + 1}`;
    const traveler = travelers[travelerIndex];
    passengerList.push({
      type: "infant",
      label: buildLabel(traveler, fallback),
    });
    travelerIndex += 1;
  }

  const price = isRestauracion ? 7.5 : isMascotas ? 10 : 0;
  const total = (selectedIda.length + selectedVuelta.length) * price;
  const canAdd = selectedIda.length > 0 || selectedVuelta.length > 0;

  const handleCheck = (type, idx, checked, isVuelta = false) => {
    const key = `${type}-${idx}`;
    if (isVuelta) {
      setSelectedVuelta((prev) => checked ? [...prev, key] : prev.filter((k) => k !== key));
    } else {
      setSelectedIda((prev) => checked ? [...prev, key] : prev.filter((k) => k !== key));
    }
  };

  const handleAdd = () => {
    if (canAdd && onAdd) {
      onAdd(extra, selectedIda, selectedVuelta);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId={titleId} descriptionId={descId}>
      <div className="extra-detail-modal">
        <button className="extra-detail-modal__close-btn" onClick={onClose} aria-label={t("extras.close")}>
          <Icon name="close" />
        </button>
        <h2 id={titleId} className="extra-detail-modal__title">{t("extras.personalizeTitle")}</h2>
        <div className="extra-detail-modal__subheader">
          <span className="extra-detail-modal__name">{extraName}</span>
          <span className="extra-detail-modal__price">
            {isRestauracion && (
              <>
                <span className="extra-detail-modal__per">{t("extras.perTraveler")}</span>
                <span>{formatPrice(price)}</span>
              </>
            )}
            {isMascotas && <span>{formatPrice(price)}</span>}
          </span>
        </div>
        <div id={descId} className="extra-detail-modal__desc">
          {extraDescription}
        </div>
        <div className="extra-detail-modal__divider" aria-hidden="true" />
        <div className="extra-detail-modal__section">
          <span className="extra-detail-modal__section-title">{t("extras.outbound")}</span>
          <div className="extra-detail-modal__passenger-list">
            {passengerList.map((p, idx) => (
              <Checkbox
                key={p.type + idx}
                id={`ida-${p.type}-${idx}`}
                label={p.label}
                checked={selectedIda.includes(`${p.type}-${idx}`)}
                onChange={(checked) => handleCheck(p.type, idx, checked, false)}
                className="extra-detail-modal__passenger-checkbox"
              />
            ))}
          </div>
        </div>
        {tripType === "roundTrip" && (
          <div className="extra-detail-modal__section">
            <span className="extra-detail-modal__section-title">{t("extras.return")}</span>
            <div className="extra-detail-modal__passenger-list">
              {passengerList.map((p, idx) => (
                <Checkbox
                  key={"vuelta-" + p.type + idx}
                  id={`vuelta-${p.type}-${idx}`}
                  label={p.label}
                  checked={selectedVuelta.includes(`${p.type}-${idx}`)}
                  onChange={(checked) => handleCheck(p.type, idx, checked, true)}
                  className="extra-detail-modal__passenger-checkbox"
                />
              ))}
            </div>
          </div>
        )}
        <div className="extra-detail-modal__footer">
          <span className="extra-detail-modal__total">{t("extras.total")}: {formatPrice(total)}</span>
          <Button variant="primary" size="l" disabled={!canAdd} onClick={handleAdd}>{t("extras.add")}</Button>
        </div>
      </div>
    </Modal>
  );
}
