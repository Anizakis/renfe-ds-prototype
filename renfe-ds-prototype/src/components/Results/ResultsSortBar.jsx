import Dropdown from "../Dropdown/Dropdown.jsx";
import Button from "../Button/Button.jsx";

export default function ResultsSortBar({ sortKey, setSortKey, onFiltersOpen, t }) {
  return (
    <div className="results-header__actions">
      <Button
        variant="secondary"
        size="s"
        className="results-filters-toggle"
        onClick={onFiltersOpen}
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
  );
}
