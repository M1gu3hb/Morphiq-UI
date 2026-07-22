<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:team-workflow -->
# Equipo y flujo de trabajo

Morphiq UI se trabaja con un dueño (Miguel), un orquestador/arquitecto/auditor y dos ejecutores (Claude Code y Codex). Antes de ejecutar, audita el código real; al terminar cada tarea, escribe un reporte en `docs/reports/`. El flujo y las reglas completas están en `docs/workflow.md` — léelo.
<!-- END:team-workflow -->

<!-- BEGIN:tiers -->
# Dos tiers de componentes

- **Core (los 22 originales):** cero dependencias de runtime. Se copian con solo
  `src/lib/cn.ts` y reproducen todo el look. `verify-registry` lo exige: cada `var()`
  con fallback literal, nada de `:root`/`globals.css`, y sin imports npm fuera de las
  primitivas de estilo (`class-variance-authority`, `clsx`, `tailwind-merge`) y las de
  comportamiento ya presentes (Radix, `lucide-react`).
- **Animado (expansión):** componentes cuyo objetivo ES el movimiento pueden declarar
  dependencias de una **allowlist** en `scripts/verify-registry.mjs` (`animatedTierPackages`,
  empieza con `motion`). El guard sigue exigiendo `declarado === importado`; solo deja de
  prohibir lo que está en la allowlist. Para permitir un paquete nuevo, se agrega a esa
  lista **a propósito** (cambio de una línea, revisable).

**No se relaja nada más para el tier animado:** self-containment del CSS (sin `:root`,
sin `globals.css`), contraste, cobertura de transición (`getAnimations()` sin fantasmas),
`prefers-reduced-motion` y `forced-colors` siguen siendo obligatorios para todos.

Attribution: cada componente derivado de una fuente MIT/Apache mantiene su crédito en
`docs/CREDITS.md`. Fuentes con Commons Clause (react-bits, animate-ui) son **solo
inspiración** — no se copia su código.
<!-- END:tiers -->
