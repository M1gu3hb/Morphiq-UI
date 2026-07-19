"use client";

import { useState } from "react";
import { Pause, Play, Plus, RotateCcw, Trash2, WandSparkles } from "lucide-react";
import { tr, type Locale } from "@/lib/i18n";
import {
  type FillType,
  type InteractionState,
  type MotionDirection,
  type MotionEasing,
  type MotionFillMode,
  type MotionFrame,
  type MotionPreset,
  type MotionTrigger,
  type NodeMotion,
  type NodeStyle,
  type StateStyle,
  type StudioNode,
  type Surface,
  type TransformOrigin,
} from "./studio-model";
import { resolveMotionFrames } from "./studio-motion";

const interactionStates: InteractionState[] = ["base", "hover", "pressed", "focus", "disabled"];
const motionPresets: MotionPreset[] = ["none", "float", "pulse", "wobble", "bounce", "rotate", "slide", "glow", "shake", "breathe", "flip", "reveal", "custom"];
const transformOrigins: TransformOrigin[] = ["top left", "top", "top right", "left", "center", "right", "bottom left", "bottom", "bottom right"];

type DesignInspectorProps = {
  locale: Locale;
  node: StudioNode;
  onApplySurface: (surface: Surface) => void;
  onChange: (patch: Partial<StudioNode>) => void;
  onStyle: (patch: Partial<NodeStyle>) => void;
};

