export default function ResultsFiltersDrawer({ open, onClose, filters, setFilters, t, defaultFilters, children }) {
  if (!open) return null;
  return (
    <div className="results-filters-drawer" role="dialog" aria-modal="true">
      <div className="results-filters-drawer__backdrop" onClick={onClose} />
      <div className="results-filters-drawer__panel">
        <div className="results-filters-drawer__header">
          <span className="results-filters-drawer__title">{t("filtersPanel.title")}</span>
          {children}
        </div>
        {/* Aquí puedes renderizar el componente de filtros que prefieras */}
      </div>
    </div>
  );
}
