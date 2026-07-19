"use client";

import { useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import {
  Blend,
  ChevronDown,
  ChevronUp,
  Component,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Link2,
  Minus,
  Plus,
  RotateCcw,
  Trash2,
  Variable,
} from "lucide-react";
import { tr, type Locale } from "@/lib/i18n";
import { HelpButton } from "./studio-help";
import {
  applySurfaceRecipe,
  createEffect,
  createGradientStop,
  createId,
  createPaint,
  type AccessibilitySettings,
  type AnimatableProperty,
  type BlendMode,
  type BooleanOperation,
  type ComponentDefinition,
  type ComponentPropertyType,
  type Device,
  type Effect,
  type EffectType,
  type InspectorTab,
  type LayoutMode,
  type NodeGeometry,
  type NodeLayout,
  type NodeStyle,
  type NodeTransform,
  type Paint,
  type PaintType,
  type ResponsiveOverride,
  type SceneVariant,
  type StudioDocument,
  type StudioInteraction,
  type StudioNode,
  type StudioVariable,
  type Surface,
  type TriggerType,
  type VariableType,
} from "./studio-model";

const blendModes: BlendMode[] = ["normal", "multiply", "screen", "overlay", "soft-light", "hard-light", "color-dodge", "color-burn", "difference", "exclusion"];
const paintTypes: PaintType[] = ["solid", "linear", "radial", "conic", "diamond", "image", "noise", "pattern"];
const effectTypes: EffectType[] = ["dropShadow", "innerShadow", "glow", "innerGlow", "layerBlur", "backgroundBlur", "noise", "texture"];
const surfaces: Exclude<Surface, "custom">[] = ["clay", "glass", "skeuo", "adaptive"];

export type StudioInspectorProps = {
  activeVariantId: string;
  device: Device;
  document: StudioDocument;
  locale: Locale;
  node: StudioNode;
  tab: InspectorTab;
  vectorEditMode: boolean;
  onAccessibility: (patch: Partial<AccessibilitySettings>) => void;
  onAddComponentProperty: (componentId: string, name: string, type: ComponentPropertyType, targetPath: string) => void;
  onAddInteraction: (interaction: StudioInteraction) => void;
  onAddVariable: (variable: StudioVariable) => void;
  onBindVariable: (path: string, variableId: string) => void;
  onCreateComponent: () => void;
  onComponentDefinition: (id: string, patch: Partial<ComponentDefinition>) => void;
  onDeleteInteraction: (id: string) => void;
  onDeleteVariable: (id: string) => void;
  onGeometry: (patch: Partial<NodeGeometry>, property?: AnimatableProperty) => void;
  onInteraction: (id: string, patch: Partial<StudioInteraction>) => void;
  onInstanceOverrides: (rootNodeId: string, overrides: Record<string, string | number | boolean>) => void;
  onLayout: (patch: Partial<NodeLayout>) => void;
  onNode: (patch: Partial<StudioNode>, property?: AnimatableProperty) => void;
  onResponsive: (device: Device, patch: ResponsiveOverride | null) => void;
  onSetVariant: (id: string) => void;
  onStyle: (patch: Partial<NodeStyle>, property?: AnimatableProperty) => void;
  onSurface: (node: StudioNode) => void;
  onToggleVectorEdit: () => void;
  onTransform: (patch: Partial<NodeTransform>, property?: AnimatableProperty) => void;
  onUpsertVariant: (variant?: SceneVariant) => void;
  onDeleteVariant: (id: string) => void;
  onVariable: (id: string, patch: Partial<StudioVariable>) => void;
};

export function StudioInspector(props: StudioInspectorProps) {
  if (props.tab === "material") return <MaterialInspector {...props} />;
  if (props.tab === "layout") return <LayoutInspector {...props} />;
  if (props.tab === "component") return <ComponentInspector {...props} />;
  if (props.tab === "interactions") return <InteractionsInspector {...props} />;
  if (props.tab === "accessibility") return <AccessibilityInspector {...props} />;
  return <DesignInspector {...props} />;
}

function DesignInspector({ locale, node, vectorEditMode, onGeometry, onNode, onStyle, onToggleVectorEdit, onTransform }: StudioInspectorProps) {
  const t = (en: string, es: string) => tr(locale, en, es);
  const radii = node.geometry.cornerRadii;
  const type = node.style.typography;
  const textCapable = ["text", "button", "input", "toggle", "slider", "dial", "progress"].includes(node.kind);
  return <>
    <Section title={t("Identity & content", "Identidad y contenido")}>
      <TextField label={t("Layer name", "Nombre de capa")} onChange={(name) => onNode({ name })} value={node.name} />
      {textCapable && <TextArea label={t("Primary text", "Texto principal")} onChange={(text) => onNode({ text }, "text")} value={node.text} />}
      {["input", "dial", "progress"].includes(node.kind) && <TextField label={t("Secondary text", "Texto secundario")} onChange={(secondaryText) => onNode({ secondaryText }, "secondaryText")} value={node.secondaryText} />}
      {["dial", "slider", "progress"].includes(node.kind) && <RangeControl label={t("Value", "Valor")} max={100} min={0} onChange={(value) => onNode({ value }, "value")} value={node.value} suffix="%" />}
      {node.kind === "icon" && <><SelectField label={t("Built-in icon", "Icono integrado")} onChange={(icon) => onNode({ icon })} options={["arrow", "play", "heart", "sparkles", "plus", "check"] as const} value={node.icon} /><TextArea label={t("Custom SVG path (d)", "Ruta SVG personalizada (d)")} onChange={(svgPath) => onNode({ svgPath })} value={node.svgPath} /><TextField label="SVG viewBox" onChange={(svgViewBox) => onNode({ svgViewBox })} value={node.svgViewBox} /></>}
    </Section>

    <Section title={t("Position & size", "Posición y tamaño")}>
      <Grid columns={2}>
        <NumberField label="X" onChange={(x) => onTransform({ x }, "transform.x")} value={node.transform.x} />
        <NumberField label="Y" onChange={(y) => onTransform({ y }, "transform.y")} value={node.transform.y} />
        <NumberField label="W" min={1} onChange={(width) => onTransform({ width }, "transform.width")} value={node.transform.width} />
        <NumberField label="H" min={1} onChange={(height) => onTransform({ height }, "transform.height")} value={node.transform.height} />
        <NumberField label="Z" onChange={(z) => onTransform({ z }, "transform.z")} value={node.transform.z} />
        <NumberField label="Rotate Z" onChange={(rotationZ) => onTransform({ rotationZ }, "transform.rotationZ")} value={node.transform.rotationZ} suffix="°" />
      </Grid>
      <Grid columns={2}>
        <NumberField label="Scale X" min={-400} onChange={(scaleX) => onTransform({ scaleX }, "transform.scaleX")} value={node.transform.scaleX} suffix="%" />
        <NumberField label="Scale Y" min={-400} onChange={(scaleY) => onTransform({ scaleY }, "transform.scaleY")} value={node.transform.scaleY} suffix="%" />
        <NumberField label="Skew X" onChange={(skewX) => onTransform({ skewX }, "transform.skewX")} value={node.transform.skewX} suffix="°" />
        <NumberField label="Skew Y" onChange={(skewY) => onTransform({ skewY }, "transform.skewY")} value={node.transform.skewY} suffix="°" />
      </Grid>
      <div className="v5-inline-actions"><button aria-pressed={node.transform.flipX} onClick={() => onTransform({ flipX: !node.transform.flipX })} type="button">↔ {t("Flip H", "Voltear H")}</button><button aria-pressed={node.transform.flipY} onClick={() => onTransform({ flipY: !node.transform.flipY })} type="button">↕ {t("Flip V", "Voltear V")}</button></div>
    </Section>

    <Section title={t("3D transform & pivot", "Transformación 3D y pivote")}>
      <Grid columns={2}>
        <NumberField label="Rotate X" onChange={(rotationX) => onTransform({ rotationX }, "transform.rotationX")} value={node.transform.rotationX} suffix="°" />
        <NumberField label="Rotate Y" onChange={(rotationY) => onTransform({ rotationY }, "transform.rotationY")} value={node.transform.rotationY} suffix="°" />
        <NumberField label="Pivot X" max={100} min={0} onChange={(pivotX) => onTransform({ pivotX }, "transform.pivotX")} value={node.transform.pivotX} suffix="%" />
        <NumberField label="Pivot Y" max={100} min={0} onChange={(pivotY) => onTransform({ pivotY }, "transform.pivotY")} value={node.transform.pivotY} suffix="%" />
      </Grid>
      <RangeControl label={t("Perspective", "Perspectiva")} max={2400} min={100} onChange={(perspective) => onTransform({ perspective }, "transform.perspective")} value={node.transform.perspective} suffix="px" />
      <PivotGrid locale={locale} onChange={(pivotX, pivotY) => onTransform({ pivotX, pivotY })} x={node.transform.pivotX} y={node.transform.pivotY} />
    </Section>

    <Section title={t("Shape & deformation", "Forma y deformación")}>
      <Grid columns={2}>
        {radii.map((value, index) => <NumberField key={index} label={["TL", "TR", "BR", "BL"][index]} min={0} onChange={(next) => { const cornerRadii = [...radii] as NodeGeometry["cornerRadii"]; cornerRadii[index] = next; onGeometry({ cornerRadii }, `geometry.cornerRadii.${index}` as AnimatableProperty); }} value={value} suffix="px" />)}
      </Grid>
      <RangeControl label={t("Corner smoothing", "Suavizado de esquina")} max={100} min={0} onChange={(cornerSmoothing) => onGeometry({ cornerSmoothing }, "geometry.cornerSmoothing")} value={node.geometry.cornerSmoothing} suffix="%" />
      {(node.kind === "polygon" || node.kind === "star") && <RangeControl label={t("Sides", "Lados")} max={12} min={3} onChange={(polygonSides) => onGeometry({ polygonSides })} value={node.geometry.polygonSides} />}
      {node.kind === "star" && <RangeControl label={t("Inner radius", "Radio interior")} max={90} min={10} onChange={(starRatio) => onGeometry({ starRatio })} value={node.geometry.starRatio} suffix="%" />}
      <ToggleField checked={node.geometry.clipChildren} label={t("Clip child content", "Recortar contenido hijo")} onChange={(clipChildren) => onGeometry({ clipChildren })} />
      <ToggleField checked={node.geometry.mask} label={t("Use as mask", "Usar como máscara")} onChange={(mask) => onGeometry({ mask })} />
      {(node.kind === "vector" || node.kind === "boolean" || node.geometry.clipPoints.length > 0) && <button className="v5-wide-button" aria-pressed={vectorEditMode} onClick={onToggleVectorEdit} type="button">{vectorEditMode ? t("Finish point editing", "Terminar edición de puntos") : t("Edit vector / clip points", "Editar puntos vectoriales / recorte")}</button>}
      {node.kind === "vector" && <div className="v5-vector-point-list">{node.geometry.vectorPoints.map((point, index) => <div key={point.id}><span>P{index + 1}</span><InlineNumberInput ariaLabel={`${t("Point", "Punto")} ${index + 1} X`} max={100} min={0} onCommit={(x) => { const vectorPoints = node.geometry.vectorPoints.map((item, itemIndex) => itemIndex === index ? { ...item, x } : item); onGeometry({ vectorPoints }, `geometry.vectorPoints.${index}.x`); }} value={point.x} /><InlineNumberInput ariaLabel={`${t("Point", "Punto")} ${index + 1} Y`} max={100} min={0} onCommit={(y) => { const vectorPoints = node.geometry.vectorPoints.map((item, itemIndex) => itemIndex === index ? { ...item, y } : item); onGeometry({ vectorPoints }, `geometry.vectorPoints.${index}.y`); }} value={point.y} /><button aria-pressed={Boolean(point.handleIn || point.handleOut)} onClick={() => { const vectorPoints = node.geometry.vectorPoints.map((item, itemIndex) => itemIndex === index ? item.handleIn || item.handleOut ? { ...item, handleIn: undefined, handleOut: undefined, corner: true } : { ...item, handleIn: { x: Math.max(0, item.x - 14), y: item.y }, handleOut: { x: Math.min(100, item.x + 14), y: item.y }, corner: false } : item); onGeometry({ vectorPoints }); }} type="button">{point.handleIn || point.handleOut ? t("Curve", "Curva") : t("Corner", "Esquina")}</button><button aria-label={t("Delete point", "Eliminar punto")} disabled={node.geometry.vectorPoints.length <= 2} onClick={() => onGeometry({ vectorPoints: node.geometry.vectorPoints.filter((_, itemIndex) => itemIndex !== index) })} type="button"><Trash2 size={9} /></button></div>)}<button className="v5-add-stop" onClick={() => onGeometry({ vectorPoints: [...node.geometry.vectorPoints, { id: createId("point"), x: 50, y: 50 }] })} type="button"><Plus size={10} /> {t("Add vector point", "Agregar punto vectorial")}</button><ToggleField checked={node.geometry.closed} label={t("Closed path", "Ruta cerrada")} onChange={(closed) => onGeometry({ closed })} /></div>}
      {node.kind === "boolean" && <SelectField<BooleanOperation> label={t("Boolean operation", "Operación booleana")} onChange={(booleanOperation) => onGeometry({ booleanOperation })} options={["union", "subtract", "intersect", "exclude"]} value={node.geometry.booleanOperation} />}
      <div className="v5-inline-actions"><button onClick={() => onGeometry({ clipPoints: [{ x: 8, y: 0 }, { x: 92, y: 0 }, { x: 100, y: 82 }, { x: 64, y: 100 }, { x: 0, y: 88 }] })} type="button">{t("Organic clip", "Recorte orgánico")}</button><button disabled={!node.geometry.clipPoints.length} onClick={() => onGeometry({ clipPoints: [] })} type="button"><RotateCcw size={11} /> {t("Reset", "Restablecer")}</button></div>
      {node.geometry.clipPoints.length > 0 && <div className="v5-vector-point-list"><b>{t("Movable clip path", "Ruta de recorte movible")}</b>{node.geometry.clipPoints.map((point, index) => <div key={`${index}-${node.geometry.clipPoints.length}`}><span>C{index + 1}</span><InlineNumberInput ariaLabel={`${t("Clip point", "Punto de recorte")} ${index + 1} X`} max={100} min={0} onCommit={(x) => { const clipPoints = node.geometry.clipPoints.map((item, itemIndex) => itemIndex === index ? { ...item, x } : item); onGeometry({ clipPoints }, `geometry.clipPoints.${index}.x`); }} value={point.x} /><InlineNumberInput ariaLabel={`${t("Clip point", "Punto de recorte")} ${index + 1} Y`} max={100} min={0} onCommit={(y) => { const clipPoints = node.geometry.clipPoints.map((item, itemIndex) => itemIndex === index ? { ...item, y } : item); onGeometry({ clipPoints }, `geometry.clipPoints.${index}.y`); }} value={point.y} /><button aria-label={t("Delete clip point", "Eliminar punto de recorte")} disabled={node.geometry.clipPoints.length <= 3} onClick={() => onGeometry({ clipPoints: node.geometry.clipPoints.filter((_, itemIndex) => itemIndex !== index) })} type="button"><Trash2 size={9} /></button></div>)}<button className="v5-add-stop" onClick={() => onGeometry({ clipPoints: [...node.geometry.clipPoints, { x: 50, y: 50 }] })} type="button"><Plus size={10} /> {t("Add clip point", "Agregar punto de recorte")}</button></div>}
    </Section>

    {textCapable && <Section title={t("Typography", "Tipografía")}>
      <SelectField label={t("Family", "Familia")} onChange={(family) => onStyle({ typography: { ...type, family } })} options={["body", "display", "mono"] as const} value={type.family} />
      <ColorField label={t("Text color", "Color de texto")} onChange={(color) => onStyle({ typography: { ...type, color } }, "style.typography.color")} value={type.color} />
      <Grid columns={2}><NumberField label={t("Size", "Tamaño")} min={6} onChange={(size) => onStyle({ typography: { ...type, size } })} value={type.size} suffix="px" /><NumberField label={t("Weight", "Peso")} max={950} min={100} onChange={(weight) => onStyle({ typography: { ...type, weight } })} step={50} value={type.weight} /></Grid>
      <Grid columns={2}><NumberField label={t("Line height", "Interlineado")} min={0.5} onChange={(lineHeight) => onStyle({ typography: { ...type, lineHeight } })} step={0.05} value={type.lineHeight} /><NumberField label={t("Tracking", "Espaciado")} onChange={(letterSpacing) => onStyle({ typography: { ...type, letterSpacing } })} step={0.1} value={type.letterSpacing} suffix="px" /></Grid>
      <SelectField label={t("Alignment", "Alineación")} onChange={(align) => onStyle({ typography: { ...type, align } })} options={["left", "center", "right", "justify"] as const} value={type.align} />
      <SelectField label={t("Case", "Capitalización")} onChange={(transform) => onStyle({ typography: { ...type, transform } })} options={["none", "uppercase", "lowercase", "capitalize"] as const} value={type.transform} />
      <div className="v5-inline-actions"><button aria-pressed={type.italic} onClick={() => onStyle({ typography: { ...type, italic: !type.italic } })} type="button"><i>I</i> {t("Italic", "Cursiva")}</button><button aria-pressed={type.underline} onClick={() => onStyle({ typography: { ...type, underline: !type.underline } })} type="button"><u>U</u> {t("Underline", "Subrayado")}</button></div>
    </Section>}
  </>;
}

function MaterialInspector({ locale, node, onStyle, onSurface }: StudioInspectorProps) {
  const t = (en: string, es: string) => tr(locale, en, es);
  const [paintId, setPaintId] = useState(node.style.fills[0]?.id ?? "");
  const [effectId, setEffectId] = useState(node.style.effects[0]?.id ?? "");
  const activePaint = node.style.fills.find((paint) => paint.id === paintId) ?? node.style.fills[0];
  const activeEffect = node.style.effects.find((effect) => effect.id === effectId) ?? node.style.effects[0];

  function updatePaint(id: string, patch: Partial<Paint>, property?: AnimatableProperty) {
    const index = node.style.fills.findIndex((paint) => paint.id === id);
    const key = Object.keys(patch)[0] as keyof Paint | undefined;
    const inferred = index >= 0 && key && ["color", "opacity", "angle", "centerX", "centerY"].includes(key)
      ? `style.fills.${index}.${key}` as AnimatableProperty
      : undefined;
    onStyle({ fills: node.style.fills.map((paint) => paint.id === id ? { ...paint, ...patch } : paint) }, property ?? inferred);
  }
  function updateEffect(id: string, patch: Partial<Effect>) {
    const index = node.style.effects.findIndex((effect) => effect.id === id);
    const key = Object.keys(patch)[0] as keyof Effect | undefined;
    const property = index >= 0 && key && ["color", "opacity", "x", "y", "blur", "spread"].includes(key)
      ? `style.effects.${index}.${key}` as AnimatableProperty
      : undefined;
    onStyle({ effects: node.style.effects.map((effect) => effect.id === id ? { ...effect, ...patch } : effect) }, property);
  }
  function move<T extends { id: string }>(items: T[], id: string, direction: -1 | 1) {
    const index = items.findIndex((item) => item.id === id);
    const target = Math.max(0, Math.min(items.length - 1, index + direction));
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  }

  return <>
    <Section title={t("Material recipes", "Recetas de material")}>
      <p className="v5-inspector-help">{t("Recipes create editable fill and effect stacks. Nothing stays locked to the preset.", "Las recetas crean pilas editables de rellenos y efectos. Nada queda bloqueado al preset.")}</p>
      <div className="v5-surface-recipes">{surfaces.map((surface) => <button aria-pressed={node.surface === surface} key={surface} onClick={() => onSurface(applySurfaceRecipe(node, surface))} type="button"><i className={`v5-surface-dot v5-surface-dot-${surface}`} />{surface}</button>)}</div>
    </Section>

    <Section actions={<button aria-label={t("Add fill", "Agregar relleno")} onClick={() => { const paint = createPaint("solid", "#ffffff"); onStyle({ fills: [...node.style.fills, paint] }); setPaintId(paint.id); }} type="button"><Plus size={12} /></button>} title={t("Fill stack", "Pila de rellenos")}>
      <div className="v5-stack-list">{node.style.fills.map((paint) => <div className={activePaint?.id === paint.id ? "active" : ""} key={paint.id}><button className="v5-stack-select" onClick={() => setPaintId(paint.id)} type="button"><GripVertical size={10} /><i style={{ background: paint.color }} /><span>{paint.name}</span><small>{paint.type}</small></button><button aria-label={paint.visible ? t("Hide fill", "Ocultar relleno") : t("Show fill", "Mostrar relleno")} className="v5-stack-visibility" onClick={() => updatePaint(paint.id, { visible: !paint.visible })} type="button">{paint.visible ? <Eye size={11} /> : <EyeOff size={11} />}</button></div>)}</div>
      {activePaint && <div className="v5-stack-editor">
        <TextField label={t("Name", "Nombre")} onChange={(name) => updatePaint(activePaint.id, { name })} value={activePaint.name} />
        <SelectField<PaintType> label={t("Fill type", "Tipo de relleno")} onChange={(type) => updatePaint(activePaint.id, { type })} options={paintTypes} value={activePaint.type} />
        <SelectField<BlendMode> label={t("Blend mode", "Modo de mezcla")} onChange={(blendMode) => updatePaint(activePaint.id, { blendMode })} options={blendModes} value={activePaint.blendMode} />
        {activePaint.type === "solid" && <ColorField label={t("Color", "Color")} onChange={(color) => updatePaint(activePaint.id, { color })} value={activePaint.color} />}
        {!["solid", "image", "noise", "pattern"].includes(activePaint.type) && <GradientEditor locale={locale} onChange={(stops, animated) => { const fillIndex = node.style.fills.findIndex((paint) => paint.id === activePaint.id); updatePaint(activePaint.id, { stops }, animated && fillIndex >= 0 ? `style.fills.${fillIndex}.stops.${animated.index}.${animated.key}` : undefined); }} stops={activePaint.stops} />}
        {["linear", "conic", "pattern"].includes(activePaint.type) && <RangeControl label={t("Angle", "Ángulo")} max={360} min={0} onChange={(angle) => updatePaint(activePaint.id, { angle })} value={activePaint.angle} suffix="°" />}
        {["radial", "conic", "diamond"].includes(activePaint.type) && <><Grid columns={2}><NumberField label={t("Center X", "Centro X")} max={100} min={0} onChange={(centerX) => updatePaint(activePaint.id, { centerX })} value={activePaint.centerX} suffix="%" /><NumberField label={t("Center Y", "Centro Y")} max={100} min={0} onChange={(centerY) => updatePaint(activePaint.id, { centerY })} value={activePaint.centerY} suffix="%" /></Grid><Grid columns={2}><NumberField label={t("Scale X", "Escala X")} min={1} onChange={(scaleX) => updatePaint(activePaint.id, { scaleX })} value={activePaint.scaleX} suffix="%" /><NumberField label={t("Scale Y", "Escala Y")} min={1} onChange={(scaleY) => updatePaint(activePaint.id, { scaleY })} value={activePaint.scaleY} suffix="%" /></Grid></>}
        {activePaint.type === "image" && <ImageFillEditor locale={locale} onChange={(imageUrl) => updatePaint(activePaint.id, { imageUrl })} onMode={(imageMode) => updatePaint(activePaint.id, { imageMode })} paint={activePaint} />}
        {(activePaint.type === "noise" || activePaint.type === "pattern") && <><ColorField label={t("Tint", "Tinte")} onChange={(color) => updatePaint(activePaint.id, { color })} value={activePaint.color} /><RangeControl label={t("Intensity", "Intensidad")} max={100} min={1} onChange={(intensity) => updatePaint(activePaint.id, { intensity })} value={activePaint.intensity} /><RangeControl label={t("Seed", "Semilla")} max={99} min={1} onChange={(seed) => updatePaint(activePaint.id, { seed })} value={activePaint.seed} /></>}
        <RangeControl label={t("Opacity", "Opacidad")} max={100} min={0} onChange={(opacity) => updatePaint(activePaint.id, { opacity })} value={activePaint.opacity} suffix="%" />
        <StackActions canDelete={node.style.fills.length > 0} locale={locale} onCopy={() => { const clone = { ...structuredClone(activePaint), id: createId("paint"), name: `${activePaint.name} copy` }; onStyle({ fills: [...node.style.fills, clone] }); setPaintId(clone.id); }} onDelete={() => onStyle({ fills: node.style.fills.filter((paint) => paint.id !== activePaint.id) })} onDown={() => onStyle({ fills: move(node.style.fills, activePaint.id, 1) })} onUp={() => onStyle({ fills: move(node.style.fills, activePaint.id, -1) })} />
      </div>}
    </Section>

    <Section actions={<button aria-label={t("Add effect", "Agregar efecto")} onClick={() => { const effect = createEffect(); onStyle({ effects: [...node.style.effects, effect] }); setEffectId(effect.id); }} type="button"><Plus size={12} /></button>} title={t("Effect stack", "Pila de efectos")}>
      <div className="v5-stack-list">{node.style.effects.map((effect) => <div className={activeEffect?.id === effect.id ? "active" : ""} key={effect.id}><button className="v5-stack-select" onClick={() => setEffectId(effect.id)} type="button"><GripVertical size={10} /><Blend size={11} /><span>{effect.name}</span><small>{effect.type}</small></button><button aria-label={effect.visible ? t("Hide effect", "Ocultar efecto") : t("Show effect", "Mostrar efecto")} className="v5-stack-visibility" onClick={() => updateEffect(effect.id, { visible: !effect.visible })} type="button">{effect.visible ? <Eye size={11} /> : <EyeOff size={11} />}</button></div>)}</div>
      {activeEffect && <div className="v5-stack-editor">
        <TextField label={t("Name", "Nombre")} onChange={(name) => updateEffect(activeEffect.id, { name })} value={activeEffect.name} />
        <SelectField<EffectType> label={t("Effect", "Efecto")} onChange={(type) => updateEffect(activeEffect.id, { type })} options={effectTypes} value={activeEffect.type} />
        <SelectField<BlendMode> label={t("Blend mode", "Modo de mezcla")} onChange={(blendMode) => updateEffect(activeEffect.id, { blendMode })} options={blendModes} value={activeEffect.blendMode} />
        {["dropShadow", "innerShadow", "glow", "innerGlow"].includes(activeEffect.type) && <><ColorField label={t("Color", "Color")} onChange={(color) => updateEffect(activeEffect.id, { color })} value={activeEffect.color} /><Grid columns={2}><NumberField label="X" onChange={(x) => updateEffect(activeEffect.id, { x })} value={activeEffect.x} /><NumberField label="Y" onChange={(y) => updateEffect(activeEffect.id, { y })} value={activeEffect.y} /></Grid><RangeControl label={t("Blur", "Desenfoque")} max={120} min={0} onChange={(blur) => updateEffect(activeEffect.id, { blur })} value={activeEffect.blur} suffix="px" /><RangeControl label={t("Spread", "Expansión")} max={60} min={-30} onChange={(spread) => updateEffect(activeEffect.id, { spread })} value={activeEffect.spread} suffix="px" /></>}
        {["layerBlur", "backgroundBlur"].includes(activeEffect.type) && <RangeControl label={t("Blur", "Desenfoque")} max={100} min={0} onChange={(blur) => updateEffect(activeEffect.id, { blur })} value={activeEffect.blur} suffix="px" />}
        {["noise", "texture", "backgroundBlur"].includes(activeEffect.type) && <RangeControl label={t("Intensity", "Intensidad")} max={100} min={0} onChange={(intensity) => updateEffect(activeEffect.id, { intensity })} value={activeEffect.intensity} />}
        <RangeControl label={t("Opacity", "Opacidad")} max={100} min={0} onChange={(opacity) => updateEffect(activeEffect.id, { opacity })} value={activeEffect.opacity} suffix="%" />
        <StackActions canDelete locale={locale} onCopy={() => { const clone = { ...structuredClone(activeEffect), id: createId("effect"), name: `${activeEffect.name} copy` }; onStyle({ effects: [...node.style.effects, clone] }); setEffectId(clone.id); }} onDelete={() => onStyle({ effects: node.style.effects.filter((effect) => effect.id !== activeEffect.id) })} onDown={() => onStyle({ effects: move(node.style.effects, activeEffect.id, 1) })} onUp={() => onStyle({ effects: move(node.style.effects, activeEffect.id, -1) })} />
      </div>}
    </Section>

    <Section title={t("Stroke & compositing", "Borde y composición")}>
      <ColorField label={t("Stroke color", "Color de borde")} onChange={(strokeColor) => onStyle({ strokeColor }, "style.strokeColor")} value={node.style.strokeColor} />
      <RangeControl label={t("Stroke opacity", "Opacidad de borde")} max={100} min={0} onChange={(strokeOpacity) => onStyle({ strokeOpacity })} value={node.style.strokeOpacity} suffix="%" />
      <RangeControl label={t("Stroke width", "Ancho de borde")} max={40} min={0} onChange={(strokeWidth) => onStyle({ strokeWidth }, "style.strokeWidth")} step={0.5} value={node.style.strokeWidth} suffix="px" />
      <SelectField label={t("Stroke style", "Estilo de borde")} onChange={(strokeStyle) => onStyle({ strokeStyle })} options={["solid", "dashed", "dotted", "double"] as const} value={node.style.strokeStyle} />
      <SelectField label={t("Stroke alignment", "Alineación de borde")} onChange={(strokeAlign) => onStyle({ strokeAlign })} options={["inside", "center", "outside"] as const} value={node.style.strokeAlign} />
      <SelectField<BlendMode> label={t("Layer blend", "Mezcla de capa")} onChange={(blendMode) => onStyle({ blendMode })} options={blendModes} value={node.style.blendMode} />
      <RangeControl label={t("Layer opacity", "Opacidad de capa")} max={100} min={0} onChange={(opacity) => onStyle({ opacity }, "style.opacity")} value={node.style.opacity} suffix="%" />
    </Section>
    <Section title={t("Color & optical filters", "Filtros de color y ópticos")}>
      <p className="v5-inspector-help">{t("These export as composable CSS filters and can be animated independently.", "Se exportan como filtros CSS combinables y pueden animarse de forma independiente.")}</p>
      <RangeControl label={t("Layer blur", "Desenfoque de capa")} max={100} min={0} onChange={(blur) => onStyle({ filters: { ...node.style.filters, blur } }, "style.filters.blur")} value={node.style.filters.blur} suffix="px" />
      <RangeControl label={t("Brightness", "Brillo")} max={300} min={0} onChange={(brightness) => onStyle({ filters: { ...node.style.filters, brightness } }, "style.filters.brightness")} value={node.style.filters.brightness} suffix="%" />
      <RangeControl label={t("Contrast", "Contraste")} max={300} min={0} onChange={(contrast) => onStyle({ filters: { ...node.style.filters, contrast } }, "style.filters.contrast")} value={node.style.filters.contrast} suffix="%" />
      <RangeControl label={t("Saturation", "Saturación")} max={300} min={0} onChange={(saturate) => onStyle({ filters: { ...node.style.filters, saturate } }, "style.filters.saturate")} value={node.style.filters.saturate} suffix="%" />
      <RangeControl label={t("Hue rotate", "Rotación de matiz")} max={360} min={-360} onChange={(hueRotate) => onStyle({ filters: { ...node.style.filters, hueRotate } }, "style.filters.hueRotate")} value={node.style.filters.hueRotate} suffix="°" />
      <button className="v5-wide-button" onClick={() => onStyle({ filters: { blur: 0, brightness: 100, contrast: 100, saturate: 100, hueRotate: 0 } })} type="button"><RotateCcw size={11} /> {t("Reset filters", "Restablecer filtros")}</button>
    </Section>
  </>;
}

function LayoutInspector({ device, locale, node, onLayout, onResponsive }: StudioInspectorProps) {
  const t = (en: string, es: string) => tr(locale, en, es);
  const layout = node.layout;
  const override = node.responsive[device];
  return <>
    <Section title={t("Layout flow", "Flujo de layout")}>
      <SelectField<LayoutMode> label={t("Mode", "Modo")} onChange={(mode) => onLayout({ mode })} options={["free", "horizontal", "vertical", "grid"]} value={layout.mode} />
      <SelectField label={t("Position", "Posición")} onChange={(position) => onLayout({ position })} options={["absolute", "relative"] as const} value={layout.position} />
      {layout.mode !== "free" && <>
        <ToggleField checked={layout.wrap} label={t("Wrap children", "Envolver elementos")} onChange={(wrap) => onLayout({ wrap })} />
        <Grid columns={2}><NumberField label="Gap" min={0} onChange={(gap) => onLayout({ gap })} value={layout.gap} /><NumberField label={t("Columns", "Columnas")} min={1} onChange={(columns) => onLayout({ columns })} value={layout.columns} /></Grid>
        <Grid columns={2}><NumberField label="Row gap" min={0} onChange={(rowGap) => onLayout({ rowGap })} value={layout.rowGap} /><NumberField label="Column gap" min={0} onChange={(columnGap) => onLayout({ columnGap })} value={layout.columnGap} /></Grid>
        <SelectField label={t("Align", "Alinear")} onChange={(align) => onLayout({ align })} options={["start", "center", "end", "stretch"] as const} value={layout.align} />
        <SelectField label={t("Distribute", "Distribuir")} onChange={(justify) => onLayout({ justify })} options={["start", "center", "end", "space-between", "space-around"] as const} value={layout.justify} />
      </>}
    </Section>
    <Section title={t("Padding", "Espaciado interno")}>
      <Grid columns={2}>{layout.padding.map((value, index) => <NumberField key={index} label={(locale === "es" ? ["Arriba", "Derecha", "Abajo", "Izquierda"] : ["Top", "Right", "Bottom", "Left"])[index]} min={0} onChange={(next) => { const padding = [...layout.padding] as NodeLayout["padding"]; padding[index] = next; onLayout({ padding }); }} value={value} />)}</Grid>
    </Section>
    <Section title={t("Sizing & constraints", "Tamaño y constraints")}>
      <SelectField label={t("Horizontal sizing", "Tamaño horizontal")} onChange={(horizontalSizing) => onLayout({ horizontalSizing })} options={["fixed", "hug", "fill"] as const} value={layout.horizontalSizing} />
      <SelectField label={t("Vertical sizing", "Tamaño vertical")} onChange={(verticalSizing) => onLayout({ verticalSizing })} options={["fixed", "hug", "fill"] as const} value={layout.verticalSizing} />
      <Grid columns={2}><NumberField label="Min W" min={0} onChange={(minWidth) => onLayout({ minWidth })} value={layout.minWidth} /><NumberField label="Max W" min={0} onChange={(maxWidth) => onLayout({ maxWidth })} value={layout.maxWidth} /><NumberField label="Min H" min={0} onChange={(minHeight) => onLayout({ minHeight })} value={layout.minHeight} /><NumberField label="Max H" min={0} onChange={(maxHeight) => onLayout({ maxHeight })} value={layout.maxHeight} /></Grid>
      <SelectField label={t("Horizontal constraint", "Constraint horizontal")} onChange={(horizontalConstraint) => onLayout({ horizontalConstraint })} options={["start", "center", "end", "stretch", "scale"] as const} value={layout.horizontalConstraint} />
      <SelectField label={t("Vertical constraint", "Constraint vertical")} onChange={(verticalConstraint) => onLayout({ verticalConstraint })} options={["start", "center", "end", "stretch", "scale"] as const} value={layout.verticalConstraint} />
    </Section>
    <Section actions={Object.keys(override).length ? <button aria-label={t("Clear breakpoint override", "Borrar override del breakpoint")} onClick={() => onResponsive(device, null)} type="button"><RotateCcw size={11} /></button> : undefined} title={`${t("Responsive override", "Override responsivo")} · ${device}`}>
      <p className="v5-inspector-help">{t("These values only affect the current device preview.", "Estos valores solo afectan la vista del dispositivo actual.")}</p>
      <Grid columns={2}><NumberField label="X" onChange={(x) => onResponsive(device, { ...override, transform: { ...override.transform, x } })} value={override.transform?.x ?? node.transform.x} /><NumberField label="Y" onChange={(y) => onResponsive(device, { ...override, transform: { ...override.transform, y } })} value={override.transform?.y ?? node.transform.y} /><NumberField label="W" min={1} onChange={(width) => onResponsive(device, { ...override, transform: { ...override.transform, width } })} value={override.transform?.width ?? node.transform.width} /><NumberField label="H" min={1} onChange={(height) => onResponsive(device, { ...override, transform: { ...override.transform, height } })} value={override.transform?.height ?? node.transform.height} /></Grid>
      <SelectField<LayoutMode> label={t("Responsive layout", "Layout responsivo")} onChange={(mode) => onResponsive(device, { ...override, layout: { ...override.layout, mode } })} options={["free", "horizontal", "vertical", "grid"]} value={override.layout?.mode ?? node.layout.mode} />
      <NumberField label={t("Responsive gap", "Gap responsivo")} min={0} onChange={(gap) => onResponsive(device, { ...override, layout: { ...override.layout, gap } })} value={override.layout?.gap ?? node.layout.gap} />
      <ToggleField checked={override.visible ?? node.visible} label={t("Visible on device", "Visible en dispositivo")} onChange={(visible) => onResponsive(device, { ...override, visible })} />
    </Section>
  </>;
}

function ComponentInspector({ document, locale, node, onAddComponentProperty, onAddVariable, onBindVariable, onComponentDefinition, onCreateComponent, onDeleteVariable, onInstanceOverrides, onVariable }: StudioInspectorProps) {
  const t = (en: string, es: string) => tr(locale, en, es);
  let componentOwner: StudioNode | undefined = node;
  while (componentOwner && !componentOwner.componentId) componentOwner = componentOwner.parentId ? document.nodes.find((candidate) => candidate.id === componentOwner!.parentId) : undefined;
  const definition = document.components.find((component) => component.rootNodeId === node.id || component.id === componentOwner?.componentId);
  const isInstance = Boolean(definition && componentOwner && definition.rootNodeId !== componentOwner.id);
  const instanceOverrides = componentOwner?.instanceOverrides ?? {};
  const [propertyName, setPropertyName] = useState("Label");
  const [propertyType, setPropertyType] = useState<ComponentPropertyType>("string");
  const [targetPath, setTargetPath] = useState("text");
  const [variableName, setVariableName] = useState("accent");
  const [variableType, setVariableType] = useState<VariableType>("color");
  const targetsByType: Record<ComponentPropertyType, readonly string[]> = {
    string: ["text", "secondaryText", "svgPath"],
    number: ["value", "transform.width", "transform.height"],
    color: ["style.fills.0.color", "style.typography.color"],
    boolean: ["visible", "checked"],
    enum: ["text", "secondaryText", "icon"],
    image: ["style.fills.0.imageUrl"],
    icon: ["icon"],
  };
  const compatibleTargets = targetsByType[propertyType];
  const effectiveTargetPath = compatibleTargets.includes(targetPath) ? targetPath : compatibleTargets[0];
  const canExpose = Boolean(propertyName.trim()) && !definition?.properties.some((property) => property.name.trim().toLocaleLowerCase() === propertyName.trim().toLocaleLowerCase());
  const canAddVariable = Boolean(variableName.trim()) && !document.variables.some((variable) => variable.name.trim().toLocaleLowerCase() === variableName.trim().toLocaleLowerCase());
  const compatibleVariables = (path: string) => {
    const expected: VariableType = path === "visible" || path === "checked"
      ? "boolean"
      : path === "value" || path.startsWith("transform.")
        ? "number"
        : path.includes("color")
          ? "color"
          : "string";
    return document.variables.filter((variable) => variable.type === expected);
  };
  return <>
    <Section title={t("Reusable component", "Componente reutilizable")}>
      {definition ? <><div className="v5-component-summary"><Component size={17} /><div><b>{definition.name}</b><span>{isInstance ? t("Editable instance", "Instancia editable") : t("Main component", "Componente principal")} · {definition.properties.length} {t("exposed properties", "propiedades expuestas")}</span></div></div>{!isInstance && <><TextField label={t("Component name", "Nombre del componente")} onChange={(name) => onComponentDefinition(definition.id, { name })} value={definition.name} /><TextArea label={t("Description", "Descripción")} onChange={(description) => onComponentDefinition(definition.id, { description })} value={definition.description} /></>}</> : <><p className="v5-inspector-help">{t("Turn the selection into a reusable component. Its children, variants and interactions stay attached.", "Convierte la selección en un componente reutilizable. Sus hijos, variantes e interacciones permanecen ligados.")}</p><button className="v5-wide-button" onClick={onCreateComponent} type="button"><Component size={12} /> {t("Create component", "Crear componente")}</button></>}
    </Section>
    {definition && <Section title={isInstance ? t("Instance properties", "Propiedades de instancia") : t("Exposed properties", "Propiedades expuestas")}>
      {isInstance ? <div className="v5-instance-properties">{definition.properties.map((property) => {
        const value = instanceOverrides[property.id] ?? property.defaultValue;
        const setValue = (next: string | number | boolean) => componentOwner && onInstanceOverrides(componentOwner.id, { ...instanceOverrides, [property.id]: next });
        if (property.type === "boolean") return <ToggleField checked={Boolean(value)} key={property.id} label={property.name} onChange={setValue} />;
        if (property.type === "number") return <NumberField key={property.id} label={property.name} onChange={setValue} value={Number(value)} />;
        if (property.type === "color") return <ColorField key={property.id} label={property.name} onChange={setValue} value={String(value)} />;
        if (property.type === "enum") return <SelectField key={property.id} label={property.name} onChange={setValue} options={property.options.length ? property.options : [String(value)]} value={String(value)} />;
        if (property.type === "icon") return <SelectField key={property.id} label={property.name} onChange={setValue} options={["arrow", "play", "heart", "sparkles", "plus", "check"]} value={String(value)} />;
        if (property.type === "image") return <div className="v5-instance-image" key={property.id}><TextField label={property.name} onChange={setValue} value={String(value)} /><label className="v5-upload-button"><ImagePlus size={11} /> {t("Upload override", "Subir override")}<input accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setValue(String(reader.result ?? "")); reader.readAsDataURL(file); }} type="file" /></label></div>;
        return <TextField key={property.id} label={property.name} onChange={setValue} value={String(value)} />;
      })}{!definition.properties.length && <p className="v5-inspector-help">{t("This component has no exposed properties yet.", "Este componente aún no tiene propiedades expuestas.")}</p>}<button className="v5-wide-button" disabled={!Object.keys(instanceOverrides).length} onClick={() => componentOwner && onInstanceOverrides(componentOwner.id, {})} type="button"><RotateCcw size={11} /> {t("Reset instance", "Restablecer instancia")}</button></div> : <>
        <div className="v5-property-list">{definition.properties.map((property) => <div key={property.id}><div><input aria-label={t("Property name", "Nombre de propiedad")} onChange={(event) => onComponentDefinition(definition.id, { properties: definition.properties.map((item) => item.id === property.id ? { ...item, name: event.target.value } : item) })} value={property.name} /><span>{property.type} → {property.targetPath}</span>{property.type === "enum" && <input aria-label={t("Enum options separated by commas", "Opciones enum separadas por comas")} onChange={(event) => onComponentDefinition(definition.id, { properties: definition.properties.map((item) => item.id === property.id ? { ...item, options: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) } : item) })} placeholder={t("Default, Alternative", "Predeterminado, Alternativo")} value={property.options.join(", ")} />}</div><button aria-label={t("Delete exposed property", "Eliminar propiedad expuesta")} onClick={() => onComponentDefinition(definition.id, { properties: definition.properties.filter((item) => item.id !== property.id) })} type="button"><Trash2 size={10} /></button></div>)}</div>
        <TextField label={t("Property name", "Nombre de propiedad")} onChange={setPropertyName} value={propertyName} />
        <SelectField<ComponentPropertyType> label={t("Type", "Tipo")} onChange={(type) => { setPropertyType(type); setTargetPath(targetsByType[type][0]); }} options={["string", "number", "color", "boolean", "enum", "image", "icon"]} value={propertyType} />
        <SelectField label={t("Compatible target", "Destino compatible")} onChange={setTargetPath} options={compatibleTargets} value={effectiveTargetPath} />
        {!canExpose && <p className="v5-inline-warning">{t("Use a unique, non-empty property name.", "Usa un nombre de propiedad único y no vacío.")}</p>}
        <button className="v5-wide-button" disabled={!canExpose} onClick={() => onAddComponentProperty(definition.id, propertyName.trim(), propertyType, effectiveTargetPath)} type="button"><Plus size={12} /> {t("Expose property", "Exponer propiedad")}</button>
      </>}
    </Section>}
    <Section title={t("Design variables", "Variables de diseño")}>
      <div className="v5-variable-list">{document.variables.map((variable) => <div key={variable.id}><Variable size={11} /><input aria-label={`${variable.name} ${t("name", "nombre")}`} onChange={(event) => onVariable(variable.id, { name: event.target.value })} value={variable.name} /><VariableValue locale={locale} variable={variable} onChange={(value) => onVariable(variable.id, { value })} /><button aria-label={t("Delete variable", "Eliminar variable")} onClick={() => onDeleteVariable(variable.id)} type="button"><Trash2 size={10} /></button></div>)}</div>
      <Grid columns={2}><TextField label={t("Name", "Nombre")} onChange={setVariableName} value={variableName} /><SelectField<VariableType> label={t("Type", "Tipo")} onChange={setVariableType} options={["string", "number", "color", "boolean"]} value={variableType} /></Grid>
      {!canAddVariable && <p className="v5-inline-warning">{t("Use a unique, non-empty variable name.", "Usa un nombre de variable único y no vacío.")}</p>}
      <button className="v5-wide-button" disabled={!canAddVariable} onClick={() => { const defaultValue = variableType === "color" ? "#ff8068" : variableType === "number" ? 0 : variableType === "boolean" ? false : "Text"; onAddVariable({ id: createId("variable"), name: variableName.trim(), type: variableType, value: defaultValue, defaultValue }); }} type="button"><Plus size={12} /> {t("Add variable", "Agregar variable")}</button>
    </Section>
    <Section title={t("Variable bindings", "Enlaces de variables")}>
      {["text", "secondaryText", "visible", "checked", "value", "style.fills.0.color", "style.fills.0.imageUrl", "style.typography.color", "transform.width", "transform.height"].map((path) => <label className="v5-bind-row" key={path}><span>{path}</span><select onChange={(event) => onBindVariable(path, event.target.value)} value={node.bindings[path] ?? ""}><option value="">—</option>{compatibleVariables(path).map((variable) => <option key={variable.id} value={variable.id}>{variable.name}</option>)}</select></label>)}
    </Section>
  </>;
}

