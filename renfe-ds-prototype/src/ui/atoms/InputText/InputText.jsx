import Icon from "../../Icon/Icon.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import "./InputText.css";

export default function InputText({
  label,
  showOptional = false,
  optionalText,
  helperText,
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
  placeholder,
  size = "m",
  inputProps = {},
  inputRef,
  leadingIcon,
}) {
  let t;
  try {
    ({ t } = useI18n());
  } catch {
    t = undefined;
  }
  const isDisabled = disabled || state === "disabled";
  const isReadOnly = readOnly || state === "readOnly";
  const isError = state === "error";
  const isSuccess = state === "success";
  const fallbackId = inputId ?? "input-textfield";
  const resolvedLabel = label ?? (t ? t("inputText.label") : "Label");
  const resolvedOptionalText = optionalText ?? (t ? t("common.optional") : "(optional)");
  const resolvedHelperText = helperText ?? (t ? t("inputText.helperText") : "Helper text");
  const resolvedPlaceholder = placeholder ?? (t ? t("inputText.placeholder") : "Text");
  const errorIconLabel = t ? t("inputText.errorIconLabel") : "Error";
  const showHelper = Boolean(resolvedHelperText) || hideHelper;
  const describedBy = resolvedHelperText ? (helperId ?? `${fallbackId}-helper`) : undefined;
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
          <span>{resolvedLabel}</span>
          {showOptional && <span className="input-textfield__optional">{resolvedOptionalText}</span>}
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
          placeholder={resolvedPlaceholder}
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
          aria-live={isError ? "polite" : undefined}
          aria-atomic={isError ? "true" : undefined}
        >
          {isError ? (
            <>
              <Icon name="error" size="sm" decorative={false} label={errorIconLabel} />
              <span style={{ marginLeft: 4 }}>{resolvedHelperText}</span>
            </>
          ) : (
            resolvedHelperText
          )}
        </div>
      )}
    </div>
  );
}
