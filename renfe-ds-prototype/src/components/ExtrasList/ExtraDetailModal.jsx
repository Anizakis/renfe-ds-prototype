import Modal from "../Modal/Modal.jsx";
import Button from "../Button/Button.jsx";
import Checkbox from "../Checkbox/Checkbox.jsx";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden.jsx";
import Icon from "../../ui/Icon/Icon.jsx";
import "./ExtraDetailModal.css";
import { useState } from "react";

const DESCRIPTIONS = {
  restauracion:
    "Selecciona el menú para tu viaje ahora o hasta 12 horas antes de la salida del tren. Podrás cancelar esta compra únicamente anulando tu billete y se te reembolsará el importe siempre que anules hasta 12 horas antes de la salida del tren. Servicio ofrecido por Serveo.",
  mascotas:
    "En trenes AVE, Avlo, Larga Distancia, Media Distancia y AVANT están admitidos los animales cuyo peso máximo no exceda de 10 Kg., siempre dentro de una jaula, transportín u otro tipo de contenedor cerrado cuyas medidas máximas sean 60x35x35 cm. con dispositivo para contener y retirar los residuos. Consulta resto de condiciones en https://www.renfe.com/es/es/viajar/informacion-util/mascotas."
};

export default function ExtraDetailModal({
  isOpen,
  onClose,
  extra,
  tripType,
  passengers = { adults: 1, children: 0, infants: 0 },
  onAdd,
}) {
  if (!extra) return null;
  const isRestauracion = extra.id === "restauracion";
  const isMascotas = extra.id === "mascotas";
  const titleId = "extra-detail-title";
  const descId = "extra-detail-desc";

  // Construir lista de pasajeros
  const passengerList = [];
  for (let i = 0; i < passengers.adults; i++) passengerList.push({ type: "adult", label: `Adulto ${i + 1}` });
  for (let i = 0; i < passengers.children; i++) passengerList.push({ type: "child", label: `Niño ${i + 1}` });
  for (let i = 0; i < passengers.infants; i++) passengerList.push({ type: "infant", label: `Bebé ${i + 1}` });

  // Estado de selección de checkboxes
  const [selectedIda, setSelectedIda] = useState([]);
  const [selectedVuelta, setSelectedVuelta] = useState([]);
  const price = isRestauracion ? 7.5 : isMascotas ? 10 : 0;
  const total = ((selectedIda.length + selectedVuelta.length) * price).toFixed(2);
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
        <button className="extra-detail-modal__close-btn" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" />
        </button>
        <h2 id={titleId} className="extra-detail-modal__title">Personaliza tu viaje</h2>
        <div className="extra-detail-modal__subheader">
          <span className="extra-detail-modal__name">{extra.name}</span>
          <span className="extra-detail-modal__price">
            {isRestauracion && <><span className="extra-detail-modal__per">Por viajero</span> <span>7,50 €</span></>}
            {isMascotas && <span>10,00 €</span>}
          </span>
        </div>
        <div id={descId} className="extra-detail-modal__desc">
          {DESCRIPTIONS[extra.id]}
        </div>
        <div className="extra-detail-modal__divider" aria-hidden="true" />
        <div className="extra-detail-modal__section">
          <span className="extra-detail-modal__section-title">Viaje de ida</span>
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
            <span className="extra-detail-modal__section-title">Viaje de vuelta</span>
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
          <span className="extra-detail-modal__total">Total: {total}€</span>
          <Button variant="primary" size="l" disabled={!canAdd} onClick={handleAdd}>Añadir</Button>
        </div>
      </div>
    </Modal>
  );
}
