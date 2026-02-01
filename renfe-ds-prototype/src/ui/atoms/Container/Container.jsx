import "./Container.css";

export default function Container({ as: As = "div", className = "", children, ...props }) {
  return (
    <As className={`ds-container ${className}`} {...props}>
      {children}
    </As>
  );
}
