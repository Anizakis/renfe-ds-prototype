import React, { useMemo, useState } from "react";

const SPACING = [
  "00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18"
];

const RADII = ["00","01","02","03","04","05","pill"];

const TYPE = [
  { label: "Heading H1", cls: "ds-h1" },
  { label: "Heading H2", cls: "ds-h2" },
  { label: "Heading H3", cls: "ds-h3" },
  { label: "Heading H4", cls: "ds-h4" },
  { label: "Text L Regular", cls: "ds-text-l ds-regular" },
  { label: "Text L Medium", cls: "ds-text-l ds-medium" },
  { label: "Text L Bold", cls: "ds-text-l ds-bold" },
  { label: "Text M Regular", cls: "ds-text-m ds-regular" },
  { label: "Text S Regular", cls: "ds-text-s ds-regular" },
  { label: "Text XS Regular", cls: "ds-text-xs ds-regular" },
  { label: "Link (underline)", cls: "ds-text-m ds-medium ds-link" },
];

export default function App() {
  // si ya tienes dark/light con data-theme, esto te sirve para alternar
  const [theme, setTheme] = useState("light");

  // Si en tu tokens.colors.css usas [data-theme="dark"] / [data-theme="light"],
  // esto lo activará en toda la app.
  const rootProps = useMemo(() => ({ "data-theme": theme }), [theme]);

  return (
    <div {...rootProps} className="demo-root">
      <header className="demo-header">
        <div>
          <p className="demo-kicker">Renfe DS • Tokens Playground</p>
          <h1 className="demo-title">Demo de tokens (CSS puro)</h1>
          <p className="demo-subtitle">
            Tipografía, spacing, layout, radius, colores e iconos (Material Symbols).
          </p>
        </div>

        <div className="demo-actions">
          <button
            className="demo-btn"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            type="button"
          >
            Cambiar a {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      {/* Layout: container + grid */}
      <section className="demo-section">
        <h2 className="demo-h2">Layout</h2>

        <div className="ds-container">
          <div className="demo-card ds-radius-04">
            <div className="demo-card__head">
              <span className="demo-badge ds-radius-pill">ds-container</span>
              <span className="demo-badge ds-radius-pill">ds-grid</span>
            </div>

            <div className="ds-grid demo-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="demo-tile ds-radius-03">
                  <span className="demo-tile__n">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="demo-section">
        <h2 className="demo-h2">Tipografía</h2>

        <div className="demo-card ds-radius-04">
          <div className="demo-type">
            {TYPE.map((t) => (
              <div key={t.label} className="demo-type__row">
                <div className="demo-type__meta">{t.label}</div>
                <div className={t.cls}>
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="demo-section">
        <h2 className="demo-h2">Spacing</h2>

        <div className="demo-card ds-radius-04">
          <div className="demo-spacing">
            {SPACING.map((k) => (
              <div key={k} className="demo-spacing__row">
                <div className="demo-spacing__meta">--spacing-{k}</div>
                <div className="demo-spacing__barWrap ds-radius-pill">
                  <div className={`demo-spacing__bar sp-${k} ds-radius-pill`} />
                </div>
                <div className="demo-spacing__val">
                  <code>var(--spacing-{k})</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Radii */}
      <section className="demo-section">
        <h2 className="demo-h2">Radii</h2>

        <div className="demo-card ds-radius-04">
          <div className="demo-radii">
            {RADII.map((r) => (
              <div key={r} className="demo-radii__item">
                <div className={`demo-radii__shape rad-${r}`} />
                <div className="demo-radii__meta">
                  <div className="demo-radii__label">--radius-{r}</div>
                  <code>var(--radius-{r})</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="demo-section">
        <h2 className="demo-h2">Iconos (Material Symbols)</h2>

        <div className="demo-card ds-radius-04">
          <p className="demo-muted">
            Si ya importaste Material Symbols, deberían verse. Si sale un cuadrado/“tofu”, falta el import.
          </p>

          <div className="demo-icons">
            <IconRow label="Icon S (vinculado a text.s)" sizeCls="ds-icon-s" />
            <IconRow label="Icon M (vinculado a text.m)" sizeCls="ds-icon-m" />
            <IconRow label="Icon L (vinculado a text.l)" sizeCls="ds-icon-l" />
          </div>
        </div>
      </section>

      <footer className="demo-footer">
        <p className="demo-muted">
          Siguiente paso cuando quieras: mapear tokens a Tailwind (spacing/screen/radius/colors).
        </p>
      </footer>
    </div>
  );
}

function IconRow({ label, sizeCls }) {
  return (
    <div className="demo-iconRow">
      <div className="demo-iconRow__label">{label}</div>

      <div className="demo-iconRow__icons">
        <span className={`ds-icon ${sizeCls}`} aria-hidden="true">
          search
        </span>
        <span className={`ds-icon ${sizeCls}`} aria-hidden="true">
          close
        </span>
        <span className={`ds-icon ${sizeCls}`} aria-hidden="true">
          arrow_forward
        </span>
        <span className={`ds-icon ${sizeCls}`} aria-hidden="true">
          check_circle
        </span>
      </div>
    </div>
  );
}


/*prefiero trabajar a partír de ahora en vscode, así que dame un prompt como un auténtico 
pro del diseño web para que me ayude a llevar todo el sistema de diseño de figma a react*/