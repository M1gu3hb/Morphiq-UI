export type Surface = "clay" | "glass" | "skeuo" | "adaptive";
export type NodeKind = "button" | "card" | "text" | "badge" | "input" | "toggle" | "avatar" | "progress";
export type Device = "desktop" | "tablet" | "mobile";
export type InspectorTab = "design" | "states" | "motion";
export type InteractionState = "base" | "hover" | "pressed" | "focus" | "disabled";
export type FillType = "solid" | "linear" | "radial";
export type BorderStyle = "solid" | "dashed" | "dotted" | "double";
export type FontFamily = "body" | "display" | "mono";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
export type TransformOrigin = "center" | "top" | "top right" | "right" | "bottom right" | "bottom" | "bottom left" | "left" | "top left";
export type MotionPreset = "none" | "float" | "pulse" | "wobble" | "bounce" | "rotate" | "slide" | "glow" | "shake" | "breathe" | "flip" | "reveal" | "custom";
export type MotionTrigger = "loop" | "hover" | "tap" | "load";
export type MotionEasing = "easeInOut" | "easeOut" | "linear" | "spring";
export type MotionDirection = "normal" | "reverse" | "alternate" | "alternate-reverse";
export type MotionFillMode = "none" | "forwards" | "backwards" | "both";

export type MotionFrame = {
  offset: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  rotateX: number;
  rotateY: number;
  opacity: number;
  blur: number;
  brightness: number;
};

export type NodeStyle = {
  fill: string;
  fillType: FillType;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  color: string;
  radius: number;
  depth: number;
  blur: number;
  saturate: number;
  shadowColor: string;
  shadowOpacity: number;
  borderWidth: number;
  borderColor: string;
  borderStyle: BorderStyle;
  opacity: number;
  padding: number;
  fontSize: number;
  fontWeight: number;
  fontFamily: FontFamily;
  lineHeight: number;
  letterSpacing: number;
  textAlign: "left" | "center" | "right";
  textTransform: TextTransform;
  rotation: number;
  skewX: number;
  skewY: number;
  transformOrigin: TransformOrigin;
};

export type StateStyle = {
  fill: string;
  color: string;
  opacity: number;
  scale: number;
  translateX: number;
  translateY: number;
  rotate: number;
  blur: number;
  outlineColor: string;
};

export type NodeMotion = {
  preset: MotionPreset;
  trigger: MotionTrigger;
  duration: number;
  delay: number;
  easing: MotionEasing;
  repeat: number;
  intensity: number;
  direction: MotionDirection;
  fillMode: MotionFillMode;
  enabled: boolean;
  keyframes: MotionFrame[];
};

export type StudioNode = {
  id: string;
  kind: NodeKind;
  name: string;
  text: string;
  secondaryText: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  locked: boolean;
  lockAspectRatio: boolean;
  disabled: boolean;
  surface: Surface;
  style: NodeStyle;
  states: Record<Exclude<InteractionState, "base">, StateStyle>;
  motion: NodeMotion;
  value: number;
  checked: boolean;
};

export type StudioDocument = {
  version: 4;
  name: string;
  canvas: {
    color: string;
    device: Device;
    showGrid: boolean;
    snap: boolean;
  };
  tokens: {
    accent: string;
    ink: string;
    surface: string;
  };
  nodes: StudioNode[];
};

export const deviceSizes: Record<Device, { width: number; height: number }> = {
  desktop: { width: 820, height: 520 },
  tablet: { width: 640, height: 760 },
  mobile: { width: 390, height: 720 },
};

const baseStyle: NodeStyle = {
  fill: "#ff8068",
  fillType: "solid",
  gradientFrom: "#ffad83",
  gradientTo: "#ff6f61",
  gradientAngle: 145,
  color: "#512219",
  radius: 20,
  depth: 9,
  blur: 18,
  saturate: 135,
  shadowColor: "#432821",
  shadowOpacity: 20,
  borderWidth: 1,
  borderColor: "#c94f3a",
  borderStyle: "solid",
  opacity: 100,
  padding: 18,
  fontSize: 13,
  fontWeight: 800,
  fontFamily: "body",
  lineHeight: 1.2,
  letterSpacing: 0,
  textAlign: "center",
  textTransform: "none",
  rotation: 0,
  skewX: 0,
  skewY: 0,
  transformOrigin: "center",
};

