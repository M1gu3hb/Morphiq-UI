# Reporte 0035 — Movimiento: Card, Alert y Badge

- **Autor:** Claude
- **Fecha:** 2026-07-21
- **Rama:** `redesign/card-alert-badge` · **Commit final:** ver PR
- **Tipo:** refactor visual (solo movimiento)
- **Prompt recibido:** Cierre del rediseño. Los tres tenían profundidad pero casi no se movían. **Solo añadir animación**: no rehacer materiales ni colores.

## Objetivo

Darles movimiento propio sin tocar una sola receta de material. Card ya se elevaba pero sin que
la sombra acompañara y sin press; Alert y Badge **no tenían ningún movimiento**.

## Paso 0

El proyecto se movió a `D:\morphiq-ui` y trabajé desde ahí. PRs #32 y #33 mergeados por mí,
`main` al día, **22 entradas** confirmadas, rama `redesign/card-alert-badge`, `npm ci` y
`npm run check` verde.

## Qué se hizo

- `src/registry/ui/card.tsx` — la sombra crece al elevarse y se colapsa al pulsar.
- `src/registry/ui/alert.tsx` — entrada del callout y micro-pulso del ícono.
- `src/registry/ui/badge.tsx` — pop de entrada y realce de hover.
- `docs/reports/0035-motion-card-alert-badge.md` — este reporte.

**Ni previews ni entries se tocaron**, y las recetas de material tampoco: **ningún color, borde,
degradado ni sombra en reposo cambió**. Todo lo añadido son estados nuevos (`hover`, `active`,
entrada) derivados de los que ya existían.

---

# Componente 1 — Card

## La animación de firma

Ya se elevaba (`hover:-translate-y-[2px]`), pero **la sombra se quedaba quieta**, así que la
tarjeta parecía deslizarse en vez de despegar. Ahora la sombra crece con la elevación y **se
colapsa al pulsar**, que es el lenguaje del Button.

El problema real era de estructura: la sombra en reposo vive **por material × variante** (12
superficies), y `box-shadow` solo interpola si las listas de capas coinciden en número y en orden
de `inset`. Escribir a mano 24 listas nuevas era una invitación a que una desalineara.

**Solución: derivarlas.** Un script recorrió cada `shadow-[…]` del archivo y generó su pareja
`--mq-shadow-hover` / `--mq-shadow-press` transformando los números — desplazamientos y desenfoques
exteriores escalados, alfas ajustadas, **capas `inset` intactas**. La paridad queda garantizada
*por construcción*, no por revisión. Salieron **10 superficies emparejadas**.

En clay se ve bien el relato: la pared lateral pasa de `0 7px 0` a `0 10px 0` al elevarse y se
**colapsa a `0 3px 0`** al pulsar.

**`reduced-motion`:** las dos son puro feedback —la tarjeta ya es un enlace o un botón— así que se
cancelan del todo (`motion-reduce:hover:translate-y-0`, `motion-reduce:active:translate-y-0`) en
vez de conservar un estado final.

## Lo que descarté

El encargo permitía un realce de borde opcional. Lo escribí y lo quité: habría necesitado un
`--mq-brd-hover` que **ninguna receta define**, así que habría sido un token muerto cayendo siempre
a su fallback — exactamente el defecto que marcó la revisión de una ronda anterior. Mejor no
tenerlo que tenerlo sin efecto.

---

# Componente 2 — Alert

## La animación de firma

El callout **llega** en vez de aparecer: se funde y se desliza 8px desde su borde inline-start,
que es justo donde está la regla de acento que identifica su tono, así que el movimiento parece
venir de ese marcador. El **ícono da un micro-pulso 80ms después**, para que la mirada aterrice al
final en el marcador de tono.

Keyframes y no transición: un alert se monta **ya en su estado final**, y una transición no tiene
desde dónde arrancar en el fotograma en que aparece un elemento.

**`reduced-motion`:** las dos son decoración —el callout ya lo anuncian su `role` y, en los tonos
asertivos, su región viva— así que se apagan. El alert queda simplemente presente: **nunca
retrasado, nunca oculto**.

## Un detalle que importaba

Los keyframes viajan dentro del componente, pero **un `<style>` no podía quedar dentro del
elemento con `role="status"`/`role="alert"`**: es una región viva, y lo que hay dentro es lo que se
anuncia. Envolví la raíz en un fragmento para que el `<style>` quede fuera. **Verificado en el
DOM: no hay ningún `<style>` dentro del alert.**

---

# Componente 3 — Badge

## La animación de firma

