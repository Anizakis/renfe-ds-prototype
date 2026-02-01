import DayPickerStrip from "../../DayPickerStrip/DayPickerStrip.jsx";
import "./ResultsDayTabs.css";

export default function ResultsDayTabs({
  days,
  activeDay,
  prices,
  availability,
  isLoading,
  onChange,
  onPrevRange,
  onNextRange,
}) {
  return (
    <div className="results-daypicker">
      <DayPickerStrip
        days={days}
        activeDay={activeDay}
        prices={prices}
        availability={availability}
        isLoading={isLoading}
        onChange={onChange}
        onPrevRange={onPrevRange}
        onNextRange={onNextRange}
      />
    </div>
  );
}