export function DesignInspector({ locale, node, onApplySurface, onChange, onStyle }: DesignInspectorProps) {
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  return <>
    <div className="inspector-section">
      <span className="studio-panel-label">{t("Content", "Contenido")}</span>
      <label className="stacked-field"><span>{node.kind === "input" ? t("Label", "Etiqueta") : t("Text", "Texto")}</span><input value={node.text} onChange={(event) => onChange({ text: event.target.value })} /></label>
      {["card", "input"].includes(node.kind) && <label className="stacked-field"><span>{node.kind === "input" ? "Placeholder" : t("Description", "Descripción")}</span><textarea rows={2} value={node.secondaryText} onChange={(event) => onChange({ secondaryText: event.target.value })} /></label>}
      {node.kind === "progress" && <RangeControl label={t("Progress", "Progreso")} max={100} min={0} onChange={(value) => onChange({ value })} value={node.value} suffix="%" />}
      {node.kind === "toggle" && <label className="check-field"><input checked={node.checked} onChange={(event) => onChange({ checked: event.target.checked })} type="checkbox" /><span>{t("Checked by default", "Activado por defecto")}</span></label>}
      <label className="check-field"><input checked={node.disabled} onChange={(event) => onChange({ disabled: event.target.checked })} type="checkbox" /><span>{t("Disabled", "Desactivado")}</span></label>
    </div>

    <div className="inspector-section"><span className="studio-panel-label">{t("Surface language", "Lenguaje de superficie")}</span><div className="surface-selector">{(["clay", "glass", "skeuo", "adaptive"] as Surface[]).map((surface) => <button aria-pressed={node.surface === surface} className={node.surface === surface ? "surface-option-active" : ""} key={surface} onClick={() => onApplySurface(surface)} type="button"><i className={`surface-dot surface-dot-${surface}`} />{surface}</button>)}</div></div>

    <div className="inspector-section">
      <span className="studio-panel-label">{t("Geometry", "Geometría")}</span>
      <div className="inspector-field-grid">{(["width", "height", "x", "y"] as const).map((key) => <NumberControl key={key} label={key === "width" ? "W" : key === "height" ? "H" : key.toUpperCase()} onChange={(value) => onChange({ [key]: Math.max(0, value) })} value={Math.round(node[key])} />)}</div>
      <label className="check-field"><input checked={node.lockAspectRatio} onChange={(event) => onChange({ lockAspectRatio: event.target.checked })} type="checkbox" /><span>{t("Lock aspect ratio", "Bloquear proporción")}</span></label>
      <RangeControl label={t("Padding", "Relleno interno")} max={64} min={0} onChange={(padding) => onStyle({ padding })} value={node.style.padding} suffix="px" />
    </div>

    <div className="inspector-section">
      <span className="studio-panel-label">{t("Fill", "Relleno")}</span>
      <SegmentedControl options={["solid", "linear", "radial"] as FillType[]} value={node.style.fillType} onChange={(fillType) => onStyle({ fillType })} />
      {node.style.fillType === "solid" ? <ColorControl label={t("Fill color", "Color de relleno")} onChange={(fill) => onStyle({ fill })} value={node.style.fill === "transparent" ? "#ffffff" : node.style.fill} /> : <>
        <ColorControl label={t("Gradient start", "Inicio del degradado")} onChange={(gradientFrom) => onStyle({ gradientFrom })} value={node.style.gradientFrom} />
        <ColorControl label={t("Gradient end", "Final del degradado")} onChange={(gradientTo) => onStyle({ gradientTo })} value={node.style.gradientTo} />
        {node.style.fillType === "linear" && <RangeControl label={t("Gradient angle", "Ángulo del degradado")} max={360} min={0} onChange={(gradientAngle) => onStyle({ gradientAngle })} value={node.style.gradientAngle} suffix="°" />}
      </>}
    </div>

    <div className="inspector-section">
      <span className="studio-panel-label">{t("Material and light", "Material y luz")}</span>
      <ColorControl label={t("Text", "Texto")} onChange={(color) => onStyle({ color })} value={node.style.color} />
      <ColorControl label={t("Border", "Borde")} onChange={(borderColor) => onStyle({ borderColor })} value={node.style.borderColor} />
      <label className="select-field"><span>{t("Border style", "Estilo de borde")}</span><select value={node.style.borderStyle} onChange={(event) => onStyle({ borderStyle: event.target.value as NodeStyle["borderStyle"] })}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option><option value="double">Double</option></select></label>
      <RangeControl label={t("Border width", "Ancho de borde")} max={10} min={0} onChange={(borderWidth) => onStyle({ borderWidth })} value={node.style.borderWidth} suffix="px" />
      <RangeControl label={t("Radius", "Radio")} max={120} min={0} onChange={(radius) => onStyle({ radius })} value={node.style.radius} suffix="px" />
      <RangeControl label={t("Depth", "Profundidad")} max={36} min={0} onChange={(depth) => onStyle({ depth })} value={node.style.depth} />
      <ColorControl label={t("Shadow color", "Color de sombra")} onChange={(shadowColor) => onStyle({ shadowColor })} value={node.style.shadowColor} />
      <RangeControl label={t("Shadow opacity", "Opacidad de sombra")} max={100} min={0} onChange={(shadowOpacity) => onStyle({ shadowOpacity })} value={node.style.shadowOpacity} suffix="%" />
      <RangeControl label={t("Softness", "Suavidad")} max={64} min={0} onChange={(blur) => onStyle({ blur })} value={node.style.blur} suffix="px" />
      {node.surface === "glass" && <RangeControl label={t("Glass saturation", "Saturación del vidrio")} max={240} min={50} onChange={(saturate) => onStyle({ saturate })} value={node.style.saturate} suffix="%" />}
      <RangeControl label={t("Opacity", "Opacidad")} max={100} min={0} onChange={(opacity) => onStyle({ opacity })} value={node.style.opacity} suffix="%" />
    </div>

    <div className="inspector-section">
      <span className="studio-panel-label">{t("Transform", "Transformación")}</span>
      <RangeControl label={t("Rotation", "Rotación")} max={180} min={-180} onChange={(rotation) => onStyle({ rotation })} value={node.style.rotation} suffix="°" />
      <RangeControl label="Skew X" max={45} min={-45} onChange={(skewX) => onStyle({ skewX })} value={node.style.skewX} suffix="°" />
      <RangeControl label="Skew Y" max={45} min={-45} onChange={(skewY) => onStyle({ skewY })} value={node.style.skewY} suffix="°" />
      <span className="control-caption">{t("Transform origin", "Origen de transformación")}</span>
      <div className="origin-grid">{transformOrigins.map((origin) => <button aria-label={origin} aria-pressed={node.style.transformOrigin === origin} key={origin} onClick={() => onStyle({ transformOrigin: origin })} type="button"><i /></button>)}</div>
    </div>

    <div className="inspector-section">
      <span className="studio-panel-label">{t("Typography", "Tipografía")}</span>
      <label className="select-field"><span>{t("Family", "Familia")}</span><select value={node.style.fontFamily} onChange={(event) => onStyle({ fontFamily: event.target.value as NodeStyle["fontFamily"] })}><option value="body">Manrope</option><option value="display">Bricolage</option><option value="mono">Monospace</option></select></label>
      <label className="select-field"><span>{t("Case", "Mayúsculas")}</span><select value={node.style.textTransform} onChange={(event) => onStyle({ textTransform: event.target.value as NodeStyle["textTransform"] })}><option value="none">None</option><option value="uppercase">Uppercase</option><option value="lowercase">Lowercase</option><option value="capitalize">Capitalize</option></select></label>
      <RangeControl label={t("Font size", "Tamaño")} max={72} min={7} onChange={(fontSize) => onStyle({ fontSize })} value={node.style.fontSize} suffix="px" />
      <RangeControl label={t("Weight", "Peso")} max={900} min={300} onChange={(fontWeight) => onStyle({ fontWeight })} step={100} value={node.style.fontWeight} />
      <RangeControl label={t("Line height", "Interlineado")} max={2.4} min={.7} onChange={(lineHeight) => onStyle({ lineHeight })} step={.05} value={node.style.lineHeight} />
      <RangeControl label={t("Tracking", "Espaciado")} max={12} min={-3} onChange={(letterSpacing) => onStyle({ letterSpacing })} step={.1} value={node.style.letterSpacing} suffix="px" />
      <SegmentedControl options={["left", "center", "right"] as const} value={node.style.textAlign} onChange={(textAlign) => onStyle({ textAlign })} />
    </div>
  </>;
}

