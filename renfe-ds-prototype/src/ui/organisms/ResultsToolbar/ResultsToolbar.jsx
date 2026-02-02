import OnlyAvailableDaysToggle from "../../molecules/OnlyAvailableDaysToggle/OnlyAvailableDaysToggle.jsx";
import Dropdown from "../../atoms/Dropdown/Dropdown.jsx";
import "./ResultsToolbar.css";

export default function ResultsToolbar({
  showAvailableOnly,
  setShowAvailableOnly,
  sortKey,
  setSortKey,
  t,
}) {
  return (
    <div className="results-toolbar">
      <OnlyAvailableDaysToggle
        checked={showAvailableOnly}
        onChange={setShowAvailableOnly}
      />
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
