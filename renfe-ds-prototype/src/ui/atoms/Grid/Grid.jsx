import "./Grid.css";

export default function Grid({ as: As = "div", className = "", children, ...props }) {
  return (
    <As className={`ds-grid ${className}`} {...props}>
      {children}
    </As>
  );
}
