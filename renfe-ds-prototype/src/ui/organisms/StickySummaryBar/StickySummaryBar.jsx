import "./StickySummaryBar.css";
import VisuallyHidden from "../../../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
import Button from "../../../components/Button/Button.jsx";
import { useTravel } from "../../../app/store.jsx";
import { getSelectedExtras, getSelectedFare } from "../../../app/pricing.js";

function StickySummaryBar({
  journey,
  returnJourney,
  total,
  canContinue = true,
  onContinue,
  onViewDetails,
  t,
  continueLabel = null,
  detailsLabel = null,
  helper = null,
  priceTriggerRef = null,
  showFare = true,
  showExtras = true,
  showDetailsButton = true,
  showHelper = true,
  ariaLive = null,
  topSummary = false,
  origin,
  destination,
  selectedDate,
  returnDate,
  tripType,
  passengersLabel,
  onModifySearch
}) {
  // Centralize extras logic here
  const { state } = useTravel();
  const selectedExtras = getSelectedExtras(state);
  const pendingExtras = selectedExtras.length === 0;
  // Centralize fare logic here
  const selectedFare = getSelectedFare(state);
  const pendingFare = !state.selectedFareId;
  const fareName = selectedFare?.nameKey ? t(selectedFare.nameKey) : selectedFare?.name;
  const extrasNames = selectedExtras.map((extra) => (extra.nameKey ? t(extra.nameKey) : extra.name));
  return (
    <div className={topSummary ? "sticky-summary sticky-summary--top" : "sticky-summary"}>
      {topSummary && (
        <>
          <div className="sticky-summary__main">
            <div className="sticky-summary__route">
              {origin || "—"}
              <span className="sticky-summary__arrow" aria-hidden="true">arrow_forward</span>
              {destination || "—"}
            </div>
            <div className="sticky-summary__meta">
              <span>{t("home.departDate")}: {selectedDate ? selectedDate : "—"}</span>
              {tripType === "roundTrip" && (
                <span>{t("home.returnDate")}: {returnDate ? returnDate : "—"}</span>
              )}
              <span>{passengersLabel}</span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="s"
            className="sticky-summary__action"
            aria-label={`${t("results.modifySearch")}: ${origin || "—"} ${destination || "—"}`}
            onClick={onModifySearch}
          >
            {t("results.modifySearch")}
          </Button>
        </>
      )}
      <div className="sticky-summary__inner">
        <div className="sticky-summary__details">
          <div className="sticky-summary__group">
            <span className="sticky-summary__label">{t("summary.journey")}</span>
            <span className="sticky-summary__value">
              {returnJourney ? (
                <span className="sticky-summary__trip-grid">
                  <span className="sticky-summary__trip-column">
                    <span className="sticky-summary__trip-line">
                      {t("home.departDate")}: {journey ? `${journey.origin} → ${journey.destination}` : "—"}
                    </span>
                    <span className="sticky-summary__trip-line">{journey ? journey.date : "—"}</span>
                    <span className="sticky-summary__trip-line">{journey ? `${journey.departTime}-${journey.arriveTime} · ${journey.service}` : "—"}</span>
                  </span>
                  <span className="sticky-summary__trip-column">
                    <span className="sticky-summary__trip-line">
                      {t("home.returnDate")}: {returnJourney ? `${returnJourney.origin} → ${returnJourney.destination}` : "—"}
                    </span>
                    <span className="sticky-summary__trip-line">{returnJourney ? returnJourney.date : "—"}</span>
                    <span className="sticky-summary__trip-line">{returnJourney ? `${returnJourney.departTime}-${returnJourney.arriveTime} · ${returnJourney.service}` : "—"}</span>
                  </span>
                </span>
              ) : journey ? (
                <span className="sticky-summary__trip">
                  <span className="sticky-summary__trip-line">{journey.origin} → {journey.destination}</span>
                  <span className="sticky-summary__trip-line">{journey.date}</span>
                  <span className="sticky-summary__trip-line">{journey.departTime}-{journey.arriveTime} · {journey.service}</span>
                </span>
              ) : (
                "—"
              )}
            </span>
          </div>
          {showFare && (
            <div className="sticky-summary__group">
              <span className="sticky-summary__label">{t("summary.fare")}</span>
              <span className="sticky-summary__value">{pendingFare ? t("summary.pending") : selectedFare ? fareName : t("summary.noFare")}</span>
            </div>
          )}
          {showExtras && (
            <div className="sticky-summary__group">
              <span className="sticky-summary__label">{t("summary.extras")}</span>
              <span className="sticky-summary__value">{pendingExtras ? t("summary.pending") : selectedExtras.length > 0 ? extrasNames.join(", ") : t("summary.noExtras")}</span>
            </div>
          )}
        </div>
        <div className="sticky-summary__actions">
          <div className="sticky-summary__totals">
            <span className="sticky-summary__total" aria-live="polite" aria-atomic="true">
              {t("summary.total")}: {typeof total === "number" ? total.toFixed(2) : total} €
            </span>
            {showDetailsButton && (
              <button
                type="button"
                className="sticky-summary__details-link"
                onClick={onViewDetails}
                ref={priceTriggerRef}
              >
                {detailsLabel || t("summary.viewDetails")}
              </button>
            )}
            {showHelper && helper && (
              <span className="sticky-summary__helper">{helper}</span>
            )}
          </div>
          <Button
            variant="primary"
            size="l"
            disabled={!canContinue}
            onClick={onContinue}
          >
            {continueLabel || t("common.continue")}
          </Button>
        </div>
        {ariaLive && (
          <VisuallyHidden as="p" aria-live="polite">{ariaLive}</VisuallyHidden>
        )}
      </div>
    </div>
  );
}

export default StickySummaryBar;
