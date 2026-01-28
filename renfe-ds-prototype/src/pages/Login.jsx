import Container from "../components/Container/Container.jsx";
import Stack from "../components/Stack/Stack.jsx";
import InputText from "../components/InputText/InputText.jsx";
import Button from "../components/Button/Button.jsx";
import { useI18n } from "../app/i18n.jsx";
import "./pages.css";

export default function Login() {
  const { t } = useI18n();

  return (
    <Container as="section" className="page">
      <h1 className="page-title">{t("login.title")}</h1>
      <div className="card">
        <Stack gap="04">
          <InputText
            label={t("login.email")}
            inputId="login-email"
            helperId="login-email-helper"
            helperText=""
            placeholder="email@example.com"
          />
          <InputText
            label={t("login.password")}
            inputId="login-password"
            helperId="login-password-helper"
            helperText=""
            placeholder="••••••••"
          />
          <Button variant="primary">{t("login.submit")}</Button>
        </Stack>
      </div>
    </Container>
  );
}
