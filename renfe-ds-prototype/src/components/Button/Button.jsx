import { forwardRef } from "react";
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
  ...props
}, ref) {
  const isDisabled = disabled || loading;
  const normalizedVariant = variant === "tertiary" ? "terciary" : variant;

  return (
    <button
      type={type}
      className={`btn btn--${normalizedVariant} btn--${size} ${
        loading ? "is-loading" : ""
      }`}
      aria-busy={loading ? "true" : undefined}
      disabled={isDisabled}
      ref={ref}
      {...props}
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
          <span className="btn__label">{children}</span>
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