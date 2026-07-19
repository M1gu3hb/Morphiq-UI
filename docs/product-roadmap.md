# Product architecture and roadmap

## Product boundary

The product is three connected systems:

1. **Foundry** — owned React components, material recipes, variants, documentation,
   examples, and copy/install distribution.
2. **Studio** — a visual editor that produces the same component schema and source code.
3. **Platform** — accounts, projects, publishing, community components, commercial
   licenses, teams, and billing.

The foundry is the source of truth. The website and studio consume the same component
metadata. The studio must never become a separate toy format that cannot export clean
code.

## Current checkpoint: Phase 0.5

- Product direction and original visual language.
- Bilingual landing page and catalog with browser-language detection.
- Animated library with 24 customizable objects and TSX, CSS, SVG, bundle, and AI-prompt export.
- Studio canvas with history, layers, responsive device frames, snapping, alignment,
  resize, drag, material and motion tuning, local save, and JSX/JSON export.
- Private-repository workflow, GitHub quality checks, and one definitive Vercel project.

## Phase 1 — Component engine

- Formal token schema: color, geometry, border, elevation, material, motion, and state.
- Component registry schema compatible with source-code distribution.
- Promote the first 20 objects from demonstrations into production-quality components.
- Variants, states, accessibility tests, and responsive examples.
- Search, tags, detail pages, copy command, and dependency manifests.

Exit criterion: components are good enough to use in a paying client's production UI.

## Phase 2 — Studio alpha

- Multiple frames and responsive breakpoints.
- Constraints, alignment, groups, ordering, and reusable component instances.
- Live JSX/CSS editor powered by Sandpack.
- Undo/redo history, autosave, import/export project JSON.
- Rendered preview isolated in a sandboxed iframe.

Exit criterion: a designer-developer can create a real component, export it, and use it
without manually rebuilding the result.

## Phase 3 — Supabase platform

Supabase is deliberately postponed until the data model is stable. Planned domains:

- Auth and profiles.
- Projects, versions, canvases, nodes, tokens, and assets.
- Private and published components.
- Favorites, collections, creators, moderation, and licenses.
- Row Level Security on every exposed table; ownership policies for every mutation.
- Storage buckets separated by private source assets and public previews.

No service-role credential will ever ship to the browser. Database migrations, RLS,
and storage policies must be reviewed together.

## Phase 4 — Commercial launch

- Free public collection.
- Pro creator plan for private projects, advanced export, and commercial component packs.
- Team plan with shared libraries and roles.
- Stripe checkout, webhook-backed entitlements, invoices, and cancellation flows.
- Marketplace only after curation, licensing, moderation, and payout operations are real.

## Non-negotiables

- Aesthetic depth cannot replace usability or contrast.
- Every visual control needs keyboard and touch behavior.
- Exported code must remain readable and ownable.
- Community code runs in a sandbox, never directly in the main application context.
- Do not promise collaborative Figma parity before the component engine is proven.