type StatesInspectorProps = {
  forcedState: InteractionState;
  locale: Locale;
  node: StudioNode;
  onForcedState: (state: InteractionState) => void;
  onState: (state: Exclude<InteractionState, "base">, patch: Partial<StateStyle>) => void;
  onStyle: (patch: Partial<NodeStyle>) => void;
};

export function StatesInspector({ forcedState, locale, node, onForcedState, onState, onStyle }: StatesInspectorProps) {
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  const current = forcedState === "base" ? null : node.states[forcedState];
  return <>
    <div className="inspector-section"><span className="studio-panel-label">{t("Interaction state", "Estado de interacción")}</span><div className="state-selector">{interactionStates.map((state) => <button aria-pressed={forcedState === state} key={state} onClick={() => onForcedState(state)} type="button">{state === "pressed" ? t("Press", "Presión") : state === "disabled" ? t("Disabled", "Inactivo") : state}</button>)}</div><p className="inspector-help">{t("The canvas forces this state. Preview mode uses real pointer and keyboard interaction.", "El lienzo fuerza este estado. La vista previa usa interacción real de puntero y teclado.")}</p></div>
    <div className="inspector-section"><span className="studio-panel-label">{forcedState === "base" ? t("Base appearance", "Apariencia base") : t("State overrides", "Cambios del estado")}</span>{forcedState === "base" ? <><ColorControl label={t("Fill", "Relleno")} onChange={(fill) => onStyle({ fill })} value={node.style.fill === "transparent" ? "#ffffff" : node.style.fill} /><ColorControl label={t("Text", "Texto")} onChange={(color) => onStyle({ color })} value={node.style.color} /><RangeControl label={t("Opacity", "Opacidad")} max={100} min={0} onChange={(opacity) => onStyle({ opacity })} value={node.style.opacity} suffix="%" /></> : <><OverrideColor label={t("Fill override", "Cambio de relleno")} onChange={(fill) => onState(forcedState, { fill })} value={current?.fill ?? ""} fallback={node.style.fill} /><OverrideColor label={t("Text override", "Cambio de texto")} onChange={(color) => onState(forcedState, { color })} value={current?.color ?? ""} fallback={node.style.color} /><RangeControl label={t("Opacity", "Opacidad")} max={100} min={0} onChange={(opacity) => onState(forcedState, { opacity })} value={current?.opacity ?? 100} suffix="%" /><RangeControl label="Scale" max={160} min={40} onChange={(scale) => onState(forcedState, { scale })} value={current?.scale ?? 100} suffix="%" /><RangeControl label="Translate X" max={48} min={-48} onChange={(translateX) => onState(forcedState, { translateX })} value={current?.translateX ?? 0} suffix="px" /><RangeControl label="Translate Y" max={48} min={-48} onChange={(translateY) => onState(forcedState, { translateY })} value={current?.translateY ?? 0} suffix="px" /><RangeControl label="Rotate" max={45} min={-45} onChange={(rotate) => onState(forcedState, { rotate })} value={current?.rotate ?? 0} suffix="°" /><RangeControl label="Blur" max={16} min={0} onChange={(blur) => onState(forcedState, { blur })} value={current?.blur ?? 0} suffix="px" />{forcedState === "focus" && <ColorControl label={t("Focus ring", "Anillo de foco")} onChange={(outlineColor) => onState("focus", { outlineColor })} value={current?.outlineColor ?? "#7359df"} />}</>}</div>
  </>;
}

