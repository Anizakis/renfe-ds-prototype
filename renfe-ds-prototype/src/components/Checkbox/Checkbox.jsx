import "./Checkbox.css";

export default function Checkbox({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  const fallbackId = id ?? `checkbox-${label}`.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="checkbox" htmlFor={fallbackId}>
      <input
        id={fallbackId}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        disabled={disabled}
      />
      <span className="checkbox__content">
        <span className="checkbox__label">{label}</span>
        {description && <span className="checkbox__description">{description}</span>}
      </span>
    </label>
  );
}
