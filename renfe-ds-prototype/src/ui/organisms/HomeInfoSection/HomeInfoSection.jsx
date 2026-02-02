import Alert from "../../atoms/Alert/Alert.jsx";
import Button from "../../atoms/Button/Button.jsx";
import VisuallyHidden from "../../atoms/VisuallyHidden/VisuallyHidden.jsx";
import Icon from "../../Icon/Icon.jsx";
import "./HomeInfoSection.css";

export default function HomeInfoSection() {
  return (
    <section className="home-info" aria-labelledby="home-info-title">
      <Alert type="warning" title="Aviso">
        <div className="home-info__alert-body">
          <span className="home-info__alert-icon" aria-hidden="true">
            <Icon name="warning" size="md" decorative />
          </span>
          <p className="home-info__alert-text">
            Por limitaciones temporales de velocidad indicadas por el gestor de infraestructuras (Adif) en varios puntos de la red, algunos servicios pueden sufrir retrasos ajenos a Renfe. Los billetes comprados a partir del 31 de enero no generan derecho a indemnización cuando el retraso se deba a estas limitaciones. Lamentamos las molestias y agradecemos tu comprensión.
          </p>
        </div>
      </Alert>

      <div className="home-info__incident">
        <div className="home-info__incident-content">
          <h2 id="home-info-title" className="home-info__incident-title">Accidente ferroviario</h2>
          <p className="home-info__incident-text">
            Renfe lamenta el siniestro ocurrido en Adamuz (Córdoba) y traslada sus condolencias a las familias. Deseamos una pronta recuperación a las personas heridas.
          </p>
          <ul className="home-info__incident-list">
            <li>La circulación de Alta Velocidad entre Madrid y Andalucía permanece suspendida hasta nuevo aviso.</li>
            <li>Los servicios comerciales entre Madrid, Toledo, Ciudad Real y Puertollano operan con normalidad.</li>
            <li>Se han habilitado cambios y anulaciones sin coste para personas afectadas (taquillas, agencias, web o teléfono 91 232 03 20).</li>
          </ul>
          <div className="home-info__incident-footer">
            <div>
              <p className="home-info__incident-text">Para familiares, Renfe pone a disposición el teléfono:</p>
              <div className="home-info__phone">
                <VisuallyHidden>Teléfono</VisuallyHidden>
                900 10 10 20
              </div>
            </div>
            <Button variant="primary" size="l">
              Información del plan alternativo
            </Button>
          </div>
        </div>
        <div className="home-info__incident-visual" aria-hidden="true" />
      </div>
    </section>
  );
}
