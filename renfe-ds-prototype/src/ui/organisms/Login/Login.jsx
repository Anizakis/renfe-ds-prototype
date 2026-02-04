import { useRef, useState } from "react";
import Container from "../../atoms/Container/Container.jsx";
import PageStack from "../../atoms/PageStack/PageStack.jsx";
import Stack from "../../atoms/Stack/Stack.jsx";
import InputText from "../../atoms/InputText/InputText.jsx";
import Button from "../../atoms/Button/Button.jsx";
import Link from "../../atoms/Link/Link.jsx";
import VisuallyHidden from "../../atoms/VisuallyHidden/VisuallyHidden.jsx";
import PasswordField from "../../molecules/PasswordField/PasswordField.jsx";
import Modal from "../../molecules/Modal/Modal.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import { useNavigate } from "react-router-dom";
import { useTravel } from "../../../app/store.jsx";
import "./Login.css";

function isPasswordValid(value) {
  const lengthOk = value.length >= 8 && value.length <= 16;
  const upperOk = /[A-ZÁÉÍÓÚÜÑ]/.test(value);
  const lowerOk = /[a-záéíóúüñ]/.test(value);
  const numberOk = /\d/.test(value);
  return lengthOk && upperOk && lowerOk && numberOk;
}

function SocialCircleButton({ label, text, onClick }) {
  return (
    <button
      type="button"
      className="login__social-button"
      aria-label={label}
      onClick={onClick}
    >
      <span className="login__social-text" aria-hidden="true">{text}</span>
    </button>
  );
}

export default function Login() {
  const { t } = useI18n();
  const { dispatch } = useTravel();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    username: false,
  });
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    const usernameOk = Boolean(form.username.trim());
    const passwordOk = Boolean(form.password) && isPasswordValid(form.password);
    if (!usernameOk || !passwordOk) return;
    dispatch({ type: "SET_AUTH", payload: { isAuthenticated: true } });
    setIsConfirmOpen(true);
  };

  const usernameValue = form.username.trim();
  const usernameDirty = touched.username || submitAttempted;
  const usernameError = usernameDirty && !usernameValue;
  const usernameSuccess = usernameDirty && Boolean(usernameValue);
  const usernameHelper = usernameError
    ? t("auth.input.required")
    : usernameSuccess
      ? t("auth.input.success")
      : "";
  const usernameState = usernameError ? "error" : usernameSuccess ? "success" : "default";

  return (
    <Container as="section">
      <PageStack className="login" align="stretch" textAlign="left">
        <div className="login__grid ds-grid">
          <Stack className="login__card" gap="05">
            <Stack as="header" className="login__header" gap="02">
              <h1 className="login__title">{t("auth.login.title")}</h1>
            </Stack>

            <form className="login__form" onSubmit={handleSubmit} autoComplete="off">
              <Stack className="login__fields" gap="04">
                <InputText
                  label={<VisuallyHidden as="span">{t("auth.login.usernameEmail")}</VisuallyHidden>}
                  inputId="login-username"
                  helperText={usernameHelper}
                  hideHelper={false}
                  state={usernameState}
                  placeholder={t("auth.login.usernameEmail")}
                  value={form.username}
                  onChange={handleChange}
                  inputProps={{
                    name: "username",
                    type: "text",
                    autoComplete: "username",
                    required: true,
                  }}
                />
                <PasswordField
                  label={t("auth.password.label")}
                  inputId="login-password"
                  value={form.password}
                  onChange={handleChange}
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder={t("auth.login.password")}
                  showLabel={false}
                  forceTouched={submitAttempted}
                />
              </Stack>

              <div className="login__row">
                <Link href="/forgot-password" className="login__forgot">
                  {t("auth.login.forgot")}
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="l"
                className="login__submit"
                ref={submitRef}
              >
                {t("auth.login.submit")}
              </Button>
            </form>

            <div className="login__divider" role="separator" aria-label={t("auth.login.signInWith")}>
              <span className="login__divider-text">{t("auth.login.signInWith")}</span>
            </div>

            <div className="login__social">
              <SocialCircleButton label={t("auth.social.facebook")} text="f" />
              <SocialCircleButton label={t("auth.social.twitter")} text="x" />
              <SocialCircleButton label={t("auth.social.google")} text="G" />
            </div>

            <p className="login__footer">
              {t("auth.login.noAccount")} <Link href="/register">{t("auth.login.signUp")}</Link>
            </p>
          </Stack>
        </div>
      </PageStack>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          navigate("/");
        }}
        titleId="login-confirm-title"
        descriptionId="login-confirm-desc"
        triggerRef={submitRef}
      >
        <div className="login__confirm-modal">
          <h2 id="login-confirm-title" className="section-title">
            {t("auth.login.confirmTitle")}
          </h2>
          <p id="login-confirm-desc">{t("auth.login.confirmBody")}</p>
          <div className="form-actions">
            <Button
              variant="primary"
              onClick={() => {
                setIsConfirmOpen(false);
                navigate("/");
              }}
            >
              {t("auth.login.confirmCta")}
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
