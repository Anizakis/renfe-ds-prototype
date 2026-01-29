import { useMemo, useState } from "react";
import InputText from "../InputText/InputText.jsx";
import Button from "../Button/Button.jsx";
import Icon from "../../ui/Icon/Icon.jsx";
import { useI18n } from "../../app/i18n.jsx";
import "./DatePicker.css";

function toIso(date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value) {
  if (!value) return null;
  const parts = value.trim().split(/[\./-]/);
  if (parts.length < 2) return null;
  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = parts[2] ? Number(parts[2]) : new Date().getFullYear();
  if (!day || month < 0 || month > 11) return null;
  const date = new Date(year, month, day);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatDate(value, locale) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
}

function getMonthMatrix(baseDate) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const startWeekday = (start.getDay() + 6) % 7; // Monday = 0
  const days = [];
  for (let i = 0; i < startWeekday; i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= end.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }
  return days;
}

export default function DatePicker({
  tripType,
  departDate,
  returnDate,
  onChange,
}) {
  const { t, language } = useI18n();
  const locale = language === "en" ? "en-US" : "es-ES";
  const [isOpen, setIsOpen] = useState(false);
  const [draftDepart, setDraftDepart] = useState(departDate ? formatDate(departDate, locale) : "");
  const [draftReturn, setDraftReturn] = useState(returnDate ? formatDate(returnDate, locale) : "");

  const baseMonth = useMemo(() => {
    return departDate ? new Date(departDate) : new Date();
  }, [departDate]);
  const nextMonth = useMemo(() => {
    const d = new Date(baseMonth);
    d.setMonth(d.getMonth() + 1);
    return d;
  }, [baseMonth]);

  const monthDays = getMonthMatrix(baseMonth);
  const nextMonthDays = getMonthMatrix(nextMonth);

  const handleSelect = (date) => {
    if (!date) return;
    const iso = toIso(date);
    if (tripType === "oneWay") {
      onChange?.({ departDate: iso, returnDate: "" });
      setDraftDepart(formatDate(iso, locale));
      setDraftReturn("");
      setIsOpen(false);
      return;
    }
    if (!departDate || (returnDate && iso < departDate)) {
      onChange?.({ departDate: iso, returnDate: "" });
      setDraftDepart(formatDate(iso, locale));
      setDraftReturn("");
      return;
    }
    if (!returnDate && iso >= departDate) {
      onChange?.({ departDate, returnDate: iso });
      setDraftReturn(formatDate(iso, locale));
      setIsOpen(false);
    }
  };

  const handleInputBlur = (type) => (event) => {
    const parsed = parseDate(event.target.value);
    if (!parsed) return;
    const iso = toIso(parsed);
    if (type === "depart") {
      onChange?.({ departDate: iso, returnDate: tripType === "roundTrip" ? returnDate : "" });
    } else if (tripType === "roundTrip") {
      onChange?.({ departDate, returnDate: iso });
    }
  };

  return (
    <div className="date-picker">
      <div className="date-picker__fields">
        <InputText
          label={t("home.departDate")}
          inputId="depart-date"
          helperId="depart-date-helper"
          helperText=""
          showCounter={false}
          hideHelper={false}
          placeholder="dd/mm/aa"
          value={draftDepart}
          onChange={(event) => setDraftDepart(event.target.value)}
          inputProps={{ onFocus: () => setIsOpen(true), onBlur: handleInputBlur("depart") }}
          size="l"
        />
        {tripType === "roundTrip" && (
          <InputText
            label={t("home.returnDate")}
            inputId="return-date"
            helperId="return-date-helper"
            helperText=""
            showCounter={false}
            hideHelper={false}
            placeholder="dd/mm/aa"
            value={draftReturn}
            onChange={(event) => setDraftReturn(event.target.value)}
            inputProps={{ onFocus: () => setIsOpen(true), onBlur: handleInputBlur("return") }}
            size="l"
          />
        )}
      </div>

      {isOpen && (
        <div className="date-picker__panel" role="dialog" aria-label={t("home.dates")}
          onMouseDown={(event) => event.preventDefault()}
        >
          <div className="date-picker__panel-header">
            <span className="date-picker__panel-title">{t("home.dates")}</span>
            <button
              type="button"
              className="date-picker__close"
              aria-label={t("common.accept")}
              onClick={() => setIsOpen(false)}
            >
              <Icon name="close" size="sm" decorative />
            </button>
          </div>
          <div className="date-picker__months">
            {[{ date: baseMonth, days: monthDays }, { date: nextMonth, days: nextMonthDays }].map((month) => {
              const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month.date);
              return (
                <div key={monthLabel} className="date-picker__month">
                  <div className="date-picker__month-title">{monthLabel}</div>
                  <div className="date-picker__week">
                    {t("home.weekDays").map((label) => (
                      <span key={label} className="date-picker__weekday">{label}</span>
                    ))}
                  </div>
                  <div className="date-picker__grid">
                    {month.days.map((day, idx) => {
                      if (!day) return <span key={`empty-${idx}`} className="date-picker__cell is-empty" />;
                      const iso = toIso(day);
                      const isSelected = iso === departDate || iso === returnDate;
                      const isInRange = departDate && returnDate && iso > departDate && iso < returnDate;
                      return (
                        <button
                          key={iso}
                          type="button"
                          className={[
                            "date-picker__cell",
                            isSelected ? "is-selected" : "",
                            isInRange ? "is-range" : "",
                          ].filter(Boolean).join(" ")}
                          onClick={() => handleSelect(day)}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="date-picker__actions">
            <Button
              variant="tertiary"
              size="s"
              onClick={() => onChange?.({ departDate: "", returnDate: "" })}
            >
              {t("home.resetDates")}
            </Button>
            <Button variant="primary" size="s" onClick={() => setIsOpen(false)}>
              {t("common.accept")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
