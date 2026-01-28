# Renfe DS – Prototipo React

Prototipo funcional (desktop-first) construido con React + Vite y **tokens CSS** como fuente de verdad. Incluye rutas para el flujo principal de compra y componentes accesibles.

## Requisitos
- Node.js 18+

## Instalación
```bash
npm install
```

## Ejecutar en desarrollo
```bash
npm run dev
```

## Estructura clave
- Tokens: `src/styles/tokens.*.css`
- Componentes base: `src/components/Button`, `src/components/InputText`
- Router: `src/app/router.tsx`
- i18n: `src/app/i18n.jsx`
- Store: `src/app/store.jsx`

## Rutas del prototipo
- `/` Home (buscador)
- `/login`
- `/results` (resultados + tabs 7 días)
- `/fares` (comparativa de tarifas)
- `/extras` (extras)
- `/payment` (form + resumen + error recuperable)

## Accesibilidad – Cómo probar
### Teclado
1) Tab / Shift+Tab: recorre links, botones, inputs.
2) Tabs en resultados: usar **ArrowLeft/ArrowRight**, **Home/End**.
3) Foco visible: se muestra con `var(--effect-focus-*)`.

### Lector de pantalla (NVDA/VoiceOver)
- Inputs: el lector debe anunciar **label** y estado de error si aplica.
- Alertas de pago: deben anunciarse automáticamente (`role="alert"`).
- Cambios de precio: se anuncian con `aria-live="polite"` en el resumen.
- Loading: `aria-busy` y texto oculto accesible.

### Cambio de idioma
- Usa el selector en la top bar. Toda la UI cambia a ES/EN sin mezcla.

### Error recuperable en pago
1) Ir a `/payment`.
2) Pulsar **Confirmar pago** → aparece error.
3) Reintentar o volver sin perder selección.

## Tokens de diseño
Todos los estilos se basan en variables CSS (colors, type, spacing, radius, effects). Evitar hardcodear valores.


