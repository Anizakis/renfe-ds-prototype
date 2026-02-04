import { useEffect, useMemo, useRef, useState } from "react";
import { InputText } from "../../atoms";
import Icon from "../../Icon/Icon.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import "./DatePicker.css";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

function pad2(value) {
  return String(value).padStart(2, "0");
}

function toIso(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  const next = new Date(date);
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + amount);
  const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, maxDay));
  return next;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function isBefore(a, b) {
  return a.getTime() < b.getTime();
}

function isAfter(a, b) {
  return a.getTime() > b.getTime();
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function normalizeDigits(value) {
  return value.replace(/\D/g, "").slice(0, 8);
}

function formatFromDigits(digits) {
  const parts = [];
  if (digits.length <= 2) return digits;
  parts.push(digits.slice(0, 2));
  if (digits.length <= 4) return `${parts[0]}-${digits.slice(2)}`;
  parts.push(digits.slice(2, 4));
  parts.push(digits.slice(4));
  return parts.filter(Boolean).join("-");
}

function caretFromDigitsCount(count) {
  if (count <= 2) return count;
  if (count <= 4) return count + 1;
  return count + 2;
}

function parseDigitsToDate(digits) {
  if (digits.length !== 8) return null;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
  if (year < MIN_YEAR || year > MAX_YEAR) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function buildMonthMatrix(baseDate) {
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

function formatMonthTitle(date, locale, language) {
  const label = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
  if (language === "es" && label) {
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  return label;
}

export default function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  required = false,
  inputId,
  helperId,
  ariaLabel,
}) {
  const { t, language } = useI18n();
  const locale = language === "en" ? "en-US" : "es-ES";
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? formatDate(value) : "");
  const [visibleMonthStart, setVisibleMonthStart] = useState(
    startOfMonth(value ? new Date(value) : new Date())
  );
  const [focusedDate, setFocusedDate] = useState(value ? new Date(value) : new Date());
  const [showValidation, setShowValidation] = useState(false);

  const selectedDate = value ? new Date(value) : null;
  const min = minDate ? stripTime(new Date(minDate)) : null;
  const max = maxDate ? stripTime(new Date(maxDate)) : null;

  useEffect(() => {
    const nextValue = value ? new Date(value) : null;
    const monthStart = startOfMonth(nextValue ?? new Date());
    queueMicrotask(() => {
      setInputValue(nextValue ? formatDate(nextValue) : "");
      setVisibleMonthStart(monthStart);
      setFocusedDate(nextValue ?? new Date());
    });
  }, [value]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleClickOutside = (event) => {
      if (panelRef.current?.contains(event.target) || containerRef.current?.contains(event.target)) {
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const focusTarget = panelRef.current.querySelector(
      `[data-date="${toIso(focusedDate)}"]`
    );
    focusTarget?.focus();
  }, [isOpen, focusedDate]);

  const validation = useMemo(() => {
    const digits = normalizeDigits(inputValue);
    if (!digits) {
      return { status: "empty", date: null };
    }
    if (digits.length < 8) {
      return { status: "incomplete", date: null };
    }
    const parsed = parseDigitsToDate(digits);
    if (!parsed) {
      return { status: "invalid", date: null };
    }
    if ((min && isBefore(parsed, min)) || (max && isAfter(parsed, max))) {
      return { status: "invalid", date: null };
    }
    return { status: "valid", date: parsed };
  }, [inputValue, min, max]);

  const showError = showValidation && (
    (required && validation.status === "empty")
    || validation.status === "invalid"
    || validation.status === "incomplete"
  );

  const helperText = showError
    ? (
      validation.status === "incomplete"
        ? t("home.dateIncomplete")
        : validation.status === "empty"
          ? t("home.dateRequired")
          : t("home.dateInvalid")
    )
    : "\u00A0";

  const isDateDisabled = (date) => {
    if (min && isBefore(date, min)) return true;
    if (max && isAfter(date, max)) return true;
    return false;
  };

  const monthA = visibleMonthStart;
  const monthB = addMonths(monthA, 1);
  const monthDaysA = buildMonthMatrix(monthA);
  const monthDaysB = buildMonthMatrix(monthB);

  const applyCaret = (nextCaret) => {
    requestAnimationFrame(() => {
      if (!inputRef.current) return;
      inputRef.current.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const updateInputValue = (rawValue, caretPosition) => {
    const digitsBeforeCaret = rawValue.slice(0, caretPosition).replace(/\D/g, "").length;
    const digits = normalizeDigits(rawValue);
    const formatted = formatFromDigits(digits);
    setInputValue(formatted);
    setShowValidation(false);
    applyCaret(caretFromDigitsCount(digitsBeforeCaret));
  };

  const handleInputChange = (event) => {
    const rawValue = event.target.value;
    const caret = event.target.selectionStart ?? rawValue.length;
    updateInputValue(rawValue, caret);
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    if (key !== "Backspace" && key !== "Delete" && key !== "Enter") return;
    if (key === "Enter") {
      setShowValidation(true);
      if (validation.status === "valid" && validation.date) {
        onChange?.(validation.date);
        setVisibleMonthStart(startOfMonth(validation.date));
        setFocusedDate(validation.date);
        setIsOpen(false);
      }
      return;
    }

    const valueText = inputValue;
    const caret = event.target.selectionStart ?? valueText.length;
    const selectionEnd = event.target.selectionEnd ?? caret;
    if (caret !== selectionEnd) return;

    if (key === "Backspace" && caret > 0 && valueText[caret - 1] === "-") {
      event.preventDefault();
      const digits = normalizeDigits(valueText);
      const digitsBeforeCaret = valueText.slice(0, caret).replace(/\D/g, "").length;
      const removeIndex = Math.max(digitsBeforeCaret - 1, 0);
      const nextDigits = digits.slice(0, removeIndex) + digits.slice(removeIndex + 1);
      const formatted = formatFromDigits(nextDigits);
      setInputValue(formatted);
      applyCaret(caretFromDigitsCount(removeIndex));
    }

    if (key === "Delete" && valueText[caret] === "-") {
      event.preventDefault();
      const digits = normalizeDigits(valueText);
      const digitsBeforeCaret = valueText.slice(0, caret).replace(/\D/g, "").length;
      const removeIndex = Math.min(digitsBeforeCaret, digits.length - 1);
      const nextDigits = digits.slice(0, removeIndex) + digits.slice(removeIndex + 1);
      const formatted = formatFromDigits(nextDigits);
      setInputValue(formatted);
      applyCaret(caretFromDigitsCount(removeIndex));
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text");
    if (!pasted) return;
    const digits = normalizeDigits(pasted);
    if (!digits) return;
    event.preventDefault();
    const formatted = formatFromDigits(digits);
    setInputValue(formatted);
    setShowValidation(false);
    applyCaret(formatted.length);
  };

  const handleBlur = () => {
    setShowValidation(true);
    if (validation.status === "valid" && validation.date) {
      onChange?.(validation.date);
      setVisibleMonthStart(startOfMonth(validation.date));
      setFocusedDate(validation.date);
    }
  };

  const selectDate = (date) => {
    if (!date || isDateDisabled(date)) return;
    onChange?.(date);
    setInputValue(formatDate(date));
    setVisibleMonthStart(startOfMonth(date));
    setFocusedDate(date);
    setIsOpen(false);
  };

  const handleCalendarKeyDown = (event) => {
    if (!isOpen) return;
    const { key } = event;
    const dayDelta = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    }[key];

    if (dayDelta) {
      event.preventDefault();
      let next = addDays(focusedDate, dayDelta);
      let guard = 0;
      while (isDateDisabled(next) && guard < 365) {
        next = addDays(next, dayDelta > 0 ? 1 : -1);
        guard += 1;
      }
      setFocusedDate(next);
      if (next.getMonth() !== visibleMonthStart.getMonth()
        || next.getFullYear() !== visibleMonthStart.getFullYear()) {
        setVisibleMonthStart(startOfMonth(next));
      }
      return;
    }

    if (key === "PageUp" || key === "PageDown") {
      event.preventDefault();
      const delta = key === "PageUp" ? -1 : 1;
      const next = addMonths(focusedDate, delta);
      setFocusedDate(next);
      setVisibleMonthStart(startOfMonth(next));
      return;
    }

    if (key === "Enter") {
      event.preventDefault();
      selectDate(focusedDate);
      return;
    }

    if (key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  const handlePrevMonth = () => {
    const next = addMonths(visibleMonthStart, -1);
    setVisibleMonthStart(startOfMonth(next));
  };

  const handleNextMonth = () => {
    const next = addMonths(visibleMonthStart, 1);
    setVisibleMonthStart(startOfMonth(next));
  };

  const panelTitleId = `${inputId ?? "date-picker"}-panel-title`;

  return (
    <div className="date-picker">
      <div className="date-picker__input" ref={containerRef}>
        <InputText
          label={label}
          inputId={inputId}
          helperId={helperId}
          helperText={helperText}
          showCounter={false}
          hideHelper={false}
          placeholder={t("home.datePlaceholder")}
          value={inputValue}
          onChange={handleInputChange}
          size="l"
          disabled={disabled}
          state={showError ? "error" : "default"}
          inputRef={inputRef}
          inputProps={{
            onFocus: () => {
              // Solo abrir si la fecha es inválida o incompleta
              if (showError) setIsOpen(true);
            },
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            onPaste: handlePaste,
            inputMode: "numeric",
            "aria-label": ariaLabel ?? t("home.dateAriaLabel"),
          }}
          leadingIcon={
            <button
              type="button"
              className="date-picker__icon"
              aria-label={t("home.openCalendar")}
              tabIndex={-1}
              onClick={e => {
                e.preventDefault();
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              disabled={disabled}
              style={{ background: "none", border: 0, padding: 0, marginRight: 8, cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Icon name="calendar_month" size="sm" decorative />
            </button>
          }
        />
      </div>

      {isOpen && !disabled && (
        <div
          className={`date-picker__panel ${isOpen ? "is-open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={panelTitleId}
          onKeyDown={handleCalendarKeyDown}
          ref={panelRef}
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="date-picker__panel-header">
            <button
              type="button"
              className="date-picker__nav"
              onClick={handlePrevMonth}
              aria-label={t("home.prevMonth")}
            >
              <Icon name="chevron_left" size="sm" decorative />
            </button>
            <span className="date-picker__panel-title" id={panelTitleId}>{t("home.dates")}</span>
            <button
              type="button"
              className="date-picker__nav"
              onClick={handleNextMonth}
              aria-label={t("home.nextMonth")}
            >
              <Icon name="chevron_right" size="sm" decorative />
            </button>
          </div>
          <div className="date-picker__months">
            {[
              {
                date: monthA,
                days: monthDaysA,
              },
              {
                date: monthB,
                days: monthDaysB,
              },
            ].map((month, monthIndex) => {
              const monthLabel = formatMonthTitle(month.date, locale, language);
              const monthTitleId = `${inputId ?? "date-picker"}-month-${monthIndex}`;
              const weeks = [];
              for (let i = 0; i < month.days.length; i += 7) {
                weeks.push(month.days.slice(i, i + 7));
              }
              return (
                <div key={monthLabel} className="date-picker__month">
                  <div className="date-picker__month-title" id={monthTitleId}>{monthLabel}</div>
                  <div className="date-picker__grid" role="grid" aria-labelledby={monthTitleId}>
                    <div className="date-picker__week" role="row">
                      {t("home.weekDays").map((label) => (
                        <span key={label} className="date-picker__weekday" role="columnheader">{label}</span>
                      ))}
                    </div>
                    {weeks.map((week, weekIndex) => (
                      <div key={`${monthLabel}-week-${weekIndex}`} role="row">
                        {week.map((day, idx) => {
                          if (!day) {
                            return (
                              <span
                                key={`empty-${weekIndex}-${idx}`}
                                className="date-picker__cell is-empty"
                                role="gridcell"
                                aria-hidden="true"
                              />
                            );
                          }
                          const iso = toIso(day);
                          const selected = isSameDay(day, selectedDate);
                          const today = isSameDay(day, new Date());
                          const disabledDay = isDateDisabled(day);
                          return (
                            <button
                              key={iso}
                              type="button"
                              data-date={iso}
                              role="gridcell"
                              className={[
                                "date-picker__cell",
                                selected ? "is-selected" : "",
                                today ? "is-today" : "",
                              ].filter(Boolean).join(" ")}
                              onClick={() => selectDate(day)}
                              aria-selected={selected}
                              aria-disabled={disabledDay}
                              disabled={disabledDay}
                              tabIndex={selected || isSameDay(day, focusedDate) ? 0 : -1}
                              aria-label={new Intl.DateTimeFormat(locale, {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(day)}
                            >
                              {day.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}