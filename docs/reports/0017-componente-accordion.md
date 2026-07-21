# Reporte 0017 — Componente Accordion

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-accordion` (desde `main`) · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 9. Construir el Accordion (disclosure / FAQ) en React puro, creando solo sus tres archivos, en paralelo con Codex que construye Tooltip.

## Objetivo

Añadir una lista desplegable de producción al registry, sin dependencias nuevas, con la
animación de altura hecha bien (sin `max-height` adivinado) y con el patrón de teclado de la
APG.

## Qué se hizo

**Paso 0 (autónomo).** Mergeé los PRs #14 (pulido) y #15 (Avatar) y borré la rama mergeada
`feat/component-alert`. `main` quedó en `dcd290d` con las 8 entradas.

**Tres archivos, ninguno compartido:** `ui/accordion.tsx`, `previews/accordion-preview.tsx`,
`entries/accordion.ts`. `git status` al terminar: solo adiciones.

## Cómo se hizo

### API componible

Cuatro exports: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`. Dos
contextos internos: el de la raíz lleva `variant`/`size` y el estado abierto; el del ítem
lleva `value`, `open`, `disabled` y los dos ids (`triggerId`, `panelId`) que enlazan encabezado
y panel. Así las partes no reciben props repetidas y los ids se generan una sola vez con
`useId()`.

`type="single"` (con `collapsible` opcional) y `type="multiple"`, cada uno controlado o no
controlado. Internamente el estado es **siempre** un `string[]` y solo se convierte en la
frontera: `onValueChange` emite `string | null` en modo single y `string[]` en múltiple. Un
solo camino de estado en vez de dos ramas que se desincronizan.

### La animación de altura

`grid-template-rows: 0fr → 1fr` sobre un envoltorio `overflow-hidden`, con el contenido
dentro. Es la técnica moderna para animar hasta la altura **real** del contenido: sin
`max-height` adivinado (que recorta contenido alto y añade easing muerto al contenido corto)
y sin medir en JavaScript.

Verificado en el navegador: el panel abierto computa `grid-template-rows: 58.875px` y el
cerrado `0px`, y al abrir se crea un **`CSSTransition` sobre `grid-template-rows`** de 200 ms
en `playState: "running"`. La propiedad está declarada:
`transition-[grid-template-rows]`.

**El chevrón se giró con una propiedad explícita**, no con `rotate-180`:
`[rotate:0deg]` → `data-[state=open]:[rotate:180deg]` con `transition-[rotate]`. Tailwind 4
reparte la rotación entre la propiedad `rotate` y `transform` según la utilidad, y transicionar
la equivocada no anima nada — exactamente la trampa del reporte 0007 con `translate`.
Escribiendo la propiedad a mano no hay ambigüedad. Verificado:
`transitionProperty: "rotate"`, `rotate: 180deg` abierto y `none` cerrado.

**Cobertura de transición**, exacta y sin fantasmas: el panel transiciona
`grid-template-rows`; el encabezado, `background-color` (hover y abierto); el chevrón,
`rotate`. Nada más cambia entre estados. `prefers-reduced-motion` suprime las tres.

### Accesibilidad

- Cada encabezado es un `<button>` real **dentro de un elemento de encabezado**. El botón da
  Enter, Espacio y el tab stop gratis; el heading da a los lectores de pantalla el esquema del
  documento por el que navegan. El rango es una prop (`headingLevel`, por defecto 3) porque
  solo la página sabe qué nivel le toca.
- `aria-expanded` y `aria-controls` en el botón; el panel es `role="region"` con `id` y
  `aria-labelledby` apuntando de vuelta. Verificado en el DOM: los tres `aria-controls`
  resuelven y el `aria-labelledby` del panel es el id de su propio trigger.
- **Arriba/Abajo/Inicio/Fin** entre encabezados, con envolvimiento. Verificado tecla a tecla:
  Abajo 0→1→2→0, Fin→2, Inicio→0, Arriba→2.
