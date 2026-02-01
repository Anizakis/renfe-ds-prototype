import "./PageStack.css";

export default function PageStack({
  as: As = "div",
  align = "stretch",
  textAlign = "left",
  className = "",
  children,
  ...props
}) {
  const style = {
    flexDirection: "column",
    gap: `var(--spacing-05)`,
    alignItems: align,
    textAlign,
    width: "100%",
  };
  return (
    <As className={`page-stack ${className}`} style={style} {...props}>
      {children}
    </As>
  );
}
