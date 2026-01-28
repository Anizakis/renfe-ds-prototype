import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container/Container.jsx";
import Grid from "../components/Grid/Grid.jsx";
import InputText from "../components/InputText/InputText.jsx";
import Button from "../components/Button/Button.jsx";
import { useTravel } from "../app/store.jsx";
import { useI18n } from "../app/i18n.jsx";
import "./pages.css";

export default function Home() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState(state.search);
  const [errors, setErrors] = useState({});

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSwap = () => {
    setForm((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.origin?.trim()) {
      nextErrors.origin = t("home.errors.originRequired");
    }
    if (!form.destination?.trim()) {
      nextErrors.destination = t("home.errors.destinationRequired");
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    dispatch({ type: "SET_SEARCH", payload: form });
    navigate("/results", { state: form });
  };

  const isReady = Boolean(form.origin?.trim() && form.destination?.trim());

  return (
    <Container as="section" className="page page--home">
      <Grid className="home-grid">
        <div className="search-card">
          <form
            className="home-search"
            onSubmit={handleSubmit}
            aria-label={t("home.title")}
          >
            <h1 className="home-search-title">{t("home.title")}</h1>
            <div className="home-search-grid">
              <div className="home-search-origin">
                <InputText
                  label={t("home.origin")}
                  inputId="origin"
                  helperId="origin-helper"
                  helperText={errors.origin}
                  state={errors.origin ? "error" : "default"}
                  showCounter={false}
                  hideLabel={!form.origin?.trim()}
                  hideHelper
                  value={form.origin}
                  onChange={handleChange("origin")}
                  placeholder={t("home.origin")}
                  size="l"
                />
              </div>
              <div className="home-search-swap">
                <Button
                  variant="tertiary"
                  size="l"
                  hasLeadingIcon
                  leadingIcon="swap_horiz"
                  aria-label={t("search.swap")}
                  onClick={handleSwap}
                />
              </div>
              <div className="home-search-destination">
                <InputText
                  label={t("home.destination")}
                  inputId="destination"
                  helperId="destination-helper"
                  helperText={errors.destination}
                  state={errors.destination ? "error" : "default"}
                  showCounter={false}
                  hideLabel={!form.destination?.trim()}
                  hideHelper
                  value={form.destination}
                  onChange={handleChange("destination")}
                  placeholder={t("home.destination")}
                  size="l"
                />
              </div>
              <div className="home-search-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="l"
                  disabled={!isReady}
                  className="home-search-button"
                >
                  {t("home.search")}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Grid>
    </Container>
  );
}
