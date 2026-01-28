import "./Grid.css";

export default function Grid({ as: Component = "div", className = "", children, ...props }) {
  return (
    <Component className={`ds-grid ${className}`} {...props}>
      {children}
    </Component>
  );
}
