import { useEffect, useMemo, useState } from "react";
import "./JourneyCard.css";
import Button from "../../components/Button/Button.jsx";
import { useI18n } from "../../app/i18n.jsx";

function buildPills(journey, activeFilters, t) {
  const priority = [];
  const rest = [];
  const addPill = (label, isPriority = false) => {
    if (!label) return;
    if (isPriority) {
      priority.push(label);
    } else {
      rest.push(label);
    }
  };

  if (journey.petFriendly) addPill(t("results.pet"), Boolean(activeFilters?.petFriendly));
  if (journey.accessibility?.assistance) {
    addPill(t("results.accessAssistance"), Boolean(activeFilters?.accessibilityAssistance));
  }
  if (journey.accessibility?.seat) {
    addPill(t("results.accessSeat"), Boolean(activeFilters?.accessibilitySeat));
  }

  const all = [...priority, ...rest];
  const seen = new Set();
  return all.filter((label) => {
    if (!label || seen.has(label)) return false;
    seen.add(label);
    return true;
  });
}

export default function JourneyCard({
  journey,
  selected,
  onSelect,
  actionLabel,
  priceFromLabel,
  activeFilters,
}) {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(media.matches);
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
    if (!overflowOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOverflowOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [overflowOpen]);

  const pills = useMemo(
    () => buildPills(journey, activeFilters, t),
    [journey, activeFilters, t]
  );
  const maxVisible = isMobile ? 4 : 6;
  const visiblePills = pills.slice(0, maxVisible);
  const overflowPills = pills.slice(maxVisible);

  useEffect(() => {
    if (overflowPills.length === 0 && overflowOpen) {
      queueMicrotask(() => setOverflowOpen(false));
    }
  }, [overflowPills.length, overflowOpen]);

  return (
    <li className={`journey-card ${selected ? "is-selected" : ""}`}>
      <div className="journey-card__info">
        <div className="journey-card__route">
          <span>{journey.origin}</span>
          <span className="journey-card__arrow" aria-hidden="true">arrow_forward</span>
          <span>{journey.destination}</span>
          {journey.service && (
            <span className="journey-card__service">{journey.service}</span>
          )}
        </div>
        <div className="journey-card__meta">
          <span className="journey-card__meta-item">
            {journey.direct
              ? t("results.direct")
              : `${journey.transfers} ${t("results.transfers")}`}
          </span>
          {!journey.direct && (
            <span className="journey-card__meta-item">
              {t("results.connection")}: {journey.connectionMins} min
            </span>
          )}
        </div>
        <div className="journey-card__times">
          <span>{journey.departTime}</span>
          <span className="journey-card__dot" aria-hidden="true">•</span>
          <span>{journey.arriveTime}</span>
          <span className="journey-card__dot" aria-hidden="true">•</span>
          <span>{journey.duration}</span>
        </div>
        {pills.length > 0 && (
          <div className="journey-card__pills">
            {visiblePills.map((label) => (
              <span key={label} className="journey-card__pill">{label}</span>
            ))}
            {overflowPills.length > 0 && (
              <div className="journey-card__pill-overflow">
                <button
                  type="button"
                  className="journey-card__pill journey-card__pill-button"
                  aria-expanded={overflowOpen}
                  aria-label={t("results.moreFeatures")}
                  onClick={() => setOverflowOpen((prev) => !prev)}
                >
                  +{overflowPills.length}
                </button>
                {overflowOpen && (
                  <div className="journey-card__pill-popover" role="dialog" aria-label={t("results.moreFeatures")}>
                    <div className="journey-card__pill-popover-list">
                      {pills.map((label) => (
                        <span key={label} className="journey-card__pill">{label}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="journey-card__price">
        <span className="journey-card__price-label">{priceFromLabel}</span>
        <span>{journey.price.toFixed(2)} €</span>
      </div>
      <Button
        variant={selected ? "secondary" : "primary"}
        size="s"
        aria-pressed={selected ? "true" : "false"}
        onClick={() => onSelect(journey.id)}
      >
        {actionLabel}
      </Button>
    </li>
  );
}
