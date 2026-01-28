import Container from "../components/Container/Container.jsx";
import Grid from "../components/Grid/Grid.jsx";
import CheckoutStepper from "../components/navigation/CheckoutStepper/CheckoutStepper.jsx";
import FareComparison from "../components/FareComparison/FareComparison.jsx";
import PriceBreakdown from "../components/PriceBreakdown/PriceBreakdown.jsx";
import { useTravel } from "../app/store.jsx";
import { fares } from "../data/mockData.js";
import { getSelectedJourney, getTotalPrice } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import "./pages.css";

export default function Fares() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const journey = getSelectedJourney(state);
  const totals = getTotalPrice(state);

  const steps = [
    { id: "results", label: t("stepper.results") },
    { id: "fares", label: t("stepper.fares") },
    { id: "extras", label: t("stepper.extras") },
    { id: "payment", label: t("stepper.payment") },
  ];

  const breakdownItems = [
    { label: t("summary.journey"), value: `${journey?.price?.toFixed(2) ?? "0.00"} €` },
    { label: t("summary.fare"), value: `${totals.fare.toFixed(2)} €` },
  ];

  return (
    <Container as="section" className="page">
      <h1 className="page-title">{t("fares.title")}</h1>
      <CheckoutStepper steps={steps} currentStep="fares" />
      <Grid>
        <div className="col-span-8">
          <div className="card">
            <h2 className="section-title">{t("fares.compare")}</h2>
            <FareComparison
              fares={fares}
              selectedFareId={state.selectedFareId}
              onSelect={(id) => dispatch({ type: "SET_FARE", payload: id })}
              actionLabel={t("fares.select")}
              labels={{
                fare: t("fares.tableFare"),
                conditions: t("fares.tableConditions"),
                price: t("fares.tablePrice"),
                action: t("fares.tableAction"),
              }}
            />
          </div>
        </div>
        <div className="col-span-4">
          <PriceBreakdown
            title={t("summary.title")}
            items={breakdownItems}
            total={totals.base + totals.fare}
            totalLabel={t("summary.total")}
          />
        </div>
      </Grid>
    </Container>
  );
}
