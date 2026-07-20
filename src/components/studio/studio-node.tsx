"use client";

import { useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { ArrowUpRight, Check, Heart, Play, Plus, Sparkles } from "lucide-react";
import { tr, type Locale } from "@/lib/i18n";
import {
  clipPathCss,
  cornerRadiusCss,
  effectShadowCss,
  nodeBackdropFilter,
  nodeBackground,
  nodeBoxShadow,
  nodeFilter,
  type StudioNode,
  type TransitionType,
  type TriggerType,
} from "./studio-model";

type StudioNodePreviewProps = {
  children?: ReactNode;
  locale: Locale;
  node: StudioNode;
  operandNodes?: StudioNode[];
  selected: boolean;
  previewMode: boolean;
  vectorEditMode?: boolean;
  smartDuration?: number;
  smartEasing?: string;
  transitionType?: TransitionType;
  onSelect: (event: MouseEvent | PointerEvent) => void;
  onChange: (patch: Partial<StudioNode>) => void;
  onTrigger: (trigger: TriggerType) => boolean;
  onVectorPointChange?: (index: number, point: { x: number; y: number }) => void;
  onVectorHandleChange?: (index: number, handle: "handleIn" | "handleOut", point: { x: number; y: number }) => void;
  onClipPointChange?: (index: number, point: { x: number; y: number }) => void;
  onPivotChange?: (point: { x: number; y: number }) => void;
};

const fontFamilies: Record<StudioNode["style"]["typography"]["family"], string> = {
  body: "var(--font-body), Manrope, sans-serif",
  display: "var(--font-display), 'Bricolage Grotesque', sans-serif",
  mono: "ui-monospace, SFMono-Regular, Consolas, monospace",
};

function shapePoints(node: StudioNode) {
  const sides = Math.max(3, node.geometry.polygonSides);
  const isStar = node.kind === "star";
  const count = isStar ? sides * 2 : sides;
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
    const radius = isStar && index % 2 ? node.geometry.starRatio / 2 : 48;
    return `${50 + Math.cos(angle) * radius},${50 + Math.sin(angle) * radius}`;
  }).join(" ");
}

function vectorPath(node: StudioNode) {
  const points = node.geometry.vectorPoints;
  if (!points.length) return "";
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (previous.handleOut || current.handleIn) {
      const a = previous.handleOut ?? previous;
      const b = current.handleIn ?? current;
      path += ` C ${a.x} ${a.y}, ${b.x} ${b.y}, ${current.x} ${current.y}`;
    } else path += ` L ${current.x} ${current.y}`;
  }
  if (node.geometry.closed) path += " Z";
  return path;
}

function IconGlyph({ node }: { node: StudioNode }) {
  if (node.svgPath.trim()) return <svg aria-hidden="true" height="60%" viewBox={node.svgViewBox || "0 0 24 24"} width="60%"><path d={node.svgPath} fill="currentColor" /></svg>;
  if (node.icon === "play") return <Play size="55%" fill="currentColor" />;
  if (node.icon === "heart") return <Heart size="55%" />;
  if (node.icon === "sparkles") return <Sparkles size="55%" />;
  if (node.icon === "plus") return <Plus size="55%" />;
  if (node.icon === "check") return <Check size="55%" />;
  return <ArrowUpRight size="55%" />;
}

