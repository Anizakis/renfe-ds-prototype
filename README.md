# Renfe DS — Prototipo React (Sistema de Diseño + Flujo de compra)

**Demo (Vercel):** https://renfe-ds-prototype.vercel.app/  
**Estado del entorno:** Demo / Preview (no producción)

Prototipo web funcional que implementa un **sistema de diseño basado en tokens CSS** y componentes React organizados por atomic design.  
Sirve para **explorar el flujo de compra** y validar UI/UX de componentes.

- ✅ Implementa tokens CSS + componentes React
- ✅ Flujo de compra navegable end-to-end (con datos mock)
- ❌ No es un producto en producción
- ❌ No hay backend real ni persistencia remota (solo `localStorage`)

**Figma (referencia de diseño):**  
https://www.figma.com/design/w35IU8NIuPwoyJKtOEwSbl/Sistema-de-dise%C3%B1o-Renfe?node-id=210-4&t=zKfrskWBUzr9pMB7-1

---

## TL;DR (comandos esenciales)

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
npm run tokens:colors
npm run test
npm run test:e2e
```

---

## Tabla de contenidos

1. [Deployments / Entornos](#deployments--entornos)
2. [Stack & dependencias clave](#stack--dependencias-clave)
3. [Setup local](#setup-local)
4. [Arquitectura del proyecto](#arquitectura-del-proyecto)
5. [Lógica de negocio](#lógica-de-negocio)
6. [Sistema de diseño](#sistema-de-diseño)
7. [Flujos del prototipo](#flujos-del-prototipo)
8. [Accesibilidad (a11y)](#accesibilidad-a11y)
9. [Calidad y mantenimiento](#calidad-y-mantenimiento)
10. [Guías de contribución](#guías-de-contribución)
11. [Roadmap / Backlog](#roadmap--backlog)
12. [Documentación y estado del repo](#documentación-y-estado-del-repo)
13. [Licencia / contacto](#licencia--contacto)

---

## Deployments / Entornos

> Que esté desplegado en Vercel **no implica** “producción”. En este repo se considera **Demo/Preview** salvo que se declare explícitamente lo contrario.

| Entorno | URL | Uso | Datos |
|---|---|---|---|
| Demo (Vercel) | https://renfe-ds-prototype.vercel.app/ | Validación UI/UX del flujo y componentes | Mock ([renfe-ds-prototype/src/data/mockData.js](renfe-ds-prototype/src/data/mockData.js)) |
| Preview (PRs) | auto-generado por Vercel | Revisión de cambios por PR | Mock |

### Convención de etiquetado (para evitar confusiones)
- **Preview:** deployments por Pull Request / branch.
- **Demo:** entorno estable para demos internas y revisiones.
- **Staging:** no definido en el repo.
- **Prod:** no definido en el repo.

### SPA routing en Vercel (React Router)
Configuración en [vercel.json](renfe-ds-prototype/vercel.json) para reescrituras a `index.html` (rutas client-side):

```json
{
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```

### Checklist mínimo antes de considerar “Prod”
- [ ] CI pasando (`lint` + `build`) en PRs (existe: [renfe-ds-prototype/.github/workflows/ci.yml](renfe-ds-prototype/.github/workflows/ci.yml))
- [ ] Versionado + `CHANGELOG.md`
- [ ] Política de approvals (CODEOWNERS con handles reales + revisores)
- [ ] Validación a11y mínima por PR (manual o automatizada)
- [ ] Observabilidad mínima (logs/errores) y responsabilidades definidas

---

## Stack & dependencias clave

**Stack (real):** React 19 + Vite 7 + React Router 6 + **CSS nativo** (`@layer utilities`) + **tokens CSS**.

| Tecnología | Para qué se usa | Dónde vive |
|---|---|---|
| React | UI y componentes | [renfe-ds-prototype/package.json](renfe-ds-prototype/package.json) |
| Vite | Dev server/build | [renfe-ds-prototype/package.json](renfe-ds-prototype/package.json), [renfe-ds-prototype/vite.config.js](renfe-ds-prototype/vite.config.js) |
| React Router | Rutas del prototipo | [renfe-ds-prototype/src/app/router.jsx](renfe-ds-prototype/src/app/router.jsx) |
| CSS nativo (`@layer utilities`) | Utilities base | [renfe-ds-prototype/src/index.css](renfe-ds-prototype/src/index.css) |
| Tokens CSS | Fuente de verdad visual | [renfe-ds-prototype/src/styles](renfe-ds-prototype/src/styles), cargados en [renfe-ds-prototype/src/main.jsx](renfe-ds-prototype/src/main.jsx) |
| i18n propio | ES/EN en runtime | [renfe-ds-prototype/src/app/i18n.jsx](renfe-ds-prototype/src/app/i18n.jsx) |
| Store propio | Estado + persistencia | [renfe-ds-prototype/src/app/store.jsx](renfe-ds-prototype/src/app/store.jsx) |
| Theme (dark) | Clase `.dark` | [renfe-ds-prototype/src/app/theme.jsx](renfe-ds-prototype/src/app/theme.jsx), [renfe-ds-prototype/index.html](renfe-ds-prototype/index.html) |
| Material Symbols | Iconografía | [renfe-ds-prototype/index.html](renfe-ds-prototype/index.html), [renfe-ds-prototype/src/ui/atoms/Icon/Icon.jsx](renfe-ds-prototype/src/ui/atoms/Icon/Icon.jsx) |
| ESLint | Lint de JS/JSX | [renfe-ds-prototype/eslint.config.js](renfe-ds-prototype/eslint.config.js) |
| Vitest + RTL | Unit/integration | `renfe-ds-prototype/vite.config.js`, `renfe-ds-prototype/src/test/*` |
| Playwright | E2E de flujos | [renfe-ds-prototype/playwright.config.js](renfe-ds-prototype/playwright.config.js), `renfe-ds-prototype/tests/e2e/*` |

---

## Setup local

### Requisitos
- Node.js 20+ (ver [renfe-ds-prototype/.nvmrc](renfe-ds-prototype/.nvmrc) y `engines` en [renfe-ds-prototype/package.json](renfe-ds-prototype/package.json)).

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
Script: [renfe-ds-prototype/src/scripts/figma-colors-to-css.mjs](renfe-ds-prototype/src/scripts/figma-colors-to-css.mjs)

### Variables de entorno
- Archivo de ejemplo: [renfe-ds-prototype/.env.example](renfe-ds-prototype/.env.example)
- No hay variables de entorno configuradas actualmente.
- Si fueran necesarias, se pueden añadir con prefijo `VITE_` en un archivo `.env` local.

### Troubleshooting
- Si no cargan iconos, revisa Material Symbols en [renfe-ds-prototype/index.html](renfe-ds-prototype/index.html).
- Si el tema no cambia, verifica `.dark` en `<html>` y [renfe-ds-prototype/src/app/theme.jsx](renfe-ds-prototype/src/app/theme.jsx).

---

## Arquitectura del proyecto

### Árbol `/src` (explicado)
```txt
renfe-ds-prototype/src/
  app/        # Router, store, i18n, utils, theme, lógica de dominio
  data/       # Mock data (viajes, tarifas, extras, estaciones)
  pages/      # Pantallas del flujo
  styles/     # Tokens (colors, spacing, type, radius, effects, layout, icons)
  ui/         # Sistema de diseño (atoms/molecules/organisms/templates) + CSS por componente
  test/       # Setup global de testing
  index.css   # @layer utilities + tipografía global
  main.jsx    # bootstrap providers + tokens
```

### Capas principales
- **Routes/Pages:** [renfe-ds-prototype/src/pages](renfe-ds-prototype/src/pages)
- **Layout/App:** [renfe-ds-prototype/src/app/AppLayout.jsx](renfe-ds-prototype/src/app/AppLayout.jsx)
- **State + persistencia:** [renfe-ds-prototype/src/app/store.jsx](renfe-ds-prototype/src/app/store.jsx)
- **i18n:** [renfe-ds-prototype/src/app/i18n.jsx](renfe-ds-prototype/src/app/i18n.jsx)
- **Theme:** [renfe-ds-prototype/src/app/theme.jsx](renfe-ds-prototype/src/app/theme.jsx)
- **UI System:** [renfe-ds-prototype/src/ui](renfe-ds-prototype/src/ui)
- **Tokens:** [renfe-ds-prototype/src/styles](renfe-ds-prototype/src/styles)

### Enrutado del flujo (React Router)
- **Definición de rutas:** [renfe-ds-prototype/src/app/router.jsx](renfe-ds-prototype/src/app/router.jsx) (`createBrowserRouter`)
- **Montaje del router:** `RouterProvider` en [renfe-ds-prototype/src/App.jsx](renfe-ds-prototype/src/App.jsx) y bootstrap en [renfe-ds-prototype/src/main.jsx](renfe-ds-prototype/src/main.jsx)

Rutas principales del checkout (ver sección “Flujos del prototipo”).

### Estado global (Context + `useReducer`) + persistencia
- **Core del store:** [renfe-ds-prototype/src/app/store.jsx](renfe-ds-prototype/src/app/store.jsx)
- **Provider montado en:** [renfe-ds-prototype/src/main.jsx](renfe-ds-prototype/src/main.jsx)
- Persistencia automática en `localStorage` (key: `renfe-ds-state`)

#### Acciones del Store (reducer)
| Acción | Payload | Descripción |
|--------|---------|-------------|
| `SET_SEARCH` | `{ origin, destination, departDate, returnDate, passengers, tripType }` | Actualiza criterios de búsqueda |
| `SET_AUTH` | `{ isAuthenticated, profile }` | Estado de autenticación |
| `SET_PROFILE` | `profileObject` | Perfil de usuario |
| `SET_JOURNEY` | `journeyObject` o `journeyId` | Selecciona viaje de ida |
| `SET_RETURN_JOURNEY` | `journeyObject` o `journeyId` | Selecciona viaje de vuelta |
| `SET_FARE` | `fareId` | Selecciona tarifa |
| `TOGGLE_EXTRA` | `extraId` | Activa/desactiva un extra |
| `CLEAR_EXTRAS` | — | Limpia extras seleccionados |
| `SET_TRAVELER` | `{ index, fields, type }` | Actualiza datos de un pasajero |
| `SET_PAYMENT_ERROR` | `errorMessage` | Establece error de pago |
| `CLEAR_PAYMENT_ERROR` | — | Limpia error de pago |

Uso típico:
```jsx
const { state, dispatch } = useTravel();

dispatch({
  type: "SET_JOURNEY",
  payload: selectedJourney
});
```

### i18n (provider + persistencia de idioma)
- Provider y diccionario: [renfe-ds-prototype/src/app/i18n.jsx](renfe-ds-prototype/src/app/i18n.jsx)
- Persistencia en `localStorage` (key: `renfe-ds-lang`)
- Traducción por claves semánticas con interpolación (`t(key, vars)`), evitando hardcodes.

### Tema claro/oscuro
- Provider y lógica: [renfe-ds-prototype/src/app/theme.jsx](renfe-ds-prototype/src/app/theme.jsx)
- Activación por clase `.dark` en `<html>` y persistencia en `localStorage`.

---

## Lógica de negocio

### Pricing (single source of truth)
[renfe-ds-prototype/src/app/pricing.js](renfe-ds-prototype/src/app/pricing.js) centraliza el cálculo de precio total del flujo.

Funciones principales:
- `getTotalPrice(state)`
- `getSelectedJourney(state)`
- `getSelectedReturnJourney(state)`
- `getSelectedFare(state)`
- `getSelectedExtras(state)`
- `getPassengersTotal(state)`

Retorno típico:
```js
{
  base: 50.00,   // Precio del viaje(s)
  fare: 15.00,   // Coste de la tarifa seleccionada
  extras: 10.00, // Suma de extras
  total: 225.00  // (base + fare + extras) * pasajeros
}
```

Tests: [renfe-ds-prototype/src/app/pricing.test.js](renfe-ds-prototype/src/app/pricing.test.js)

### Breakdown (desglose de precios)
[renfe-ds-prototype/src/app/breakdown.js](renfe-ds-prototype/src/app/breakdown.js) genera ítems de desglose para `PriceBreakdown` y `StickySummaryBar`.

- `getBreakdownItems({ t, baseTotal, farePrice, extrasTotal, passengersTotal })`

### Utilidades comunes
[renfe-ds-prototype/src/app/utils.js](renfe-ds-prototype/src/app/utils.js)
- `formatPrice(value, { locale, currency })` usando `Intl.NumberFormat` con fallback.

### Gestión de estaciones
[renfe-ds-prototype/src/app/stations.js](renfe-ds-prototype/src/app/stations.js)
- `normalizeStationName(value)`
- `isValidStation(value, stations)`
- `getStationSuggestions(query, stations, limit)` (máx. 8)

Datos de estaciones:
- [renfe-ds-prototype/src/data/stations.es.json](renfe-ds-prototype/src/data/stations.es.json)
- [renfe-ds-prototype/estaciones.csv](renfe-ds-prototype/estaciones.csv) (catálogo ampliado)

---

## Sistema de diseño

### Principios y alcance
- Sistema basado en **tokens CSS** + componentes React.
- Reutilizable para páginas del flujo de compra.
- Sin backend ni persistencia remota.

### Tokens (CSS variables)
Ubicación:
- Colores: [renfe-ds-prototype/src/styles/tokens.colors.css](renfe-ds-prototype/src/styles/tokens.colors.css)
- Tipografía: [renfe-ds-prototype/src/styles/tokens.type.css](renfe-ds-prototype/src/styles/tokens.type.css)
- Spacing: [renfe-ds-prototype/src/styles/tokens.spacing.css](renfe-ds-prototype/src/styles/tokens.spacing.css)
- Radius: [renfe-ds-prototype/src/styles/tokens.radius.css](renfe-ds-prototype/src/styles/tokens.radius.css)
- Effects/Focus/Blur: [renfe-ds-prototype/src/styles/tokens.effects.css](renfe-ds-prototype/src/styles/tokens.effects.css)
- Layout/Grid: [renfe-ds-prototype/src/styles/tokens.layout.css](renfe-ds-prototype/src/styles/tokens.layout.css)
- Iconos: [renfe-ds-prototype/src/styles/tokens.icons.css](renfe-ds-prototype/src/styles/tokens.icons.css)

Reglas:
- Evitar hardcode; usar tokens siempre.
- Colores regenerables desde Figma: `npm run tokens:colors`.
- Spacing/type/radius/effects/layout se mantienen manualmente en `renfe-ds-prototype/src/styles`.

Ejemplo:
```css
.btn {
  border-radius: var(--radius-03);
  font-family: var(--font-family-primary);
  transition: background-color 150ms ease;
}
.btn--primary { background: var(--color-brand-600); }
```

### Layout responsive por tokens (breakpoints + rejilla)
- Variables y media queries: [renfe-ds-prototype/src/styles/tokens.layout.css](renfe-ds-prototype/src/styles/tokens.layout.css)
- Componentes que aplican el layout:
  - [renfe-ds-prototype/src/ui/atoms/Container/Container.jsx](renfe-ds-prototype/src/ui/atoms/Container/Container.jsx)
  - [renfe-ds-prototype/src/ui/atoms/Grid/Grid.jsx](renfe-ds-prototype/src/ui/atoms/Grid/Grid.jsx)

### Componentes (atomic design)
Estructura: [renfe-ds-prototype/src/ui](renfe-ds-prototype/src/ui) (ver convención en [renfe-ds-prototype/src/ui/README.md](renfe-ds-prototype/src/ui/README.md))

- **Atoms:** Button, InputText, Checkbox, Container, Grid, Link, Switch, VisuallyHidden, etc.
- **Molecules:** DatePicker, Modal, Tabs, PassengerSelector, etc.
- **Organisms:** AnimatedCheckoutStepper, HomeSearch, ResultsFilters, StickySummaryBar, PriceBreakdown, TravelerForm, etc.

> Nota de coherencia (recomendación): mantener carpeta y export público alineados. Si algún componente (p. ej. `Tabs`) está en `molecules`, lo ideal es exportarlo desde `molecules/index.js` salvo que exista una regla explícita documentada.

---

## Flujos del prototipo

### Pantallas (router)
Definidas en [renfe-ds-prototype/src/app/router.jsx](renfe-ds-prototype/src/app/router.jsx):
- `/` — Home (buscador)
- `/login` — Login
- `/register` — Registro
- `/results` — Selección de trenes y filtros
- `/fares` — Comparativa de tarifas
- `/travelers` — Datos de pasajeros
- `/extras` — Extras seleccionables
- `/payment` — Pago + resumen

### User journey principal
Buscar → Resultados → Tarifas → Viajeros → Extras → Pago

### Stepper del checkout (volver a pasos completados)
- Componente: [renfe-ds-prototype/src/ui/organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx](renfe-ds-prototype/src/ui/organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx)
- Definición central de pasos: [renfe-ds-prototype/src/ui/organisms/AnimatedCheckoutStepper/checkoutSteps.js](renfe-ds-prototype/src/ui/organisms/AnimatedCheckoutStepper/checkoutSteps.js)

### Datos mock / fixtures

#### Generador de viajes
[renfe-ds-prototype/src/data/mockData.js](renfe-ds-prototype/src/data/mockData.js) genera viajes de forma determinista usando PRNG seeded.

Incluye:
- Tipos de tren simulados (AVE, AVLO, ALVIA, MD, AVANT)
- Funciones:
  - `generateJourneys({ startDate, days, origin, destination })`
  - `buildDayRange(startDate, days)`
- Catálogos estáticos:
  - `fares` (Basic, Promo, Premium, Flexible)
  - `extras` (asiento, equipaje, comida, etc.)
- Determinismo: mismo seed → mismos resultados (útil para debugging y tests)

---

## Accesibilidad (a11y)

El prototipo se ha preparado para ser operable por teclado y compatible con tecnología asistiva mediante:

- **Landmarks semánticos**: `main` único a nivel de layout.
- **Skip link** + foco al contenido tras cambio de ruta: [renfe-ds-prototype/src/app/AppLayout.jsx](renfe-ds-prototype/src/app/AppLayout.jsx)
- **Overlays accesibles** (Modal/Drawer): trap de foco, ESC, retorno de foco al trigger.
  - Modal: [renfe-ds-prototype/src/ui/molecules/Modal/Modal.jsx](renfe-ds-prototype/src/ui/molecules/Modal/Modal.jsx)
  - Hook focus-trap: [renfe-ds-prototype/src/ui/molecules/Modal/useFocusTrap.js](renfe-ds-prototype/src/ui/molecules/Modal/useFocusTrap.js)
  - Drawer filtros: [renfe-ds-prototype/src/ui/organisms/ResultsFiltersDrawer/ResultsFiltersDrawer.jsx](renfe-ds-prototype/src/ui/organisms/ResultsFiltersDrawer/ResultsFiltersDrawer.jsx)
- **Componentes con teclado** (Tabs/DatePicker) y semántica ARIA donde aplica.
- **Anuncios SR (`aria-live`)** para cambios relevantes (p. ej., total actualizado):
  - PriceBreakdown / StickySummaryBar (ver organismos correspondientes).

### Rutas recomendadas para retest manual
- `/results`
- `/travelers`
- `/payment`

### Checklist rápido
- Skip link visible al foco y salto correcto a `#main`.
- Overlays: trap, ESC y retorno de foco.
- Tabs: flechas + Home/End.
- DatePicker: teclado + foco al abrir panel.
- Formularios: errores anunciables (`aria-invalid`, `aria-describedby`).
- Cambios de total: `aria-live="polite"` + `aria-atomic` cuando aplica.

---

## Calidad y mantenimiento

### Testing

#### Vitest (unit/integration)
Configuración en [renfe-ds-prototype/vite.config.js](renfe-ds-prototype/vite.config.js), entorno `jsdom` y setup global:
- Setup: [renfe-ds-prototype/src/test/setupTests.js](renfe-ds-prototype/src/test/setupTests.js) (incluye `@testing-library/jest-dom`)

Ejecutar:
```bash
npm run test
npm run test:watch
```

Ejemplo recomendado para capturas:
- Test de lógica crítica: [renfe-ds-prototype/src/app/pricing.test.js](renfe-ds-prototype/src/app/pricing.test.js)

#### Playwright (E2E)
Configuración: [renfe-ds-prototype/playwright.config.js](renfe-ds-prototype/playwright.config.js)  
Tests: [renfe-ds-prototype/tests/e2e](renfe-ds-prototype/tests/e2e)

Ejecutar:
```bash
npx playwright install
npm run test:e2e
```

#### A11y smoke (manual + base automatizable)
- Manual: rutas `/results`, `/travelers`, `/payment`
- Base para automatizar: axe-core en componentes críticos (Modal/Tabs/Formularios)

### CI (mínima)
Workflow: [renfe-ds-prototype/.github/workflows/ci.yml](renfe-ds-prototype/.github/workflows/ci.yml)

Ejecuta (mínimo):
- `npm ci`
- `npm run lint`
- `npm run build`

Mejoras típicas (pendientes si aplica):
- Añadir `npm run test`
- Añadir `npm run test:e2e` en entorno preparado
- Añadir checks automáticos de a11y (smoke)

### Linting
ESLint en [renfe-ds-prototype/eslint.config.js](renfe-ds-prototype/eslint.config.js)

```bash
npm run lint
```

### Storybook (planificado)
- Documentación por componente (MD/MDX en `renfe-ds-prototype/src/ui/**/README.md`)
- Incluir: propósito, props, variantes, ejemplos, a11y/teclado, do/don’t

---

## Guías de contribución

### Añadir un componente nuevo (paso a paso)
1. Crear carpeta en `renfe-ds-prototype/src/ui/atoms|molecules|organisms`.
2. Nombre en PascalCase.
3. CSS usando tokens (sin valores mágicos).
4. Exportar en el `index.js` correspondiente.
5. Usar en una página existente y validar responsive + a11y básica.

Referencia: [renfe-ds-prototype/src/ui/README.md](renfe-ds-prototype/src/ui/README.md)

### Añadir/editar tokens
- Colores: editar [renfe-ds-prototype/src/tokens/colors.figmasync.json](renfe-ds-prototype/src/tokens/colors.figmasync.json) y ejecutar `npm run tokens:colors`.
- Otros tokens: editar manualmente en [renfe-ds-prototype/src/styles](renfe-ds-prototype/src/styles).

### Checklist de PR
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] (Recomendado) `npm run test`
- [ ] Tokens usados (sin hardcodes)
- [ ] A11y básica (teclado/labels/overlays si se tocaron)
- [ ] Responsive según tokens de layout

### CODEOWNERS / approvals
- Archivo: [renfe-ds-prototype/.github/CODEOWNERS](renfe-ds-prototype/.github/CODEOWNERS)
- Recomendación: sustituir placeholders por responsables reales.

### Versionado y changelog (pendiente)
- No existe `CHANGELOG.md` actualmente.
- Propuesta mínima: SemVer (MAJOR/MINOR/PATCH)
- Si un cambio afecta a cómo se usa un componente o token → debe reflejarse en changelog y, si es breaking, incluir migración.

---

## Roadmap / Backlog

### P0 — Calidad y coherencia (demo/TFM)
- [ ] Añadir `CHANGELOG.md` (SemVer) y convención mínima de releases
- [ ] Añadir `LICENSE` (si procede)
- [ ] Router: 404/NotFound
- [ ] Navegación global: resolver enlaces a rutas no definidas (placeholders o deshabilitar)
- [ ] Pago: estado de éxito (pantalla de confirmación) para cerrar end-to-end
- [ ] i18n: eliminar hardcodes residuales y asegurar paridad ES/EN
- [ ] Consistencia de exports/clasificación en `renfe-ds-prototype/src/ui`

### P1 — Automatización y mantenibilidad
- [ ] CODEOWNERS reales + reglas de aprobación
- [ ] Docs por componente (ficha mínima en críticos)
- [ ] Pipeline de tokens (más allá de colores)

### P2 — Evolución funcional (si se conecta a producto)
- [ ] Sustitución progresiva de mocks por backend real
- [ ] Autenticación real
- [ ] Manejo global de errores (ErrorBoundary, fallbacks)
- [ ] Observabilidad (errores/logging)

---

## Documentación y estado del repo

Este repositorio prioriza:
- prototipo funcional
- trazabilidad con el sistema de diseño (tokens)
- verificación mínima (lint/build/tests donde aplique)

Planificado:
- automatización adicional de tokens
- documentación por componente (y/o Storybook)

---

## Licencia / contacto

- No hay licencia en el repositorio actualmente.
- Contacto: (añadir responsables/owners del repo o canal interno)
