import VisuallyHidden from "../../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
import "./SkeletonList.css";

export default function SkeletonList() {
  const items = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div className="skeleton-list" aria-busy="true">
      <VisuallyHidden>Cargando resultados…</VisuallyHidden>
      <ul className="skeleton-list__items" aria-hidden="true">
        {items.map((item) => (
          <li key={item} className="skeleton-card">
            <div className="skeleton-card__row skeleton-card__row--title" />
            <div className="skeleton-card__row" />
            <div className="skeleton-card__row skeleton-card__row--short" />
          </li>
        ))}
      </ul>
    </div>
  );
}
