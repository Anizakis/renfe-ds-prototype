import "./Alert.css";

export default function Alert({ title, children, type = "error" }) {
  return (
    <div className={`alert alert--${type}`} role="alert">
      {title && <div className="alert__title">{title}</div>}
      {children && <div className="alert__body">{children}</div>}
    </div>
  );
}