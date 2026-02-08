import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTravel } from "../app/store.jsx";
import { fares as fareDetails } from "../data/mockData.js";
import {
  getSelectedExtras,
  getSelectedFare,
  getSelectedJourney,
  getSelectedReturnJourney,
  getPassengersTotal,
  getTotalPrice,
} from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import { formatPrice } from "../app/utils.js";
import { getBreakdownItems } from "../app/breakdown.js";
import FaresTemplate from "../ui/templates/FaresTemplate.jsx";

export default function FaresPage() {
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

  const breakdownItems = getBreakdownItems({ t, baseTotal, farePrice, extrasTotal, passengersTotal });
  const fareName = selectedFare?.nameKey ? t(selectedFare.nameKey) : selectedFare?.name;
  const selectedFareAnnounce = state.selectedFareId
    ? `${t("fares.selectedFareAnnounce")}: ${fareName}`
    : "";

  return (
    <FaresTemplate
      title={t("fares.title")}
      stepperProps={{ currentStep: "fares" }}
      fareComparisonProps={{
        fares: fareDetails,
        selectedFareId: state.selectedFareId,
        onSelect: (fareId) => dispatch({ type: "SET_FARE", payload: fareId }),
      }}
      selectedFareAnnounce={selectedFareAnnounce}
      summaryBarProps={{
        journey,
        returnJourney: isRoundTrip ? returnJourney : null,
        total: totalPrice,
        breakdownItems,
        canContinue,
        onContinue: () => {
          if (!canContinue) return;
          navigate("/travelers");
        },
        onViewDetails: () => setPriceModalOpen(true),
        t,
        priceTriggerRef,
        helper: !canContinue ? t("summary.selectFareHelper") : null,
        ariaLive: canContinue ? t("summary.priceUpdated") : t("summary.selectFareHelper"),
      }}
      priceModalProps={{
        isOpen: priceModalOpen,
        onClose: () => setPriceModalOpen(false),
        triggerRef: priceTriggerRef,
        items: breakdownItems,
        total: formatPrice(totalPrice),
      }}
    />
  );
}
