import "./Grid.css";

export default function Grid({ as, className = "", children, ...props }) {
  const Component = as ?? "div";

  return (
    <Component className={`ds-grid ${className}`} {...props}>
      {children}
    </Component>
  );
}
