# Reporte 0047 — Bloques/Secciones, tanda 1

- **Autor:** Codex
- **Fecha:** 2026-07-22
- **Rama:** `feat/blocks-batch1` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar siete secciones compuestas, responsive, semánticas, self-contained y accesibles en la categoría `blocks`, sin tocar infraestructura ni componentes existentes.

## Objetivo

Expandir el registry autoensamblado de 69 a 76 componentes con siete layouts de página completos:
Hero Section, Pricing Table, Feature Grid, Testimonial Section, CTA Section, Stats Section y Footer
Section. Todos debían usar un único estilo `adaptive`, responder de móvil a escritorio, conservar
contraste/foco/landmarks y respetar movimiento reducido y colores forzados.

## Qué se hizo

Se crearon exclusivamente los 21 archivos propios —entry, UI y preview— de:

- `hero-section`
- `pricing-table`
- `feature-grid`
- `testimonial-section`
- `cta-section`
- `stats-section`
- `footer-section`

Cada entry usa `category: "blocks"`, `materials: ["adaptive"]`, variantes y tamaños cubiertos por
su preview, texto bilingüe y manifiesto fiel de dependencias. Los siete usan CSS/React y las
primitivas ya permitidas; ninguno necesita `motion`. Se añadió este único reporte. No se modificó
schema, generator, verifier, package.json, CREDITS ni ningún componente preexistente.

## Cómo se hizo

### 1. Hero Section

- **Inspiración/licencia:** composiciones de hero de Magic UI y KokonutUI (MIT), reinterpretadas
  desde cero con lenguaje visual Morphiq; no se copió código.
- **Estructura/responsive:** `<section>` con eyebrow, `h1|h2` configurable, párrafo, dos enlaces y
  panel visual propio. El grid pasa de una columna a división `1.05fr/0.95fr` en escritorio; la
  variante `centered` conserva el mismo orden DOM.
- **Motion:** un halo decorativo usa `animate-pulse`; `motion-reduce:animate-none` conserva el
  panel final. Los CTA animan exclusivamente `box-shadow` o `background-color`.
- **A11y:** acciones como enlaces reales, visual y halo `aria-hidden`, foco visible y orden de
  lectura estable.

### 2. Pricing Table

- **Inspiración/licencia:** tablas de precios de Magic UI/KokonutUI (MIT), con API y markup
  originales.
- **Estructura/responsive:** cabecera centrada y lista de tres planes que pasa de una a tres
  columnas. Cada plan tiene encabezado, precio, lista real de features y enlace propio.
- **Interacción/reduced-motion:** el selector mensual/anual es un `<button role="switch">` con
  `aria-checked`; su thumb anima solo `translate` y queda instantáneo con movimiento reducido.
- **A11y:** “Most popular” identifica el plan destacado por texto, no solo por elevación/color.
  Switch y enlaces tienen foco visible.

### 3. Feature Grid

- **Inspiración/licencia:** bento grids de Magic UI y Spectrum UI (MIT), recreados con layout y
  tokens Morphiq.
- **Estructura/responsive:** lista real de features, 1→2→3 columnas, con variantes `bento` y
  `equal`. Los spans cambian visualmente sin alterar el orden DOM.
- **Motion:** hover anima únicamente los cuatro colores físicos de borde y `box-shadow`;
  movimiento reducido elimina las transiciones.
- **A11y:** cada ítem conserva título+párrafo; los Lucide son decorativos y `aria-hidden`.

### 4. Testimonial Section

- **Inspiración/licencia:** secciones de social proof de KokonutUI/Animata (MIT), implementadas de
  forma original.
- **Estructura/responsive:** grid 1→2→3 o variante `spotlight`. Cada historia usa
  `figure > blockquote + figcaption > cite`.
- **Motion:** deliberadamente estática; no hay movimiento funcional que apagar.
- **A11y:** el avatar usa `alt=""` porque nombre y rol ya están en `cite`, evitando anuncio
  duplicado. El icono de cita es decorativo. Se mantuvo `<img>` nativo para que el componente
  copy-and-own no dependa de Next.js.

### 5. CTA Section

- **Inspiración/licencia:** bandas CTA de Magic UI y Spectrum UI (MIT), reescritas con superficie
  elevada Morphiq.
- **Estructura/responsive:** titular, texto y dos enlaces; acciones apiladas en móvil y alineadas
  con el contenido en escritorio.
- **Motion:** aro decorativo pulsante y hover de acciones; reduced-motion congela el aro y elimina
  transiciones. `getAnimations()` solo devuelve `box-shadow` para el CTA primario.
- **A11y:** sección y encabezado nativos, enlaces con nombres explícitos, foco visible; decoración
  `aria-hidden`.

### 6. Stats Section

- **Inspiración/licencia:** bandas de métricas de Magic UI/Animata (MIT), con contador y semántica
  originales.
- **Estructura/responsive:** `dl` responsive 1→2→4; cada grupo conserva `dt` seguido de `dd` para
  valor y detalle.
- **Motion:** count-up opcional con `requestAnimationFrame`, easing cúbico y cleanup. Si
  `prefers-reduced-motion` está activo, escribe el valor final en el primer frame y no recorre
  valores intermedios.
- **A11y:** el `<data>` expone el valor final con `aria-label`; el número visual cambiante es
  `aria-hidden`, por lo que no genera anuncios repetidos ni depende del color.

### 7. Footer Section

