import "./JourneyList.css";

export default function JourneyList({ children }) {
  return (
    <ul className="journey-list">
      {children}
    </ul>
  );
}