function InteractionsInspector({ activeVariantId, document, locale, node, onAddInteraction, onDeleteInteraction, onDeleteVariant, onInteraction, onSetVariant, onUpsertVariant }: StudioInspectorProps) {
  const t = (en: string, es: string) => tr(locale, en, es);
  const interactions = document.interactions.filter((interaction) => interaction.sourceNodeId === node.id);
  const [trigger, setTrigger] = useState<TriggerType>("click");
  const [action, setAction] = useState<StudioInteraction["action"]>("changeVariant");
  const [targetVariantId, setTargetVariantId] = useState(document.variants.find((variant) => variant.id !== activeVariantId)?.id ?? (activeVariantId === "base" ? document.variants[0]?.id ?? "" : "base"));
  const [newUrl, setNewUrl] = useState("https://");
  const [variantName, setVariantName] = useState(locale === "es" ? "Nuevo estado" : "New state");
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const variantIds = ["base", ...document.variants.map((variant) => variant.id)];
  const targetVariantIds = variantIds.filter((id) => id !== activeVariantId);
  const effectiveTargetVariantId = targetVariantIds.includes(targetVariantId) ? targetVariantId : targetVariantIds[0] ?? "";
  const variantLabel = (id: string) => id === "base" ? "Base" : document.variants.find((variant) => variant.id === id)?.name ?? id;
  const actionNeedsVariant = action === "changeVariant" || action === "toggleVariant";
  const actionNeedsVariable = action === "setVariable";
  const actionNeedsUrl = action === "openUrl";
  const validUrl = /^(?:https?:\/\/|mailto:|tel:)\S+/i.test(newUrl.trim());
  const canAddInteraction = (!actionNeedsVariant || Boolean(effectiveTargetVariantId)) && (!actionNeedsVariable || document.variables.length > 0) && (!actionNeedsUrl || validUrl);
  const standardStates = [
    { name: "Hover", label: t("Hover", "Al pasar") },
    { name: "Pressed", label: t("Pressed", "Presionado") },
    { name: "Focus", label: t("Focus", "En foco") },
    { name: "Disabled", label: t("Disabled", "Desactivado") },
    { name: "Loading", label: t("Loading", "Cargando") },
    { name: "Success", label: t("Success", "Éxito") },
    { name: "Error", label: t("Error", "Error") },
  ];
  return <>
    <Section actions={<button aria-label={t("Add variant", "Agregar variante")} disabled={!variantName.trim()} onClick={() => onUpsertVariant({ id: createId("variant"), name: variantName.trim(), description: "", overrides: {} })} type="button"><Plus size={12} /></button>} title={t("States & variants", "Estados y variantes")}>
      <TextField label={t("New variant name", "Nombre de nueva variante")} onChange={setVariantName} value={variantName} />
      <div className="v5-standard-states">{standardStates.map(({ label, name }) => <button disabled={document.variants.some((variant) => variant.name.toLowerCase() === name.toLowerCase())} key={name} onClick={() => onUpsertVariant({ id: createId("variant"), name, description: t(`${name} component state`, `Estado ${label.toLowerCase()} del componente`), overrides: {} })} type="button">+ {label}</button>)}</div>
      <div className="v5-variant-list">
        <button aria-pressed={activeVariantId === "base"} onClick={() => onSetVariant("base")} type="button"><i />Base</button>
        {document.variants.map((variant) => <div key={variant.id}><button aria-pressed={activeVariantId === variant.id} onClick={() => onSetVariant(variant.id)} type="button"><i />{variant.name}</button><button aria-label={t("Delete variant", "Eliminar variante")} onClick={() => onDeleteVariant(variant.id)} type="button"><Trash2 size={10} /></button></div>)}
      </div>
      <div className="v5-state-graph">
        <p>{connectionStart ? t("Choose the destination state", "Elige el estado destino") : t("Click a state, then another, to connect them", "Haz clic en un estado y luego en otro para conectarlos")}</p>
        <div>{variantIds.map((variantId) => <button aria-pressed={connectionStart === variantId} key={variantId} onClick={() => {
          if (!connectionStart || connectionStart === variantId) { setConnectionStart(connectionStart === variantId ? null : variantId); onSetVariant(variantId); return; }
          onAddInteraction({ id: createId("interaction"), sourceNodeId: node.id, sourceVariantId: connectionStart, trigger: "click", action: "changeVariant", targetVariantId: variantId, delay: 0, key: "Enter", transition: "smart", duration: .35, easing: "easeInOut" });
          setConnectionStart(null);
        }} type="button"><i />{variantLabel(variantId)}</button>)}</div>
        <div className="v5-state-edges">{interactions.filter((interaction) => interaction.targetVariantId).map((interaction) => <span key={interaction.id}>{variantLabel(interaction.sourceVariantId)} <b>→</b> {variantLabel(interaction.targetVariantId!)} <small>{interaction.trigger}</small></span>)}</div>
      </div>
      <p className="v5-inspector-help">{t("Edit the selected variant directly on the canvas. Base geometry stays untouched.", "Edita la variante seleccionada directamente en el lienzo. La geometría base permanece intacta.")}</p>
    </Section>
    <Section actions={<button aria-label={t("Add configured interaction", "Agregar interacción configurada")} disabled={!canAddInteraction} onClick={() => onAddInteraction({ id: createId("interaction"), sourceNodeId: node.id, sourceVariantId: activeVariantId, trigger, action, targetVariantId: actionNeedsVariant ? effectiveTargetVariantId : undefined, variableId: actionNeedsVariable ? document.variables[0]?.id : undefined, value: actionNeedsVariable ? document.variables[0]?.value : undefined, url: actionNeedsUrl ? newUrl.trim() : undefined, delay: 0, key: "Enter", transition: "smart", duration: 0.35, easing: "easeInOut" })} type="button"><Plus size={12} /></button>} title={t("Prototype connections", "Conexiones de prototipo")}>
      <SelectField<TriggerType> label={t("Trigger", "Disparador")} onChange={setTrigger} options={["click", "doubleClick", "hover", "hoverEnd", "focus", "blur", "mouseDown", "mouseUp", "drag", "swipe", "scroll", "key", "load", "delay", "variable"]} value={trigger} />
      <SelectField label={t("Action", "Acción")} onChange={setAction} options={["changeVariant", "toggleVariant", "setVariable", "playTimeline", "pauseTimeline", "reverseTimeline", "openUrl"] as const} value={action} />
      {actionNeedsVariant && <SelectField label={t("Target state (must be different)", "Estado destino (debe ser diferente)")} onChange={setTargetVariantId} options={targetVariantIds} render={variantLabel} value={effectiveTargetVariantId} />}
      {actionNeedsUrl && <TextField label={t("Safe URL (https, mailto or tel)", "URL segura (https, mailto o tel)")} onChange={setNewUrl} value={newUrl} />}
      {actionNeedsUrl && !validUrl && <p className="v5-inline-warning">{t("Enter a complete, supported URL before adding the interaction.", "Escribe una URL completa y compatible antes de agregar la interacción.")}</p>}
      {actionNeedsVariant && !targetVariantIds.length && <p className="v5-inline-warning">{t("Create another state before adding this interaction.", "Crea otro estado antes de agregar esta interacción.")}</p>}
      {actionNeedsVariable && !document.variables.length && <p className="v5-inline-warning">{t("Create a variable in the Component tab first.", "Crea primero una variable en la pestaña Componente.")}</p>}
      <div className="v5-interaction-list">{interactions.map((interaction) => <div key={interaction.id}>
        <div className="v5-interaction-title"><Link2 size={11} /><b>{interaction.trigger}</b><span>→ {interaction.action}</span><button aria-label={t("Delete interaction", "Eliminar interacción")} onClick={() => onDeleteInteraction(interaction.id)} type="button"><Trash2 size={10} /></button></div>
        <SelectField label={t("Trigger", "Disparador")} onChange={(nextTrigger) => onInteraction(interaction.id, { trigger: nextTrigger })} options={["click", "doubleClick", "hover", "hoverEnd", "focus", "blur", "mouseDown", "mouseUp", "drag", "swipe", "scroll", "key", "load", "delay", "variable"] as const} value={interaction.trigger} />
        {interaction.trigger === "key" && <TextField label={t("Keyboard key", "Tecla")} onChange={(key) => onInteraction(interaction.id, { key })} value={interaction.key} />}
        <SelectField label={t("Action", "Acción")} onChange={(action) => onInteraction(interaction.id, { action })} options={["changeVariant", "toggleVariant", "setVariable", "playTimeline", "pauseTimeline", "reverseTimeline", "openUrl"] as const} value={interaction.action} />
        {(interaction.action === "changeVariant" || interaction.action === "toggleVariant") && <SelectField label={t("Target variant", "Variante destino")} onChange={(target) => onInteraction(interaction.id, { targetVariantId: target })} options={variantIds} render={variantLabel} value={interaction.targetVariantId ?? "base"} />}
        {interaction.action === "setVariable" && <><SelectField label={t("Variable", "Variable")} onChange={(variableId) => onInteraction(interaction.id, { variableId })} options={document.variables.map((variable) => variable.id)} render={(id) => document.variables.find((variable) => variable.id === id)?.name ?? id} value={interaction.variableId ?? document.variables[0]?.id ?? ""} /><TextField label={t("Value or expression", "Valor o expresión")} onChange={(value) => onInteraction(interaction.id, { value })} value={String(interaction.value ?? "")} /></>}
        {interaction.action === "openUrl" && <TextField label="URL" onChange={(url) => onInteraction(interaction.id, { url })} value={interaction.url ?? ""} />}
        <SelectField label={t("Transition", "Transición")} onChange={(transition) => onInteraction(interaction.id, { transition })} options={["smart", "instant", "dissolve"] as const} value={interaction.transition} />
        <SelectField label={t("Easing", "Curva")} onChange={(easing) => onInteraction(interaction.id, { easing })} options={["linear", "easeIn", "easeOut", "easeInOut", "cubicBezier", "spring"] as const} value={interaction.easing} />
        <Grid columns={2}><NumberField label={t("Duration", "Duración")} min={0} onChange={(duration) => onInteraction(interaction.id, { duration })} step={0.05} value={interaction.duration} suffix="s" /><NumberField label={t("Delay", "Retraso")} min={0} onChange={(delay) => onInteraction(interaction.id, { delay })} step={0.05} value={interaction.delay} suffix="s" /></Grid>
        {interaction.condition ? <div className="v5-condition-editor"><SelectField label={t("If variable", "Si la variable")} onChange={(variableId) => onInteraction(interaction.id, { condition: { ...interaction.condition!, variableId } })} options={document.variables.map((variable) => variable.id)} render={(id) => document.variables.find((variable) => variable.id === id)?.name ?? id} value={interaction.condition.variableId} /><SelectField label={t("Operator", "Operador")} onChange={(operator) => onInteraction(interaction.id, { condition: { ...interaction.condition!, operator } })} options={["equals", "notEquals", "greater", "less"] as const} value={interaction.condition.operator} /><TextField label={t("Compare with", "Comparar con")} onChange={(value) => onInteraction(interaction.id, { condition: { ...interaction.condition!, value } })} value={String(interaction.condition.value)} /><button onClick={() => onInteraction(interaction.id, { condition: undefined })} type="button"><Trash2 size={10} /> {t("Remove condition", "Eliminar condición")}</button></div> : <button className="v5-wide-button" disabled={!document.variables.length} onClick={() => onInteraction(interaction.id, { condition: { variableId: document.variables[0].id, operator: "equals", value: document.variables[0].value } })} type="button"><Plus size={10} /> {t("Add condition", "Agregar condición")}</button>}
      </div>)}</div>
      {!interactions.length && <p className="v5-inspector-help">{t("Create multiple actions with the same trigger to run them together.", "Crea varias acciones con el mismo disparador para ejecutarlas juntas.")}</p>}
    </Section>
  </>;
}

