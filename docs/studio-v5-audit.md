# Morphiq Studio v5 implementation audit

This document maps the v5 product specification to concrete implementation and
verification evidence. It is intended to prevent the editor from being described as
complete when a control is decorative or disconnected from the document model.

## Acceptance matrix

| Capability | Implementation evidence | Verification |
| --- | --- | --- |
| Nested layers and frames | Versioned parent/child graph, recursive layer tree, drag-to-reparent, multi-select, group/ungroup, duplicate, rename, lock, hide, reorder, collapse, and search | Graph integrity, parent references, and cycle checks in `scripts/verify-studio.mjs` |
| Shapes and editable vectors | Frame, group, rectangle, ellipse, line, arrow, polygon, star, text, image, icon, vector, boolean, and editable UI primitives; pen points, Bézier handles, clip points, masks, and boolean modes | All 20 node kinds instantiated and exportable in the structural suite |
| Deformation and 3D | Independent radii, continuous corner smoothing, asymmetric geometry, scale, skew, flips, movable pivot, perspective, and X/Y/Z rotation | Door template asserts opposite free pivots and coordinated 3D tracks |
| Material stack | Reorderable solid, linear, radial, conic, diamond, image, noise, and pattern fills; multiple shadows, glows, blur, background blur, noise, texture, filters, and blend modes | All 8 paint and 8 effect kinds are constructed and normalized by the test suite |
| Four tactile styles | Full Clay, Glass, Skeuomorphic, and Adaptive/Polymorphic showcase-card documents, not flattened previews | Template tests require outer frame, stage, copy, decoration, and central control layers; Adaptive includes mobile overrides |
| Responsive layout | Free, horizontal, vertical, and grid modes; independent padding, gap, alignment, distribution, fixed/hug/fill, min/max, absolute children, constraints, and desktop/tablet/mobile overrides | Generated CSS is checked for responsive media rules and constraint output |
| Global animation timeline | Per-layer and per-variable tracks, unlimited keyframes, scrub, auto-key, multi-select, copy/paste/duplicate/delete, drag, stretch, reverse, stagger, markers, work area, FPS, speed, direction, and loop | Numeric and variable interpolation, easing, spring behavior, work range, and speed are exercised by structural tests |
| Motion properties | Geometry, 3D transforms, pivot, perspective, corners, vectors, clip paths, opacity, colors, fills, gradients, shadows, filters, text, values, visibility, and variables | Generated runtime is compiled and checked for animated content and transition output |
| Variants and interactions | Built-in and custom states; click, double-click, hover, focus, pointer, drag, swipe, scroll, key, load, delay, and variable triggers; conditional actions and smart/instant/dissolve transitions | Door variants and interaction graph are asserted; generated React runtime is type-checked |
| Reusable components | Create from selection, source-linked instances, editable definitions, and exposed text/number/color/boolean/enum/image/icon properties | Project normalization preserves definitions and instance overrides |
| Export and handoff | Interactive React plus CSS, standalone visual HTML/SVG, AI implementation handoff, and lossless v5 JSON | React output receives a strict semantic TypeScript compile; every export format is generated in tests |
| Accessibility and optimization | Semantic element choice, ARIA name/description, role, keyboard focus, tab index, alt text, real input/toggle/slider/dial controls, reduced-motion CSS, and export metadata | Lint, strict TypeScript, production build, and route smoke tests form the release gate |

## Release gate

The v5 checkpoint can be published only after every stage in the following command
succeeds without being skipped:

```bash
npm run check
```

After the production build, the local server must return HTTP 200 for `/`, `/studio`,
`/studio?template=double-door`, `/library`, and `/components`. Browser-level visual
regression testing remains a separate hardening task because this repository does not
currently include a browser runner or baseline snapshots.

## Deliberate boundaries

- Morphiq is a focused web-component foundry, not a general-purpose collaborative
  vector editor.
- HTML and SVG are portable visual snapshots. React/CSS is the interactive web export,
  while project JSON is the lossless editable format.
- Projects are stored locally for this checkpoint. Account sync, collaboration,
  marketplace publishing, and server-side asset storage begin with the Supabase phase.

## Known dependency finding

`npm audit --omit=dev` currently reports two moderate findings in the copy of PostCSS
bundled transitively by Next.js. The npm advisory has no available package fix at this
checkpoint. Morphiq does not pass community-authored CSS through that build-time
stringifier; nevertheless, the finding remains tracked and Next.js should be upgraded
as soon as its dependency graph contains the patched PostCSS release.

## Coherence hardening audit

The July 2026 audit added regression coverage for behavioral paths that structural
counts alone could not verify:

- component instances now inherit source hierarchy, responsive child rules, variants,
  interactions, and motion while preserving deliberate local overrides;
- adding, removing, grouping, or reparenting a main-component layer synchronizes every
  linked instance and removes stale animation/prototype references;
- invalid structural edits on internal instance layers are stopped with an actionable
  explanation instead of appearing to work and then silently reverting;
- direct instance motion wins over inherited motion for the same property in Studio,
  React runtime output, and generated CSS;
- responsive variant CSS is resolved in the same order as the live canvas, including
  constraints that depend on a variant-modified parent;
- non-looping alternate playback completes both the forward and return legs consistently
  in the editor and exported code;
- new instances no longer mark inherited property defaults as local overrides;
- interaction edits retain a valid target state/variable and condition values keep the
  selected variable's actual type;
- multi-keyframe drag selection and play-from-boundary behavior are deterministic.
