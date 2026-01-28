import { NavLink } from "react-router-dom";
import { useRef, useState } from "react";
import Container from "../Container/Container.jsx";
import "./TopNav.css";
import { useI18n } from "../../app/i18n.jsx";
import DrawerMenu from "../navigation/DrawerMenu/DrawerMenu.jsx";
import Icon from "../../ui/Icon/Icon.jsx";

export default function TopNav() {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  return (
    <header className="topnav">
      <Container className="topnav__inner" as="div">
        <div className="topnav__row">
          <div className="topnav__left">
            <a className="topnav__brand" href="/" aria-label={t("appName")}>
              <span className="topnav__logo-box" aria-hidden="true">
                <img
                  src="/renfe-seeklogo.svg"
                  alt={t("appName")}
                  className="topnav__logo"
                />
              </span>
            </a>
          </div>

          <nav className="topnav__center" aria-label="Navegación principal">
            <ul className="topnav__list">
              <li>
                <NavLink
                  to="/results"
                  className={({ isActive }) => `topnav__link ${isActive ? "active" : ""}`}
                >
                  <Icon name="search" size="md" decorative />
                  <span className="topnav__link-text">{t("nav.search")}</span>
                </NavLink>
              </li>
              <li>
                <a className="topnav__link" href="#help">
                  <Icon name="help" size="md" decorative />
                  <span className="topnav__link-text">{t("nav.help")}</span>
                </a>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `topnav__link ${isActive ? "active" : ""}`}
                >
                  <Icon name="person" size="md" decorative />
                  <span className="topnav__link-text">{t("nav.access")}</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="topnav__right">
            <button
              type="button"
              className="topnav__menu-btn"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-controls="drawer-menu"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              ref={menuButtonRef}
            >
              <span className="topnav__menu-label">{t("nav.menu")}</span>
              <Icon name={isMenuOpen ? "close" : "menu"} size="md" decorative />
            </button>
          </div>
        </div>
      </Container>
      <DrawerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}
