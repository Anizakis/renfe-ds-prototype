import "./JourneyCard.css";
import Button from "../Button/Button.jsx";
import { useI18n } from "../../app/i18n.jsx";

export default function JourneyCard({ journey, selected, onSelect, actionLabel, priceFromLabel }) {
  const { t } = useI18n();
  const transfersLabel = journey.direct
    ? t("results.direct")
    : `${journey.transfers} ${t("results.transfers")}`;
  const services = [
    journey.services?.wifi && t("results.serviceWifi"),
    journey.services?.power && t("results.servicePower"),
    journey.services?.quiet && t("results.serviceQuiet"),
    journey.services?.cafe && t("results.serviceCafe"),
  ].filter(Boolean);
  const accessibility = [
    journey.accessibility?.seat && t("results.accessSeat"),
    journey.accessibility?.assistance && t("results.accessAssistance"),
    journey.accessibility?.companion && t("results.accessCompanion"),
    journey.accessibility?.adjacent && t("results.accessAdjacent"),
  ].filter(Boolean);

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
          <span className="journey-card__meta-item">{transfersLabel}</span>
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
        {services.length > 0 && (
          <div className="journey-card__tags">
            {services.map((label) => (
              <span key={label} className="journey-card__tag">{label}</span>
            ))}
          </div>
        )}
        {accessibility.length > 0 && (
          <div className="journey-card__tags journey-card__tags--access">
            {accessibility.map((label) => (
              <span key={label} className="journey-card__tag journey-card__tag--access">{label}</span>
            ))}
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
