import "./ResultsAppliedFiltersBar.css";

export default function ResultsAppliedFiltersBar({
  appliedLabel,
  chips = [],
}) {
  const hasChips = chips.length > 0;

  return (
    <div className="results-applied-bar">
      <div className="results-applied-bar__chipsWrap" aria-label={hasChips ? appliedLabel : undefined}>
        {hasChips ? (
          <>
            <span className="results-applied-bar__label">{appliedLabel}</span>
            <div className="results-applied-bar__chips">
              {chips.map((chip) => (
                <span key={chip} className="results-applied-bar__chip">
                  {chip}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="results-applied-bar__chipsPlaceholder" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
