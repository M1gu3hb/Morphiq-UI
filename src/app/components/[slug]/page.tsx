import { readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentDetail } from "@/components/registry/component-detail";
import { registry } from "@/registry";
import { findRegistryEntry } from "@/registry/schema";

/**
 * Detail route for a registry component.
 *
 * Server Component on purpose: it reads the component's real source file from
 * disk at build time so the page can never show a transcription that has
 * drifted from the shipped code. Everything interactive below it lives in the
 * `ComponentDetail` client island.
 */

// Every slug is known at build time, so anything else is a 404 rather than an
// on-demand render.
export const dynamicParams = false;

export function generateStaticParams() {
  return registry.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = findRegistryEntry(registry, slug);
  if (!entry) return {};

  return {
    title: entry.name,
    description: entry.description,
  };
}

/**
 * Every registry source file lives under this directory. The prefix is a
 * literal segment in the `join` below on purpose: it keeps Turbopack's file
 * tracing scoped to `src/registry` instead of dragging the entire project into
 * the build output, which is what happens when `process.cwd()` is joined with a
 * fully dynamic path.
 */
const REGISTRY_DIR = "src/registry";

/**
 * Reads a registry source file.
 *
 * `sourcePath` only ever comes from our own registry, but this still validates
 * it: the read is reached through a route parameter, and a future registry
 * entry should not be able to turn a typo into an arbitrary file read.
 */
function readSource(sourcePath: string): string {
  if (!sourcePath.startsWith(`${REGISTRY_DIR}/`)) {
    throw new Error(`Registry sourcePath must live under ${REGISTRY_DIR}/: ${sourcePath}`);
  }

  const registryRoot = join(process.cwd(), REGISTRY_DIR);
  const absolute = resolve(join(registryRoot, sourcePath.slice(REGISTRY_DIR.length + 1)));
  if (!absolute.startsWith(registryRoot + sep)) {
    throw new Error(`Registry sourcePath escapes ${REGISTRY_DIR}/: ${sourcePath}`);
  }

  return readFileSync(absolute, "utf8");
}

export default async function ComponentDetailPage({
  params,
}: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const entry = findRegistryEntry(registry, slug);
  if (!entry) notFound();

  return <ComponentDetail slug={entry.slug} source={readSource(entry.sourcePath)} />;
}
