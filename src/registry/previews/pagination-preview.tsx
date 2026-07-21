"use client";

import * as React from "react";
import { Pagination } from "@/registry/ui/pagination";
import type { PreviewProps } from "@/registry/schema";

/** Interactive ten-page example with both ellipsis and boundary states. */

type PaginationVariant = "default" | "solid";
type PaginationSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "solid"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): PaginationVariant {
  return (VARIANTS.includes(value) ? value : "default") as PaginationVariant;
}

function asSize(value: string): PaginationSize {
  return (SIZES.includes(value) ? value : "md") as PaginationSize;
}

type PaginationSpecimenProps = PreviewProps & {
  resolvedSize: PaginationSize;
  resolvedVariant: PaginationVariant;
};

function PaginationSpecimen({
  material,
  resolvedSize,
  resolvedVariant,
  state,
}: PaginationSpecimenProps) {
  const [page, setPage] = React.useState(state === "disabled" ? 1 : 4);

  return (
    <Pagination
      aria-busy={state === "loading" || undefined}
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      material={material}
      onPageChange={setPage}
      page={page}
      pageCount={10}
      size={resolvedSize}
      variant={resolvedVariant}
    />
  );
}

export function PaginationPreview(props: PreviewProps) {
  const resolvedSize = asSize(props.size);
  const resolvedVariant = asVariant(props.variant);

  return (
    <div className="max-w-full overflow-x-auto py-[4px]" data-pagination-preview="">
      <PaginationSpecimen
        {...props}
        key={`${props.state}:${resolvedSize}:${resolvedVariant}`}
        resolvedSize={resolvedSize}
        resolvedVariant={resolvedVariant}
      />
    </div>
  );
}
