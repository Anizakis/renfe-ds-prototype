import { useEffect } from "react";

const FOCUSABLE =
  "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])";

export default function useFocusTrap(containerRef, isOpen, onClose) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusable = Array.from(container.querySelectorAll(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
      }

      if (event.key !== "Tab") return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    container.addEventListener("keydown", onKeyDown);
    first?.focus();

    return () => {
      container.removeEventListener("keydown", onKeyDown);
    };
  }, [containerRef, isOpen, onClose]);
}
