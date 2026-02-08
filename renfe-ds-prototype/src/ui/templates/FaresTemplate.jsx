import Container from "../atoms/Container/Container.jsx";
import PageStack from "../atoms/PageStack/PageStack.jsx";
import AnimatedCheckoutStepper from "../organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import StickySummaryBar from "../organisms/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../atoms/VisuallyHidden/VisuallyHidden.jsx";
import PriceDetailsModal from "../molecules/PriceDetailsModal/PriceDetailsModal.jsx";
import FareComparison from "../organisms/FareComparison/FareComparison.jsx";
import "./pages.css";

export default function FaresTemplate({
  title,
  stepperProps,
  fareComparisonProps,
  selectedFareAnnounce,
  summaryBarProps,
  priceModalProps,
}) {
  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left" className="fares-stack">
        <VisuallyHidden as="h1">{title}</VisuallyHidden>
        <AnimatedCheckoutStepper {...stepperProps} />
        <FareComparison
          fares={fareComparisonProps.fares}
          selectedFareId={fareComparisonProps.selectedFareId}
          onSelect={fareComparisonProps.onSelect}
        />
        <VisuallyHidden as="p" aria-live="polite">
          {selectedFareAnnounce}
        </VisuallyHidden>
        <StickySummaryBar {...summaryBarProps} />
        <PriceDetailsModal {...priceModalProps} />
      </PageStack>
    </Container>
  );
}
