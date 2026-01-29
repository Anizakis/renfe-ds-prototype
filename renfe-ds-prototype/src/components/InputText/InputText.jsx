import "./InputText.css";

export default function InputText({
  label = "Label",
  showOptional = false,
  optionalText = "(optional)",
  helperText = "Helper text",
  showCounter = true,
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
  trailing = null,
}) {
  const isDisabled = disabled || state === "disabled";
  const isReadOnly = readOnly || state === "readOnly";
  const isError = state === "error";
  const isSuccess = state === "success";
  const fallbackId = inputId ?? "input-textfield";
  const showHelper = Boolean(helperText) || hideHelper;
  const describedBy = helperText ? (helperId ?? `${fallbackId}-helper`) : undefined;

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
        {showCounter && <div className="input-textfield__counter">0/0</div>}
      </div>

      <div className="input-textfield__control">
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
        {trailing && (
          <span className="input-textfield__trailing">
            {trailing}
          </span>
        )}
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
          {helperText}
        </div>
      )}
    </div>
  );
}