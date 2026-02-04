# Renfe DS – Prototipo React (Sistema de Diseño + Flujo de compra)

**Demo (Vercel):** https://renfe-ds-prototype.vercel.app/ 
**Estado del entorno:** Demo / Preview (no producción)  

Prototipo web funcional que implementa un **sistema de diseño basado en tokens CSS** y componentes React organizados por atomic design.
**Sirve para** explorar el flujo de compra y validar UI/UX de componentes.
**NO es** un producto en producción ni un backend real.

**Figma (referencia de diseño):**
https://www.figma.com/design/w35IU8NIuPwoyJKtOEwSbl/Sistema-de-dise%C3%B1o-Renfe?node-id=201-2&t=Pxr5TXgANgoR8vqV-1

---

## TL;DR (comandos esenciales)
```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
npm run tokens:colors
```

---

## Tabla de contenidos
1. [Resumen de inspección](#resumen-de-inspección)
2. [Deployments / Entornos](#deployments--entornos)
3. [Stack & dependencias clave](#stack--dependencias-clave)
4. [Setup local paso a paso](#setup-local-paso-a-paso)
5. [Arquitectura del proyecto](#arquitectura-del-proyecto)
6. [Sistema de diseño](#sistema-de-diseño)
7. [Flujos del prototipo](#flujos-del-prototipo)
8. [Accesibilidad](#accesibilidad)
9. [Gobernanza mínima del Sistema de Diseño](#gobernanza-mínima-del-sistema-de-diseño)
10. [Calidad y mantenimiento](#calidad-y-mantenimiento)
11. [Guías de contribución](#guías-de-contribución)
12. [Epics de evolución del prototipo (nuevos recorridos + backend real)](#epics-de-evolución-del-prototipo-nuevos-recorridos--backend-real)
	- [Backlog / TODOs (priorizado)](#backlog--todos-priorizado)
13. [Documentación y estado del repo](#documentación-y-estado-del-repo)
14. [Licencia / contacto](#licencia--contacto)
15. [📌 Archivos revisados](#-archivos-revisados)

---

## Resumen de inspección
- Prototipo React + Vite con React Router, ESLint y Tailwind/PostCSS (ver [package.json](package.json), [vite.config.js](vite.config.js), [eslint.config.js](eslint.config.js), [tailwind.config.js](tailwind.config.js)).
- Rutas del flujo de compra definidas en [src/app/router.jsx](src/app/router.jsx).
- Estado global con Context + `useReducer` y persistencia en localStorage en [src/app/store.jsx](src/app/store.jsx).
- i18n propio con provider en [src/app/i18n.jsx](src/app/i18n.jsx).
- Tokens CSS cargados desde [src/styles](src/styles) en [src/main.jsx](src/main.jsx).
- Tema claro/oscuro con `ThemeProvider` y clase `.dark` en [src/app/theme.jsx](src/app/theme.jsx) y [index.html](index.html).
- UI organizada por atomic design en [src/ui](src/ui) con convención documentada en [src/ui/README.md](src/ui/README.md).
- Datos mock y generadores de viajes en [src/data/mockData.js](src/data/mockData.js).
- Plantilla de PR presente en [.github/pull_request_template.md](.github/pull_request_template.md).
- CI mínima configurada en [.github/workflows/ci.yml](.github/workflows/ci.yml).
- Tests configurados (Vitest/Testing Library + Playwright) en [package.json](package.json) y [playwright.config.js](playwright.config.js).
- No existe `CHANGELOG.md` en el repositorio.

---

## Deployments / Entornos

> Nota: que esté desplegado en Vercel **no implica** que sea “producción”. En este repo se considera **Demo/Preview** salvo que se declare explícitamente lo contrario.

| Entorno | URL | Uso | Datos |
|---|---|---|---|
| Demo (Vercel) | (igual que arriba) | Validación UI/UX del flujo y componentes | Mock (`src/data/mockData.js`) |
| Preview (PRs) | (auto-generado por Vercel) | Revisión de cambios por PR | Mock |

### Convención de etiquetado (para evitar confusiones)
- **Preview:** deployments por Pull Request / branch.
- **Demo:** entorno estable para demos internas y revisiones.
- **Staging:** no definido en el repo.
- **Prod:** no definido en el repo.

### Checklist mínimo antes de considerar “Prod”
- [ ] CI pasando (`lint` + `build`) en PRs (ya existe: `.github/workflows/ci.yml`)
- [ ] Versionado + `CHANGELOG.md`
- [ ] Política de approvals (CODEOWNERS con handles reales + revisores)
- [ ] Validación a11y mínima por PR (manual o automatizada)
- [ ] Observabilidad mínima (logs/errores) y responsabilidades definidas

---

## Stack & dependencias clave

**Stack detectado (real):** React 19 + Vite 7 + React Router 6 + Tailwind (utilities base) + CSS tokens.

**Tabla: Tecnología → Para qué se usa → Dónde vive**

| Tecnología | Para qué se usa | Dónde vive |
|---|---|---|
| React 19 | UI y componentes | [package.json](package.json) |
| Vite 7 | Dev server/build | [package.json](package.json), [vite.config.js](vite.config.js) |
| React Router | Rutas del prototipo | [src/app/router.jsx](src/app/router.jsx) |
| Tailwind + PostCSS | Base/Utilities | [src/index.css](src/index.css), [tailwind.config.js](tailwind.config.js), [postcss.config.js](postcss.config.js) |
| Tokens CSS | Fuente de verdad visual | [src/styles](src/styles), cargados en [src/main.jsx](src/main.jsx) |
| i18n propio | ES/EN en runtime | [src/app/i18n.jsx](src/app/i18n.jsx) |
| Store propio | Estado + persistencia | [src/app/store.jsx](src/app/store.jsx) |
| Theme (dark) | Clase `.dark` | [src/app/theme.jsx](src/app/theme.jsx), [index.html](index.html) |
| Material Symbols | Iconografía | [index.html](index.html), [src/ui/Icon/Icon.jsx](src/ui/Icon/Icon.jsx) |
| ESLint | Lint de JS/JSX | [eslint.config.js](eslint.config.js) |

---

## Setup local paso a paso

### Requisitos
- Node.js 18+ (ver [.nvmrc](.nvmrc) y `engines` en [package.json](package.json)).

### Instalación
```bash
npm install
```

### Ejecutar en desarrollo
```bash
npm run dev
```

### Build + preview
```bash
npm run build
npm run preview
```

### Tokens (colores desde Figma)
```bash
npm run tokens:colors
```
Script: [src/scripts/figma-colors-to-css.mjs](src/scripts/figma-colors-to-css.mjs)

### Variables de entorno
- Ejemplo disponible en [.env.example](.env.example).
- No hay variables reales declaradas en el repo.

### Troubleshooting
- Si no cargan iconos, revisa Material Symbols en [index.html](index.html).
- Si el tema no cambia, verifica `.dark` en `<html>` y [src/app/theme.jsx](src/app/theme.jsx).

---

## Arquitectura del proyecto

### Árbol /src (explicado)
```
src/
	app/        # Router, store, i18n, utils, theme
	data/       # Mock data (viajes, tarifas, extras)
	pages/      # Pantallas del flujo
	styles/     # Tokens (colors, spacing, type, radius, effects, layout, icons)
	templates/  # Layouts de páginas (Results/Payment)
	ui/         # Sistema de diseño (atoms/molecules/organisms)
	index.css   # base + utilities tailwind + tipografía global
	main.jsx    # bootstrap providers + tokens
```

**Capas principales**
- **Routes/Pages:** [src/pages](src/pages)
- **Layout/App:** [src/app/AppLayout.jsx](src/app/AppLayout.jsx)
- **State/persistencia:** [src/app/store.jsx](src/app/store.jsx)
- **i18n:** [src/app/i18n.jsx](src/app/i18n.jsx)
- **Theme:** [src/app/theme.jsx](src/app/theme.jsx)
- **UI System:** [src/ui](src/ui)
- **Tokens:** [src/styles](src/styles)

**Convenciones de nombres**
- PascalCase en carpetas/componentes.
- Estados CSS con `is-*`.
- BEM-like interno.
Fuente: [src/ui/README.md](src/ui/README.md)

---

## Sistema de diseño

### Principios y alcance
- Sistema basado en **tokens CSS** + componentes React.
- Reutilizable para páginas del flujo de compra.
- No incluye backend ni persistencia remota.

### Tokens

**Dónde están**
- Colores: [src/styles/tokens.colors.css](src/styles/tokens.colors.css)
- Tipografía: [src/styles/tokens.type.css](src/styles/tokens.type.css)
- Spacing: [src/styles/tokens.spacing.css](src/styles/tokens.spacing.css)
- Radius: [src/styles/tokens.radius.css](src/styles/tokens.radius.css)
- Effects/Focus/Blur: [src/styles/tokens.effects.css](src/styles/tokens.effects.css)
- Layout/Grid: [src/styles/tokens.layout.css](src/styles/tokens.layout.css)
- Iconos: [src/styles/tokens.icons.css](src/styles/tokens.icons.css)

**Formato y consumo**
- Tokens son variables CSS `--*` y se cargan en [src/main.jsx](src/main.jsx).

**Ejemplo real de uso**
```css
.btn {
	border-radius: var(--radius-03);
	font-family: var(--font-family-primary);
	transition: background-color 150ms ease;
}
.btn--primary { background: var(--color-brand-600); }
```
Fuente: [src/ui/atoms/Button/Button.css](src/ui/atoms/Button/Button.css)

**Reglas**
- Evitar hardcode de valores; usar tokens siempre.
- Colores se regeneran desde Figma: [src/scripts/figma-colors-to-css.mjs](src/scripts/figma-colors-to-css.mjs).
- No hay scripts para tokens de spacing/type/radius; se gestionan manualmente en [src/styles](src/styles).

### Estilos / theming
- Estrategia: **CSS variables + clases base**.
- Dark mode por clase `.dark` en `<html>` y persistencia en localStorage.
Fuente: [src/app/theme.jsx](src/app/theme.jsx), [src/index.css](src/index.css)

### Componentes

#### Catálogo por categorías

**Atoms** ([src/ui/atoms](src/ui/atoms))
Alert, Button, Checkbox, Container, Dropdown, Grid, InputText, Link, Loading, PageStack, RadioGroup, Slider, Stack, Switch, VisuallyHidden

**Molecules** ([src/ui/molecules](src/ui/molecules))
DatePicker, DayPickerStrip, FilterSection, JourneyCard, LanguageSwitcher, Modal, OnlyAvailableDaysToggle, PassengerSelector, PasswordField, PriceDetailsModal, PromoCard, ResultsAppliedFiltersBar, ResultsEmpty, ResultsSummary, SkeletonList, Tabs

**Organisms** ([src/ui/organisms](src/ui/organisms))
AnimatedCheckoutStepper, DrawerMenu, ExtrasList, FareComparison, Footer, HomeInfoSection, HomeSearch, JourneyList, Login, PriceBreakdown, PromoGrid, RegisterForm, ResultsFilters, ResultsFiltersDrawer, ResultsHeader, ResultsToolbar, StickySummaryBar, TopNav, TravelerForm

**Nota:** `Tabs` está en molecules pero exportado desde [src/ui/atoms/index.js](src/ui/atoms/index.js).

---

### Componentes relevantes (API + uso real + a11y)

#### 1) `Button`
- **Problema:** CTA y acciones consistentes con tokens.
- **API (props clave):** `variant`, `size`, `loading`, `disabled`, `leadingIcon`, `trailingIcon`.
Fuente: [src/ui/atoms/Button/Button.jsx](src/ui/atoms/Button/Button.jsx)

**Uso real**
```jsx
<Button variant="primary" onClick={handlePay} disabled={isLoading}>
	{t("payment.pay")}
</Button>
```
Fuente: [src/pages/Payment.jsx](src/pages/Payment.jsx)

**A11y:** `aria-busy` en loading + estados disabled en HTML.

---

#### 2) `InputText`
- **Problema:** Inputs accesibles con label, helper y estados.
- **API clave:** `label`, `helperText`, `state`, `inputId`, `helperId`, `inputProps`.
Fuente: [src/ui/atoms/InputText/InputText.jsx](src/ui/atoms/InputText/InputText.jsx)

**Uso real**
```jsx
<InputText label={t("payment.cardNumber")} inputId="card-number" helperText="" />
```
Fuente: [src/pages/Payment.jsx](src/pages/Payment.jsx)

**A11y:** `aria-invalid`, `aria-describedby`, label asociado.

---

#### 3) `Tabs`
- **Problema:** navegación por días con teclado.
- **API:** `tabs`, `activeId`, `onChange`, `label`.
Fuente: [src/ui/molecules/Tabs/Tabs.jsx](src/ui/molecules/Tabs/Tabs.jsx)

**A11y:** `role="tablist"` + navegación con ArrowLeft/Right, Home/End.

---

#### 4) `Modal`
- **Problema:** overlays con focus trap.
- **API:** `isOpen`, `titleId`, `descriptionId`, `onClose`, `triggerRef`.
Fuente: [src/ui/molecules/Modal/Modal.jsx](src/ui/molecules/Modal/Modal.jsx)

**A11y:** `role="dialog"`, `aria-modal`, retorno de foco al trigger.

---

#### 5) `StickySummaryBar`
- **Problema:** resumen de compra persistente con detalles.
- **API:** `journey`, `returnJourney`, `total`, `breakdownItems`, `onContinue`, `onViewDetails`, `helper`.
Fuente: [src/ui/organisms/StickySummaryBar/StickySummaryBar.jsx](src/ui/organisms/StickySummaryBar/StickySummaryBar.jsx)

**A11y:** `aria-live` para cambios de precio.

---

#### 6) `PriceBreakdown`
- **Problema:** desglose del precio final (single column con iconos).
- **API:** `title`, `items`, `total`, `totalLabel`.
Fuente: [src/ui/organisms/PriceBreakdown/PriceBreakdown.jsx](src/ui/organisms/PriceBreakdown/PriceBreakdown.jsx)

---

## Flujos del prototipo

### Pantallas (router)
Definidas en [src/app/router.jsx](src/app/router.jsx):

- `/` → Home (buscador)
- `/login` → Login
- `/register` → Registro
- `/results` → Selección de trenes y filtros
- `/fares` → Comparativa de tarifas
- `/travelers` → Datos de pasajeros
- `/extras` → Extras seleccionables
- `/payment` → Pago + resumen

### User journeys principales
1) Buscar → Resultados → Tarifas → Viajeros → Extras → Pago
Fuentes: [src/pages](src/pages), [src/app/router.jsx](src/app/router.jsx)

### Datos mock/fixtures
- Generación de viajes y catálogos: [src/data/mockData.js](src/data/mockData.js)
- Estaciones: [src/data/stations.es.json](src/data/stations.es.json), [estaciones.csv](estaciones.csv)

---

## Accesibilidad (a11y)

El prototipo se ha preparado para ser operable por teclado y compatible con tecnologías de asistencia mediante:

- **Landmarks semánticos**: un único `main` a nivel de layout y regiones distinguibles para secciones de soporte (p. ej., paneles laterales).
- **Skip link**: acceso directo al contenido principal.
- **Gestión de foco en overlays**: modales y drawer con foco inicial, **focus trap**, cierre con **ESC** y retorno del foco al disparador.
- **Componentes con soporte de teclado** (p. ej., Tabs y DatePicker) y semántica/ARIA donde aplica.
- **Anuncios para lector de pantalla** en cambios relevantes (p. ej., actualizaciones en resúmenes/precio o feedback de formularios cuando corresponde).

### Rutas recomendadas para retest manual
- `/results`
- `/travelers`
- `/payment`

### Checklist de retest (rápido)
- Un único `main` top-level y regiones distinguibles.
- Skip link visible al foco y salto correcto al contenido.
- Modales/drawer: trap, ESC y retorno de foco.
- Tabs: flechas + Home/End.
- DatePicker: teclado y relación de título/diálogo.
- Errores de formulario anunciables y campos con `aria-invalid` / `aria-describedby`.

---

## Gobernanza mínima del Sistema de Diseño

### 10.1 Cómo modificar componentes (guía mínima)
**Cambiar vs crear**
- Cambia un componente si el comportamiento es el mismo y solo cambia la presentación.
- Crea uno nuevo si cambia el **contrato** (props, layout o responsabilidades).

**Contrato del componente**
- Props públicas claramente definidas en el archivo del componente.
- Variantes via `variant` y estados con `is-*`.
Fuente: [src/ui/README.md](src/ui/README.md)

**Reglas de estilos**
- Usa tokens siempre: [src/styles](src/styles).
- Evita valores mágicos; reutiliza variables.

**Compatibilidad**
- Cambios en props o nombre de variantes = breaking change.

**Checklist antes de PR**
- `npm run lint` ([package.json](package.json))
- `npm run build` ([package.json](package.json))
- Responsive según [src/styles/tokens.layout.css](src/styles/tokens.layout.css)
- A11y básica: teclado + labels

---

### 10.2 Propuesta y aprobación de cambios (workflow)

Existe plantilla de PR en [.github/pull_request_template.md](.github/pull_request_template.md). CODEOWNERS en [.github/CODEOWNERS](.github/CODEOWNERS) usa placeholders.

**Flujo mínimo recomendado (para preservar coherencia del sistema)**
**1) Propuesta**
- Abrir una Issue (o Discussion) con:
	- Problema a resolver (contexto)
	- Impacto (pantallas/componentes afectados)
	- Capturas / ejemplo
	- Criterios de aceptación (qué debe cumplir)
	- Clasificación: `token` / `component` / `pattern` / `a11y` / `bug`

**2) Diseño**
- Adjuntar referencia a Figma (o equivalente) y justificar:
	- ¿Se reutilizan tokens existentes?
	- ¿Hace falta crear token/variante nueva?
	- ¿Rompe compatibilidad?

**3) Implementación (Pull Request)**
- PR debe incluir:
	- Qué cambia y por qué (resumen)
	- Evidencia visual (capturas/gif)
	- Checklist (lint, build, a11y manual, responsive)
	- Docs actualizadas (README / docs UI / changelog)

**Roles mínimos de revisión**
- **FE reviewer**: consistencia técnica, performance, router/store.
- **DS/design reviewer**: coherencia con tokens, variantes, patrones UI.
- (Opcional) **a11y reviewer**: foco, teclado, labels, anuncios dinámicos.

**Criterios de aprobación (mínimos)**
- API del componente consistente (naming, variantes, defaults).
- Uso de tokens (sin valores mágicos).
- A11y manual básica en componentes tocados.
- Documentación actualizada (ver 10.3).

---

### 10.3 Versionado y documentación de cambios

No hay `CHANGELOG.md` ni tags/releases publicados.

**Estándar mínimo propuesto (SemVer)**
- **MAJOR**: cambios incompatibles (breaking)
- **MINOR**: nuevas capacidades compatibles
- **PATCH**: fixes compatibles

#### Qué consideramos BREAKING en este sistema
- Cambiar/eliminar props públicas o renombrarlas.
- Cambiar nombres de `variant`/`size` existentes.
- Cambiar estructura DOM que afecte a selectores o a11y (roles/labels) sin alternativa.
- Cambiar tokens (eliminar/renombrar) o su significado visual sin compatibilidad.

### Changelog (obligatorio)
- Mantener un `CHANGELOG.md` con secciones por versión:
	- Added / Changed / Fixed / Deprecated / Removed
- Cada entrada debe estar escrita “para consumidores” (qué deben hacer y por qué).

### Deprecaciones y migraciones
- Si algo se va a eliminar:
	- Marcarlo como **Deprecated** en changelog + docs.
	- Mantenerlo al menos 1 versión MINOR (ventana mínima).
	- Añadir guía de migración corta en `docs/migrations/`.

### Regla simple
> “Si el cambio afecta a cómo se usa un componente o token, debe reflejarse en el changelog y, si es breaking, incluir una guía de migración”.

---

## Calidad y mantenimiento
	Tests (configurados):
	  - Unit/integration: Vitest + React Testing Library
	    - Ejecutar: `npm run test` (CI) o `npm run test:watch` (local)
	  - E2E (flujos clave): Playwright
	    - Ejecutar: `npm run test:e2e`
	    - Primera vez: `npx playwright install`
	  - A11y smoke: axe en componentes críticos (Modal, Tabs, formularios)
	  - Cobertura inicial (por impacto):
	    1) Router + navegación del checkout
	    2) Store (`useReducer`) y persistencia
	    3) Componentes críticos: Modal, Tabs, InputText, StickySummaryBar
- Storybook: 
    - Añadir documentación por componente en Markdown/MDX en `src/ui/**/README.md`
    - Incluir:
        - propósito
        - props públicas
        - variantes
        - ejemplos
        - a11y / teclado
        - “Do/Don’t”

---

## Guías de contribución

### Añadir un componente nuevo (paso a paso)
1) Crear carpeta en atoms/molecules/organisms.
2) Nombre PascalCase y CSS con tokens.
3) Exportar en `index.js` correspondiente.
4) Usar en página existente y validar.

Fuentes: [src/ui/README.md](src/ui/README.md), [src/ui/atoms/index.js](src/ui/atoms/index.js), [src/ui/molecules/index.js](src/ui/molecules/index.js), [src/ui/organisms/index.js](src/ui/organisms/index.js)

### Añadir/editar tokens
- Colores: editar [src/tokens/colors.figmasync.json](src/tokens/colors.figmasync.json) y ejecutar `npm run tokens:colors`.
- Otros tokens: editar manualmente en [src/styles](src/styles). Automatización no implementada.

### Checklist de PR
- `npm run lint`
- `npm run build`
- Revisión de tokens usados
- A11y básica
- Responsive según [src/styles/tokens.layout.css](src/styles/tokens.layout.css)

---

## Epics de evolución del prototipo (nuevos recorridos + backend real)

### P1 — Web completa: todas las páginas + nuevos recorridos de usuarios
**Objetivo:** completar la experiencia end-to-end del producto (más allá del checkout actual), incorporando páginas faltantes y recorridos alternativos.

**Alcance (a definir en issues)**
- Páginas nuevas (ejemplos):
	- [ ] Perfil / cuenta
	- [ ] Gestión de reservas
	- [ ] Confirmación / detalle de compra
	- [ ] Historial de compras
	- [ ] Ayuda / incidencias
	- [ ] Estados vacíos / errores globales
- Recorridos nuevos (ejemplos):
	- [ ] Pago completado/ pago fallido
	- [ ] Compra con descuentos / promo
	- [ ] Compra para múltiples pasajeros con reglas específicas

**DoD**
- [ ] Rutas añadidas en `src/app/router.jsx` y navegación consistente.
- [ ] Cada recorrido tiene “happy path” documentado en README (o `docs/journeys.md`).
- [ ] Mock data actualizado para cubrir casos nuevos (hasta que exista backend).
- [ ] A11y manual mínima validada por recorrido (teclado/foco/labels).
- [ ] E2E Playwright por recorrido principal.

---

### P0/P1 — Backend real + integración end-to-end
**Objetivo:** sustituir mock data por servicios reales y garantizar consistencia de datos, errores y estados de carga.

**Decisiones mínimas (antes de implementar)**
- [ ] Arquitectura backend (API REST/GraphQL, auth, persistencia, entorno).
- [ ] Contrato de API (OpenAPI/Swagger o equivalente) y versionado.
- [ ] Gestión de secretos y configuración (Vercel env vars + `.env.example`).
- [ ] Estrategia de entornos: dev/staging/prod.

**Alcance técnico**
- [ ] Capa de servicios en frontend (p. ej. `src/services/` o `src/api/`) con:
	- cliente HTTP
	- manejo de errores normalizado
	- reintentos / cancelación
	- estados de loading
- [ ] Sustitución progresiva de `src/data/mockData.js` por llamadas reales.
- [ ] Autenticación: login/register con sesión real.
- [ ] Observabilidad mínima: logs/errores (Sentry o equivalente), trazas básicas.

**DoD**
- [ ] Endpoints reales funcionando para los flujos clave (search/results/fares/travelers/extras/payment).
- [ ] Manejo consistente de errores (UI + mensajes + fallback).
- [ ] Tests:
	- [ ] Unit/integration para services (mock de API)
	- [ ] E2E Playwright contra staging
- [ ] Documentación:
	- [ ] `docs/api.md` (o link a OpenAPI)
	- [ ] `docs/environments.md` (env vars, staging/prod)
	- [ ] Actualización README (Deployments/Entornos + qué es “Prod”)

---

## Backlog / TODOs (priorizado)

### P0 — Calidad y coherencia del prototipo (demo/TFM)
- [ ] **Añadir `CHANGELOG.md`** (SemVer) y convención mínima de releases.
- [ ] **Añadir `LICENSE`** (si procede).
- [ ] **Router: añadir 404/NotFound** (manejo de rutas no definidas).
- [ ] **Navegación global**: resolver enlaces a rutas no definidas (TopNav/Drawer/Footer):
	- (A) páginas placeholder “En construcción”, o
	- (B) deshabilitar/enlazar externamente según corresponda.
- [ ] **Pago: estado de éxito** (pantalla o confirmación final) para cerrar el flujo end-to-end.
- [ ] **i18n**: eliminar hardcodes detectables en componentes base (placeholders/default labels) y asegurar paridad ES/EN.
- [ ] **Consistencia de exports/clasificación**: asegurar que la capa (átomo/molécula/organismo) coincide con la exportación pública.

### P1 — Automatización y mantenibilidad
- [ ] **CODEOWNERS**: sustituir placeholders por responsables reales y reglas de aprobación.
- [ ] **Docs por componente**: ficha mínima por componente crítico (props, variantes, teclado/a11y, do/don’t).
- [ ] **Tokens pipeline**: ampliar/estandarizar export de tokens (más allá de colores).

### P2 — Evolución funcional (si se conecta a producto)
- [ ] Sustitución progresiva de mocks por backend real (contratos API + entornos).
- [ ] Autenticación real (login/register con sesión).
- [ ] Gestión global de errores (ErrorBoundary, fallbacks, reintentos normalizados).
- [ ] Observabilidad (captura de errores + logging) si se integra backend.

---

## Documentación y estado del repo

Nota: Este repositorio prioriza el prototipo funcional y la trazabilidad con el sistema de diseño.

Planificado:
- Automatización adicional de tokens y documentación por componente.

---

## Licencia / contacto
No hay licencia en el repositorio.

---

