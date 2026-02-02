import VisuallyHidden from "../../atoms/VisuallyHidden/VisuallyHidden.jsx";
import "./SkeletonList.css";

export default function SkeletonList({ statusText, isBusy = false }) {
  const items = Array.from({ length: 6 }, (_, index) => index);
  const isAnnouncing = Boolean(statusText && isBusy);

  return (
    <div className="skeleton-list" aria-busy={isBusy} aria-live="polite">
      <div className="skeleton-list__status" role="status">
        {isAnnouncing ? (
          statusText
        ) : (
          <VisuallyHidden>Cargando resultados…</VisuallyHidden>
        )}
      </div>
      <ul className="skeleton-list__items" aria-hidden="true">
        {items.map((item) => (
          <li key={item} className="skeleton-card">
            <div className="skeleton-card__main">
              <div className="skeleton-card__row skeleton-card__row--title" />
              <div className="skeleton-card__chips">
                <div className="skeleton-card__row skeleton-card__row--chip" />
                <div className="skeleton-card__row skeleton-card__row--chip" />
                <div className="skeleton-card__row skeleton-card__row--chip" />
              </div>
              <div className="skeleton-card__times">
                <div className="skeleton-card__row skeleton-card__row--time" />
                <div className="skeleton-card__row skeleton-card__row--time" />
              </div>
            </div>
            <div className="skeleton-card__aside">
              <div className="skeleton-card__row skeleton-card__row--price" />
              <div className="skeleton-card__row skeleton-card__row--button" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}