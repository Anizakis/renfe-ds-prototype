import { useEffect, useMemo, useRef, useState } from "react";
import InputText from "../../atoms/InputText/InputText.jsx";
import Button from "../../atoms/Button/Button.jsx";
import RadioGroup from "../../atoms/RadioGroup/RadioGroup.jsx";
import { DatePicker } from "../../molecules";
import PassengerSelector from "../../molecules/PassengerSelector/PassengerSelector.jsx";
import { useTravel } from "../../../app/store.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import { getStationSuggestions, isValidStation } from "../../../app/stations.js";
import "./HomeSearch.css";

const SUGGESTIONS_LIMIT = 8;

function toIsoDate(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function HomeSearch({ onSubmit: onSubmitProp }) {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const [form, setForm] = useState(state.search);
  const [errors, setErrors] = useState({});
  const [openDropdown, setOpenDropdown] = useState({ origin: false, destination: false });
  const [activeIndex, setActiveIndex] = useState({ origin: -1, destination: -1 });
  const [focusedField, setFocusedField] = useState(null);
  const [stationsData, setStationsData] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [tripType, setTripType] = useState(form.returnDate ? "roundTrip" : "oneWay");
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setStationsLoading(true);
    import("../../data/stations.es.json")
      .then((module) => {
        if (!isMounted) return;
        setStationsData(module.default ?? []);
        setStationsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setStationsData([]);
        setStationsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const stationNames = useMemo(
    () => stationsData.map((station) => station.name).filter(Boolean),
    [stationsData]
  );

  const originSuggestions = useMemo(
    () => getStationSuggestions(form.origin, stationNames, SUGGESTIONS_LIMIT),
    [form.origin, stationNames]
  );

  const destinationSuggestions = useMemo(
    () => getStationSuggestions(form.destination, stationNames, SUGGESTIONS_LIMIT),
    [form.destination, stationNames]
  );

  const validateField = (field, value, { showRequired } = { showRequired: false }) => {
    if (stationsLoading) {
      return undefined;
    }
    if (!value?.trim()) {
      if (!showRequired) return undefined;
      return field === "origin"
        ? t("home.errors.originRequired")
        : t("home.errors.destinationRequired");
    }
    return isValidStation(value, stationNames)
      ? undefined
      : t("home.errors.stationInvalid");
  };

  const handleSelect = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setOpenDropdown((prev) => ({ ...prev, [field]: false }));
    setActiveIndex((prev) => ({ ...prev, [field]: -1 }));
  };

  const handleKeyDown = (field, suggestions) => (event) => {
    if (!openDropdown[field] && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpenDropdown((prev) => ({ ...prev, [field]: true }));
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (suggestions.length === 0) return;
      setActiveIndex((prev) => ({
        ...prev,
        [field]: Math.min(prev[field] + 1, suggestions.length - 1),
      }));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (suggestions.length === 0) return;
      setActiveIndex((prev) => ({
        ...prev,
        [field]: prev[field] <= 0 ? suggestions.length - 1 : prev[field] - 1,
      }));
    }
    if (event.key === "Enter" && openDropdown[field] && activeIndex[field] >= 0) {
      event.preventDefault();
      const selected = suggestions[activeIndex[field]];
      if (selected) {
        handleSelect(field, selected);
      }
    }
    if (event.key === "Escape") {
      setOpenDropdown((prev) => ({ ...prev, [field]: false }));
      setActiveIndex((prev) => ({ ...prev, [field]: -1 }));
    }
  };

  const handleFocus = (field, suggestions) => () => {
    setFocusedField(field);
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    if (suggestions.length > 0) {
      setOpenDropdown((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => () => {
    setFocusedField((prev) => (prev === field ? null : prev));
    blurTimeoutRef.current = setTimeout(() => {
      setOpenDropdown((prev) => ({ ...prev, [field]: false }));
      setActiveIndex((prev) => ({ ...prev, [field]: -1 }));
    }, 120);
  };

  const handleChange = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    const error = validateField(key, value, { showRequired: false });
    setErrors((prev) => ({ ...prev, [key]: error }));
    setOpenDropdown((prev) => ({ ...prev, [key]: Boolean(value.trim()) }));
    setActiveIndex((prev) => ({ ...prev, [key]: -1 }));
  };

  const handleSwap = () => {
    const next = {
      origin: form.destination,
      destination: form.origin,
    };
    setForm((prev) => ({ ...prev, ...next }));
    setErrors((prev) => ({
      ...prev,
      origin: validateField("origin", next.origin, { showRequired: false }),
      destination: validateField("destination", next.destination, { showRequired: false }),
    }));
    setOpenDropdown({ origin: false, destination: false });
    setActiveIndex({ origin: -1, destination: -1 });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (stationsLoading) return;
    const originError = validateField("origin", form.origin, { showRequired: true });
    const destinationError = validateField("destination", form.destination, { showRequired: true });
    setErrors({ origin: originError, destination: destinationError });
    if (originError) {
      originRef.current?.focus();
      return;
    }
    if (destinationError) {
      destinationRef.current?.focus();
      return;
    }
    dispatch({ type: "SET_SEARCH", payload: { ...form, tripType } });
    if (onSubmitProp) onSubmitProp(form);
  };

  const isOriginValid = !stationsLoading && isValidStation(form.origin, stationNames);
  const isDestinationValid = !stationsLoading && isValidStation(form.destination, stationNames);
  const originSuccess = focusedField === "origin"
    && Boolean(form.origin?.trim())
    && !errors.origin
    && isOriginValid;
  const destinationSuccess = focusedField === "destination"
    && Boolean(form.destination?.trim())
    && !errors.destination
    && isDestinationValid;
  const todayDate = new Date();
  const departDateValue = form.departDate ? new Date(form.departDate) : null;
  const returnDateValue = form.returnDate ? new Date(form.returnDate) : null;
  const returnMinDate = departDateValue && departDateValue > todayDate
    ? departDateValue
    : todayDate;
  const normalizedPassengers = (() => {
    if (!form.passengers) return { adults: 1, children: 0, infants: 0 };
    if (typeof form.passengers === "number") {
      return { adults: Math.max(1, form.passengers), children: 0, infants: 0 };
    }
    return {
      adults: Math.max(1, Number(form.passengers.adults ?? 1)),
      children: Math.max(0, Number(form.passengers.children ?? 0)),
      infants: Math.max(0, Number(form.passengers.infants ?? 0)),
    };
  })();
  const passengerTotal = normalizedPassengers.adults
    + normalizedPassengers.children
    + normalizedPassengers.infants;
  const hasPassengers = passengerTotal > 0 && normalizedPassengers.adults > 0;
  const hasDepartDate = Boolean(form.departDate);
  const hasReturnDate = tripType === "oneWay" ? true : Boolean(form.returnDate);
  const isReady = Boolean(
    !stationsLoading
    && isOriginValid
    && isDestinationValid
    && hasPassengers
    && hasDepartDate
    && hasReturnDate
  );

  return (
    <form
      className="home-search"
      onSubmit={handleSubmit}
      aria-label={t("home.title")}
    >
      <h1 className="home-search-title">{t("home.title")}</h1>
      <div className="home-search-grid">
        <div className="home-search-origin home-search-field">
          <InputText
            label={t("home.origin")}
            inputId="origin"
            helperId="origin-helper"
            helperText={
              errors.origin
                ? errors.origin
                : originSuccess
                ? t("home.stationValid")
                : "\u00A0"
            }
            state={errors.origin ? "error" : originSuccess ? "success" : "default"}
            showCounter={false}
            hideLabel={!form.origin?.trim()}
            hideHelper={false}
            value={form.origin}
            onChange={handleChange("origin")}
            placeholder={t("home.origin")}
            size="l"
            inputRef={originRef}
            inputProps={{
              role: "combobox",
              "aria-autocomplete": "list",
              "aria-expanded": openDropdown.origin,
              "aria-controls": "origin-listbox",
              "aria-activedescendant":
                activeIndex.origin >= 0 ? `origin-option-${activeIndex.origin}` : undefined,
              autoComplete: "off",
              spellCheck: "false",
              onKeyDown: handleKeyDown("origin", originSuggestions),
              onFocus: handleFocus("origin", originSuggestions),
              onBlur: handleBlur("origin"),
            }}
          />
          {openDropdown.origin && originSuggestions.length > 0 && (
            <ul className="home-search-suggestions" role="listbox" id="origin-listbox">
              {originSuggestions.map((station, index) => (
                <li
                  key={`${station}-${index}`}
                  id={`origin-option-${index}`}
                  role="option"
                  aria-selected={activeIndex.origin === index}
                  className={`home-search-option ${activeIndex.origin === index ? "is-active" : ""}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect("origin", station)}
                >
                  {station}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="home-search-swap">
          <Button
            variant="tertiary"
            size="l"
            hasLeadingIcon
            leadingIcon="swap_horiz"
            aria-label={t("home.swap")}
            onClick={handleSwap}
          />
        </div>
        <div className="home-search-destination home-search-field">
          <InputText
            label={t("home.destination")}
            inputId="destination"
            helperId="destination-helper"
            helperText={
              errors.destination
                ? errors.destination
                : destinationSuccess
                ? t("home.stationValid")
                : "\u00A0"
            }
            state={errors.destination ? "error" : destinationSuccess ? "success" : "default"}
            showCounter={false}
            hideLabel={!form.destination?.trim()}
            hideHelper={false}
            value={form.destination}
            onChange={handleChange("destination")}
            placeholder={t("home.destination")}
            size="l"
            inputRef={destinationRef}
            inputProps={{
              role: "combobox",
              "aria-autocomplete": "list",
              "aria-expanded": openDropdown.destination,
              "aria-controls": "destination-listbox",
              "aria-activedescendant":
                activeIndex.destination >= 0
                  ? `destination-option-${activeIndex.destination}`
                  : undefined,
              autoComplete: "off",
              spellCheck: "false",
              onKeyDown: handleKeyDown("destination", destinationSuggestions),
              onFocus: handleFocus("destination", destinationSuggestions),
              onBlur: handleBlur("destination"),
            }}
          />
          {openDropdown.destination && destinationSuggestions.length > 0 && (
            <ul
              className="home-search-suggestions"
              role="listbox"
              id="destination-listbox"
            >
              {destinationSuggestions.map((station, index) => (
                <li
                  key={`${station}-${index}`}
                  id={`destination-option-${index}`}
                  role="option"
                  aria-selected={activeIndex.destination === index}
                  className={`home-search-option ${
                    activeIndex.destination === index ? "is-active" : ""
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect("destination", station)}
                >
                  {station}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="home-search-triptype">
          <RadioGroup
            name="trip-type"
            label={t("home.tripType")}
            value={tripType}
            onChange={(value) => {
              setTripType(value);
              if (value === "oneWay") {
                setForm((prev) => ({ ...prev, returnDate: "" }));
              }
            }}
            options={[
              { value: "oneWay", label: t("home.oneWay") },
              { value: "roundTrip", label: t("home.roundTrip") },
            ]}
          />
        </div>
        <div
          className={
            "home-search-bottomRow" +
            (tripType === "roundTrip"
              ? " is-roundTrip"
              : " is-oneWay")
          }
        >
          <div className="home-search-dates">
            <DatePicker
              label={t("home.departDate")}
              inputId="depart-date"
              helperId="depart-date-helper"
              value={departDateValue}
              onChange={(date) => {
                const nextDepart = toIsoDate(date);
                setForm((prev) => {
                  const nextReturn =
                    prev.returnDate &&
                    nextDepart &&
                    prev.returnDate < nextDepart
                      ? ""
                      : prev.returnDate;
                  return {
                    ...prev,
                    departDate: nextDepart,
                    returnDate: nextReturn,
                  };
                });
              }}
              minDate={todayDate}
            />
          </div>
          {tripType === "roundTrip" && (
            <div className="home-search-return-date">
              <DatePicker
                label={t("home.returnDate")}
                inputId="return-date"
                helperId="return-date-helper"
                value={returnDateValue}
                onChange={(date) => {
                  const nextReturn = toIsoDate(date);
                  setForm((prev) => ({ ...prev, returnDate: nextReturn }));
                }}
                minDate={returnMinDate}
              />
            </div>
          )}
          <div className="home-search-passengers">
            <PassengerSelector
              value={form.passengers}
              onChange={(passengers) => setForm((prev) => ({ ...prev, passengers }))}
            />
          </div>
          <div className="home-search-actions">
            <Button
              type="submit"
              variant="primary"
              size="l"
              className="home-search-button"
              disabled={!isReady}
            >
              {t("home.search")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