- **Un panel cerrado sigue montado pero es `inert`.** Tiene que seguir montado para que la
  transición tenga algo que animar, pero `inert` lo saca del árbol de accesibilidad y del orden
  de tabulación, así que nadie puede tabular dentro de un panel cerrado. Verificado:
  `closedPanelInert: true`, `openPanelInert: false`.
- `forced-colors`: bordes y separadores pasan a `CanvasText` y el anillo de foco a `Highlight`,
  para que las filas sigan delimitadas cuando se descartan los rellenos.

Una nota honesta: la APG recomienda `role="region"` en el panel **pero advierte** que con
muchos paneles conviene omitirlo para no saturar de landmarks. El prompt pedía región
explícitamente, así que está; queda anotado abajo como algo a revisar si una página llega a
tener muchos acordeones.

### Self-containment

Paleta en `MATERIAL_TOKENS` declarada en la raíz, siempre con fallback literal. Cero clases de
`globals.css`, cero vars de `:root`, cero dependencias npm nuevas (solo `cva` + `cn`, que ya
estaban). `verify-registry` lo comprueba solo y pasa.

`flush` no tiene superficie propia (es el tratamiento sin contenedor), así que su texto cae
sobre la página; se midió también contra el papel de Morphiq y contra blanco.

### Contraste

Calculado con la fórmula WCAG sobre los valores fuente y **contrastado contra los colores
computados en el DOM**, que coincidieron exactamente.

| Material | Encabezado | Cuerpo |
| --- | --- | --- |
| clay | 12.11:1 | 6.99:1 |
| glass | 7.05:1 | **5.14:1** (peor fondo) |
| skeuo | 11.2:1 | 7.16:1 |
| adaptive | 17.08:1 | 7.51:1 |
| adaptive oscuro | 13.62:1 | 7.8:1 |

Mínimo absoluto: **cuerpo de vidrio 5.14:1**, compuesto sobre el peor fondo posible — para eso
el vidrio lleva tinte propio. Los encabezados nunca bajan de 7.05:1. En `flush`, los mismos
tokens sobre papel/blanco miden de 6.53:1 para arriba.

## Resultado esperado vs. real

- **Esperado:** Accordion en el registry, `/components/accordion` estática,
  `verify-registry` con `components:9`, animación verificada con `getAnimations()`. **Real:**
  cumplido exactamente.

## Bugs / obstáculos y cómo se resolvieron

1. **Lint: el React Compiler no podía preservar mi `useCallback`.** Sus dependencias inferidas
   incluían `setUncontrolled` y mi lista no. Antes de decidir el arreglo comprobé si el
   compilador está realmente activado: **no lo está** (`next.config.ts` no tiene
   `reactCompiler`), solo corre la regla de lint. O sea que la memoización manual sigue
   haciendo trabajo real en runtime, así que **añadí la dependencia** en vez de quitar la
   memoización. Un setter de estado es estable, así que el comportamiento no cambia.
2. **Typecheck: `VariantProps` ensancha los ejes con `null`.** `variant`/`size` salían como
   `"sm" | "md" | "lg" | null`, y el contexto exige un valor definido. Los declaré
   explícitamente en las props públicas en vez de derivarlos de `VariantProps`: además de
   compilar, evita una API pública que acepta `null` para un eje de presentación.
3. **Falsa alarma de medición (mía, no del componente).** Mi primera sonda reportaba que el
   texto del cuerpo era `rgb(23,24,23)` (la tinta del sitio) y 16 px en **todos** los
   materiales y tamaños — señal de que las clases del contenido no se aplicaban. Antes de
   tocar el componente recorrí el subárbol real del panel: el selector `div > div` que usé
   estaba cogiendo el envoltorio `overflow-hidden`, no el div de contenido. El nodo correcto
   computa `rgb(91,74,60)` = `#5b4a3c` a 13 px. Re-medido con `.overflow-hidden > div`, los
   cuatro materiales dan exactamente los valores escritos.
4. **HEAD se movió solo a `main` — tercera vez.** El gate de preflight se ejecutó con
   `branch: main`. Como todavía no había escrito nada, no se perdió trabajo; volví a la rama y
   seguí. Lo detecté al instante porque imprimo la rama antes de cada gate, que es justo lo que
   el prompt pedía esta ronda.

