import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useFocusTrap from "../a11y/useFocusTrap.js";
import "./Modal.css";

export default function Modal({
  isOpen,
  titleId,
  descriptionId,
  onClose,
  children,
  triggerRef,
}) {
  const ref = useRef(null);

  useFocusTrap(ref, isOpen, onClose);

  useEffect(() => {
    if (!isOpen && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__content" ref={ref}>
        {children}
      </div>
    </div>,
    document.body
  );
}