function AccessibilityInspector({ locale, node, onAccessibility }: StudioInspectorProps) {
  const t = (en: string, es: string) => tr(locale, en, es);
  const a11y = node.accessibility;
  return <>
    <Section title={t("Semantic output", "Salida semántica")}>
      <SelectField label={t("HTML element", "Elemento HTML")} onChange={(semanticTag) => onAccessibility({ semanticTag })} options={["div", "button", "article", "section", "label", "input", "p", "span"] as const} value={a11y.semanticTag} />
      <TextField label="ARIA role" onChange={(role) => onAccessibility({ role })} value={a11y.role} />
      <TextField label="ARIA label" onChange={(ariaLabel) => onAccessibility({ ariaLabel })} value={a11y.ariaLabel} />
      <NumberField label="Tab index" onChange={(tabIndex) => onAccessibility({ tabIndex })} value={a11y.tabIndex} />
      <ToggleField checked={a11y.decorative} label={t("Decorative layer", "Capa decorativa")} onChange={(decorative) => onAccessibility({ decorative })} />
      <ToggleField checked={a11y.reducedMotion} label={t("Respect reduced motion", "Respetar movimiento reducido")} onChange={(reducedMotion) => onAccessibility({ reducedMotion })} />
    </Section>
    <Section title={t("Accessibility checks", "Revisiones de accesibilidad")}>
      <CheckRow ok={a11y.decorative || Boolean(a11y.ariaLabel)} text={t("Accessible name", "Nombre accesible")} />
      <CheckRow ok={a11y.decorative || a11y.tabIndex >= 0 || !["button", "input", "toggle", "slider"].includes(node.kind)} text={t("Keyboard reachable", "Accesible con teclado")} />
      <CheckRow ok={a11y.reducedMotion} text={t("Reduced-motion fallback", "Alternativa con movimiento reducido")} />
      <CheckRow ok={node.transform.width >= 44 && node.transform.height >= 44} text={t("44px touch target", "Objetivo táctil de 44px")} />
    </Section>
  </>;
}