function operandPath(operand: StudioNode, owner: StudioNode) {
  const x = operand.transform.x / Math.max(1, owner.transform.width) * 100;
  const y = operand.transform.y / Math.max(1, owner.transform.height) * 100;
  const width = operand.transform.width / Math.max(1, owner.transform.width) * 100;
  const height = operand.transform.height / Math.max(1, owner.transform.height) * 100;
  if (operand.kind === "ellipse" || operand.kind === "dial") {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const rx = width / 2;
    const ry = height / 2;
    return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
  }
  if (operand.kind === "vector" && operand.geometry.vectorPoints.length) {
    const points = operand.geometry.vectorPoints;
    const position = (point: { x: number; y: number }) => ({ x: x + point.x / 100 * width, y: y + point.y / 100 * height });
    const first = position(points[0]);
    let path = `M ${first.x} ${first.y}`;
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const point = position(current);
      if (previous.handleOut || current.handleIn) {
        const a = position(previous.handleOut ?? previous);
        const b = position(current.handleIn ?? current);
        path += ` C ${a.x} ${a.y}, ${b.x} ${b.y}, ${point.x} ${point.y}`;
      } else path += ` L ${point.x} ${point.y}`;
    }
    return `${path}${operand.geometry.closed ? " Z" : ""}`;
  }
  if ((operand.kind === "polygon" || operand.kind === "star") && operand.geometry.polygonSides > 2) {
    const raw = shapePoints(operand).split(" ").map((pair) => pair.split(",").map(Number));
    return raw.map(([px, py], index) => `${index ? "L" : "M"} ${x + px / 100 * width} ${y + py / 100 * height}`).join(" ") + " Z";
  }
  return `M ${x} ${y} H ${x + width} V ${y + height} H ${x} Z`;
}

function PrimitiveGraphic({ node, operands = [] }: { node: StudioNode; operands?: StudioNode[] }) {
  const stroke = node.style.strokeColor;
  const strokeOpacity = node.style.strokeOpacity / 100;
  const fill = node.style.fills[0]?.color ?? "transparent";
  const fillOpacity = (node.style.fills[0]?.opacity ?? 100) / 100;
  if (node.kind === "line" || node.kind === "arrow") {
    return <svg aria-hidden="true" className="v5-vector-svg" preserveAspectRatio="none" viewBox="0 0 100 100"><defs><marker id={`arrow-${node.id}`} markerHeight="8" markerWidth="8" orient="auto" refX="6" refY="3"><path d="M0,0 L0,6 L7,3 z" fill={stroke} /></marker></defs><line markerEnd={node.kind === "arrow" ? `url(#arrow-${node.id})` : undefined} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={Math.max(1, node.style.strokeWidth)} x1="2" x2="94" y1="50" y2="50" /></svg>;
  }
  if (node.kind === "polygon" || node.kind === "star") return <svg aria-hidden="true" className="v5-vector-svg" preserveAspectRatio="none" viewBox="0 0 100 100"><polygon fill={fill} fillOpacity={fillOpacity} points={shapePoints(node)} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={node.style.strokeWidth} /></svg>;
  if (node.kind === "boolean" && operands.length) {
    const paths = operands.map((operand) => operandPath(operand, node));
    const operation = node.geometry.booleanOperation;
    const safeId = node.id.replace(/[^a-z0-9_-]/gi, "-");
    let intersection: ReactNode = <path d={paths[0]} fill={fill} fillOpacity={fillOpacity} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={node.style.strokeWidth} />;
    paths.slice(1).forEach((_, index) => { intersection = <g clipPath={`url(#boolean-clip-${safeId}-${index})`}>{intersection}</g>; });
    return <svg aria-hidden="true" className="v5-vector-svg" preserveAspectRatio="none" viewBox="0 0 100 100"><defs><clipPath id={`boolean-first-${safeId}`}><path d={paths[0]} /></clipPath>{paths.slice(1).map((path, index) => <clipPath id={`boolean-clip-${safeId}-${index}`} key={index}><path d={path} /></clipPath>)}</defs>{operation === "intersect" && paths[1] ? intersection : operation === "subtract" ? <g clipPath={`url(#boolean-first-${safeId})`}><path d={paths.join(" ")} fill={fill} fillOpacity={fillOpacity} fillRule="evenodd" /></g> : <path d={paths.join(" ")} fill={fill} fillOpacity={fillOpacity} fillRule={operation === "exclude" ? "evenodd" : "nonzero"} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={node.style.strokeWidth} />}</svg>;
  }
  if (node.kind === "vector" || node.kind === "boolean") return <svg aria-hidden="true" className="v5-vector-svg" preserveAspectRatio="none" viewBox="0 0 100 100"><path d={vectorPath(node)} fill={node.geometry.closed ? fill : "none"} fillOpacity={fillOpacity} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={strokeOpacity} strokeWidth={node.style.strokeWidth} /></svg>;
  return null;
}

