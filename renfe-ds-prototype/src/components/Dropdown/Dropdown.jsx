import "./Dropdown.css";

export default function Dropdown({
  label,
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}) {
  return (
    <label className={`dropdown ${className}`.trim()}>
      <span className="dropdown__label">{label}</span>
      <select
        className="dropdown__select"
        aria-label={ariaLabel ?? label}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
