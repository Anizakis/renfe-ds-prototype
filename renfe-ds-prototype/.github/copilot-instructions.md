# Copilot instructions for renfe-ds-prototype (Option B + Screen Reader ready)

## Non-negotiables (hard rules)
- **NO TypeScript**: do not create or modify `.ts/.tsx` files, do not add TS types, do not introduce `tsconfig` or TS tooling.
- **JavaScript only**: use `.js/.jsx`. If you need “type hints”, use minimal **JSDoc** (optional).
- **Do not change business logic**: keep routing, store behavior, actions, reducer logic, side effects, flows, and API contracts unchanged unless explicitly requested.
- **Small, incremental diffs**: prefer changes in small batches (1–6 files) to reduce risk.
- **No new UI/styling frameworks** (no Tailwind/styled-components/etc). Follow the existing CSS approach.

## Big-picture architecture
- React + Vite SPA with React Router.
- Routes: `src/app/router.jsx`. Layout: `src/app/AppLayout.jsx`. Pages: `src/pages/*`.
- Bootstrap: `src/main.jsx` mounts providers and imports global styles/tokens.
- Global state: `src/app/store.jsx` (`TravelProvider` + `useTravel`), persisted to localStorage (`renfe-ds-state`).
- i18n: `src/app/i18n.jsx`. UI copy must use `t("section.key")`. Language persisted to localStorage (`renfe-ds-lang`).
- Theme: `src/app/theme.jsx` applies `.dark` to the document root. Style via tokens/CSS variables only.

## Refactor goal (Atomic Design, Option B)
We are refactoring UI into:
- `src/ui/atoms`
- `src/ui/molecules`
- `src/ui/organisms`
- `src/templates`
- `src/pages` (composition + page orchestration only)

**Atomic meanings**
- **Atoms**: primitives (Button, Link, InputText, Checkbox, Icon, Spinner, VisuallyHidden).
- **Molecules**: small compositions (Field, ResultsSummary, ResultsToolbar, PriceBreakdown, EmptyState).
- **Organisms**: page sections (ResultsFilters, JourneyList, StickySummaryBar, FareComparison, PaymentForm, PaymentSummary).
- **Templates**: layout scaffolds (ResultsTemplate, FaresTemplate, PaymentTemplate, ExtrasTemplate).
- **Pages**: glue only (hook/store/router + template composition). Avoid page-specific UI duplication.

**Critical**: Keep current classNames and DOM structure whenever possible to prevent regressions.

## Co-location + exports
- Each component folder should contain:
  - `Component.jsx`
  - `Component.css`
  - optional `index.js` (re-export)
- Use `index.js` barrel exports at each atomic level:
  - `src/ui/atoms/index.js`, `src/ui/molecules/index.js`, etc.
- Migrate incrementally. Avoid giant moves.

## Styling and tokens (source of truth)
- Tokens live in `src/styles/tokens.*.css` and are imported in `src/main.jsx`.
- Avoid hardcoding colors/spacing/radius/shadows/breakpoints/typography. Use `var(--token)`.
- Dark mode is via `.dark` class with token overrides.
- `src/pages/pages.css` must shrink over time:
  - Move feature rules into owning component/template CSS.
  - Preserve selector specificity and rule order if cascade matters.
  - Keep media queries with the component that owns the responsive layout.
  - Leave only truly page-level glue in `pages.css` (as little as possible).

## Data flow patterns (do not break)
- Use `useTravel()` and dispatch action types defined in `src/app/store.jsx`.
- Do not change persistence keys (`renfe-ds-state`, `renfe-ds-lang`).
- Avoid adding new actions unless explicitly required.

## i18n rules (do not regress)
- No hardcoded UI copy. Always use `t("...")`.
- When adding strings: add keys for **ES and EN** in `src/app/i18n.jsx`.
- Layout must survive long strings (wrap/reflow). Do not truncate critical info.

