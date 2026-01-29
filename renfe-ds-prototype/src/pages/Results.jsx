import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container/Container.jsx";
import Grid from "../components/Grid/Grid.jsx";
import Stack from "../components/Stack/Stack.jsx";
import DayPickerStrip from "../components/DayPickerStrip/DayPickerStrip.jsx";
import JourneyCard from "../components/JourneyCard/JourneyCard.jsx";
import Button from "../components/Button/Button.jsx";
import AnimatedCheckoutStepper from "../components/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import SkeletonList from "../components/SkeletonList/SkeletonList.jsx";
import StickySummaryBar from "../components/StickySummaryBar/StickySummaryBar.jsx";
import VisuallyHidden from "../components/VisuallyHidden/VisuallyHidden.jsx";
import ResultsFilters from "../components/ResultsFilters/ResultsFilters.jsx";
import { useTravel } from "../app/store.jsx";
import { dayTabs, journeys } from "../data/mockData.js";
import { getSelectedExtras, getSelectedFare, getSelectedJourney, getTotalPrice } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import "./pages.css";

export default function Results() {
  const { state, dispatch } = useTravel();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(dayTabs[0]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const loadingTimeout = useRef(null);
  const origin = state.search?.origin;
  const destination = state.search?.destination;
  const totals = getTotalPrice(state);
  const selectedJourney = getSelectedJourney(state);
  const selectedFare = getSelectedFare(state);
  const selectedExtras = getSelectedExtras(state);
  const canContinue = Boolean(state.selectedJourneyId);
  const extrasLabel = selectedExtras.length
    ? selectedExtras.map((extra) => extra.name).join(", ")
    : "—";

  const resolvedJourneys = useMemo(
    () =>
      journeys.map((journey) => ({
        ...journey,
        origin: origin || journey.origin,
        destination: destination || journey.destination,
      })),
    [origin, destination]
  );

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

  useEffect(() => {
    if (loading) return;
    const locale = language === "en" ? "en-US" : "es-ES";
    const label = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(activeDay));
    setAnnouncement(`${t("results.updatedFor")} ${label}`);
  }, [activeDay, loading, t]);

  const dayPrices = useMemo(() => {
    return dayTabs.reduce((acc, day) => {
      const journeysForDay = resolvedJourneys.filter((journey) => journey.date === day);
      if (journeysForDay.length > 0) {
        acc[day] = Math.min(...journeysForDay.map((journey) => journey.price));
      }
      return acc;
    }, {});
  }, [resolvedJourneys]);

  const dayAvailability = useMemo(() => {
    return dayTabs.reduce((acc, day) => {
      acc[day] = resolvedJourneys.some((journey) => journey.date === day);
      return acc;
    }, {});
  }, [resolvedJourneys]);

  const handleDayChange = (id) => {
    if (id === activeDay) return;
    setActiveDay(id);
    setLoading(true);
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
    loadingTimeout.current = setTimeout(() => setLoading(false), 900);
  };

  const journeysForActiveDay = resolvedJourneys.filter((journey) => journey.date === activeDay);

  return (
    <Container as="section" className="page">
      <VisuallyHidden as="h1">{t("results.title")}</VisuallyHidden>
      <AnimatedCheckoutStepper steps={steps} currentStep="results" />
      {origin && destination && (
        <p className="results-route">
          {origin}
          <span className="results-route__arrow" aria-hidden="true">arrow_forward</span>
          {destination}
        </p>
      )}
      <Grid>
        <div className="col-span-4">
          <div className="card">
            <ResultsFilters />
          </div>
        </div>
        <div className="col-span-8">
          <div className="card">
            <h2 className="section-title">{t("results.journeys")}</h2>
            <DayPickerStrip
              days={dayTabs}
              activeDay={activeDay}
              prices={dayPrices}
              availability={dayAvailability}
              isLoading={loading}
              onChange={handleDayChange}
            />
            <VisuallyHidden as="p" aria-live="polite">
              {announcement}
            </VisuallyHidden>
            <Stack gap="03">
              {loading ? (
                <SkeletonList />
              ) : (
                <ul className="journey-list">
                  {journeysForActiveDay.map((journey) => (
                    <JourneyCard
                      key={journey.id}
                      journey={journey}
                      selected={state.selectedJourneyId === journey.id}
                      onSelect={(id) => {
                        dispatch({ type: "SET_JOURNEY", payload: id });
                      }}
                      actionLabel={
                        state.selectedJourneyId === journey.id
                          ? t("results.selected")
                          : t("results.select")
                      }
                      priceFromLabel={t("results.priceFrom")}
                    />
                  ))}
                </ul>
              )}
            </Stack>
          </div>
        </div>
      </Grid>
      <StickySummaryBar>
        <div className="sticky-summary__details">
          <div className="sticky-summary__group">
            <span className="sticky-summary__label">{t("summary.journey")}</span>
            <span className="sticky-summary__value">
              {selectedJourney
                ? `${selectedJourney.origin} → ${selectedJourney.destination} · ${selectedJourney.date} · ${selectedJourney.departTime}-${selectedJourney.arriveTime} · ${selectedJourney.service}`
                : "—"}
            </span>
          </div>
          <div className="sticky-summary__group">
            <span className="sticky-summary__label">{t("summary.fare")}</span>
            <span className="sticky-summary__value">{selectedFare?.name ?? "—"}</span>
          </div>
          <div className="sticky-summary__group">
            <span className="sticky-summary__label">{t("summary.extras")}</span>
            <span className="sticky-summary__value">{extrasLabel}</span>
          </div>
        </div>
        <div className="sticky-summary__actions">
          <div className="sticky-summary__totals">
            <span>{t("summary.total")}: {totals.total.toFixed(2)} €</span>
          </div>
          <Button
            variant="primary"
            size="l"
            disabled={!canContinue}
            onClick={() => {
              if (!canContinue) return;
              navigate("/fares");
            }}
          >
            {t("common.continue")}
          </Button>
        </div>
      </StickySummaryBar>
    </Container>
  );
}