const state = (patch: Partial<StateStyle> = {}): StateStyle => ({
  fill: "",
  color: "",
  opacity: 100,
  scale: 100,
  translateX: 0,
  translateY: 0,
  rotate: 0,
  blur: 0,
  outlineColor: "#7359df",
  ...patch,
});

export const surfaceDefaults: Record<Surface, Partial<NodeStyle> & Pick<NodeStyle, "fill" | "color" | "radius" | "depth" | "blur" | "borderColor">> = {
  clay: { fill: "#ff8068", color: "#512219", radius: 20, depth: 9, blur: 18, borderColor: "#c94f3a", shadowColor: "#432821", shadowOpacity: 20, saturate: 110 },
  glass: { fill: "#ffffff66", color: "#171817", radius: 18, depth: 18, blur: 20, borderColor: "#ffffff", shadowColor: "#31264d", shadowOpacity: 20, saturate: 135 },
  skeuo: { fill: "#d7d4cd", color: "#3e3d39", radius: 18, depth: 8, blur: 12, borderColor: "#a9a69f", shadowColor: "#26241f", shadowOpacity: 25, saturate: 100 },
  adaptive: { fill: "#20211f", color: "#ffffff", radius: 16, depth: 7, blur: 10, borderColor: "#4d5140", shadowColor: "#343a18", shadowOpacity: 24, saturate: 115 },
};

const defaultStates = () => ({
  hover: state({ scale: 103, translateY: -2 }),
  pressed: state({ scale: 97, translateY: 2 }),
  focus: state(),
  disabled: state({ opacity: 48, scale: 100 }),
});

export const defaultMotionFrames = (): MotionFrame[] => [
  { offset: 0, x: 0, y: 0, scale: 100, rotate: 0, rotateX: 0, rotateY: 0, opacity: 100, blur: 0, brightness: 100 },
  { offset: 50, x: 0, y: -8, scale: 104, rotate: 0, rotateX: 0, rotateY: 0, opacity: 100, blur: 0, brightness: 100 },
  { offset: 100, x: 0, y: 0, scale: 100, rotate: 0, rotateX: 0, rotateY: 0, opacity: 100, blur: 0, brightness: 100 },
];

const defaultMotion = (): NodeMotion => ({
  preset: "none",
  trigger: "hover",
  duration: 0.45,
  delay: 0,
  easing: "easeOut",
  repeat: 0,
  intensity: 6,
  direction: "normal",
  fillMode: "none",
  enabled: true,
  keyframes: defaultMotionFrames(),
});

const defaultsByKind: Record<NodeKind, Partial<StudioNode> & { width: number; height: number; text: string; secondaryText: string }> = {
  button: { width: 190, height: 64, text: "Launch project", secondaryText: "", name: "Primary action" },
  card: { width: 270, height: 170, text: "Tactile card", secondaryText: "A layered surface with real depth.", name: "Feature card" },
  text: { width: 190, height: 42, text: "PRESS TO SHIP", secondaryText: "", name: "Text label" },
  badge: { width: 126, height: 34, text: "NEW RELEASE", secondaryText: "", name: "Status badge" },
  input: { width: 250, height: 58, text: "Email address", secondaryText: "name@company.com", name: "Text input" },
  toggle: { width: 190, height: 58, text: "Soft shadows", secondaryText: "", name: "Toggle control", checked: true },
  avatar: { width: 82, height: 82, text: "MH", secondaryText: "", name: "Avatar" },
  progress: { width: 260, height: 76, text: "Build progress", secondaryText: "72%", name: "Progress meter", value: 72 },
};

