/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo, useState } from "react";
import { Checkbox, Slider, Switch } from "../../atoms";
import RadioGroup from "../../atoms/RadioGroup/RadioGroup.jsx";
import FilterSection from "../../molecules/FilterSection/FilterSection.jsx";
import Button from "../../atoms/Button/Button.jsx";
import Link from "../../atoms/Link/Link.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import "./ResultsFilters.css";

export const createDefaultFilters = () => ({
  petFriendly: false,
  petTypes: {
    dog: false,
    cat: false,
    other: false,
  },
  petSizes: {
    small: false,
    medium: false,
    large: false,
  },
  petOnlyAllowed: false,
  directOnly: false,
  maxTransfers: "1",
  minConnection: "20",
  maxPrice: 120,
  timePresets: {
    morning: false,
    afternoon: false,
    night: false,
  },
  departStart: 6,
  departEnd: 22,
  arriveStart: 6,
  arriveEnd: 22,
  maxDuration: "3",
  accessibilitySeat: false,
  accessibilityAssistance: false,
  prioritizeFewerTransfers: false,
  trainAve: false,
  trainAvlo: false,
  trainAlvia: false,
  trainMd: false,
  altStations: false,
});

function formatTime(hour) {
  const padded = String(hour).padStart(2, "0");
  return `${padded}:00`;
}

