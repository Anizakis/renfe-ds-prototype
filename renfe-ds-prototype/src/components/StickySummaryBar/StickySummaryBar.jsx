import "./StickySummaryBar.css";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden.jsx";
import Button from "../Button/Button.jsx";

export default function StickySummaryBar({
  journey,
  returnJourney,
  fare,
  extras = [],
  total,
  breakdownItems = [],
  canContinue = true,
  onContinue,
  onViewDetails,
  t,
  continueLabel = null,
  detailsLabel = null,
  helper = null,
  priceTriggerRef = null,
  pendingFare = false,
  pendingExtras = false,
  showFare = true,
  showExtras = true,
  showDetailsButton = true,
  showHelper = true,
  ariaLive = null,
}) {
  return (
    <div className="sticky-summary">
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
              <span className="sticky-summary__value">{pendingFare ? t("summary.pending") : fare ? fare.name : t("summary.noFare")}</span>
            </div>
          )}
          {showExtras && (
            <div className="sticky-summary__group">
              <span className="sticky-summary__label">{t("summary.extras")}</span>
              <span className="sticky-summary__value">{pendingExtras ? t("summary.pending") : extras.length > 0 ? extras.map(e => e.name).join(", ") : t("summary.noExtras")}</span>
            </div>
          )}
        </div>
        <div className="sticky-summary__actions">
          <div className="sticky-summary__totals">
            <span className="sticky-summary__total">{t("summary.total")}: {typeof total === "number" ? total.toFixed(2) : total} €</span>
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
