# 0052 · Botones/Actions (tanda 2) · 7 componentes

**Rama:** `feat/actions-batch2` · **Base:** `main` (104 entradas tras la tanda)
**Gate:** `npm run check` → `{"components":104,"selfContained":true,"guards":"ok","status":"ok"}`; el build genera las 7 rutas SSG (`/components/{icon-button,button-group,copy-button,loading-button,split-button,fab,toggle-button}`).
**Categoría:** `actions`. Los 7 van en los **4 materiales** `clay/glass/skeuo/adaptive` con **física de presión** copiada de `ui/button.tsx` (sombra en reposo → `hover` levanta → `:active` hunde en un pozo inset; clay ~3px, skeuo ~4px, glass/adaptive ~1px; skeuo greige cálido). Sin `liquid-glass` esta tanda.
**Dependencias nuevas:** ninguna de runtime salvo `lucide-react` (ya en el allowlist) donde hay íconos. **Sin `motion`** — todo transiciones/keyframes CSS. Basados en `<button>` nativo (foco/teclado/`:disabled` gratis).

Construidos con orquestación multi-agente (un generador por componente, patrón `button.tsx`), seguidos de revisión adversarial a11y/runtime y verificación DOM/CSSOM en el build de producción. Código original en estilo Morphiq inspirado en fuentes MIT; nada copiado. No se repiten los `actions` existentes (`button, gradient-button, magnetic-button, rainbow-button, shimmer-button`).

**Contrato de a11y de actions:** nombre accesible siempre (los de solo-ícono exigen `aria-label`); foco visible (anillo de `button.tsx` + `forced-colors:outline-[Highlight]`); ARIA correcto donde aplica (`aria-pressed`/`aria-busy`/`aria-haspopup`/`aria-expanded`/`role="toolbar"`/`role="menu"`); estado nunca solo por color (ícono/texto + profundidad); `reduced-motion` quita el viaje pero **conserva el press** (pozo inset instantáneo); `forced-colors`; contraste ≥ 4.5:1.

---

## 1. `icon-button` — Botón de ícono (4 materiales)

