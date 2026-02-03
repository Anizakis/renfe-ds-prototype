import { useRef, useState } from "react";
import Container from "../ui/atoms/Container/Container.jsx";
import AnimatedCheckoutStepper from "../ui/organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import ExtrasList from "../ui/organisms/ExtrasList/ExtrasList.jsx";
import PriceBreakdown from "../ui/organisms/PriceBreakdown/PriceBreakdown.jsx";
import StickySummaryBar from "../ui/organisms/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
import Button from "../ui/atoms/Button/Button.jsx";
import PriceDetailsModal from "../ui/molecules/PriceDetailsModal/PriceDetailsModal.jsx";
import { useTravel } from "../app/store.jsx";
import { extras } from "../data/mockData.js";
import { getTotalPrice, getSelectedJourney, getSelectedFare, getSelectedExtras, getPassengersTotal } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import { useNavigate } from "react-router-dom";
import PageStack from "../ui/atoms/PageStack/PageStack.jsx";
import { formatPrice } from "../app/utils.js";
import { getBreakdownItems } from "../app/breakdown.js";

export default function Extras() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const navigate = useNavigate();
  const priceTriggerRef = useRef(null);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const totals = getTotalPrice(state);
  const journey = getSelectedJourney(state);
  const fare = getSelectedFare(state);
  const selectedExtras = getSelectedExtras(state);
  // For ExtrasList, we need the raw selected object for toggling
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
  const returnPrice = state.search?.tripType === "roundTrip" && state.selectedReturnJourney ? state.selectedReturnJourney.price ?? 0 : 0;
  const baseTotal = outboundPrice + returnPrice;
  const farePrice = fare?.price ?? 0;
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);

  const breakdownItems = getBreakdownItems({ t, baseTotal, farePrice, extrasTotal, passengersTotal });

  const handleContinue = () => {
    navigate("/payment");
  };

  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left">
        <AnimatedCheckoutStepper currentStep="extras" />
        <VisuallyHidden as="h1">{t("extras.title")}</VisuallyHidden>
        <div className="extrasCard">
          <h2 className="section-title">{t("extras.select")}</h2>
          <div className="extrasGridWrap">
            <ExtrasList
              extras={extras}
              selectedExtras={selectedExtrasRaw}
              onToggle={(id) => dispatch({ type: "TOGGLE_EXTRA", payload: id })}
            />
          </div>
        </div>
        <StickySummaryBar
          journey={journey}
          returnJourney={state.search?.tripType === "roundTrip" ? state.selectedReturnJourney : null}
          total={totals.total}
          breakdownItems={breakdownItems}
          canContinue={true}
          onContinue={handleContinue}
          onViewDetails={() => setPriceModalOpen(true)}
          t={t}
          priceTriggerRef={priceTriggerRef}
          helper={null}
          ariaLive={null}
        />
        <PriceDetailsModal
          isOpen={priceModalOpen}
          onClose={() => setPriceModalOpen(false)}
          triggerRef={priceTriggerRef}
          items={breakdownItems}
          total={formatPrice(totals.total)}
        />
      </PageStack>
    </Container>
  );
}