Un **pop de entrada** (`scale` 0.82→1 + `opacity`) con curva de resorte, por keyframes y por la
misma razón que el Alert: el badge se renderiza en su estado final.

El hover se queda en un susurro a propósito — **un badge es metadato, no un control**, y sugerir
que se puede pulsar sería mentir. La superficie se aclara un 4% y **nada se mueve**. La propiedad
es `filter` (que es donde Tailwind 4 escribe `brightness-*`), y es exactamente lo que nombra la
lista de transición: **sin fantasmas**.

**`reduced-motion`:** el pop se cancela y el brillo vuelve a 1 — el significado lo lleva la
etiqueta, que está ahí de todos modos.

---

# Verificación (build de producción, `getAnimations()`)

| Comprobación | Resultado |
|---|---|
| **Card** — paridad de capas reposo / hover / press | **4 / 4 / 4**, mismo orden de `inset` |
| Pared lateral clay | `0 7px 0` → `0 10px 0` (hover) → `0 3px 0` (press) |
| ¿Interpola o salta? | **interpola**: a mitad de vuelo la pared mide **9,52px** y la sombra ambiental `24,71px / 41,75px` |
| Reglas de hover/press | las cuatro presentes y coincidentes (`translate` y `box-shadow`) |
| `transition-property` | incluye `translate` y `box-shadow` |
| **Alert** — `role` / `aria-live` / `aria-atomic` | `status` / `polite` / `true` — intactos |
| Ícono | `aria-hidden="true"` |
| Entrada / pulso | `mq-alert-in` 0,32s · `mq-alert-icon` con retardo 0,08s y `fill: both` |
| `<style>` dentro de la región viva | **no** |
| **Badge** — entrada | `mq-badge-in` 0,26s |
| `transition-property` | `filter` — exactamente la propiedad que anima `brightness` |
| Regla de hover | presente y coincidente, escribe `filter` |
| Keyframes (los tres) | 1 regla y 1 etiqueta `<style>` por componente |
| Colores / bordes | sin cambios en los tres |

## Nota de método: un falso negativo que era mío

La primera prueba de interpolación de la Card dio **negativa** — la sombra saltaba. Antes de
"arreglar" nada comprobé el método, y el fallo era la prueba: yo estaba sustituyendo `box-shadow`
entero (8 capas compuestas → 4), lo que rompe la estructura y hace que el navegador cambie de
forma discreta. **La regla `:hover` real no hace eso**: solo cambia `--tw-shadow` y deja intacta la
composición. Repitiendo la prueba como la regla funciona de verdad, interpola.

Merece quedar escrito porque el error es fácil de repetir y habría llevado a tocar código que
estaba bien.

---

# NO se regresó nada

- **Materiales y colores:** ni una receta, ni un color, ni un borde, ni un degradado, ni una sombra
  en reposo. Las parejas hover/press se **derivan** de las de reposo, que quedan idénticas.
- **Card:** no se fingen semánticas de botón; sigue el patrón `asChild`, el `:focus-within` y los
  estados por `data-state`.
- **Alert:** `role`, `aria-live`, `aria-atomic`, la política de urgencia, los tonos y el ícono
  decorativo.
- **Badge:** contraste, tamaños, tonos y el anillo de foco.
- **Self-containment:** `selfContained:true`; todo `var()` con fallback literal.
- **`forced-colors`:** intacto en los tres. Las animaciones son de `opacity`/`scale`/`translate`/
  `filter`, que no pintan superficies, así que no había imágenes de fondo nuevas que limpiar.

## Gate

```
npm run check
{"components":22,"selfContained":true,"guards":"ok","status":"ok"}
✓ Compiled successfully
```

`components:22`; los tres siguen prerenderizándose como SSG.

## Lo que no se pudo verificar

- **No pude ver el resultado.** Como en todas las rondas, la captura del panel no está disponible;
  todo es **estilos computados y CSSOM**, que da valores exactos pero no una mirada.
- **`prefers-reduced-motion` y `forced-colors` no se activaron de verdad**; las reglas existen y
  coinciden con los elementos reales.
- **Solo Chromium**, sin lector de pantalla real.
- El hover y el press de la Card se verificaron por **las reglas CSS** (presentes y coincidentes) y
  la interpolación conduciendo `--tw-shadow` igual que hace la regla, **no** sintetizando un hover
  real de puntero.
- Las entradas de Alert y Badge se verificaron por `animation-name`, duración y retardo, **no**
  observando el recorrido: son animaciones de montaje y el compositor del panel está congelado.

## Nota de entorno

En el working tree hay `docs/component-expansion-map.md` y una carpeta `mas componentes/` sin
trackear que **no son míos**; no los toqué.
