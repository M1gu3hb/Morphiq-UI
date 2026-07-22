# Reporte 0038 — Shimmer Button, Spotlight Card e Input OTP

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `feat/nuevos-shimmer-spotlight-otp` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Iniciar la expansión de Morphiq UI con tres componentes originales y self-contained — Shimmer Button, Spotlight Card e Input OTP — sin tocar la infraestructura compartida que se trabaja en paralelo.

## Objetivo

Agregar tres componentes de producción al registry autoensamblado usando únicamente
categorías y dependencias existentes. Cada uno debía ofrecer cuatro materiales táctiles,
contrato copy-and-own, reduced-motion, forced-colors, accesibilidad real, contraste
auditado y una preview que cubriera todos sus ejes.

## Qué se hizo

Cada componente quedó encapsulado en sus tres archivos propios:

- `src/registry/ui/shimmer-button.tsx`, su preview y su entry.
- `src/registry/ui/spotlight-card.tsx`, su preview y su entry.
- `src/registry/ui/input-otp.tsx`, su preview y su entry.

No se modificaron `schema.ts`, `verify-registry.mjs`, `package.json`, archivos existentes
del registry ni ningún archivo compartido. La generación automática descubrió las tres
entries y elevó el registry de 22 a 25 componentes.

## Cómo se hizo

### Shimmer Button

La inspiración conceptual es el patrón de botón brillante popularizado por Magic UI,
identificado en `docs/component-expansion-map.md`. La implementación es original: no se
copió código ni se creó una derivación de otra biblioteca. El control es un `<button>`
nativo; una superficie interior estable protege el contraste del texto y un borde de 2 px
recibe el barrido. El keyframe local `mq-shimmer-button-sweep` anima únicamente
`background-position`, se hoistea/deduplica mediante `<style href precedence>` de React 19
y no requiere stylesheet global.

| Material | Receta |
| --- | --- |
| clay | Superficie coral inflada, canto terracota, luz porcelánica y sombra ambiente marrón. |
| glass | Superficie oscura autocontenida, brillo cian/blanco, blur y sombra fría; no toma legibilidad del fondo. |
| skeuo | Greige cálido, bisel claro, pared `#a8a49b`, brillo metálico y sombreado acromático. |
| adaptive | Superficie sobria que invierte cuerpo/texto según el esquema y aumenta el target con puntero grueso. |

Hover eleva 1 px y amplía la sombra; active hunde 2 px. `transition-property` enumera
`translate`, `box-shadow`, `filter` y `opacity`: el filtro sólo cambia en skeuo y las demás
recetas no inventan efectos. Disabled detiene el loop y anula los desplazamientos. Bajo
reduced-motion, `animation-name` y `transition-property` computaron `none` y
`getAnimations()` devolvió cero animaciones. En forced-colors, el gradiente y las sombras
desaparecieron mientras permanecieron `ButtonFace`, `ButtonText` y el foco `Highlight`.

Contraste de la etiqueta contra la superficie interior, tomando el peor extremo del
gradiente: clay **6.44:1**, glass **10.25:1** en el peor fondo, skeuo **10.55:1** y
adaptive **16.32:1** claro / **15.48:1** oscuro.

### Spotlight Card

La inspiración conceptual es el patrón spotlight/magic-card del mapa de expansión. El
código es original y usa únicamente React + CSS: `onMouseMove` mide el rectángulo local y
escribe `--mq-x`/`--mq-y` sobre esa instancia. Una capa `aria-hidden` pinta un
`radial-gradient` con esas coordenadas. `onMouseLeave` restablece ambas a `50%`, que es
también el fallback seguro cuando la tarjeta recibe foco sin cursor.

La tarjeta sigue siendo un `<article>` y nunca simula un botón. No entra al orden de
tabulación por defecto; acepta el `tabIndex` nativo cuando la superficie debe ser
enfocable y muestra el mismo contorno mediante `:focus-visible`/`:focus-within`. La preview
usa `tabIndex={0}` para demostrar ese camino. reduced-motion apaga el halo y el lift, en
vez de ralentizarlos; forced-colors elimina halo, gradiente, translucidez y sombras, pero
conserva borde `CanvasText` y foco `Highlight`.

