import "./Stack.css";

export default function Stack({
  as,
  direction = "column",
  gap = "04",
  align = "stretch",
  justify = "flex-start",
  className = "",
  children,
  ...props
}) {
  const Component = as ?? "div";
  const style = {
    flexDirection: direction,
    gap: `var(--spacing-${gap})`,
    alignItems: align,
    justifyContent: justify,
  };

  return (
    <Component className={`ds-stack ${className}`} style={style} {...props}>
      {children}
    </Component>
  );
}
