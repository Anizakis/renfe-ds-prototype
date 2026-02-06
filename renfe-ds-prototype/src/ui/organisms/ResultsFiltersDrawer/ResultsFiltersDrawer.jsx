import { useEffect, useRef } from "react";
import Button from "../../atoms/Button/Button.jsx";
import Icon from "../../Icon/Icon.jsx";
import "./ResultsFiltersDrawer.css";

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

  useEffect(() => {
    if (!open) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

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
        aria-label={t("filtersPanel.title")}
        onKeyDown={handleKeyDown}
        ref={panelRef}
      >
        <div className="results-filters-drawer__header">
          <Button
            variant="tertiary"
            size="s"
            onClick={onClose}
            ref={closeButtonRef}
            aria-label={t("common.close")}
          >
            <Icon name="close" size="s" decorative />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
