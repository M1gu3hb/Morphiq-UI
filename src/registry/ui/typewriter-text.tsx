"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Typewriter Text
 *
 * A tiny timeout-driven state machine types and deletes complete phrases. The
 * visual character stream is aria-hidden; assistive technology receives the
 * whole current phrase, avoiding one live-region announcement per keystroke.
 */

const TYPEWRITER_CURSOR_KEYFRAMES =
  "@keyframes mq-typewriter-cursor{0%,46%{opacity:1}47%,100%{opacity:0}}";

function TypewriterCursorKeyframes() {
  return (
    <style href="mq-typewriter-cursor" precedence="medium">
      {TYPEWRITER_CURSOR_KEYFRAMES}
    </style>
  );
}

type TypewriterPhase = "typing" | "deleting";

type TypewriterState = {
  phraseIndex: number;
  characterIndex: number;
  phase: TypewriterPhase;
};

export type TypewriterTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  phrases: readonly string[];
  loop?: boolean;
  typingDelay?: number;
  deletingDelay?: number;
  pauseDelay?: number;
  announce?: boolean;
  showCursor?: boolean;
};

export function TypewriterText({
  announce = true,
  className,
  deletingDelay = 34,
  loop = true,
  pauseDelay = 1100,
  phrases,
  showCursor = true,
  typingDelay = 64,
  ...props
}: TypewriterTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const safePhrases = React.useMemo(() => phrases.filter((phrase) => phrase.length > 0), [phrases]);
  const [state, setState] = React.useState<TypewriterState>({
    phraseIndex: 0,
    characterIndex: 0,
    phase: "typing",
  });

  const phraseCount = safePhrases.length;
  const phraseIndex = phraseCount > 0 ? state.phraseIndex % phraseCount : 0;
  const currentPhrase = safePhrases[phraseIndex] ?? "";
  const visibleCharacterCount = Math.min(state.characterIndex, currentPhrase.length);
  const visibleText = shouldReduceMotion
    ? currentPhrase
    : currentPhrase.slice(0, visibleCharacterCount);
  const longestPhrase = safePhrases.reduce(
    (longest, phrase) => (phrase.length > longest.length ? phrase : longest),
    "",
  );

  React.useEffect(() => {
    if (shouldReduceMotion || phraseCount === 0) return undefined;

    let delay: number;
    let advance: () => void;

    if (state.phase === "typing" && state.characterIndex < currentPhrase.length) {
      delay = Math.max(16, typingDelay);
      advance = () =>
        setState((current) => ({
          ...current,
          characterIndex: current.characterIndex + 1,
        }));
    } else if (state.phase === "typing") {
      if (!loop && phraseIndex === phraseCount - 1) return undefined;
      delay = Math.max(250, pauseDelay);
      advance = () => setState((current) => ({ ...current, phase: "deleting" }));
    } else if (state.characterIndex > 0) {
      delay = Math.max(12, deletingDelay);
      advance = () =>
        setState((current) => ({
          ...current,
          characterIndex: Math.max(0, current.characterIndex - 1),
        }));
    } else {
      delay = 180;
      advance = () =>
        setState((current) => ({
          phraseIndex: (current.phraseIndex + 1) % phraseCount,
          characterIndex: 0,
          phase: "typing",
        }));
    }

    const timeout = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timeout);
  }, [
    currentPhrase.length,
    deletingDelay,
    loop,
    pauseDelay,
    phraseCount,
    phraseIndex,
    shouldReduceMotion,
    state.characterIndex,
    state.phase,
    typingDelay,
  ]);

  return (
    <>
      <TypewriterCursorKeyframes />
      <span
        {...props}
        className={cn(
          "relative inline-grid text-inherit forced-colors:text-[CanvasText]",
          className,
        )}
      >
        <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre">
          {longestPhrase}
          {showCursor ? " " : null}
        </span>
        <span
          aria-hidden="true"
          className="col-start-1 row-start-1 inline-flex items-baseline whitespace-pre"
        >
          {visibleText}
          {showCursor ? (
            <span
              className={cn(
                "ml-[0.08em] inline-block h-[0.9em] w-[0.075em] translate-y-[0.08em] bg-current",
                "animate-[mq-typewriter-cursor_0.82s_steps(1,end)_infinite]",
                "motion-reduce:animate-none forced-colors:bg-[CanvasText]",
              )}
            />
          ) : null}
        </span>
        <span aria-atomic="true" aria-live={announce ? "polite" : "off"} className="sr-only">
          {currentPhrase}
        </span>
      </span>
    </>
  );
}
