import { useState } from "react";
import Container from "../../atoms/Container/Container.jsx";
import PageStack from "../../atoms/PageStack/PageStack.jsx";
import Stack from "../../atoms/Stack/Stack.jsx";
import InputText from "../../atoms/InputText/InputText.jsx";
import Button from "../../atoms/Button/Button.jsx";
import Link from "../../atoms/Link/Link.jsx";
import VisuallyHidden from "../../atoms/VisuallyHidden/VisuallyHidden.jsx";
import PasswordField from "../../molecules/PasswordField/PasswordField.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import "./Login.css";

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
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    username: false,
  });

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
  };

  const usernameValue = form.username.trim();
  const usernameDirty = touched.username;
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
                />
              </Stack>

              <div className="login__row">
                <Link href="/forgot-password" className="login__forgot">
                  {t("auth.login.forgot")}
                </Link>
              </div>

              <Button type="submit" variant="primary" size="l" className="login__submit">
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
    </Container>
  );
}