function NodeContent({ locale, node, operandNodes, previewMode, onChange, onTrigger }: Pick<StudioNodePreviewProps, "locale" | "node" | "operandNodes" | "previewMode" | "onChange" | "onTrigger">) {
  const t = (en: string, es: string) => tr(locale, en, es);
  if (["line", "arrow", "polygon", "star", "vector", "boolean"].includes(node.kind)) return <PrimitiveGraphic node={node} operands={operandNodes} />;
  if (node.kind === "icon") return <IconGlyph node={node} />;
  if (node.kind === "text") return <span className="v5-text-content">{node.text}</span>;
  if (node.kind === "image") return node.style.fills.some((paint) => paint.type === "image" && paint.imageUrl) ? null : <span className="v5-image-placeholder">{t("IMAGE", "IMAGEN")}</span>;
  if (node.kind === "button") return <span className="v5-button-content">{node.text}</span>;
  if (node.kind === "input") return previewMode ? <label className="v5-input-content"><span>{node.text}</span><input aria-label={node.accessibility.ariaLabel || node.text} placeholder={node.secondaryText} /></label> : <span className="v5-input-content"><span>{node.text}</span><small>{node.secondaryText}</small></span>;
  if (node.kind === "toggle") return <span className="v5-toggle-content"><span>{node.text}</span><button aria-checked={node.checked} aria-label={node.accessibility.ariaLabel || node.text} disabled={!previewMode} onClick={(event) => { event.stopPropagation(); onChange({ checked: !node.checked }); if (previewMode) onTrigger("click"); }} role="switch" type="button"><i>{node.checked && <Check size={10} />}</i></button></span>;
  if (node.kind === "slider") return <span className="v5-slider-content"><span><b>{node.text}</b><small>{node.value}%</small></span><input aria-label={node.accessibility.ariaLabel || node.text} disabled={!previewMode} max="100" min="0" onChange={(event) => onChange({ value: Number(event.target.value) })} type="range" value={node.value} /></span>;
  if (node.kind === "dial") return <span className="v5-dial-content"><i style={{ transform: `rotate(${node.value * 2.7 - 135}deg)` }} /><b>{node.value}%</b><small>{node.secondaryText || t("INTENSITY", "INTENSIDAD")}</small></span>;
  if (node.kind === "progress") return <span className="v5-progress-content"><span><b>{node.text}</b><small>{node.value}%</small></span><i><em style={{ width: `${node.value}%` }} /></i></span>;
  return null;
}

