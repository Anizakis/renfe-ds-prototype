import Icon from "../../Icon/Icon.jsx";
import "./Alert.css";

export default function Alert({
  title,
  children,
  type = "error",
  iconName,
  roleOverride,
}) {
  const roleValue = roleOverride ?? "alert";

  return (
    <div className={`alert alert--${type}`} role={roleValue}>
      <div className="alert__layout">
        {iconName && (
          <span className="alert__icon" aria-hidden="true">
            <Icon name={iconName} size="sm" decorative />
          </span>
        )}
        <div className="alert__content">
          {title && <div className="alert__title">{title}</div>}
          {children && <div className="alert__body">{children}</div>}
        </div>
      </div>
    </div>
  );
}