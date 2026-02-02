import { useMemo, useRef } from "react";
import Icon from "../../Icon/Icon.jsx";
import { VisuallyHidden } from "../../atoms";
import { useI18n } from "../../../app/i18n.jsx";
import "./DayPickerStrip.css";

function formatDayLabel(date, locale) {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  return formatter.format(date);
}

function formatPrice(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export default function DayPickerStrip({
  days,
  activeDay,
  prices,
  availability,
  isLoading,
  onChange,
  onPrevRange,
  onNextRange,
}) {
  const { t, language } = useI18n();
  const listRef = useRef(null);
  const locale = language === "en" ? "en-US" : "es-ES";
  const today = useMemo(() => new Date(), []);

  const handleScroll = (direction) => {
    if (!listRef.current) return;
    const scrollAmount = listRef.current.clientWidth * 0.8;
    listRef.current.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (event) => {
    const currentIndex = days.findIndex((day) => day === activeDay);
    if (currentIndex === -1) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = days[Math.min(currentIndex + 1, days.length - 1)];
      onChange?.(next);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = days[Math.max(currentIndex - 1, 0)];
      onChange?.(prev);
    }
  };

  return (
    <div className="day-picker">
        <button
          type="button"
          className="day-picker__nav"
          onClick={() => (onPrevRange ? onPrevRange() : handleScroll("prev"))}
          aria-label={t("results.prevDays")}
        >
          <Icon name="chevron_left" size="md" decorative />
        </button>

        <div
          className="day-picker__list"
          role="tablist"
          aria-label={t("results.dayPickerLabel")}
          ref={listRef}
          onKeyDown={handleKeyDown}
        >
            {days.map((day) => {
            const date = new Date(day);
            const label = formatDayLabel(date, locale);
            const price = prices[day];
            const isAvailable = availability[day];
            const isSelected = day === activeDay;
            const isToday = isSameDay(date, today);
            return (
              <button
                key={day}
                type="button"
                role="tab"
                className={[
                  "day-tile",
                  isSelected ? "is-selected" : "",
                  !isAvailable ? "is-disabled" : "",
                  isLoading && isSelected ? "is-loading" : "",
                ].filter(Boolean).join(" ")}
                aria-selected={isSelected ? "true" : "false"}
                aria-disabled={!isAvailable ? "true" : undefined}
                disabled={!isAvailable}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onChange?.(day)}
              >
                <span className="day-tile__label">{label}</span>
                <span className="day-tile__price">
                  {isAvailable
                    ? price != null
                      ? `${t("results.priceFrom")} ${formatPrice(price, locale)}`
                      : t("results.noPrice")
                    : t("results.noAvailability")}
                </span>
                {isToday && <span className="day-tile__today">{t("results.today")}</span>}
                {isSelected && <span className="day-tile__indicator" aria-hidden="true" />}
                {isSelected && isLoading && (
                  <VisuallyHidden>{t("results.loadingDay")}</VisuallyHidden>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="day-picker__nav"
          onClick={() => (onNextRange ? onNextRange() : handleScroll("next"))}
          aria-label={t("results.nextDays")}
        >
          <Icon name="chevron_right" size="md" decorative />
        </button>
      </div>
  );
}