| Material | Superficie / spotlight |
| --- | --- |
| clay | Slab crema-coral con canto cálido y halo coral amplio. |
| glass | Pane blanco autocontenido, borde oscuro de contraste, blur/saturación y flare cian. |
| skeuo | Faceplate `#e6e3da`, bisel acromático, pared cálida y highlight blanco mecánico. |
| adaptive | Plano claro/oscuro, sombra mínima y halo verde de baja intensidad. |

Contraste primario/secundario: clay **12.11/5.92:1**, glass **9.87/7.19:1** en el peor
fondo, skeuo **12.29/7.04:1**, adaptive claro **17.08/7.51:1** y oscuro
**13.62/7.80:1**. Contraste mínimo del límite contra la superficie: clay **3.91:1**,
glass **4.06:1**, skeuo **3.63:1**, adaptive **4.57:1** claro / **6.57:1** oscuro.

### Input OTP

La inspiración es la interacción multi-slot habitual de los componentes OTP de la
comunidad shadcn/input-otp, pero la mecánica, API, estados y recetas Morphiq son código
original. Se renderizan N `<input type="text">` nativos (1–10), todos con
`inputMode="numeric"`; el primero expone `autoComplete="one-time-code"`. El componente
funciona controlado o no controlado, filtra no-dígitos, avanza al escribir, retrocede y
limpia con Backspace, acepta Delete, ArrowLeft/Right, Home/End y distribuye un código
completo al pegar. Si recibe `name`, un único input hidden nativo entrega el valor al
formulario.

Cada casilla tiene etiqueta numerada y el conjunto usa `role="group"` con nombre. La
primera validación detectó correctamente que `aria-invalid` no pertenece a `role=group`:
se retiró del grupo y se conserva en cada input nativo, junto con un mensaje opcional
`aria-live="polite"` enlazado mediante `aria-describedby`. El error, por tanto, no depende
sólo del borde rojo. El foco combina un contorno inmediato con un pozo material; reduced-
motion quita sólo la interpolación. forced-colors conserva `Field`, `FieldText`,
`CanvasText`, `Highlight` y `Mark` y elimina sombras/backdrop.

| Material | Receta de casilla |
| --- | --- |
| clay | Pozo crema-coral, borde/canto cálido y presión interior al foco. |
| glass | Slot blanco translúcido autocontenido, borde oscuro, filo claro y blur local. |
| skeuo | Greige cálido `#e6e3da`, gradiente moldeado, pared `#a8a49b` y pozo acromático. |
| adaptive | Slot opaco claro/oscuro, sombra mínima y target táctil de al menos 44×48 px. |

Contraste de dígito en reposo/foco: clay **12.30/13.41:1**, glass **10.95:1** como
peor caso, skeuo **12.29/13.72:1**, adaptive **17.08:1** claro / **13.62:1** oscuro.
Contraste mínimo de borde en reposo: clay **3.97:1**, glass **4.24:1**, skeuo
**3.63:1**, adaptive **4.57:1** claro / **6.57:1** oscuro. El texto de error mide
**6.90:1** o más en claro y **8.87:1** en adaptive oscuro.

### Movimiento observado con `getAnimations()`

La sonda se ejecutó inmediatamente después de forzar cada estado, sin depender de
muestrear un frame a mitad de la transición.

| Componente / estado | Resultado real |
| --- | --- |
| Shimmer Button en reposo | `CSSAnimation: mq-shimmer-button-sweep` (`background-position`). |
| Shimmer Button hover | `CSSTransition: box-shadow`, `CSSTransition: translate` + el shimmer. |
| Spotlight Card hover | `CSSTransition: box-shadow`, `translate`, `opacity`; coordenadas reales `11.80% / 22.89%`. |
| Input OTP al mover foco | `CSSTransition: background-color`, cuatro lados de `border-color` y `box-shadow`. |
| Los tres con reduced-motion | Ninguna animación; transición computada `none`, halo en opacidad 0 y foco OTP aún `solid`. |

No apareció `transform`: Tailwind 4 escribe el lift en la propiedad individual
`translate`, que es exactamente la propiedad declarada y observada. Tampoco aparecieron
transiciones de propiedades que no hubieran cambiado en el estado probado.

### Self-containment, TDD y revisión React

