import "./ExtrasList.css";

export default function ExtrasList({ extras, selectedExtras, onToggle }) {
  return (
    <ul className="extras-list">
      {extras.map((extra) => {
        const isChecked = !!selectedExtras[extra.id];
        const inputId = `extra-${extra.id}`;
        return (
          <li key={extra.id} className="extras-list__item">
            <label className="extras-list__label" htmlFor={inputId}>
              <input
                id={inputId}
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(extra.id)}
              />
              <div className="extras-list__content">
                <div className="extras-list__name">{extra.name}</div>
                <div className="extras-list__desc">{extra.description}</div>
              </div>
            </label>
            <div className="extras-list__price">+{extra.price.toFixed(2)} €</div>
          </li>
        );
      })}
    </ul>
  );
}
