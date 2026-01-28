import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container/Container.jsx";
import Grid from "../components/Grid/Grid.jsx";
import Stack from "../components/Stack/Stack.jsx";
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

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "SET_SEARCH", payload: form });
    navigate("/results", { state: form });
  };

  return (
    <Container as="section" className="page page--home">
      <div className="hero">
        <h1 className="page-title">{t("home.title")}</h1>
      </div>
      <form className="card search-card" onSubmit={handleSubmit} aria-label={t("home.title")}>
        <Grid>
          <div className="col-span-6">
            <InputText
              label={t("home.origin")}
              inputId="origin"
              helperId="origin-helper"
              helperText=""
              value={form.origin}
              onChange={handleChange("origin")}
              placeholder={t("home.origin")}
            />
          </div>
          <div className="col-span-6">
            <InputText
              label={t("home.destination")}
              inputId="destination"
              helperId="destination-helper"
              helperText=""
              value={form.destination}
              onChange={handleChange("destination")}
              placeholder={t("home.destination")}
            />
          </div>
          <div className="col-span-4">
            <InputText
              label={t("home.departDate")}
              inputId="departDate"
              helperId="departDate-helper"
              helperText=""
              value={form.departDate}
              onChange={handleChange("departDate")}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="col-span-4">
            <InputText
              label={t("home.returnDate")}
              inputId="returnDate"
              helperId="returnDate-helper"
              helperText=""
              value={form.returnDate}
              onChange={handleChange("returnDate")}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="col-span-4">
            <InputText
              label={t("home.passengers")}
              inputId="passengers"
              helperId="passengers-helper"
              helperText=""
              value={form.passengers}
              onChange={handleChange("passengers")}
              placeholder="1"
            />
          </div>
        </Grid>
        <Stack direction="row" gap="03" className="form-actions">
          <Button type="submit" variant="primary">{t("home.search")}</Button>
        </Stack>
      </form>
    </Container>
  );
}
