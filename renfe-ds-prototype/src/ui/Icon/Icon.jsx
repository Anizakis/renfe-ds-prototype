import "./Icon.css";

const SIZE_MAP = {
  sm: "icon--sm",
  md: "icon--md",
  lg: "icon--lg",
};

export default function Icon({ name, size = "md", decorative = true, label }) {
  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP.md;
  const ariaProps = decorative
    ? { "aria-hidden": "true" }
    : { role: "img", "aria-label": label ?? name };

  return (
    <span className={`material-symbols-outlined icon ${sizeClass}`} {...ariaProps}>
      {name}
    </span>
  );
}
