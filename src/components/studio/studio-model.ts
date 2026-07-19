export type Surface = "clay" | "glass" | "skeuo" | "adaptive" | "custom";
export type Device = "desktop" | "tablet" | "mobile";
export type StudioTool = "select" | "frame" | "rectangle" | "ellipse" | "line" | "arrow" | "polygon" | "star" | "pen" | "text";
export type NodeKind =
  | "frame"
  | "group"
  | "rectangle"
  | "ellipse"
  | "line"
  | "arrow"
  | "polygon"
  | "star"
  | "text"
  | "image"
  | "icon"
  | "vector"
  | "button"
  | "input"
  | "toggle"
  | "slider"
  | "dial"
  | "progress"
  | "boolean"
  | "componentInstance";

export type InspectorTab = "design" | "material" | "layout" | "component" | "interactions" | "accessibility";
export type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "hard-light" | "color-dodge" | "color-burn" | "difference" | "exclusion";
export type PaintType = "solid" | "linear" | "radial" | "conic" | "diamond" | "image" | "noise" | "pattern";
export type EffectType = "dropShadow" | "innerShadow" | "layerBlur" | "backgroundBlur" | "glow" | "innerGlow" | "noise" | "texture";
export type StrokeAlign = "inside" | "center" | "outside";
export type BooleanOperation = "union" | "subtract" | "intersect" | "exclude";
export type LayoutMode = "free" | "horizontal" | "vertical" | "grid";
export type PositionMode = "absolute" | "relative";
export type SizingMode = "fixed" | "hug" | "fill";
export type Constraint = "start" | "center" | "end" | "stretch" | "scale";
export type VariableType = "string" | "number" | "color" | "boolean";
export type ComponentPropertyType = VariableType | "enum" | "image" | "icon";
export type TriggerType = "click" | "doubleClick" | "hover" | "hoverEnd" | "focus" | "blur" | "mouseDown" | "mouseUp" | "drag" | "swipe" | "scroll" | "key" | "load" | "delay" | "variable";
export type ActionType = "changeVariant" | "toggleVariant" | "setVariable" | "playTimeline" | "pauseTimeline" | "reverseTimeline" | "openUrl";
export type TransitionType = "smart" | "instant" | "dissolve";
export type EasingType = "linear" | "easeIn" | "easeOut" | "easeInOut" | "cubicBezier" | "spring";

export type Point = { x: number; y: number };
export type VectorPoint = Point & {
  id: string;
  handleIn?: Point;
  handleOut?: Point;
  corner?: boolean;
};

export type GradientStop = {
  id: string;
  color: string;
  position: number;
  opacity: number;
  variableId?: string;
};

export type Paint = {
  id: string;
  name: string;
  type: PaintType;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  color: string;
  stops: GradientStop[];
  angle: number;
  centerX: number;
  centerY: number;
  scaleX: number;
  scaleY: number;
  imageUrl: string;
  imageMode: "fill" | "fit" | "crop" | "tile";
  intensity: number;
  seed: number;
};

export type Effect = {
  id: string;
  name: string;
  type: EffectType;
  visible: boolean;
  blendMode: BlendMode;
  color: string;
  opacity: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  intensity: number;
};

export type NodeTransform = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  pivotX: number;
  pivotY: number;
  perspective: number;
  flipX: boolean;
  flipY: boolean;
};

export type NodeGeometry = {
  cornerRadii: [number, number, number, number];
  cornerSmoothing: number;
  clipPoints: Point[];
  vectorPoints: VectorPoint[];
  closed: boolean;
  polygonSides: number;
  starRatio: number;
  booleanOperation: BooleanOperation;
  mask: boolean;
  clipChildren: boolean;
};

export type NodeTypography = {
  family: "body" | "display" | "mono";
  color: string;
  size: number;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
  align: "left" | "center" | "right" | "justify";
  transform: "none" | "uppercase" | "lowercase" | "capitalize";
  italic: boolean;
  underline: boolean;
};

export type NodeStyle = {
  fills: Paint[];
  effects: Effect[];
  filters: {
    blur: number;
    brightness: number;
    contrast: number;
    saturate: number;
    hueRotate: number;
  };
  opacity: number;
  blendMode: BlendMode;
  strokeColor: string;
  strokeOpacity: number;
  strokeWidth: number;
  strokeStyle: "solid" | "dashed" | "dotted" | "double";
  strokeAlign: StrokeAlign;
  typography: NodeTypography;
};

export type NodeLayout = {
  mode: LayoutMode;
  position: PositionMode;
  direction: "row" | "column";
  wrap: boolean;
  gap: number;
  rowGap: number;
  columnGap: number;
  padding: [number, number, number, number];
  align: "start" | "center" | "end" | "stretch";
  justify: "start" | "center" | "end" | "space-between" | "space-around";
  columns: number;
  horizontalSizing: SizingMode;
  verticalSizing: SizingMode;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  horizontalConstraint: Constraint;
  verticalConstraint: Constraint;
};

export type AccessibilitySettings = {
  semanticTag: "div" | "button" | "article" | "section" | "label" | "input" | "p" | "span";
  role: string;
  ariaLabel: string;
  tabIndex: number;
  decorative: boolean;
  reducedMotion: boolean;
};

export type ResponsiveOverride = {
  transform?: Partial<NodeTransform>;
  layout?: Partial<NodeLayout>;
  visible?: boolean;
};

export type StudioNode = {
  id: string;
  parentId: string | null;
  childIds: string[];
  kind: NodeKind;
  name: string;
  text: string;
  secondaryText: string;
  visible: boolean;
  locked: boolean;
  expanded: boolean;
  surface: Surface;
  transform: NodeTransform;
  geometry: NodeGeometry;
  style: NodeStyle;
  layout: NodeLayout;
  responsive: Record<Device, ResponsiveOverride>;
  value: number;
  checked: boolean;
  icon: "arrow" | "play" | "heart" | "sparkles" | "plus" | "check";
  svgPath: string;
  svgViewBox: string;
  componentId?: string;
  /** Original layer id carried by a component instance clone. */
  instanceSourceId?: string;
  instanceOverrides: Record<string, string | number | boolean>;
  bindings: Record<string, string>;
  accessibility: AccessibilitySettings;
};

export type AnimatableProperty =
  | "transform.x"
  | "transform.y"
  | "transform.z"
  | "transform.width"
  | "transform.height"
  | "transform.rotationX"
  | "transform.rotationY"
  | "transform.rotationZ"
  | "transform.scaleX"
  | "transform.scaleY"
  | "transform.skewX"
  | "transform.skewY"
  | "transform.pivotX"
  | "transform.pivotY"
  | "transform.perspective"
  | "style.opacity"
  | "style.strokeWidth"
  | "style.strokeColor"
  | "style.typography.color"
  | "style.fills.0.color"
  | "style.fills.0.opacity"
  | "style.fills.0.angle"
  | "style.fills.0.centerX"
  | "style.fills.0.centerY"
  | `style.fills.${number}.color`
  | `style.fills.${number}.opacity`
  | `style.fills.${number}.angle`
  | `style.fills.${number}.centerX`
  | `style.fills.${number}.centerY`
  | `style.fills.${number}.stops.${number}.color`
  | `style.fills.${number}.stops.${number}.position`
  | `style.fills.${number}.stops.${number}.opacity`
  | "style.filters.blur"
  | "style.filters.brightness"
  | "style.filters.contrast"
  | "style.filters.saturate"
  | "style.filters.hueRotate"
  | "style.effects.0.color"
  | "style.effects.0.opacity"
  | "style.effects.0.x"
  | "style.effects.0.y"
  | "style.effects.0.blur"
  | "style.effects.0.spread"
  | `style.effects.${number}.color`
  | `style.effects.${number}.opacity`
  | `style.effects.${number}.x`
  | `style.effects.${number}.y`
  | `style.effects.${number}.blur`
  | `style.effects.${number}.spread`
  | "geometry.cornerRadii.0"
  | "geometry.cornerRadii.1"
  | "geometry.cornerRadii.2"
  | "geometry.cornerRadii.3"
  | "geometry.cornerSmoothing"
  | `geometry.vectorPoints.${number}.x`
  | `geometry.vectorPoints.${number}.y`
  | `geometry.clipPoints.${number}.x`
  | `geometry.clipPoints.${number}.y`
  | "variable.value"
  | "text"
  | "secondaryText"
  | "value"
  | "visible";

export type KeyframeValue = number | string | boolean;

export type TimelineKeyframe = {
  id: string;
  time: number;
  value: KeyframeValue;
  easing: EasingType;
  bezier: [number, number, number, number];
  spring: { mass: number; stiffness: number; damping: number; velocity: number };
};

export type TimelineTrack = {
  id: string;
  nodeId: string;
  variableId?: string;
  property: AnimatableProperty;
  enabled: boolean;
  expanded: boolean;
  keyframes: TimelineKeyframe[];
};

export type TimelineMarker = { id: string; time: number; label: string; color: string };

export type StudioTimeline = {
  duration: number;
  fps: 24 | 30 | 60;
  speed: number;
  loop: boolean;
  direction: "normal" | "reverse" | "alternate";
  workArea: [number, number];
  autoKey: boolean;
  tracks: TimelineTrack[];
  markers: TimelineMarker[];
};