- **Inspiración/licencia:** footers multicolumna de KokonutUI/Spectrum UI (MIT), recreados con
  navegación y tokens locales.
- **Estructura/responsive:** `<footer>`, bloque de marca, tres `nav` de contenido, `nav` legal y
  `nav` social. Pasa de una columna a marca+rejilla sin reordenar el DOM.
- **Motion:** enlaces de texto animan solo `color`; enlaces sociales, solo `background-color` y
  `color`. Reduced-motion elimina esas transiciones.
- **A11y:** cada landmark tiene nombre único, los enlaces sociales icon-only llevan `aria-label`
  y todo el orden de foco coincide con lectura.

## Self-containment, contraste y forced colors

Cada UI declara sus tokens `--mq-*` en la raíz y toda lectura `var()` incluye fallback literal.
No hay referencia a `:root`, globals.css ni clases de chrome. Todos los bloques restauran
`Canvas`, `CanvasText`, `ButtonText` o `LinkText` y eliminan sombras/decoración donde corresponde
bajo `forced-colors`.

Contraste WCAG medido con luminancia relativa sRGB:

| Par representativo | Ratio |
|---|---:|
| Texto principal claro `#201f1b` / `#f6f3ec` | 14.88:1 |
| Texto atenuado claro `#555249` / `#f6f3ec` | 7.05:1 |
| Acento claro `#5731b8` / `#f6f3ec` | 7.47:1 |
| Blanco / acento `#5731b8` | 8.28:1 |
| Borde claro `#89857b` / `#f6f3ec` | 3.32:1 |
| Texto principal oscuro `#f6f3ec` / `#191a1e` | 15.69:1 |
| Texto atenuado oscuro `#c5c1b8` / tarjeta `#26272c` | 8.30:1 |
| Acento oscuro `#b9a1ff` / `#191a1e` | 7.95:1 |
| Borde oscuro `#918d84` / `#191a1e` | 5.25:1 |
| CTA atenuado `#e1d9f3` / `#402178` | 9.04:1 |

## Verificación de navegador y transiciones

Se levantó el build de producción y se recorrieron las siete rutas con Chromium a 390×900 y
1280×900. Resultado: 14/14 navegaciones HTTP 200, un `h1` por ficha, cero `console.error`, cero
`pageerror` y `scrollWidth === clientWidth` en todos los casos.

`getAnimations()` después de provocar cada estado devolvió:

| Elemento/estado | CSSTransition observado |
|---|---|
| Hero CTA primario hover | `box-shadow` |
| Pricing switch mensual→anual | `translate` |
| Feature card hover | `border-*-color` (4 lados) + `box-shadow` |
| CTA primario hover | `box-shadow` |
| Footer social hover | `background-color` + `color` |

Con emulación `prefers-reduced-motion: reduce`, el pulso del Hero y su hover devolvieron `[]`; el
primer valor de Stats fue directamente `240+`. Testimonial y Stats no declaran transiciones CSS
fantasma.

## Resultado esperado vs. real

Se esperaban 76 componentes y siete rutas SSG nuevas. El resultado real coincide: registry con
76 entradas, guards en verde y build con 83/83 páginas estáticas (76 fichas + rutas de aplicación).
Las siete secciones renderizan sin overflow ni errores en móvil y escritorio.

## Bugs / obstáculos y cómo se resolvieron

- **Iconos sociales no exportados:** TypeScript mostró que la versión instalada de
  `lucide-react` no exporta marcas `Github`, `Linkedin` ni `Dribbble`. Se inspeccionaron los exports
  reales y se sustituyeron por `Code2`, `Network` y `Globe2`; los nombres accesibles conservan la
  marca correcta.
- **Advertencia `no-img-element`:** Next sugirió `next/image` para avatares. El componente
  distribuible debe ser framework-agnostic, por lo que se mantuvo `<img loading="lazy">` con una
  excepción ESLint local y justificada.
- **Proceso oculto bloqueado:** la política del shell rechazó `Start-Process`; se verificó con un
  servidor foreground administrado y cerrado explícitamente, sin afectar código.

## Verificación (gate)

- `npm run lint` — verde, sin warnings.
- `npm run typecheck` — verde; route types y `tsc --noEmit`.
- `npm run test:studio` — verde (`status: "ok"`).
- `npm run test:registry` — `{"components":76,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — verde; 83/83 páginas, incluidas las siete fichas nuevas.
- `npm run check` — verde integral sobre `feat/blocks-batch1`.

## Riesgos, deuda y pendientes

- Los datos y enlaces por defecto son demostrativos; producción debe pasar copy, URLs, precios,
  testimonios y métricas reales mediante props.
- Los avatares de demo usan Picsum y dependen de red; su texto de atribución nunca depende de la
  imagen. Un consumidor puede sustituirlos por assets propios.
- Pricing ofrece `defaultPeriod`, no un modo controlado; es intencional para mantener la primera
  API pequeña. Puede añadirse `period/onPeriodChange` si aparece un caso real de sincronización.
- `npm audit --audit-level=high` conserva 3 avisos heredados del lockfile (PostCSS moderado y dos
  altos de `sharp` transitivo vía Next). npm solo propone un downgrade rompiente a Next 9 con
  `--force`; no se alteraron dependencias fuera del guardarraíl y debe resolverse en una tarea de
  infraestructura cuando exista una versión compatible.
- No se añadió atribución a `docs/CREDITS.md` por guardarraíl; las fuentes y licencias quedan
  registradas por componente en este reporte.

## Estado final

Completo.
