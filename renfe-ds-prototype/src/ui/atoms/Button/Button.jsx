import { Children, forwardRef } from "react";
import "./Button.css";

const Button = forwardRef(function Button({
  children,
  variant = "primary",
  size = "l",
  loading = false,
  disabled = false,
  type = "button",
  hasLeadingIcon = false,
  hasTrailingIcon = false,
  leadingIcon,
  trailingIcon,
  className = "",
  ...props
}, ref) {
  const isDisabled = disabled || loading;
  const normalizedVariant = variant === "tertiary" ? "terciary" : variant;
  const hasLabel = Children.count(children) > 0;
  const isIconOnly = !hasLabel && (hasLeadingIcon || hasTrailingIcon || leadingIcon || trailingIcon);

  return (
    <button
      type={type}
      aria-busy={loading ? "true" : undefined}
      disabled={isDisabled}
      ref={ref}
      {...props}
      aria-disabled={disabled ? "true" : undefined}
      className={[
        "btn",
        `btn--${size}`,
        `btn--${normalizedVariant}`,
        hasLeadingIcon && "btn--icon-leading",
        hasTrailingIcon && "btn--icon-trailing",
        isIconOnly && "btn--icon-only",
        isDisabled && "btn--disabled",
        loading && "btn--loading",
        className,
      ].filter(Boolean).join(" ")}
    >
      {loading ? (
        <span className="btn__spinner" aria-hidden="true">
          progress_activity
        </span>
      ) : (
        <>
          {hasLeadingIcon && leadingIcon && (
            <span className="btn__icon" aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          {hasLabel && <span className="btn__label">{children}</span>}
          {hasTrailingIcon && trailingIcon && (
            <span className="btn__icon" aria-hidden="true">
              {trailingIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
});

export default Button;
