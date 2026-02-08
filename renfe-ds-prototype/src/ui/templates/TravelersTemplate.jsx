import Container from "../atoms/Container/Container.jsx";
import PageStack from "../atoms/PageStack/PageStack.jsx";
import AnimatedCheckoutStepper from "../organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import StickySummaryBar from "../organisms/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../atoms/VisuallyHidden/VisuallyHidden.jsx";
import TravelerAccordion from "../organisms/TravelerForm/TravelerAccordion.jsx";
import "./pages.css";

export default function TravelersTemplate({
  title,
  stepperProps,
  passengerList,
  summaryBarProps,
}) {
  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left" className="travelers-stack">
        <AnimatedCheckoutStepper {...stepperProps} />
        <VisuallyHidden as="h1">{title}</VisuallyHidden>
        {passengerList.map((type, index) => (
          <TravelerAccordion
            key={`${type}-${index}`}
            index={index + 1}
            type={type}
            defaultOpen={index === 0}
          />
        ))}
        <StickySummaryBar {...summaryBarProps} />
      </PageStack>
    </Container>
  );
}