function GradientEditor({ locale, stops, onChange }: { locale: Locale; stops: Paint["stops"]; onChange: (stops: Paint["stops"], animated?: { index: number; key: "color" | "position" | "opacity" }) => void }) {
  const t = (en: string, es: string) => tr(locale, en, es);
  function update(id: string, patch: Partial<Paint["stops"][number]>) {
    const index = stops.findIndex((stop) => stop.id === id);
    const key = Object.keys(patch)[0] as "color" | "position" | "opacity" | undefined;
    onChange(stops.map((stop) => stop.id === id ? { ...stop, ...patch } : stop), index >= 0 && key ? { index, key } : undefined);
  }
  return <div className="v5-gradient-editor"><div className="v5-gradient-preview" style={{ background: `linear-gradient(90deg, ${[...stops].sort((a, b) => a.position - b.position).map((stop) => `${stop.color} ${stop.position}%`).join(", ")})` }} />{stops.map((stop) => <div className="v5-gradient-stop" key={stop.id}><input aria-label={t("Stop color", "Color del punto")} onChange={(event) => update(stop.id, { color: event.target.value })} type="color" value={safeColor(stop.color)} /><InlineNumberInput ariaLabel={t("Stop position", "Posición del punto")} max={100} min={0} onCommit={(position) => update(stop.id, { position })} value={stop.position} /><span>%</span><InlineNumberInput ariaLabel={t("Stop opacity", "Opacidad del punto")} max={100} min={0} onCommit={(opacity) => update(stop.id, { opacity })} value={stop.opacity} /><span>%</span><button aria-label={t("Delete stop", "Eliminar punto")} disabled={stops.length <= 2} onClick={() => onChange(stops.filter((item) => item.id !== stop.id))} type="button"><Minus size={10} /></button></div>)}<button className="v5-add-stop" onClick={() => onChange([...stops, createGradientStop("#ffffff", 50)])} type="button"><Plus size={11} /> {t("Add color stop", "Agregar punto de color")}</button></div>;
}

