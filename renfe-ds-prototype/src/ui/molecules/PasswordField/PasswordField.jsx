import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../../../app/i18n";
import Icon from "../../Icon/Icon";
import VisuallyHidden from "../../atoms/VisuallyHidden/VisuallyHidden";
import "./PasswordField.css";

const MIN_LENGTH = 8;
const MAX_LENGTH = 16;

function getPasswordRequirements(value, t) {
  const lengthOk = value.length >= MIN_LENGTH && value.length <= MAX_LENGTH;
  const upperOk = /[A-ZÁÉÍÓÚÜÑ]/.test(value);
  const lowerOk = /[a-záéíóúüñ]/.test(value);
  const numberOk = /\d/.test(value);

  return {
    lengthOk,
    upperOk,
    lowerOk,
    numberOk,
    isValid: lengthOk && upperOk && lowerOk && numberOk,
    items: [
      {
        key: "length",
        label: t("auth.password.requirements.length", { min: MIN_LENGTH, max: MAX_LENGTH }),
        isMet: lengthOk,
      },
      {
        key: "upper",
        label: t("auth.password.requirements.upper"),
        isMet: upperOk,
      },
      {
        key: "lower",
        label: t("auth.password.requirements.lower"),
        isMet: lowerOk,
      },
      {
        key: "number",
        label: t("auth.password.requirements.number"),
        isMet: numberOk,
      },
    ],
  };
}

export default function PasswordField({
  label,
  value,
  onChange,
  onBlur,
  name,
  inputId,
  required = false,
  autoComplete,
  placeholder,
  showLabel = true,
  size = "m",
}) {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const prevValidRef = useRef(null);

  const requirements = useMemo(() => getPasswordRequirements(value || "", t), [value, t]);
  const showRequirements = isDirty && (value || "").length > 0;
  const showError = isDirty && !requirements.isValid;
  const showSuccess = isDirty && requirements.isValid;
  const stateClass = showError ? "error" : showSuccess ? "success" : "default";

  const helperId = inputId ? `${inputId}-helper` : undefined;
  const requirementsId = inputId ? `${inputId}-requirements` : undefined;
  const statusId = inputId ? `${inputId}-status` : undefined;

  const describedBy = [
    showError || showSuccess ? helperId : null,
    showRequirements ? requirementsId : null,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (!isDirty) {
      prevValidRef.current = null;
      setStatusMessage("");
      return;
    }

    const prevValid = prevValidRef.current;
    if (prevValid === null) {
      prevValidRef.current = requirements.isValid;
      return;
    }

    if (prevValid !== requirements.isValid) {
      setStatusMessage(
        requirements.isValid ? t("auth.password.success") : t("auth.password.error")
      );
      prevValidRef.current = requirements.isValid;
    }
  }, [requirements.isValid, isDirty, t]);

  const handleChange = (event) => {
    if (!isDirty) {
      setIsDirty(true);
    }
    onChange?.(event);
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    if (!isDirty) {
      setIsDirty(true);
    }
    onBlur?.(event);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const helperText = showError
    ? t("auth.password.error")
    : showSuccess
      ? t("auth.password.success")
      : "";

  return (
    <div className={`input-textfield input-textfield--${size} input-textfield--${stateClass} password-field`}>
      {showLabel ? (
        <div className="input-textfield__header">
          <label className="input-textfield__label" htmlFor={inputId}>
            {label}
          </label>
        </div>
      ) : (
        <VisuallyHidden as="label" htmlFor={inputId}>
          {label}
        </VisuallyHidden>
      )}

      <div className="input-textfield__control">
        <span className="input-textfield__leading-icon" aria-hidden="true">
          <Icon name="lock" size="sm" decorative />
        </span>
        <input
          className="input-textfield__input"
          id={inputId}
          name={name}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={describedBy || undefined}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
        />
        <span className="input-textfield__trailing">
          <button
            type="button"
            className="password-field__toggle"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? t("auth.password.hide") : t("auth.password.show")}
          >
            <Icon name={isVisible ? "visibility_off" : "visibility"} size="sm" decorative />
          </button>
        </span>
      </div>

      {helperText ? (
        <div
          className={`password-field__helper ${showError ? "is-error" : "is-success"}`}
          id={helperId}
        >
          <Icon name={showError ? "error" : "check_circle"} size="sm" decorative />
          <span>{helperText}</span>
        </div>
      ) : null}

      {showRequirements ? (
        <ul className="password-field__requirements" id={requirementsId}>
          {requirements.items.map((item) => (
            <li
              key={item.key}
              className={`password-field__requirement ${item.isMet ? "is-met" : ""}`}
            >
              <Icon
                name={item.isMet ? "check" : "close"}
                size="sm"
                decorative
              />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <VisuallyHidden as="p" id={statusId} aria-live="polite">
        {statusMessage}
      </VisuallyHidden>
    </div>
  );
}