type MotionInspectorProps = {
  locale: Locale;
  node: StudioNode;
  onChange: (patch: Partial<NodeMotion>) => void;
  onReplay: () => void;
};

export function MotionInspector({ locale, node, onChange, onReplay }: MotionInspectorProps) {
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const activeIndex = Math.min(selectedFrame, node.motion.keyframes.length - 1);
  const activeFrame = node.motion.keyframes[activeIndex];

  function customize() {
    const frames = resolveMotionFrames(node).map((item) => ({ ...item }));
    onChange({ preset: "custom", keyframes: frames });
    setSelectedFrame(0);
  }

  function updateFrame(patch: Partial<MotionFrame>) {
    const keyframes = node.motion.keyframes.map((item, index) => index === activeIndex ? { ...item, ...patch } : item);
    onChange({ preset: "custom", keyframes });
  }

  function addFrame() {
    if (node.motion.keyframes.length >= 8) return;
    const frames = [...node.motion.keyframes].sort((a, b) => a.offset - b.offset);
    let gapIndex = 0;
    let largestGap = 0;
    for (let index = 0; index < frames.length - 1; index += 1) {
      const gap = frames[index + 1].offset - frames[index].offset;
      if (gap > largestGap) { largestGap = gap; gapIndex = index; }
    }
    if (largestGap < 2) return;
    const before = frames[gapIndex];
    const after = frames[gapIndex + 1];
    const next: MotionFrame = {
      ...before,
      offset: Math.round((before.offset + after.offset) / 2),
      x: (before.x + after.x) / 2,
      y: (before.y + after.y) / 2,
      scale: (before.scale + after.scale) / 2,
      rotate: (before.rotate + after.rotate) / 2,
      rotateX: (before.rotateX + after.rotateX) / 2,
      rotateY: (before.rotateY + after.rotateY) / 2,
      opacity: (before.opacity + after.opacity) / 2,
      blur: (before.blur + after.blur) / 2,
      brightness: (before.brightness + after.brightness) / 2,
    };
    frames.splice(gapIndex + 1, 0, next);
    onChange({ preset: "custom", keyframes: frames });
    setSelectedFrame(gapIndex + 1);
  }

  function removeFrame() {
    if (node.motion.keyframes.length <= 2) return;
    const keyframes = node.motion.keyframes.filter((_, index) => index !== activeIndex);
    onChange({ preset: "custom", keyframes });
    setSelectedFrame(Math.max(0, activeIndex - 1));
  }

  const previousOffset = node.motion.keyframes[activeIndex - 1]?.offset ?? -1;
  const nextOffset = node.motion.keyframes[activeIndex + 1]?.offset ?? 101;

  return <>
    <div className="inspector-section">
      <div className="section-heading"><span className="studio-panel-label">{t("Motion preset", "Animación")}</span><div className="section-actions"><button aria-label={node.motion.enabled ? t("Pause animation", "Pausar animación") : t("Enable animation", "Activar animación")} onClick={() => onChange({ enabled: !node.motion.enabled })} type="button">{node.motion.enabled ? <Pause size={11} /> : <Play size={11} />}</button><button onClick={onReplay} type="button"><RotateCcw size={11} /> {t("Replay", "Repetir")}</button></div></div>
      <div className="motion-grid">{motionPresets.map((preset) => <button aria-pressed={node.motion.preset === preset} key={preset} onClick={() => onChange({ preset, enabled: true })} type="button"><WandSparkles size={13} />{preset}</button>)}</div>
    </div>

    <div className="inspector-section">
      <span className="studio-panel-label">{t("Playback", "Reproducción")}</span>
      <label className="select-field"><span>{t("Trigger", "Disparador")}</span><select value={node.motion.trigger} onChange={(event) => onChange({ trigger: event.target.value as MotionTrigger })}><option value="loop">Loop</option><option value="hover">Hover</option><option value="tap">Tap / Press</option><option value="load">On load</option></select></label>
      <label className="select-field"><span>Easing</span><select value={node.motion.easing} onChange={(event) => onChange({ easing: event.target.value as MotionEasing })}><option value="easeOut">Ease out</option><option value="easeInOut">Ease in/out</option><option value="linear">Linear</option><option value="spring">Spring</option></select></label>
      <label className="select-field"><span>{t("Direction", "Dirección")}</span><select value={node.motion.direction} onChange={(event) => onChange({ direction: event.target.value as MotionDirection })}><option value="normal">Normal</option><option value="reverse">Reverse</option><option value="alternate">Alternate</option><option value="alternate-reverse">Alternate reverse</option></select></label>
      <label className="select-field"><span>Fill mode</span><select value={node.motion.fillMode} onChange={(event) => onChange({ fillMode: event.target.value as MotionFillMode })}><option value="none">None</option><option value="forwards">Forwards</option><option value="backwards">Backwards</option><option value="both">Both</option></select></label>
      <RangeControl label={t("Duration", "Duración")} max={8} min={.1} onChange={(duration) => onChange({ duration })} step={.05} value={node.motion.duration} suffix="s" />
      <RangeControl label={t("Delay", "Retraso")} max={5} min={0} onChange={(delay) => onChange({ delay })} step={.05} value={node.motion.delay} suffix="s" />
      <RangeControl label={t("Intensity", "Intensidad")} max={40} min={1} onChange={(intensity) => onChange({ intensity })} value={node.motion.intensity} />
      <label className="select-field"><span>{t("Repeat", "Repetición")}</span><select value={node.motion.repeat} onChange={(event) => onChange({ repeat: Number(event.target.value) })}><option value={0}>{t("Once", "Una vez")}</option><option value={1}>2×</option><option value={2}>3×</option><option value={4}>5×</option><option value={9}>10×</option><option value={-1}>{t("Infinite", "Infinita")}</option></select></label>
    </div>

    <div className="inspector-section keyframe-editor">
      <div className="section-heading"><span className="studio-panel-label">{t("Keyframe timeline", "Línea de keyframes")}</span><div className="section-actions">{node.motion.preset !== "custom" && <button onClick={customize} type="button">{t("Customize", "Personalizar")}</button>}<button aria-label={t("Add keyframe", "Agregar keyframe")} disabled={node.motion.keyframes.length >= 8} onClick={addFrame} type="button"><Plus size={11} /></button><button aria-label={t("Delete keyframe", "Borrar keyframe")} disabled={node.motion.keyframes.length <= 2} onClick={removeFrame} type="button"><Trash2 size={11} /></button></div></div>
      <div className="keyframe-track">{node.motion.keyframes.map((item, index) => <button aria-label={`${item.offset}%`} aria-pressed={activeIndex === index} key={`${item.offset}-${index}`} onClick={() => setSelectedFrame(index)} style={{ left: `${item.offset}%` }} type="button"><i /><span>{item.offset}%</span></button>)}</div>
      <p className="inspector-help">{t("Edit any point to create a custom, exportable animation.", "Edita cualquier punto para crear una animación personalizada y exportable.")}</p>
      <RangeControl label={t("Position", "Posición")} max={nextOffset - 1} min={previousOffset + 1} onChange={(offset) => updateFrame({ offset })} value={activeFrame.offset} suffix="%" />
      <div className="inspector-field-grid"><NumberControl label="X" onChange={(x) => updateFrame({ x })} value={activeFrame.x} /><NumberControl label="Y" onChange={(y) => updateFrame({ y })} value={activeFrame.y} /></div>
      <RangeControl label="Scale" max={180} min={20} onChange={(scale) => updateFrame({ scale })} value={activeFrame.scale} suffix="%" />
      <RangeControl label="Rotate Z" max={360} min={-360} onChange={(rotate) => updateFrame({ rotate })} value={activeFrame.rotate} suffix="°" />
      <RangeControl label="Rotate X" max={360} min={-360} onChange={(rotateX) => updateFrame({ rotateX })} value={activeFrame.rotateX} suffix="°" />
      <RangeControl label="Rotate Y" max={360} min={-360} onChange={(rotateY) => updateFrame({ rotateY })} value={activeFrame.rotateY} suffix="°" />
      <RangeControl label={t("Opacity", "Opacidad")} max={100} min={0} onChange={(opacity) => updateFrame({ opacity })} value={activeFrame.opacity} suffix="%" />
      <RangeControl label="Blur" max={30} min={0} onChange={(blur) => updateFrame({ blur })} step={.5} value={activeFrame.blur} suffix="px" />
      <RangeControl label={t("Brightness", "Brillo")} max={250} min={25} onChange={(brightness) => updateFrame({ brightness })} value={activeFrame.brightness} suffix="%" />
    </div>

    <div className="motion-summary"><WandSparkles size={15} /><div><b>{node.motion.preset}</b><span>{node.motion.trigger} · {node.motion.duration}s · {node.motion.easing} · {node.motion.direction}</span></div></div>
  </>;
}

