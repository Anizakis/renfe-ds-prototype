import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import TopNav from "../components/TopNav/TopNav.jsx";
import { useI18n } from "./i18n.jsx";
import "./app.css";

export default function AppLayout() {
  const { t } = useI18n();
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    const main = mainRef.current;
    if (main) {
      main.focus();
    }
  }, [location]);

  return (
    <div className="app-root">
      <a href="#main" className="skip-link">{t("common.skipToContent")}</a>
      <TopNav />
      <main id="main" ref={mainRef} tabIndex={-1} className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