export type NodeOverride = {
  name?: string;
  text?: string;
  secondaryText?: string;
  visible?: boolean;
  locked?: boolean;
  expanded?: boolean;
  surface?: Surface;
  value?: number;
  checked?: boolean;
  icon?: StudioNode["icon"];
  svgPath?: string;
  svgViewBox?: string;
  componentId?: string;
  instanceSourceId?: string;
  instanceOverrides?: Record<string, string | number | boolean>;
  bindings?: Record<string, string>;
  accessibility?: AccessibilitySettings;
  transform?: Partial<NodeTransform>;
  geometry?: Partial<NodeGeometry>;
  style?: Partial<NodeStyle>;
  layout?: Partial<NodeLayout>;
};

export type SceneVariant = {
  id: string;
  name: string;
  description: string;
  overrides: Record<string, NodeOverride>;
};

export type StudioVariable = {
  id: string;
  name: string;
  type: VariableType;
  value: string | number | boolean;
  defaultValue: string | number | boolean;
};

export type InteractionCondition = {
  variableId: string;
  operator: "equals" | "notEquals" | "greater" | "less";
  value: string | number | boolean;
};

export type StudioInteraction = {
  id: string;
  sourceNodeId: string;
  sourceVariantId: string;
  trigger: TriggerType;
  action: ActionType;
  targetVariantId?: string;
  variableId?: string;
  value?: string | number | boolean;
  url?: string;
  delay: number;
  key: string;
  transition: TransitionType;
  duration: number;
  easing: EasingType;
  condition?: InteractionCondition;
};

export type ComponentProperty = {
  id: string;
  name: string;
  type: ComponentPropertyType;
  targetNodeId: string;
  targetPath: string;
  defaultValue: string | number | boolean;
  options: string[];
};

export type ComponentDefinition = {
  id: string;
  name: string;
  rootNodeId: string;
  description: string;
  properties: ComponentProperty[];
  variantIds: string[];
};

export type StudioDocument = {
  version: 5;
  id: string;
  name: string;
  canvas: {
    color: string;
    device: Device;
    showGrid: boolean;
    showRulers: boolean;
    showGuides: boolean;
    snap: boolean;
    gridSize: number;
    width: number;
    height: number;
  };
  tokens: { accent: string; ink: string; surface: string; acid: string; violet: string };
  nodes: StudioNode[];
  variants: SceneVariant[];
  variables: StudioVariable[];
  interactions: StudioInteraction[];
  components: ComponentDefinition[];
  timeline: StudioTimeline;
  createdAt: string;
  updatedAt: string;
};

