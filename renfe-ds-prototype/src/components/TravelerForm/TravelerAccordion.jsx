
import React, { useState } from "react";
import TravelerForm from "./TravelerForm.jsx";
import "./TravelerAccordion.css";
import Icon from "../../ui/Icon/Icon.jsx";

export default function TravelerAccordion({ index = 1, type = "Adulto", defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="traveler-accordion">
      <div className="traveler-accordion__header" onClick={() => setOpen((v) => !v)}>
        <span className="traveler-accordion__title">
          <b>Viajero {index}</b> <span className="traveler-accordion__subtitle">{type}</span>
        </span>
        <span className={"traveler-accordion__icon" + (open ? " open" : "")}> 
          <Icon name={open ? "expand_less" : "expand_more"} size="md" decorative={true} />
        </span>
      </div>
      {open && (
        <div className="traveler-accordion__content">
          <TravelerForm travelerIndex={index} />
        </div>
      )}
    </div>
  );
}
