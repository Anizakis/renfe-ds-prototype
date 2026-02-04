import { useRef, useState } from "react";
import Container from "../../atoms/Container/Container.jsx";
import PageStack from "../../atoms/PageStack/PageStack.jsx";
import Stack from "../../atoms/Stack/Stack.jsx";
import InputText from "../../atoms/InputText/InputText.jsx";
import Dropdown from "../../atoms/Dropdown/Dropdown.jsx";
import Checkbox from "../../atoms/Checkbox/Checkbox.jsx";
import Button from "../../atoms/Button/Button.jsx";
import PasswordField from "../../molecules/PasswordField/PasswordField.jsx";
import Modal from "../../molecules/Modal/Modal.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import { useNavigate } from "react-router-dom";
import { useTravel } from "../../../app/store.jsx";
import "./RegisterForm.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LETTERS_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
const DNI_REGEX = /^\d{8}\s?[A-Za-z]$/;
const PHONE_REGEX = /^\d{9}$/;

function isPasswordValid(value) {
  const lengthOk = value.length >= 8 && value.length <= 16;
  const upperOk = /[A-ZÁÉÍÓÚÜÑ]/.test(value);
  const lowerOk = /[a-záéíóúüñ]/.test(value);
  const numberOk = /\d/.test(value);
  return lengthOk && upperOk && lowerOk && numberOk;
}

