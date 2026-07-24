# Reporte 0063 — Efectos, tanda 3

- **Autor:** Codex
- **Fecha:** 2026-07-23
- **Rama:** `feat/effects-batch3` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar diez efectos CSS/SVG originales, accesibles, SSR-safe y self-contained.

## Objetivo

Expandir `effects` de 205 a 215 componentes con diez envolturas visuales nuevas, previews completos
y ningún cambio fuera de sus 30 archivos propios más este reporte.

## Qué se hizo y cómo

### Click Spark

Inspiración general: interacciones de Magic UI y Animata (MIT), reimplementadas con partículas CSS
acotadas desde la coordenada del clic. La capa es `aria-hidden`, deja pasar el puntero y desaparece
por completo con reduced-motion o forced-colors.

### Image Trail

Inspiración general: image trails de React Bits y Animata (MIT), con una cola máxima de siete imágenes
y distancia mínima entre muestras. Las copias usan `alt=""`, no sustituyen el cursor nativo y se
desactivan para puntero grueso, reduced-motion y forced-colors.

### Scroll Reveal

Inspiración general: reveal wrappers de Motion Primitives (MIT), implementados con
`IntersectionObserver` y transición exacta de opacity/translate/filter. El HTML del servidor ya
contiene el estado final visible; sin JavaScript y con reduced-motion nunca se obtura el contenido.

### Pixel Reveal

Inspiración general: pixel reveals de React Bits (MIT), recreados como una cuadrícula CSS acotada
que se disuelve sobre una imagen real con `alt` y dimensiones reservadas. La cuadrícula es decorativa
y se elimina para reduced-motion y forced-colors.

### Blob Cursor

Inspiración general: cursores gooey de React Bits (MIT), con filtro SVG y resorte ligero por
`requestAnimationFrame`. La gota no intercepta eventos ni oculta el cursor y solo existe con puntero
fino, movimiento permitido y colores no forzados.

### Magnet Lines

Inspiración general: magnet lines de React Bits (MIT), con una rejilla DOM acotada y cálculo directo
de `rotate`; `transition-[rotate,opacity]` cubre la propiedad real de Tailwind 4. La rejilla es
`aria-hidden`, estática con coarse pointer y vuelve a cero con reduced-motion.

### Parallax Scroll

Inspiración general: parallax layers de Animata (MIT), reimplementadas con scroll pasivo,
`requestAnimationFrame` y velocidades por capa. El SSR muestra las capas alineadas y reduced-motion
o forced-colors restablecen `translate` a cero sin cambiar orden de lectura o foco.

### Glare Hover

Inspiración general: glare cards de Magic UI (MIT), con un gradiente diagonal que cruza por hover y
focus-within. La transición declara exactamente translate y opacity; reduced-motion conserva solo
un realce estático y forced-colors lo elimina.

### Cursor Follower

Inspiración general: cursor followers de React Bits (MIT), con punto inmediato y anillo retrasado por
un bucle CSSOM acotado. Ambos son decorativos, el cursor nativo permanece y puntero grueso,
reduced-motion o forced-colors desactivan el efecto.

### Fireworks

Inspiración general: celebraciones de Magic UI (MIT), con tres ráfagas CSS y densidad/duración
configurables. Todas las partículas son `aria-hidden`; el texto visible comunica el estado y
reduced-motion/forced-colors suprimen los bucles.

## Resultado esperado vs. real

El resultado coincide con lo esperado: 215 entradas, diez rutas SSG nuevas, suite estructural verde
y 222/222 páginas generadas. Los diez componentes quedaron respaldados en commits separados antes
del gate, sin incluir archivos de Cards.

## Bugs / obstáculos y cómo se resolvieron

- El `npm ci` inicial siguió vivo tras el timeout de la consola; se esperó su PID y no se lanzó un
  segundo proceso sobre el árbol.
- Claude cambió temporalmente el HEAD compartido a `feat/cards-batch3`; se restauró esta rama antes
  de validar y commitear, sin agregar archivos ajenos.
- La primera comprobación TypeScript de Blob Cursor coincidió con un `file-card.tsx` ajeno aún
  incompleto. El lint propio quedó verde y el gate global se difirió hasta estabilizar el árbol.
- React lint rechazó una autorreferencia temprana del callback del resorte; el bucle se encapsuló en
  una función local `tick`, con cancelación conservada al desmontar.
- Para obtener el conteo exacto se apartaron de forma reversible 18 archivos ajenos a
  `D:\morphiq-r19-cards-aside-20260723-1825`; tras el gate se restauraron todos sin conflictos ni
  sobrescrituras. Los archivos nuevos que Claude creó durante el build permanecieron intactos.

## Verificación (gate)

- ESLint dirigido a los 30 archivos de componente: verde.
- Escaneo dirigido de `var()` sin fallback literal en las diez UIs: verde.
- `npm run check`: verde en árbol estable con exactamente 215 entradas.
- Registry: `{"components":215,"selfContained":true,"guards":"ok","status":"ok"}`.
- Next build: 222/222 páginas estáticas, incluidas las diez rutas nuevas.
- Sin navegador, servidor, Playwright, `getAnimations()` ni medición manual, por instrucción.

## Riesgos, deuda y pendientes

- Los efectos de puntero dependen de `pointer: fine`; su ausencia es una degradación deliberada y
  mantiene intacto el contenido.
- Las atribuciones y licencias se documentan aquí; `docs/CREDITS.md` queda intacto por guardarraíl.

## Estado final

Completo: implementación, respaldo temprano, reconciliación segura del árbol compartido y gate verde;
listo para PR.
