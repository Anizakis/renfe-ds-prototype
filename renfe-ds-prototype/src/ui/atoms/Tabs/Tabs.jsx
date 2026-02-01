import { useEffect, useMemo, useState } from "react";
import "./Tabs.css";

export default function Tabs({ tabs, activeId, onChange, label }) {
  const defaultId = tabs[0]?.id;
  const [internalId, setInternalId] = useState(defaultId);
  const currentId = activeId ?? internalId;

  useEffect(() => {
    if (activeId) return;
    queueMicrotask(() => setInternalId(defaultId));
  }, [activeId, defaultId]);

  const activeIndex = useMemo(
    () => tabs.findIndex((tab) => tab.id === currentId),
    [tabs, currentId]
  );

  const handleKeyDown = (event) => {
    const max = tabs.length - 1;
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
      event.preventDefault();
    }

    let nextIndex = activeIndex;
    if (event.key === "ArrowRight") nextIndex = activeIndex === max ? 0 : activeIndex + 1;
    if (event.key === "ArrowLeft") nextIndex = activeIndex === 0 ? max : activeIndex - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = max;

    if (nextIndex !== activeIndex) {
      const nextId = tabs[nextIndex].id;
      onChange?.(nextId);
      if (!activeId) setInternalId(nextId);
      document.getElementById(`tab-${nextId}`)?.focus();
    }
  };

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label={label} onKeyDown={handleKeyDown}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={tab.id === currentId}
            aria-controls={`panel-${tab.id}`}
            tabIndex={tab.id === currentId ? 0 : -1}
            className={`tabs__tab ${tab.id === currentId ? "is-active" : ""}`}
            onClick={() => {
              onChange?.(tab.id);
              if (!activeId) setInternalId(tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== currentId}
          className="tabs__panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}