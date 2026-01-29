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
import Dropdown from "../components/Dropdown/Dropdown.jsx";
import { useTravel } from "../app/store.jsx";
import { buildDayRange, generateJourneys } from "../data/mockData.js";
import { getSelectedExtras, getSelectedJourney } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import { createDefaultFilters } from "../components/ResultsFilters/ResultsFilters.jsx";
import "./pages.css";

const RANGE_LENGTH = 7;

function addDays(dateKey, amount) {
  const date = new Date(dateKey);
  date.setDate(date.getDate() + amount);
  return date.toISOString().slice(0, 10);
}

function getMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return (h * 60) + m;
}

function buildInitialFilters(search) {
  const base = createDefaultFilters();
  return {
    ...base,
    directOnly: Boolean(search?.directOnly),
    petFriendly: Boolean(search?.petOption),
    accessibilitySeat: Boolean(search?.accessibilitySeat),
    accessibilityAssistance: Boolean(search?.accessibilityAssistance),
  };
}

function applyFilters(journeyList, filters) {
  const maxDurationMap = {
    "2": 120,
    "3": 180,
    "4": 240,
  };
  const maxDuration = maxDurationMap[filters.maxDuration] ?? 240;
  const selectedPetTypes = Object.entries(filters.petTypes)
    .filter(([, value]) => value)
    .map(([key]) => key);
  const selectedPetSizes = Object.entries(filters.petSizes)
    .filter(([, value]) => value)
    .map(([key]) => key);
  const timeBands = {
    morning: { start: 6, end: 12 },
    afternoon: { start: 12, end: 18 },
    night: { start: 18, end: 24 },
  };
  const activeBands = Object.entries(filters.timePresets)
    .filter(([, value]) => value)
    .map(([key]) => timeBands[key]);
  const selectedTrains = [
    filters.trainAve && "AVE",
    filters.trainAvlo && "AVLO",
    filters.trainAlvia && "ALVIA",
    filters.trainMd && "MD",
  ].filter(Boolean);

  return journeyList.filter((journey) => {
    if (filters.directOnly && !journey.direct) return false;
    if (!filters.directOnly) {
      const maxTransfers = Number(filters.maxTransfers);
      if (journey.transfers > maxTransfers) return false;
      if (journey.transfers > 0 && Number(filters.minConnection) > journey.connectionMins) return false;
    }
    if (journey.price > filters.maxPrice) return false;
    if (journey.durationMinutes > maxDuration) return false;
    const departMinutes = getMinutes(journey.departTime);
    const arriveMinutes = getMinutes(journey.arriveTime);
    if (departMinutes < filters.departStart * 60 || departMinutes > filters.departEnd * 60) return false;
    if (arriveMinutes < filters.arriveStart * 60 || arriveMinutes > filters.arriveEnd * 60) return false;
    if (activeBands.length > 0) {
      const inBand = activeBands.some((band) =>
        departMinutes >= band.start * 60 && departMinutes < band.end * 60
      );
      if (!inBand) return false;
    }

    if (filters.petFriendly && !journey.petFriendly) return false;
    if (selectedPetTypes.length > 0 && !journey.petFriendly) return false;
    if (selectedPetSizes.length > 0 && !journey.petFriendly) return false;

    if (filters.accessibilitySeat && !journey.accessibility.seat) return false;
    if (filters.accessibilityAssistance && !journey.accessibility.assistance) return false;

    if (selectedTrains.length > 0 && !selectedTrains.includes(journey.service)) return false;

    return true;
  });
}

