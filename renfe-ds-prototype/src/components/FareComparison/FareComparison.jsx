import "./FareComparison.css";
import Button from "../Button/Button.jsx";

export default function FareComparison({ fares, selectedFareId, onSelect, actionLabel, labels }) {
  const header = labels ?? {
    fare: "Tarifa",
    conditions: "Condiciones",
    price: "Precio",
    action: "Acción",
  };

  return (
    <table className="fare-table">
      <thead>
        <tr>
          <th scope="col">{header.fare}</th>
          <th scope="col">{header.conditions}</th>
          <th scope="col">{header.price}</th>
          <th scope="col">{header.action}</th>
        </tr>
      </thead>
      <tbody>
        {fares.map((fare) => {
          const isSelected = fare.id === selectedFareId;
          return (
            <tr key={fare.id} className={isSelected ? "is-selected" : ""}>
              <th scope="row">{fare.name}</th>
              <td>{fare.description}</td>
              <td className="fare-table__price">+{fare.price.toFixed(2)} €</td>
              <td>
                <Button
                  size="s"
                  variant={isSelected ? "secondary" : "primary"}
                  aria-pressed={isSelected ? "true" : "false"}
                  onClick={() => onSelect(fare.id)}
                >
                  {actionLabel}
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
