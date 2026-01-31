import Container from "../components/Container/Container.jsx";
import PageStack from "../components/PageStack/PageStack.jsx";
import AnimatedCheckoutStepper from "../components/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import StickySummaryBar from "../components/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../components/VisuallyHidden/VisuallyHidden.jsx";
import { useI18n } from "../app/i18n.jsx";
import { useTravel } from "../app/store.jsx";
import TravelerForm from "../components/TravelerForm/TravelerForm.jsx";
import TravelerAccordion from "../components/TravelerForm/TravelerAccordion.jsx";

export default function Travelers() {
  const { t } = useI18n();
  const { state } = useTravel();
  const passengersObj = state.search?.passengers || { adults: 1, children: 0, infants: 0 };
  const passengerList = [
    ...Array(passengersObj.adults).fill("Adulto"),
    ...Array(passengersObj.children).fill("Niño"),
    ...Array(passengersObj.infants).fill("Bebé"),
  ];
  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left">
        <AnimatedCheckoutStepper currentStep="travelers" />
        <VisuallyHidden as="h1">{t("travelers.title", "Introduce tus datos")}</VisuallyHidden>
        {passengerList.map((type, i) => (
          <TravelerAccordion key={i} index={i + 1} type={type} defaultOpen={i === 0} />
        ))}
        <StickySummaryBar
          journey={state.selectedJourney}
          returnJourney={state.search?.tripType === "roundTrip" ? state.selectedReturnJourney : null}
          total={0}
          breakdownItems={[]}
          canContinue={false}
          onContinue={() => {}}
          onViewDetails={() => {}}
          t={t}
          priceTriggerRef={null}
          helper={null}
          ariaLive={null}
        />
      </PageStack>
    </Container>
  );
}
