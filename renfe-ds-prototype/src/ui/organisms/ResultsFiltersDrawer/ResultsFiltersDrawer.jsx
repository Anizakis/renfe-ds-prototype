import { useEffect, useRef, useState } from "react";
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
  const closeTimerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const wasOpenRef = useRef(false);
  const CLOSE_ANIMATION_MS = 420;

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);
      return;
    }
    if (!isVisible) return;

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, CLOSE_ANIMATION_MS);

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open, isVisible]);

  useEffect(() => {
    if (open) {
      const focusTarget = closeButtonRef.current || getFocusableElements(panelRef.current)[0];
      focusTarget?.focus();
      wasOpenRef.current = true;
      return;
    }
    if (!open && !isVisible && wasOpenRef.current && triggerRef?.current) {
      triggerRef.current.focus();
      wasOpenRef.current = false;
    }
  }, [open, isVisible, triggerRef]);

  useEffect(() => {
    if (!isVisible) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isVisible]);

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

  if (!isVisible) return null;

  return (
    <div className={`results-filters-drawer ${isClosing ? "results-filters-drawer--closing" : "results-filters-drawer--open"}`}>
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