export default function RegisterForm() {
  const { t } = useI18n();
  const { dispatch } = useTravel();
  const navigate = useNavigate();
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
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const submitRef = useRef(null);

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
    setSubmitAttempted(true);
    setTouched((prev) => ({
      ...prev,
      email: true,
      password: true,
      docNumber: true,
      phone: true,
      firstName: true,
      lastName1: true,
      lastName2: true,
      birthDate: true,
      postalCode: true,
    }));
    const passwordOk = isPasswordValid(form.password || "");
    const termsOk = form.acceptTerms;
    const emailOk = Boolean(form.email.trim()) && EMAIL_REGEX.test(form.email.trim());
    const docOk = Boolean(form.docNumber.trim())
      && (form.docType !== "dni" || DNI_REGEX.test(form.docNumber.trim()));
    const phoneOk = Boolean(form.phone.trim()) && PHONE_REGEX.test(form.phone.trim());
    const firstNameOk = Boolean(form.firstName.trim()) && LETTERS_REGEX.test(form.firstName.trim());
    const lastName1Ok = Boolean(form.lastName1.trim()) && LETTERS_REGEX.test(form.lastName1.trim());
    const lastName2Ok = Boolean(form.lastName2.trim()) && LETTERS_REGEX.test(form.lastName2.trim());
    const birthDateOk = Boolean(form.birthDate.trim());
    const postalOk = Boolean(form.postalCode.trim());
    const fieldsOk = emailOk && docOk && phoneOk && firstNameOk && lastName1Ok && lastName2Ok && birthDateOk && postalOk;
    if (!passwordOk || !termsOk || !fieldsOk) return;
    const docTypeMap = {
      dni: "DNI",
      nie: "NIE",
      passport: "Pasaporte",
    };
    dispatch({ type: "SET_PROFILE", payload: {
      nombre: form.firstName.trim(),
      apellido1: form.lastName1.trim(),
      apellido2: form.lastName2.trim(),
      docType: docTypeMap[form.docType] ?? "DNI",
      docNumber: form.docNumber.trim(),
      email: form.email.trim(),
      phonePrefix: form.prefix,
      phone: form.phone.trim(),
    } });
    dispatch({ type: "SET_AUTH", payload: { isAuthenticated: true } });
    setIsConfirmOpen(true);
  };

  const getFieldStatus = (name, rawValue) => {
    const isTouched = touched[name] || submitAttempted;
    if (!isTouched) {
      return { helperText: "", state: "default" };
    }

    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

    if (!value) {
      return { helperText: t("auth.input.required"), state: "error" };
    }

    if (name === "email" && !EMAIL_REGEX.test(value)) {
      return { helperText: t("auth.input.email"), state: "error" };
    }

    if ((name === "firstName" || name === "lastName1" || name === "lastName2")
      && !LETTERS_REGEX.test(value)) {
      return { helperText: t("auth.register.errors.lettersOnly"), state: "error" };
    }

    if (name === "docNumber" && form.docType === "dni" && !DNI_REGEX.test(value)) {
      return { helperText: t("auth.register.errors.docFormat"), state: "error" };
    }

    if (name === "phone" && !PHONE_REGEX.test(value)) {
      return { helperText: t("auth.register.errors.phoneFormat"), state: "error" };
    }

    return { helperText: t("auth.input.success"), state: "success" };
  };

  const emailStatus = getFieldStatus("email", form.email);
  const docNumberStatus = getFieldStatus("docNumber", form.docNumber);
  const phoneStatus = getFieldStatus("phone", form.phone);
  const firstNameStatus = getFieldStatus("firstName", form.firstName);
  const lastName1Status = getFieldStatus("lastName1", form.lastName1);
  const lastName2Status = getFieldStatus("lastName2", form.lastName2);
  const birthDateStatus = getFieldStatus("birthDate", form.birthDate);
  const postalCodeStatus = getFieldStatus("postalCode", form.postalCode);
  const showTermsError = submitAttempted && !form.acceptTerms;

  return (
    <Container as="section">
      <PageStack className="register" align="stretch" textAlign="left">
        <div className="register__grid ds-grid">
          <Stack className="register__card" gap="06">
            <Stack as="header" className="register__header" gap="02">
              <h1 className="register__title">{t("auth.register.title")}</h1>
              <p className="register__subtitle">{t("auth.register.subtitle")}</p>
            </Stack>

            <form className="register__form" onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="register__section">
                <h2 className="register__section-title">{t("auth.register.sections.basic")}</h2>
                <div className="register__fields">
                  <div className={`register__field register__field--email ${form.email ? "is-filled" : ""}`.trim()}>
                    <InputText
                      label={t("auth.register.email")}
                      inputId="register-email"
                      helperText={emailStatus.helperText}
                      hideHelper={false}
                      state={emailStatus.state}
                      placeholder={t("auth.register.email")}
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
                  </div>
                  <div className={`register__field register__field--password ${form.password ? "is-filled" : ""}`.trim()}>
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
                      forceTouched={submitAttempted}
                    />
                  </div>
                  <div className="register__field register__field--doc-type is-filled">
                    <Dropdown
                      label={t("auth.register.docType")}
                      value={form.docType}
                      onChange={(value) => setForm((prev) => ({ ...prev, docType: value }))}
                      layout="stacked"
                      className="register__dropdown is-filled"
                      options={[
                        { value: "dni", label: t("auth.register.docOptions.dni") },
                        { value: "nie", label: t("auth.register.docOptions.nie") },
                        { value: "passport", label: t("auth.register.docOptions.passport") },
                      ]}
                    />
                  </div>
                  <div className={`register__field register__field--doc-number ${form.docNumber ? "is-filled" : ""}`.trim()}>
                    <InputText
                      label={t("auth.register.docNumber")}
                      inputId="register-doc-number"
                      helperText={docNumberStatus.helperText}
                      hideHelper={false}
                      state={docNumberStatus.state}
                      placeholder={t("auth.register.docNumber")}
                      value={form.docNumber}
                      onChange={handleChange}
                      inputProps={{
                        name: "docNumber",
                        type: "text",
                        maxLength: 9,
                        required: true,
                        onBlur: handleBlur("docNumber"),
                      }}
                    />
                  </div>
                  <div className="register__field register__field--prefix is-filled">
                    <Dropdown
                      label={t("auth.register.prefix")}
                      value={form.prefix}
                      onChange={(value) => setForm((prev) => ({ ...prev, prefix: value }))}
                      layout="stacked"
                      className="register__dropdown is-filled"
                      options={[
                        { value: "+34", label: "+34" },
                        { value: "+33", label: "+33" },
                        { value: "+351", label: "+351" },
                      ]}
                    />
                  </div>
                  <div className={`register__field register__field--phone ${form.phone ? "is-filled" : ""}`.trim()}>
                    <InputText
                      label={t("auth.register.phone")}
                      inputId="register-phone"
                      helperText={phoneStatus.helperText}
                      hideHelper={false}
                      state={phoneStatus.state}
                      placeholder={t("auth.register.phone")}
                      value={form.phone}
                      onChange={handleChange}
                      inputProps={{
                        name: "phone",
                        type: "tel",
                        autoComplete: "tel",
                        maxLength: 9,
                        inputMode: "numeric",
                        required: true,
                        onBlur: handleBlur("phone"),
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="register__section">
                <h2 className="register__section-title">{t("auth.register.sections.personal")}</h2>
                <div className="register__fields register__fields--personal-top">
                  <div className={`register__field register__field--sex ${form.sex ? "is-filled" : ""}`.trim()}>
                    <Dropdown
                      label={t("auth.register.sex")}
                      value={form.sex}
                      onChange={(value) => setForm((prev) => ({ ...prev, sex: value }))}
                      layout="stacked"
                      className={`register__dropdown ${form.sex ? "is-filled" : ""}`.trim()}
                      options={[
                        { value: "", label: t("auth.register.sexOptions.placeholder") },
                        { value: "female", label: t("auth.register.sexOptions.female") },
                        { value: "male", label: t("auth.register.sexOptions.male") },
                        { value: "other", label: t("auth.register.sexOptions.other") },
                      ]}
                    />
                  </div>
                  <div className={`register__field register__field--first-name ${form.firstName ? "is-filled" : ""}`.trim()}>
                    <InputText
                      label={t("auth.register.firstName")}
                      inputId="register-first-name"
                      helperText={firstNameStatus.helperText}
                      hideHelper={false}
                      state={firstNameStatus.state}
                      placeholder={t("auth.register.firstName")}
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
                  </div>
                  <div className={`register__field register__field--last-name1 ${form.lastName1 ? "is-filled" : ""}`.trim()}>
                    <InputText
                      label={t("auth.register.lastName1")}
                      inputId="register-last-name1"
                      helperText={lastName1Status.helperText}
                      hideHelper={false}
                      state={lastName1Status.state}
                      placeholder={t("auth.register.lastName1")}
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
                  </div>
                  <div className={`register__field register__field--last-name2 ${form.lastName2 ? "is-filled" : ""}`.trim()}>
                    <InputText
                      label={t("auth.register.lastName2")}
                      inputId="register-last-name2"
                      helperText={lastName2Status.helperText}
                      hideHelper={false}
                      state={lastName2Status.state}
                      placeholder={t("auth.register.lastName2")}
                      value={form.lastName2}
                      onChange={handleChange}
                      inputProps={{
                        name: "lastName2",
                        type: "text",
                        onBlur: handleBlur("lastName2"),
                      }}
                    />
                  </div>
                  </div>
                  <div className="register__fields register__fields--personal-bottom">
                  <div className={`register__field register__field--birth-date ${form.birthDate ? "is-filled" : ""}`.trim()}>
                    <InputText
                      label={t("auth.register.birthDate")}
                      inputId="register-birth-date"
                      helperText={birthDateStatus.helperText}
                      hideHelper={false}
                      state={birthDateStatus.state}
                      placeholder={t("auth.register.birthDate")}
                      value={form.birthDate}
                      onChange={handleChange}
                      inputProps={{
                        name: "birthDate",
                        type: "date",
                        required: true,
                        onBlur: handleBlur("birthDate"),
                      }}
                    />
                  </div>
                  <div className="register__field register__field--country is-filled">
                    <Dropdown
                      label={t("auth.register.country")}
                      value={form.country}
                      onChange={(value) => setForm((prev) => ({ ...prev, country: value }))}
                      layout="stacked"
                      className="register__dropdown is-filled"
                      options={[
                        { value: "ES", label: t("auth.register.countryOptions.es") },
                        { value: "PT", label: t("auth.register.countryOptions.pt") },
                        { value: "FR", label: t("auth.register.countryOptions.fr") },
                      ]}
                    />
                  </div>
                  <div className={`register__field register__field--postal ${form.postalCode ? "is-filled" : ""}`.trim()}>
                    <InputText
                      label={t("auth.register.postalCode")}
                      inputId="register-postal-code"
                      helperText={postalCodeStatus.helperText}
                      hideHelper={false}
                      state={postalCodeStatus.state}
                      placeholder={t("auth.register.postalCode")}
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
              </div>

              <details className="register__details">
                <summary className="register__details-summary">
                  {t("auth.register.dataTreatment.title")} {" "}
                  <span className="register__details-link">{t("auth.register.dataTreatment.readMore")}</span>
                </summary>
                <div className="register__details-body">
                  <p className="register__details-text">
                    {t("auth.register.dataTreatment.body")}
                  </p>
                </div>
              </details>

              <div className="register__checkboxes">
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
                {showTermsError && (
                  <div className="register__checkbox-error" role="alert">
                    {t("auth.register.errors.acceptTerms")}
                  </div>
                )}
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

              <div className="register__actions">
                <Button type="submit" variant="primary" size="l" ref={submitRef}>
                  {t("auth.register.submit")}
                </Button>
              </div>
            </form>
          </Stack>
        </div>
      </PageStack>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          navigate("/");
        }}
        titleId="register-confirm-title"
        descriptionId="register-confirm-desc"
        triggerRef={submitRef}
      >
        <div className="register__confirm-modal">
          <h2 id="register-confirm-title" className="section-title">
            {t("auth.register.confirmTitle")}
          </h2>
          <p id="register-confirm-desc">{t("auth.register.confirmBody")}</p>
          <div className="form-actions">
            <Button
              variant="primary"
              onClick={() => {
                setIsConfirmOpen(false);
                navigate("/");
              }}
            >
              {t("auth.register.confirmCta")}
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
