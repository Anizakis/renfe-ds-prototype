import Container from "../atoms/Container/Container.jsx";
import AnimatedCheckoutStepper from "../organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import ExtrasList from "../organisms/ExtrasList/ExtrasList.jsx";
import StickySummaryBar from "../organisms/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../atoms/VisuallyHidden/VisuallyHidden.jsx";
import PriceDetailsModal from "../molecules/PriceDetailsModal/PriceDetailsModal.jsx";
import PageStack from "../atoms/PageStack/PageStack.jsx";
import "./pages.css";

export default function ExtrasTemplate({
  title,
  selectTitle,
  stepperProps,
  extrasProps,
  summaryBarProps,
  priceModalProps,
}) {
  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left" className="extras-stack">
        <AnimatedCheckoutStepper {...stepperProps} />
        <VisuallyHidden as="h1">{title}</VisuallyHidden>
        <div className="extrasCard">
          <h2 className="section-title">{selectTitle}</h2>
          <div className="extrasGridWrap">
            <ExtrasList
              extras={extrasProps.extras}
              selectedExtras={extrasProps.selectedExtras}
              onToggle={extrasProps.onToggle}
            />
          </div>
        </div>
        <StickySummaryBar {...summaryBarProps} />
        <PriceDetailsModal {...priceModalProps} />
      </PageStack>
    </Container>
  );
}
