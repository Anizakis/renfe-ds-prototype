import { NavLink } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import Container from "../Container/Container.jsx";
import "./TopNav.css";
import { useI18n } from "../../app/i18n.jsx";
import DrawerMenu from "../navigation/DrawerMenu/DrawerMenu.jsx";
import Icon from "../../ui/Icon/Icon.jsx";
import Modal from "../Modal/Modal.jsx";

export default function TopNav() {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const menuButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchSuggestions = useMemo(() => {
    const value = t("navSearch.suggestions");
    return Array.isArray(value) ? value : [];
  }, [t]);

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
                <button
                  type="button"
                  className="topnav__link topnav__link-button"
                  aria-haspopup="dialog"
                  aria-expanded={isSearchOpen ? "true" : "false"}
                  onClick={() => setIsSearchOpen(true)}
                  ref={searchButtonRef}
                >
                  <Icon name="search" size="md" decorative />
                  <span className="topnav__link-text">{t("nav.search")}</span>
                </button>
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
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        titleId="nav-search-title"
        descriptionId="nav-search-description"
        triggerRef={searchButtonRef}
      >
        <div className="nav-search-modal">
          <div className="nav-search-modal__header">
            <div>
              <h2 id="nav-search-title" className="nav-search-modal__title">
                {t("navSearch.title")}
              </h2>
              <p id="nav-search-description" className="nav-search-modal__subtitle">
                {t("navSearch.subtitle")}
              </p>
            </div>
            <button
              type="button"
              className="nav-search-modal__close"
              aria-label={t("navSearch.close")}
              onClick={() => setIsSearchOpen(false)}
            >
              <Icon name="close" size="md" decorative />
            </button>
          </div>
          <label className="nav-search-modal__field">
            <span className="nav-search-modal__icon" aria-hidden="true">
              <Icon name="search" size="md" decorative />
            </span>
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={t("navSearch.placeholder")}
              className="nav-search-modal__input"
              autoFocus
            />
          </label>
          <div className="nav-search-modal__section">
            <span className="nav-search-modal__label">{t("navSearch.suggestionsLabel")}</span>
            <ul className="nav-search-modal__list">
              {searchSuggestions.map((item) => (
                <li key={item}>
                  <a href="#" className="nav-search-modal__link">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </header>
  );
}
