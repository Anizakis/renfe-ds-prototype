import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../ui/atoms/Container/Container.jsx";
import PageStack from "../ui/atoms/PageStack/PageStack.jsx";
import AnimatedCheckoutStepper from "../ui/organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import StickySummaryBar from "../ui/organisms/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
import PriceDetailsModal from "../ui/organisms/PriceDetailsModal/PriceDetailsModal.jsx";
import FareComparison from "../ui/organisms/FareComparison/FareComparison.jsx";
import { useTravel } from "../app/store.jsx";
import { fares as fareDetails } from "../data/mockData.js";
import { getSelectedExtras, getSelectedFare, getSelectedJourney, getSelectedReturnJourney, getPassengersTotal, getTotalPrice } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import { formatPrice } from "../app/utils.js";
import { getBreakdownItems } from "../app/breakdown.js";

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

  const breakdownItems = getBreakdownItems({ t, baseTotal, farePrice, extrasTotal, passengersTotal });
  const fareName = selectedFare?.nameKey ? t(selectedFare.nameKey) : selectedFare?.name;

  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left">
        <VisuallyHidden as="h1">{t("fares.title")}</VisuallyHidden>
        <AnimatedCheckoutStepper currentStep="fares" />
        <FareComparison
          fares={fareDetails}
          selectedFareId={state.selectedFareId}
          onSelect={(fareId) => dispatch({ type: "SET_FARE", payload: fareId })}
        />
        <VisuallyHidden as="p" aria-live="polite">
          {state.selectedFareId ? `${t("fares.selectedFareAnnounce")}: ${fareName}` : ""}
        </VisuallyHidden>
        <StickySummaryBar
          journey={journey}
          returnJourney={isRoundTrip ? returnJourney : null}
          total={totalPrice}
          breakdownItems={breakdownItems}
          canContinue={canContinue}
          onContinue={() => {
            if (!canContinue) return;
            navigate("/travelers");
          }}
          onViewDetails={() => setPriceModalOpen(true)}
          t={t}
          priceTriggerRef={priceTriggerRef}
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
      </PageStack>
    </Container>
  );
}
