import "./Container.css";

export default function Container({ as, className = "", children, ...props }) {
  const Component = as ?? "div";

  return (
    <Component className={`ds-container ${className}`} {...props}>
      {children}
    </Component>
  );
}
