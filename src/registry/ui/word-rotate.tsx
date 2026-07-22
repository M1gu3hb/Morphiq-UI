"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Word Rotate
 *
 * Rotates short words through a reserved-width line box so surrounding copy
 * never jumps. Motion owns only presentation; a separate text node owns the
 * accessibility tree.
 */

const WORD_VARIANTS: Variants = {
  enter: { opacity: 0, y: "0.72em", rotateX: -55, filter: "blur(5px)" },
  center: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: "-0.62em",
    rotateX: 48,
    filter: "blur(5px)",
    transition: { duration: 0.24, ease: [0.4, 0, 1, 1] },
  },
};

export type WordRotateProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  words: readonly string[];
  duration?: number;
  announce?: boolean;
};

export function WordRotate({
  "aria-label": ariaLabel,
  announce = false,
  className,
  duration = 2200,
  words,
  ...props
}: WordRotateProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = shouldReduceMotion ?? false;
  const normalizedWords = React.useMemo(() => words.filter((word) => word.length > 0), [words]);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduced || normalizedWords.length < 2) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % normalizedWords.length),
      Math.max(650, duration),
    );

    return () => window.clearInterval(timer);
  }, [duration, normalizedWords.length, reduced]);

  const displayIndex = reduced ? 0 : index % Math.max(1, normalizedWords.length);
  const currentWord = normalizedWords[displayIndex] ?? "";
  const widestWord = normalizedWords.reduce(
    (widest, word) => (Array.from(word).length > Array.from(widest).length ? word : widest),
    "",
  );

  return (
    <span
      {...props}
      className={cn(
        "relative inline-grid align-baseline text-inherit forced-colors:text-[CanvasText]",
        className,
      )}
      style={{ perspective: "6em", ...props.style }}
    >
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre">
        {widestWord}
      </span>
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate="center"
          aria-hidden="true"
          className={cn(
            "col-start-1 row-start-1 whitespace-pre [transform-origin:50%_50%]",
            "motion-reduce:![transform:none] motion-reduce:!opacity-100 motion-reduce:![filter:none]",
            "forced-colors:![transform:none] forced-colors:!opacity-100 forced-colors:![filter:none]",
          )}
          exit="exit"
          initial="enter"
          key={`${displayIndex}-${currentWord}`}
          variants={WORD_VARIANTS}
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
      <span
        aria-atomic="true"
        aria-label={ariaLabel}
        aria-live={announce ? "polite" : "off"}
        className="sr-only"
      >
        {currentWord}
      </span>
    </span>
  );
}
