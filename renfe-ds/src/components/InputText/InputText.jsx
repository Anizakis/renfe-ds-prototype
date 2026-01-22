import "./InputText.css";

export default function InputText({
  label = "Label",
  showOptional = false,
  optionalText = "(optional)",
  helperText = "Helper text",
  state = "default", // default | hovered | focused | disabled | readOnly | error | success
  disabled = false,
  readOnly = false,
  value,
  onChange,
  placeholder = "Text",
}) {
  const isDisabled = disabled || state === "disabled";
  const isReadOnly = readOnly || state === "readOnly";
  const isError = state === "error";
  const isSuccess = state === "success";

  return (
    <div className={`input-textfield input-textfield--${state}`}>
      <div className="input-textfield__header">
        <div className="input-textfield__label">
          <span>{label}</span>
          {showOptional && <span className="input-textfield__optional">{optionalText}</span>}
        </div>
        <div className="input-textfield__counter">0/0</div>
      </div>

      <div className="input-textfield__control">
        <input
          className="input-textfield__input"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-invalid={isError ? "true" : undefined}
        />
      </div>

      <div
        className={`input-textfield__helper ${
          isError ? "is-error" : isSuccess ? "is-success" : ""
        }`}
      >
        {helperText}
      </div>
    </div>
  );
}