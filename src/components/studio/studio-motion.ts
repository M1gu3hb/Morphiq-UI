import { defaultMotionFrames, type MotionFrame, type StudioNode } from "./studio-model";

const frame = (offset: number, patch: Partial<MotionFrame> = {}): MotionFrame => ({
  ...defaultMotionFrames()[0],
  offset,
  ...patch,
});

export function resolveMotionFrames(node: StudioNode): MotionFrame[] {
  const intensity = node.motion.intensity;
  switch (node.motion.preset) {
    case "float": return [frame(0), frame(50, { y: -intensity }), frame(100)];
    case "pulse": return [frame(0), frame(50, { scale: 100 + intensity }), frame(100)];
    case "wobble": return [frame(0, { rotate: -intensity / 3 }), frame(33, { rotate: intensity / 3 }), frame(66, { rotate: -intensity / 4 }), frame(100, { rotate: 0 })];
    case "bounce": return [frame(0), frame(45, { y: -intensity * 1.8 }), frame(70, { y: intensity / 3 }), frame(100)];
    case "rotate": return [frame(0), frame(50, { rotate: intensity * 6 }), frame(100)];
    case "slide": return [frame(0, { x: -intensity }), frame(50, { x: intensity }), frame(100, { x: -intensity })];
    case "glow": return [frame(0), frame(50, { brightness: 100 + intensity * 2.3 }), frame(100)];
    case "shake": return [frame(0), frame(25, { x: -intensity, rotate: -intensity / 5 }), frame(50, { x: intensity }), frame(75, { x: -intensity / 2, rotate: intensity / 5 }), frame(100)];
    case "breathe": return [frame(0, { scale: 98, opacity: 88 }), frame(50, { scale: 100 + intensity / 2, opacity: 100 }), frame(100, { scale: 98, opacity: 88 })];
    case "flip": return [frame(0), frame(50, { rotateY: 180 }), frame(100, { rotateY: 360 })];
    case "reveal": return [frame(0, { y: intensity * 2, opacity: 0, blur: intensity / 2 }), frame(60, { y: 0, opacity: 100, blur: 0 }), frame(100)];
    case "custom": return node.motion.keyframes.map((item) => ({ ...item }));
    default: return [frame(0), frame(100)];
  }
}

export function directedMotionFrames(node: StudioNode) {
  const frames = resolveMotionFrames(node);
  return node.motion.direction === "reverse" || node.motion.direction === "alternate-reverse" ? [...frames].reverse() : frames;
}

export function motionTarget(node: StudioNode) {
  const frames = directedMotionFrames(node);
  return {
    x: frames.map((item) => item.x),
    y: frames.map((item) => item.y),
    scale: frames.map((item) => item.scale / 100),
    rotate: frames.map((item) => item.rotate),
    rotateX: frames.map((item) => item.rotateX),
    rotateY: frames.map((item) => item.rotateY),
    opacity: frames.map((item) => item.opacity / 100),
    filter: frames.map((item) => `blur(${item.blur}px) brightness(${item.brightness}%)`),
  };
}

export function motionTimes(node: StudioNode) {
  const frames = directedMotionFrames(node);
  const offsets = frames.map((item) => item.offset / 100);
  return node.motion.direction === "reverse" || node.motion.direction === "alternate-reverse" ? offsets.map((offset) => 1 - offset) : offsets;
}

export function motionRepeatType(node: StudioNode): "loop" | "reverse" {
  return node.motion.direction === "alternate" || node.motion.direction === "alternate-reverse" ? "reverse" : "loop";
}

export function motionEasingCss(node: StudioNode) {
  if (node.motion.easing === "spring") return "cubic-bezier(.2, 1.4, .4, 1)";
  if (node.motion.easing === "easeInOut") return "ease-in-out";
  if (node.motion.easing === "easeOut") return "ease-out";
  return "linear";
}

export function motionFrameCss(item: MotionFrame) {
  return `transform: translate(${item.x}px, ${item.y}px) scale(${item.scale / 100}) rotate(${item.rotate}deg) rotateX(${item.rotateX}deg) rotateY(${item.rotateY}deg); opacity: ${item.opacity / 100}; filter: blur(${item.blur}px) brightness(${item.brightness}%);`;
}

export function motionKeyframesCss(node: StudioNode, name: string) {
  if (node.motion.preset === "none") return "";
  return `@keyframes ${name} {\n${resolveMotionFrames(node).map((item) => `  ${item.offset}% { ${motionFrameCss(item)} }`).join("\n")}\n}`;
}
