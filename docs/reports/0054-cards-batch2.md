# 0054 · Tarjetas/Cards (tanda 2) · 7 componentes

**Rama:** `feat/cards-batch2` · **Base:** `main` (118 entradas tras la tanda)
**Gate:** `npm run check` → `{"components":118,"selfContained":true,"guards":"ok","status":"ok"}`; el build genera las 7 rutas SSG (`/components/{profile-card,product-card,pricing-card,notification-card,image-card,flip-card,expandable-card}`).
**Categoría:** `cards`. Los 7 en los **4 materiales** `clay/glass/skeuo/adaptive` con **profundidad real** copiada de `ui/card.tsx` (superficie/borde/sombra con extrusión de borde por material; skeuo greige `#e6e3da`/edge `#a8a49b`; elevación real). Sin `liquid-glass`.
**Dependencias nuevas:** ninguna de runtime salvo `lucide-react` (ya en el allowlist) donde hay íconos. **Sin `motion`** — todo transiciones CSS. Placeholders con `https://picsum.photos` (en los previews) o gradientes.

Construidos con orquestación multi-agente (un generador por componente, patrón `card.tsx`), seguidos de revisión adversarial a11y/runtime y verificación DOM/CSSOM en el build de producción. Código original en estilo Morphiq inspirado en fuentes MIT; nada copiado. No se repiten los `cards` existentes (`card, magic-card, neon-gradient-card, spotlight-card, stat, tilt-card`).

**Contrato de a11y de tarjetas:** HTML semántico (encabezado real de rango overrideable, `<img alt>`, acciones `<button>`/`<a>` con nombre, listas `<ul>`, `<time dateTime>`); la tarjeta clicable completa usa el patrón **stretched-link** (un `<a>` con `::after`) sin **anidar** interactivos ni atrapar el foco de los controles internos; foco visible; estado nunca solo por color (texto/ícono/forma); `reduced-motion` apaga hover/flip y deja el estado final legible; `forced-colors`; contraste ≥ 4.5:1; overlays con **scrim** que garantiza contraste sin depender de la foto.

---

## 1. `profile-card` — Perfil (4 materiales)

- **Inspiración / licencia:** profile/team cards (MIT). Original: superficie de `card.tsx`.
- **Técnica:** `<article>` con avatar (`<img alt>` o iniciales con `role="img"` aria-label), encabezado semántico (rango overrideable) para el nombre, rol, bio, y una `<ul>` de enlaces sociales (`<a>` con `aria-label`, ícono decorativo `aria-hidden`). No es clicable-completa (múltiples controles independientes) → sin stretched-link ni doble anillo de foco.
- **a11y:** encabezado real, img alt, cada enlace nombrado, foco visible por control; `reduced-motion` cancela los lifts.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 2. `product-card` — Producto (4 materiales)

- **Inspiración / licencia:** e-commerce product cards (MIT). Original.
- **Técnica:** `<img alt>` real, encabezado, precio, **rating por estrellas + TEXTO** ("4.5 · 128 reviews") con `aria-label="Rated 4.5 of 5"` (estrellas `aria-hidden`), y botón "Add to cart". **Stretched-link**: el título `<a>` con `::after` cubre la tarjeta mientras el botón Add va en `relative z-10` — **sin anidar** interactivos.
- **Verificado:** cero interactivos anidados (`a a`/`a button`/`button a` = 0), rating por texto + `aria-label`, img con alt, encabezado presente.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 3. `pricing-card` — Plan (4 materiales)

