import { useEffect, useRef, useState } from "react";
import "./StickySummaryBar.css";
import VisuallyHidden from "../../../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
import Button from "../../atoms/Button/Button.jsx";
import Icon from "../../Icon/Icon.jsx";
import { useTravel } from "../../../app/store.jsx";
import { getSelectedExtras, getSelectedFare } from "../../../app/pricing.js";
import { formatPrice } from "../../../app/utils.js";

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
  const summaryRef = useRef(null);
  const detailsRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailsMaxHeight, setDetailsMaxHeight] = useState("0px");
  const [isDesktop, setIsDesktop] = useState(false);
  const detailsId = "sticky-summary-details";
  // Centralize extras logic here
  const { state } = useTravel();
  const selectedExtras = getSelectedExtras(state);
  const pendingExtras = selectedExtras.length === 0;
  // Centralize fare logic here
  const selectedFare = getSelectedFare(state);
  const pendingFare = !state.selectedFareId;
  const fareName = selectedFare?.nameKey ? t(selectedFare.nameKey) : selectedFare?.name;
  const extrasNames = selectedExtras.map((extra) => (extra.nameKey ? t(extra.nameKey) : extra.name));
  const baseOrigin = state.search?.origin || "—";
  const baseDestination = state.search?.destination || "—";
  const isRoundTrip = state.search?.tripType === "roundTrip";
  const isDetailsExpanded = isDesktop || isExpanded;

  const formatTripDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    const locale = typeof document !== "undefined"
      ? (document.documentElement.lang || "es-ES")
      : "es-ES";
    const formatted = date.toLocaleDateString(locale, {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    const cleaned = formatted.replace(",", "").replace(/\s+de\s+/g, " ");
    return cleaned
      .split(" ")
      .map((part) => part ? part[0].toUpperCase() + part.slice(1) : part)
      .join(" ");
  };

  useEffect(() => {
    const summaryEl = summaryRef.current;
    if (!summaryEl) return undefined;
    const scope = document.querySelector(".results-page") ?? document.documentElement;
    const headerEl = document.querySelector(".topnav") ?? document.querySelector("header");

    const setSummaryHeight = () => {
      const height = summaryEl.getBoundingClientRect().height;
      scope.style.setProperty("--sticky-summary-h", `${Math.round(height)}px`);
    };

    const setHeaderHeight = () => {
      if (!headerEl) {
        scope.style.setProperty("--app-header-h", "0px");
        return;
      }
      const height = headerEl.getBoundingClientRect().height;
      scope.style.setProperty("--app-header-h", `${Math.round(height)}px`);
    };

    const resizeObserver = new ResizeObserver(() => {
      setSummaryHeight();
      setHeaderHeight();
    });
    resizeObserver.observe(summaryEl);
    if (headerEl) resizeObserver.observe(headerEl);

    setSummaryHeight();
    setHeaderHeight();

    let rafId = null;
    const updateFooterOffset = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const footer = document.querySelector("footer");
        const overlap = footer
          ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top)
          : 0;
        summaryEl.style.setProperty("--sticky-summary-footer-offset", `${Math.round(overlap)}px`);
      });
    };

    window.addEventListener("scroll", updateFooterOffset, { passive: true });
    window.addEventListener("resize", updateFooterOffset);
    updateFooterOffset();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateFooterOffset);
      window.removeEventListener("resize", updateFooterOffset);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener("change", update);
    } else {
      media.addListener(update);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", update);
      } else {
        media.removeListener(update);
      }
    };
  }, []);

  useEffect(() => {
    const panel = detailsRef.current;
    if (!panel) return undefined;

    const updateHeight = () => {
      if (isDesktop) {
        setDetailsMaxHeight("none");
        return;
      }
      if (isDetailsExpanded) {
        setDetailsMaxHeight(`${panel.scrollHeight}px`);
      } else {
        setDetailsMaxHeight("0px");
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [isDesktop, isDetailsExpanded, showFare, showExtras, isRoundTrip, selectedExtras.length, journey, returnJourney]);

  return (
    <div
      ref={summaryRef}
      className={topSummary ? "sticky-summary sticky-summary--top" : "sticky-summary"}
    >
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
        <div className="sticky-summary__summary-row">
          <Button
            variant="tertiary"
            size="s"
            className="sticky-summary__summary-toggle"
            aria-expanded={isDetailsExpanded ? "true" : "false"}
            aria-controls={detailsId}
            onClick={() => setIsExpanded((prev) => !prev)}
            hasTrailingIcon
            trailingIcon={(
              <span className={`sticky-summary__toggle-icon ${isDetailsExpanded ? "is-expanded" : ""}`}>
                <Icon name="expand_more" size="sm" decorative />
              </span>
            )}
          >
            Sumario del viaje
          </Button>

          <div
            className={`sticky-summary__details-panel ${isDetailsExpanded ? "is-expanded" : ""}`}
            id={detailsId}
            aria-hidden={isDetailsExpanded ? "false" : "true"}
            ref={detailsRef}
            style={{ maxHeight: detailsMaxHeight }}
          >
            <div className="sticky-summary__details">
              <div className="sticky-summary__group sticky-summary__group--trip">
                <span className="sticky-summary__value">
                  <span className="sticky-summary__trip-grid">
                    <span className="sticky-summary__trip-column">
                      <span className="sticky-summary__label">{t("summary.outboundTrip")}</span>
                      <span className="sticky-summary__trip-date">
                        {formatTripDate(journey?.date ?? state.search?.departDate)}
                      </span>
                      <span className="sticky-summary__trip-list">
                        <span className="sticky-summary__trip-item">
                          <Icon name="radio_button_checked" size="sm" decorative />
                          <span>{journey?.origin ?? baseOrigin}</span>
                        </span>
                        <span className="sticky-summary__trip-item">
                          <Icon name="location_on" size="sm" decorative />
                          <span>{journey?.destination ?? baseDestination}</span>
                        </span>
                      </span>
                      <span className={`sticky-summary__trip-status ${journey ? "" : "is-muted"}`}>
                        {journey
                          ? `${journey.departTime}-${journey.arriveTime} · ${journey.service}`
                          : t("summary.noTrainSelected")}
                      </span>
                    </span>
                    {isRoundTrip && (
                      <span className="sticky-summary__trip-column">
                        <span className="sticky-summary__label">{t("summary.returnTrip")}</span>
                        <span className="sticky-summary__trip-date">
                          {formatTripDate(returnJourney?.date ?? state.search?.returnDate)}
                        </span>
                        <span className="sticky-summary__trip-list">
                          <span className="sticky-summary__trip-item">
                            <Icon name="radio_button_checked" size="sm" decorative />
                            <span>{returnJourney?.origin ?? baseDestination}</span>
                          </span>
                          <span className="sticky-summary__trip-item">
                            <Icon name="location_on" size="sm" decorative />
                            <span>{returnJourney?.destination ?? baseOrigin}</span>
                          </span>
                        </span>
                        <span className={`sticky-summary__trip-status ${returnJourney ? "" : "is-muted"}`}>
                          {returnJourney
                            ? `${returnJourney.departTime}-${returnJourney.arriveTime} · ${returnJourney.service}`
                            : t("summary.noTrainSelected")}
                        </span>
                      </span>
                    )}
                  </span>
                </span>
              </div>
              {showFare && (
                <div className="sticky-summary__group sticky-summary__group--fare">
                  <span className="sticky-summary__label">{t("summary.fare")}</span>
                  <span className="sticky-summary__value sticky-summary__trip-date">{pendingFare ? t("summary.pending") : selectedFare ? fareName : t("summary.noFare")}</span>
                </div>
              )}
              {showExtras && (
                <div className="sticky-summary__group sticky-summary__group--extras">
                  <span className="sticky-summary__label">{t("summary.extras")}</span>
                  <span className="sticky-summary__value sticky-summary__trip-date">{pendingExtras ? t("summary.pending") : selectedExtras.length > 0 ? extrasNames.join(", ") : t("summary.noExtras")}</span>
                </div>
              )}
            </div>
          </div>

          <div className="sticky-summary__actions">
            <div className="sticky-summary__totals">
              <span className="sticky-summary__total" aria-live="polite" aria-atomic="true">
                {t("summary.total")}: {typeof total === "number" ? formatPrice(total) : total}
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
        </div>
        {ariaLive && (
          <VisuallyHidden as="p" aria-live="polite">{ariaLive}</VisuallyHidden>
        )}
      </div>
    </div>
  );
}

export default StickySummaryBar;
