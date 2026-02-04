import Button from "../../atoms/Button/Button.jsx";
import Tabs from "../../molecules/Tabs/Tabs.jsx";
import "./ResultsHeader.css";

export default function ResultsHeader({
  title,
  isRoundTrip,
  activeLeg,
  onChangeLeg,
  onOpenFilters,
  t,
  filtersOpen,
  filtersButtonRef,
  filtersDrawerId,
}) {
  return (
    <div className="results-header">
      <div className="results-header__row">
        <div className="results-header__titles">
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="results-header__actions">
          <Button
            variant="secondary"
            size="s"
            className="results-filters-toggle"
            onClick={onOpenFilters}
            aria-expanded={filtersOpen ? "true" : "false"}
            aria-controls={filtersDrawerId}
            ref={filtersButtonRef}
          >
            {t("results.filters.title")}
          </Button>
        </div>
      </div>

      {isRoundTrip && (
        <div className="results-header__tabs">
          <Tabs
            label={t("results.journeys")}
            activeId={activeLeg}
            onChange={onChangeLeg}
            tabs={[
              { id: "outbound", label: t("home.departDate") },
              { id: "return", label: t("home.returnDate") },
            ]}
          />
        </div>
      )}
    </div>
  );
}
