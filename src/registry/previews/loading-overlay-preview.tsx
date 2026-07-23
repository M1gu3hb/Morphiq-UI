"use client";

import { LoadingOverlay } from "@/registry/ui/loading-overlay";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Loading Overlay.
 *
 * The covered content is a real payouts panel with a real focusable button, so
 * the point of the component is demonstrable rather than described: while the
 * scrim is up the button cannot be reached with Tab, because the wrapper around
 * it is `inert`. The `disabled` state turns the overlay off, which is the only
 * way to see that `inert` and `aria-busy` are removed entirely.
 */

type LoadingOverlayVariant = "default";
type LoadingOverlaySize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): LoadingOverlayVariant {
  return (VARIANTS.includes(value) ? value : "default") as LoadingOverlayVariant;
}

function asSize(value: string): LoadingOverlaySize {
  return (SIZES.includes(value) ? value : "md") as LoadingOverlaySize;
}

type Copy = { message: string; detail: string };

/**
 * One line of copy per preview state. Every one says what is happening in
 * WORDS — the reader never has to infer the state from the scrim's colour.
 */
const COPY: Record<PreviewProps["state"], Copy> = {
  default: {
    message: "Loading payouts",
    detail: "Fetching the last 30 days from the ledger.",
  },
  focus: {
    message: "Loading payouts",
    detail: "Fetching the last 30 days from the ledger.",
  },
  loading: {
    message: "Syncing 3 of 12 payouts",
    detail: "Large batches settle last, so this can take a minute.",
  },
  error: {
    message: "Connection lost — retrying",
    detail: "Attempt 2 of 5. Nothing has been sent twice.",
  },
  disabled: {
    message: "Loading payouts",
    detail: "Fetching the last 30 days from the ledger.",
  },
};

const ROWS: ReadonlyArray<{ id: string; payee: string; amount: string; when: string }> = [
  { id: "PY-4821", payee: "Northwind Studio", amount: "$1,280.00", when: "Today, 09:14" },
  { id: "PY-4818", payee: "Aldea Type Foundry", amount: "$340.00", when: "Yesterday, 17:02" },
  { id: "PY-4802", payee: "Kettle & Co.", amount: "$96.50", when: "Mon, 12 May" },
];

export function LoadingOverlayPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[state];
  // `disabled` is the one state that shows the region NOT busy, which is what
  // proves the overlay leaves nothing behind when it goes away.
  const isLoading = state !== "disabled";

  return (
    <LoadingOverlay
      className="w-full max-w-[440px] rounded-[20px]"
      data-focus={state === "focus" ? "true" : undefined}
      detail={copy.detail}
      loading={isLoading}
      material={material}
      message={copy.message}
      size={asSize(size)}
      srMessage="Loading payouts"
      variant={asVariant(variant)}
    >
      <div className="flex flex-col gap-[12px] rounded-[20px] border border-black/10 bg-black/[0.02] p-[16px] dark:border-white/15 dark:bg-white/[0.04]">
        <div className="flex items-baseline justify-between gap-[10px]">
          <h4 className="m-0 text-[14px] leading-tight font-extrabold tracking-[-0.02em]">
            Scheduled payouts
          </h4>
          <span className="text-[11px] font-semibold tabular-nums opacity-70">3 of 12</span>
        </div>

        <ul className="m-0 flex flex-col gap-[8px] p-0 [list-style:none]">
          {ROWS.map((row) => (
            <li
              className="flex items-center justify-between gap-[10px] border-b border-black/[0.08] pb-[8px] last:border-b-0 last:pb-0 dark:border-white/10"
              key={row.id}
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[12px] font-bold">{row.payee}</span>
                <span className="text-[11px] opacity-70">
                  {row.id} · {row.when}
                </span>
              </span>
              <span className="shrink-0 text-[12px] font-bold tabular-nums">{row.amount}</span>
            </li>
          ))}
        </ul>

        {/*
          A genuinely focusable control. Tab into the preview while the overlay
          is up and focus skips straight past it — that is `inert` doing its job.
        */}
        <button
          className="self-start rounded-[10px] border border-black/20 px-[10px] py-[6px] text-[11px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:border-white/25"
          type="button"
        >
          Review all payouts
        </button>
      </div>
    </LoadingOverlay>
  );
}
