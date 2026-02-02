import { useState } from "react";
import Stack from "../../atoms/Stack/Stack.jsx";
import InputText from "../../atoms/InputText/InputText.jsx";
import Dropdown from "../../atoms/Dropdown/Dropdown.jsx";
import Checkbox from "../../atoms/Checkbox/Checkbox.jsx";
import Button from "../../atoms/Button/Button.jsx";
import PasswordField from "../../molecules/PasswordField/PasswordField.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import "./RegisterForm.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    email: "",
    password: "",
    docType: "dni",
    docNumber: "",
    prefix: "+34",
    phone: "",
    sex: "",
    firstName: "",
    lastName1: "",
    lastName2: "",
    birthDate: "",
    country: "ES",
    postalCode: "",
    acceptTerms: false,
    marketingConsent: false,
    dataShareConsent: false,
  });
  const [touched, setTouched] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleBlur = (name) => () => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleCheckbox = (name) => (checked) => {
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const getFieldStatus = (name, value, { optional = false, validator } = {}) => {
    if (!touched[name]) {
      return { helperText: "", state: "default" };
    }

    if (!value) {
      if (optional) {
        return { helperText: "", state: "default" };
      }
      return { helperText: t("auth.input.required"), state: "error" };
    }

    if (validator && !validator(value)) {
      return { helperText: t("auth.input.email"), state: "error" };
    }

    return { helperText: t("auth.input.success"), state: "success" };
  };

  const emailStatus = getFieldStatus("email", form.email, {
    validator: (value) => EMAIL_REGEX.test(value),
  });
  const docNumberStatus = getFieldStatus("docNumber", form.docNumber);
  const phoneStatus = getFieldStatus("phone", form.phone);
  const firstNameStatus = getFieldStatus("firstName", form.firstName);
  const lastName1Status = getFieldStatus("lastName1", form.lastName1);
  const lastName2Status = getFieldStatus("lastName2", form.lastName2, { optional: true });
  const birthDateStatus = getFieldStatus("birthDate", form.birthDate);
  const postalCodeStatus = getFieldStatus("postalCode", form.postalCode);

  return (
    <div className="register__grid ds-grid">
      <Stack className="register__card" gap="06">
        <Stack as="header" className="register__header" gap="02">
          <h1 className="register__title">{t("auth.register.title")}</h1>
          <p className="register__subtitle">{t("auth.register.subtitle")}</p>
        </Stack>

        <form className="register__form" onSubmit={handleSubmit} autoComplete="off">
          <div className="register__section">
            <h2 className="register__section-title">{t("auth.register.sections.basic")}</h2>
            <div className="register__fields">
              <InputText
                label={t("auth.register.email")}
                inputId="register-email"
                helperText={emailStatus.helperText}
                hideHelper={false}
                state={emailStatus.state}
                value={form.email}
                onChange={handleChange}
                inputProps={{
                  name: "email",
                  type: "email",
                  autoComplete: "email",
                  required: true,
                  onBlur: handleBlur("email"),
                }}
              />
              <PasswordField
                label={t("auth.password.label")}
                inputId="register-password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur("password")}
                name="password"
                autoComplete="new-password"
                required
                placeholder={t("auth.register.password")}
                showLabel
              />
              <Dropdown
                label={t("auth.register.docType")}
                value={form.docType}
                onChange={(value) => setForm((prev) => ({ ...prev, docType: value }))}
                options={[
                  { value: "dni", label: t("auth.register.docOptions.dni") },
                  { value: "nie", label: t("auth.register.docOptions.nie") },
                  { value: "passport", label: t("auth.register.docOptions.passport") },
                ]}
              />
              <InputText
                label={t("auth.register.docNumber")}
                inputId="register-doc-number"
                helperText={docNumberStatus.helperText}
                hideHelper={false}
                state={docNumberStatus.state}
                value={form.docNumber}
                onChange={handleChange}
                inputProps={{
                  name: "docNumber",
                  type: "text",
                  required: true,
                  onBlur: handleBlur("docNumber"),
                }}
              />
              <Dropdown
                label={t("auth.register.prefix")}
                value={form.prefix}
                onChange={(value) => setForm((prev) => ({ ...prev, prefix: value }))}
                options={[
                  { value: "+34", label: "+34" },
                  { value: "+33", label: "+33" },
                  { value: "+351", label: "+351" },
                ]}
              />
              <InputText
                label={t("auth.register.phone")}
                inputId="register-phone"
                helperText={phoneStatus.helperText}
                hideHelper={false}
                state={phoneStatus.state}
                value={form.phone}
                onChange={handleChange}
                inputProps={{
                  name: "phone",
                  type: "tel",
                  autoComplete: "tel",
                  required: true,
                  onBlur: handleBlur("phone"),
                }}
              />
            </div>
          </div>

          <div className="register__section">
            <h2 className="register__section-title">{t("auth.register.sections.personal")}</h2>
            <div className="register__fields">
              <Dropdown
                label={t("auth.register.sex")}
                value={form.sex}
                onChange={(value) => setForm((prev) => ({ ...prev, sex: value }))}
                options={[
                  { value: "", label: t("auth.register.sexOptions.placeholder") },
                  { value: "female", label: t("auth.register.sexOptions.female") },
                  { value: "male", label: t("auth.register.sexOptions.male") },
                  { value: "other", label: t("auth.register.sexOptions.other") },
                ]}
              />
              <InputText
                label={t("auth.register.firstName")}
                inputId="register-first-name"
                helperText={firstNameStatus.helperText}
                hideHelper={false}
                state={firstNameStatus.state}
                value={form.firstName}
                onChange={handleChange}
                inputProps={{
                  name: "firstName",
                  type: "text",
                  autoComplete: "given-name",
                  required: true,
                  onBlur: handleBlur("firstName"),
                }}
              />
              <InputText
                label={t("auth.register.lastName1")}
                inputId="register-last-name1"
                helperText={lastName1Status.helperText}
                hideHelper={false}
                state={lastName1Status.state}
                value={form.lastName1}
                onChange={handleChange}
                inputProps={{
                  name: "lastName1",
                  type: "text",
                  autoComplete: "family-name",
                  required: true,
                  onBlur: handleBlur("lastName1"),
                }}
              />
              <InputText
                label={t("auth.register.lastName2")}
                inputId="register-last-name2"
                helperText={lastName2Status.helperText}
                hideHelper={false}
                state={lastName2Status.state}
                value={form.lastName2}
                onChange={handleChange}
                inputProps={{
                  name: "lastName2",
                  type: "text",
                  onBlur: handleBlur("lastName2"),
                }}
              />
              <InputText
                label={t("auth.register.birthDate")}
                inputId="register-birth-date"
                helperText={birthDateStatus.helperText}
                hideHelper={false}
                state={birthDateStatus.state}
                value={form.birthDate}
                onChange={handleChange}
                inputProps={{
                  name: "birthDate",
                  type: "date",
                  required: true,
                  onBlur: handleBlur("birthDate"),
                }}
              />
              <Dropdown
                label={t("auth.register.country")}
                value={form.country}
                onChange={(value) => setForm((prev) => ({ ...prev, country: value }))}
                options={[
                  { value: "ES", label: t("auth.register.countryOptions.es") },
                  { value: "PT", label: t("auth.register.countryOptions.pt") },
                  { value: "FR", label: t("auth.register.countryOptions.fr") },
                ]}
              />
              <InputText
                label={t("auth.register.postalCode")}
                inputId="register-postal-code"
                helperText={postalCodeStatus.helperText}
                hideHelper={false}
                state={postalCodeStatus.state}
                value={form.postalCode}
                onChange={handleChange}
                inputProps={{
                  name: "postalCode",
                  type: "text",
                  autoComplete: "postal-code",
                  required: true,
                  onBlur: handleBlur("postalCode"),
                }}
              />
            </div>
          </div>

          <details className="register__details">
            <summary className="register__details-summary">
              {t("auth.register.dataTreatment.title")} {" "}
              <span className="register__details-link">{t("auth.register.dataTreatment.readMore")}</span>
            </summary>
            <div className="register__details-body">
              <label className="checkbox" htmlFor="register-accept-terms">
                <input
                  id="register-accept-terms"
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(event) => handleCheckbox("acceptTerms")(event.target.checked)}
                  required
                />
                <span className="checkbox__content">
                  <span className="checkbox__label">{t("auth.register.acceptTerms")}</span>
                </span>
              </label>
              <Checkbox
                label={t("auth.register.marketingConsent")}
                checked={form.marketingConsent}
                onChange={handleCheckbox("marketingConsent")}
              />
              <Checkbox
                label={t("auth.register.dataShareConsent")}
                checked={form.dataShareConsent}
                onChange={handleCheckbox("dataShareConsent")}
              />
            </div>
          </details>

          <div className="register__actions">
            <Button type="submit" variant="primary" size="l">
              {t("auth.register.submit")}
            </Button>
          </div>
        </form>
      </Stack>
    </div>
  );
}
