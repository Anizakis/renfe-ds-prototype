import { useEffect, useRef, useState } from "react";
import Container from "../components/Container/Container.jsx";
import Grid from "../components/Grid/Grid.jsx";
import Stack from "../components/Stack/Stack.jsx";
import Tabs from "../components/Tabs/Tabs.jsx";
import JourneyCard from "../components/JourneyCard/JourneyCard.jsx";
import CheckoutStepper from "../components/navigation/CheckoutStepper/CheckoutStepper.jsx";
import SkeletonList from "../components/SkeletonList/SkeletonList.jsx";
import { useTravel } from "../app/store.jsx";
import { dayTabs, journeys } from "../data/mockData.js";
import { useI18n } from "../app/i18n.jsx";
import "./pages.css";

export default function Results() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const [activeDay, setActiveDay] = useState(dayTabs[0]);
  const [loading, setLoading] = useState(true);
  const loadingTimeout = useRef(null);

  const steps = [
    { id: "results", label: t("stepper.results") },
    { id: "fares", label: t("stepper.fares") },
    { id: "extras", label: t("stepper.extras") },
    { id: "payment", label: t("stepper.payment") },
  ];

  useEffect(() => {
    loadingTimeout.current = setTimeout(() => setLoading(false), 900);
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, []);

  const tabs = dayTabs.map((day) => {
    const journeysForDay = journeys.filter((journey) => journey.date === day);
    return {
    id: day,
    label: day,
    content: (
      <Stack gap="03">
        {loading ? (
          <SkeletonList />
        ) : (
          <ul className="journey-list">
            {journeysForDay.map((journey) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                selected={state.selectedJourneyId === journey.id}
                onSelect={(id) => dispatch({ type: "SET_JOURNEY", payload: id })}
                actionLabel={
                  state.selectedJourneyId === journey.id
                    ? t("results.selected")
                    : t("results.select")
                }
              />
            ))}
          </ul>
        )}
      </Stack>
    ),
  };
  });

  const handleTabChange = (id) => {
    setActiveDay(id);
    setLoading(true);
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
    loadingTimeout.current = setTimeout(() => setLoading(false), 900);
  };

  return (
    <Container as="section" className="page">
      <h1 className="page-title">{t("results.title")}</h1>
      <CheckoutStepper steps={steps} currentStep="results" />
      <Grid>
        <div className="col-span-4">
          <div className="card">
            <h2 className="section-title">{t("results.filters")}</h2>
            <Stack gap="03">
              <div>• {t("results.filterTime")}</div>
              <div>• {t("results.filterPrice")}</div>
              <div>• {t("results.filterServices")}</div>
            </Stack>
          </div>
        </div>
        <div className="col-span-8">
          <div className="card">
            <h2 className="section-title">{t("results.journeys")}</h2>
            <Tabs
              tabs={tabs}
              activeId={activeDay}
              onChange={handleTabChange}
              label={t("tabs.sevenDays")}
            />
          </div>
        </div>
      </Grid>
    </Container>
  );
}