export function StudioNodePreview({ children, locale, node, operandNodes, selected, previewMode, vectorEditMode = false, smartDuration = 0.35, smartEasing = "ease-in-out", transitionType = "smart", onSelect, onChange, onTrigger, onVectorPointChange, onVectorHandleChange, onClipPointChange, onPivotChange }: StudioNodePreviewProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const pointerOrigin = useRef<{ x: number; y: number } | null>(null);
  const typography = node.style.typography;
  const backgroundBlur = nodeBackdropFilter(node);
  const imagePaint = node.style.fills.find((paint) => paint.visible && paint.type === "image" && paint.imageUrl);
  const isGraphic = ["line", "arrow", "polygon", "star", "vector", "boolean"].includes(node.kind);
  const strokeColor = `color-mix(in srgb, ${node.style.strokeColor} ${node.style.strokeOpacity}%, transparent)`;
  const borderWidth = node.style.strokeAlign === "inside" ? node.style.strokeWidth : node.style.strokeAlign === "center" ? node.style.strokeWidth / 2 : 0;
  const outlineWidth = node.style.strokeAlign === "outside" ? node.style.strokeWidth : node.style.strokeAlign === "center" ? node.style.strokeWidth / 2 : 0;
  const style: CSSProperties & { cornerShape?: string } = {
    width: "100%",
    height: "100%",
    position: "relative",
    display: node.layout.mode === "grid" ? "grid" : "flex",
    flexDirection: node.layout.mode === "vertical" ? "column" : "row",
    flexWrap: node.layout.wrap ? "wrap" : "nowrap",
    gridTemplateColumns: node.layout.mode === "grid" ? `repeat(${node.layout.columns}, minmax(0, 1fr))` : undefined,
    alignItems: node.layout.align === "start" ? "flex-start" : node.layout.align === "end" ? "flex-end" : node.layout.align,
    justifyContent: node.layout.justify === "start" ? "flex-start" : node.layout.justify === "end" ? "flex-end" : node.layout.justify,
    gap: node.layout.gap,
    rowGap: node.layout.rowGap,
    columnGap: node.layout.columnGap,
    padding: node.layout.mode === "free" ? 0 : `${node.layout.padding[0]}px ${node.layout.padding[1]}px ${node.layout.padding[2]}px ${node.layout.padding[3]}px`,
    boxSizing: "border-box",
    overflow: node.geometry.clipChildren || node.geometry.mask ? "hidden" : "visible",
    color: node.style.fills[0]?.type === "solid" && node.kind === "text" ? node.style.fills[0].color : typography.color,
    background: node.kind === "text" ? nodeBackground(node) : isGraphic || node.kind === "icon" || node.kind === "group" || node.kind === "componentInstance" ? "transparent" : nodeBackground(node),
    backgroundClip: node.kind === "text" && node.style.fills[0]?.type !== "solid" ? "text" : undefined,
    WebkitBackgroundClip: node.kind === "text" && node.style.fills[0]?.type !== "solid" ? "text" : undefined,
    WebkitTextFillColor: node.kind === "text" && node.style.fills[0]?.type !== "solid" ? "transparent" : undefined,
    backgroundBlendMode: node.style.fills.filter((paint) => paint.visible).map((paint) => paint.blendMode).join(", ") as CSSProperties["backgroundBlendMode"],
    backgroundSize: imagePaint ? imagePaint.imageMode === "fit" ? "contain" : imagePaint.imageMode === "tile" ? "auto" : "cover" : undefined,
    backgroundPosition: imagePaint ? "center" : undefined,
    backgroundRepeat: imagePaint ? imagePaint.imageMode === "tile" ? "repeat" : "no-repeat" : undefined,
    borderRadius: cornerRadiusCss(node),
    cornerShape: node.geometry.cornerSmoothing > 0 ? `superellipse(${(1 + node.geometry.cornerSmoothing / 50).toFixed(2)})` : "round",
    borderWidth: isGraphic || node.kind === "text" || node.kind === "icon" || node.kind === "group" ? 0 : borderWidth,
    borderColor: strokeColor,
    borderStyle: node.style.strokeStyle,
    outline: !isGraphic && node.kind !== "text" && node.kind !== "icon" && node.kind !== "group" && outlineWidth ? `${outlineWidth}px ${node.style.strokeStyle} ${strokeColor}` : undefined,
    outlineOffset: 0,
    boxShadow: isGraphic || node.kind === "text" || node.kind === "icon" || node.kind === "group" ? "none" : nodeBoxShadow(node),
    backdropFilter: backgroundBlur,
    WebkitBackdropFilter: backgroundBlur,
    filter: nodeFilter(node),
    opacity: node.style.opacity / 100,
    mixBlendMode: node.style.blendMode as CSSProperties["mixBlendMode"],
    clipPath: clipPathCss(node),
    transform: `perspective(${node.transform.perspective}px) translateZ(${node.transform.z}px) rotateX(${node.transform.rotationX}deg) rotateY(${node.transform.rotationY}deg) rotateZ(${node.transform.rotationZ}deg) skew(${node.transform.skewX}deg, ${node.transform.skewY}deg) scale(${(node.transform.scaleX / 100) * (node.transform.flipX ? -1 : 1)}, ${(node.transform.scaleY / 100) * (node.transform.flipY ? -1 : 1)})`,
    transformOrigin: `${node.transform.pivotX}% ${node.transform.pivotY}%`,
    transformStyle: "preserve-3d",
    perspective: node.transform.perspective,
    fontFamily: fontFamilies[typography.family],
    fontSize: typography.size,
    fontWeight: typography.weight,
    fontStyle: typography.italic ? "italic" : "normal",
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    textAlign: typography.align,
    textDecoration: typography.underline ? "underline" : "none",
    textTransform: typography.transform,
    transition: previewMode
      ? transitionType === "instant"
        ? "none"
        : transitionType === "dissolve"
          ? `opacity ${smartDuration}s ${smartEasing}`
          : `transform ${smartDuration}s ${smartEasing}, opacity ${smartDuration}s ${smartEasing}, background ${smartDuration}s ${smartEasing}, box-shadow ${smartDuration}s ${smartEasing}, filter ${smartDuration}s ${smartEasing}`
      : undefined,
  };

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!previewMode) {
      onSelect(event);
      return;
    }
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setPressed(true);
    pointerOrigin.current = { x: event.clientX, y: event.clientY };
    onTrigger("mouseDown");
  }

  function beginPercentDrag(event: PointerEvent<HTMLButtonElement>, onMove: (point: { x: number; y: number }) => void) {
    event.stopPropagation();
    const owner = event.currentTarget.closest(".v5-node")?.getBoundingClientRect();
    if (!owner) return;
    const move = (pointer: globalThis.PointerEvent) => onMove({
      x: Math.max(0, Math.min(100, (pointer.clientX - owner.left) / owner.width * 100)),
      y: Math.max(0, Math.min(100, (pointer.clientY - owner.top) / owner.height * 100)),
    });
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  }

  return (
    <div
      aria-label={node.accessibility.decorative ? undefined : node.accessibility.ariaLabel || node.name}
      className={`v5-node v5-node-${node.kind} ${selected && !previewMode ? "v5-node-selected" : ""} ${hovered ? "v5-node-hovered" : ""} ${pressed ? "v5-node-pressed" : ""}`}
      data-node-id={node.id}
      onClick={(event) => {
        if (previewMode) {
          if (onTrigger("click")) event.stopPropagation();
        } else {
          event.stopPropagation();
          onSelect(event);
        }
      }}
      onDoubleClick={() => { if (previewMode) onTrigger("doubleClick"); }}
      onBlur={() => { if (previewMode) onTrigger("blur"); }}
      onFocus={() => { if (previewMode) onTrigger("focus"); }}
      onKeyDown={(event) => {
        if (!previewMode) return;
        if ((event.key === "Enter" || event.key === " ") && (node.kind === "button" || node.accessibility.role === "button")) { event.preventDefault(); onTrigger("click"); }
        if (node.kind === "dial" && ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const value = event.key === "Home" ? 0 : event.key === "End" ? 100 : Math.max(0, Math.min(100, node.value + (event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1) * (event.shiftKey ? 10 : 1)));
          onChange({ value });
        }
      }}
      onPointerDown={pointerDown}
      onPointerCancel={() => { pointerOrigin.current = null; setPressed(false); }}
      onPointerEnter={() => { setHovered(true); if (previewMode) onTrigger("hover"); }}
      onPointerLeave={() => { setHovered(false); if (previewMode) onTrigger("hoverEnd"); }}
      onPointerUp={(event) => {
        if (previewMode) {
          onTrigger("mouseUp");
          const origin = pointerOrigin.current;
          if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 24) {
            if (node.kind === "dial") onChange({ value: Math.max(0, Math.min(100, node.value + (event.clientX - origin.x - (event.clientY - origin.y)) / 2)) });
            onTrigger("drag");
            onTrigger("swipe");
          }
        }
        pointerOrigin.current = null;
        setPressed(false);
      }}
      onWheel={(event) => { if (previewMode) { if (node.kind === "dial") { event.preventDefault(); onChange({ value: Math.max(0, Math.min(100, node.value + (event.deltaY < 0 ? 1 : -1) * (event.shiftKey ? 10 : 1))) }); } onTrigger("scroll"); } }}
      role={node.accessibility.decorative || node.kind === "slider" ? undefined : node.accessibility.role || (node.kind === "button" ? "button" : undefined)}
      style={style}
      tabIndex={previewMode && !node.accessibility.decorative && !["input", "toggle", "slider"].includes(node.kind) ? node.accessibility.tabIndex : -1}
      aria-valuemax={node.kind === "dial" || node.kind === "progress" ? 100 : undefined}
      aria-valuemin={node.kind === "dial" || node.kind === "progress" ? 0 : undefined}
      aria-valuenow={node.kind === "dial" || node.kind === "progress" ? node.value : undefined}
    >
      <NodeContent locale={locale} node={node} onChange={onChange} onTrigger={onTrigger} operandNodes={operandNodes} previewMode={previewMode} />
      {node.style.effects.filter((effect) => effect.visible && effect.blendMode !== "normal" && ["dropShadow", "innerShadow", "glow", "innerGlow"].includes(effect.type)).map((effect) => <i aria-hidden="true" className="v5-effect-layer" key={effect.id} style={{ boxShadow: effectShadowCss(effect), mixBlendMode: effect.blendMode }} />)}
      {children}
      {node.style.effects.filter((effect) => effect.visible && (effect.type === "noise" || effect.type === "texture")).map((effect) => <i aria-hidden="true" className={`v5-texture-overlay ${effect.type}`} key={effect.id} style={{ opacity: effect.opacity / 100, mixBlendMode: effect.blendMode, backgroundSize: `${Math.max(3, 18 - effect.intensity / 7)}px ${Math.max(3, 18 - effect.intensity / 7)}px` }} />)}
      {selected && !previewMode && <><i className="v5-selection-outline" /><button aria-label={tr(locale, "Move transform pivot", "Mover pivote de transformación")} className="v5-pivot-handle" onPointerDown={(event) => beginPercentDrag(event, (point) => onPivotChange?.(point))} style={{ left: `${node.transform.pivotX}%`, top: `${node.transform.pivotY}%` }} type="button" /></>}
      {vectorEditMode && selected && node.geometry.vectorPoints.some((point) => point.handleIn || point.handleOut) && <svg aria-hidden="true" className="v5-vector-handle-lines" viewBox="0 0 100 100">{node.geometry.vectorPoints.flatMap((point) => [point.handleIn, point.handleOut].filter((handle): handle is { x: number; y: number } => Boolean(handle)).map((handle, index) => <line key={`${point.id}-${index}`} stroke="currentColor" strokeWidth=".5" vectorEffect="non-scaling-stroke" x1={point.x} x2={handle.x} y1={point.y} y2={handle.y} />))}</svg>}
      {vectorEditMode && selected && node.geometry.vectorPoints.map((point, index) => <span className="v5-vector-control-set" key={point.id}>
        {point.handleIn && <button aria-label={`${tr(locale, "Vector point", "Punto vectorial")} ${index + 1} ${tr(locale, "incoming handle", "tirador de entrada")}`} className="v5-vector-handle" onPointerDown={(event) => beginPercentDrag(event, (next) => onVectorHandleChange?.(index, "handleIn", next))} style={{ left: `${point.handleIn.x}%`, top: `${point.handleIn.y}%` }} type="button" />}
        {point.handleOut && <button aria-label={`${tr(locale, "Vector point", "Punto vectorial")} ${index + 1} ${tr(locale, "outgoing handle", "tirador de salida")}`} className="v5-vector-handle" onPointerDown={(event) => beginPercentDrag(event, (next) => onVectorHandleChange?.(index, "handleOut", next))} style={{ left: `${point.handleOut.x}%`, top: `${point.handleOut.y}%` }} type="button" />}
        <button aria-label={`${tr(locale, "Vector point", "Punto vectorial")} ${index + 1}`} className="v5-vector-point" onPointerDown={(event) => beginPercentDrag(event, (next) => onVectorPointChange?.(index, next))} style={{ left: `${point.x}%`, top: `${point.y}%` }} type="button" />
      </span>)}
      {vectorEditMode && selected && node.geometry.clipPoints.map((point, index) => <button aria-label={`${tr(locale, "Clip point", "Punto de recorte")} ${index + 1}`} className="v5-clip-point" key={`${index}-${node.geometry.clipPoints.length}`} onPointerDown={(event) => beginPercentDrag(event, (next) => onClipPointChange?.(index, next))} style={{ left: `${point.x}%`, top: `${point.y}%` }} type="button" />)}
    </div>
  );
}
