
import Icon from "../../ui/Icon/Icon.jsx";
import "./InputText.css";

export default function InputText({
  label = "Label",
  showOptional = false,
  optionalText = "(optional)",
  helperText = "Helper text",
  showCounter,
  hideLabel = false,
  hideHelper = false,
  state = "default", // default | hovered | focused | disabled | readOnly | error | success
  disabled = false,
  readOnly = false,
  inputId,
  helperId,
  value,
  onChange,
  placeholder = "Text",
  size = "m",
  inputProps = {},
  inputRef,
  leadingIcon,
}) {
  const isDisabled = disabled || state === "disabled";
  const isReadOnly = readOnly || state === "readOnly";
  const isError = state === "error";
  const isSuccess = state === "success";
  const fallbackId = inputId ?? "input-textfield";
  const showHelper = Boolean(helperText) || hideHelper;
  const describedBy = helperText ? (helperId ?? `${fallbackId}-helper`) : undefined;
  const maxLength = inputProps?.maxLength;
  const shouldShowCounter = typeof showCounter === "boolean"
    ? showCounter
    : Number.isFinite(maxLength);
  const currentLength = String(value ?? "").length;

  return (
    <div
      className={[
        "input-textfield",
        `input-textfield--${size}`,
        `input-textfield--${state}`,
      ].filter(Boolean).join(" ")}
    >
      <div className="input-textfield__header">
        <label
          className={`input-textfield__label ${hideLabel ? "is-hidden" : ""}`}
          htmlFor={fallbackId}
        >
          <span>{label}</span>
          {showOptional && <span className="input-textfield__optional">{optionalText}</span>}
        </label>
        {shouldShowCounter && (
          <div className="input-textfield__counter">
            {currentLength}/{maxLength}
          </div>
        )}
      </div>

      <div className="input-textfield__control">
        {leadingIcon && (
          <span className="input-textfield__leading-icon">{leadingIcon}</span>
        )}
        <input
          className="input-textfield__input"
          type="text"
          id={fallbackId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          ref={inputRef}
          {...inputProps}
          aria-invalid={isError ? "true" : undefined}
          aria-describedby={describedBy}
        />
      </div>

      {showHelper && (
        <div
          id={describedBy}
          className={`input-textfield__helper ${
            isError ? "is-error" : isSuccess ? "is-success" : ""
          } ${
            hideHelper ? "is-hidden" : ""
          }`}
        >
          {isError ? (
            <>
              <Icon name="error" size="sm" decorative={false} label="Error" />
              <span style={{ marginLeft: 4 }}>{helperText}</span>
            </>
          ) : (
            helperText
          )}
        </div>
      )}
    </div>
  );
}