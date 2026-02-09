import { NavLink } from "react-router-dom";
import { useMemo, useRef, useState, useEffect } from "react";
import Container from "../../atoms/Container/Container.jsx";
import InputText from "../../atoms/InputText/InputText.jsx";
import Link from "../../atoms/Link/Link.jsx";
import Button from "../../atoms/Button/Button.jsx";
import "./TopNav.css";
import { useI18n } from "../../../app/i18n.jsx";
import { useTravel } from "../../../app/store.jsx";
import DrawerMenu from "../DrawerMenu/DrawerMenu.jsx";
import Icon from "../../atoms/Icon/Icon.jsx";
import Modal from "../../molecules/Modal/Modal.jsx";

export default function TopNav() {
  const { t } = useI18n();
  const { state } = useTravel();
  const isAuthenticated = Boolean(state?.auth?.isAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const menuButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);
    // Enfocar el input solo al abrir el modal
    useEffect(() => {
      if (isSearchOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isSearchOpen]);
  const searchSuggestions = useMemo(() => {
    const value = t("navSearch.suggestions");
    return Array.isArray(value) ? value : [];
  }, [t]);

  return (
    <header className="topnav">
      <Container className="topnav__inner" as="div">
        <div className="topnav__row">
          <div className="topnav__left">
            <Link className="topnav__brand" to="/" aria-label={t("appName")}>
              <span className="topnav__logo-box" aria-hidden="true">
                <span className="topnav__logo" aria-hidden="true" />
              </span>
            </Link>
          </div>

          <nav className="topnav__center" aria-label={t("nav.mainLabel")}>
            <ul className="topnav__list">
              <li>
                <Link
                  className="topnav__link topnav__link-button"
                  to="/search"
                  aria-haspopup="dialog"
                  aria-expanded={isSearchOpen ? "true" : "false"}
                  ref={searchButtonRef}
                >
                  <Icon name="search" size="md" decorative />
                  <span className="topnav__link-text">{t("nav.search")}</span>
                </Link>
              </li>
              <li>
                <Link
                  className="topnav__link topnav__link-button"
                  to="/help"
                >
                  <Icon name="help" size="md" decorative />
                  <span className="topnav__link-text">{t("nav.help")}</span>
                </Link>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `topnav__link ${isActive ? "active" : ""}`}
                >
                  <Icon name="person" size="md" decorative />
                  <span className="topnav__link-text">
                    {isAuthenticated ? t("nav.account") : t("nav.access")}
                  </span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="topnav__right">
            <Button
              variant="secondary"
              size="s"
              className="topnav__menu-btn"
              aria-label={isMenuOpen ? t("nav.menuClose") : t("nav.menuOpen")}
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-controls="drawer-menu"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              ref={menuButtonRef}
            >
              <span className="topnav__menu-label">{t("nav.menu")}</span>
              <Icon name={isMenuOpen ? "close" : "menu"} size="md" decorative />
            </Button>
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
          <InputText
            inputId="nav-search-modal-input"
            label=""
            hideLabel={true}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t("navSearch.placeholder")}
            leadingIcon={<Icon name="search" size="m" decorative />}
            inputProps={{ type: "search" }}
            inputRef={searchInputRef}
            helperText=""
            hideHelper={true}
            showCounter={false}
          />
          <div className="nav-search-modal__section">
            <span className="nav-search-modal__label">{t("navSearch.suggestionsLabel")}</span>
            <ul className="nav-search-modal__list">
              {searchSuggestions.map((item) => (
                <li key={item}>
                  <Link href="#" className="nav-search-modal__link">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </header>
  );
}