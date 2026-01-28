import "./VisuallyHidden.css";

export default function VisuallyHidden({ as: Component = "span", children }) {
  return <Component className="visually-hidden">{children}</Component>;
}
