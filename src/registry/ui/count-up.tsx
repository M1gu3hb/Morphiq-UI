"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type CountUpProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  value: number;
  from?: number;
  duration?: number;
  decimals?: number;
  locale?: string;
  prefix?: string;
  suffix?: string;
  animate?: boolean;
  startWhenVisible?: boolean;
};

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

export function CountUp({
  animate = true,
  className,
  decimals = 0,
  duration = 900,
  from = 0,
  locale,
  prefix = "",
  ref,
  startWhenVisible = true,
  suffix = "",
  value,
  ...props
}: CountUpProps) {
  const rootRef = React.useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = React.useState(!startWhenVisible);
  const [display, setDisplay] = React.useState(animate ? from : value);
  const safeDecimals = Math.max(0, Math.min(6, Math.trunc(decimals)));
  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: safeDecimals,
        maximumFractionDigits: safeDecimals,
      }),
    [locale, safeDecimals],
  );
  const format = React.useCallback(
    (number: number) => `${prefix}${formatter.format(number)}${suffix}`,
    [formatter, prefix, suffix],
  );
  const finalText = format(value);

  React.useEffect(() => {
    if (!startWhenVisible) {
      const frame = window.requestAnimationFrame(() => setStarted(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const node = rootRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [startWhenVisible]);

  React.useEffect(() => {
    let frame = 0;
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame = window.requestAnimationFrame(() => setDisplay(value));
      return () => window.cancelAnimationFrame(frame);
    }
    if (!started) return undefined;

    const startedAt = performance.now();
    const safeDuration = Math.max(120, duration);
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / safeDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [animate, duration, from, started, value]);

  return (
    <span
      {...props}
      className={cn(
        "relative inline-grid tabular-nums text-inherit forced-colors:text-[CanvasText]",
        className,
      )}
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
    >
      <span className="sr-only">{finalText}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre">
        {finalText}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1 whitespace-pre motion-reduce:hidden">
        {format(display)}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1 hidden whitespace-pre motion-reduce:inline forced-colors:inline">
        {finalText}
      </span>
    </span>
  );
}