export function createNode(kind: NodeKind, index = 0): StudioNode {
  const preset = defaultsByKind[kind];
  const style: NodeStyle = { ...baseStyle };
  if (kind === "text") Object.assign(style, { fill: "transparent", color: "#4f4f4a", radius: 0, depth: 0, blur: 0, borderWidth: 0, fontSize: 11, letterSpacing: 2, padding: 0, textTransform: "uppercase" });
  if (kind === "badge") Object.assign(style, { fontSize: 9, radius: 17, padding: 10, textTransform: "uppercase" });
  if (kind === "input") Object.assign(style, surfaceDefaults.glass, { fontSize: 11, padding: 15 });
  if (kind === "toggle") Object.assign(style, surfaceDefaults.skeuo, { fontSize: 11, padding: 13, textAlign: "left" });
  if (kind === "avatar") Object.assign(style, surfaceDefaults.adaptive, { radius: 41, fontSize: 20, fontFamily: "display", padding: 0 });
  if (kind === "progress") Object.assign(style, surfaceDefaults.glass, { fontSize: 10, padding: 14, textAlign: "left" });
  if (kind === "card") Object.assign(style, { fontSize: 22, fontFamily: "display", padding: 22, textAlign: "left" });

  return {
    id: `${kind}-${Date.now()}-${index}`,
    kind,
    name: preset.name ?? kind,
    text: preset.text,
    secondaryText: preset.secondaryText,
    x: 170 + (index % 5) * 18,
    y: 115 + (index % 7) * 16,
    width: preset.width,
    height: preset.height,
    visible: true,
    locked: false,
    lockAspectRatio: kind === "avatar",
    disabled: false,
    surface: kind === "input" || kind === "progress" ? "glass" : kind === "toggle" ? "skeuo" : kind === "avatar" ? "adaptive" : "clay",
    style,
    states: defaultStates(),
    motion: defaultMotion(),
    value: preset.value ?? 72,
    checked: preset.checked ?? false,
  };
}

const launch = createNode("button", 0);
launch.id = "launch";
launch.x = 235;
launch.y = 185;
launch.motion = { ...defaultMotion(), preset: "float", trigger: "loop", duration: 1.8, easing: "easeInOut", repeat: -1, direction: "alternate" };
const caption = createNode("text", 1);
caption.id = "caption";
caption.x = 235;
caption.y = 270;
caption.width = 190;
caption.style.color = "#262724";

export const initialDocument: StudioDocument = {
  version: 4,
  name: "Untitled surface",
  canvas: { color: "#f2efe8", device: "desktop", showGrid: true, snap: true },
  tokens: { accent: "#ff8068", ink: "#262724", surface: "#f2efe8" },
  nodes: [launch, caption],
};

