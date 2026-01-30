import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container/Container.jsx";
import AnimatedCheckoutStepper from "../components/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import StickySummaryBar from "../components/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../components/VisuallyHidden/VisuallyHidden.jsx";
import Button from "../components/Button/Button.jsx";
import Modal from "../components/Modal/Modal.jsx";
import PriceDetailsModal from "../components/PriceDetailsModal/PriceDetailsModal.jsx";
import { useTravel } from "../app/store.jsx";
import { fares as fareDetails } from "../data/mockData.js";
import { getSelectedExtras, getSelectedFare, getSelectedJourney, getSelectedReturnJourney, getPassengersTotal, getTotalPrice } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import "./pages.css";

export default function Fares() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const navigate = useNavigate();
  const priceTriggerRef = useRef(null);
  const conditionsTriggerRef = useRef(null);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [activeConditionsId, setActiveConditionsId] = useState(null);
  const journey = getSelectedJourney(state);
  const returnJourney = getSelectedReturnJourney(state);
  const isRoundTrip = state.search?.tripType === "roundTrip";
  const selectedFare = getSelectedFare(state);
  const selectedExtras = getSelectedExtras(state);
  const passengersTotal = getPassengersTotal(state);
  const totals = getTotalPrice(state);
  const canContinue = Boolean(state.selectedFareId);
  const farePrice = state.selectedFareId ? selectedFare.price : 0;
  const baseTotal = totals.base;
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const perPassengerTotal = baseTotal + farePrice + extrasTotal;
  const totalPrice = perPassengerTotal * passengersTotal;
  const formatPrice = (value) => `${value.toFixed(2)} €`;

  const steps = [
    { id: "results", label: t("stepper.results") },
    { id: "fares", label: t("stepper.fares") },
    { id: "extras", label: t("stepper.extras") },
    { id: "payment", label: t("stepper.payment") },
  ];

  const tariffs = useMemo(() => ([
    {
      id: "basic",
      name: "Básico",
      priceDelta: 0,
      highlights: {
        changes: "Con coste",
        refund: "No",
        seat: "Estándar",
        luggage: "1 cabina + 1 bolso",
        keyExtra: "—",
      },
    },
    {
      id: "choose",
      name: "Elige",
      priceDelta: 7.8,
      highlights: {
        changes: "1 cambio",
        refund: "70%",
        seat: "Estándar",
        luggage: "2 piezas incl.",
        keyExtra: "—",
      },
    },
    {
      id: "choose-comfort",
      name: "Elige Confort",
      priceDelta: 10.3,
      highlights: {
        changes: "1 cambio",
        refund: "70%",
        seat: "XL",
        luggage: "2 piezas incl.",
        keyExtra: "—",
      },
    },
    {
      id: "premium",
      name: "Premium",
      priceDelta: 27,
      highlights: {
        changes: "Ilimitados",
        refund: "100% hasta 7 días",
        seat: "Selección incluida",
        luggage: "2 piezas incl.",
        keyExtra: "Salas Club",
      },
    },
  ]), []);
  const comparisonRows = useMemo(() => ([
    { key: "changes", label: "Cambios", helper: "Flexibilidad", valueKey: "changes" },
    { key: "refund", label: "Reembolso", helper: "Condición", valueKey: "refund" },
    { key: "seat", label: "Asiento", helper: "Comodidad", valueKey: "seat" },
    { key: "luggage", label: "Equipaje", helper: "Incluido", valueKey: "luggage" },
    { key: "extra", label: "Extra clave", helper: "Beneficio", valueKey: "keyExtra" },
  ]), []);

  const handleOpenConditions = (tariffId, event) => {
    conditionsTriggerRef.current = event.currentTarget;
    setActiveConditionsId(tariffId);
    setConditionsOpen(true);
  };

  const activeConditionsTariff = tariffs.find((tariff) => tariff.id === activeConditionsId) ?? tariffs[0];
  const activeDetails = fareDetails.find((fare) => fare.id === activeConditionsTariff.id);
  const fallbackConditions = [
    `Cambios: ${activeConditionsTariff.highlights.changes}`,
    `Reembolso: ${activeConditionsTariff.highlights.refund}`,
    `Asiento: ${activeConditionsTariff.highlights.seat}`,
    `Equipaje: ${activeConditionsTariff.highlights.luggage}`,
    `Extra clave: ${activeConditionsTariff.highlights.keyExtra}`,
  ];
  const conditionsList = activeDetails?.features?.length ? activeDetails.features : fallbackConditions;

  const breakdownItems = [
    { label: t("summary.baseFare"), value: formatPrice(baseTotal) },
    { label: t("summary.fare"), value: formatPrice(farePrice) },
    { label: t("summary.extras"), value: formatPrice(extrasTotal) },
    { label: t("summary.passengers"), value: `x${passengersTotal}` },
  ];

  return (
    <Container as="section" className="page page--fares">
      <VisuallyHidden as="h1">{t("fares.title")}</VisuallyHidden>
      <AnimatedCheckoutStepper steps={steps} currentStep="fares" />
      <div className="card tariff-compare" role="table" aria-label="Comparativa de tarifas">
        <div className="tariff-compare__grid">
          <div className="tariff-compare__row tariff-compare__row--header" role="row">
            <div className="tariff-compare__cell tariff-compare__cell--feature" role="columnheader">
              <VisuallyHidden>{t("fares.title")}</VisuallyHidden>
            </div>
            {tariffs.map((tariff) => (
              <div
                key={tariff.id}
                className={`tariff-compare__cell tariff-compare__cell--col tariff-compare__cell--header${tariff.id === state.selectedFareId ? " is-selected" : ""}`}
                role="columnheader"
                data-tone={tariff.id}
              >
                <div className="tariff-compare__accent" />
                <div className="tariff-compare__title">
                  <span className="tariff-compare__name">{tariff.name}</span>
                  <span className="tariff-compare__price">+{tariff.priceDelta.toFixed(2)} €</span>
                  <span className="tariff-compare__microcopy">Sobre el precio base</span>
                </div>
              </div>
            ))}
          </div>
          {comparisonRows.map((row) => (
            <div key={row.key} className="tariff-compare__row" role="row">
              <div className="tariff-compare__cell tariff-compare__cell--feature" role="rowheader">
                <span className="tariff-compare__label">{row.label}</span>
                <span className="tariff-compare__helper">{row.helper}</span>
              </div>
              {tariffs.map((tariff) => (
                <div
                  key={`${row.key}-${tariff.id}`}
                  className={`tariff-compare__cell tariff-compare__cell--col${tariff.id === state.selectedFareId ? " is-selected" : ""}`}
                  role="cell"
                >
                  <span className="tariff-compare__value">{tariff.highlights[row.valueKey] || "—"}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="tariff-compare__row tariff-compare__row--cta" role="row">
            <div className="tariff-compare__cell tariff-compare__cell--feature" role="cell" />
            {tariffs.map((tariff) => {
              const isSelected = tariff.id === state.selectedFareId;
              return (
                <div
                  key={`${tariff.id}-cta`}
                  className={`tariff-compare__cell tariff-compare__cell--col tariff-compare__cell--cta${isSelected ? " is-selected" : ""}`}
                  role="cell"
                >
                  <Button
                    size="s"
                    variant={isSelected ? "secondary" : "primary"}
                    aria-pressed={isSelected ? "true" : "false"}
                    onClick={() => dispatch({ type: "SET_FARE", payload: tariff.id })}
                  >
                    {isSelected ? "✓ Seleccionada" : "Elegir tarifa"}
                  </Button>
                  <button
                    type="button"
                    className="tariff-compare__link"
                    onClick={(event) => handleOpenConditions(tariff.id, event)}
                  >
                    Ver condiciones
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <VisuallyHidden as="p" aria-live="polite">
        {state.selectedFareId ? `Tarifa seleccionada: ${selectedFare.name}` : ""}
      </VisuallyHidden>
      <StickySummaryBar>
        <div className="sticky-summary__details">
          <div className="sticky-summary__group">
            <span className="sticky-summary__label">{t("summary.journey")}</span>
            <span className="sticky-summary__value">
              {isRoundTrip ? (
                <span className="sticky-summary__trip-grid">
                  <span className="sticky-summary__trip-column">
                    <span className="sticky-summary__trip-line">
                      {t("home.departDate")}: {journey
                        ? `${journey.origin} → ${journey.destination}`
                        : "—"}
                    </span>
                    <span className="sticky-summary__trip-line">
                      {journey ? journey.date : "—"}
                    </span>
                    <span className="sticky-summary__trip-line">
                      {journey
                        ? `${journey.departTime}-${journey.arriveTime} · ${journey.service}`
                        : "—"}
                    </span>
                  </span>
                  <span className="sticky-summary__trip-column">
                    <span className="sticky-summary__trip-line">
                      {t("home.returnDate")}: {returnJourney
                        ? `${returnJourney.origin} → ${returnJourney.destination}`
                        : "—"}
                    </span>
                    <span className="sticky-summary__trip-line">
                      {returnJourney ? returnJourney.date : "—"}
                    </span>
                    <span className="sticky-summary__trip-line">
                      {returnJourney
                        ? `${returnJourney.departTime}-${returnJourney.arriveTime} · ${returnJourney.service}`
                        : "—"}
                    </span>
                  </span>
                </span>
              ) : journey ? (
                <span className="sticky-summary__trip">
                  <span className="sticky-summary__trip-line">
                    {journey.origin} → {journey.destination}
                  </span>
                  <span className="sticky-summary__trip-line">
                    {journey.date}
                  </span>
                  <span className="sticky-summary__trip-line">
                    {journey.departTime}-{journey.arriveTime} · {journey.service}
                  </span>
                </span>
              ) : (
                "—"
              )}
            </span>
          </div>
          <div className="sticky-summary__group">
            <span className="sticky-summary__label">{t("summary.fare")}</span>
            <span className="sticky-summary__value">
              {state.selectedFareId ? selectedFare.name : t("summary.pending")}
            </span>
          </div>
          <div className="sticky-summary__group">
            <span className="sticky-summary__label">{t("summary.extras")}</span>
            <span className="sticky-summary__value">{t("summary.pending")}</span>
          </div>
        </div>
        <div className="sticky-summary__actions">
          <div className="sticky-summary__totals">
            <span className="sticky-summary__total">{t("summary.total")}: {formatPrice(totalPrice)}</span>
            <button
              type="button"
              className="sticky-summary__details-link"
              onClick={() => setPriceModalOpen(true)}
              ref={priceTriggerRef}
            >
              {t("summary.viewDetails")}
            </button>
            {!canContinue && (
              <span className="sticky-summary__helper">{t("summary.selectFareHelper")}</span>
            )}
          </div>
          <Button
            variant="primary"
            size="l"
            disabled={!canContinue}
            onClick={() => {
              if (!canContinue) return;
              navigate("/extras");
            }}
          >
            {t("common.continue")}
          </Button>
        </div>
        <VisuallyHidden as="p" aria-live="polite">
          {canContinue ? t("summary.priceUpdated") : t("summary.selectFareHelper")}
        </VisuallyHidden>
      </StickySummaryBar>
      <PriceDetailsModal
        isOpen={priceModalOpen}
        onClose={() => setPriceModalOpen(false)}
        triggerRef={priceTriggerRef}
        items={breakdownItems}
        total={formatPrice(totalPrice)}
      />
      <Modal
        isOpen={conditionsOpen}
        onClose={() => setConditionsOpen(false)}
        titleId="tariff-conditions-title"
        descriptionId="tariff-conditions-desc"
        triggerRef={conditionsTriggerRef}
      >
        <h2 id="tariff-conditions-title" className="section-title">
          {activeConditionsTariff.name} · +{activeConditionsTariff.priceDelta.toFixed(2)} €
        </h2>
        <p id="tariff-conditions-desc" className="tariff-conditions__subtitle">
          Condiciones completas de la tarifa seleccionada.
        </p>
        <ul className="tariff-conditions__list">
          {conditionsList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="tariff-conditions__actions">
          <Button variant="primary" onClick={() => setConditionsOpen(false)}>
            {t("common.accept")}
          </Button>
        </div>
      </Modal>
    </Container>
  );
}
