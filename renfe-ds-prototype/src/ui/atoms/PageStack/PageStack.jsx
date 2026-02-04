import "./PageStack.css";

export default function PageStack({
  as,
  align = "stretch",
  textAlign = "left",
  className = "",
  children,
  ...props
}) {
  const Component = as ?? "div";
  const style = {
    flexDirection: "column",
    gap: `var(--spacing-05)`,
    alignItems: align,
    textAlign,
    width: "100%",
  };
  return (
    <Component className={`page-stack ${className}`} style={style} {...props}>
      {children}
    </Component>
  );
}