export default function Results() {
  const { state, dispatch } = useTravel();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const initialDate = state.search?.departDate || new Date().toISOString().slice(0, 10);
  const [filters, setFilters] = useState(() => buildInitialFilters(state.search));
  const rangeLength = RANGE_LENGTH;
  const initialRangeStart = addDays(initialDate, -Math.floor(RANGE_LENGTH / 2));
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [rangeStart, setRangeStart] = useState(initialRangeStart);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortKey, setSortKey] = useState("price");
  const loadingTimeout = useRef(null);
  const origin = state.search?.origin;
  const destination = state.search?.destination;
  const tripType = state.search?.tripType ?? "oneWay";
  const departDate = state.search?.departDate;
  const returnDate = state.search?.returnDate;
  const passengers = state.search?.passengers;
  const selectedJourney = getSelectedJourney(state);
  const selectedExtras = getSelectedExtras(state);
  const canContinue = Boolean(state.selectedJourneyId);

  const passengersTotal = useMemo(() => {
    if (!passengers) return 1;
    if (typeof passengers === "number") return passengers;
    return (passengers.adults ?? 0) + (passengers.children ?? 0) + (passengers.infants ?? 0);
  }, [passengers]);

  const passengersLabel = passengersTotal === 1
    ? `1 ${t("home.adults")}`
    : `${passengersTotal} ${t("home.passengers")}`;

  const totalPrice = selectedJourney
    ? selectedJourney.price * passengersTotal
    : 0;

  const baseOrigin = origin || "Madrid-Príncipe Pío";
  const baseDestination = destination || "Valencia";
  const dataStart = addDays(rangeStart, -7);
  const generatedJourneys = useMemo(
    () => generateJourneys({
      startDate: dataStart,
      days: rangeLength + 14,
      origin: baseOrigin,
      destination: baseDestination,
    }),
    [dataStart, rangeLength, baseOrigin, baseDestination]
  );
  const filteredJourneys = useMemo(
    () => applyFilters(generatedJourneys, filters),
    [generatedJourneys, filters]
  );

  useEffect(() => {
    if (state.search?.departDate && state.search.departDate !== selectedDate) {
      setSelectedDate(state.search.departDate);
    }
  }, [state.search, selectedDate]);

  useEffect(() => {
    dispatch({ type: "SET_JOURNEY", payload: null });
  }, [selectedDate, dispatch]);

  useEffect(() => {
    if (!selectedJourney) return;
    const stillAvailable = filteredJourneys.some((journey) => journey.id === selectedJourney.id);
    if (!stillAvailable) {
      dispatch({ type: "SET_JOURNEY", payload: null });
    }
  }, [filteredJourneys, selectedJourney, dispatch]);

  useEffect(() => {
    const rangeDays = buildDayRange(rangeStart, rangeLength);
    if (!rangeDays.includes(selectedDate)) {
      setRangeStart(addDays(selectedDate, -Math.floor(rangeLength / 2)));
    }
  }, [selectedDate, rangeStart, rangeLength]);

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const steps = [
    { id: "results", label: t("stepper.results") },
    { id: "fares", label: t("stepper.fares") },
    { id: "extras", label: t("stepper.extras") },
    { id: "payment", label: t("stepper.payment") },
  ];

  const rangeDays = useMemo(
    () => buildDayRange(rangeStart, rangeLength),
    [rangeStart, rangeLength]
  );

  useEffect(() => {
    setLoading(true);
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
    loadingTimeout.current = setTimeout(() => setLoading(false), 600);
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, [filters, selectedDate]);

  useEffect(() => {
    if (loading) {
      setAnnouncement(t("results.loadingDay"));
      return;
    }
    const locale = language === "en" ? "en-US" : "es-ES";
    const label = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(selectedDate));
    setAnnouncement(`${t("results.updatedFor")} ${label}`);
  }, [selectedDate, loading, t, language]);

  const dayPrices = useMemo(() => {
    return rangeDays.reduce((acc, day) => {
      const journeysForDay = filteredJourneys.filter((journey) => journey.date === day);
      if (journeysForDay.length > 0) {
        acc[day] = Math.min(...journeysForDay.map((journey) => journey.price));
      }
      return acc;
    }, {});
  }, [filteredJourneys, rangeDays]);

  const dayAvailability = useMemo(() => {
    return rangeDays.reduce((acc, day) => {
      acc[day] = filteredJourneys.some((journey) => journey.date === day);
      return acc;
    }, {});
  }, [filteredJourneys, rangeDays]);

  const handleDayChange = (id) => {
    if (id === selectedDate) return;
    setSelectedDate(id);
    dispatch({ type: "SET_SEARCH", payload: { departDate: id } });
  };

  const handleRangeShift = (direction) => {
    const delta = direction === "next" ? rangeLength : -rangeLength;
    setRangeStart(addDays(rangeStart, delta));
  };

  const journeysForSelectedDate = filteredJourneys.filter((journey) => journey.date === selectedDate);
  const sortedJourneysForSelectedDate = useMemo(() => {
    const list = [...journeysForSelectedDate];
    if (sortKey === "depart") {
      list.sort((a, b) => getMinutes(a.departTime) - getMinutes(b.departTime));
    } else if (sortKey === "duration") {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else {
      list.sort((a, b) => a.price - b.price);
    }
    return list;
  }, [journeysForSelectedDate, sortKey]);

  return (
    <Container as="section" className="page results-page">
      <VisuallyHidden as="h1">{t("results.title")}</VisuallyHidden>
      <AnimatedCheckoutStepper steps={steps} currentStep="results" />
      <div className="results-summary">
        <div className="results-summary__main">
          <div className="results-summary__route">
            {origin || "—"}
            <span className="results-route__arrow" aria-hidden="true">arrow_forward</span>
            {destination || "—"}
          </div>
          <div className="results-summary__meta">
            <span>{t("home.departDate")}: {formatDate(selectedDate) || "—"}</span>
            {tripType === "roundTrip" && (
              <span>{t("home.returnDate")}: {formatDate(returnDate) || "—"}</span>
            )}
            <span>{passengersLabel}</span>
          </div>
        </div>
        <Button
          variant="tertiary"
          size="s"
          onClick={() => navigate("/")}
        >
          {t("results.modifySearch")}
        </Button>
      </div>

      <Grid className="results-grid">
        <aside className="results-sidebar">
          <div className="results-panel">
            <ResultsFilters
              value={filters}
              onChange={setFilters}
              defaultFilters={buildInitialFilters(state.search)}
            />
          </div>
        </aside>
        <section className="results-content">
          <div className="results-panel results-panel--content">
            <div className="results-header">
              <div className="results-header__titles">
                <h2 className="section-title">{t("results.journeys")}</h2>
              </div>
              <div className="results-header__actions">
                <Button
                  variant="secondary"
                  size="s"
                  className="results-filters-toggle"
                  onClick={() => setFiltersOpen(true)}
                >
                  {t("results.filters")}
                </Button>
                <Dropdown
                  className="results-sort"
                  label={t("results.sortBy")}
                  value={sortKey}
                  onChange={setSortKey}
                  options={[
                    { value: "price", label: t("results.sortPrice") },
                    { value: "depart", label: t("results.sortDeparture") },
                    { value: "duration", label: t("results.sortDuration") },
                  ]}
                />
              </div>
            </div>

            <div className="results-daypicker">
              <DayPickerStrip
                days={rangeDays}
                activeDay={selectedDate}
                prices={dayPrices}
                availability={dayAvailability}
                isLoading={loading}
                onChange={handleDayChange}
                onPrevRange={() => handleRangeShift("prev")}
                onNextRange={() => handleRangeShift("next")}
              />
            </div>

            <VisuallyHidden as="p" aria-live="polite">
              {announcement}
            </VisuallyHidden>

            <Stack gap="03">
              {loading ? (
                <SkeletonList />
              ) : sortedJourneysForSelectedDate.length === 0 ? (
                <div className="results-empty" role="status">
                  <h3 className="results-empty__title">{t("results.emptyTitle")}</h3>
                  <p className="results-empty__body">{t("results.emptyBody")}</p>
                  <ul className="results-empty__actions">
                    <li>{t("results.emptyAction1")}</li>
                    <li>{t("results.emptyAction2")}</li>
                    <li>{t("results.emptyAction3")}</li>
                  </ul>
                </div>
              ) : (
                <ul className="journey-list">
                  {sortedJourneysForSelectedDate.map((journey) => (
                    <JourneyCard
                      key={journey.id}
                      journey={journey}
                      activeFilters={filters}
                      selected={state.selectedJourneyId === journey.id}
                      onSelect={(id) => {
                        dispatch({ type: "SET_JOURNEY", payload: journey });
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
        </section>
      </Grid>

      {filtersOpen && (
        <div className="results-filters-drawer" role="dialog" aria-modal="true">
          <div className="results-filters-drawer__backdrop" onClick={() => setFiltersOpen(false)} />
          <div className="results-filters-drawer__panel">
            <div className="results-filters-drawer__header">
              <span className="results-filters-drawer__title">{t("filtersPanel.title")}</span>
              <Button variant="tertiary" size="s" onClick={() => setFiltersOpen(false)}>
                {t("common.accept")}
              </Button>
            </div>
            <ResultsFilters
              value={filters}
              onChange={setFilters}
              defaultFilters={buildInitialFilters(state.search)}
            />
          </div>
        </div>
      )}
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
            <span className="sticky-summary__value">{t("summary.pending")}</span>
          </div>
          <div className="sticky-summary__group">
            <span className="sticky-summary__label">{t("summary.extras")}</span>
            <span className="sticky-summary__value">{t("summary.pending")}</span>
          </div>
        </div>
        <div className="sticky-summary__actions">
          <div className="sticky-summary__totals">
            <span>{t("summary.total")}: {totalPrice.toFixed(2)} €</span>
            {!canContinue && (
              <span className="sticky-summary__helper">{t("summary.selectJourneyHelper")}</span>
            )}
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
        <VisuallyHidden as="p" aria-live="polite">
          {canContinue ? t("summary.priceUpdated") : t("summary.selectJourneyHelper")}
        </VisuallyHidden>
      </StickySummaryBar>
    </Container>
  );
}
