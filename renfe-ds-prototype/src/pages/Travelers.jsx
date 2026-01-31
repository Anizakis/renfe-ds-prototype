import Container from "../components/Container/Container.jsx";
import PageStack from "../components/PageStack/PageStack.jsx";
import AnimatedCheckoutStepper from "../components/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import StickySummaryBar from "../components/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../components/VisuallyHidden/VisuallyHidden.jsx";
import { useI18n } from "../app/i18n.jsx";
import { useTravel } from "../app/store.jsx";

export default function Travelers() {
  const { t } = useI18n();
  const { state } = useTravel();
  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left">
        <AnimatedCheckoutStepper currentStep="travelers" />
        <VisuallyHidden as="h1">{t("travelers.title", "Introduce tus datos")}</VisuallyHidden>
        {/* Aquí irán los campos de datos de los viajeros */}
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