Los tres componentes declaran sus tokens en el elemento, consumen cada `var()` con
fallback literal y cargan sus keyframes dentro del propio archivo. No leen `:root`,
`globals.css` ni clases de chrome. Sus únicas dependencias son el trío estándar ya
existente (`class-variance-authority`, `clsx`, `tailwind-merge`) y `src/lib/cn.ts`.

Un contrato efímero fuera del repositorio empezó RED con los nueve archivos ausentes y
terminó GREEN comprobando estructura de entry/preview/UI, materiales, categorías,
fallbacks, reduced-motion, forced-colors y las interacciones distintivas. Se eliminó al
cerrar porque no pertenece al guardarraíl. La revisión React confirmó exports nombrados,
props colocadas, hooks no condicionales, estado local derivado y semántica nativa.

## Resultado esperado vs. real

- **Esperado:** tres componentes self-contained que pasaran el gate vigente sin depender
  del PR de infraestructura de Claude Code.
- **Real:** el registry vigente descubrió 25 componentes, las tres rutas prerenderizaron y
  las interacciones funcionaron en Chromium de producción sin errores de consola/runtime.
  No hizo falta tocar ningún archivo compartido.

En navegador, Input OTP avanzó del dígito 1 al 2, dos Backspace limpiaron y devolvieron el
foco al dígito 1, y pegar `730194` rellenó las seis casillas, enfocó la sexta y actualizó
el valor de formulario a `730194`. El estado error dejó las seis casillas con
`aria-invalid="true"` y conectadas al mensaje visible.

## Bugs / obstáculos y cómo se resolvieron

1. **`npm ci` excedió el timeout de la consola sin terminar su hijo.** Se comprobó el PID
   exacto y se dejó completar sin matar el proceso paralelo de Claude; después typecheck y
   el gate confirmaron una instalación válida.
2. **El primer typecheck rechazó indexar `data-focus` en el resto de props.** Se convirtió
   en una prop explícita y tipada, conservando el atributo de preview sin `any`.
3. **ESLint señaló `aria-invalid` sobre `role="group"`.** Se eliminó de ese rol y quedó en
   cada input, que es el propietario semántico correcto.
4. **El radio interior inicial intentaba calcular desde `inherit`.** La inspección previa
   al gate lo sustituyó por radios explícitos por tamaño; no quedó CSS inválido.

## Verificación (gate)

- `npm ci` — ✅ dependencias instaladas; lockfile sin cambios.
- Contrato TDD efímero — ✅ RED observado y GREEN final para los 3 componentes.
- ESLint dirigido después de cada cambio — ✅ sin warnings ni errores.
- `npm run typecheck` después de cada componente — ✅.
- `npm run test:registry` — ✅
  `{"components":25,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run check` — ✅ lint, typecheck, studio, registry y build.
- Build Next 16 — ✅ 32 páginas estáticas; las 25 fichas del registry, incluidas
  `/components/shimmer-button`, `/components/spotlight-card` y `/components/input-otp`,
  quedaron SSG.
- Playwright CLI + Chromium — ✅ render real, movimiento WAAPI, OTP completo,
  reduced-motion, forced-colors, foco/error/ARIA y **0** errores de consola.
- `npm audit --audit-level=high` — ⚠️ falla por advisories heredados de `sharp`/libvips
  (2 high) y PostCSS dentro de Next (1 moderate). npm sólo propone un `--force` que
  degradaría Next a 9.3.3; no se aplicó porque `package.json`/lockfile están fuera del
  guardarraíl y los tres componentes no agregan dependencias.

## Riesgos, deuda y pendientes

- La superficie glass se auditó contra fondos blanco y negro; fondos HDR o filtros del
  host pueden rasterizar el blur de forma ligeramente distinta, pero el tinte y el texto
  propios conservan el contrato.
- Los inputs OTP preservan huecos en el estado interno, pero el valor emitido/formulario es
  la concatenación de dígitos — el formato esperado para un código OTP.
- Infra debería actualizar Next/sharp cuando exista una versión compatible y revalidar el
  advisory de npm; no es deuda introducida por este PR.
- No se tocó `docs/CREDITS.md`: estas implementaciones son originales, sólo toman patrones
  conceptuales del mapa, y el guardarraíl reserva la infraestructura compartida a Claude.

## Estado final

Completo. Los tres componentes, sus previews y entries están listos, el registry reporta
25 componentes self-contained y el gate obligatorio permanece verde.
