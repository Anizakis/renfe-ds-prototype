import "./StickySummaryBar.css";

export default function StickySummaryBar({ children }) {
  return (
    <div className="sticky-summary">
      <div className="sticky-summary__inner">{children}</div>
    </div>
  );
}
