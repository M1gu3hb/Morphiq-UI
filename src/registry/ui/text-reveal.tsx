"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Text Reveal
 *
 * Words or Unicode characters enter with a staggered fade, blur and vertical
 * lift when the line reaches the viewport. A separate plain-text copy owns the
 * accessibility tree so segmentation never changes reading order.
 */

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: "0.58em", filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
};

export type TextRevealMode = "word" | "letter";

export type TextRevealProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  by?: TextRevealMode;
  once?: boolean;
  stagger?: number;
};

function splitText(text: string, by: TextRevealMode) {
  return by === "letter" ? Array.from(text) : text.split(/(\s+)/);
}

export function TextReveal({
  "aria-label": ariaLabel,
  by = "word",
  children,
  className,
  once = true,
  stagger = 0.055,
  ...props
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const segments = splitText(children, by);
  const containerVariants = React.useMemo<Variants>(
    () => ({
      hidden: {},
      visible: {
        transition: { staggerChildren: Math.max(0, stagger) },
      },
    }),
    [stagger],
  );

  return (
    <span
      {...props}
      className={cn(
        "relative inline-block text-inherit forced-colors:text-[CanvasText]",
        className,
      )}
    >
      <span className="sr-only">{ariaLabel ?? children}</span>
      <motion.span
        aria-hidden="true"
        className="inline-flex flex-wrap whitespace-pre-wrap"
        initial={shouldReduceMotion ? false : "hidden"}
        variants={containerVariants}
        viewport={{ once, amount: 0.45 }}
        whileInView={shouldReduceMotion ? undefined : "visible"}
      >
        {segments.map((segment, index) => (
          <motion.span
            className={cn(
              "inline-block whitespace-pre",
              "motion-reduce:![transform:none] motion-reduce:!opacity-100 motion-reduce:![filter:none]",
              "forced-colors:![transform:none] forced-colors:!opacity-100 forced-colors:![filter:none]",
            )}
            key={`${index}-${segment}`}
            variants={ITEM_VARIANTS}
          >
            {segment}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
}
