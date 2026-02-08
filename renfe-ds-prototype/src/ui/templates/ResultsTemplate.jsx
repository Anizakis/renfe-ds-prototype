import Container from "../atoms/Container/Container.jsx";
import PageStack from "../atoms/PageStack/PageStack.jsx";
import Grid from "../atoms/Grid/Grid.jsx";
import Stack from "../atoms/Stack/Stack.jsx";
import VisuallyHidden from "../atoms/VisuallyHidden/VisuallyHidden.jsx";
import { DayPickerStrip } from "../molecules";
import JourneyCard from "../molecules/JourneyCard/JourneyCard.jsx";
import AnimatedCheckoutStepper from "../organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import SkeletonList from "../molecules/SkeletonList/SkeletonList.jsx";
import StickySummaryBar from "../organisms/StickySummaryBar/StickySummaryBar.jsx";
import ResultsSummary from "../molecules/ResultsSummary/ResultsSummary.jsx";
import ResultsFilters from "../organisms/ResultsFilters/ResultsFilters.jsx";
import PriceDetailsModal from "../molecules/PriceDetailsModal/PriceDetailsModal.jsx";
import ResultsHeader from "../organisms/ResultsHeader/ResultsHeader.jsx";
import ResultsToolbar from "../organisms/ResultsToolbar/ResultsToolbar.jsx";
import ResultsFiltersDrawer from "../organisms/ResultsFiltersDrawer/ResultsFiltersDrawer.jsx";
import JourneyList from "../organisms/JourneyList/JourneyList.jsx";
import ResultsEmpty from "../molecules/ResultsEmpty/ResultsEmpty.jsx";
import "./ResultsTemplate.css";

export default function ResultsTemplate({
  title,
  filtersTitle,
  stepperProps,
  summaryProps,
  filtersProps,
  headerProps,
  toolbarProps,
  dayPickerProps,
  announcement,
  listState,
  listLabels,
  filtersDrawerProps,
  summaryBarProps,
  priceModalProps,
}) {
  const {
    isListBusy,
    isUpdating,
    journeys,
    activeLeg,
    selectedJourneyId,
    selectedReturnJourneyId,
    filters,
    onSelectJourney,
  } = listState;
  const {
    emptyTitle,
    emptyBody,
    emptyActions,
    updatingLabel,
    selectedLabel,
    selectLabel,
    priceFromLabel,
  } = listLabels;
  const listContent = isListBusy
    ? (
      <SkeletonList
        isBusy={isUpdating}
        busyLabel={updatingLabel}
      />
    )
    : journeys.length === 0
      ? (
        <ResultsEmpty
          title={emptyTitle}
          body={emptyBody}
          actions={emptyActions}
        />
      )
      : (
        <JourneyList>
          {journeys.map((journey) => {
            const isSelected = activeLeg === "return"
              ? selectedReturnJourneyId === journey.id
              : selectedJourneyId === journey.id;
            return (
              <JourneyCard
                key={journey.id}
                journey={journey}
                activeFilters={filters}
                selected={isSelected}
                onSelect={() => onSelectJourney(journey)}
                actionLabel={isSelected ? selectedLabel : selectLabel}
                priceFromLabel={priceFromLabel}
              />
            );
          })}
        </JourneyList>
      );

  return (
    <section className="results-page">
      <Container as="section">
        <PageStack gap="03" align="stretch" textAlign="left">
          <VisuallyHidden as="h1">{title}</VisuallyHidden>
          <div className="results-stepper">
            <AnimatedCheckoutStepper {...stepperProps} />
          </div>

          <ResultsSummary {...summaryProps} />

          <Grid className="results-grid">
            <section className="results-sidebar" aria-labelledby="results-filters-title">
              <VisuallyHidden as="h2" id="results-filters-title">{filtersTitle}</VisuallyHidden>
              <div className="results-panel">
                <ResultsFilters
                  value={filtersProps.value}
                  onChange={filtersProps.onChange}
                  defaultFilters={filtersProps.defaultFilters}
                />
              </div>
            </section>
            <section className="results-content">
              <div className="results-panel results-panel--content">
                <ResultsHeader {...headerProps} />
                <div className="results-daypicker">
                  <DayPickerStrip {...dayPickerProps} />
                </div>
                <ResultsToolbar {...toolbarProps} />
                <VisuallyHidden as="p" aria-live="polite">
                  {announcement}
                </VisuallyHidden>
                <Stack gap="03">
                  {listContent}
                </Stack>
              </div>
            </section>
          </Grid>

          <ResultsFiltersDrawer
            open={filtersDrawerProps.open}
            onClose={filtersDrawerProps.onClose}
            t={filtersDrawerProps.t}
            triggerRef={filtersDrawerProps.triggerRef}
            drawerId={filtersDrawerProps.drawerId}
          >
            <ResultsFilters
              value={filtersProps.value}
              onChange={filtersProps.onChange}
              defaultFilters={filtersProps.defaultFilters}
            />
          </ResultsFiltersDrawer>
          <StickySummaryBar {...summaryBarProps} />
          <PriceDetailsModal {...priceModalProps} />
        </PageStack>
      </Container>
    </section>
  );
}
