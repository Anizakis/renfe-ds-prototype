import "./Loading.css";
import { VisuallyHidden } from "../../atoms";

export default function Loading({ label }) {
  return (
    <div className="loading" aria-busy="true">
      <span className="loading__icon" aria-hidden="true">progress_activity</span>
      <VisuallyHidden>{label}</VisuallyHidden>
    </div>
  );
}