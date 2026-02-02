import Link from "../../atoms/Link/Link.jsx";
import "./PromoCard.css";

export default function PromoCard({
  title,
  description,
  ctaText,
  href = "#",
  imageSrc,
  imageAlt = "",
  className = "",
}) {
  const cardClassName = ["promo-card", className].filter(Boolean).join(" ");
  const hasImage = Boolean(imageSrc);

  return (
    <article className={cardClassName}>
      <div className="promo-card__media" aria-hidden={!hasImage}>
        {hasImage && (
          <img
            className="promo-card__image"
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <div className="promo-card__body">
        <h3 className="promo-card__title">{title}</h3>
        <p className="promo-card__description">{description}</p>
        <div className="promo-card__footer">
          <Link href={href} className="promo-card__link">
            {ctaText}
          </Link>
        </div>
      </div>
    </article>
  );
}
