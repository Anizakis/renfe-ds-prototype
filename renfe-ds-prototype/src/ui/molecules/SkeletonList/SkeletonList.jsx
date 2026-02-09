import "./SkeletonList.css";
import Icon from "../../atoms/Icon/Icon.jsx";

export default function SkeletonList({ isBusy = false, busyLabel = "" }) {
  const items = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div className="skeleton-list" aria-busy={isBusy ? "true" : undefined}>
      <div className="skeleton-list__srStatus" role="status" aria-live="polite">
        {isBusy ? busyLabel : ""}
      </div>
      {isBusy && (
        <div className="skeleton-list__overlay" aria-hidden="true">
          <div className="skeleton-list__banner">
            <span className="skeleton-list__busyIcon">
              <Icon name="autorenew" size="sm" />
            </span>
            <span className="skeleton-list__bannerText">{busyLabel}</span>
          </div>
        </div>
      )}
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