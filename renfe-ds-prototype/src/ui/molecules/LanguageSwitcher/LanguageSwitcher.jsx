import "./LanguageSwitcher.css";
import { useI18n } from "../../../app/i18n.jsx";

export default function LanguageSwitcher({ label }) {
  const { language, setLanguage, t } = useI18n();
  const resolvedLabel = label ?? t("common.language");

  return (
    <div className="language-switcher">
      <label className="language-switcher__label" htmlFor="lang-select">{resolvedLabel}</label>
      <select
        id="lang-select"
        className="language-switcher__select"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="es">{t("common.languages.es")}</option>
        <option value="en">{t("common.languages.en")}</option>
      </select>
    </div>
  );
}