function ImageFillEditor({ locale, paint, onChange, onMode }: { locale: Locale; paint: Paint; onChange: (url: string) => void; onMode: (mode: Paint["imageMode"]) => void }) {
  const t = (en: string, es: string) => tr(locale, en, es);
  return <div className="v5-image-fill"><TextField label={t("Image URL", "URL de imagen")} onChange={onChange} value={paint.imageUrl} /><label className="v5-upload-button"><ImagePlus size={12} /> {t("Upload image", "Subir imagen")}<input accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => onChange(String(reader.result ?? "")); reader.readAsDataURL(file); }} type="file" /></label><SelectField label={t("Fit", "Ajuste")} onChange={onMode} options={["fill", "fit", "crop", "tile"] as const} value={paint.imageMode} /></div>;
}

function VariableValue({ locale, variable, onChange }: { locale: Locale; variable: StudioVariable; onChange: (value: string | number | boolean) => void }) {
  const label = `${variable.name} ${tr(locale, "value", "valor")}`;
  if (variable.type === "boolean") return <input aria-label={label} checked={Boolean(variable.value)} onChange={(event) => onChange(event.target.checked)} type="checkbox" />;
  if (variable.type === "color") return <input aria-label={label} onChange={(event) => onChange(event.target.value)} type="color" value={safeColor(String(variable.value))} />;
  if (variable.type === "number") return <InlineNumberInput ariaLabel={label} onCommit={onChange} value={Number(variable.value)} />;
  return <input aria-label={label} onChange={(event) => onChange(event.target.value)} type="text" value={String(variable.value)} />;
}

