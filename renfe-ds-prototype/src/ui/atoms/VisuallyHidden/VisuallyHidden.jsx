import "./VisuallyHidden.css";

export default function VisuallyHidden({ as: As = "span", children }) {
  return <As className="visually-hidden">{children}</As>;
}
