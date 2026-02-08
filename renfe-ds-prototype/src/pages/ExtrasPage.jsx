import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTravel } from "../app/store.jsx";
import { extras } from "../data/mockData.js";
import {
  getTotalPrice,
  getSelectedJourney,
  getSelectedFare,
  getSelectedExtras,
  getPassengersTotal,
} from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import { formatPrice } from "../app/utils.js";
import { getBreakdownItems } from "../app/breakdown.js";
import ExtrasTemplate from "../ui/templates/ExtrasTemplate.jsx";

export default function ExtrasPage() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const navigate = useNavigate();
  const priceTriggerRef = useRef(null);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const totals = getTotalPrice(state);
  const journey = getSelectedJourney(state);
  const fare = getSelectedFare(state);
  const selectedExtras = getSelectedExtras(state);
  const journeyKey = state.selectedJourneyId || "none";
  const returnKey = state.selectedReturnJourneyId || null;
  let selectedExtrasRaw = {};
  if (!returnKey) {
    selectedExtrasRaw = state.extrasByJourney?.[journeyKey] || {};
  } else {
    const comboKey = `${journeyKey}|${returnKey}`;
    selectedExtrasRaw = state.extrasByJourney?.[comboKey] || {};
  }
  const passengersTotal = getPassengersTotal(state);

  const outboundPrice = journey?.price ?? 0;
  const returnPrice = state.search?.tripType === "roundTrip" && state.selectedReturnJourney
    ? state.selectedReturnJourney.price ?? 0
    : 0;
  const baseTotal = outboundPrice + returnPrice;
  const farePrice = fare?.price ?? 0;
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);

  const breakdownItems = getBreakdownItems({ t, baseTotal, farePrice, extrasTotal, passengersTotal });

  return (
    <ExtrasTemplate
      title={t("extras.title")}
      selectTitle={t("extras.select")}
      stepperProps={{ currentStep: "extras" }}
      extrasProps={{
        extras,
        selectedExtras: selectedExtrasRaw,
        onToggle: (id) => dispatch({ type: "TOGGLE_EXTRA", payload: id }),
      }}
      summaryBarProps={{
        journey,
        returnJourney: state.search?.tripType === "roundTrip" ? state.selectedReturnJourney : null,
        total: totals.total,
        breakdownItems,
        canContinue: true,
        onContinue: () => navigate("/payment"),
        onViewDetails: () => setPriceModalOpen(true),
        t,
        priceTriggerRef,
        helper: null,
        ariaLive: null,
      }}
      priceModalProps={{
        isOpen: priceModalOpen,
        onClose: () => setPriceModalOpen(false),
        triggerRef: priceTriggerRef,
        items: breakdownItems,
        total: formatPrice(totals.total),
      }}
    />
  );
}
