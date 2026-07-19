import {
  createId,
  getPathValue,
  setPathValue,
  type AnimatableProperty,
  type EasingType,
  type KeyframeValue,
  type StudioNode,
  type StudioTimeline,
  type StudioVariable,
  type TimelineKeyframe,
  type TimelineTrack,
} from "./studio-model";

export const easingOptions: { value: EasingType; label: string }[] = [
  { value: "linear", label: "Linear" },
  { value: "easeIn", label: "Ease in" },
  { value: "easeOut", label: "Ease out" },
  { value: "easeInOut", label: "Ease in/out" },
  { value: "cubicBezier", label: "Cubic Bézier" },
  { value: "spring", label: "Spring" },
];

export function createKeyframe(time: number, value: KeyframeValue): TimelineKeyframe {
  return {
    id: createId("keyframe"),
    time,
    value,
    easing: "easeInOut",
    bezier: [0.42, 0, 0.58, 1],
    spring: { mass: 1, stiffness: 170, damping: 22, velocity: 0 },
  };
}

export function createTrack(node: StudioNode, property: AnimatableProperty, duration: number): TimelineTrack {
  const value = getPathValue(node, property);
  return {
    id: createId("track"),
    nodeId: node.id,
    property,
    enabled: true,
    expanded: true,
    keyframes: [createKeyframe(0, value), createKeyframe(duration, value)],
  };
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function cubicBezierCoordinate(t: number, first: number, second: number) {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * first + 3 * inverse * t * t * second + t * t * t;
}

function cubicBezierProgress(progress: number, bezier: TimelineKeyframe["bezier"]) {
  const [x1, y1, x2, y2] = bezier;
  let low = 0;
  let high = 1;
  let parameter = progress;
  for (let index = 0; index < 14; index += 1) {
    parameter = (low + high) / 2;
    const x = cubicBezierCoordinate(parameter, x1, x2);
    if (x < progress) low = parameter; else high = parameter;
  }
  return cubicBezierCoordinate(parameter, y1, y2);
}

function easedProgress(progress: number, keyframe: TimelineKeyframe) {
  const t = clamp(progress);
  if (keyframe.easing === "linear") return t;
  if (keyframe.easing === "easeIn") return t * t * t;
  if (keyframe.easing === "easeOut") return 1 - Math.pow(1 - t, 3);
  if (keyframe.easing === "easeInOut") return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  if (keyframe.easing === "cubicBezier") return cubicBezierProgress(t, keyframe.bezier);
  const { mass, stiffness, damping, velocity } = keyframe.spring;
  const safeMass = Math.max(0.1, mass);
  const angular = Math.sqrt(Math.max(1, stiffness) / safeMass);
  const dampingRatio = damping / (2 * Math.sqrt(Math.max(1, stiffness) * safeMass));
  const decay = Math.exp(-dampingRatio * angular * t * 6);
  const oscillation = Math.cos(angular * Math.sqrt(Math.max(0.01, 1 - dampingRatio * dampingRatio)) * t * 0.75 + velocity * 0.03);
  return clamp(1 - decay * oscillation, -0.35, 1.35);
}

function parseHex(value: string) {
  const match = value.match(/^#([0-9a-f]{6})$/i);
  if (!match) return null;
  return [Number.parseInt(match[1].slice(0, 2), 16), Number.parseInt(match[1].slice(2, 4), 16), Number.parseInt(match[1].slice(4, 6), 16)];
}

function interpolateColor(from: string, to: string, progress: number) {
  const a = parseHex(from);
  const b = parseHex(to);
  if (!a || !b) return progress < 0.5 ? from : to;
  const channel = (index: number) => Math.round(a[index] + (b[index] - a[index]) * progress).toString(16).padStart(2, "0");
  return `#${channel(0)}${channel(1)}${channel(2)}`;
}

export function interpolateValue(from: KeyframeValue, to: KeyframeValue, progress: number): KeyframeValue {
  if (typeof from === "number" && typeof to === "number") return from + (to - from) * progress;
  if (typeof from === "string" && typeof to === "string") return interpolateColor(from, to, progress);
  return progress < 0.5 ? from : to;
}

export function valueAtTime(track: TimelineTrack, time: number): KeyframeValue | undefined {
  if (!track.enabled || !track.keyframes.length) return undefined;
  const frames = [...track.keyframes].sort((a, b) => a.time - b.time);
  if (time <= frames[0].time) return frames[0].value;
  if (time >= frames.at(-1)!.time) return frames.at(-1)!.value;
  const rightIndex = frames.findIndex((frame) => frame.time >= time);
  const before = frames[rightIndex - 1];
  const after = frames[rightIndex];
  const duration = Math.max(0.0001, after.time - before.time);
  const progress = easedProgress((time - before.time) / duration, before);
  return interpolateValue(before.value, after.value, progress);
}

export function applyTimelineToNodes(nodes: StudioNode[], timeline: StudioTimeline, time: number) {
  const tracksByNode = new Map<string, TimelineTrack[]>();
  timeline.tracks.forEach((track) => {
    if (!tracksByNode.has(track.nodeId)) tracksByNode.set(track.nodeId, []);
    tracksByNode.get(track.nodeId)!.push(track);
  });
  return nodes.map((source) => {
    let node = source;
    const tracks = [...(tracksByNode.get(node.id) ?? []), ...(node.instanceSourceId ? tracksByNode.get(node.instanceSourceId) ?? [] : [])];
    for (const track of tracks) {
      const value = valueAtTime(track, time);
      if (value !== undefined) node = setPathValue(node, track.property, value);
    }
    return node;
  });
}

export function applyTimelineToVariables(variables: StudioVariable[], timeline: StudioTimeline, time: number) {
  const tracks = new Map(timeline.tracks.filter((track) => track.variableId).map((track) => [track.variableId!, track]));
  return variables.map((variable) => {
    const track = tracks.get(variable.id);
    const value = track ? valueAtTime(track, time) : undefined;
    return value === undefined ? variable : { ...variable, value };
  });
}

export function upsertKeyframe(timeline: StudioTimeline, node: StudioNode, property: AnimatableProperty, time: number, value?: KeyframeValue): StudioTimeline {
  const tracks = timeline.tracks.map((track) => ({ ...track, keyframes: track.keyframes.map((keyframe) => ({ ...keyframe })) }));
  let track = tracks.find((candidate) => candidate.nodeId === node.id && candidate.property === property);
  if (!track) {
    track = createTrack(node, property, timeline.duration);
    tracks.push(track);
  }
  const frameValue = value ?? getPathValue(node, property);
  const existing = track.keyframes.find((keyframe) => Math.abs(keyframe.time - time) < 0.001);
  if (existing) existing.value = frameValue;
  else track.keyframes.push(createKeyframe(time, frameValue));
  track.keyframes.sort((a, b) => a.time - b.time);
  return { ...timeline, tracks };
}

export function removeKeyframes(timeline: StudioTimeline, ids: Set<string>): StudioTimeline {
  const tracks = timeline.tracks
    .map((track) => ({ ...track, keyframes: track.keyframes.filter((keyframe) => !ids.has(keyframe.id)) }))
    .filter((track) => track.keyframes.length > 0);
  return { ...timeline, tracks };
}

export function duplicateKeyframes(timeline: StudioTimeline, ids: Set<string>, offset = 0.15): { timeline: StudioTimeline; ids: Set<string> } {
  const nextIds = new Set<string>();
  const tracks = timeline.tracks.map((track) => {
    const duplicates = track.keyframes.filter((frame) => ids.has(frame.id)).map((frame) => {
      const clone = { ...frame, id: createId("keyframe"), time: Math.min(timeline.duration, frame.time + offset), spring: { ...frame.spring }, bezier: [...frame.bezier] as TimelineKeyframe["bezier"] };
      nextIds.add(clone.id);
      return clone;
    });
    return { ...track, keyframes: [...track.keyframes, ...duplicates].sort((a, b) => a.time - b.time) };
  });
  return { timeline: { ...timeline, tracks }, ids: nextIds };
}

export function moveKeyframes(timeline: StudioTimeline, ids: Set<string>, delta: number): StudioTimeline {
  return {
    ...timeline,
    tracks: timeline.tracks.map((track) => ({
      ...track,
      keyframes: track.keyframes.map((frame) => ids.has(frame.id) ? { ...frame, time: clamp(frame.time + delta, 0, timeline.duration) } : frame).sort((a, b) => a.time - b.time),
    })),
  };
}

export function reverseTimeline(timeline: StudioTimeline) {
  const [start, end] = timeline.workArea;
  return {
    ...timeline,
    tracks: timeline.tracks.map((track) => ({
      ...track,
      keyframes: track.keyframes.map((frame) => frame.time >= start && frame.time <= end ? { ...frame, time: start + end - frame.time } : frame).sort((a, b) => a.time - b.time),
    })),
  };
}

export function stretchTimelineSelection(timeline: StudioTimeline, ids: Set<string>, factor: number) {
  const selected = timeline.tracks.flatMap((track) => track.keyframes.filter((frame) => ids.has(frame.id)));
  if (selected.length < 2) return timeline;
  const start = Math.min(...selected.map((frame) => frame.time));
  return {
    ...timeline,
    tracks: timeline.tracks.map((track) => ({
      ...track,
      keyframes: track.keyframes.map((frame) => ids.has(frame.id) ? { ...frame, time: clamp(start + (frame.time - start) * factor, 0, timeline.duration) } : frame).sort((a, b) => a.time - b.time),
    })),
  };
}

export function staggerTracks(timeline: StudioTimeline, nodeIds: string[], amount: number) {
  const order = new Map(nodeIds.map((id, index) => [id, index]));
  return {
    ...timeline,
    tracks: timeline.tracks.map((track) => {
      const index = order.get(track.nodeId);
      if (index === undefined) return track;
      return { ...track, keyframes: track.keyframes.map((frame) => ({ ...frame, time: clamp(frame.time + index * amount, 0, timeline.duration) })) };
    }),
  };
}

export function easingCss(easing: EasingType, bezier: TimelineKeyframe["bezier"] = [0.42, 0, 0.58, 1]) {
  if (easing === "linear") return "linear";
  if (easing === "easeIn") return "ease-in";
  if (easing === "easeOut") return "ease-out";
  if (easing === "spring") return "cubic-bezier(.18, 1.35, .38, 1)";
  if (easing === "cubicBezier") return `cubic-bezier(${bezier.join(", ")})`;
  return "ease-in-out";
}

export function keyframesToCss(track: TimelineTrack, duration: number, name: string) {
  const frames = [...track.keyframes].sort((a, b) => a.time - b.time);
  return `@keyframes ${name} {\n${frames.map((frame) => `  ${(frame.time / duration * 100).toFixed(3)}% { --morphiq-value: ${String(frame.value)}; }`).join("\n")}\n}`;
}
