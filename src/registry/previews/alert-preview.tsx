"use client";

import { useState } from "react";
import { Alert } from "@/registry/ui/alert";
import { Button } from "@/registry/ui/button";
import type { PreviewProps } from "@/registry/schema";

/** Documentation preview for the Alert. */

type AlertTone = "neutral" | "info" | "success" | "warning" | "danger";
type AlertSize = "sm" | "md" | "lg";

const TONES: readonly string[] = ["neutral", "info", "success", "warning", "danger"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const COPY: Record<AlertTone, { title: string; description: string; action: string }> = {
  neutral: {
    title: "Workspace note",
    description: "Design tokens were refreshed. Existing components keep their current values.",
    action: "Read note",
  },
  info: {
    title: "New export format",
    description: "Projects can now export typed variables alongside the generated component code.",
    action: "See details",
  },
  success: {
    title: "Deployment complete",
    description: "The production build is live and all health checks are passing.",
    action: "View release",
  },
  warning: {
    title: "Review required",
    description: "Two contrast tokens changed and need approval before the next release.",
    action: "Review changes",
  },
  danger: {
    title: "Build blocked",
    description: "The registry contract failed. Resolve the missing dependency before deploying.",
    action: "Open report",
  },
};

function asTone(value: string): AlertTone {
  return (TONES.includes(value) ? value : "neutral") as AlertTone;
}

function asSize(value: string): AlertSize {
  return (SIZES.includes(value) ? value : "md") as AlertSize;
}

export function AlertPreview({ material, variant, size, state }: PreviewProps) {
  const [actionUsed, setActionUsed] = useState(false);
  const tone = asTone(variant);
  const copy = COPY[tone];
  const isBlocked = state === "disabled" || state === "loading";

  return (
    <Alert
      action={
        <Button
          disabled={isBlocked}
          intent="secondary"
          material={material}
          onClick={() => setActionUsed(true)}
          size="sm"
        >
          {actionUsed ? "Opened" : copy.action}
        </Button>
      }
      aria-busy={state === "loading" || undefined}
      aria-disabled={state === "disabled" || undefined}
      data-focus={state === "focus" ? "true" : undefined}
      data-state={state === "loading" || state === "disabled" ? state : "idle"}
      material={material}
      size={asSize(size)}
      title={state === "loading" ? `Updating: ${copy.title}` : copy.title}
      tone={tone}
    >
      <p>{copy.description}</p>
    </Alert>
  );
}
