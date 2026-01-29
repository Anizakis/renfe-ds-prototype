import "./Slider.css";

export default function Slider({
  id,
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  suffix = "",
}) {
  const fallbackId = id ?? `slider-${label}`.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="slider">
      <div className="slider__header">
        <label htmlFor={fallbackId} className="slider__label">{label}</label>
        <span className="slider__value">{value}{suffix}</span>
      </div>
      <input
        id={fallbackId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange?.(Number(event.target.value))}
      />
    </div>
  );
}
