# Reporte 0003 — Motor de componentes + Button de producción

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-engine` · **Commit final:** ver PR (commit `feat: motor de componentes + Button de producción`)
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 1. Convertir `/components` de demos hardcodeadas al inicio de un motor de componentes real, probándolo en un componente emblemático (Button) con los 4 materiales, y fijar el patrón que Codex y yo replicaremos.

## Objetivo

Montar la fundación del motor de componentes (helper `cn`, esquema de registry, índice
aditivo, ruta de detalle estática) y validarla construyendo un Button de producción
autocontenido con los cuatro materiales, tres intenciones, tres tamaños y estado de carga.

## Qué se hizo

**Fundación**

- `src/lib/cn.ts` — `cn()` con `clsx` + `tailwind-merge`.
- `src/registry/schema.ts` — tipo `RegistryEntry` (`slug`, `name`/`nameEs`, `category`,
  `materials`, `description`/`descriptionEs`, `variants`, `sizes`, `dependencies`,
  `a11y`/`a11yEs`, `sourcePath`, `Preview`) más `PreviewProps`, `PreviewState`,
  `RegistryOption`, `RegistryDependencies` y el helper `findRegistryEntry`.
- `src/registry/index.ts` — `registry: RegistryEntry[]`, diseñado para ser aditivo.
- `src/registry/ui/button.tsx` — el componente. Autocontenido.
- `src/registry/previews/button-preview.tsx` — preview de documentación.

**Superficie**

- `src/app/components/[slug]/page.tsx` — Server Component con `generateStaticParams()`,
  `dynamicParams = false`, `generateMetadata()` y lectura del fuente real desde disco.
- `src/components/registry/component-detail.tsx` — island cliente: preview vivo con
  switcher de material/variante/tamaño/estado, código fuente real, copiar código,
  copiar prompt-IA (patrón de `/library`), manifiesto de dependencias y contrato de
  accesibilidad. Bilingüe.
- `src/components/component-catalog.tsx` — ahora lee del registry y enlaza a
  `/components/[slug]`.
- `src/app/components/page.tsx` — copy corregido; el contador sale del registry.
- `src/app/globals.css` — **un solo cambio**: los resets de elemento pasan a `@layer base`
  (ver bug 3).

No se tocó Studio ni Library. `component-data.ts` y `surface-preview.tsx` siguen intactos
porque la landing (`src/app/page.tsx`) los usa; solo el catálogo dejó de consumirlos.

## Cómo se hizo

**Autocontención.** El look de cada material vive en `button.tsx` como utilidades Tailwind
con valores arbitrarios. La paleta se declara como **CSS vars locales sobre el propio
elemento** (`[--mq-body:#ff9077]` …) y se consume **siempre con fallback literal**
(`bg-[var(--mq-body,#ff9077)]`). Eso da dos cosas a la vez: retematizar es sobrescribir una
variable, y borrar la declaración no rompe nada. Cero clases de `globals.css`, cero
`:root`. La única dependencia interna es `src/lib/cn.ts`, declarada en el manifiesto — el
mismo modelo que shadcn con `@/lib/utils`.

**Estructura CVA.** El `material` aporta la *estructura* (forma de sombra, borde, blur,
prensado) leyendo `--mq-*`; los `compoundVariants` de material × intent aportan solo la
*paleta*. Son 12 líneas de variables en vez de 12 recetas duplicadas, y es exactamente el
modelo "material recipe, not component package" de `docs/style-research.md`.

**`adaptive` no es otro preset de sombra.** `docs/style-research.md` dice explícitamente que
llamarlo así sería engañoso. Aquí adapta de verdad: `pointer-coarse:` agranda el objetivo
táctil, `prefers-color-scheme` invierte la paleta en primary/secondary, y `asChild` cambia
el elemento renderizado.

**Fuente real, no transcrita.** La ruta de detalle lee el archivo con `readFileSync` en
build. Lo que se muestra y lo que se copia es literalmente el archivo del repo, así que no
puede desincronizarse.

**Next 16.** Leí `node_modules/next/dist/docs/` antes de escribir (regla de `AGENTS.md`):
`upgrading/version-16.md`, `generate-static-params.md`, `page.md`. De ahí salió que `params`
es `Promise` y hay que await, y que existe el helper `PageProps<'/components/[slug]'>` que
genera `next typegen`.

**Revisión adversarial.** Corrí un workflow de 25 agentes en 4 lentes independientes
(autocontención, a11y/contraste, React/Next, Tailwind/CVA); cada hallazgo pasó por un agente
cuyo trabajo era **refutarlo**. 21 hallazgos levantados, **10 sobrevivieron** la refutación
y se corrigieron (más 1 refutado correctamente que no toqué). Los 11 refutados no se
tocaron.

## Resultado esperado vs. real

- **Esperado:** fundación + Button con 4 materiales, ruta de detalle estática, catálogo
  desde el registry, gate verde. **Real:** cumplido. `/components/button` se prerenderiza
  como SSG (`● (SSG)` en el build), el gate queda en verde y el catálogo lee del registry.
- **Diferencia 1 — el filtro cambió de semántica, a mejor.** Antes particionaba una lista de
  demos de un solo material. Ahora un componente del registry trae los 4 materiales, así que
  el filtro selecciona **en qué material se previsualiza**: filtrar por vidrio muestra los
  componentes que tienen receta de vidrio, renderizados en vidrio. Verificado en el navegador
  para los 5 filtros.
- **Diferencia 2 — el catálogo pasó de 6 tarjetas a 1.** Es el precio de dejar de mentir:
  hay un componente de producción, y eso es lo que se muestra. El copy de la página se
  reescribió en consecuencia y el contador sale de `registry.length`.
- **Diferencia 3 — `a11y` es `a11y` + `a11yEs`.** El prompt pedía `a11y: string`; el sitio es
  bilingüe y el resto del esquema usa pares `x`/`xEs`. Mantuve la coherencia.
- **Diferencia 4 — los estados forzables son 4, no 6.** Ver "Riesgos y convenciones".

## Bugs / obstáculos y cómo se resolvieron

Encontrados por mí (build + navegador):

1. **Turbopack trazó el proyecto entero.** Síntoma: warning `Encountered unexpected file in
   NFT list` apuntando a la ruta de detalle. Causa: `path.join(process.cwd(), sourcePath)`
   con ruta totalmente dinámica. Solución: acotar la lectura a un subdirectorio literal
   (`join(process.cwd(), "src/registry")`) + validar el prefijo y el escape de la ruta.
   Warning eliminado.
2. **`leading-none` desaparecía en silencio.** Síntoma: la clase no llegaba al DOM. Causa:
   `tailwind-merge` considera que `font-size` entra en conflicto con `leading-*`, así que la
   utilidad de tamaño posterior la eliminaba. Verificado con `require('tailwind-merge')`.
   Solución: plegar el interlineado en la utilidad de tamaño (`text-[13px]/[1]`).
3. **`globals.css` pisaba los estilos del componente — el bug de fondo.** Síntoma: en el
   navegador el botón salía con `color: rgb(23,24,23)` (el ink heredado) y `font-size: 16px`,
   pese a que las utilidades estaban en el `class` y el CSS emitido era correcto. Causa: los
   resets `button { color: inherit }` y `button, a, input, select { font: inherit }` estaban
   **fuera de toda capa**, y en la cascada el CSS sin capa gana al CSS en capa
   independientemente de la especificidad — así que ninguna utilidad de Tailwind podía
   ganarles. Prueba decisiva: las mismas clases sobre un `<span>` daban `rgb(74,29,19)` y
   `13px`; sobre un `<button>`, no. Solución: mover esos resets a `@layer base`. **Esto
   afectaba a cualquier componente futuro del registry, no solo al Button.**
4. **Los backticks del `description` se renderizaban literales** (es texto plano, no
   markdown). Quitados.
5. **Regresión propia al arreglar el hallazgo de adaptive/ghost.** Puse
   `[--mq-text:inherit]`; una palabra clave CSS-wide dentro de una *custom property* se
   resuelve como que la propiedad hereda el valor (inexistente) del padre, queda inválida y
   el `color` cae al fallback claro `#f6f5f1` — peor que el bug original. Solución:
   `currentColor`, que en `color` sí resuelve al valor heredado. Detectado porque volví a
   medir en el navegador después del fix, no antes.

Encontrados por la revisión adversarial y corregidos:

6. **`loading` ponía el atributo nativo `disabled`** (alto). Un elemento deshabilitado se
   desenfoca y sale del orden de tabulación, justo cuando `aria-busy` debería anunciarse.
   Solución: `disabled` nativo solo para la prop `disabled`; el estado de carga mantiene el
   foco y bloquea la activación en los manejadores.
7. **`asChild` no bloqueaba la activación** (alto). Con `asChild` no se aplicaba nada:
   `aria-disabled` es advisory y un `<a>` seguía navegando con Enter. Solución: guardas en
   `onClick`/`onKeyDown` que cubren puntero y Enter/Espacio en ambas rutas.
8. **`type` se descartaba con `asChild`** (medio). Ahora se reenvía si el llamador lo pasó.
9. **`ComponentPropsWithoutRef` impedía pasar `ref`** (medio) en React 19, donde `ref` es una
   prop normal. Cambiado a `ComponentPropsWithRef`.
10. **`pointer-coarse:px-[22px]` vivía en el material** (medio) y encogía el padding de
    `size="lg"` (26px → 22px) en táctil. Solución: el padding lo posee el tamaño; el material
    solo conserva overrides que *agrandan* (`min-h`, `gap`).
11. **adaptive/ghost a 1.30:1 en modo oscuro del SO** (alto). `dark:` responde al SO, no a la
    superficie real; con fondo transparente sobre una página clara pintaba texto pálido sobre
    claro. Solución: ghost hereda el color de texto del anfitrión (`currentColor`) y el hover
    usa un gris neutro. Medido después del fix: **15.9:1**.
12. **Temporizador de "copiado" sin cancelar** (bajo): dos copias seguidas en <1.5 s hacían
    que la primera apagara la confirmación de la segunda. Ahora se guarda en un `ref`, se
    cancela y se limpia al desmontar.
13. **Tres contrastes bajo AA en el chrome de la ficha** (medio/bajo): etiquetas del switcher
    3.19:1, texto de pistas y `<dt>` 4.03:1, mensaje de error 4.46:1. Recalculados y
    corregidos a 5.17:1 / 5.17:1 / 5.27:1.

## Verificación (gate)

`npm run check` en verde (**exit code 0**), corrido de nuevo tras cada tanda de correcciones.

- `npm run lint` — ✅ sin errores.
- `npm run typecheck` — ✅ `next typegen` + `tsc --noEmit` limpios.
- `npm run test:studio` — ✅ `{"templates":5,…,"status":"ok"}` (sin regresión en Studio).
- `npm run build` — ✅ Next 16.2.10 Turbopack, **8 páginas**, con
  `● /components/[slug] └ /components/button` marcado `(SSG)`. Sin warnings.

Verificación adicional, hecha contra el DOM real y el CSS emitido, no por inspección visual:

- **CSS emitido:** confirmadas las utilidades arbitrarias en el bundle (anillo
  `:focus-visible`, `[data-focus=true]`, `@media (pointer:coarse)`,
  `prefers-color-scheme`, `prefers-reduced-motion`, `forced-colors`, las declaraciones
  `--mq-*`, la sombra de arcilla y `blur(14px)`). Comprobado además que
  `--tw-outline-style` tiene `initial-value: solid` e `inherits: false`, así que el anillo
  se pinta aunque el componente nunca llame a `outline-none`.
- **Contraste:** las 15 combinaciones material × intent calculadas con la fórmula WCAG a
  partir de los valores del archivo. **Ninguna baja de 4.5:1.** Mínimo glass/ghost 4.70:1
  compuesto sobre negro puro; máximo adaptive/primary 16.32:1. (Un primer intento de medir
  esto manejando la UI desde el navegador dio números basura porque leía el DOM a mitad de
  la transición; los números buenos son los calculados sobre los valores fuente.)
- **Semántica de estados en vivo:** `loading` → `disabled` nativo `false`, enfocable `true`,
  `aria-busy="true"`, spinner presente; `disabled` → `disabled` nativo `true`; `focus` →
  outline `solid 2px rgb(23,24,23)`. Activación: click cancelado en `loading`
  (`defaultPrevented: true`) y no cancelado en reposo; `keydown` de Espacio cancelado.
- **Catálogo:** los 5 filtros verificados en el navegador — tarjetas, `aria-pressed`,
  contador singular/plural y `previewMaterial` correctos, enlace a `/components/button`.

**Lo que NO verifiqué:** no hay revisión visual pixel a pixel. La herramienta de captura de
pantalla del entorno devolvió timeout de forma repetida; me apoyé en estilos computados y
DOM, que es más preciso para contraste y estado pero no sustituye mirar el diseño. Tampoco
hay tests automatizados nuevos: `scripts/verify-studio.mjs` cubre Studio y no toca el
registry (ver pendientes).

## Riesgos, deuda y pendientes

- **Sin cobertura automatizada del registry.** El gate no rompería si alguien añade una
  entrada con `sourcePath` inexistente, `materials` vacío o un `Preview` que no compila con
  las props del esquema. **Recomendación fuerte para la Ronda 2:** un
  `scripts/verify-registry.mjs` encadenado en `check` que valide cada entrada, compruebe que
  el `sourcePath` existe y que `dependencies.npm` coincide con los imports reales del archivo.
- **La autocontención no está vigilada.** Nada impide que un componente futuro use una clase
  de `globals.css`. Ese mismo script podría prohibir en `src/registry/ui/` cualquier
  `var(--` que no empiece por `--mq-`, y cualquier clase conocida del chrome del sitio.
- **`hover` y `active` no son forzables** en el switcher, a propósito: forzarlos obligaba a
  escribir cada receta una segunda vez tras un selector `data-*`, y la copia podía divergir
  en silencio de la real. La ficha lo dice y el usuario los prueba en vivo. Si quieres
  capturas de regresión visual de esos estados, la vía barata es Playwright con `hover()`,
  no duplicar CSS.
- **`--mq-ring` es ink fijo** porque el producto es light-only. Cuando exista tema oscuro
  real hay que revisarlo material por material.
- **`npm audit`: siguen los 2 avisos moderados** (PostCSS transitivo de Next), igual que en
  los reportes 0001 y 0002. Sin impacto en el gate.
- **La landing sigue usando las demos** (`componentLibrary` + `SurfacePreview`). Es
  deliberado —el prompt acotaba el cambio a `/components`— pero es incoherencia pendiente:
  la home enseña demos y el catálogo enseña producto.

### Convenciones que Card y Toggle deben seguir (Ronda 2)

1. **Un componente = una entrada en `registry` + un archivo en `src/registry/ui/` + un
   preview en `src/registry/previews/`.** `ui/` es lo que se copia; nada de andamiaje de
   documentación ahí dentro. Mantener el array ordenado por `slug` para que dos autores
   choquen en líneas distintas.
2. **Cero `globals.css`, cero `:root`.** Paleta como `[--mq-*]` sobre el elemento y consumo
   **siempre con fallback literal**.
3. **Estructura en `material`, paleta en `compoundVariants`.** No duplicar recetas.
4. **Cuidado con `tailwind-merge`:** antes de dar por buena una clase, comprobar que llega al
   DOM. `font-size` mata a `leading-*`; los `text-*` de color y de tamaño conviven pero
   conviene verificarlo. Un `node -e "require('tailwind-merge')…"` de 10 segundos evita el bug.
5. **Geometría la posee `size`.** El material solo puede añadir overrides que *agranden*
   (`min-h`, `gap`), nunca que encojan.
6. **Estados:** `disabled` nativo solo para `disabled`; `loading` mantiene el foco, pone
   `aria-busy` y bloquea la activación en los manejadores; las guardas deben cubrir también
   la ruta `asChild`.
7. **Contraste calculado, no estimado**, y escrito en `a11y`/`a11yEs` con el peor caso
   explícito. Si una intención es transparente, decir de qué depende su contraste.
8. **Nada de `dark:` sobre superficies transparentes:** `prefers-color-scheme` describe el
   SO, no la superficie que hay detrás. Si el fondo es transparente, heredar con
   `currentColor`.
9. **Verificar en el navegador con estilos computados**, no solo con el build en verde. Los
   tres peores bugs de esta ronda pasaron el gate sin problema.

## Estado final

Completo. Fundación + Button entregados, gate verde, 10 hallazgos de la revisión adversarial
corregidos y reverificados. Va por PR contra `main` para auditoría, no directo a `main`.
