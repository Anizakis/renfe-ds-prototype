import { Link as RouterLink } from "react-router-dom";
import "./Link.css";

export default function Link({
  to,
  href,
  external,
  className = "",
  children,
  ...rest
}) {
  const isExternal = external ?? (href ? /^(https?:|mailto:|tel:)/.test(href) : false);
  const target = rest.target ?? (isExternal ? "_blank" : undefined);
  const rel = rest.rel ?? (isExternal ? "noreferrer" : undefined);

  if (to) {
    return (
      <RouterLink className={`ds-link ${className}`.trim()} to={to} {...rest}>
        {children}
      </RouterLink>
    );
  }

  if (href) {
    return (
      <a
        className={`ds-link ${className}`.trim()}
        href={href}
        target={target}
        rel={rel}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <span className={`ds-link ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}
