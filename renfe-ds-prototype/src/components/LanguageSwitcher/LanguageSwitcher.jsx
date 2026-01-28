import "./LanguageSwitcher.css";
import { useI18n } from "../../app/i18n.jsx";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="language-switcher">
      <label className="language-switcher__label" htmlFor="lang-select">{t("common.language")}</label>
      <select
        id="lang-select"
        className="language-switcher__select"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
}
