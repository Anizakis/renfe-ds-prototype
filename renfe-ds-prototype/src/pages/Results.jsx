import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DayPickerStrip } from "../ui/molecules";
import JourneyCard from "../ui/organisms/JourneyCard/JourneyCard.jsx";
import AnimatedCheckoutStepper from "../ui/organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import SkeletonList from "../components/SkeletonList/SkeletonList.jsx";
import StickySummaryBar from "../ui/organisms/StickySummaryBar/StickySummaryBar.jsx";
import ResultsSummary from "../ui/molecules/ResultsSummary/ResultsSummary.jsx";
import ResultsFilters from "../ui/organisms/ResultsFilters/ResultsFilters.jsx";
import PriceDetailsModal from "../components/PriceDetailsModal/PriceDetailsModal.jsx";
import { useTravel } from "../app/store.jsx";
import { buildDayRange, generateJourneys } from "../data/mockData.js";
import { getSelectedExtras, getSelectedJourney, getSelectedReturnJourney, getTotalPrice, getSelectedFare, getPassengersTotal } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import { createDefaultFilters } from "../ui/organisms/ResultsFilters/ResultsFilters.jsx";
import "./results.css";
import { getBreakdownItems } from "../app/breakdown.js";
import ResultsTemplate from "../templates/ResultsTemplate.jsx";
import ResultsHeader from "../ui/organisms/ResultsHeader/ResultsHeader.jsx";
import ResultsToolbar from "../ui/organisms/ResultsToolbar/ResultsToolbar.jsx";
import ResultsFiltersDrawer from "../ui/organisms/ResultsFiltersDrawer/ResultsFiltersDrawer.jsx";
import JourneyList from "../ui/organisms/JourneyList/JourneyList.jsx";
import ResultsEmpty from "../ui/molecules/ResultsEmpty/ResultsEmpty.jsx";
import { formatPrice } from "../app/utils.js";

