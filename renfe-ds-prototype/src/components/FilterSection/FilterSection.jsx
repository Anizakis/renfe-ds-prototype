import "./FilterSection.css";

export default function FilterSection({ title, description, children }) {
  return (
    <section className="filter-section">
      <div className="filter-section__header">
        <h3 className="filter-section__title">{title}</h3>
        {description && <p className="filter-section__description">{description}</p>}
      </div>
      <div className="filter-section__body">{children}</div>
    </section>
  );
}
