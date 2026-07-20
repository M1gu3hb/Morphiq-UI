# Reporte 0004 — Componente Card

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-card` (ramificada de `feat/component-engine`) · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 2. Construir el componente Card de producción replicando el patrón del Button, respetando un guardarraíl de archivos porque Codex trabaja en paralelo.

## Objetivo

Añadir el segundo componente de producción al registry — un contenedor componible con los
cuatro materiales — sin tocar la superficie genérica, para comprobar que el motor construido
en la Ronda 1 es realmente aditivo.

## Qué se hizo

- `src/registry/ui/card.tsx` — el componente y sus partes: `Card`, `CardHeader`, `CardTitle`,
  `CardDescription`, `CardBody`, `CardFooter`, más `cardVariants`.
- `src/registry/previews/card-preview.tsx` — preview que cumple `PreviewProps` y maneja de
  verdad los 3 `variant` y los 3 `size` declarados.
- `src/registry/index.ts` — entrada `card` añadida después de `button` (orden alfabético por
  `slug`), con todos los campos de `RegistryEntry` llenos.
- `docs/reports/0004-componente-card.md` — este reporte.

**Nada más.** No se tocó `schema.ts`, `component-detail.tsx`, el route `[slug]`,
`component-catalog.tsx`, `globals.css`, `package.json`, `scripts/` ni studio/library. La
página de detalle y el catálogo recogieron Card solos, que era justamente la hipótesis a
validar.

## Cómo se hizo

**Ejes elegidos y por qué.**

- `variant: default | elevated | outline`. Un contenedor no tiene "intención" como un botón;
  lo que varía es su *presencia*. `default` es la superficie normal, `elevated` sube la
  sombra y la extrusión para sacar la tarjeta del plano, y `outline` la vacía y deja mandar
  al borde. Son los tres estados en que una tarjeta se usa de verdad: contenido normal,
  contenido destacado, y contenedor discreto que agrupa sin competir.
- `size: sm | md | lg` controla densidad, no tipografía suelta: fija `--mq-pad`, `--mq-gap`,
  `--mq-radius` y `--mq-title` (16/10/18/15 → 22/14/24/17 → 28/18/30/20). El radio crece con
  el padding para que la esquina no se vea apretada en `lg`.
- `interactive` es un eje aparte y booleano porque es una *señal*, no un tamaño ni un tono.

**Cómo heredan las partes sin contexto de React.** `Card` declara todos los tokens como
custom properties sobre sí misma; como las custom properties heredan, `CardTitle` y
`CardDescription` leen `--mq-text`, `--mq-muted` y `--mq-title` sin ningún provider. Un solo
lugar decide material y densidad, y las partes siguen siendo componentes tontos que se
pueden reordenar o reemplazar. Verificado en el navegador: con `size="lg"` el título computa
20px y el padding 28px sin que `CardTitle` sepa nada del tamaño.

**Self-containment.** Idéntico al Button: utilidades Tailwind con valores arbitrarios y
paleta en variables `--mq-*` declaradas sobre el elemento, **siempre** consumidas con
fallback literal. Auditado con grep sobre `card.tsx`:

- Todas las `var(...)` del archivo pertenecen al namespace `--mq-*` (12 nombres, ninguno más).
- Ninguna `var(--mq-*)` aparece sin fallback.
- Cero referencias a los tokens `:root` del sitio (`--coral`, `--ink`, `--paper`, …).
- Cero clases de `globals.css`.
- Imports: `react`, `@radix-ui/react-slot`, `class-variance-authority`, `@/lib/cn` — que es
  exactamente lo declarado en `dependencies`.

**Decisión de accesibilidad que conviene revisar: la tarjeta no finge ser un botón.** Un
contenedor con `role="button"` vuelve presentacional su contenido para parte de las
tecnologías de asistencia y, además, no puede contener legalmente los enlaces y botones que
una tarjeta suele llevar. Así que `interactive` aporta **solo** la señal visual (cursor,
elevación al hover) más el anillo en `:focus-within`; para una tarjeta que es enteramente un
enlace se usa `asChild` con un `<a>` y la activación por teclado la da el navegador. El
`:focus-within` está deliberadamente limitado a `interactive`: en una tarjeta inerte que
contiene un botón, resaltar tarjeta y botón a la vez duplica el anillo sobre el mismo foco.

**`outline` hereda el color de texto.** Aplicando la lección del Button (reporte 0003): una
superficie transparente no puede fijar un color de texto sin adivinar el fondo del anfitrión,
así que las cuatro variantes `outline` ponen `--mq-text` y `--mq-muted` a `currentColor`. Y
es `currentColor`, nunca `inherit`: una palabra clave CSS-wide escrita dentro de una custom
property se resuelve como que esa propiedad hereda el valor (inexistente) del padre, queda
inválida y cae al fallback del material. Verificado en el navegador: en los 4 materiales, el
título de `outline` computa exactamente el color del contenedor anfitrión.

**Estados.** `loading` pone `aria-busy` y un velo `aria-hidden` inerte; `disabled` pone
`aria-disabled` y atenúa. El velo usa `animate-pulse` de Tailwind y no un `@keyframes`
propio, precisamente porque un keyframes a medida tendría que vivir en una hoja global — la
dependencia que este componente se niega a tener. Bajo `prefers-reduced-motion` el pulso se
detiene y queda un velo estático, así que el estado sigue siendo visible sin movimiento.

**Next.js.** Esta tarea no escribe código de Next (solo componentes de registry); la
superficie de rutas ya existía y no se tocó. La regla de `AGENTS.md` se cumplió igualmente en
esta sesión al leer `node_modules/next/dist/docs/` (`upgrading/version-16.md`,
`generate-static-params.md`, `page.md`) antes de construir el motor en la Ronda 1.

## Resultado esperado vs. real

- **Esperado:** Card en el registry, `/components/card` estática, gate verde, sin tocar la
  superficie genérica. **Real:** cumplido. El build pasa de 8 a 9 páginas y lista
  `/components/button` y `/components/card` bajo `● (SSG)`.
- **El motor resultó aditivo de verdad.** Añadir Card fueron dos archivos nuevos y una
  entrada; el catálogo pasó a "2 components" y el filtro por material renderiza la Card en el
  material seleccionado, sin una línea de cambio en `component-catalog.tsx` ni en el route.
- **Diferencia:** el prompt sugería `variant` como `default | elevated | outline` "p. ej." y
  eso es exactamente lo implementado; no hubo desviación de ejes.

## Bugs / obstáculos y cómo se resolvieron

1. **`glass/default` no llegaba a AA en el texto atenuado.** Síntoma: el cálculo de contraste
   dio 4.27:1 para `--mq-muted` sobre fondo negro. Causa: con el tinte a 0.66 de opacidad la
   superficie compone a #a8a8a8 sobre negro, y el gris elegido era demasiado claro. Solución:
   `--mq-muted` de `#42423c` a `#36362f` → 5.14:1 sobre negro y 12.17:1 sobre blanco. Se
   aplicó también a `glass/elevated` por coherencia.