## Accessibility: Screen Reader & Keyboard (required)
The prototype must be usable with screen readers (NVDA/JAWS/VoiceOver) and keyboard only.

### Landmarks & structure
- Ensure each page has a single `<main id="main">` region.
- Use semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`.
- Provide meaningful headings hierarchy (`h1` once per page; logical `h2/h3`).
- Keep the skip link in `AppLayout` and ensure it targets `#main`.

### Focus management (must not regress)
- On route change: focus main content (existing behavior in `AppLayout`).
- On dialogs/modals: trap focus, restore focus to opener on close.
- For drawers/filters panels: focus moves into the panel when opened; ESC closes; focus returns to opener.
- Do not remove `:focus-visible` styles; ensure focus is clearly visible.

### Forms (screen reader correctness)
- Inputs must have a programmatic name:
  - Use `<label for>` + matching `id`, or `aria-label`, or `aria-labelledby`.
- When showing hint/error text:
  - Keep it visible.
  - Wire it with `aria-describedby` on the input.
  - Set `aria-invalid="true"` when invalid.
- Error messages that appear after submit should be announced:
  - Use a live region (`role="status"` or `aria-live="polite"`), and/or focus a summary at the top.
- Do not rely on color alone for validation or selection.

### Lists, results and selection
- Results lists should use semantic lists (`<ul><li>`) when appropriate.
- Selection states must be exposed:
  - Use native controls where possible (radio/checkbox/button).
  - If using custom UI, ensure `aria-pressed`, `aria-selected`, or `role="radio"` + `aria-checked` as appropriate.
- “Sticky summary” updates (price changes) must be announced:
  - Provide an `aria-live="polite"` region for total updates or a status message when totals change.

### Buttons, links, icons
- Interactive elements must be real `<button>` / `<a>` (not divs).
- Icon-only buttons must have accessible names (`aria-label`).
- Decorative icons must be `aria-hidden="true"`.

### Tables (Fare comparison)
- If fares are a comparison table, prefer semantic `<table>`:
  - Use `<th scope="col">` and/or `<th scope="row">` as needed.
  - If using div-grid, ensure screen reader navigation still makes sense and selection is announced.

### Responsive & zoom
- Must work at 200% zoom without loss of content or functionality.
- Ensure text wraps and controls remain usable.

## Feature-specific refactor priorities
- Results: extract header/toolbar/summary/filters/list/empty-state and move `.results-*` out of `pages.css`.
- Sticky summary: move `.sticky-summary__*` to dedicated organism CSS; announce total updates.
- Fares: move `.fare-card*` to `FareComparison`; ensure selection is announced.
- Payment: move `.payment-*` to `PaymentTemplate`/layout; preserve form accessibility.
- Extras: move wrapper CSS to an organism/section; toggles must be accessible controls.

## Developer workflows
- `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`
- Token sync: `npm run tokens:colors` → updates `src/styles/tokens.colors.css`
- After UI structural changes: manual smoke test Home → Results → Fares → Travelers → Extras → Payment, including keyboard-only.

## Copilot Chat output format (required)
When implementing a change:
1) Short plan (max 8 bullets).
2) Patches per file labeled:
   - `FILE: path/to/file.jsx`
   - `FILE: path/to/file.css`
3) Regression checklist (what to click / what to tab through / what SR should announce).
4) Stop. Do not expand scope.

- When moving components from src/components to src/ui/*:
  - Update all imports to the new location.
  - **Do NOT create re-export/compatibility wrapper files** in the old location.
  - Delete the old folder once references are updated.

- Do NOT output or run shell/PowerShell commands (Remove-Item, rm, Set-Location, etc.).
  - If verification is requested, only **suggest** the commands I should run manually.
- When fixing no-unused-vars in pages:
  - Do NOT remove formatting helpers (e.g., formatPrice, formatDate) if they are referenced in JSX or may be re-used after refactors.
  - Prefer removing only obviously dead destructured variables or parameters.
