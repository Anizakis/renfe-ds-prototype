export default function ResultsEmpty({ title, body, actions }) {
  return (
    <div className="results-empty" role="status">
      <h3 className="results-empty__title">{title}</h3>
      <p className="results-empty__body">{body}</p>
      <ul className="results-empty__actions">
        {actions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
