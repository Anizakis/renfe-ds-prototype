# UI Atomic Design

Convención para componentes en `src/ui`:

- Nombres en PascalCase (carpetas y componentes).
- Usa una prop `variant` para variaciones visuales.
- Estados con prefijo `is-*` en className (ej. `is-active`, `is-disabled`).
- Subpartes internas con BEM-like: `Component__part`.

Carpetas:
- `atoms`: unidades básicas sin dependencias complejas.
- `molecules`: combinaciones simples de átomos.
- `organisms`: secciones completas que orquestan moléculas.
