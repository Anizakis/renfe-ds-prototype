import "./VisuallyHidden.css";

export default function VisuallyHidden({ as, children, ...props }) {
  const Component = as ?? "span";

  return (
    <Component className="visually-hidden" {...props}>
      {children}
    </Component>
  );
}
