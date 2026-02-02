import "./Dropdown.css";

export default function Dropdown({
  label,
  value,
  onChange,
  options,
  ariaLabel,
  name,
  onBlur,
  layout = "inline",
  className = "",
}) {
  const layoutClass = layout === "stacked" ? "dropdown--stacked" : "";
  return (
    <label className={`dropdown ${layoutClass} ${className}`.trim()}>
      <span className="dropdown__label">{label}</span>
      <select
        className="dropdown__select"
        aria-label={ariaLabel ?? label}
        name={name}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onBlur={onBlur}
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