- **Inspiración / licencia:** icon buttons (shadcn/radix-like, MIT). Original: receta de press de `button.tsx`.
- **Técnica:** `<button>` nativo cuadrado/circular (`variant` = forma) que centra un ícono (`children`), con la receta de 4 materiales y footprint h==w por tamaño. **Exige `aria-label`** (tipo requerido) — el fallo clásico de solo-ícono. `background-color` quitado de la lista de transición (recetas primary no tintan → evita fantasma).
- **a11y:** `aria-label` requerido, teclado/foco nativos, anillo de foco, física de press por material, `reduced-motion` conserva el pozo `:active`.
- variants: `["square","circle"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge.

## 2. `button-group` — Clúster segmentado (4 materiales)

- **Inspiración / licencia:** segmented/toolbar groups (MIT). Original: roving tabindex sin Radix.
- **Técnica:** compuesto `<ButtonGroup role="toolbar">` + `<ButtonGroupItem>` (botón nativo). **Tabindex móvil**: exactamente un miembro tabulable, flechas mueven el foco según el eje (horizontal/vertical), Home/End a los extremos, saltando deshabilitados. Los miembros comparten un borde: esquinas exteriores redondeadas en primer/último, interiores cuadradas, colapso `-ml-px`/`-mt-px`.
- **Verificado:** `role="toolbar"` + aria-label, 4 miembros, 1 tabulable (`[0,-1,-1,-1]`), ArrowRight mueve el foco (0→1, "Align center").
- **a11y:** toolbar + roving + flechas + Home/End; cada ítem con su nombre; el estado seleccionable (`aria-pressed` opt-in) por profundidad inset + `Highlight` en forced-colors.
- variants: `["horizontal","vertical"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge.

## 3. `copy-button` — Copiar al portapapeles (4 materiales)

- **Inspiración / licencia:** copy-to-clipboard buttons (MIT). Original.
- **Técnica:** `<button>` (receta de press). Al click, `navigator.clipboard.writeText(value)` (feature-detected, solo en el handler); swap a **Copiado** (ícono Check + "Copiado") ~1.6s y vuelve a idle (Copy + "Copiar"), con el timer limpiado en desmontaje/re-copia. El swap lo llevan **ícono + texto**, nunca color; éxito anunciado en `role="status"` `aria-live="polite"` sr-only.
- **a11y:** nombre accesible (label o `aria-label` en solo-ícono), confirmación `aria-live`, botón nativo, foco, física de press; SSR-safe (sin `Date.now` en render; timer en efecto/handler).
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 4. `loading-button` — Botón con estado pendiente (4 materiales)

- **Inspiración / licencia:** loading/async buttons (MIT). Original.
- **Técnica:** `<button>` (receta de press) + prop `loading`. Al cargar: spinner SVG inline (`animate-spin motion-reduce:animate-none`, `aria-hidden`), `aria-busy="true"`, y la activación se bloquea en los handlers **sin** el atributo `disabled` nativo (sigue enfocable para que `aria-busy` sea alcanzable — enfoque de `button.tsx`). **Sin CLS**: la etiqueta se conserva en el layout (opacidad/visibilidad) con el spinner superpuesto centrado, así el ancho no cambia.
- **Verificado:** el botón no usa `disabled` nativo (sigue enfocable); ancho estable.
- **a11y:** `aria-busy`, enfocable durante busy, spinner `aria-hidden`; estado no solo por color (spinner + aria-busy). `reduced-motion` conserva el press.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge.

## 5. `split-button` — Acción primaria + menú (4 materiales)

- **Inspiración / licencia:** split/menu buttons (radix-menu-like, MIT). Original.
- **Técnica:** dos botones nativos unidos (borde compartido): acción **primaria** + **caret** (`aria-label`, `aria-haspopup="menu"`, `aria-expanded`, ChevronDown). El caret abre un `role="menu"` de `role="menuitem"` (prop `actions`). Teclado: ArrowUp/Down mueven el foco entre ítems, Home/End, Enter/Espacio activan, **Escape cierra y devuelve el foco al caret**, click-fuera cierra; al abrir, foco al primer ítem.
- **Verificado:** caret `aria-haspopup="menu"` + `aria-expanded`; menú con 4 `menuitem`; foco al primer ítem al abrir; ArrowDown navega (Save as draft → Duplicate); `Esc` cierra + `aria-expanded=false` + **retorno de foco al caret**.
- **a11y:** primario + caret con nombres; roles menu/menuitem; modelo de teclado completo; retorno de foco; física de press.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 6. `fab` — Botón de acción flotante (4 materiales)

- **Inspiración / licencia:** FABs / speed-dials (Material-like, MIT). Original.
- **Técnica:** `<button>` circular y **más elevado** (sombra en reposo prominente) con la receta de 4 materiales; solo-ícono → **exige nombre accesible** (`aria-label`). Speed-dial opcional: prop `actions` revelada como columna de botones más pequeños etiquetados (keyframe escalonado, `motion-reduce:animate-none`), con `aria-expanded`/`aria-haspopup`, Escape cierra + retorno de foco.
- **Preview:** el FAB va dentro de un contenedor `relative` (no `fixed` al viewport) para no romper el catálogo.
- **a11y:** `aria-label`, `aria-expanded`/`haspopup` para speed-dial, acciones etiquetadas, Esc + retorno de foco, teclado/foco nativos, física de press.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 7. `toggle-button` — Botón on/off (4 materiales)

- **Inspiración / licencia:** toggle buttons (radix-toggle-like, MIT). Original.
- **Técnica:** `<button>` con `aria-pressed` (controlado `pressed`/`onPressedChange` o `defaultPressed`). Presionado → hundido persistente por material (pozo inset más profundo que el reposo) **y** cambio de **ícono** (aparece un Check) — el estado nunca es solo color/profundidad. Enter/Espacio alternan (botón nativo).
- **Verificado:** `aria-pressed` alterna false↔true; el ícono cambia con el estado (Check al presionar, distinto al soltar).
- **a11y:** `aria-pressed`; estado por ícono + profundidad (no solo color); foco visible; teclado nativo; física de press; `reduced-motion` conserva el hundido. `forced-colors`: presionado marcado con color de sistema.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

---

## Cierre

- **Gate:** `npm run check` verde — `{"components":104,"selfContained":true,"guards":"ok","status":"ok"}`; `verify-registry` reporta 104; build genera las 7 rutas SSG. `getAnimations()` sin fantasmas (recetas primary quitan `background-color` de la transición donde no se tinta).
- **Revisión adversarial (un revisor por componente, rutas `D:` fijadas + prueba de lectura):** **2 limpios** (`icon-button`, `button-group` — el revisor confirmó que el tab-stop del roving **sí** sigue al foco), 5 "minor" (1 MEDIUM + 6 LOW, sin CRITICAL/HIGH). Correcciones aplicadas:
  - **toggle-button (MEDIUM reduced-motion):** `motion-reduce:transition-none` solo quitaba la *animación*, no el viaje (el hover/press seguía saltando), contradiciendo el comentario/docs que dicen que el viaje se elimina. Se añadió `motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0` para **anular el viaje** dejando el pozo `data-[pressed=true]` (box-shadow) intacto. **Verificado en el CSS compilado:** el override queda después de la regla base con especificidad igual → gana bajo movimiento reducido (sin salto).
  - **split-button (2× LOW):** quitado `background-color` fantasma de la transición del `SURFACE_BASE`; `Escape` ahora hace `stopPropagation()` para no cerrar también un ancestro cerrable-con-Esc.
  - **loading-button (LOW):** el overlay de carga con `loadingText` ancho podía salirse de los bordes → `overflow-hidden` + texto `truncate` lo contiene.
  - **copy-button (LOW):** el texto reflowaba de "Copy"→"Copied" moviendo el contenido vecino 1.6s → ambos labels comparten una celda grid (uno `invisible`), así el ancho es el del más largo y no cambia.
  - **Limpieza:** eliminadas 2 consts `MATERIAL_TOKENS` muertas (usadas solo como tipo) en copy-button/toggle-button → unión directa; 0 warnings de lint.
  - _No corregidos (deliberado, bajo riesgo):_ `fab` Tab en el speed-dial devuelve el foco al FAB en vez de avanzar (el comportamiento actual es seguro y evita caer a `<body>`; el ideal APG requiere manejo de foco arriesgado); `toggle-button`/`fab` solo-ícono requieren `aria-label` (documentado — la ruta prevista es con texto/label).
- **Verificación runtime (build de producción, DOM/CSSOM):** split-button (menu/menuitem, foco al primer ítem, ArrowDown, `Esc` + retorno de foco al caret), button-group (`role=toolbar` + roving tabindex + flechas), toggle-button (`aria-pressed` + cambio de ícono), loading-button (sin `disabled` nativo, enfocable).
- **Guardarraíl:** solo se crearon los 21 archivos de registro (7 × ui/preview/entry) y este reporte. `docs/CREDITS.md`, `schema.ts`, `verify-registry` y los `ui/*` existentes intactos.
