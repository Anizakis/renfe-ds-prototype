import "./Stack.css";

export default function Stack({
  as: As = "div",
  direction = "column",
  gap = "04",
  align = "stretch",
  justify = "flex-start",
  className = "",
  children,
  ...props
}) {
  const style = {
    flexDirection: direction,
    gap: `var(--spacing-${gap})`,
    alignItems: align,
    justifyContent: justify,
  };

  return (
    <As className={`ds-stack ${className}`} style={style} {...props}>
      {children}
    </As>
  );
}
