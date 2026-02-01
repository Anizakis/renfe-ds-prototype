import Container from "../components/Container/Container.jsx";
import PageStack from "../components/PageStack/PageStack.jsx";
import AnimatedCheckoutStepper from "../components/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import StickySummaryBar from "../components/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../components/VisuallyHidden/VisuallyHidden.jsx";
import { useI18n } from "../app/i18n.jsx";
import { useTravel } from "../app/store.jsx";
import TravelerAccordion from "../components/TravelerForm/TravelerAccordion.jsx";
import { useNavigate } from "react-router-dom";
import { getSelectedExtras, getSelectedFare, getSelectedJourney, getSelectedReturnJourney, getTotalPrice, getPassengersTotal } from "../app/pricing.js";
import { getBreakdownItems } from "../app/breakdown.js";

export default function Travelers() {
  const { t } = useI18n();
  const { state } = useTravel();
  const navigate = useNavigate();
  const passengersObj = state.search?.passengers || { adults: 1, children: 0, infants: 0 };
  const passengerList = [
    ...Array(passengersObj.adults).fill("Adulto"),
    ...Array(passengersObj.children).fill("Niño"),
    ...Array(passengersObj.infants).fill("Bebé"),
  ];

  const isTravelerValid = (traveler) => {
    const fields = traveler?.fields || {};
    if (!fields.nombre?.trim()) return false;
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(fields.nombre)) return false;
    if (!fields.apellido1?.trim()) return false;
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(fields.apellido1)) return false;
    if (fields.apellido2?.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(fields.apellido2)) return false;
    if (fields.docType === "DNI") {
      if (!fields.docNumber?.trim()) return false;
      if (!/^\d{8}\s?[A-Za-z]$/.test(fields.docNumber)) return false;
    }
    if (!fields.email?.trim()) return false;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) return false;
    if (!fields.phone?.trim()) return false;
    if (!/^\d{9}$/.test(fields.phone)) return false;
    return true;
  };

  const canContinue = passengerList.every((_, idx) => isTravelerValid(state.travelers?.[idx]));
  const totals = getTotalPrice(state);
  const selectedJourney = getSelectedJourney(state);
  const selectedReturnJourney = getSelectedReturnJourney(state);
  const selectedFare = getSelectedFare(state);
  const selectedExtras = getSelectedExtras(state);
  const passengersTotal = getPassengersTotal(state);
  const outboundPrice = selectedJourney?.price ?? 0;
  const returnPrice = state.search?.tripType === "roundTrip" && selectedReturnJourney
    ? selectedReturnJourney.price ?? 0
    : 0;
  const baseTotal = outboundPrice + returnPrice;
  const farePrice = selectedFare?.price ?? 0;
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const breakdownItems = getBreakdownItems({ t, baseTotal, farePrice, extrasTotal, passengersTotal });
  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left" className="travelers-stack">
        <AnimatedCheckoutStepper currentStep="travelers" />
        <VisuallyHidden as="h1">{t("travelers.title", "Introduce tus datos")}</VisuallyHidden>
        {passengerList.map((type, i) => (
          <TravelerAccordion key={i} index={i + 1} type={type} defaultOpen={i === 0} />
        ))}
        <StickySummaryBar
          journey={selectedJourney}
          returnJourney={state.search?.tripType === "roundTrip" ? selectedReturnJourney : null}
          total={totals.total}
          breakdownItems={breakdownItems}
          canContinue={canContinue}
          onContinue={() => {
            if (!canContinue) return;
            navigate("/extras");
          }}
          onViewDetails={() => {}}
          t={t}
          priceTriggerRef={null}
          helper={!canContinue ? t("summary.selectJourneyHelper") : null}
          ariaLive={null}
        />
      </PageStack>
    </Container>
  );
}
