import "./RadioGroup.css";

export default function RadioGroup({ name, label, options, value, onChange }) {
  return (
    <div className="radio-group" role="radiogroup" aria-label={label}>
      {label && <span className="radio-group__label">{label}</span>}
      <div className="radio-group__options">
        {options.map((option) => (
          <label key={option.value} className="radio-option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