2. **Keyframes inexistente.** Escribí el velo de carga con
   `animate-[mqCardSweep_1.4s_...]`, pero ese `@keyframes` no existe y no puedo crearlo sin
   tocar `globals.css` (fuera del guardarraíl). Detectado antes de compilar. Solución:
   `animate-pulse`, que es de Tailwind y no necesita nada global.
3. **`calc()` inválido.** `gap-[calc(var(--mq-gap,14px)+4px)]` es CSS inválido: `calc`
   exige espacios alrededor del `+`, así que la regla se habría descartado en silencio.
   Solución: `calc(var(--mq-gap,14px)_+_4px)`, usando el escape de Tailwind para espacios.
4. **Riesgo de colisión en `tailwind-merge`** (la trampa del reporte 0003). `CardTitle`
   lleva tamaño y color, ambos utilidades `text-*`. Solución preventiva: sugerencias de tipo
   explícitas (`text-[color:…]`, `text-[length:…]`) y el `leading-*` **después** del
   tamaño de fuente. Verificado en el navegador: el título computa 17px con line-height
   20.4px y el color del token — las tres declaraciones sobreviven.
5. **`:focus-within` demasiado ancho.** Primera versión lo ponía en la base, así que
   cualquier tarjeta con un botón dentro se resaltaba entera al tabular. Movido al eje
   `interactive`.
6. **Falso positivo de medición (no es un bug del componente).** Al medir estilos computados
   en vivo, `background-color` y `backdrop-filter` salían congelados en los valores de la
   combinación anterior en las 12 combinaciones. No es del componente: el renderizador del
   panel de vista previa estaba throttleado y dejaba las transiciones a medias (la misma
   herramienta daba timeout al capturar pantalla). Se resolvió midiendo sobre un clon del nodo
   con `transition: none !important`, que devuelve el valor declarado sin interpolación en
   vuelo. Vale la pena recordarlo: **medir estilos en vivo sobre un elemento con
   transiciones puede mentir.**

