import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container/Container.jsx";
import AnimatedCheckoutStepper from "../components/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import StickySummaryBar from "../components/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../components/VisuallyHidden/VisuallyHidden.jsx";
import Button from "../components/Button/Button.jsx";
import PriceDetailsModal from "../components/PriceDetailsModal/PriceDetailsModal.jsx";
import { useTravel } from "../app/store.jsx";
import { getSelectedExtras, getSelectedFare, getSelectedJourney, getSelectedReturnJourney, getPassengersTotal, getTotalPrice } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import "./pages.css";

export default function Fares() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const navigate = useNavigate();
  const priceTriggerRef = useRef(null);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(true);
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

  const featureSections = useMemo(() => ([
    {
      id: "luggage",
      title: "Equipaje",
      rows: [
        {
          key: "luggage-included",
          label: "Piezas incluidas",
          helper: "Cabina + bolso",
          values: {
            basic: "1 cabina + 1 bolso",
            choose: "2 piezas",
            "choose-comfort": "2 piezas",
            premium: "2 piezas",
          },
        },
        {
          key: "extra-luggage",
          label: "Equipaje extra",
          helper: "Precio por pieza",
          values: {
            basic: "+6€",
            choose: "+6€",
            "choose-comfort": "+6€",
            premium: "✓",
          },
        },
      ],
    },
    {
      id: "seat",
      title: "Asiento",
      rows: [
        {
          key: "seat-type",
          label: "Tipo de asiento",
          helper: "Comodidad",
          values: {
            basic: "Estándar",
            choose: "Estándar",
            "choose-comfort": "XL",
            premium: "XL",
          },
        },
        {
          key: "seat-selection",
          label: "Selección de asiento",
          helper: "Incluida",
          values: {
            basic: "+3€",
            choose: "+3€",
            "choose-comfort": "+3€",
            premium: "✓",
          },
        },
      ],
    },
    {
      id: "changes",
      title: "Cambios",
      rows: [
        {
          key: "changes-count",
          label: "Número de cambios",
          helper: "Por billete",
          values: {
            basic: "Con coste",
            choose: "1 cambio",
            "choose-comfort": "1 cambio",
            premium: "Ilimitados",
          },
        },
        {
          key: "changes-fee",
          label: "Coste de cambio",
          helper: "Tras cambios gratuitos",
          values: {
            basic: "10 € + dif.",
            choose: "10 €",
            "choose-comfort": "10 €",
            premium: "✓",
          },
        },
      ],
    },
    {
      id: "refund",
      title: "Reembolso / Anulación",
      rows: [
        {
          key: "refund-rate",
          label: "Reembolso",
          helper: "Antes de salida",
          values: {
            basic: "—",
            choose: "70%",
            "choose-comfort": "70%",
            premium: "100%",
          },
        },
        {
          key: "refund-window",
          label: "Ventana de reembolso",
          helper: "Condición",
          values: {
            basic: "—",
            choose: "Hasta 48h",
            "choose-comfort": "Hasta 48h",
            premium: "Hasta 7 días",
          },
        },
      ],
    },
    {
      id: "pets",
      title: "Mascotas",
      rows: [
        {
          key: "pets",
          label: "Viaje con mascota",
          helper: "Sujeto a plazas",
          values: {
            basic: "+12€",
            choose: "+12€",
            "choose-comfort": "+12€",
            premium: "✓",
          },
        },
      ],
    },
    {
      id: "services",
      title: "Servicios / Accesos",
      rows: [
        {
          key: "lounge",
          label: "Salas Club",
          helper: "Acceso",
          values: {
            basic: "—",
            choose: "—",
            "choose-comfort": "—",
            premium: "✓",
          },
        },
        {
          key: "meal",
          label: "Restauración",
          helper: "A la plaza",
          values: {
            basic: "—",
            choose: "—",
            "choose-comfort": "—",
            premium: "✓",
          },
        },
      ],
    },
  ]), []);

  const matrixRows = useMemo(() => {
    const allRows = featureSections.flatMap((section) =>
      section.rows.map((row) => ({ ...row, sectionId: section.id, sectionTitle: section.title }))
    );
    if (!showOnlyDifferences) return allRows;
    return allRows.filter((row) => {
      const values = tariffs.map((tariff) => row.values[tariff.id]);
      return new Set(values).size > 1;
    });
  }, [featureSections, showOnlyDifferences, tariffs]);

  const visibleRows = showAllFeatures ? matrixRows : matrixRows.slice(0, 10);
  const hasMoreRows = matrixRows.length > 10;

  const breakdownItems = [
    { label: t("summary.baseFare"), value: formatPrice(baseTotal) },
    { label: t("summary.fare"), value: formatPrice(farePrice) },
    { label: t("summary.extras"), value: formatPrice(extrasTotal) },
    { label: t("summary.passengers"), value: `x${passengersTotal}` },
  ];

  return (
    <Container as="section" className="page">
      <AnimatedCheckoutStepper steps={steps} currentStep="fares" />
      <div className="fares-header">
        <div>
          <VisuallyHidden as="h1">{t("fares.title")}</VisuallyHidden>
          <p className="fares-subtitle">{t("fares.compare")}</p>
        </div>
      </div>
      <div className="card">
        <div className="fares-grid">
          {tariffs.map((tariff) => {
            const isSelected = tariff.id === state.selectedFareId;
            return (
              <article key={tariff.id} className={`fare-card${isSelected ? " is-selected" : ""}`} data-tone={tariff.id}>
                <div className="fare-card__accent" />
                <div className="fare-card__header">
                  <span className="fare-card__name">{tariff.name}</span>
                  <span className="fare-card__price">+{tariff.priceDelta.toFixed(2)} €</span>
                </div>
                <div className="fare-card__highlights">
                  <div className="fare-card__highlight">
                    <span className="fare-card__highlight-label">Cambios</span>
                    <span className="fare-card__highlight-value">{tariff.highlights.changes}</span>
                  </div>
                  <div className="fare-card__highlight">
                    <span className="fare-card__highlight-label">Reembolso</span>
                    <span className="fare-card__highlight-value">{tariff.highlights.refund}</span>
                  </div>
                  <div className="fare-card__highlight">
                    <span className="fare-card__highlight-label">Asiento</span>
                    <span className="fare-card__highlight-value">{tariff.highlights.seat}</span>
                  </div>
                  <div className="fare-card__highlight">
                    <span className="fare-card__highlight-label">Equipaje</span>
                    <span className="fare-card__highlight-value">{tariff.highlights.luggage}</span>
                  </div>
                  <div className="fare-card__highlight">
                    <span className="fare-card__highlight-label">Extra clave</span>
                    <span className="fare-card__highlight-value">{tariff.highlights.keyExtra}</span>
                  </div>
                </div>
                <div className="fare-card__cta">
                  <Button
                    size="s"
                    variant={isSelected ? "secondary" : "primary"}
                    aria-pressed={isSelected ? "true" : "false"}
                    onClick={() => dispatch({ type: "SET_FARE", payload: tariff.id })}
                  >
                    {isSelected ? "Seleccionada" : "Elegir tarifa"}
                  </Button>
                  {isSelected && (
                    <span className="fare-card__selected" role="status">✓ Seleccionada</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <VisuallyHidden as="p" aria-live="polite">
        {state.selectedFareId ? `Tarifa seleccionada: ${selectedFare.name}` : ""}
      </VisuallyHidden>
      <div className="comparison card">
        <div className="comparison__header">
          <div>
            <h2 className="section-title">Comparativa</h2>
            <p className="comparison__subtitle">Las principales diferencias entre tarifas.</p>
          </div>
          <div className="comparison__controls">
            <button
              type="button"
              className="comparison__toggle"
              aria-pressed={showOnlyDifferences}
              onClick={() => setShowOnlyDifferences((prev) => !prev)}
            >
              {showOnlyDifferences ? "Mostrar todo" : "Mostrar solo diferencias"}
            </button>
            {hasMoreRows && (
              <button
                type="button"
                className="comparison__toggle"
                aria-expanded={showAllFeatures}
                onClick={() => setShowAllFeatures((prev) => !prev)}
              >
                {showAllFeatures ? "Ver menos" : "Ver comparación completa"}
              </button>
            )}
          </div>
        </div>
        <div className="comparison__table" role="table" aria-label="Comparativa de tarifas">
          <div className="comparison__row comparison__row--header" role="row">
            <div className="comparison__cell comparison__cell--feature" role="columnheader">Prestación</div>
            {tariffs.map((tariff) => (
              <div key={tariff.id} className="comparison__cell" role="columnheader">
                <span className="comparison__tariff-name">{tariff.name}</span>
                <span className="comparison__tariff-price">+{tariff.priceDelta.toFixed(2)} €</span>
              </div>
            ))}
          </div>
          {visibleRows.map((row, index) => {
            const prevRow = visibleRows[index - 1];
            const showSection = !prevRow || prevRow.sectionId !== row.sectionId;
            return (
              <div key={row.key} className="comparison__section" role="rowgroup">
                {showSection && (
                  <div className="comparison__section-title" role="row">
                    <div className="comparison__cell comparison__cell--feature" role="columnheader">
                      {row.sectionTitle}
                    </div>
                    {tariffs.map((tariff) => (
                      <div key={`${row.sectionId}-${tariff.id}`} className="comparison__cell" role="columnheader">
                        —
                      </div>
                    ))}
                  </div>
                )}
                <div className="comparison__row" role="row">
                  <div className="comparison__cell comparison__cell--feature" role="rowheader">
                    <span className="comparison__feature-label">{row.label}</span>
                    {row.helper && <span className="comparison__feature-helper">{row.helper}</span>}
                  </div>
                  {tariffs.map((tariff) => (
                    <div key={`${row.key}-${tariff.id}`} className="comparison__cell" role="cell">
                      <span className="comparison__value">{row.values[tariff.id]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
    </Container>
  );
}
