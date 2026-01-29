import "./JourneyCard.css";
import Button from "../Button/Button.jsx";

export default function JourneyCard({ journey, selected, onSelect, actionLabel, priceFromLabel }) {
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
        <div className="journey-card__times">
          <span>{journey.departTime}</span>
          <span className="journey-card__dot" aria-hidden="true">•</span>
          <span>{journey.arriveTime}</span>
          <span className="journey-card__dot" aria-hidden="true">•</span>
          <span>{journey.duration}</span>
        </div>
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