## Verificación (gate)

`npm run check` en verde (**exit code 0**), corrido antes de empezar y de nuevo tras cada
tanda de cambios.

- `npm run lint` — ✅ sin errores.
- `npm run typecheck` — ✅ `next typegen` + `tsc --noEmit` limpios.
- `npm run test:studio` — ✅ `{"templates":5,…,"status":"ok"}` (sin regresión en Studio).
- `npm run build` — ✅ Next 16.2.10 Turbopack, **9 páginas**, sin warnings:

```
● /components/[slug]
  ├ /components/button
  └ /components/card
```

Verificación adicional contra el DOM real (valores declarados, medidos sobre clones sin
transición):

- **12 combinaciones material × variant.** Superficies correctas en todas: clay `#f6e7dd` /
  `#fff3ea` / transparente; glass `rgba(255,255,255,0.66)` / `0.78` / transparente con
  `blur(18px) saturate(1.7)`; skeuo con gradiente en las tres; adaptive `#232327` / `#2a2a2f`
  / transparente. Las 4 variantes `outline` heredan el color del anfitrión.
- **Contraste WCAG calculado sobre los valores fuente**, título y texto atenuado contra la
  superficie, tomando el peor extremo de cada gradiente y, en vidrio, el peor de fondo blanco
  y negro. Ninguna baja de 4.5:1. Mínimo: glass/default atenuado **5.14:1**. Máximo:
  adaptive/default título **17.08:1**.
- **Herencia de tokens sin contexto:** `sm/md/lg` → padding 16/22/28px, radio 18/24/30px,
  título 15/17/20px.
- **Estados:** `focus` → outline `solid 2px`; `loading` → `aria-busy="true"`, velo presente,
  opacidad 1 (no hereda el atenuado de deshabilitado); `disabled` → `aria-disabled="true"`,
  opacidad 0.55; `default` → sin atributos y sin outline.
- **`adaptive` adapta de verdad:** el navegador de pruebas reporta `prefers-color-scheme:
  dark` y la tarjeta rinde su rama oscura (superficie `#232327`, título `#f1efe9`), con
  13.62:1 de contraste.
- **Catálogo:** "2 components", ambos enlazan a su ficha y el filtro por material renderiza
  la Card en el material elegido. Cero cambios en la superficie genérica.

**Lo que NO verifiqué:** no hay revisión visual pixel a pixel — la herramienta de captura de
pantalla del entorno volvió a dar timeout, así que me apoyé en estilos computados. Tampoco
corrí la suite de registry de Codex: aún no existe en esta rama.

## Riesgos, deuda y pendientes

- **Esta rama depende de `feat/component-engine` (PR #2), que aún no está en `main`.** Se
  ramificó desde ahí por indicación explícita. Mientras la fundación no se mergee, el PR de
  Card mostrará también los archivos de la fundación; se limpia solo al mergear #2. **Orden
  de merge obligatorio: #2 antes que este.**
- **Contraste de `outline` es responsabilidad del anfitrión.** Al heredar `currentColor`, si
  alguien coloca una tarjeta `outline` sobre un fondo que no contrasta con su propio color de
  texto, falla. Es la decisión correcta (lo contrario es adivinar), pero está documentado en
  `a11y` y conviene que la futura suite lo trate como excepción conocida y no como fuga.
- **`elevated` en vidrio sube el tinte a 0.78**, lo que reduce un poco el efecto de vidrio a
  cambio de contraste. Es un intercambio deliberado; si el diseño prefiere más transparencia,
  hay que bajar el tinte y re-medir el atenuado.
- **La tarjeta no expone `asChild` en `CardHeader`/`CardBody`/`CardFooter`**, solo en `Card` y
  `CardTitle`. No hizo falta; añadirlo es trivial si aparece el caso.
- **Sin cobertura automatizada propia**, igual que en la Ronda 1. La suite de Codex debería
  cubrir: `sourcePath` existente, `variants`/`sizes` no vacíos, cada `id` manejado por el
  preview, y ausencia de fugas de self-containment. Card está construida para pasar esas
  cuatro.
- `npm audit` sigue con los 2 avisos moderados de PostCSS transitivo, igual que en 0001–0003.
  Sin impacto en el gate.

## Estado final

Completo. Card entregada con 4 materiales × 3 variantes × 3 tamaños, gate verde,
`/components/card` estática, y sin tocar ningún archivo fuera del guardarraíl.
