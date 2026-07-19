# Morphiq Studio v5

Morphiq Studio is a focused web-component editor. It is not intended to reproduce
every Figma workflow; it concentrates on tactile materials, responsive component
construction, motion design, and source-code export.

## Workspace

- **Top:** selection, frames, shapes, Pen, text, boolean operations, masks, grouping,
  preview, history, save/import, and export.
- **Left:** primitives, UI controls, editable templates, recursive layer tree, and
  reusable local components.
- **Center:** device-aware canvas with zoom, rulers, grid, snapping, guides, alignment,
  direct resize/drag, vector points, Bézier handles, clip points, and free pivots.
- **Right:** Design, Material, Layout, Component, Interactions, and Accessibility.
- **Bottom:** global animation timeline with one property track per layer or variable.

## Document model

The versioned project JSON is the lossless source of truth. A document contains:

- a parent/child node graph;
- transforms, geometry, typography, material stacks, effects, filters, and layout;
- desktop, tablet, and mobile overrides;
- scene variants and per-layer overrides;
- design variables and property bindings;
- prototype interactions and conditions;
- reusable component definitions, source-linked instances, and exposed properties;
- timeline tracks, keyframes, markers, work area, FPS, speed, loop, and direction;
- semantic HTML and accessibility metadata.

Existing v4 JSON projects are normalized into the v5 schema on import.

## Geometry and materials

Nodes support independent radii, corner smoothing, X/Y scale, skew, flip, 3D rotation,
perspective, movable transform origin, editable vector points and tangents, polygonal
clip paths, masks, and non-destructive union/subtract/intersect/exclude groups.

Every layer owns reorderable fill and effect stacks. Fills include solid, linear,
radial, conic, diamond, image, noise, and pattern paints. Effects include outer and
inner shadows, glows, layer/background blur, noise, and texture. Layer filters expose
blur, brightness, contrast, saturation, and hue rotation. Paint and effect blend modes
remain editable and are represented in web output where CSS supports them.

## Layout, components, and prototype behavior

Free positioning and horizontal, vertical, or grid auto layout can be combined with
independent padding, gaps, alignment, distribution, fixed/hug/fill sizing, min/max
bounds, absolute children, and start/center/end/stretch/scale constraints.

Components remain source-linked after instantiation. Master geometry, materials,
variant overrides, interactions, and timeline tracks propagate to instances. Exposed
text, number, color, boolean, enum, image, and icon properties can be overridden per
instance. Variables can bind to node paths and can also be animated on the timeline.

Prototype connections support click, double-click, hover enter/leave, focus/blur,
mouse down/up, drag, swipe, scroll, keyboard, load, delay, and variable changes. Each
connection can change/toggle a variant, mutate a variable, control the timeline, or
open a URL, with optional conditions, delays, and Smart/instant/dissolve transitions.

## Motion

Tracks cover position, size, 3D transforms, pivot, perspective, radii, vector and clip
points, opacity, strokes, filters, fill/gradient values, effects, text, numeric values,
visibility, and component variables. Keyframes are unlimited and support multiple
selection, drag, copy, paste, duplicate, delete, stretch, reverse, and stagger.

Cubic Bézier control points can be edited directly on a graph. Spring segments expose
mass, stiffness, damping, and initial velocity. Playback honors the selected FPS,
speed, work range, direction, and loop mode. Auto-key records direct canvas and
inspector edits for supported properties.

## Templates and output

The Clay, Glass, Skeuomorphic, and Adaptive homepage cards are available as complete
editable documents, including outer container, stage, ambient decoration, central
control, label, title, arrow, spacing, borders, and shadows. The double-door template
demonstrates independent panels, handles, hinges, free pivots, perspective, variants,
interactions, markers, and coordinated keyframes.

Exports include React, CSS, standalone HTML, SVG, an AI implementation handoff, and
lossless Morphiq JSON. The React output contains the interactive runtime, variables,
variant transitions, controls, and animated text/value tracks. CSS preserves materials,
responsive rules, variants, the selected motion work area, and reduced-motion behavior.
HTML and SVG are self-contained visual exports; Morphiq JSON remains the lossless format
for reopening every editable layer, interaction, component definition, and keyframe.

## Verification

The v5 checkpoint is accepted only when all of these pass:

```bash
npm run lint
npm run typecheck
npm run test:studio
npm run build
```

Structural tests also validate template hierarchy, parent/child integrity, cycle
absence, JSON normalization, node and variable interpolation, and export generation.
