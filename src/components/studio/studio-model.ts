export type Surface = "clay" | "glass" | "skeuo" | "adaptive";
export type NodeKind = "button" | "card" | "text" | "badge" | "input" | "toggle" | "avatar" | "progress";
export type Device = "desktop" | "tablet" | "mobile";
export type InspectorTab = "design" | "states" | "motion";
export type InteractionState = "base" | "hover" | "pressed" | "focus" | "disabled";
export type MotionPreset = "none" | "float" | "pulse" | "wobble" | "bounce" | "rotate" | "slide" | "glow";
export type MotionTrigger = "loop" | "hover" | "tap" | "load";
export type MotionEasing = "easeInOut" | "easeOut" | "linear" | "spring";

export type NodeStyle = {
  fill: string;
  color: string;
  radius: number;
  depth: number;
  blur: number;
  borderWidth: number;
  borderColor: string;
  opacity: number;
  padding: number;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  textAlign: "left" | "center" | "right";
};

export type StateStyle = {
  fill: string;
  color: string;
  opacity: number;
  scale: number;
  translateY: number;
  rotate: number;
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
  disabled: boolean;
  surface: Surface;
  style: NodeStyle;
  states: Record<Exclude<InteractionState, "base">, StateStyle>;
  motion: NodeMotion;
  value: number;
  checked: boolean;
};

export type StudioDocument = {
  version: 3;
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
  color: "#512219",
  radius: 20,
  depth: 9,
  blur: 18,
  borderWidth: 1,
  borderColor: "#c94f3a",
  opacity: 100,
  padding: 18,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 0,
  textAlign: "center",
};

const state = (patch: Partial<StateStyle> = {}): StateStyle => ({
  fill: "",
  color: "",
  opacity: 100,
  scale: 100,
  translateY: 0,
  rotate: 0,
  outlineColor: "#7359df",
  ...patch,
});

export const surfaceDefaults: Record<Surface, Pick<NodeStyle, "fill" | "color" | "radius" | "depth" | "blur" | "borderColor">> = {
  clay: { fill: "#ff8068", color: "#512219", radius: 20, depth: 9, blur: 18, borderColor: "#c94f3a" },
  glass: { fill: "#ffffff66", color: "#171817", radius: 18, depth: 18, blur: 20, borderColor: "#ffffff" },
  skeuo: { fill: "#d7d4cd", color: "#3e3d39", radius: 18, depth: 8, blur: 12, borderColor: "#a9a69f" },
  adaptive: { fill: "#20211f", color: "#ffffff", radius: 16, depth: 7, blur: 10, borderColor: "#4d5140" },
};

const defaultStates = () => ({
  hover: state({ scale: 103, translateY: -2 }),
  pressed: state({ scale: 97, translateY: 2 }),
  focus: state(),
  disabled: state({ opacity: 48, scale: 100 }),
});

const defaultMotion = (): NodeMotion => ({ preset: "none", trigger: "hover", duration: 0.45, delay: 0, easing: "easeOut", repeat: 0, intensity: 6 });

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
  if (kind === "text") Object.assign(style, { fill: "transparent", color: "#4f4f4a", radius: 0, depth: 0, blur: 0, borderWidth: 0, fontSize: 11, letterSpacing: 2, padding: 0 });
  if (kind === "badge") Object.assign(style, { fontSize: 9, radius: 17, padding: 10 });
  if (kind === "input") Object.assign(style, surfaceDefaults.glass, { fontSize: 11, padding: 15 });
  if (kind === "toggle") Object.assign(style, surfaceDefaults.skeuo, { fontSize: 11, padding: 13, textAlign: "left" });
  if (kind === "avatar") Object.assign(style, surfaceDefaults.adaptive, { radius: 41, fontSize: 20, padding: 0 });
  if (kind === "progress") Object.assign(style, surfaceDefaults.glass, { fontSize: 10, padding: 14, textAlign: "left" });
  if (kind === "card") Object.assign(style, { fontSize: 22, padding: 22, textAlign: "left" });

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
launch.motion = { preset: "float", trigger: "loop", duration: 1.8, delay: 0, easing: "easeInOut", repeat: -1, intensity: 6 };
const caption = createNode("text", 1);
caption.id = "caption";
caption.x = 235;
caption.y = 270;
caption.width = 190;
caption.style.color = "#262724";

export const initialDocument: StudioDocument = {
  version: 3,
  name: "Untitled surface",
  canvas: { color: "#f2efe8", device: "desktop", showGrid: true, snap: true },
  tokens: { accent: "#ff8068", ink: "#262724", surface: "#f2efe8" },
  nodes: [launch, caption],
};

export function elementShadow(node: StudioNode, depthBoost = 0) {
  const { surface } = node;
  const { depth, blur } = node.style;
  const d = depth + depthBoost;
  if (surface === "clay") return `inset 0 4px 4px rgba(255,255,255,.45), inset 0 -5px 7px rgba(100,28,18,.2), 0 ${d}px 0 rgba(145,55,38,.82), 0 ${d + 7}px ${blur}px rgba(67,40,33,.18)`;
  if (surface === "glass") return `inset 0 1px 0 rgba(255,255,255,.9), 0 ${d}px ${blur + 12}px rgba(49,38,77,.2)`;
  if (surface === "skeuo") return `inset 0 2px 1px rgba(255,255,255,.9), inset 0 -2px 3px rgba(0,0,0,.12), 0 ${d}px ${blur}px rgba(38,36,31,.25)`;
  return `inset 0 2px 1px rgba(255,255,255,.15), 0 ${d}px 0 rgba(104,111,61,.9), 0 ${d + 5}px ${blur}px rgba(52,58,24,.16)`;
}

export function isStudioDocument(value: unknown): value is StudioDocument {
  if (!value || typeof value !== "object") return false;
  const document = value as Partial<StudioDocument>;
  const kinds: NodeKind[] = ["button", "card", "text", "badge", "input", "toggle", "avatar", "progress"];
  const surfaces: Surface[] = ["clay", "glass", "skeuo", "adaptive"];
  const motions: MotionPreset[] = ["none", "float", "pulse", "wobble", "bounce", "rotate", "slide", "glow"];
  return document.version === 3
    && typeof document.name === "string"
    && !!document.canvas
    && !!document.tokens
    && Array.isArray(document.nodes)
    && document.nodes.length > 0
    && document.nodes.every((node) => node
      && typeof node.id === "string"
      && kinds.includes(node.kind)
      && surfaces.includes(node.surface)
      && Number.isFinite(node.x)
      && Number.isFinite(node.y)
      && Number.isFinite(node.width)
      && Number.isFinite(node.height)
      && !!node.style
      && typeof node.style.fill === "string"
      && Number.isFinite(node.style.radius)
      && !!node.states?.hover
      && !!node.states?.pressed
      && !!node.states?.focus
      && !!node.states?.disabled
      && !!node.motion
      && motions.includes(node.motion.preset));
}
