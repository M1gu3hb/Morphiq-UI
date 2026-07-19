"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { motion, type Transition } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { elementBackground, elementShadow, type InteractionState, type StudioNode } from "./studio-model";
import { motionRepeatType, motionTarget, motionTimes } from "./studio-motion";

type StudioNodePreviewProps = {
  node: StudioNode;
  selected: boolean;
  previewMode: boolean;
  forcedState: InteractionState;
  onSelect: () => void;
  onChange: (patch: Partial<StudioNode>) => void;
};

const fontFamilies: Record<StudioNode["style"]["fontFamily"], string> = {
  body: "var(--font-body), sans-serif",
  display: "var(--font-display), sans-serif",
  mono: "ui-monospace, SFMono-Regular, Consolas, monospace",
};

function motionTransition(node: StudioNode): Transition {
  const repeat = node.motion.repeat < 0 ? Infinity : node.motion.repeat;
  const shared = {
    delay: node.motion.delay,
    duration: node.motion.duration,
    repeat,
    repeatType: motionRepeatType(node),
    times: motionTimes(node),
  } as const;
  if (node.motion.easing === "spring") return { ...shared, type: "spring", bounce: Math.min(0.8, node.motion.intensity / 20) };
  return { ...shared, ease: node.motion.easing };
}

function NodeContent({ node, previewMode, onChange }: Pick<StudioNodePreviewProps, "node" | "previewMode" | "onChange">): ReactNode {
  if (node.kind === "card") return <><span className="node-card-kicker"><Sparkles size={12} /> MORPHIQ</span><strong>{node.text}</strong><small>{node.secondaryText}</small></>;
  if (node.kind === "badge") return <><i className="node-status-dot" />{node.text}</>;
  if (node.kind === "input") return previewMode
    ? <label className="node-input-content"><span>{node.text}</span><input aria-label={node.text} placeholder={node.secondaryText} /></label>
    : <span className="node-input-content"><span>{node.text}</span><small>{node.secondaryText}</small></span>;
  if (node.kind === "toggle") return <><span>{node.text}</span><button aria-checked={node.checked} aria-label={node.text} className="node-toggle-track" disabled={!previewMode || node.disabled} onClick={(event) => { event.stopPropagation(); onChange({ checked: !node.checked }); }} role="switch" type="button"><i>{node.checked && <Check size={10} />}</i></button></>;
  if (node.kind === "avatar") return <span>{node.text.slice(0, 3)}</span>;
  if (node.kind === "progress") return <><span className="node-progress-copy"><b>{node.text}</b><small>{node.value}%</small></span><span className="node-progress-track"><i style={{ width: `${node.value}%` }} /></span></>;
  return node.text;
}

export function StudioNodePreview({ node, selected, previewMode, forcedState, onSelect, onChange }: StudioNodePreviewProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);
  const activeState: InteractionState = !previewMode && forcedState !== "base"
    ? forcedState
    : node.disabled ? "disabled" : pressed ? "pressed" : focused ? "focus" : hovered ? "hover" : "base";
  const state = activeState === "base" ? null : node.states[activeState];
  const visualStyle: CSSProperties = {
    color: state?.color || node.style.color,
    background: state?.fill || elementBackground(node),
    borderRadius: node.style.radius,
    borderWidth: node.style.borderWidth,
    borderColor: node.style.borderColor,
    borderStyle: node.style.borderStyle,
    boxShadow: node.kind === "text" ? "none" : elementShadow(node, activeState === "hover" ? 2 : activeState === "pressed" ? -2 : 0),
    backdropFilter: node.surface === "glass" ? `blur(${node.style.blur}px) saturate(${node.style.saturate}%)` : undefined,
    WebkitBackdropFilter: node.surface === "glass" ? `blur(${node.style.blur}px) saturate(${node.style.saturate}%)` : undefined,
    filter: state?.blur ? `blur(${state.blur}px)` : undefined,
    fontFamily: fontFamilies[node.style.fontFamily],
    fontSize: node.style.fontSize,
    fontWeight: node.style.fontWeight,
    letterSpacing: node.style.letterSpacing,
    lineHeight: node.style.lineHeight,
    opacity: (state?.opacity ?? node.style.opacity) / 100,
    padding: node.style.padding,
    textAlign: node.style.textAlign,
    textTransform: node.style.textTransform,
    transform: `translate(${state?.translateX ?? 0}px, ${state?.translateY ?? 0}px) scale(${(state?.scale ?? 100) / 100}) rotate(${node.style.rotation + (state?.rotate ?? 0)}deg) skew(${node.style.skewX}deg, ${node.style.skewY}deg)`,
    transformOrigin: node.style.transformOrigin,
    outline: activeState === "focus" ? `2px solid ${state?.outlineColor}` : "none",
    outlineOffset: activeState === "focus" ? 3 : undefined,
  };
  const target = motionTarget(node);
  const transition = motionTransition(node);
  const hasMotion = node.motion.enabled && node.motion.preset !== "none";
  const motionProps = hasMotion ? {
    animate: node.motion.trigger === "loop" || node.motion.trigger === "load" ? target : undefined,
    whileHover: node.motion.trigger === "hover" ? target : undefined,
    whileTap: node.motion.trigger === "tap" ? target : undefined,
    transition,
  } : {};

  return (
    <motion.div className="canvas-motion-wrap" style={{ perspective: 900, transformStyle: "preserve-3d" }} {...motionProps}>
      <div
        aria-disabled={node.disabled || undefined}
        className={`canvas-node canvas-node-${node.kind} ${selected && !previewMode ? "canvas-node-selected" : ""}`}
        onBlur={() => setFocused(false)}
        onClick={(event) => { event.stopPropagation(); if (!previewMode) onSelect(); }}
        onFocus={() => setFocused(true)}
        onPointerDown={() => setPressed(true)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => { setHovered(false); setPressed(false); }}
        onPointerUp={() => setPressed(false)}
        role={node.kind === "button" ? "button" : node.kind === "toggle" ? "group" : undefined}
        style={visualStyle}
        tabIndex={previewMode && !node.disabled ? 0 : -1}
      >
        <NodeContent node={node} onChange={onChange} previewMode={previewMode} />
      </div>
    </motion.div>
  );
}