## Verificación (gate)

`npm run check` en verde (**exit code 0**), en `feat/component-accordion`:

- `registry:gen` — `{"entries":9,"slugs":["accordion","alert","avatar","badge","button","card","input","tabs","toggle"]}`.
- `lint` ✅ · `typecheck` ✅ · `test:studio` ✅ `status:"ok"`.
- `test:registry` — ✅ `{"components":9,"selfContained":true,"guards":"ok","status":"ok"}`.
- `build` — ✅ sin warnings, `/components/accordion` entre las rutas `● (SSG)`.

Verificación funcional contra el **build de producción** (`npm run start`), no el dev server:

- **Estructura ARIA:** 3 encabezados, cada uno `<button>` dentro de `<h3>`; `aria-expanded`
  `true/false/false`; los 3 `aria-controls` resuelven; panel `role="region"` con
  `aria-labelledby` = id de su trigger.
- **Altura:** abierto `58.875px`, cerrado `0px`; al abrir se crea `CSSTransition` sobre
  `grid-template-rows`, 200 ms, `running`.
- **Chevrón:** `transitionProperty: "rotate"`; `180deg` abierto, `none` cerrado.
- **Teclado:** Abajo 0→1→2→0, Fin→2, Inicio→0, Arriba→2 (envuelve).
- **`inert`:** panel cerrado `inert`, abierto no.
- **Variantes:** `default`/`separated` con indentación 16 px, `flush` con 0.
- **Tamaños:** alto mínimo 40/48/56, padding 12/16/20, tipografía de encabezado y cuerpo
  12/13/14.
- **Materiales:** los cuatro pares encabezado/cuerpo coinciden con los valores escritos.
- **Estados:** `disabled` → los tres triggers deshabilitados; `focus` → `data-focus` y
  `outline solid 2px`.

**Lo que no verifiqué:** sin revisión visual pixel a pixel (la captura del entorno sigue dando
timeout). La activación por teclado (Enter/Espacio) se apoya en el `<button>` nativo y no pude
sintetizar pulsaciones reales — el arnés entrega eventos con `key` vacío, como documenté en el
reporte 0006; las flechas sí se verificaron porque las maneja mi propio `onKeyDown`. Tampoco
ejercité a fondo `type="multiple"` ni el cierre con `collapsible` en el navegador: el preview
usa `single` + `collapsible` y mi comprobación de cierre quedó inconclusa por el orden de los
clics. La lógica está cubierta por tipos y es directa, pero lo digo en vez de afirmar que la
probé.

## Riesgos, deuda y pendientes

- **`role="region"` por panel satura de landmarks** si una página tiene muchos acordeones. Es
  lo que pedía el prompt y lo que dice la APG, pero la propia APG sugiere omitirlo en listas
  largas. Un `landmark={false}` opcional sería la salida limpia si aparece el caso.
- **La navegación por flechas es global al root.** Si alguien anida un Accordion dentro de otro,
  el `onKeyDown` del externo también verá las teclas del interno. No lo resolví porque anidar
  acordeones no es un caso que el producto tenga hoy; la salida sería filtrar por el root más
  cercano.
- **`type="multiple"` y el cierre con `collapsible` no se ejercitaron en navegador** (arriba).
- **El color de foco/acento es fijo por material** con rama oscura solo en `adaptive`, igual
  que en el resto de la librería. Asume superficie clara.
- **Sin cobertura E2E propia** del teclado. Un test de Playwright que tabule al primer
  encabezado y recorra con flechas sería valioso, y ahí sí se pueden sintetizar teclas reales.
- `npm audit` sigue con los 2 avisos moderados de PostCSS transitivo, igual que en 0001–0016.

## Estado final

Completo. Accordion entregado con 4 materiales × 3 tratamientos × 3 tamaños, en React puro y
sin dependencias nuevas, con la animación de altura verificada como `CSSTransition` sobre
`grid-template-rows`, gate verde con `components:9` y sin tocar un solo archivo compartido.