function CheckRow({ ok, text }: { ok: boolean; text: string }) { return <div className={`v5-check-row ${ok ? "ok" : "warn"}`}><i>{ok ? "✓" : "!"}</i><span>{text}</span></div>; }

function StackActions({ canDelete, locale, onCopy, onDelete, onDown, onUp }: { canDelete: boolean; locale: Locale; onCopy: () => void; onDelete: () => void; onDown: () => void; onUp: () => void }) {
  const t = (en: string, es: string) => tr(locale, en, es);
  return <div className="v5-stack-actions"><button aria-label={t("Move up", "Mover arriba")} onClick={onUp} type="button"><ChevronUp size={11} /></button><button aria-label={t("Move down", "Mover abajo")} onClick={onDown} type="button"><ChevronDown size={11} /></button><button aria-label={t("Duplicate", "Duplicar")} onClick={onCopy} type="button"><Copy size={11} /></button><button aria-label={t("Delete", "Eliminar")} disabled={!canDelete} onClick={onDelete} type="button"><Trash2 size={11} /></button></div>;
}

function PivotGrid({ locale, x, y, onChange }: { locale: Locale; x: number; y: number; onChange: (x: number, y: number) => void }) {
  return <div className="v5-pivot-grid">{[0, 50, 100].flatMap((py) => [0, 50, 100].map((px) => <button aria-label={`${tr(locale, "Pivot", "Pivote")} ${px} ${py}`} aria-pressed={Math.abs(x - px) < 1 && Math.abs(y - py) < 1} key={`${px}-${py}`} onClick={() => onChange(px, py)} type="button"><i /></button>))}</div>;
}