- **Inspiración / licencia:** pricing/plan cards (MIT). Original.
- **Técnica:** `<article>` con encabezado (rango overrideable vía `headingLevel`), precio, `<ul>` de features con checks `aria-hidden` + texto, y un CTA. El estado **"featured"** (variante) se marca con un badge de **TEXTO** ("Most popular") + elevación más fuerte, nunca solo color. La tarjeta anilla en `:focus-within`; el CTA lleva su `:focus-visible`.
- **a11y:** encabezado, lista de features, checks decorativos, CTA nombrado, featured por texto. (Se quitó un `aria-disabled` inválido del `<article>` — ver correcciones.)
- variants: `["default","featured"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 4. `notification-card` — Notificación (4 materiales)

- **Inspiración / licencia:** notification/inbox cards (MIT). Original.
- **Técnica:** ícono/avatar (`<img alt>` o `aria-hidden` si decorativo), mensaje, `<time dateTime>` y botones aceptar/descartar (`<button aria-label>`, lucide Check/X). El **tono** (info/success/warning) lo lleva ícono + texto, nunca solo color. `role="status"` opcional (opt-in).
- **a11y:** mensaje, `<time>`, botones nombrados, tono por ícono/texto; foco visible; `forced-colors` mantiene el ícono de tono.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 5. `image-card` — Imagen con overlay (4 materiales)

- **Inspiración / licencia:** image/overlay cards (MIT). Original.
- **Técnica:** `<img alt>` a sangre + un **SCRIM de gradiente** (transparente→oscuro) bajo el overlay, así el título (encabezado semántico) y caption blancos quedan ≥ 4.5:1 **sin depender de los colores de la foto**.
- **Verificado:** encabezado overlay blanco (`rgb(255,255,255)`) sobre un scrim de gradiente (`linear-gradient(rgba(0,0,0,0)…rgba(8,8,10,…))`); img con alt.
- **Contraste del overlay:** el texto blanco sobre el extremo oscuro del scrim supera 4.5:1 con cualquier foto; `forced-colors` conserva el texto legible.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge.

## 6. `flip-card` — Giro 3D (4 materiales)

- **Inspiración / licencia:** 3D flip cards (MIT). Original.
- **Técnica:** contenedor con `[perspective:...]` > inner `[transform-style:preserve-3d]` con `transition-[transform]` que rota a `[transform:rotateY(180deg)]`; caras front/back apiladas, cada una `[backface-visibility:hidden]`. Giro en **hover Y `focus-within` (teclado) Y tap**. Ambas caras en el DOM. Bajo `reduced-motion` hace **cross-fade** (opacidad) en vez de rotar. Usa `[transform:rotateY(...)]` arbitrario (nombra `transform` directo, no `rotate-*`).
- **Verificado:** 2 caras (`backface-visibility:hidden`), inner `preserve-3d` con `transition: transform`; **enfocar un control de la cara trasera voltea la tarjeta** (matriz `rotateY(180)`), así el teclado funciona; ambas caras con contenido; las caras tienen transición de opacidad (ruta cross-fade).
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge.

## 7. `expandable-card` — Expandible (4 materiales)

- **Inspiración / licencia:** expandable/collapsible cards (MIT). Original.
- **Técnica:** resumen visible + trigger `<button aria-expanded aria-controls={id}>` (ChevronDown que rota) y una región con **altura animada** por el truco de grid (`grid-template-rows: 0fr↔1fr` con hijo `overflow-hidden`), instantánea bajo `reduced-motion`. Controlado o no; ids de `useId`.
- **Verificado:** trigger `aria-expanded` alterna, `aria-controls` **resuelve**, la fila grid anima a 156px al abrir, el chevron rota a 180deg.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

---

## Cierre

- **Gate:** `npm run check` verde — `{"components":118,"selfContained":true,"guards":"ok","status":"ok"}`; `verify-registry` reporta 118; build genera las 7 rutas SSG. `getAnimations()` sin fantasmas.
- **Correcciones aplicadas al ensamblar (typecheck/lint):** los íconos de marca de lucide (`Github`/`Linkedin`/`Twitter`/`Dribbble`) ya no existen en esta versión → reemplazados por íconos genéricos existentes en el preview de `profile-card`; `eslint-disable` para los `<img>` reales (self-contained, sin acoplar `next/image`); `aria-disabled` inválido quitado del `<article>` de `pricing-card`.
- **Revisión adversarial (un revisor por componente, rutas `D:` fijadas + prueba de lectura):** **2 limpios** (`notification-card`, `expandable-card`), 5 "minor" (3 MEDIUM + 6 LOW, sin CRITICAL/HIGH). Correcciones aplicadas:
  - **flip-card (MEDIUM):** el toggle de la cara trasera reportaba un `aria-pressed` invertido (mismo `flipped` que el frontal) → ahora recibe `flipped={!flipped}` para que "Show summary" refleje el estado correcto.
  - **profile-card (MEDIUM + 2 LOW):** una acción `disabled` con `href` renderizaba un `<a>` activo → ahora degrada a `<button disabled>`; el avatar de iniciales se hizo decorativo (`aria-hidden`, evita doble anuncio del nombre); key de la lista social por `href`+índice (evita colisión).
  - **product-card (MEDIUM + 2 LOW):** con `disabled` la tarjeta se atenuaba pero el stretched-link seguía activo/enfocable/con lift → se cerró el enlace, el lift y el focus-within sobre `!disabled` (el título degrada a texto); pluralización "1 review"; `role="img"` en el span del rating para que su `aria-label` sea válido.
  - **pricing-card (LOW):** la tarjeta deshabilitada aún crecía la sombra al hover → sombra de hover restringida al estado `idle`.
  - **image-card (LOW):** `will-change:transform` permanente y con la propiedad equivocada → ahora `group-hover:[will-change:scale]` (nombra `scale`, la que anima, y solo durante hover).
  - _No corregido (deliberado, bajo riesgo):_ `flip-card` — enfocar el toggle frontal dispara el giro y esa cara se aleja; el contenido sigue alcanzable (el giro por `focus-within` es intencional para teclado) y una gestión de foco/`inert` arriesgaría el giro funcional; documentado.
- **Verificación runtime (build de producción, DOM/CSSOM):** flip-card (2 caras, voltea al **enfocar** la trasera, cross-fade), expandable-card (`aria-expanded`/`aria-controls`, altura grid animada, chevron 180°), product-card (**stretched-link sin anidar interactivos**, rating por texto + `aria-label`), image-card (overlay blanco sobre scrim de gradiente).
- **Guardarraíl:** solo se crearon los 21 archivos de registro (7 × ui/preview/entry) y este reporte. `docs/CREDITS.md`, `schema.ts`, `verify-registry` y los `ui/*` existentes intactos.