export default function ResultsFilters({ value, onChange, defaultFilters }) {
  const { t } = useI18n();
  const [filters, setFilters] = useState(() => value ?? defaultFilters ?? createDefaultFilters());
  const [isUpdating, setIsUpdating] = useState(false);
  const resolvedFilters = value ?? filters;

  useEffect(() => {
    if (value) {
      queueMicrotask(() => setFilters(value));
    }
  }, [value]);

  useEffect(() => {
    queueMicrotask(() => setIsUpdating(true));
    const timeout = setTimeout(() => queueMicrotask(() => setIsUpdating(false)), 600);
    return () => clearTimeout(timeout);
  }, [resolvedFilters]);

  const appliedChips = useMemo(() => {
    const chips = [];
    if (resolvedFilters.petFriendly) chips.push(t("filtersPanel.sections.pets.toggle"));
    if (resolvedFilters.directOnly) chips.push(t("filtersPanel.sections.connections.directOnly"));
    if (resolvedFilters.maxPrice !== createDefaultFilters().maxPrice) {
      chips.push(`${t("filtersPanel.sections.price.maxPrice")} €${resolvedFilters.maxPrice}`);
    }
    if (resolvedFilters.accessibilityAssistance) chips.push(t("filtersPanel.sections.accessibility.assistance"));
    return chips;
  }, [resolvedFilters, t]);
  const updateFilters = (updater) => {
    setFilters((prev) => {
      const nextValue = typeof updater === "function" ? updater(prev) : updater;
      onChange?.(nextValue);
      return nextValue;
    });
  };

  const resetFilters = () => {
    const base = defaultFilters ?? createDefaultFilters();
    updateFilters(base);
  };

  return (
    <div className="results-filters">
      <div className="results-filters__header">
        <div>
          <h2 className="section-title">{t("filtersPanel.title")}</h2>
          {isUpdating && (
            <span className="results-filters__updating">{t("filtersPanel.updating")}</span>
          )}
        </div>
        <Button
          variant="tertiary"
          size="s"
          disabled={appliedChips.length === 0}
          onClick={resetFilters}
        >
          {t("filtersPanel.clearAll")}
        </Button>
      </div>

      {appliedChips.length > 0 && (
        <div className="results-filters__chips">
          <span className="results-filters__chips-label">{t("filtersPanel.applied")}</span>
          <div className="results-filters__chips-list">
            {appliedChips.map((chip) => (
              <span key={chip} className="results-filters__chip">{chip}</span>
            ))}
          </div>
        </div>
      )}

      <FilterSection
        title={t("filtersPanel.sections.connections.title")}
        description={t("filtersPanel.sections.connections.note")}
      >
        <Switch
          label={t("filtersPanel.sections.connections.directOnly")}
          checked={resolvedFilters.directOnly}
          onChange={(value) => updateFilters((prev) => ({ ...prev, directOnly: value }))}
        />
        <RadioGroup
          name="max-transfers"
          label={t("filtersPanel.sections.connections.maxTransfers")}
          value={resolvedFilters.maxTransfers}
          onChange={(value) => updateFilters((prev) => ({ ...prev, maxTransfers: value }))}
          options={[
            { value: "0", label: t("filtersPanel.sections.connections.transfer0") },
            { value: "1", label: t("filtersPanel.sections.connections.transfer1") },
            { value: "2", label: t("filtersPanel.sections.connections.transfer2") },
          ]}
        />
        <RadioGroup
          name="min-connection"
          label={t("filtersPanel.sections.connections.minConnection")}
          value={resolvedFilters.minConnection}
          onChange={(value) => updateFilters((prev) => ({ ...prev, minConnection: value }))}
          options={[
            { value: "10", label: t("filtersPanel.sections.connections.conn10") },
            { value: "20", label: t("filtersPanel.sections.connections.conn20") },
            { value: "30", label: t("filtersPanel.sections.connections.conn30") },
          ]}
        />
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.price.title")}
        description={t("filtersPanel.sections.price.note")}
      >
        <Slider
          label={t("filtersPanel.sections.price.maxPrice")}
          value={resolvedFilters.maxPrice}
          min={10}
          max={200}
          step={5}
          suffix="€"
          onChange={(value) => updateFilters((prev) => ({ ...prev, maxPrice: value }))}
        />
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.time.title")}
        description={t("filtersPanel.sections.time.note")}
      >
        <div className="results-filters__grid">
          <Checkbox
            label={t("filtersPanel.sections.time.morning")}
            checked={resolvedFilters.timePresets.morning}
            onChange={(value) => updateFilters((prev) => ({
              ...prev,
              timePresets: { ...prev.timePresets, morning: value },
            }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.time.afternoon")}
            checked={resolvedFilters.timePresets.afternoon}
            onChange={(value) => updateFilters((prev) => ({
              ...prev,
              timePresets: { ...prev.timePresets, afternoon: value },
            }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.time.night")}
            checked={resolvedFilters.timePresets.night}
            onChange={(value) => updateFilters((prev) => ({
              ...prev,
              timePresets: { ...prev.timePresets, night: value },
            }))}
          />
        </div>
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.accessibility.title")}
        description={t("filtersPanel.sections.accessibility.note")}
      >
        <Switch
          label={t("filtersPanel.sections.accessibility.assistance")}
          checked={resolvedFilters.accessibilityAssistance}
          onChange={(value) => updateFilters((prev) => ({ ...prev, accessibilityAssistance: value }))}
        />
        <Switch
          label={t("filtersPanel.sections.accessibility.seat")}
          checked={resolvedFilters.accessibilitySeat}
          onChange={(value) => updateFilters((prev) => ({ ...prev, accessibilitySeat: value }))}
        />
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.pets.title")}
        description={t("filtersPanel.sections.pets.note")}
      >
        <Switch
          label={t("filtersPanel.sections.pets.toggle")}
          checked={resolvedFilters.petFriendly}
          onChange={(value) => updateFilters((prev) => ({ ...prev, petFriendly: value }))}
        />
        <div className="results-filters__group">
          <span className="results-filters__label">{t("filtersPanel.sections.pets.allowed")}</span>
          <div className="results-filters__grid">
            <Checkbox
              label={t("filtersPanel.sections.pets.typeDog")}
              checked={resolvedFilters.petTypes.dog}
              onChange={(value) => updateFilters((prev) => ({
                ...prev,
                petTypes: { ...prev.petTypes, dog: value },
              }))}
            />
            <Checkbox
              label={t("filtersPanel.sections.pets.typeCat")}
              checked={resolvedFilters.petTypes.cat}
              onChange={(value) => updateFilters((prev) => ({
                ...prev,
                petTypes: { ...prev.petTypes, cat: value },
              }))}
            />
            <Checkbox
              label={t("filtersPanel.sections.pets.typeOther")}
              checked={resolvedFilters.petTypes.other}
              onChange={(value) => updateFilters((prev) => ({
                ...prev,
                petTypes: { ...prev.petTypes, other: value },
              }))}
            />
          </div>
          <span className="results-filters__label">{t("filtersPanel.sections.pets.sizes")}</span>
          <div className="results-filters__grid">
            <Checkbox
              label={t("filtersPanel.sections.pets.sizeSmall")}
              checked={resolvedFilters.petSizes.small}
              onChange={(value) => updateFilters((prev) => ({
                ...prev,
                petSizes: { ...prev.petSizes, small: value },
              }))}
            />
            <Checkbox
              label={t("filtersPanel.sections.pets.sizeMedium")}
              checked={resolvedFilters.petSizes.medium}
              onChange={(value) => updateFilters((prev) => ({
                ...prev,
                petSizes: { ...prev.petSizes, medium: value },
              }))}
            />
            <Checkbox
              label={t("filtersPanel.sections.pets.sizeLarge")}
              checked={resolvedFilters.petSizes.large}
              onChange={(value) => updateFilters((prev) => ({
                ...prev,
                petSizes: { ...prev.petSizes, large: value },
              }))}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.trains.title")}
        description={t("filtersPanel.sections.trains.note")}
      >
        <div className="results-filters__grid">
          <Checkbox
            label={t("filtersPanel.sections.trains.ave")}
            checked={resolvedFilters.trainAve}
            onChange={(value) => updateFilters((prev) => ({ ...prev, trainAve: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.trains.avlo")}
            checked={resolvedFilters.trainAvlo}
            onChange={(value) => updateFilters((prev) => ({ ...prev, trainAvlo: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.trains.alvia")}
            checked={resolvedFilters.trainAlvia}
            onChange={(value) => updateFilters((prev) => ({ ...prev, trainAlvia: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.trains.md")}
            checked={resolvedFilters.trainMd}
            onChange={(value) => updateFilters((prev) => ({ ...prev, trainMd: value }))}
          />
        </div>
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.timeRange.title")}
        description={t("filtersPanel.sections.timeRange.note")}
      >
        <div className="results-filters__range">
          <span className="results-filters__label">{t("filtersPanel.sections.timeRange.departure")}</span>
          <div className="results-filters__range-row">
            <Slider
              label={t("filtersPanel.sections.timeRange.start")}
              value={resolvedFilters.departStart}
              min={0}
              max={24}
              step={1}
              valueLabel={formatTime}
              onChange={(value) => updateFilters((prev) => ({ ...prev, departStart: value }))}
            />
            <Slider
              label={t("filtersPanel.sections.timeRange.end")}
              value={resolvedFilters.departEnd}
              min={0}
              max={24}
              step={1}
              valueLabel={formatTime}
              onChange={(value) => updateFilters((prev) => ({ ...prev, departEnd: value }))}
            />
          </div>
          <span className="results-filters__label">{t("filtersPanel.sections.timeRange.arrival")}</span>
          <div className="results-filters__range-row">
            <Slider
              label={t("filtersPanel.sections.timeRange.start")}
              value={resolvedFilters.arriveStart}
              min={0}
              max={24}
              step={1}
              valueLabel={formatTime}
              onChange={(value) => updateFilters((prev) => ({ ...prev, arriveStart: value }))}
            />
            <Slider
              label={t("filtersPanel.sections.timeRange.end")}
              value={resolvedFilters.arriveEnd}
              min={0}
              max={24}
              step={1}
              valueLabel={formatTime}
              onChange={(value) => updateFilters((prev) => ({ ...prev, arriveEnd: value }))}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.duration.title")}
        description={t("filtersPanel.sections.duration.note")}
      >
        <RadioGroup
          name="duration"
          label={t("filtersPanel.sections.duration.maxLabel")}
          value={resolvedFilters.maxDuration}
          onChange={(value) => updateFilters((prev) => ({ ...prev, maxDuration: value }))}
          options={[
            { value: "2", label: t("filtersPanel.sections.duration.max2") },
            { value: "3", label: t("filtersPanel.sections.duration.max3") },
            { value: "4", label: t("filtersPanel.sections.duration.max4") },
          ]}
        />
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.stations.title")}
        description={t("filtersPanel.sections.stations.note")}
      >
        <Switch
          label={t("filtersPanel.sections.stations.onlyMain")}
          checked={resolvedFilters.altStations}
          onChange={(value) => updateFilters((prev) => ({ ...prev, altStations: value }))}
        />
        <div className="results-filters__link">
          <Link to="#">{t("filtersPanel.sections.stations.helpLink")}</Link>
        </div>
      </FilterSection>
    </div>
  );
}
