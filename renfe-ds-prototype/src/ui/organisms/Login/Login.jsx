import { useState } from "react";
import Container from "../../atoms/Container/Container.jsx";
import PageStack from "../../atoms/PageStack/PageStack.jsx";
import Stack from "../../atoms/Stack/Stack.jsx";
import InputText from "../../atoms/InputText/InputText.jsx";
import Checkbox from "../../atoms/Checkbox/Checkbox.jsx";
import Button from "../../atoms/Button/Button.jsx";
import Link from "../../atoms/Link/Link.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import "./Login.css";

export default function Login() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRememberChange = (checked) => {
    setForm((prev) => ({
      ...prev,
      remember: checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Container as="section">
      <PageStack className="login" align="stretch" textAlign="left">
        <div className="login__grid ds-grid">
          <Stack className="login__card" gap="05">
            <Stack as="header" className="login__header" gap="02">
              <h1 className="login__title">{t("login.welcomeTitle")}</h1>
              <p className="login__subtitle">{t("login.welcomeSubtitle")}</p>
            </Stack>

            <Button variant="secondary" size="l" className="login__provider">
              {t("login.google")}
            </Button>

            <div className="login__divider" role="separator" aria-label="or">
              <span className="login__divider-text">{t("login.divider")}</span>
            </div>

            <form className="login__form" onSubmit={handleSubmit} autoComplete="off">
              <Stack className="login__fields" gap="04">
                <InputText
                  label={t("login.email")}
                  inputId="login-email"
                  helperText="\u00A0"
                  hideHelper={false}
                  placeholder={t("login.emailPlaceholder")}
                  value={form.email}
                  onChange={handleChange}
                  inputProps={{
                    name: "email",
                    type: "email",
                    autoComplete: "email",
                  }}
                />
                <InputText
                  label={t("login.password")}
                  inputId="login-password"
                  helperText="\u00A0"
                  hideHelper={false}
                  placeholder={t("login.passwordPlaceholder")}
                  value={form.password}
                  onChange={handleChange}
                  inputProps={{
                    name: "password",
                    type: "password",
                    autoComplete: "current-password",
                  }}
                />
              </Stack>

              <div className="login__row">
                <Checkbox
                  label={t("login.remember")}
                  checked={form.remember}
                  onChange={handleRememberChange}
                />
                <Link href="/forgot-password" className="login__forgot">
                  {t("login.forgotPassword")}
                </Link>
              </div>

              <Button type="submit" variant="primary" size="l" className="login__submit">
                {t("login.submit")}
              </Button>
            </form>

            <p className="login__footer">
              {t("login.noAccount")} <Link href="/register">{t("login.signUp")}</Link>
            </p>
          </Stack>
        </div>
      </PageStack>
    </Container>
  );
}
