import Alert from "../../atoms/Alert/Alert.jsx";
import Button from "../../atoms/Button/Button.jsx";
import VisuallyHidden from "../../atoms/VisuallyHidden/VisuallyHidden.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import "./HomeInfoSection.css";

export default function HomeInfoSection() {
  const { t } = useI18n();

  return (
    <section className="home-info" aria-labelledby="home-info-title">
      <Alert type="warning" title={t("home.notice.title")} iconName="warning">
        <p>{t("home.notice.body")}</p>
      </Alert>

      <div className="home-info__incident">
        <div className="home-info__incident-content">
          <h2 id="home-info-title" className="home-info__incident-title">{t("home.incident.title")}</h2>
          <p className="home-info__incident-text">
            {t("home.incident.body")}
          </p>
          <ul className="home-info__incident-list">
            <li>{t("home.incident.list1")}</li>
            <li>{t("home.incident.list2")}</li>
            <li>{t("home.incident.list3")}</li>
          </ul>
          <div className="home-info__incident-footer">
            <div>
              <p className="home-info__incident-text">{t("home.incident.phoneIntro")}</p>
              <div className="home-info__phone">
                <VisuallyHidden>{t("home.incident.phoneLabel")}</VisuallyHidden>
                {t("home.incident.phoneNumber")}
              </div>
            </div>
            <Button variant="primary" size="l">
              {t("home.incident.cta")}
            </Button>
          </div>
        </div>
        <div className="home-info__incident-visual" aria-hidden="true">
        <img src="/mapatransportealternativo-accidente-30.jpeg"
    alt=""
    className="home-info__incident-image"
    loading="lazy"
    decoding="async"
  />
</div>
      </div>
    </section>
  );
}