function InlineNumberInput({ ariaLabel, max, min, onCommit, step = 1, value }: { ariaLabel: string; max?: number; min?: number; onCommit: (value: number) => void; step?: number; value: number }) {
  const formatted = Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  const commit = (event: FocusEvent<HTMLInputElement>) => {
    const parsed = Number(event.currentTarget.value);
    if (!Number.isFinite(parsed) || event.currentTarget.value.trim() === "") { event.currentTarget.value = formatted; return; }
    const next = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, parsed));
    event.currentTarget.value = String(next);
    if (next !== value) onCommit(next);
  };
  return <input aria-label={ariaLabel} defaultValue={formatted} key={formatted} max={max} min={min} onBlur={commit} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); if (event.key === "Escape") { event.currentTarget.value = formatted; event.currentTarget.blur(); } }} step={step} type="number" />;
}

function Section({ actions, children, title }: { actions?: ReactNode; children: ReactNode; title: string }) {
  const advanced = /3D|optical|ópticos|instance properties|propiedades de instancia|exposed properties|propiedades expuestas|variable bindings|enlaces de variables/i.test(title);
  return <section className="v5-inspector-section" data-advanced={advanced || undefined}><div className="v5-section-title"><span>{title}</span><div className="v5-section-actions">{actions}<HelpButton label={title} /></div></div>{children}</section>;
}
function Grid({ children, columns }: { children: ReactNode; columns: number }) { return <div className="v5-control-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>{children}</div>; }

function NumberField({ label, max, min, onChange, step = 1, suffix = "", value }: { label: string; max?: number; min?: number; onChange: (value: number) => void; step?: number; suffix?: string; value: number }) {
  const formatted = Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  const commit = (event: FocusEvent<HTMLInputElement>) => {
    const draft = event.currentTarget.value;
    if (draft.trim() === "" || draft === "-" || draft === "." || draft === "-.") { event.currentTarget.value = formatted; return; }
    const parsed = Number(draft);
    if (!Number.isFinite(parsed)) { event.currentTarget.value = formatted; return; }
    const next = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, parsed));
    event.currentTarget.value = String(next);
    if (next !== value) onChange(next);
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") event.currentTarget.blur();
    if (event.key === "Escape") { event.currentTarget.value = formatted; event.currentTarget.blur(); }
  };
  return <label className="v5-number-field"><span><i>{label}</i><HelpButton label={label} /></span><div><input defaultValue={formatted} key={formatted} max={max} min={min} onBlur={commit} onKeyDown={keyDown} step={step} type="number" />{suffix && <small>{suffix}</small>}</div></label>;
}
function RangeControl({ label, max, min, onChange, step = 1, suffix = "", value }: { label: string; max: number; min: number; onChange: (value: number) => void; step?: number; suffix?: string; value: number }) {
  return <label className="v5-range-field"><span><i>{label}<HelpButton label={label} /></i><b>{Number.isInteger(value) ? value : Number(value.toFixed(2))}{suffix}</b></span><input max={max} min={min} onChange={(event) => onChange(Number(event.target.value))} step={step} type="range" value={value} /></label>;
}
function TextField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) { return <label className="v5-text-field"><span><i>{label}</i><HelpButton label={label} /></span><input onChange={(event) => onChange(event.target.value)} type="text" value={value} /></label>; }
function TextArea({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) { return <label className="v5-text-field"><span><i>{label}</i><HelpButton label={label} /></span><textarea onChange={(event) => onChange(event.target.value)} rows={2} value={value} /></label>; }
function safeColor(value: string) { return /^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff"; }
function ColorField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) { return <label className="v5-color-field"><span><i>{label}</i><HelpButton label={label} /></span><div><input onChange={(event) => onChange(event.target.value)} type="color" value={safeColor(value)} /><input aria-label={`${label} value`} onChange={(event) => onChange(event.target.value)} value={value} /></div></label>; }
function ToggleField({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) { return <label className="v5-toggle-field"><span><i>{label}</i><HelpButton label={label} /></span><button aria-checked={checked} onClick={() => onChange(!checked)} role="switch" type="button"><i /></button></label>; }

function SelectField<const T extends string>({ label, onChange, options, render, value }: { label: string; onChange: (value: T) => void; options: readonly T[]; render?: (value: T) => string; value: T }) {
  return <label className="v5-select-field"><span><i>{label}</i><HelpButton label={label} /></span><select onChange={(event) => onChange(event.target.value as T)} value={value}>{options.map((option) => <option key={option} value={option}>{render ? render(option) : option}</option>)}</select></label>;
}