function colorWithAlpha(color: string, opacity: number) {
  const match = color.match(/^#([0-9a-f]{6})$/i);
  if (!match) return `color-mix(in srgb, ${color} ${opacity}%, transparent)`;
  const hex = match[1];
  return `rgba(${Number.parseInt(hex.slice(0, 2), 16)}, ${Number.parseInt(hex.slice(2, 4), 16)}, ${Number.parseInt(hex.slice(4, 6), 16)}, ${opacity / 100})`;
}

export function elementBackground(node: StudioNode) {
  const { fillType, fill, gradientAngle, gradientFrom, gradientTo } = node.style;
  if (fillType === "linear") return `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})`;
  if (fillType === "radial") return `radial-gradient(circle at 35% 25%, ${gradientFrom}, ${gradientTo})`;
  return fill;
}

export function elementShadow(node: StudioNode, depthBoost = 0) {
  const { surface } = node;
  const { depth, blur, shadowColor, shadowOpacity } = node.style;
  const d = depth + depthBoost;
  const shadow = colorWithAlpha(shadowColor, shadowOpacity);
  if (surface === "clay") return `inset 0 4px 4px rgba(255,255,255,.45), inset 0 -5px 7px rgba(100,28,18,.2), 0 ${d}px 0 ${colorWithAlpha(shadowColor, Math.min(100, shadowOpacity + 42))}, 0 ${d + 7}px ${blur}px ${shadow}`;
  if (surface === "glass") return `inset 0 1px 0 rgba(255,255,255,.9), 0 ${d}px ${blur + 12}px ${shadow}`;
  if (surface === "skeuo") return `inset 0 2px 1px rgba(255,255,255,.9), inset 0 -2px 3px rgba(0,0,0,.12), 0 ${d}px ${blur}px ${shadow}`;
  return `inset 0 2px 1px rgba(255,255,255,.15), 0 ${d}px 0 ${colorWithAlpha(shadowColor, Math.min(100, shadowOpacity + 45))}, 0 ${d + 5}px ${blur}px ${shadow}`;
}

function isMotionFrame(value: unknown): value is MotionFrame {
  if (!value || typeof value !== "object") return false;
  const frame = value as Partial<MotionFrame>;
  return [frame.offset, frame.x, frame.y, frame.scale, frame.rotate, frame.rotateX, frame.rotateY, frame.opacity, frame.blur, frame.brightness].every(Number.isFinite);
}

export function normalizeStudioDocument(value: unknown): StudioDocument | null {
  if (!value || typeof value !== "object") return null;
  const document = value as { version?: unknown; name?: unknown; canvas?: Partial<StudioDocument["canvas"]>; tokens?: Partial<StudioDocument["tokens"]>; nodes?: unknown[] };
  const kinds: NodeKind[] = ["button", "card", "text", "badge", "input", "toggle", "avatar", "progress"];
  const surfaces: Surface[] = ["clay", "glass", "skeuo", "adaptive"];
  const motions: MotionPreset[] = ["none", "float", "pulse", "wobble", "bounce", "rotate", "slide", "glow", "shake", "breathe", "flip", "reveal", "custom"];
  if (![3, 4].includes(Number(document.version)) || typeof document.name !== "string" || !document.canvas || !document.tokens || !Array.isArray(document.nodes) || document.nodes.length === 0) return null;
  const nodes = document.nodes.map((value, index) => {
    if (!value || typeof value !== "object") return null;
    const node = value as Partial<StudioNode>;
    if (!node.kind || !kinds.includes(node.kind) || !node.surface || !surfaces.includes(node.surface) || typeof node.id !== "string" || !Number.isFinite(node.x) || !Number.isFinite(node.y) || !Number.isFinite(node.width) || !Number.isFinite(node.height)) return null;
    const fallback = createNode(node.kind, index);
    const preset = node.motion?.preset && motions.includes(node.motion.preset) ? node.motion.preset : fallback.motion.preset;
    const frames = node.motion?.keyframes && node.motion.keyframes.length >= 2 && node.motion.keyframes.length <= 8 && node.motion.keyframes.every(isMotionFrame) ? node.motion.keyframes.map((frame) => ({ ...frame })) : defaultMotionFrames();
    return {
      ...fallback,
      ...node,
      lockAspectRatio: node.lockAspectRatio ?? fallback.lockAspectRatio,
      style: { ...fallback.style, ...(node.style ?? {}) },
      states: {
        hover: { ...fallback.states.hover, ...(node.states?.hover ?? {}) },
        pressed: { ...fallback.states.pressed, ...(node.states?.pressed ?? {}) },
        focus: { ...fallback.states.focus, ...(node.states?.focus ?? {}) },
        disabled: { ...fallback.states.disabled, ...(node.states?.disabled ?? {}) },
      },
      motion: { ...fallback.motion, ...(node.motion ?? {}), preset, keyframes: frames },
    } satisfies StudioNode;
  });
  if (nodes.some((node) => node === null)) return null;
  return {
    version: 4,
    name: document.name,
    canvas: {
      color: typeof document.canvas.color === "string" ? document.canvas.color : initialDocument.canvas.color,
      device: document.canvas.device && document.canvas.device in deviceSizes ? document.canvas.device : "desktop",
      showGrid: document.canvas.showGrid ?? true,
      snap: document.canvas.snap ?? true,
    },
    tokens: {
      accent: typeof document.tokens.accent === "string" ? document.tokens.accent : initialDocument.tokens.accent,
      ink: typeof document.tokens.ink === "string" ? document.tokens.ink : initialDocument.tokens.ink,
      surface: typeof document.tokens.surface === "string" ? document.tokens.surface : initialDocument.tokens.surface,
    },
    nodes: nodes as StudioNode[],
  };
}