const RANGE_LENGTH = 5;

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
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const rangeStart = useMemo(
    () => addDays(selectedDate, -Math.floor(rangeLength / 2)),
    [selectedDate, rangeLength]
  );
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortKey, setSortKey] = useState("price");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const priceTriggerRef = useRef(null);
  const filtersButtonRef = useRef(null);
  const loadingTimeout = useRef(null);
  const origin = state.search?.origin;
  const destination = state.search?.destination;
  const tripType = state.search?.tripType ?? "oneWay";
  const departDate = state.search?.departDate;
  const returnDate = state.search?.returnDate;
  const selectedJourney = getSelectedJourney(state);
  const selectedReturnJourney = getSelectedReturnJourney(state);
  const selectedExtras = getSelectedExtras(state);
  const selectedFare = getSelectedFare(state);
  const isRoundTrip = tripType === "roundTrip";
  const [activeLeg, setActiveLeg] = useState("outbound");
  const canContinue = isRoundTrip
    ? Boolean(state.selectedJourneyId && state.selectedReturnJourneyId)
    : Boolean(state.selectedJourneyId);

  const passengersTotal = getPassengersTotal(state);

  const passengersLabel = passengersTotal === 1
    ? `1 ${t("home.adults")}`
    : `${passengersTotal} ${t("home.passengers")}`;

  const totals = getTotalPrice(state);
  const totalPrice = totals.total;
  const outboundPrice = selectedJourney?.price ?? 0;
  const returnPrice = selectedReturnJourney?.price ?? 0;
  const baseTotal = outboundPrice + (isRoundTrip ? returnPrice : 0);
  const fareTotal = selectedFare?.price ?? 0;
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const breakdownItems = getBreakdownItems({ t, baseTotal, farePrice: fareTotal, extrasTotal, passengersTotal });

  const baseOrigin = origin || "Madrid-Príncipe Pío";
  const baseDestination = destination || "Valencia";
  const legOrigin = activeLeg === "return" ? baseDestination : baseOrigin;
  const legDestination = activeLeg === "return" ? baseOrigin : baseDestination;
  const dataStart = addDays(rangeStart, -7);
  const generatedJourneys = useMemo(
    () => generateJourneys({
      startDate: dataStart,
      days: rangeLength + 14,
      origin: legOrigin,
      destination: legDestination,
    }),
    [dataStart, rangeLength, legOrigin, legDestination]
  );
  const filteredJourneys = useMemo(
    () => applyFilters(generatedJourneys, filters),
    [generatedJourneys, filters]
  );

  useEffect(() => {
    if (activeLeg === "return") {
      if (state.search?.returnDate && state.search.returnDate !== selectedDate) {
        queueMicrotask(() => setSelectedDate(state.search.returnDate));
      }
      return;
    }
    if (state.search?.departDate && state.search.departDate !== selectedDate) {
      queueMicrotask(() => setSelectedDate(state.search.departDate));
    }
  }, [state.search, selectedDate, activeLeg]);

  useEffect(() => {
    if (activeLeg === "outbound") {
      if (!selectedJourney) return;
      if (selectedJourney.date !== selectedDate) return;
      const stillAvailable = filteredJourneys.some((journey) => journey.id === selectedJourney.id);
      if (!stillAvailable) {
        dispatch({ type: "SET_JOURNEY", payload: null });
      }
      return;
    }
    if (!selectedReturnJourney) return;
    if (selectedReturnJourney.date !== selectedDate) return;
    const stillAvailable = filteredJourneys.some((journey) => journey.id === selectedReturnJourney.id);
    if (!stillAvailable) {
      dispatch({ type: "SET_RETURN_JOURNEY", payload: null });
    }
  }, [filteredJourneys, selectedJourney, selectedReturnJourney, dispatch, activeLeg, selectedDate]);

  useEffect(() => {
    if (!isRoundTrip) return;
    if (activeLeg === "outbound" && departDate && departDate !== selectedDate) {
      queueMicrotask(() => setSelectedDate(departDate));
    }
    if (activeLeg === "return" && returnDate && returnDate !== selectedDate) {
      queueMicrotask(() => setSelectedDate(returnDate));
    }
  }, [activeLeg, isRoundTrip, departDate, returnDate, selectedDate]);

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const rangeDays = useMemo(
    () => buildDayRange(rangeStart, rangeLength),
    [rangeStart, rangeLength]
  );

  useEffect(() => {
    queueMicrotask(() => setLoading(true));
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
    loadingTimeout.current = setTimeout(() => queueMicrotask(() => setLoading(false)), 600);
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, [filters, selectedDate]);

  useEffect(() => {
    if (loading) {
      queueMicrotask(() => setAnnouncement(t("results.loadingDay")));
      return;
    }
    const locale = language === "en" ? "en-US" : "es-ES";
    const label = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(selectedDate));
    queueMicrotask(() => setAnnouncement(`${t("results.updatedFor")} ${label}`));
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

  const visibleDays = useMemo(() => (
    showAvailableOnly
      ? rangeDays.filter((day) => dayAvailability[day])
      : rangeDays
  ), [rangeDays, showAvailableOnly, dayAvailability]);

  const handleDayChange = (id) => {
    if (id === selectedDate) return;
    setSelectedDate(id);
    if (activeLeg === "return") {
      dispatch({ type: "SET_SEARCH", payload: { returnDate: id } });
      dispatch({ type: "SET_RETURN_JOURNEY", payload: null });
    } else {
      dispatch({ type: "SET_SEARCH", payload: { departDate: id } });
      dispatch({ type: "SET_JOURNEY", payload: null });
    }
  };

  const handleRangeShift = (direction) => {
    const delta = direction === "next" ? 1 : -1;
    const nextDate = addDays(selectedDate, delta);
    handleDayChange(nextDate);
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

  const filtersDrawerId = "results-filters-drawer";
  const filtersDrawerTitleId = "results-filters-title";

  const listContent = loading
    ? <SkeletonList />
    : sortedJourneysForSelectedDate.length === 0
      ? (
        <ResultsEmpty
          title={t("results.emptyTitle")}
          body={t("results.emptyBody")}
          actions={[
            t("results.emptyAction1"),
            t("results.emptyAction2"),
            t("results.emptyAction3"),
          ]}
        />
      )
      : (
        <JourneyList>
          {sortedJourneysForSelectedDate.map((journey) => (
            <JourneyCard
              key={journey.id}
              journey={journey}
              activeFilters={filters}
              selected={activeLeg === "return"
                ? state.selectedReturnJourneyId === journey.id
                : state.selectedJourneyId === journey.id}
              onSelect={() => {
                if (activeLeg === "return") {
                  dispatch({ type: "SET_RETURN_JOURNEY", payload: journey });
                  dispatch({ type: "SET_SEARCH", payload: { returnDate: journey.date } });
                } else {
                  dispatch({ type: "SET_JOURNEY", payload: journey });
                  dispatch({ type: "SET_SEARCH", payload: { departDate: journey.date } });
                  if (isRoundTrip) {
                    setActiveLeg("return");
                    if (returnDate) {
                      setSelectedDate(returnDate);
                    }
                  }
                }
              }}
              actionLabel={
                (activeLeg === "return"
                  ? state.selectedReturnJourneyId === journey.id
                  : state.selectedJourneyId === journey.id)
                  ? t("results.selected")
                  : t("results.select")
              }
              priceFromLabel={t("results.priceFrom")}
            />
          ))}
        </JourneyList>
      );

  return (
    <ResultsTemplate
      title={t("results.title")}
      stepper={<AnimatedCheckoutStepper currentStep="results" />}
      summary={(
        <ResultsSummary
          origin={origin}
          destination={destination}
          selectedDate={selectedDate}
          returnDate={returnDate}
          tripType={tripType}
          passengersLabel={passengersLabel}
          t={t}
          onModifySearch={() => navigate("/")}
          formatDate={formatDate}
        />
      )}
      filtersSidebar={(
        <ResultsFilters
          value={filters}
          onChange={setFilters}
          defaultFilters={buildInitialFilters(state.search)}
        />
      )}
      header={(
        <ResultsHeader
          title={t("results.journeys")}
          isRoundTrip={isRoundTrip}
          activeLeg={activeLeg}
          onChangeLeg={setActiveLeg}
          onOpenFilters={() => setFiltersOpen(true)}
          t={t}
          filtersOpen={filtersOpen}
          filtersButtonRef={filtersButtonRef}
          filtersDrawerId={filtersDrawerId}
        />
      )}
      toolbar={(
        <ResultsToolbar
          showAvailableOnly={showAvailableOnly}
          setShowAvailableOnly={setShowAvailableOnly}
          sortKey={sortKey}
          setSortKey={setSortKey}
          t={t}
        />
      )}
      dayPicker={(
        <div className="results-daypicker">
          <DayPickerStrip
            days={visibleDays}
            activeDay={selectedDate}
            prices={dayPrices}
            availability={dayAvailability}
            isLoading={loading}
            onChange={handleDayChange}
            onPrevRange={() => handleRangeShift("prev")}
            onNextRange={() => handleRangeShift("next")}
          />
        </div>
      )}
      announcement={announcement}
      listContent={listContent}
      filtersDrawer={(
        <ResultsFiltersDrawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          t={t}
          triggerRef={filtersButtonRef}
          drawerId={filtersDrawerId}
          titleId={filtersDrawerTitleId}
        >
          <ResultsFilters
            value={filters}
            onChange={setFilters}
            defaultFilters={buildInitialFilters(state.search)}
          />
        </ResultsFiltersDrawer>
      )}
      summaryBar={(
        <StickySummaryBar
          journey={selectedJourney}
          returnJourney={isRoundTrip ? selectedReturnJourney : null}
          fare={null}
          extras={[]}
          total={totalPrice}
          breakdownItems={breakdownItems}
          canContinue={canContinue}
          onContinue={() => {
            if (!canContinue) return;
            navigate("/fares");
          }}
          onViewDetails={() => setPriceModalOpen(true)}
          t={t}
          priceTriggerRef={priceTriggerRef}
          pendingFare={true}
          pendingExtras={true}
          helper={!canContinue ? t("summary.selectJourneyHelper") : null}
          ariaLive={canContinue ? t("summary.priceUpdated") : t("summary.selectJourneyHelper")}
        />
      )}
      priceModal={(
        <PriceDetailsModal
          isOpen={priceModalOpen}
          onClose={() => setPriceModalOpen(false)}
          triggerRef={priceTriggerRef}
          items={breakdownItems}
          total={formatPrice(totalPrice)}
        />
      )}
    />
  );
}
