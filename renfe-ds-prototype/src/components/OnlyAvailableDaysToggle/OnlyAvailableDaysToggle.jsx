import Checkbox from "../Checkbox/Checkbox.jsx";
import { useI18n } from "../../app/i18n.jsx";
import "./OnlyAvailableDaysToggle.css";

export default function OnlyAvailableDaysToggle({ checked, onChange, label }) {
  const { t } = useI18n();
  const resolvedLabel = label ?? t("results.onlyShowAvailable");

  return (
    <div className="only-available-toggle">
      <Checkbox
        checked={checked}
        onChange={onChange}
        label={resolvedLabel}
      />
    </div>
  );
}
