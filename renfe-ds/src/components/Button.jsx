import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  hasLeadingIcon = false,
  hasTrailingIcon = false,
  leadingIcon,
  trailingIcon,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`btn btn--${variant}`}
      aria-busy={loading ? "true" : undefined}
      disabled={isDisabled}
      {...props}
    >
      {hasLeadingIcon && leadingIcon && (
        <span className="btn__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className="btn__label">{children}</span>
      {hasTrailingIcon && trailingIcon && (
        <span className="btn__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}