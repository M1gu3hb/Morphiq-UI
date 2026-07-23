"use client";

import { AtSign, Briefcase, Code2, Globe, Palette } from "lucide-react";
import { ProfileCard } from "@/registry/ui/profile-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Profile Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it. Icons and demo photos are supplied here, not baked into
 * the component.
 */

type ProfileVariant = "default";
type ProfileSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ProfileVariant {
  return (VARIANTS.includes(value) ? value : "default") as ProfileVariant;
}

function asSize(value: string): ProfileSize {
  return (SIZES.includes(value) ? value : "md") as ProfileSize;
}

type Persona = {
  name: string;
  role: string;
  bio: string;
  seed: string;
  alt: string;
};

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, Persona> = {
  clay: {
    name: "Ana Reyes",
    role: "Product Designer",
    bio: "Shapes tactile interfaces and keeps the seams between motion and material honest.",
    seed: "ana-reyes",
    alt: "Portrait of Ana Reyes",
  },
  glass: {
    name: "Mara Ilić",
    role: "Frontend Engineer",
    bio: "Builds translucent, layered UIs that stay legible over any backdrop they float on.",
    seed: "mara-ilic",
    alt: "Portrait of Mara Ilić",
  },
  skeuo: {
    name: "Theo Nakamura",
    role: "Audio Software Lead",
    bio: "Models physical controls in software so a fader still feels like a fader under the hand.",
    seed: "theo-nakamura",
    alt: "Portrait of Theo Nakamura",
  },
  adaptive: {
    name: "Priya Nair",
    role: "Design Systems Manager",
    bio: "Tunes one palette to follow the color scheme and one rhythm to follow the pointer.",
    seed: "priya-nair",
    alt: "Portrait of Priya Nair",
  },
};

export function ProfileCardPreview({ material, variant, size, state }: PreviewProps) {
  const persona = COPY[material];
  const isDisabled = state === "disabled";

  const socials = [
    { label: `${persona.name} on GitHub`, href: "#github", icon: <Code2 aria-hidden="true" /> },
    { label: `${persona.name} on LinkedIn`, href: "#linkedin", icon: <Briefcase aria-hidden="true" /> },
    { label: `${persona.name} on X`, href: "#x", icon: <AtSign aria-hidden="true" /> },
    { label: `${persona.name} on Dribbble`, href: "#dribbble", icon: <Palette aria-hidden="true" /> },
    { label: `${persona.name}'s website`, href: "#site", icon: <Globe aria-hidden="true" /> },
  ];

  return (
    <ProfileCard
      className="w-[min(360px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      material={material}
      variant={asVariant(variant)}
      size={asSize(size)}
      name={persona.name}
      role={persona.role}
      bio={persona.bio}
      avatarSrc={`https://picsum.photos/seed/${persona.seed}/128/128`}
      avatarAlt={persona.alt}
      socials={socials}
      action={{
        label: "Follow",
        href: isDisabled ? undefined : "#follow",
        disabled: isDisabled,
      }}
    />
  );
}
