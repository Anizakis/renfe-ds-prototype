import { useEffect, useRef } from "react";
import Button from "../../atoms/Button/Button.jsx";

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll(
      "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])"
    )
  );
}

export default function ResultsFiltersDrawer({
  open,
  onClose,
  t,
  children,
  triggerRef,
  drawerId,
  titleId,
}) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open) {
      const focusTarget = closeButtonRef.current || getFocusableElements(panelRef.current)[0];
      focusTarget?.focus();
      wasOpenRef.current = true;
      return;
    }
    if (wasOpenRef.current && triggerRef?.current) {
      triggerRef.current.focus();
      wasOpenRef.current = false;
    }
  }, [open, triggerRef]);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = getFocusableElements(panelRef.current);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  return (
    <div className="results-filters-drawer">
      <div className="results-filters-drawer__backdrop" onClick={onClose} />
      <div
        className="results-filters-drawer__panel"
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        ref={panelRef}
      >
        <div className="results-filters-drawer__header">
          <span className="results-filters-drawer__title" id={titleId}>
            {t("filtersPanel.title")}
          </span>
          <Button
            variant="tertiary"
            size="s"
            onClick={onClose}
            ref={closeButtonRef}
          >
            {t("common.accept")}
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
