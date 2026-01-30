import Container from "../components/Container/Container.jsx";
import Grid from "../components/Grid/Grid.jsx";
import AnimatedCheckoutStepper from "../components/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import ExtrasList from "../components/ExtrasList/ExtrasList.jsx";
import PriceBreakdown from "../components/PriceBreakdown/PriceBreakdown.jsx";
import StickySummaryBar from "../components/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../components/VisuallyHidden/VisuallyHidden.jsx";
import Button from "../components/Button/Button.jsx";
import { useTravel } from "../app/store.jsx";
import { extras } from "../data/mockData.js";
import { getTotalPrice, getSelectedJourney, getSelectedFare, getSelectedExtras, getPassengersTotal } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import { useNavigate } from "react-router-dom";
import "./pages.css";

export default function Extras() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const navigate = useNavigate();
  const totals = getTotalPrice(state);
  const journey = getSelectedJourney(state);
  const fare = getSelectedFare(state);
  const selectedExtras = getSelectedExtras(state);
  const passengersTotal = getPassengersTotal(state);

  const steps = [
    { id: "results", label: t("stepper.results") },
    { id: "fares", label: t("stepper.fares") },
    { id: "extras", label: t("stepper.extras") },
    { id: "payment", label: t("stepper.payment") },
  ];

  const breakdownItems = [
    { label: t("summary.journey"), value: journey ? journey.label || journey.name : t("summary.noJourney") },
    { label: t("summary.fare"), value: fare ? fare.name : t("summary.noFare") },
    { label: t("summary.extras"), value: selectedExtras.length ? selectedExtras.map(e => e.name).join(", ") : t("summary.noExtras") },
    { label: t("summary.passengers"), value: `x${passengersTotal}` },
  ];

  const handleContinue = () => {
    navigate("/payment");
  };

  return (
    <Container as="section" className="page">
      <AnimatedCheckoutStepper steps={steps} currentStep="extras" />
      <VisuallyHidden as="h1">{t("extras.title")}</VisuallyHidden>
      <Grid>
        <div className="col-span-8">
          <div className="card">
            <h2 className="section-title">{t("extras.select")}</h2>
            <ExtrasList
              extras={extras}
              selectedExtras={state.extras}
              onToggle={(id) => dispatch({ type: "TOGGLE_EXTRA", payload: id })}
            />
          </div>
        </div>
        <div className="col-span-4">
          <PriceBreakdown
            title={t("summary.title")}
            items={breakdownItems}
            total={totals.total}
            totalLabel={t("summary.total")}
          />
        </div>
      </Grid>
      <StickySummaryBar>
        <div className="sticky-summary__totals">
          <span>{t("summary.total")}: <strong>{totals.total.toFixed(2)} €</strong></span>
          <span>{journey ? journey.label || journey.name : t("summary.noJourney")}</span>
          <span>{fare ? fare.name : t("summary.noFare")}</span>
          {selectedExtras.length > 0 && (
            <span>{selectedExtras.map(e => e.name).join(", ")}</span>
          )}
        </div>
        <Button size="l" variant="primary" onClick={handleContinue}>
          {t("actions.continue")}
        </Button>
      </StickySummaryBar>
    </Container>
  );
}
