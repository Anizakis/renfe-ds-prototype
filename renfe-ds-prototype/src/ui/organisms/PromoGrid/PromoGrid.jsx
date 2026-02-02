import { useI18n } from "../../../app/i18n.jsx";
import PromoCard from "../../molecules/PromoCard/PromoCard.jsx";
import "./PromoGrid.css";

export default function PromoGrid() {
  const { t } = useI18n();
  const promos = t("home.promos.items");
  const items = Array.isArray(promos) ? promos : [];

  return (
    <section className="promo-grid" aria-labelledby="promo-grid-title">
      <h2 id="promo-grid-title" className="promo-grid__title">
        {t("home.promos.title")}
      </h2>

      <div className="promo-grid__items">
        {items.map((promo) => (
          <PromoCard
            key={promo.title}
            title={promo.title}
            description={promo.description}
            ctaText={promo.ctaText}
            href="#"
            imageSrc={promo.imageSrc ?? ""}
            imageAlt={promo.imageAlt ?? ""}
          />
        ))}
      </div>
    </section>
  );
}
