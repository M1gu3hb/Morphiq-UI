"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/ui/accordion";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Accordion.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * `loading` and `error` fall through to the default render: a disclosure list
 * has neither state, and inventing one would be documenting something the
 * component cannot actually do.
 */

type AccordionVariant = "default" | "separated" | "flush";
type AccordionSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "separated", "flush"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): AccordionVariant {
  return (VARIANTS.includes(value) ? value : "default") as AccordionVariant;
}

function asSize(value: string): AccordionSize {
  return (SIZES.includes(value) ? value : "md") as AccordionSize;
}

type Row = { value: string; question: string; answer: string };

/** Copy differs per material so each recipe is shown doing real work. */
const ROWS: Record<StyleSlug, Row[]> = {
  clay: [
    { value: "deploy", question: "How do rollouts work?", answer: "Every build goes to 12% of traffic first and promotes itself after thirty quiet minutes." },
    { value: "rollback", question: "Can I roll back?", answer: "Any checkpoint from the last thirty days restores in one step." },
    { value: "limits", question: "What are the limits?", answer: "Twenty concurrent builds per workspace, raised on request." },
  ],
  glass: [
    { value: "focus", question: "What does focus mode hold?", answer: "Notifications pause and the room stops surfacing join requests until you end the block." },
    { value: "guests", question: "Can guests join?", answer: "Anyone with the link can watch; only members can edit the surface." },
    { value: "notes", question: "Where do notes go?", answer: "Shared notes sync live and stay attached to the session afterwards." },
  ],
  skeuo: [
    { value: "gain", question: "How is input gain staged?", answer: "Set the preamp so peaks land near -6 dB, leaving the limiter untouched on most takes." },
    { value: "phantom", question: "When is phantom power needed?", answer: "Condenser microphones need it; ribbons can be damaged by it." },
    { value: "routing", question: "How do I route a bus?", answer: "Any input can feed any bus, and buses chain up to four deep." },
  ],
  adaptive: [
    { value: "billing", question: "When am I billed?", answer: "Monthly in arrears, on the third, for the seats in use that period." },
    { value: "seats", question: "How are seats counted?", answer: "A seat is any member who signed in during the billing period." },
    { value: "invoices", question: "Where are invoices sent?", answer: "To the billing email, with a copy in the workspace archive." },
  ],
};

export function AccordionPreview({ material, variant, size, state }: PreviewProps) {
  const rows = ROWS[material];
  const isDisabled = state === "disabled";

  return (
    <Accordion
      className="w-[min(360px,100%)]"
      collapsible
      // One panel starts open so a reader sees the expanded recipe first; it
      // stays interactive, so opening and closing in the docs is real.
      defaultValue={rows[0].value}
      material={material}
      size={asSize(size)}
      type="single"
      variant={asVariant(variant)}
    >
      {rows.map((row, index) => (
        <AccordionItem disabled={isDisabled} key={row.value} value={row.value}>
          <AccordionTrigger
            data-focus={state === "focus" && index === 0 ? "true" : undefined}
          >
            {row.question}
          </AccordionTrigger>
          <AccordionContent>{row.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
