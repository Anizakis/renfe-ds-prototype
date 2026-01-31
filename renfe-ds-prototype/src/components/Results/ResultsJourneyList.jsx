import Stack from "../Stack/Stack.jsx";
import JourneyCard from "../JourneyCard/JourneyCard.jsx";

export default function ResultsJourneyList({
  journeys,
  filters,
  activeLeg,
  selectedJourneyId,
  selectedReturnJourneyId,
  onSelect,
  t,
  isRoundTrip,
  returnDate,
  setActiveLeg,
}) {
  if (!journeys) return null;
  if (journeys.length === 0) {
    return (
      <div className="results-empty" role="status">
        <h3 className="results-empty__title">{t("results.emptyTitle")}</h3>
        <p className="results-empty__body">{t("results.emptyBody")}</p>
        <ul className="results-empty__actions">
          <li>{t("results.emptyAction1")}</li>
          <li>{t("results.emptyAction2")}</li>
          <li>{t("results.emptyAction3")}</li>
        </ul>
      </div>
    );
  }
  return (
    <Stack gap="03">
      <ul className="journey-list">
        {journeys.map((journey) => (
          <JourneyCard
            key={journey.id}
            journey={journey}
            activeFilters={filters}
            selected={activeLeg === "return"
              ? selectedReturnJourneyId === journey.id
              : selectedJourneyId === journey.id}
            onSelect={() => onSelect(journey)}
            actionLabel={
              (activeLeg === "return"
                ? selectedReturnJourneyId === journey.id
                : selectedJourneyId === journey.id)
                ? t("results.selected")
                : t("results.select")
            }
            priceFromLabel={t("results.priceFrom")}
          />
        ))}
      </ul>
    </Stack>
  );
}
