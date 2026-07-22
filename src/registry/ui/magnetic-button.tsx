"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Magnetic Button
 *
 * A native button with a proximity field: on precise pointers the surface and
 * its label follow the cursor on separate springs, then settle at the origin.
 * Material recipes and fallbacks live here, so the file remains copy-and-own.
 */

const magneticButtonVariants = cva(
  [
    "relative inline-flex shrink-0 appearance-none items-center justify-center overflow-hidden",
    "cursor-pointer select-none gap-[8px] border font-extrabold tracking-[-0.01em]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "disabled:cursor-not-allowed disabled:opacity-55",
    "motion-reduce:transition-none",
    "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace]",
    "forced-colors:text-[ButtonText] forced-colors:shadow-none",
    "forced-colors:focus-visible:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "border-[rgba(111,41,28,0.42)] bg-[var(--mq-body,#ff9077)] text-[color:var(--mq-text,#4a1d13)]",
          "[--mq-body:#ff9077] [--mq-text:#4a1d13] [--mq-edge:#c9482f] [--mq-ring:#171817]",
          "transition-[box-shadow,opacity] duration-200 ease-out",
          "shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-3px_5px_rgba(0,0,0,0.12),0_5px_0_var(--mq-edge,#c9482f),0_12px_22px_rgba(75,40,31,0.2)]",
          "hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.48),inset_0_-3px_5px_rgba(0,0,0,0.1),0_7px_0_var(--mq-edge,#c9482f),0_17px_28px_rgba(75,40,31,0.25)]",
          "active:shadow-[inset_0_3px_7px_rgba(0,0,0,0.2),0_2px_0_var(--mq-edge,#c9482f),0_5px_10px_rgba(75,40,31,0.16)]",
        ].join(" "),
        glass: [
          "border-[rgba(255,255,255,0.48)] bg-[var(--mq-body,rgba(22,24,23,0.92))] text-[color:var(--mq-text,#ffffff)]",
          "[--mq-body:rgba(22,24,23,0.92)] [--mq-text:#ffffff] [--mq-ring:#171817]",
          "backdrop-blur-[16px] backdrop-saturate-[165%]",
          "transition-[box-shadow,opacity] duration-200 ease-out",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.26),0_8px_24px_rgba(24,20,40,0.25)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.54),inset_0_-1px_0_rgba(0,0,0,0.22),0_13px_32px_rgba(24,20,40,0.32)]",
          "active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.3),0_4px_12px_rgba(24,20,40,0.2)]",
        ].join(" "),
        skeuo: [
          "border-[#97938a] bg-[var(--mq-body,#e6e3da)] text-[color:var(--mq-text,#23231f)]",
          "[--mq-body:#e6e3da] [--mq-text:#23231f] [--mq-edge:#a8a49b] [--mq-ring:#171817]",
          "transition-[box-shadow,filter,opacity] duration-200 ease-out",
          "shadow-[inset_0_2px_3px_rgba(255,255,255,0.84),inset_0_-3px_5px_rgba(0,0,0,0.15),0_4px_0_var(--mq-edge,#a8a49b),0_10px_18px_rgba(38,36,31,0.26)]",
          "hover:brightness-[1.04] hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.92),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_23px_rgba(38,36,31,0.3)]",
          "active:brightness-100 active:shadow-[inset_0_3px_7px_rgba(0,0,0,0.24),0_1px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.2)]",
        ].join(" "),
        adaptive: [
          "border-[#171817] bg-[var(--mq-body,#171817)] text-[color:var(--mq-text,#f6f5f1)]",
          "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-ring:#171817]",
          "transition-[box-shadow,opacity] duration-200 ease-out",
          "shadow-[0_1px_2px_rgba(20,20,18,0.16),0_8px_18px_rgba(20,20,18,0.14)]",
          "hover:shadow-[0_2px_4px_rgba(20,20,18,0.18),0_13px_25px_rgba(20,20,18,0.19)]",
          "active:shadow-[0_1px_2px_rgba(20,20,18,0.14),0_4px_10px_rgba(20,20,18,0.11)]",
          "dark:border-[#d4d1c9] dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-ring:#f1efe9]",
          "pointer-coarse:min-h-[48px]",
        ].join(" "),
      },
      variant: { default: "" },
      size: {
        sm: "h-[36px] rounded-[12px] px-[14px] text-[12px]/[1]",
        md: "h-[44px] rounded-[15px] px-[20px] text-[13px]/[1]",
        lg: "h-[52px] rounded-[18px] px-[26px] text-[14px]/[1]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

export type MagneticButtonProps = Omit<React.ComponentPropsWithRef<typeof motion.button>, "color"> &
  VariantProps<typeof magneticButtonVariants> & {
    /** Maximum surface travel in CSS pixels. */
    strength?: number;
  };

export function MagneticButton({
  children,
  className,
  disabled = false,
  material = "clay",
  ref,
  size = "md",
  strength = 11,
  style,
  type = "button",
  variant = "default",
  ...props
}: MagneticButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const x = useSpring(0, { stiffness: 285, damping: 23, mass: 0.52 });
  const y = useSpring(0, { stiffness: 285, damping: 23, mass: 0.52 });
  const labelX = useSpring(0, { stiffness: 330, damping: 24, mass: 0.44 });
  const labelY = useSpring(0, { stiffness: 330, damping: 24, mass: 0.44 });

  const reset = React.useCallback(() => {
    x.set(0);
    y.set(0);
    labelX.set(0);
    labelY.set(0);
  }, [labelX, labelY, x, y]);

  const setButtonRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  React.useEffect(() => {
    if (disabled || shouldReduceMotion) {
      reset();
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const node = buttonRef.current;
      if (!node || event.pointerType !== "mouse") {
        reset();
        return;
      }

      const rect = node.getBoundingClientRect();
      const distanceX = event.clientX - (rect.left + rect.width / 2);
      const distanceY = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(distanceX, distanceY);
      const radius = Math.max(rect.width, rect.height) * 1.25;

      if (distance >= radius) {
        reset();
        return;
      }

      const proximity = 1 - distance / radius;
      const pullX = Math.max(-strength, Math.min(strength, distanceX * 0.24 * proximity));
      const pullY = Math.max(-strength, Math.min(strength, distanceY * 0.24 * proximity));
      x.set(pullX);
      y.set(pullY);
      labelX.set(pullX * 0.34);
      labelY.set(pullY * 0.34);
    };

    const handlePointerLeave = () => reset();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", handlePointerLeave);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handlePointerLeave);
      reset();
    };
  }, [disabled, labelX, labelY, reset, shouldReduceMotion, strength, x, y]);

  return (
    <motion.button
      {...props}
      className={cn(magneticButtonVariants({ material, size, variant }), className)}
      data-material={material}
      disabled={disabled}
      ref={setButtonRef}
      style={{ ...style, x, y }}
      type={type}
    >
      <motion.span className="relative z-[1] inline-flex items-center gap-[8px]" style={{ x: labelX, y: labelY }}>
        {children}
      </motion.span>
    </motion.button>
  );
}

export { magneticButtonVariants };