function NumberControl({ label, onChange, value }: { label: string; onChange: (value: number) => void; value: number }) {
  return <label className="inspector-field"><span>{label}</span><input onChange={(event) => onChange(Number(event.target.value))} type="number" value={Number.isInteger(value) ? value : Number(value.toFixed(2))} /></label>;
}

function RangeControl({ label, max, min, onChange, step = 1, suffix = "", value }: { label: string; max: number; min: number; onChange: (value: number) => void; step?: number; suffix?: string; value: number }) {
  return <label className="range-field"><span>{label} <b>{Number.isInteger(value) ? value : Number(value.toFixed(2))}{suffix}</b></span><input max={max} min={min} onChange={(event) => onChange(Number(event.target.value))} step={step} type="range" value={value} /></label>;
}

export function ColorControl({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  const safeValue = /^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff";
  return <label className="color-field"><span>{label}</span><input onChange={(event) => onChange(event.target.value)} type="color" value={safeValue} /><code>{value}</code></label>;
}

function OverrideColor({ fallback, label, onChange, value }: { fallback: string; label: string; onChange: (value: string) => void; value: string }) {
  return <div className="override-color"><ColorControl label={label} onChange={onChange} value={value || fallback} /><button disabled={!value} onClick={() => onChange("")} type="button">{value ? "↺ inherit" : "inherited"}</button></div>;
}

function SegmentedControl<const T extends string>({ onChange, options, value }: { onChange: (value: T) => void; options: readonly T[]; value: T }) {
  return <div className="segmented-control">{options.map((option) => <button aria-pressed={value === option} key={option} onClick={() => onChange(option)} type="button">{option}</button>)}</div>;
}
