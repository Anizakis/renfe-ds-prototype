import Link from "../../atoms/Link/Link.jsx";
import "./PromoGrid.css";

const PROMOS = [
  {
    title: "¡Nuevo! Abonos 2026",
    description: "Consulta las novedades de abonos bonificados para Cercanías y Media Distancia y conoce las opciones disponibles para 2026.",
    ctaText: "Más información",
  },
  {
    title: "Viaja más barato con Más Renfe",
    description: "Canjea tus puntos por vales descuento y ahorra en tus próximos viajes en tren.",
    ctaText: "Cuéntame más",
  },
  {
    title: "Oferta Renfe Viajes",
    description: "Reserva tren + hotel para cualquier destino y fecha, y aprovecha descuentos en escapadas seleccionadas.",
    ctaText: "Ver oferta",
  },
  {
    title: "Viaja en febrero",
    description: "Ideas para una escapada: planes románticos, carnavales o un viaje improvisado. Motivos para moverte este mes.",
    ctaText: "Descubrir planes",
  },
  {
    title: "Viaja en tren con descuento",
    description: "Descuentos para familias, mayores, jóvenes, niños y grupos. Encuentra la tarifa que mejor encaja contigo.",
    ctaText: "Ver descuentos",
  },
  {
    title: "Planes para esquiar",
    description: "Te contamos propuestas para una escapada a la nieve, en España o Francia, con inspiración para tu próximo viaje.",
    ctaText: "Ver planes",
  },
];

export default function PromoGrid() {
  return (
    <section className="promo-grid" aria-labelledby="promo-grid-title">
      <h2 id="promo-grid-title" className="promo-grid__title">Promociones y novedades</h2>
      <div className="promo-grid__items">
        {PROMOS.map((promo) => (
          <article key={promo.title} className="promo-card">
            <div className="promo-card__media" aria-hidden="true" />
            <div className="promo-card__body">
              <h3 className="promo-card__title">{promo.title}</h3>
              <p className="promo-card__description">{promo.description}</p>
              <Link href="#" className="promo-card__link">
                {promo.ctaText}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
