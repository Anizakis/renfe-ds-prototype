import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container/Container.jsx";
import AnimatedCheckoutStepper from "../components/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import StickySummaryBar from "../components/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../components/VisuallyHidden/VisuallyHidden.jsx";
import Button from "../components/Button/Button.jsx";
import PriceDetailsModal from "../components/PriceDetailsModal/PriceDetailsModal.jsx";
import FareComparison from "../components/FareComparison/FareComparison.jsx";
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
  const [priceModalOpen, setPriceModalOpen] = useState(false);
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
      <FareComparison
        fares={fareDetails}
        selectedFareId={state.selectedFareId}
        onSelect={(fareId) => dispatch({ type: "SET_FARE", payload: fareId })}
      />
      <VisuallyHidden as="p" aria-live="polite">
        {state.selectedFareId ? `Tarifa seleccionada: ${selectedFare.name}` : ""}
      </VisuallyHidden>
      <StickySummaryBar
        journey={journey}
        returnJourney={isRoundTrip ? returnJourney : null}
        fare={selectedFare}
        extras={[]}
        total={totalPrice}
        breakdownItems={breakdownItems}
        canContinue={canContinue}
        onContinue={() => {
          if (!canContinue) return;
          navigate("/extras");
        }}
        onViewDetails={() => setPriceModalOpen(true)}
        t={t}
        priceTriggerRef={priceTriggerRef}
        pendingFare={!state.selectedFareId}
        pendingExtras={true}
        helper={!canContinue ? t("summary.selectFareHelper") : null}
        ariaLive={canContinue ? t("summary.priceUpdated") : t("summary.selectFareHelper")}
      />
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
