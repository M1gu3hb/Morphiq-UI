/**
 * The component registry — public entry point.
 *
 * **Adding a component does not touch this file, or any other shared file.**
 * A component ships three files of its own and nothing else:
 *
 *   src/registry/entries/<slug>.ts      the RegistryEntry (file name = slug)
 *   src/registry/ui/<slug>.tsx          the distributable component
 *   src/registry/previews/<slug>-preview.tsx   its documentation preview
 *
 * `scripts/gen-registry.mjs` discovers `entries/*.ts` and assembles
 * `./generated`, which is rebuilt before dev, build, typecheck and the gate and
 * is deliberately not committed. That is the whole point of the indirection:
 * while the array lived here, every author adding a component had to edit the
 * same file, so two of them working in parallel always conflicted.
 *
 * Consumers keep importing `@/registry` — the catalog, `/components/[slug]` and
 * `scripts/verify-registry.mjs` are unaffected by how the array is built.
 */
export { registry } from "@/registry/generated";

export { findRegistryEntry } from "@/registry/schema";
export type {
  PreviewProps,
  PreviewState,
  RegistryCategory,
  RegistryDependencies,
  RegistryEntry,
  RegistryOption,
} from "@/registry/schema";
