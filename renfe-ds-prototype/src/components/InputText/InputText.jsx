import "./InputText.css";

export default function InputText({
  label = "Label",
  showOptional = false,
  optionalText = "(optional)",
  helperText = "Helper text",
  state = "default", // default | hovered | focused | disabled | readOnly | error | success
  disabled = false,
  readOnly = false,
  inputId,
  helperId,
  value,
  onChange,
  placeholder = "Text",
}) {
  const isDisabled = disabled || state === "disabled";
  const isReadOnly = readOnly || state === "readOnly";
  const isError = state === "error";
  const isSuccess = state === "success";
  const fallbackId = inputId ?? "input-textfield";
  const describedBy = helperText ? (helperId ?? `${fallbackId}-helper`) : undefined;

  return (
    <div className={`input-textfield input-textfield--${state}`}>
      <div className="input-textfield__header">
        <label className="input-textfield__label" htmlFor={fallbackId}>
          <span>{label}</span>
          {showOptional && <span className="input-textfield__optional">{optionalText}</span>}
        </label>
        <div className="input-textfield__counter">0/0</div>
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
          aria-invalid={isError ? "true" : undefined}
          aria-describedby={describedBy}
        />
      </div>

      <div
        id={describedBy}
        className={`input-textfield__helper ${
          isError ? "is-error" : isSuccess ? "is-success" : ""
        }`}
      >
        {helperText}
      </div>
    </div>
  );
}