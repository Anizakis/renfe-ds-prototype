import { useEffect, useMemo, useState } from "react";
import Checkbox from "../Checkbox/Checkbox.jsx";
import Switch from "../Switch/Switch.jsx";
import Slider from "../Slider/Slider.jsx";
import RadioGroup from "../RadioGroup/RadioGroup.jsx";
import FilterSection from "../FilterSection/FilterSection.jsx";
import Button from "../Button/Button.jsx";
import { useI18n } from "../../app/i18n.jsx";
import "./ResultsFilters.css";

const createDefaultFilters = () => ({
  flexibleDates: false,
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
  showFinalPrice: false,
  refundable: false,
  changesAllowed: false,
  seatSelection: false,
  baggageIncluded: false,
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
  accessibilityCompanion: false,
  accessibilityAdjacent: false,
  prioritizeFewerTransfers: false,
  onboardWifi: false,
  onboardPower: false,
  onboardQuiet: false,
  onboardCafe: false,
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

export default function ResultsFilters() {
  const { t } = useI18n();
  const [filters, setFilters] = useState(createDefaultFilters);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsUpdating(true);
    const timeout = setTimeout(() => setIsUpdating(false), 600);
    return () => clearTimeout(timeout);
  }, [filters]);

  const appliedChips = useMemo(() => {
    const chips = [];
    if (filters.flexibleDates) chips.push(t("filtersPanel.sections.flexibleDates.toggle"));
    if (filters.petFriendly) chips.push(t("filtersPanel.sections.pets.toggle"));
    if (filters.directOnly) chips.push(t("filtersPanel.sections.connections.directOnly"));
    if (filters.maxPrice !== createDefaultFilters().maxPrice) {
      chips.push(`${t("filtersPanel.sections.price.maxPrice")} €${filters.maxPrice}`);
    }
    if (filters.refundable) chips.push(t("filtersPanel.sections.fare.refundable"));
    if (filters.changesAllowed) chips.push(t("filtersPanel.sections.fare.changes"));
    if (filters.seatSelection) chips.push(t("filtersPanel.sections.fare.seat"));
    if (filters.baggageIncluded) chips.push(t("filtersPanel.sections.fare.baggage"));
    if (filters.accessibilityAssistance) chips.push(t("filtersPanel.sections.accessibility.assistance"));
    if (filters.onboardWifi) chips.push(t("filtersPanel.sections.onboard.wifi"));
    if (filters.onboardPower) chips.push(t("filtersPanel.sections.onboard.power"));
    if (filters.onboardCafe) chips.push(t("filtersPanel.sections.onboard.cafe"));
    return chips;
  }, [filters, t]);

  const resetFilters = () => setFilters(createDefaultFilters());

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
        title={t("filtersPanel.sections.flexibleDates.title")}
        description={t("filtersPanel.sections.flexibleDates.note")}
      >
        <Switch
          label={t("filtersPanel.sections.flexibleDates.toggle")}
          checked={filters.flexibleDates}
          onChange={(value) => setFilters((prev) => ({ ...prev, flexibleDates: value }))}
        />
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.pets.title")}
        description={t("filtersPanel.sections.pets.note")}
      >
        <Switch
          label={t("filtersPanel.sections.pets.toggle")}
          checked={filters.petFriendly}
          onChange={(value) => setFilters((prev) => ({ ...prev, petFriendly: value }))}
        />
        {filters.petFriendly && (
          <div className="results-filters__group">
            <span className="results-filters__label">{t("filtersPanel.sections.pets.typesLabel")}</span>
            <div className="results-filters__grid">
              <Checkbox
                label={t("filtersPanel.sections.pets.typeDog")}
                checked={filters.petTypes.dog}
                onChange={(value) => setFilters((prev) => ({
                  ...prev,
                  petTypes: { ...prev.petTypes, dog: value },
                }))}
              />
              <Checkbox
                label={t("filtersPanel.sections.pets.typeCat")}
                checked={filters.petTypes.cat}
                onChange={(value) => setFilters((prev) => ({
                  ...prev,
                  petTypes: { ...prev.petTypes, cat: value },
                }))}
              />
              <Checkbox
                label={t("filtersPanel.sections.pets.typeOther")}
                checked={filters.petTypes.other}
                onChange={(value) => setFilters((prev) => ({
                  ...prev,
                  petTypes: { ...prev.petTypes, other: value },
                }))}
              />
            </div>

            <span className="results-filters__label">{t("filtersPanel.sections.pets.sizesLabel")}</span>
            <div className="results-filters__grid">
              <Checkbox
                label={t("filtersPanel.sections.pets.sizeSmall")}
                checked={filters.petSizes.small}
                onChange={(value) => setFilters((prev) => ({
                  ...prev,
                  petSizes: { ...prev.petSizes, small: value },
                }))}
              />
              <Checkbox
                label={t("filtersPanel.sections.pets.sizeMedium")}
                checked={filters.petSizes.medium}
                onChange={(value) => setFilters((prev) => ({
                  ...prev,
                  petSizes: { ...prev.petSizes, medium: value },
                }))}
              />
              <Checkbox
                label={t("filtersPanel.sections.pets.sizeLarge")}
                checked={filters.petSizes.large}
                onChange={(value) => setFilters((prev) => ({
                  ...prev,
                  petSizes: { ...prev.petSizes, large: value },
                }))}
              />
            </div>

            <Switch
              label={t("filtersPanel.sections.pets.onlyAllowed")}
              checked={filters.petOnlyAllowed}
              onChange={(value) => setFilters((prev) => ({ ...prev, petOnlyAllowed: value }))}
            />
            <a className="results-filters__link" href="#rules">{t("filtersPanel.sections.pets.rulesLink")}</a>
          </div>
        )}
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.connections.title")}
        description={t("filtersPanel.sections.connections.note")}
      >
        <Switch
          label={t("filtersPanel.sections.connections.directOnly")}
          checked={filters.directOnly}
          onChange={(value) => setFilters((prev) => ({ ...prev, directOnly: value }))}
        />
        <RadioGroup
          name="max-transfers"
          label={t("filtersPanel.sections.connections.maxTransfers")}
          value={filters.maxTransfers}
          onChange={(value) => setFilters((prev) => ({ ...prev, maxTransfers: value }))}
          options={[
            { value: "0", label: t("filtersPanel.sections.connections.transfer0") },
            { value: "1", label: t("filtersPanel.sections.connections.transfer1") },
            { value: "2", label: t("filtersPanel.sections.connections.transfer2") },
          ]}
        />
        <RadioGroup
          name="min-connection"
          label={t("filtersPanel.sections.connections.minConnection")}
          value={filters.minConnection}
          onChange={(value) => setFilters((prev) => ({ ...prev, minConnection: value }))}
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
          value={filters.maxPrice}
          min={10}
          max={200}
          step={5}
          suffix="€"
          onChange={(value) => setFilters((prev) => ({ ...prev, maxPrice: value }))}
        />
        <Switch
          label={t("filtersPanel.sections.price.showFinal")}
          checked={filters.showFinalPrice}
          onChange={(value) => setFilters((prev) => ({ ...prev, showFinalPrice: value }))}
        />
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.fare.title")}
        description={t("filtersPanel.sections.fare.note")}
      >
        <div className="results-filters__grid">
          <Checkbox
            label={t("filtersPanel.sections.fare.refundable")}
            checked={filters.refundable}
            onChange={(value) => setFilters((prev) => ({ ...prev, refundable: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.fare.changes")}
            checked={filters.changesAllowed}
            onChange={(value) => setFilters((prev) => ({ ...prev, changesAllowed: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.fare.seat")}
            checked={filters.seatSelection}
            onChange={(value) => setFilters((prev) => ({ ...prev, seatSelection: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.fare.baggage")}
            checked={filters.baggageIncluded}
            onChange={(value) => setFilters((prev) => ({ ...prev, baggageIncluded: value }))}
          />
        </div>
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.time.title")}
        description={t("filtersPanel.sections.time.note")}
      >
        <div className="results-filters__grid">
          <Checkbox
            label={t("filtersPanel.sections.time.morning")}
            checked={filters.timePresets.morning}
            onChange={(value) => setFilters((prev) => ({
              ...prev,
              timePresets: { ...prev.timePresets, morning: value },
            }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.time.afternoon")}
            checked={filters.timePresets.afternoon}
            onChange={(value) => setFilters((prev) => ({
              ...prev,
              timePresets: { ...prev.timePresets, afternoon: value },
            }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.time.night")}
            checked={filters.timePresets.night}
            onChange={(value) => setFilters((prev) => ({
              ...prev,
              timePresets: { ...prev.timePresets, night: value },
            }))}
          />
        </div>

        <div className="results-filters__range">
          <span className="results-filters__label">{t("filtersPanel.sections.time.departRange")}</span>
          <div className="results-filters__range-row">
            <Slider
              label={t("filtersPanel.sections.time.from")}
              value={filters.departStart}
              min={0}
              max={23}
              step={1}
              suffix={` (${formatTime(filters.departStart)})`}
              onChange={(value) => setFilters((prev) => ({ ...prev, departStart: value }))}
            />
            <Slider
              label={t("filtersPanel.sections.time.to")}
              value={filters.departEnd}
              min={0}
              max={23}
              step={1}
              suffix={` (${formatTime(filters.departEnd)})`}
              onChange={(value) => setFilters((prev) => ({ ...prev, departEnd: value }))}
            />
          </div>
        </div>

        <div className="results-filters__range">
          <span className="results-filters__label">{t("filtersPanel.sections.time.arriveRange")}</span>
          <div className="results-filters__range-row">
            <Slider
              label={t("filtersPanel.sections.time.from")}
              value={filters.arriveStart}
              min={0}
              max={23}
              step={1}
              suffix={` (${formatTime(filters.arriveStart)})`}
              onChange={(value) => setFilters((prev) => ({ ...prev, arriveStart: value }))}
            />
            <Slider
              label={t("filtersPanel.sections.time.to")}
              value={filters.arriveEnd}
              min={0}
              max={23}
              step={1}
              suffix={` (${formatTime(filters.arriveEnd)})`}
              onChange={(value) => setFilters((prev) => ({ ...prev, arriveEnd: value }))}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.duration.title")}
        description={t("filtersPanel.sections.duration.note")}
      >
        <RadioGroup
          name="max-duration"
          label={t("filtersPanel.sections.duration.maxDuration")}
          value={filters.maxDuration}
          onChange={(value) => setFilters((prev) => ({ ...prev, maxDuration: value }))}
          options={[
            { value: "2", label: t("filtersPanel.sections.duration.d2") },
            { value: "3", label: t("filtersPanel.sections.duration.d3") },
            { value: "4", label: t("filtersPanel.sections.duration.d4") },
          ]}
        />
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.accessibility.title")}
        description={t("filtersPanel.sections.accessibility.note")}
      >
        <div className="results-filters__grid">
          <Checkbox
            label={t("filtersPanel.sections.accessibility.seat")}
            checked={filters.accessibilitySeat}
            onChange={(value) => setFilters((prev) => ({ ...prev, accessibilitySeat: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.accessibility.assistance")}
            checked={filters.accessibilityAssistance}
            onChange={(value) => setFilters((prev) => ({ ...prev, accessibilityAssistance: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.accessibility.companion")}
            checked={filters.accessibilityCompanion}
            onChange={(value) => setFilters((prev) => ({ ...prev, accessibilityCompanion: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.accessibility.adjacent")}
            checked={filters.accessibilityAdjacent}
            onChange={(value) => setFilters((prev) => ({ ...prev, accessibilityAdjacent: value }))}
          />
        </div>
        {filters.accessibilityAssistance && (
          <Switch
            label={t("filtersPanel.sections.accessibility.prioritizeTransfers")}
            checked={filters.prioritizeFewerTransfers}
            onChange={(value) => setFilters((prev) => ({ ...prev, prioritizeFewerTransfers: value }))}
          />
        )}
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.onboard.title")}
        description={t("filtersPanel.sections.onboard.note")}
      >
        <div className="results-filters__grid">
          <Checkbox
            label={t("filtersPanel.sections.onboard.wifi")}
            checked={filters.onboardWifi}
            onChange={(value) => setFilters((prev) => ({ ...prev, onboardWifi: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.onboard.power")}
            checked={filters.onboardPower}
            onChange={(value) => setFilters((prev) => ({ ...prev, onboardPower: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.onboard.quiet")}
            checked={filters.onboardQuiet}
            onChange={(value) => setFilters((prev) => ({ ...prev, onboardQuiet: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.onboard.cafe")}
            checked={filters.onboardCafe}
            onChange={(value) => setFilters((prev) => ({ ...prev, onboardCafe: value }))}
          />
        </div>
      </FilterSection>

      <FilterSection title={t("filtersPanel.sections.train.title")}
        description={t("filtersPanel.sections.train.note")}
      >
        <div className="results-filters__grid">
          <Checkbox
            label={t("filtersPanel.sections.train.ave")}
            checked={filters.trainAve}
            onChange={(value) => setFilters((prev) => ({ ...prev, trainAve: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.train.avlo")}
            checked={filters.trainAvlo}
            onChange={(value) => setFilters((prev) => ({ ...prev, trainAvlo: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.train.alvia")}
            checked={filters.trainAlvia}
            onChange={(value) => setFilters((prev) => ({ ...prev, trainAlvia: value }))}
          />
          <Checkbox
            label={t("filtersPanel.sections.train.md")}
            checked={filters.trainMd}
            onChange={(value) => setFilters((prev) => ({ ...prev, trainMd: value }))}
          />
        </div>
        <Switch
          label={t("filtersPanel.sections.train.altStations")}
          checked={filters.altStations}
          onChange={(value) => setFilters((prev) => ({ ...prev, altStations: value }))}
        />
      </FilterSection>
    </div>
  );
}
