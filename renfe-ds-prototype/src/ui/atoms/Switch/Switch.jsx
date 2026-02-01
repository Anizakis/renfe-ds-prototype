import "./Switch.css";

export default function Switch({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  const fallbackId = id ?? `switch-${label}`.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="switch" htmlFor={fallbackId}>
      <span className="switch__content">
        <span className="switch__label">{label}</span>
        {description && <span className="switch__description">{description}</span>}
      </span>
      <span className="switch__control">
        <input
          id={fallbackId}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange?.(event.target.checked)}
          disabled={disabled}
        />
        <span className="switch__track" aria-hidden="true" />
      </span>
    </label>
  );
}