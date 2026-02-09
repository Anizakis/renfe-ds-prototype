import Container from "../../atoms/Container/Container.jsx";
import Link from "../../atoms/Link/Link.jsx";
import Icon from "../../atoms/Icon/Icon.jsx";
import { useI18n } from "../../../app/i18n.jsx";
import "./Footer.css";

export default function Footer() {
  const { t } = useI18n();

  const aboutLinks = t("footer.about.links");
  const commuterLinks = t("footer.commuter.links");
  const helpLinks = t("footer.help.links");
  const appsLinks = t("footer.apps.links");
  const routesLinks = t("footer.routes.links");

  const buildLinks = (labels, hrefs) => (
    Array.isArray(labels)
      ? labels.map((label, index) => ({
        label,
        href: hrefs[index] ?? "#",
      }))
      : []
  );

  const aboutItems = buildLinks(aboutLinks, ["#", "#", "#", "#"]);
  const commuterItems = buildLinks(commuterLinks, ["#", "#", "#", "#"]);
  const helpItems = buildLinks(helpLinks, ["#", "#", "#", "#"]);
  const appsItems = buildLinks(appsLinks, ["#", "#", "#", "#"]);
  const routesItems = buildLinks(routesLinks, ["#", "#", "#", "#"]);

  const socialLinks = [
    { key: "facebook", icon: "group", href: "#" },
    { key: "instagram", icon: "photo_camera", href: "#" },
    { key: "x", icon: "alternate_email", href: "#" },
    { key: "youtube", icon: "smart_display", href: "#" },
    { key: "linkedin", icon: "work", href: "#" },
    { key: "tiktok", icon: "music_note", href: "#" },
  ];

  return (
    <footer className="footer">
      <Container className="footer__container">
        <div className="footer__top">
          <div className="footer__left">
            <LinkColumn
              title={t("footer.about.title")}
              items={aboutItems}
              moreLabel={t("footer.more")}
              moreHref="#"
            />
            <NoticeLink label={t("footer.notices")} href="#" />
            <SocialLinks title={t("footer.social.title")} links={socialLinks} t={t} />
          </div>
          <span className="footer__divider" aria-hidden="true" />
          <div className="footer__columns">
            <LinkColumn
              title={t("footer.commuter.title")}
              items={commuterItems}
              moreLabel={t("footer.more")}
              moreHref="#"
            />
            <LinkColumn
              title={t("footer.help.title")}
              items={helpItems}
              moreLabel={t("footer.more")}
              moreHref="#"
            />
            <LinkColumn
              title={t("footer.apps.title")}
              items={appsItems}
              moreLabel={t("footer.more")}
              moreHref="#"
            />
            <LinkColumn
              title={t("footer.routes.title")}
              items={routesItems}
              moreLabel={t("footer.more")}
              moreHref="#"
            />
          </div>
        </div>

        <LegalBar t={t} />
      </Container>
    </footer>
  );
}

function LinkColumn({ title, items, moreLabel, moreHref }) {
  return (
    <div className="footer__column">
      <h2 className="footer__title">{title}</h2>
      <ul className="footer__links">
        {items.map((item) => (
          <li key={item.label} className="footer__link-item">
            <Link href={item.href} className="footer__link">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href={moreHref} className="footer__more">
        {moreLabel}
      </Link>
    </div>
  );
}

function NoticeLink({ label, href }) {
  return (
    <Link href={href} className="footer__notice">
      <span className="footer__notice-icon" aria-hidden="true">
        <Icon name="warning" size="sm" decorative />
      </span>
      <span className="footer__notice-text">{label}</span>
    </Link>
  );
}

function SocialLinks({ title, links, t }) {
  return (
    <div className="footer__social">
      <span className="footer__social-title">{title}</span>
      <div className="footer__social-links">
        {links.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="footer__social-link"
            aria-label={t(`footer.social.${item.key}`)}
          >
            <Icon name={item.icon} size="sm" decorative />
          </Link>
        ))}
      </div>
    </div>
  );
}

function LegalBar({ t }) {
  return (
    <div className="footer__bottom">
      <ul className="footer__legal-links">
        <li>
          <Link href="#" className="footer__legal-link">{t("footer.legal.info")}</Link>
        </li>
        <li>
          <Link href="#" className="footer__legal-link">{t("footer.legal.privacy")}</Link>
        </li>
        <li>
          <Link href="#" className="footer__legal-link">{t("footer.legal.accessibility")}</Link>
        </li>
        <li>
          <Link href="#" className="footer__legal-link">{t("footer.legal.cyber")}</Link>
        </li>
      </ul>
      <span className="footer__copyright">{t("footer.copyright")}</span>
      <div className="footer__ministerio">
        <img
          src="/renfe-seeklogo.svg"
          alt={t("footer.ministryAlt")}
          className="footer__ministerio-logo"
        />
      </div>
    </div>
  );
}
