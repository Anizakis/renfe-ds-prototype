import Container from "../components/Container/Container.jsx";
import Grid from "../components/Grid/Grid.jsx";
import CheckoutStepper from "../components/navigation/CheckoutStepper/CheckoutStepper.jsx";
import ExtrasList from "../components/ExtrasList/ExtrasList.jsx";
import PriceBreakdown from "../components/PriceBreakdown/PriceBreakdown.jsx";
import { useTravel } from "../app/store.jsx";
import { extras } from "../data/mockData.js";
import { getTotalPrice } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import "./pages.css";

export default function Extras() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const totals = getTotalPrice(state);

  const steps = [
    { id: "results", label: t("stepper.results") },
    { id: "fares", label: t("stepper.fares") },
    { id: "extras", label: t("stepper.extras") },
    { id: "payment", label: t("stepper.payment") },
  ];

  const breakdownItems = [
    { label: t("summary.journey"), value: `${totals.base.toFixed(2)} €` },
    { label: t("summary.fare"), value: `${totals.fare.toFixed(2)} €` },
    { label: t("summary.extras"), value: `${totals.extras.toFixed(2)} €` },
  ];

  return (
    <Container as="section" className="page">
      <h1 className="page-title">{t("extras.title")}</h1>
      <CheckoutStepper steps={steps} currentStep="extras" />
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
    </Container>
  );
}
