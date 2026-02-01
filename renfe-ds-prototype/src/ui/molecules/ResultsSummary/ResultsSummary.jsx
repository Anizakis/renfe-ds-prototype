import Button from "../../components/Button/Button.jsx";
import "./ResultsSummary.css";

export default function ResultsSummary({
  origin,
  destination,
  selectedDate,
  returnDate,
  tripType,
  passengersLabel,
  t,
  onModifySearch,
  formatDate
}) {
  return (
    <div className="results-summary">
      <div className="results-summary__main summary-left">
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
        variant="secondary"
        size="s"
        className="summary-action"
        aria-label={`${t("results.modifySearch")}: ${origin || "—"} ${destination || "—"}`}
        onClick={onModifySearch}
      >
        {t("results.modifySearch")}
      </Button>
    </div>
  );
}
