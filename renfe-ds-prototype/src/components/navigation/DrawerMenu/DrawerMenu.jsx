import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "../../../ui/atoms/Link/Link.jsx";
import InputText from "../../../ui/atoms/InputText/InputText.jsx";
import Modal from "../../Modal/Modal.jsx";
import VisuallyHidden from "../../../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
import useFocusTrap from "../../a11y/useFocusTrap.js";
import Button from "../../../ui/atoms/Button/Button.jsx";
import Icon from "../../../ui/Icon/Icon.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import { useTheme } from "../../../app/theme.jsx";
import "./DrawerMenu.css";

export default function DrawerMenu({ isOpen, onClose, triggerRef }) {
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const panelRef = useRef(null);
  const cookiesButtonRef = useRef(null);
  const [isCookiesOpen, setIsCookiesOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useFocusTrap(panelRef, isOpen, onClose);

  useEffect(() => {
    if (!isOpen && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div className="drawer" role="dialog" aria-modal="true" aria-label={t("drawer.menuTitle")}>
      <div className="drawer__overlay" onClick={onClose} aria-hidden="true" />
      <div className="drawer__panel" ref={panelRef} id="drawer-menu">

        <div className="drawer__search">
          <InputText
            label={t("drawer.searchLabel")}
            inputId="drawer-search"
            helperId="drawer-search-helper"
            helperText=""
            placeholder={t("drawer.searchPlaceholder")}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            leadingIcon={<Icon name="search" size="m" decorative />}
          />
        </div>

        <div className="drawer__section">
          <ul className="drawer__list" aria-label={t("drawer.navigation")}>
            <li>
              <Link className="drawer__row" to="/cercanias" onClick={onClose}>
                <Icon name="train" size="md" decorative />
                <span className="drawer__row-text">{t("drawer.cercanias")}</span>
              </Link>
            </li>
            <li>
              <Link className="drawer__row" to="/viaja" onClick={onClose}>
                <Icon name="route" size="md" decorative />
                <span className="drawer__row-text">{t("drawer.viaja")}</span>
              </Link>
            </li>
            <li>
              <Link className="drawer__row" to="/inspira" onClick={onClose}>
                <Icon name="lightbulb" size="md" decorative />
                <span className="drawer__row-text">{t("drawer.inspira")}</span>
              </Link>
            </li>
            <li>
              <Link className="drawer__row" to="/gestiona-billete" onClick={onClose}>
                <Icon name="confirmation_number" size="md" decorative />
                <span className="drawer__row-text">{t("drawer.manageTicket")}</span>
              </Link>
            </li>
            <li>
              <Link className="drawer__row" to="/mas-renfe" onClick={onClose}>
                <Icon name="more_horiz" size="md" decorative />
                <span className="drawer__row-text">{t("drawer.moreRenfe")}</span>
              </Link>
            </li>
            <li>
              <Link className="drawer__row" href="#help" onClick={onClose}>
                <Icon name="support_agent" size="md" decorative />
                <span className="drawer__row-text">{t("drawer.help")}</span>
              </Link>
            </li>
            <li>
              <Link className="drawer__row" to="/login" onClick={onClose}>
                <Icon name="person" size="md" decorative />
                <span className="drawer__row-text">{t("drawer.access")}</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="drawer__section drawer__section--settings">
          <h3 className="drawer__section-title">{t("drawer.settings")}</h3>
          <div className="drawer__row drawer__row--static">
            <Icon name="language" size="md" decorative />
            <div className="drawer__row-text">
              <label className="drawer__label" htmlFor="drawer-language">
                {t("drawer.language")}
              </label>
            </div>
            <select
              id="drawer-language"
              className="drawer__select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </div>

          <button
            type="button"
            className="drawer__row drawer__row--action"
            onClick={() => setIsCookiesOpen(true)}
            ref={cookiesButtonRef}
          >
            <Icon name="cookie" size="md" decorative />
            <span className="drawer__row-text">{t("drawer.cookies")}</span>
            <span className="drawer__row-action">{t("common.change")}</span>
          </button>

          <button
            type="button"
            className="drawer__row drawer__row--action"
            onClick={toggleTheme}
            aria-pressed={theme === "dark" ? "true" : "false"}
          >
            <Icon
              name={theme === "dark" ? "dark_mode" : "light_mode"}
              size="md"
              decorative
            />
            <span className="drawer__row-text">{t("drawer.darkMode")}</span>
            <span className="drawer__row-action">{t("common.change")}</span>
            <VisuallyHidden>
              {theme === "dark" ? t("drawer.modeOn") : t("drawer.modeOff")}
            </VisuallyHidden>
          </button>
        </div>
      </div>

      <Modal
        isOpen={isCookiesOpen}
        onClose={() => setIsCookiesOpen(false)}
        titleId="cookies-title"
        descriptionId="cookies-desc"
        triggerRef={cookiesButtonRef}
      >
        <h2 id="cookies-title" className="section-title">{t("drawer.cookies")}</h2>
        <p id="cookies-desc">{t("drawer.cookiesMvp")}</p>
        <div className="drawer__modal-actions">
          <Button variant="primary" onClick={() => setIsCookiesOpen(false)}>
            {t("common.accept")}
          </Button>
        </div>
      </Modal>
    </div>,
    document.body
  );
}
