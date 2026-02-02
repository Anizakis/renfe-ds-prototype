import "./VisuallyHidden.css";

export default function VisuallyHidden({ as: As = "span", children, ...props }) {
  return (
    <As className="visually-hidden" {...props}>
      {children}
    </As>
  );
}
