"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type AnimatedBeamVariant = "curved" | "straight";
type AnimatedBeamSize = "sm" | "md" | "lg";

const BEAM_KEYFRAMES = `@keyframes mq-beam-flow{to{stroke-dashoffset:-100}}`;
const PATH_WIDTH = { sm: 1.5, md: 2.25, lg: 3 } as const;

function AnimatedBeamKeyframes() {
  return (
    <style href="mq-beam-flow" precedence="medium">
      {BEAM_KEYFRAMES}
    </style>
  );
}

type BeamGeometry = {
  width: number;
  height: number;
  d: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

const INITIAL_GEOMETRY: BeamGeometry = {
  width: 1,
  height: 1,
  d: "M 0,0 L 1,1",
  startX: 0,
  startY: 0,
  endX: 1,
  endY: 1,
};

export type AnimatedBeamProps = Omit<React.ComponentPropsWithRef<"svg">, "children"> & {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  material?: MaterialSlug;
  variant?: AnimatedBeamVariant;
  size?: AnimatedBeamSize;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
};

export function AnimatedBeam({
  className,
  containerRef,
  curvature = 54,
  delay = 0,
  duration = 3.8,
  endXOffset = 0,
  endYOffset = 0,
  fromRef,
  gradientFrom = "#a8ff78",
  gradientTo = "#7ddcff",
  material = "adaptive",
  pathColor = "rgba(174,184,210,0.28)",
  reverse = false,
  size = "md",
  startXOffset = 0,
  startYOffset = 0,
  style,
  toRef,
  variant = "curved",
  ...props
}: AnimatedBeamProps) {
  const gradientId = React.useId().replaceAll(":", "");
  const [geometry, setGeometry] = React.useState<BeamGeometry>(INITIAL_GEOMETRY);

  React.useEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (!container || !from || !to) return undefined;

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const containerRect = container.getBoundingClientRect();
        const fromRect = from.getBoundingClientRect();
        const toRect = to.getBoundingClientRect();
        const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
        const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
        const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
        const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2 - curvature;
        const d =
          variant === "straight"
            ? `M ${startX},${startY} L ${endX},${endY}`
            : `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`;

        setGeometry((current) => {
          const next = {
            width: Math.max(1, containerRect.width),
            height: Math.max(1, containerRect.height),
            d,
            startX,
            startY,
            endX,
            endY,
          };
          return current.d === next.d &&
            current.width === next.width &&
            current.height === next.height
            ? current
            : next;
        });
      });
    };

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(from);
    observer.observe(to);
    window.addEventListener("resize", update);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [
    containerRef,
    curvature,
    endXOffset,
    endYOffset,
    fromRef,
    startXOffset,
    startYOffset,
    toRef,
    variant,
  ]);

  return (
    <svg
      {...props}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 size-full overflow-visible",
        "forced-colors:text-[CanvasText]",
        className,
      )}
      data-material={material}
      fill="none"
      style={style}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
    >
      <AnimatedBeamKeyframes />
      <path
        className="forced-colors:stroke-[CanvasText]"
        d={geometry.d}
        pathLength={100}
        stroke={pathColor}
        strokeLinecap="round"
        strokeWidth={PATH_WIDTH[size]}
      />
      <path
        className={cn(
          "animate-[mq-beam-flow_3.8s_linear_infinite] [will-change:stroke-dashoffset]",
          reverse && "[animation-direction:reverse]",
          "motion-reduce:animate-none forced-colors:animate-none forced-colors:stroke-[CanvasText]",
        )}
        d={geometry.d}
        pathLength={100}
        stroke={`url(#${gradientId})`}
        strokeDasharray="18 82"
        strokeLinecap="round"
        strokeWidth={PATH_WIDTH[size] + 1}
        style={{
          animationDelay: `${-Math.abs(delay)}s`,
          animationDuration: `${Math.max(1.2, duration)}s`,
          strokeDashoffset: 0,
        }}
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1={geometry.startX}
          x2={geometry.endX}
          y1={geometry.startY}
          y2={geometry.endY}
        >
          <stop offset="0%" stopColor={gradientFrom} stopOpacity="0" />
          <stop offset="42%" stopColor={gradientFrom} />
          <stop offset="68%" stopColor={gradientTo} />
          <stop offset="100%" stopColor={gradientTo} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