let sequence = 0;
export function createId(prefix: string) {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}`;
}

export const deviceSizes: Record<Device, { width: number; height: number }> = {
  desktop: { width: 960, height: 620 },
  tablet: { width: 720, height: 900 },
  mobile: { width: 390, height: 760 },
};

export const animatableProperties: { property: AnimatableProperty; label: string; group: string }[] = [
  { property: "transform.x", label: "Position X", group: "Transform" },
  { property: "transform.y", label: "Position Y", group: "Transform" },
  { property: "transform.z", label: "Depth Z", group: "Transform" },
  { property: "transform.width", label: "Width", group: "Transform" },
  { property: "transform.height", label: "Height", group: "Transform" },
  { property: "transform.rotationX", label: "Rotate X", group: "3D" },
  { property: "transform.rotationY", label: "Rotate Y", group: "3D" },
  { property: "transform.rotationZ", label: "Rotate Z", group: "Transform" },
  { property: "transform.scaleX", label: "Scale X", group: "Transform" },
  { property: "transform.scaleY", label: "Scale Y", group: "Transform" },
  { property: "transform.skewX", label: "Skew X", group: "Transform" },
  { property: "transform.skewY", label: "Skew Y", group: "Transform" },
  { property: "transform.pivotX", label: "Pivot X", group: "3D" },
  { property: "transform.pivotY", label: "Pivot Y", group: "3D" },
  { property: "transform.perspective", label: "Perspective", group: "3D" },
  { property: "style.opacity", label: "Opacity", group: "Appearance" },
  { property: "style.strokeWidth", label: "Stroke width", group: "Appearance" },
  { property: "style.strokeColor", label: "Stroke color", group: "Appearance" },
  { property: "style.typography.color", label: "Text color", group: "Appearance" },
  { property: "style.fills.0.color", label: "Fill color", group: "Material" },
  { property: "style.fills.0.opacity", label: "Fill opacity", group: "Material" },
  { property: "style.fills.0.angle", label: "Gradient angle", group: "Material" },
  { property: "style.fills.0.centerX", label: "Gradient center X", group: "Material" },
  { property: "style.fills.0.centerY", label: "Gradient center Y", group: "Material" },
  { property: "style.fills.0.stops.0.color", label: "Gradient stop 1 color", group: "Material" },
  { property: "style.fills.0.stops.0.position", label: "Gradient stop 1 position", group: "Material" },
  { property: "style.fills.0.stops.1.color", label: "Gradient stop 2 color", group: "Material" },
  { property: "style.fills.0.stops.1.position", label: "Gradient stop 2 position", group: "Material" },
  { property: "style.filters.blur", label: "Layer blur", group: "Filters" },
  { property: "style.filters.brightness", label: "Brightness", group: "Filters" },
  { property: "style.filters.contrast", label: "Contrast", group: "Filters" },
  { property: "style.filters.saturate", label: "Saturation", group: "Filters" },
  { property: "style.filters.hueRotate", label: "Hue rotate", group: "Filters" },
  { property: "style.effects.0.color", label: "Effect color", group: "Effects" },
  { property: "style.effects.0.opacity", label: "Effect opacity", group: "Effects" },
  { property: "style.effects.0.x", label: "Effect X", group: "Effects" },
  { property: "style.effects.0.y", label: "Effect Y", group: "Effects" },
  { property: "style.effects.0.blur", label: "Effect blur", group: "Effects" },
  { property: "style.effects.0.spread", label: "Effect spread", group: "Effects" },
  { property: "geometry.cornerRadii.0", label: "Radius TL", group: "Geometry" },
  { property: "geometry.cornerRadii.1", label: "Radius TR", group: "Geometry" },
  { property: "geometry.cornerRadii.2", label: "Radius BR", group: "Geometry" },
  { property: "geometry.cornerRadii.3", label: "Radius BL", group: "Geometry" },
  { property: "geometry.cornerSmoothing", label: "Corner smoothing", group: "Geometry" },
  { property: "geometry.vectorPoints.0.x", label: "Vector point 1 X", group: "Vector" },
  { property: "geometry.vectorPoints.0.y", label: "Vector point 1 Y", group: "Vector" },
  { property: "geometry.clipPoints.0.x", label: "Clip point 1 X", group: "Vector" },
  { property: "geometry.clipPoints.0.y", label: "Clip point 1 Y", group: "Vector" },
  { property: "text", label: "Primary text", group: "Content" },
  { property: "secondaryText", label: "Secondary text", group: "Content" },
  { property: "value", label: "Value", group: "Content" },
  { property: "visible", label: "Visibility", group: "Content" },
];

export function createGradientStop(color: string, position: number, opacity = 100): GradientStop {
  return { id: createId("stop"), color, position, opacity };
}

export function createPaint(type: PaintType = "solid", color = "#ff8068"): Paint {
  return {
    id: createId("paint"),
    name: type === "solid" ? "Fill" : `${type[0].toUpperCase()}${type.slice(1)} fill`,
    type,
    visible: true,
    opacity: 100,
    blendMode: "normal",
    color,
    stops: [createGradientStop(color, 0), createGradientStop("#ffad83", 100)],
    angle: 145,
    centerX: 50,
    centerY: 50,
    scaleX: 100,
    scaleY: 100,
    imageUrl: "",
    imageMode: "fill",
    intensity: 35,
    seed: 7,
  };
}

export function createEffect(type: EffectType = "dropShadow", patch: Partial<Effect> = {}): Effect {
  const defaults: Record<EffectType, Partial<Effect>> = {
    dropShadow: { name: "Drop shadow", color: "#432821", opacity: 22, x: 0, y: 14, blur: 24, spread: 0 },
    innerShadow: { name: "Inner shadow", color: "#ffffff", opacity: 45, x: -3, y: -4, blur: 8, spread: 0 },
    layerBlur: { name: "Layer blur", opacity: 100, blur: 8 },
    backgroundBlur: { name: "Background blur", opacity: 100, blur: 18 },
    glow: { name: "Outer glow", color: "#d8ff66", opacity: 45, x: 0, y: 0, blur: 18, spread: 2 },
    innerGlow: { name: "Inner glow", color: "#ffffff", opacity: 45, x: 0, y: 0, blur: 12, spread: 1 },
    noise: { name: "Noise", opacity: 10, intensity: 35 },
    texture: { name: "Texture", opacity: 12, intensity: 30 },
  };
  return {
    id: createId("effect"),
    type,
    visible: true,
    blendMode: "normal",
    color: "#000000",
    opacity: 20,
    x: 0,
    y: 8,
    blur: 18,
    spread: 0,
    intensity: 30,
    name: "Effect",
    ...defaults[type],
    ...patch,
  };
}

export const surfaceRecipes: Record<Exclude<Surface, "custom">, { fills: Paint[]; effects: Effect[]; strokeColor: string; strokeOpacity: number; radii: [number, number, number, number] }> = {
  clay: {
    fills: [createPaint("linear", "#ff8068")],
    effects: [
      createEffect("innerShadow", { color: "#ffffff", opacity: 48, x: -4, y: -5, blur: 8 }),
      createEffect("innerShadow", { color: "#7d281c", opacity: 24, x: 5, y: 7, blur: 10 }),
      createEffect("dropShadow", { color: "#d4553d", opacity: 100, x: 0, y: 9, blur: 0 }),
      createEffect("dropShadow", { color: "#52271f", opacity: 20, x: 0, y: 19, blur: 28 }),
    ],
    strokeColor: "#c94f3a",
    strokeOpacity: 30,
    radii: [20, 20, 20, 20],
  },
  glass: {
    fills: [createPaint("linear", "#ffffff")],
    effects: [
      createEffect("innerShadow", { color: "#ffffff", opacity: 80, x: 0, y: 1, blur: 1 }),
      createEffect("dropShadow", { color: "#31264d", opacity: 22, x: 0, y: 20, blur: 36 }),
      createEffect("backgroundBlur", { blur: 18 }),
      createEffect("noise", { opacity: 6, intensity: 35 }),
    ],
    strokeColor: "#ffffff",
    strokeOpacity: 62,
    radii: [24, 24, 24, 24],
  },
  skeuo: {
    fills: [createPaint("linear", "#e9e7e1")],
    effects: [
      createEffect("innerShadow", { color: "#ffffff", opacity: 80, x: 0, y: 2, blur: 2 }),
      createEffect("innerShadow", { color: "#77736d", opacity: 18, x: 0, y: -3, blur: 8 }),
      createEffect("dropShadow", { color: "#2e2b26", opacity: 25, x: 0, y: 12, blur: 20 }),
    ],
    strokeColor: "#8e8b84",
    strokeOpacity: 36,
    radii: [24, 24, 24, 24],
  },
  adaptive: {
    fills: [createPaint("solid", "#20211f")],
    effects: [
      createEffect("innerShadow", { color: "#ffffff", opacity: 16, x: 0, y: 2, blur: 2 }),
      createEffect("dropShadow", { color: "#777f47", opacity: 100, x: 0, y: 12, blur: 0 }),
      createEffect("dropShadow", { color: "#28300e", opacity: 18, x: 0, y: 22, blur: 30 }),
    ],
    strokeColor: "#4d5140",
    strokeOpacity: 45,
    radii: [24, 24, 58, 24],
  },
};

function baseTransform(kind: NodeKind): NodeTransform {
  const sizes: Partial<Record<NodeKind, [number, number]>> = {
    frame: [420, 300], group: [300, 220], rectangle: [180, 120], ellipse: [140, 140], line: [180, 2], arrow: [180, 2], polygon: [150, 150], star: [150, 150], text: [180, 44], image: [220, 160], icon: [48, 48], vector: [180, 140], button: [190, 64], input: [250, 62], toggle: [210, 60], slider: [260, 70], dial: [170, 170], progress: [260, 78], boolean: [200, 160], componentInstance: [240, 160],
  };
  const [width, height] = sizes[kind] ?? [180, 120];
  return { x: 240, y: 160, z: 0, width, height, rotationX: 0, rotationY: 0, rotationZ: 0, scaleX: 100, scaleY: 100, skewX: 0, skewY: 0, pivotX: 50, pivotY: 50, perspective: 900, flipX: false, flipY: false };
}

function baseGeometry(kind: NodeKind): NodeGeometry {
  const radius = kind === "ellipse" || kind === "dial" ? 999 : kind === "button" || kind === "toggle" ? 20 : 16;
  return {
    cornerRadii: [radius, radius, radius, radius],
    cornerSmoothing: 0,
    clipPoints: [],
    vectorPoints: kind === "vector" ? [
      { id: createId("point"), x: 10, y: 70 },
      { id: createId("point"), x: 45, y: 10 },
      { id: createId("point"), x: 90, y: 65 },
      { id: createId("point"), x: 58, y: 92 },
    ] : [],
    closed: kind !== "line" && kind !== "arrow",
    polygonSides: kind === "star" ? 5 : 6,
    starRatio: 48,
    booleanOperation: "union",
    mask: false,
    clipChildren: kind === "frame",
  };
}

function baseStyle(kind: NodeKind): NodeStyle {
  const fill = createPaint("solid", kind === "text" || kind === "line" || kind === "arrow" ? "#262724" : "#ff8068");
  return {
    fills: [fill],
    effects: kind === "text" || kind === "line" || kind === "arrow" ? [] : [createEffect("dropShadow")],
    filters: { blur: 0, brightness: 100, contrast: 100, saturate: 100, hueRotate: 0 },
    opacity: 100,
    blendMode: "normal",
    strokeColor: kind === "line" || kind === "arrow" ? "#262724" : "#c94f3a",
    strokeOpacity: 100,
    strokeWidth: kind === "line" || kind === "arrow" ? 3 : 1,
    strokeStyle: "solid",
    strokeAlign: "inside",
    typography: { family: kind === "text" ? "display" : "body", color: "#242521", size: kind === "text" ? 28 : 13, weight: 800, lineHeight: 1.2, letterSpacing: 0, align: "center", transform: "none", italic: false, underline: false },
  };
}

function baseLayout(kind: NodeKind): NodeLayout {
  return {
    mode: kind === "frame" ? "free" : "free",
    position: "absolute",
    direction: "row",
    wrap: false,
    gap: 12,
    rowGap: 12,
    columnGap: 12,
    padding: kind === "frame" ? [24, 24, 24, 24] : [16, 16, 16, 16],
    align: "center",
    justify: "center",
    columns: 2,
    horizontalSizing: "fixed",
    verticalSizing: "fixed",
    minWidth: 0,
    maxWidth: 1600,
    minHeight: 0,
    maxHeight: 1600,
    horizontalConstraint: "start",
    verticalConstraint: "start",
  };
}

const namesByKind: Record<NodeKind, string> = {
  frame: "Frame", group: "Group", rectangle: "Rectangle", ellipse: "Ellipse", line: "Line", arrow: "Arrow", polygon: "Polygon", star: "Star", text: "Text", image: "Image", icon: "Icon", vector: "Vector path", button: "Button", input: "Input", toggle: "Toggle", slider: "Slider", dial: "Dial", progress: "Progress", boolean: "Boolean group", componentInstance: "Component instance",
};

export function createNode(kind: NodeKind, patch: Partial<StudioNode> = {}): StudioNode {
  const transform = { ...baseTransform(kind), ...patch.transform };
  const geometry = { ...baseGeometry(kind), ...patch.geometry };
  const style = { ...baseStyle(kind), ...patch.style };
  const layout = { ...baseLayout(kind), ...patch.layout };
  const textByKind: Partial<Record<NodeKind, string>> = { button: "Launch it", input: "Email address", toggle: "Soft shadows", slider: "Intensity", dial: "62%", progress: "Build progress", text: "Your text", icon: "", frame: "", group: "", rectangle: "", ellipse: "", vector: "" };
  const node: StudioNode = {
    id: createId(kind),
    parentId: null,
    childIds: [],
    kind,
    name: namesByKind[kind],
    text: textByKind[kind] ?? namesByKind[kind],
    secondaryText: kind === "input" ? "name@company.com" : kind === "progress" ? "72%" : "",
    visible: true,
    locked: false,
    expanded: true,
    surface: "custom",
    transform,
    geometry,
    style,
    layout,
    responsive: { desktop: {}, tablet: {}, mobile: {} },
    value: kind === "dial" ? 62 : 72,
    checked: kind === "toggle",
    icon: "arrow",
    svgPath: "",
    svgViewBox: "0 0 24 24",
    instanceSourceId: patch.instanceSourceId,
    instanceOverrides: {},
    bindings: {},
    accessibility: {
      semanticTag: kind === "button" || kind === "toggle" ? "button" : kind === "input" ? "label" : kind === "text" ? "p" : kind === "frame" ? "section" : "div",
      role: kind === "progress" ? "progressbar" : kind === "dial" ? "slider" : "",
      ariaLabel: namesByKind[kind],
      tabIndex: kind === "button" || kind === "toggle" || kind === "input" || kind === "slider" || kind === "dial" ? 0 : -1,
      decorative: kind === "rectangle" || kind === "ellipse" || kind === "vector" || kind === "icon",
      reducedMotion: true,
    },
  };
  return { ...node, ...patch, transform, geometry, style, layout };
}

export function createTimeline(): StudioTimeline {
  return { duration: 3, fps: 60, speed: 1, loop: false, direction: "normal", workArea: [0, 3], autoKey: false, tracks: [], markers: [] };
}

export function createEmptyDocument(name = "Untitled component"): StudioDocument {
  const now = new Date().toISOString();
  return {
    version: 5,
    id: createId("document"),
    name,
    canvas: { color: "#f2efe8", device: "desktop", showGrid: true, showRulers: true, showGuides: true, snap: true, gridSize: 10, width: deviceSizes.desktop.width, height: deviceSizes.desktop.height },
    tokens: { accent: "#ff8068", ink: "#262724", surface: "#f2efe8", acid: "#d8ff66", violet: "#9c89ff" },
    nodes: [],
    variants: [],
    variables: [],
    interactions: [],
    components: [],
    timeline: createTimeline(),
    createdAt: now,
    updatedAt: now,
  };
}

const starterFrame = createNode("frame", {
  id: "starter-frame",
  name: "Component frame",
  transform: { ...baseTransform("frame"), x: 250, y: 140, width: 420, height: 300 },
  style: { ...baseStyle("frame"), fills: [createPaint("solid", "#ffb7a5")], effects: [], strokeColor: "#ffffff", strokeOpacity: 45 },
});
const starterButton = createNode("button", {
  id: "starter-button",
  parentId: starterFrame.id,
  name: "Soft launch",
  surface: "clay",
  transform: { ...baseTransform("button"), x: 115, y: 110 },
  geometry: { ...baseGeometry("button"), cornerRadii: [...surfaceRecipes.clay.radii] },
  style: { ...baseStyle("button"), fills: structuredClone(surfaceRecipes.clay.fills), effects: structuredClone(surfaceRecipes.clay.effects), strokeColor: surfaceRecipes.clay.strokeColor, strokeOpacity: surfaceRecipes.clay.strokeOpacity },
});
starterFrame.childIds = [starterButton.id];

export const initialDocument: StudioDocument = {
  ...createEmptyDocument("Morphiq component"),
  nodes: [starterFrame, starterButton],
};

export function applySurfaceRecipe(node: StudioNode, surface: Exclude<Surface, "custom">): StudioNode {
  const recipe = surfaceRecipes[surface];
  return {
    ...node,
    surface,
    geometry: { ...node.geometry, cornerRadii: [...recipe.radii] },
    style: {
      ...node.style,
      fills: structuredClone(recipe.fills),
      effects: structuredClone(recipe.effects),
      strokeColor: recipe.strokeColor,
      strokeOpacity: recipe.strokeOpacity,
    },
  };
}

export function getRootNodes(nodes: StudioNode[]) {
  return nodes.filter((node) => !node.parentId || !nodes.some((candidate) => candidate.id === node.parentId));
}

export function getNodeChildren(nodes: StudioNode[], nodeId: string) {
  const node = nodes.find((item) => item.id === nodeId);
  if (!node) return [];
  return node.childIds.map((id) => nodes.find((item) => item.id === id)).filter((item): item is StudioNode => Boolean(item));
}

export function getDescendantIds(nodes: StudioNode[], nodeId: string): string[] {
  const children = getNodeChildren(nodes, nodeId);
  return children.flatMap((child) => [child.id, ...getDescendantIds(nodes, child.id)]);
}

export function isContainer(node: StudioNode | null | undefined) {
  return node?.kind === "frame" || node?.kind === "group" || node?.kind === "boolean";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function finiteNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function enumValue<T extends string>(value: unknown, choices: readonly T[], fallback: T): T {
  return choices.includes(value as T) ? value as T : fallback;
}

function numberEnum<T extends number>(value: unknown, choices: readonly T[], fallback: T): T {
  return choices.includes(value as T) ? value as T : fallback;
}

export function mergeNodeOverride(node: StudioNode, override?: NodeOverride): StudioNode {
  if (!override) return node;
  const raw = asRecord(override);
  const geometry = asRecord(raw.geometry);
  const style = asRecord(raw.style);
  const accessibility = asRecord(raw.accessibility);
  const instanceOverrides = Object.fromEntries(Object.entries(asRecord(raw.instanceOverrides)).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))) as StudioNode["instanceOverrides"];
  const bindings = Object.fromEntries(Object.entries(asRecord(raw.bindings)).filter(([path, variableId]) => isSafePropertyPath(path) && typeof variableId === "string")) as StudioNode["bindings"];
  const safeOverride: NodeOverride = {
    ...(typeof raw.name === "string" ? { name: raw.name } : {}),
    ...(typeof raw.text === "string" ? { text: raw.text } : {}),
    ...(typeof raw.secondaryText === "string" ? { secondaryText: raw.secondaryText } : {}),
    ...(typeof raw.visible === "boolean" ? { visible: raw.visible } : {}),
    ...(typeof raw.locked === "boolean" ? { locked: raw.locked } : {}),
    ...(typeof raw.expanded === "boolean" ? { expanded: raw.expanded } : {}),
    ...(typeof raw.value === "number" && Number.isFinite(raw.value) ? { value: raw.value } : {}),
    ...(typeof raw.checked === "boolean" ? { checked: raw.checked } : {}),
    ...(typeof raw.svgPath === "string" ? { svgPath: raw.svgPath } : {}),
    ...(typeof raw.svgViewBox === "string" ? { svgViewBox: raw.svgViewBox } : {}),
    ...(typeof raw.componentId === "string" ? { componentId: raw.componentId } : {}),
    ...(typeof raw.instanceSourceId === "string" ? { instanceSourceId: raw.instanceSourceId } : {}),
    ...(Object.hasOwn(raw, "instanceOverrides") ? { instanceOverrides } : {}),
    ...(Object.hasOwn(raw, "bindings") ? { bindings } : {}),
    ...(typeof raw.surface === "string" ? { surface: enumValue(raw.surface, ["clay", "glass", "skeuo", "adaptive", "custom"] as const, node.surface) } : {}),
    ...(typeof raw.icon === "string" ? { icon: enumValue(raw.icon, ["arrow", "play", "heart", "sparkles", "plus", "check"] as const, node.icon) } : {}),
    ...(Object.keys(accessibility).length ? { accessibility: {
      ...node.accessibility,
      semanticTag: enumValue(accessibility.semanticTag, ["div", "button", "article", "section", "label", "input", "p", "span"] as const, node.accessibility.semanticTag),
      role: typeof accessibility.role === "string" ? accessibility.role : node.accessibility.role,
      ariaLabel: typeof accessibility.ariaLabel === "string" ? accessibility.ariaLabel : node.accessibility.ariaLabel,
      tabIndex: finiteNumber(accessibility.tabIndex, node.accessibility.tabIndex),
      decorative: accessibility.decorative === undefined ? node.accessibility.decorative : accessibility.decorative === true,
      reducedMotion: accessibility.reducedMotion === undefined ? node.accessibility.reducedMotion : accessibility.reducedMotion === true,
    } } : {}),
  };
  return {
    ...node,
    ...safeOverride,
    transform: { ...node.transform, ...normalizeTransformPatch(raw.transform, node.transform) },
    geometry: {
      ...node.geometry,
      ...geometry,
      cornerRadii: Array.isArray(geometry.cornerRadii) && geometry.cornerRadii.length >= 4 ? geometry.cornerRadii.slice(0, 4).map((value, index) => finiteNumber(value, node.geometry.cornerRadii[index])) as NodeGeometry["cornerRadii"] : node.geometry.cornerRadii,
      clipPoints: Array.isArray(geometry.clipPoints) ? geometry.clipPoints.map(normalizePoint).filter((point): point is Point => Boolean(point)) : node.geometry.clipPoints,
      vectorPoints: Array.isArray(geometry.vectorPoints) ? geometry.vectorPoints.map(normalizeVectorPoint).filter((point): point is VectorPoint => Boolean(point)) : node.geometry.vectorPoints,
    },
    style: {
      ...node.style,
      ...style,
      fills: Array.isArray(style.fills) ? style.fills.map(normalizePaint) : node.style.fills,
      effects: Array.isArray(style.effects) ? style.effects.map(normalizeEffect) : node.style.effects,
      filters: { ...node.style.filters, ...asRecord(style.filters) },
      typography: { ...node.style.typography, ...asRecord(style.typography) },
    },
    layout: { ...node.layout, ...normalizeLayoutPatch(raw.layout, node.layout) },
  };
}

export function resolveResponsiveNode(node: StudioNode, device: Device) {
  const override = node.responsive[device] ?? {};
  return {
    ...node,
    visible: override.visible ?? node.visible,
    transform: { ...node.transform, ...override.transform },
    layout: { ...node.layout, ...override.layout },
  };
}

export function getPathValue(node: StudioNode, path: AnimatableProperty): KeyframeValue {
  if (!isSafePropertyPath(path)) return 0;
  const parts = path.split(".");
  let current: unknown = node;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") return 0;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "number" || typeof current === "string" || typeof current === "boolean" ? current : 0;
}

export function setPathValue(node: StudioNode, path: AnimatableProperty, value: KeyframeValue): StudioNode {
  if (!isSafePropertyPath(path)) return node;
  const clone = structuredClone(node) as StudioNode;
  const parts = path.split(".");
  let current = clone as unknown as Record<string, unknown>;
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (index === parts.length - 1) current[part] = value;
    else {
      const next = current[part];
      if (!next || typeof next !== "object") return clone;
      current = next as Record<string, unknown>;
    }
  }
  return clone;
}

export function isSafePropertyPath(path: string) {
  const blocked = new Set(["__proto__", "prototype", "constructor"]);
  const parts = path.split(".");
  return parts.length > 0 && parts.every((part) => /^(?:[A-Za-z][A-Za-z0-9_]*|\d+)$/.test(part) && !blocked.has(part));
}

function alphaColor(color: string, opacity: number) {
  const match = color.match(/^#([0-9a-f]{6})$/i);
  if (!match) return `color-mix(in srgb, ${color} ${opacity}%, transparent)`;
  const hex = match[1];
  return `rgba(${Number.parseInt(hex.slice(0, 2), 16)}, ${Number.parseInt(hex.slice(2, 4), 16)}, ${Number.parseInt(hex.slice(4, 6), 16)}, ${opacity / 100})`;
}

function stopCss(stop: GradientStop, paintOpacity: number) {
  return `${alphaColor(stop.color, stop.opacity * paintOpacity / 100)} ${stop.position}%`;
}

export function paintCss(paint: Paint) {
  const opacity = paint.opacity;
  const stops = [...paint.stops].sort((a, b) => a.position - b.position).map((stop) => stopCss(stop, opacity)).join(", ");
  if (paint.type === "solid") return `linear-gradient(${alphaColor(paint.color, opacity)}, ${alphaColor(paint.color, opacity)})`;
  if (paint.type === "linear") return `linear-gradient(${paint.angle}deg, ${stops})`;
  if (paint.type === "radial") return `radial-gradient(ellipse ${paint.scaleX}% ${paint.scaleY}% at ${paint.centerX}% ${paint.centerY}%, ${stops})`;
  if (paint.type === "conic") return `conic-gradient(from ${paint.angle}deg at ${paint.centerX}% ${paint.centerY}%, ${stops})`;
  if (paint.type === "diamond") return `conic-gradient(from 45deg at ${paint.centerX}% ${paint.centerY}%, ${stops}, ${stops})`;
  if (paint.type === "image" && paint.imageUrl) return `url(${JSON.stringify(paint.imageUrl)})`;
  if (paint.type === "pattern") return `repeating-linear-gradient(${paint.angle}deg, ${alphaColor(paint.color, opacity)} 0 2px, transparent 2px ${Math.max(4, 20 - paint.intensity / 5)}px)`;
  return `repeating-radial-gradient(circle at ${paint.seed % 100}% ${(paint.seed * 7) % 100}%, ${alphaColor(paint.color, Math.min(30, opacity))} 0 .7px, transparent .8px 3px)`;
}

export function nodeBackground(node: StudioNode) {
  const visible = node.style.fills.filter((paint) => paint.visible);
  return visible.length ? visible.map(paintCss).join(", ") : "transparent";
}

export function nodeBoxShadow(node: StudioNode) {
  return node.style.effects
    .filter((effect) => effect.visible && effect.blendMode === "normal" && ["dropShadow", "innerShadow", "glow", "innerGlow"].includes(effect.type))
    .map(effectShadowCss)
    .join(", ") || "none";
}

export function effectShadowCss(effect: Effect) {
  return `${effect.type === "innerShadow" || effect.type === "innerGlow" ? "inset " : ""}${effect.x}px ${effect.y}px ${effect.blur}px ${effect.spread}px ${alphaColor(effect.color, effect.opacity)}`;
}

export function nodeFilter(node: StudioNode) {
  const effectBlur = node.style.effects.filter((effect) => effect.visible && effect.type === "layerBlur").reduce((total, effect) => total + effect.blur * effect.opacity / 100, 0);
  const blur = Math.max(node.style.filters.blur, effectBlur);
  const filters = [
    blur > 0 ? `blur(${blur}px)` : "",
    node.style.filters.brightness !== 100 ? `brightness(${node.style.filters.brightness}%)` : "",
    node.style.filters.contrast !== 100 ? `contrast(${node.style.filters.contrast}%)` : "",
    node.style.filters.saturate !== 100 ? `saturate(${node.style.filters.saturate}%)` : "",
    node.style.filters.hueRotate ? `hue-rotate(${node.style.filters.hueRotate}deg)` : "",
  ].filter(Boolean);
  return filters.length ? filters.join(" ") : undefined;
}

export function nodeBackdropFilter(node: StudioNode) {
  const effects = node.style.effects.filter((effect) => effect.visible && effect.type === "backgroundBlur");
  if (!effects.length) return undefined;
  const blur = effects.reduce((total, effect) => total + effect.blur * effect.opacity / 100, 0);
  const saturation = 100 + effects.reduce((total, effect) => total + effect.intensity * effect.opacity / 100, 0);
  return `blur(${blur}px) saturate(${saturation}%)`;
}

export function cornerRadiusCss(node: StudioNode) {
  return node.geometry.cornerRadii.map((value) => `${Math.max(0, value)}px`).join(" ");
}

export function clipPathCss(node: StudioNode) {
  if (!node.geometry.clipPoints.length) return undefined;
  return `polygon(${node.geometry.clipPoints.map((point) => `${point.x}% ${point.y}%`).join(", ")})`;
}

const nodeKinds: readonly NodeKind[] = ["frame", "group", "rectangle", "ellipse", "line", "arrow", "polygon", "star", "text", "image", "icon", "vector", "button", "input", "toggle", "slider", "dial", "progress", "boolean", "componentInstance"];
const paintTypes: readonly PaintType[] = ["solid", "linear", "radial", "conic", "diamond", "image", "noise", "pattern"];
const effectTypes: readonly EffectType[] = ["dropShadow", "innerShadow", "layerBlur", "backgroundBlur", "glow", "innerGlow", "noise", "texture"];
const blendModes: readonly BlendMode[] = ["normal", "multiply", "screen", "overlay", "soft-light", "hard-light", "color-dodge", "color-burn", "difference", "exclusion"];

function normalizeTuple(value: unknown, fallback: readonly [number, number, number, number]): [number, number, number, number] {
  if (!Array.isArray(value) || value.length < 4) return [...fallback];
  return [0, 1, 2, 3].map((index) => finiteNumber(value[index], fallback[index])) as [number, number, number, number];
}

function normalizePoint(value: unknown): Point | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = asRecord(value);
  return { x: finiteNumber(raw.x, 0), y: finiteNumber(raw.y, 0) };
}

function normalizeVectorPoint(value: unknown): VectorPoint | null {
  const point = normalizePoint(value);
  if (!point) return null;
  const raw = asRecord(value);
  const handleIn = normalizePoint(raw.handleIn);
  const handleOut = normalizePoint(raw.handleOut);
  return {
    ...point,
    id: typeof raw.id === "string" && raw.id ? raw.id : createId("point"),
    corner: raw.corner !== false,
    ...(handleIn ? { handleIn } : {}),
    ...(handleOut ? { handleOut } : {}),
  };
}

function normalizePaint(value: unknown): Paint {
  const raw = asRecord(value);
  const type = enumValue(raw.type, paintTypes, "solid");
  const fallback = createPaint(type, typeof raw.color === "string" ? raw.color : "#ff8068");
  const stops = Array.isArray(raw.stops) ? raw.stops.map((stop) => {
    const item = asRecord(stop);
    return {
      ...createGradientStop(typeof item.color === "string" ? item.color : fallback.color, finiteNumber(item.position, 0), finiteNumber(item.opacity, 100)),
      id: typeof item.id === "string" && item.id ? item.id : createId("stop"),
      ...(typeof item.variableId === "string" ? { variableId: item.variableId } : {}),
    };
  }) : fallback.stops;
  return {
    ...fallback,
    id: typeof raw.id === "string" && raw.id ? raw.id : fallback.id,
    name: typeof raw.name === "string" ? raw.name : fallback.name,
    type,
    visible: raw.visible !== false,
    opacity: finiteNumber(raw.opacity, fallback.opacity),
    blendMode: enumValue(raw.blendMode, blendModes, fallback.blendMode),
    color: typeof raw.color === "string" ? raw.color : fallback.color,
    stops,
    angle: finiteNumber(raw.angle, fallback.angle),
    centerX: finiteNumber(raw.centerX, fallback.centerX),
    centerY: finiteNumber(raw.centerY, fallback.centerY),
    scaleX: finiteNumber(raw.scaleX, fallback.scaleX),
    scaleY: finiteNumber(raw.scaleY, fallback.scaleY),
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : "",
    imageMode: enumValue(raw.imageMode, ["fill", "fit", "crop", "tile"] as const, "fill"),
    intensity: finiteNumber(raw.intensity, fallback.intensity),
    seed: finiteNumber(raw.seed, fallback.seed),
  };
}

function normalizeEffect(value: unknown): Effect {
  const raw = asRecord(value);
  const type = enumValue(raw.type, effectTypes, "dropShadow");
  const fallback = createEffect(type);
  return {
    ...fallback,
    id: typeof raw.id === "string" && raw.id ? raw.id : fallback.id,
    name: typeof raw.name === "string" ? raw.name : fallback.name,
    type,
    visible: raw.visible !== false,
    blendMode: enumValue(raw.blendMode, blendModes, fallback.blendMode),
    color: typeof raw.color === "string" ? raw.color : fallback.color,
    opacity: finiteNumber(raw.opacity, fallback.opacity),
    x: finiteNumber(raw.x, fallback.x),
    y: finiteNumber(raw.y, fallback.y),
    blur: finiteNumber(raw.blur, fallback.blur),
    spread: finiteNumber(raw.spread, fallback.spread),
    intensity: finiteNumber(raw.intensity, fallback.intensity),
  };
}

function normalizeTransform(value: unknown, fallback: NodeTransform): NodeTransform {
  const raw = asRecord(value);
  return {
    x: finiteNumber(raw.x, fallback.x), y: finiteNumber(raw.y, fallback.y), z: finiteNumber(raw.z, fallback.z),
    width: Math.max(1, finiteNumber(raw.width, fallback.width)), height: Math.max(1, finiteNumber(raw.height, fallback.height)),
    rotationX: finiteNumber(raw.rotationX, fallback.rotationX), rotationY: finiteNumber(raw.rotationY, fallback.rotationY), rotationZ: finiteNumber(raw.rotationZ, fallback.rotationZ),
    scaleX: finiteNumber(raw.scaleX, fallback.scaleX), scaleY: finiteNumber(raw.scaleY, fallback.scaleY),
    skewX: finiteNumber(raw.skewX, fallback.skewX), skewY: finiteNumber(raw.skewY, fallback.skewY),
    pivotX: finiteNumber(raw.pivotX, fallback.pivotX), pivotY: finiteNumber(raw.pivotY, fallback.pivotY),
    perspective: Math.max(1, finiteNumber(raw.perspective, fallback.perspective)),
    flipX: raw.flipX === true, flipY: raw.flipY === true,
  };
}

function normalizeLayout(value: unknown, fallback: NodeLayout): NodeLayout {
  const raw = asRecord(value);
  return {
    mode: enumValue(raw.mode, ["free", "horizontal", "vertical", "grid"] as const, fallback.mode),
    position: enumValue(raw.position, ["absolute", "relative"] as const, fallback.position),
    direction: enumValue(raw.direction, ["row", "column"] as const, fallback.direction),
    wrap: raw.wrap === true,
    gap: finiteNumber(raw.gap, fallback.gap), rowGap: finiteNumber(raw.rowGap, fallback.rowGap), columnGap: finiteNumber(raw.columnGap, fallback.columnGap),
    padding: normalizeTuple(raw.padding, fallback.padding),
    align: enumValue(raw.align, ["start", "center", "end", "stretch"] as const, fallback.align),
    justify: enumValue(raw.justify, ["start", "center", "end", "space-between", "space-around"] as const, fallback.justify),
    columns: Math.max(1, Math.round(finiteNumber(raw.columns, fallback.columns))),
    horizontalSizing: enumValue(raw.horizontalSizing, ["fixed", "hug", "fill"] as const, fallback.horizontalSizing),
    verticalSizing: enumValue(raw.verticalSizing, ["fixed", "hug", "fill"] as const, fallback.verticalSizing),
    minWidth: Math.max(0, finiteNumber(raw.minWidth, fallback.minWidth)), maxWidth: Math.max(0, finiteNumber(raw.maxWidth, fallback.maxWidth)),
    minHeight: Math.max(0, finiteNumber(raw.minHeight, fallback.minHeight)), maxHeight: Math.max(0, finiteNumber(raw.maxHeight, fallback.maxHeight)),
    horizontalConstraint: enumValue(raw.horizontalConstraint, ["start", "center", "end", "stretch", "scale"] as const, fallback.horizontalConstraint),
    verticalConstraint: enumValue(raw.verticalConstraint, ["start", "center", "end", "stretch", "scale"] as const, fallback.verticalConstraint),
  };
}

function normalizeTransformPatch(value: unknown, fallback: NodeTransform): Partial<NodeTransform> {
  const raw = asRecord(value);
  const normalized = normalizeTransform(raw, fallback);
  return Object.fromEntries((Object.keys(fallback) as (keyof NodeTransform)[]).filter((key) => Object.hasOwn(raw, key)).map((key) => [key, normalized[key]])) as Partial<NodeTransform>;
}

function normalizeLayoutPatch(value: unknown, fallback: NodeLayout): Partial<NodeLayout> {
  const raw = asRecord(value);
  const normalized = normalizeLayout(raw, fallback);
  return Object.fromEntries((Object.keys(fallback) as (keyof NodeLayout)[]).filter((key) => Object.hasOwn(raw, key)).map((key) => [key, normalized[key]])) as Partial<NodeLayout>;
}

function normalizeGeometry(value: unknown, fallback: NodeGeometry): NodeGeometry {
  const raw = asRecord(value);
  return {
    cornerRadii: normalizeTuple(raw.cornerRadii, fallback.cornerRadii),
    cornerSmoothing: finiteNumber(raw.cornerSmoothing, fallback.cornerSmoothing),
    clipPoints: Array.isArray(raw.clipPoints) ? raw.clipPoints.map(normalizePoint).filter((point): point is Point => Boolean(point)) : fallback.clipPoints,
    vectorPoints: Array.isArray(raw.vectorPoints) ? raw.vectorPoints.map(normalizeVectorPoint).filter((point): point is VectorPoint => Boolean(point)) : fallback.vectorPoints,
    closed: raw.closed === undefined ? fallback.closed : raw.closed === true,
    polygonSides: Math.max(3, Math.round(finiteNumber(raw.polygonSides, fallback.polygonSides))),
    starRatio: finiteNumber(raw.starRatio, fallback.starRatio),
    booleanOperation: enumValue(raw.booleanOperation, ["union", "subtract", "intersect", "exclude"] as const, fallback.booleanOperation),
    mask: raw.mask === true,
    clipChildren: raw.clipChildren === undefined ? fallback.clipChildren : raw.clipChildren === true,
  };
}

function normalizeStyle(value: unknown, fallback: NodeStyle): NodeStyle {
  const raw = asRecord(value);
  const filters = asRecord(raw.filters);
  const typography = asRecord(raw.typography);
  return {
    fills: Array.isArray(raw.fills) ? raw.fills.map(normalizePaint) : fallback.fills,
    effects: Array.isArray(raw.effects) ? raw.effects.map(normalizeEffect) : fallback.effects,
    filters: {
      blur: finiteNumber(filters.blur, fallback.filters.blur), brightness: finiteNumber(filters.brightness, fallback.filters.brightness),
      contrast: finiteNumber(filters.contrast, fallback.filters.contrast), saturate: finiteNumber(filters.saturate, fallback.filters.saturate),
      hueRotate: finiteNumber(filters.hueRotate, fallback.filters.hueRotate),
    },
    opacity: finiteNumber(raw.opacity, fallback.opacity),
    blendMode: enumValue(raw.blendMode, blendModes, fallback.blendMode),
    strokeColor: typeof raw.strokeColor === "string" ? raw.strokeColor : fallback.strokeColor,
    strokeOpacity: finiteNumber(raw.strokeOpacity, fallback.strokeOpacity), strokeWidth: finiteNumber(raw.strokeWidth, fallback.strokeWidth),
    strokeStyle: enumValue(raw.strokeStyle, ["solid", "dashed", "dotted", "double"] as const, fallback.strokeStyle),
    strokeAlign: enumValue(raw.strokeAlign, ["inside", "center", "outside"] as const, fallback.strokeAlign),
    typography: {
      family: enumValue(typography.family, ["body", "display", "mono"] as const, fallback.typography.family),
      color: typeof typography.color === "string" ? typography.color : fallback.typography.color,
      size: finiteNumber(typography.size, fallback.typography.size), weight: finiteNumber(typography.weight, fallback.typography.weight),
      lineHeight: finiteNumber(typography.lineHeight, fallback.typography.lineHeight), letterSpacing: finiteNumber(typography.letterSpacing, fallback.typography.letterSpacing),
      align: enumValue(typography.align, ["left", "center", "right", "justify"] as const, fallback.typography.align),
      transform: enumValue(typography.transform, ["none", "uppercase", "lowercase", "capitalize"] as const, fallback.typography.transform),
      italic: typography.italic === true, underline: typography.underline === true,
    },
  };
}

function migrateV4Node(value: Record<string, unknown>, index: number): StudioNode {
  const oldStyle = (value.style ?? {}) as Record<string, unknown>;
  const kindMap: Record<string, NodeKind> = { card: "frame", avatar: "ellipse", badge: "button" };
  const oldKind = String(value.kind ?? "rectangle");
  const kind = kindMap[oldKind] ?? (oldKind as NodeKind);
  const node = createNode(kind, {
    id: String(value.id ?? createId(kind)),
    name: String(value.name ?? namesByKind[kind]),
    text: String(value.text ?? ""),
    secondaryText: String(value.secondaryText ?? ""),
    visible: value.visible !== false,
    locked: value.locked === true,
    surface: (["clay", "glass", "skeuo", "adaptive"].includes(String(value.surface)) ? value.surface : "custom") as Surface,
    value: Number(value.value ?? 72),
    checked: Boolean(value.checked),
  });
  node.transform = {
    ...node.transform,
    x: Number(value.x ?? 60 + index * 14),
    y: Number(value.y ?? 60 + index * 14),
    width: Number(value.width ?? node.transform.width),
    height: Number(value.height ?? node.transform.height),
    rotationZ: Number(oldStyle.rotation ?? 0),
    skewX: Number(oldStyle.skewX ?? 0),
    skewY: Number(oldStyle.skewY ?? 0),
  };
  const fillType = String(oldStyle.fillType ?? "solid") as PaintType;
  const paint = createPaint(["solid", "linear", "radial"].includes(fillType) ? fillType : "solid", String(oldStyle.fill ?? "#ff8068"));
  paint.stops = [createGradientStop(String(oldStyle.gradientFrom ?? paint.color), 0), createGradientStop(String(oldStyle.gradientTo ?? "#ffad83"), 100)];
  paint.angle = Number(oldStyle.gradientAngle ?? 145);
  node.style.fills = [paint];
  node.style.opacity = Number(oldStyle.opacity ?? 100);
  node.style.strokeColor = String(oldStyle.borderColor ?? "#000000");
  node.style.strokeWidth = Number(oldStyle.borderWidth ?? 0);
  node.geometry.cornerRadii = [Number(oldStyle.radius ?? 0), Number(oldStyle.radius ?? 0), Number(oldStyle.radius ?? 0), Number(oldStyle.radius ?? 0)];
  node.style.typography = {
    ...node.style.typography,
    size: Number(oldStyle.fontSize ?? node.style.typography.size),
    weight: Number(oldStyle.fontWeight ?? node.style.typography.weight),
    lineHeight: Number(oldStyle.lineHeight ?? 1.2),
    letterSpacing: Number(oldStyle.letterSpacing ?? 0),
  };
  node.style.effects = Number(oldStyle.depth ?? 0) ? [createEffect("dropShadow", { color: String(oldStyle.shadowColor ?? "#000000"), opacity: Number(oldStyle.shadowOpacity ?? 20), y: Number(oldStyle.depth ?? 8), blur: Number(oldStyle.blur ?? 18) })] : [];
  return node;
}

function repairHierarchy(nodes: StudioNode[]) {
  if (new Set(nodes.map((node) => node.id)).size !== nodes.length || nodes.some((node) => !node.id)) return null;
  const repaired = nodes.map((node) => ({ ...node, childIds: [...node.childIds] }));
  const nodeMap = new Map(repaired.map((node) => [node.id, node]));
  repaired.forEach((node) => {
    const parent = node.parentId ? nodeMap.get(node.parentId) : undefined;
    if (!parent || parent.id === node.id || !isContainer(parent)) node.parentId = null;
  });
  repaired.forEach((node) => {
    const visited = new Set([node.id]);
    let cursor = node;
    while (cursor.parentId) {
      if (visited.has(cursor.parentId)) { node.parentId = null; break; }
      visited.add(cursor.parentId);
      const parent = nodeMap.get(cursor.parentId);
      if (!parent) { node.parentId = null; break; }
      cursor = parent;
    }
  });
  repaired.forEach((parent) => {
    const ordered = parent.childIds.filter((id, index, ids) => ids.indexOf(id) === index && nodeMap.get(id)?.parentId === parent.id);
    repaired.filter((node) => node.parentId === parent.id && !ordered.includes(node.id)).forEach((node) => ordered.push(node.id));
    parent.childIds = ordered;
  });
  return repaired;
}

export function normalizeStudioDocument(value: unknown): StudioDocument | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (record.version === 5 && Array.isArray(record.nodes)) {
    const rawNodes = record.nodes;
    if (rawNodes.some((value) => {
      const node = asRecord(value);
      return typeof node.id !== "string" || !node.id || !nodeKinds.includes(node.kind as NodeKind);
    })) return null;
    const nodes = rawNodes.map((value) => {
      const raw = asRecord(value);
      const kind = raw.kind as NodeKind;
      const fallback = createNode(kind);
      const responsive = asRecord(raw.responsive);
      const responsiveFor = (device: Device): ResponsiveOverride => {
        const override = asRecord(responsive[device]);
        const transform = normalizeTransformPatch(override.transform, fallback.transform);
        const layout = normalizeLayoutPatch(override.layout, fallback.layout);
        return {
          ...(Object.keys(transform).length ? { transform } : {}),
          ...(Object.keys(layout).length ? { layout } : {}),
          ...(typeof override.visible === "boolean" ? { visible: override.visible } : {}),
        };
      };
      const accessibility = asRecord(raw.accessibility);
      const instanceOverrides = Object.fromEntries(Object.entries(asRecord(raw.instanceOverrides)).filter(([, item]) => ["string", "number", "boolean"].includes(typeof item))) as StudioNode["instanceOverrides"];
      const bindings = Object.fromEntries(Object.entries(asRecord(raw.bindings)).filter(([path, variableId]) => isSafePropertyPath(path) && typeof variableId === "string")) as StudioNode["bindings"];
      return {
        ...fallback,
        id: raw.id as string,
        parentId: typeof raw.parentId === "string" ? raw.parentId : null,
        childIds: Array.isArray(raw.childIds) ? raw.childIds.filter((id): id is string => typeof id === "string") : [],
        kind,
        name: typeof raw.name === "string" ? raw.name : fallback.name,
        text: typeof raw.text === "string" ? raw.text : fallback.text,
        secondaryText: typeof raw.secondaryText === "string" ? raw.secondaryText : fallback.secondaryText,
        visible: raw.visible !== false,
        locked: raw.locked === true,
        expanded: raw.expanded !== false,
        surface: enumValue(raw.surface, ["clay", "glass", "skeuo", "adaptive", "custom"] as const, "custom"),
        transform: normalizeTransform(raw.transform, fallback.transform),
        geometry: normalizeGeometry(raw.geometry, fallback.geometry),
        style: normalizeStyle(raw.style, fallback.style),
        layout: normalizeLayout(raw.layout, fallback.layout),
        responsive: { desktop: responsiveFor("desktop"), tablet: responsiveFor("tablet"), mobile: responsiveFor("mobile") },
        value: finiteNumber(raw.value, fallback.value),
        checked: raw.checked === true,
        icon: enumValue(raw.icon, ["arrow", "play", "heart", "sparkles", "plus", "check"] as const, fallback.icon),
        svgPath: typeof raw.svgPath === "string" ? raw.svgPath : "",
        svgViewBox: typeof raw.svgViewBox === "string" ? raw.svgViewBox : fallback.svgViewBox,
        ...(typeof raw.componentId === "string" ? { componentId: raw.componentId } : {}),
        ...(typeof raw.instanceSourceId === "string" ? { instanceSourceId: raw.instanceSourceId } : {}),
        instanceOverrides,
        bindings,
        accessibility: {
          semanticTag: enumValue(accessibility.semanticTag, ["div", "button", "article", "section", "label", "input", "p", "span"] as const, fallback.accessibility.semanticTag),
          role: typeof accessibility.role === "string" ? accessibility.role : fallback.accessibility.role,
          ariaLabel: typeof accessibility.ariaLabel === "string" ? accessibility.ariaLabel : fallback.accessibility.ariaLabel,
          tabIndex: finiteNumber(accessibility.tabIndex, fallback.accessibility.tabIndex),
          decorative: accessibility.decorative === undefined ? fallback.accessibility.decorative : accessibility.decorative === true,
          reducedMotion: accessibility.reducedMotion !== false,
        },
      } satisfies StudioNode;
    });
    const repaired = repairHierarchy(nodes);
    if (!repaired) return null;
    const nodeIds = new Set(repaired.map((node) => node.id));
    const variants = (Array.isArray(record.variants) ? record.variants : []).map((value) => {
      const raw = asRecord(value);
      const overrides = Object.fromEntries(Object.entries(asRecord(raw.overrides)).filter(([nodeId]) => nodeIds.has(nodeId)).map(([nodeId, override]) => [nodeId, asRecord(override) as NodeOverride]));
      return { id: typeof raw.id === "string" && raw.id ? raw.id : createId("variant"), name: typeof raw.name === "string" ? raw.name : "State", description: typeof raw.description === "string" ? raw.description : "", overrides } satisfies SceneVariant;
    });
    const variables = (Array.isArray(record.variables) ? record.variables : []).map((value) => {
      const raw = asRecord(value);
      const type = enumValue(raw.type, ["string", "number", "color", "boolean"] as const, "string");
      const fallback: StudioVariable["value"] = type === "number" ? 0 : type === "boolean" ? false : type === "color" ? "#ff8068" : "";
      const candidate = ["string", "number", "boolean"].includes(typeof raw.value) ? raw.value as StudioVariable["value"] : fallback;
      const defaultValue = ["string", "number", "boolean"].includes(typeof raw.defaultValue) ? raw.defaultValue as StudioVariable["defaultValue"] : candidate;
      return { id: typeof raw.id === "string" && raw.id ? raw.id : createId("variable"), name: typeof raw.name === "string" ? raw.name : "variable", type, value: candidate, defaultValue } satisfies StudioVariable;
    }).filter((variable, index, items) => items.findIndex((item) => item.id === variable.id) === index);
    const variableIds = new Set(variables.map((variable) => variable.id));
    const interactions = (Array.isArray(record.interactions) ? record.interactions : []).map((value) => {
      const raw = asRecord(value);
      const condition = asRecord(raw.condition);
      return {
        id: typeof raw.id === "string" && raw.id ? raw.id : createId("interaction"),
        sourceNodeId: typeof raw.sourceNodeId === "string" ? raw.sourceNodeId : "",
        sourceVariantId: typeof raw.sourceVariantId === "string" ? raw.sourceVariantId : "base",
        trigger: enumValue(raw.trigger, ["click", "doubleClick", "hover", "hoverEnd", "focus", "blur", "mouseDown", "mouseUp", "drag", "swipe", "scroll", "key", "load", "delay", "variable"] as const, "click"),
        action: enumValue(raw.action, ["changeVariant", "toggleVariant", "setVariable", "playTimeline", "pauseTimeline", "reverseTimeline", "openUrl"] as const, "changeVariant"),
        ...(typeof raw.targetVariantId === "string" ? { targetVariantId: raw.targetVariantId } : {}),
        ...(typeof raw.variableId === "string" && variableIds.has(raw.variableId) ? { variableId: raw.variableId } : {}),
        ...(["string", "number", "boolean"].includes(typeof raw.value) ? { value: raw.value as string | number | boolean } : {}),
        ...(typeof raw.url === "string" ? { url: raw.url } : {}),
        delay: Math.max(0, finiteNumber(raw.delay, 0)), key: typeof raw.key === "string" ? raw.key : "",
        transition: enumValue(raw.transition, ["smart", "instant", "dissolve"] as const, "smart"),
        duration: Math.max(0, finiteNumber(raw.duration, .35)),
        easing: enumValue(raw.easing, ["linear", "easeIn", "easeOut", "easeInOut", "cubicBezier", "spring"] as const, "easeInOut"),
        ...(typeof condition.variableId === "string" && variableIds.has(condition.variableId) ? { condition: { variableId: condition.variableId, operator: enumValue(condition.operator, ["equals", "notEquals", "greater", "less"] as const, "equals"), value: ["string", "number", "boolean"].includes(typeof condition.value) ? condition.value as string | number | boolean : "" } } : {}),
      } satisfies StudioInteraction;
    }).filter((interaction) => nodeIds.has(interaction.sourceNodeId));
    const components = (Array.isArray(record.components) ? record.components : []).map((value) => {
      const raw = asRecord(value);
      const properties = (Array.isArray(raw.properties) ? raw.properties : []).map((value) => {
        const property = asRecord(value);
        const targetPath = typeof property.targetPath === "string" ? property.targetPath : "";
        const defaultValue = ["string", "number", "boolean"].includes(typeof property.defaultValue) ? property.defaultValue as string | number | boolean : "";
        return {
          id: typeof property.id === "string" && property.id ? property.id : createId("property"), name: typeof property.name === "string" ? property.name : "Property",
          type: enumValue(property.type, ["string", "number", "color", "boolean", "enum", "image", "icon"] as const, "string"),
          targetNodeId: typeof property.targetNodeId === "string" ? property.targetNodeId : "", targetPath, defaultValue,
          options: Array.isArray(property.options) ? property.options.filter((option): option is string => typeof option === "string") : [],
        };
      }).filter((property) => nodeIds.has(property.targetNodeId) && isSafePropertyPath(property.targetPath));
      return { id: typeof raw.id === "string" && raw.id ? raw.id : createId("component"), name: typeof raw.name === "string" ? raw.name : "Component", rootNodeId: typeof raw.rootNodeId === "string" ? raw.rootNodeId : "", description: typeof raw.description === "string" ? raw.description : "", properties, variantIds: Array.isArray(raw.variantIds) ? raw.variantIds.filter((id): id is string => typeof id === "string") : [] } satisfies ComponentDefinition;
    }).filter((component) => nodeIds.has(component.rootNodeId));
    const componentIds = new Set(components.map((component) => component.id));
    const finalNodes = repaired.map((node) => ({ ...node, componentId: node.componentId && componentIds.has(node.componentId) ? node.componentId : undefined, instanceSourceId: node.instanceSourceId && nodeIds.has(node.instanceSourceId) ? node.instanceSourceId : undefined }));
    const rawTimeline = asRecord(record.timeline);
    const duration = Math.max(.01, finiteNumber(rawTimeline.duration, 3));
    const tracks = (Array.isArray(rawTimeline.tracks) ? rawTimeline.tracks : []).map((value) => {
      const raw = asRecord(value);
      const variableId = typeof raw.variableId === "string" && variableIds.has(raw.variableId) ? raw.variableId : undefined;
      const property = typeof raw.property === "string" && isSafePropertyPath(raw.property) ? raw.property as AnimatableProperty : variableId ? "variable.value" : "transform.x";
      const keyframes = (Array.isArray(raw.keyframes) ? raw.keyframes : []).map((value) => {
        const frame = asRecord(value);
        const spring = asRecord(frame.spring);
        return {
          id: typeof frame.id === "string" && frame.id ? frame.id : createId("keyframe"), time: Math.max(0, Math.min(duration, finiteNumber(frame.time, 0))),
          value: ["string", "number", "boolean"].includes(typeof frame.value) ? frame.value as KeyframeValue : 0,
          easing: enumValue(frame.easing, ["linear", "easeIn", "easeOut", "easeInOut", "cubicBezier", "spring"] as const, "easeInOut"),
          bezier: normalizeTuple(frame.bezier, [.42, 0, .58, 1]),
          spring: { mass: Math.max(.01, finiteNumber(spring.mass, 1)), stiffness: Math.max(.01, finiteNumber(spring.stiffness, 170)), damping: Math.max(0, finiteNumber(spring.damping, 26)), velocity: finiteNumber(spring.velocity, 0) },
        } satisfies TimelineKeyframe;
      }).sort((a, b) => a.time - b.time);
      return { id: typeof raw.id === "string" && raw.id ? raw.id : createId("track"), nodeId: variableId ? `variable:${variableId}` : typeof raw.nodeId === "string" ? raw.nodeId : "", ...(variableId ? { variableId } : {}), property, enabled: raw.enabled !== false, expanded: raw.expanded !== false, keyframes } satisfies TimelineTrack;
    }).filter((track) => Boolean(track.variableId) || nodeIds.has(track.nodeId));
    const workAreaInput = Array.isArray(rawTimeline.workArea) ? rawTimeline.workArea : [0, duration];
    const workStart = Math.max(0, Math.min(duration, finiteNumber(workAreaInput[0], 0)));
    const workEnd = Math.max(workStart, Math.min(duration, finiteNumber(workAreaInput[1], duration)));
    const timeline: StudioTimeline = {
      duration, fps: numberEnum(finiteNumber(rawTimeline.fps, 60), [24, 30, 60] as const, 60), speed: Math.max(.01, finiteNumber(rawTimeline.speed, 1)),
      loop: rawTimeline.loop === true, direction: enumValue(rawTimeline.direction, ["normal", "reverse", "alternate"] as const, "normal"), workArea: [workStart, workEnd], autoKey: rawTimeline.autoKey === true, tracks,
      markers: (Array.isArray(rawTimeline.markers) ? rawTimeline.markers : []).map((value) => { const marker = asRecord(value); return { id: typeof marker.id === "string" && marker.id ? marker.id : createId("marker"), time: Math.max(0, Math.min(duration, finiteNumber(marker.time, 0))), label: typeof marker.label === "string" ? marker.label : "Marker", color: typeof marker.color === "string" ? marker.color : "#7359df" }; }),
    };
    const fallback = createEmptyDocument(typeof record.name === "string" ? record.name : "Recovered component");
    const canvas = asRecord(record.canvas);
    const tokens = asRecord(record.tokens);
    return {
      ...fallback,
      id: typeof record.id === "string" && record.id ? record.id : fallback.id,
      name: typeof record.name === "string" ? record.name : fallback.name,
      canvas: {
        ...fallback.canvas,
        color: typeof canvas.color === "string" ? canvas.color : fallback.canvas.color,
        device: enumValue(canvas.device, ["desktop", "tablet", "mobile"] as const, fallback.canvas.device),
        showGrid: canvas.showGrid !== false, showRulers: canvas.showRulers !== false, showGuides: canvas.showGuides !== false, snap: canvas.snap !== false,
        gridSize: Math.max(1, finiteNumber(canvas.gridSize, fallback.canvas.gridSize)), width: Math.max(1, finiteNumber(canvas.width, fallback.canvas.width)), height: Math.max(1, finiteNumber(canvas.height, fallback.canvas.height)),
      },
      tokens: { accent: typeof tokens.accent === "string" ? tokens.accent : fallback.tokens.accent, ink: typeof tokens.ink === "string" ? tokens.ink : fallback.tokens.ink, surface: typeof tokens.surface === "string" ? tokens.surface : fallback.tokens.surface, acid: typeof tokens.acid === "string" ? tokens.acid : fallback.tokens.acid, violet: typeof tokens.violet === "string" ? tokens.violet : fallback.tokens.violet },
      nodes: finalNodes, variants, variables, interactions, components, timeline,
      createdAt: typeof record.createdAt === "string" ? record.createdAt : fallback.createdAt,
      updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : fallback.updatedAt,
    };
  }
  if (record.version === 4 && Array.isArray(record.nodes)) {
    const document = createEmptyDocument(String(record.name ?? "Migrated v4 component"));
    document.nodes = (record.nodes as Record<string, unknown>[]).map(migrateV4Node);
    const canvas = (record.canvas ?? {}) as Record<string, unknown>;
    document.canvas.color = String(canvas.color ?? document.canvas.color);
    document.canvas.device = (["desktop", "tablet", "mobile"].includes(String(canvas.device)) ? canvas.device : "desktop") as Device;
    return document;
  }
  return null;
}
