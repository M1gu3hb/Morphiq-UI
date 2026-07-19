import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const output = mkdtempSync(join(tmpdir(), "morphiq-studio-v5-"));

try {
  execFileSync(join(root, "node_modules", ".bin", "tsc"), [
    "--target", "es2022",
    "--module", "commonjs",
    "--moduleResolution", "node",
    "--esModuleInterop",
    "--skipLibCheck",
    "--outDir", output,
    "src/components/studio/studio-model.ts",
    "src/components/studio/studio-motion.ts",
    "src/components/studio/studio-templates.ts",
    "src/components/studio/studio-export.ts",
  ], { cwd: root, stdio: "inherit" });

  const model = require(join(output, "studio-model.js"));
  const motion = require(join(output, "studio-motion.js"));
  const templates = require(join(output, "studio-templates.js"));
  const exporter = require(join(output, "studio-export.js"));
  const ts = require(join(root, "node_modules", "typescript"));

  assert.equal(templates.studioTemplates.length, 5, "The five editable v5 templates must remain available");
  const requiredKinds = ["frame", "group", "rectangle", "ellipse", "line", "arrow", "polygon", "star", "text", "image", "icon", "vector", "button", "input", "toggle", "slider", "dial", "progress", "boolean", "componentInstance"];
  const requiredPaints = ["solid", "linear", "radial", "conic", "diamond", "image", "noise", "pattern"];
  const requiredEffects = ["dropShadow", "innerShadow", "glow", "innerGlow", "layerBlur", "backgroundBlur", "noise", "texture"];
  for (const kind of requiredKinds) assert.equal(model.createNode(kind).kind, kind, `Missing editable node kind: ${kind}`);
  for (const type of requiredPaints) assert.equal(model.createPaint(type).type, type, `Missing paint type: ${type}`);
  for (const type of requiredEffects) assert.equal(model.createEffect(type).type, type, `Missing effect type: ${type}`);
  for (const surface of ["clay", "glass", "skeuo", "adaptive"]) {
    assert.ok(model.surfaceRecipes[surface].fills.length, `${surface}: material recipe has no fills`);
    assert.ok(model.surfaceRecipes[surface].effects.length, `${surface}: material recipe has no effects`);
    const showcase = templates.studioTemplates.find((template) => template.family === surface);
    assert.ok(showcase, `${surface}: editable showcase template is missing`);
    for (const suffix of ["showcase", "stage", "label", "heading", "arrow"]) assert.ok(showcase.document.nodes.some((node) => node.id === `${surface}-${suffix}`), `${surface}: complete card layer ${suffix} is missing`);
  }
  const adaptive = templates.studioTemplates.find((template) => template.family === "adaptive").document;
  assert.ok(adaptive.nodes.some((node) => Object.keys(node.responsive.mobile).length), "Adaptive template has no mobile override");
  const door = templates.studioTemplates.find((template) => template.id === "double-door").document;
  assert.ok(door.variants.length >= 2, "Door template needs authored visual states");
  assert.ok(door.interactions.length, "Door template needs a real prototype connection");
  assert.ok(door.timeline.tracks.length >= 2, "Door template needs coordinated layer tracks");
  assert.ok(door.nodes.some((node) => node.transform.pivotX === 0) && door.nodes.some((node) => node.transform.pivotX === 100), "Door leaves need opposing free hinge pivots");
  let totalNodes = 0;
  let totalTracks = 0;
  const generatedSources = [];

  for (const template of templates.studioTemplates) {
    const document = structuredClone(template.document);
    totalNodes += document.nodes.length;
    totalTracks += document.timeline.tracks.length;
    const nodeMap = new Map(document.nodes.map((node) => [node.id, node]));

    for (const node of document.nodes) {
      for (const childId of node.childIds) {
        assert.ok(nodeMap.has(childId), `${template.id}: missing child ${childId}`);
        assert.equal(nodeMap.get(childId).parentId, node.id, `${template.id}: inconsistent parent link`);
      }
    }

    const visiting = new Set();
    const visited = new Set();
    const visit = (nodeId) => {
      assert.ok(!visiting.has(nodeId), `${template.id}: cyclic layer hierarchy`);
      if (visited.has(nodeId)) return;
      visiting.add(nodeId);
      for (const childId of nodeMap.get(nodeId)?.childIds ?? []) visit(childId);
      visiting.delete(nodeId);
      visited.add(nodeId);
    };
    for (const node of document.nodes) visit(node.id);

    assert.ok(model.normalizeStudioDocument(JSON.parse(JSON.stringify(document))), `${template.id}: v5 normalization failed`);

    const react = exporter.generateReact(document);
    const css = exporter.generateCss(document);
    const html = exporter.generateHtml(document);
    const svg = exporter.generateSvg(document, []);
    const ai = exporter.generateAiPrompt(document);
    const parsed = ts.createSourceFile(`${template.id}.tsx`, react, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    generatedSources.push({ filename: `${template.id}.tsx`, source: react });

    assert.equal(parsed.parseDiagnostics.length, 0, `${template.id}: generated React contains invalid TSX`);
    assert.match(react, /export function Morphiq/, `${template.id}: React component missing`);
    const exportedClasses = [...react.matchAll(/className=\{styles\["([^"]+)"\]\} data-node-id=/g)].map((match) => match[1]);
    assert.equal(new Set(exportedClasses).size, exportedClasses.length, `${template.id}: exported layer class collision`);
    assert.match(css, /prefers-reduced-motion/, `${template.id}: reduced-motion fallback missing`);
    assert.ok(html.startsWith("<!doctype html>"), `${template.id}: standalone HTML missing doctype`);
    assert.ok(!html.includes("className="), `${template.id}: standalone HTML leaked React attributes`);
    assert.ok(!html.includes("onClick={"), `${template.id}: standalone HTML leaked JSX handlers`);
    assert.ok(svg.startsWith("<svg"), `${template.id}: SVG export missing`);
    assert.match(svg, /<foreignObject/, `${template.id}: SVG export omitted the complete web composition`);
    assert.ok(!svg.includes("className="), `${template.id}: SVG export leaked React attributes`);
    assert.ok(ai.includes(react), `${template.id}: AI handoff omitted source code`);
  }

  const node = model.createNode("rectangle");
  const track = motion.createTrack(node, "transform.x", 2);
  track.keyframes = [motion.createKeyframe(0, 0), motion.createKeyframe(2, 100)];
  track.keyframes[0].easing = "linear";
  assert.equal(motion.valueAtTime(track, 1), 50, "Numeric timeline interpolation failed");
  const staleTrack = { ...track, id: "stale-track", property: "style.effects.99.blur" };
  assert.doesNotThrow(() => motion.applyTimelineToNodes([node], { ...model.createTimeline(), tracks: [staleTrack] }, 1), "Stale dynamic tracks must not crash the editor");

  const cyclic = structuredClone(templates.studioTemplates[0].document);
  cyclic.nodes[0].parentId = cyclic.nodes[1].id;
  cyclic.nodes[1].parentId = cyclic.nodes[0].id;
  cyclic.nodes[0].childIds = [cyclic.nodes[1].id];
  cyclic.nodes[1].childIds = [cyclic.nodes[0].id];
  const repaired = model.normalizeStudioDocument(cyclic);
  assert.ok(repaired, "Recoverable cyclic imports must be normalized");
  assert.ok(repaired.nodes.some((candidate) => !candidate.parentId), "Hierarchy repair must restore a root node");
  const duplicated = structuredClone(cyclic);
  duplicated.nodes[1].id = duplicated.nodes[0].id;
  assert.equal(model.normalizeStudioDocument(duplicated), null, "Ambiguous duplicate layer ids must be rejected");
  assert.equal(model.isSafePropertyPath("style.fills.0.color"), true, "Valid nested property paths must remain available");
  assert.equal(model.isSafePropertyPath("__proto__.polluted"), false, "Prototype paths must be rejected");
  model.setPathValue(node, "__proto__.polluted", "unsafe");
  assert.equal({}.polluted, undefined, "Timeline property paths must not mutate object prototypes");
  const malformed = structuredClone(templates.studioTemplates[0].document);
  malformed.nodes[0].geometry.vectorPoints = "not-an-array";
  malformed.nodes[0].style.fills = [{ type: "radial", stops: "not-an-array" }];
  malformed.variants = [{ id: "unsafe-variant", name: "Unsafe", description: "", overrides: { [malformed.nodes[0].id]: { childIds: "not-an-array", kind: "input", text: "Safe text" } } }];
  malformed.timeline.tracks = [{ id: "unsafe-track", nodeId: malformed.nodes[0].id, property: "__proto__.polluted", enabled: true, expanded: true, keyframes: "not-an-array" }];
  malformed.components = [{ id: "unsafe-component", name: "Unsafe", rootNodeId: malformed.nodes[0].id, description: "", variantIds: [], properties: [{ id: "unsafe-property", name: "Unsafe", type: "string", targetNodeId: malformed.nodes[0].id, targetPath: "constructor.prototype.polluted", defaultValue: "x", options: [] }] }];
  const normalizedMalformed = model.normalizeStudioDocument(malformed);
  assert.ok(normalizedMalformed, "Recoverable malformed v5 collections must be normalized");
  assert.ok(Array.isArray(normalizedMalformed.nodes[0].geometry.vectorPoints), "Malformed vector collections must be repaired");
  assert.ok(Array.isArray(normalizedMalformed.nodes[0].style.fills[0].stops), "Malformed gradient stops must be repaired");
  assert.equal(normalizedMalformed.components[0].properties.length, 0, "Unsafe component property paths must be removed");
  assert.equal(normalizedMalformed.timeline.tracks[0].property, "transform.x", "Unsafe timeline paths must fall back to a valid property");
  const safelyMerged = model.mergeNodeOverride(normalizedMalformed.nodes[0], normalizedMalformed.variants[0].overrides[normalizedMalformed.nodes[0].id]);
  assert.ok(Array.isArray(safelyMerged.childIds), "Variant overrides must not replace structural layer fields");
  assert.equal(safelyMerged.kind, normalizedMalformed.nodes[0].kind, "Variant overrides must not replace node kinds");

  const variable = { id: "amount", name: "Amount", type: "number", value: 0, defaultValue: 0 };
  const variableTrack = { ...track, id: "variable-track", nodeId: "variable:amount", variableId: "amount", property: "variable.value" };
  const variables = motion.applyTimelineToVariables([variable], { ...model.createTimeline(), tracks: [variableTrack] }, 1);
  assert.equal(variables[0].value, 50, "Variable timeline interpolation failed");

  const interactive = structuredClone(templates.studioTemplates[0].document);
  interactive.variables = [variable];
  interactive.timeline.tracks.push(variableTrack);
  const animatedTextNode = interactive.nodes.find((candidate) => ["text", "button", "input", "toggle", "slider", "dial", "progress"].includes(candidate.kind));
  assert.ok(animatedTextNode, "Interactive fixture requires a text-capable node");
  const textTrack = motion.createTrack(animatedTextNode, "text", interactive.timeline.duration);
  textTrack.keyframes = [motion.createKeyframe(0, "Closed"), motion.createKeyframe(interactive.timeline.duration, "Open")];
  interactive.timeline.tracks.push(textTrack);
  const animatedVector = model.createNode("vector", { id: "animated-vector" });
  animatedVector.geometry.clipPoints = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }];
  interactive.nodes.push(animatedVector);
  const vectorTrack = motion.createTrack(animatedVector, "geometry.vectorPoints.0.x", interactive.timeline.duration);
  vectorTrack.keyframes = [motion.createKeyframe(0, animatedVector.geometry.vectorPoints[0].x), motion.createKeyframe(interactive.timeline.duration, 72)];
  vectorTrack.keyframes[0].easing = "spring";
  vectorTrack.keyframes[0].spring = { mass: 1.7, stiffness: 210, damping: 18, velocity: 2 };
  const clipTrack = motion.createTrack(animatedVector, "geometry.clipPoints.0.x", interactive.timeline.duration);
  clipTrack.keyframes = [motion.createKeyframe(0, 0), motion.createKeyframe(interactive.timeline.duration, 18)];
  interactive.timeline.tracks.push(vectorTrack, clipTrack);
  interactive.timeline.workArea = [0.5, 1.5];
  interactive.timeline.speed = 2;
  interactive.interactions.push({
    id: "test-interaction",
    sourceNodeId: interactive.nodes[0].id,
    sourceVariantId: "base",
    trigger: "click",
    action: "setVariable",
    variableId: variable.id,
    value: "current + 1",
    delay: 0,
    key: "Enter",
    transition: "smart",
    duration: 0.35,
    easing: "easeInOut",
  });
  interactive.interactions.push({
    id: "test-url",
    sourceNodeId: interactive.nodes[0].id,
    sourceVariantId: "base",
    trigger: "doubleClick",
    action: "openUrl",
    url: "https://example.com",
    delay: 0,
    key: "",
    transition: "instant",
    duration: 0,
    easing: "linear",
  });
  interactive.interactions.push({
    id: "test-key",
    sourceNodeId: interactive.nodes[0].id,
    sourceVariantId: "base",
    trigger: "key",
    action: "pauseTimeline",
    delay: 0,
    key: "Escape",
    transition: "instant",
    duration: 0,
    easing: "linear",
  });
  interactive.interactions.push({
    id: "test-swipe",
    sourceNodeId: interactive.nodes[0].id,
    sourceVariantId: "base",
    trigger: "swipe",
    action: "toggleVariant",
    targetVariantId: "base",
    delay: 0,
    key: "",
    transition: "smart",
    duration: 0.35,
    easing: "easeInOut",
  });
  interactive.nodes[0].style.effects.push(model.createEffect("texture", { intensity: 72, blendMode: "soft-light" }));
  const interactiveReact = exporter.generateReact(interactive);
  const interactiveCss = exporter.generateCss(interactive);
  const interactiveParsed = ts.createSourceFile("interactive.tsx", interactiveReact, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  generatedSources.push({ filename: "interactive.tsx", source: interactiveReact });
  assert.equal(interactiveParsed.parseDiagnostics.length, 0, "Interactive generated React contains invalid TSX");
  assert.match(interactiveReact, /morphiqVariableTracks/, "Variable motion was not exported");
  assert.match(interactiveReact, /morphiqNodeTracks/, "Animated text/value tracks were not exported");
  assert.match(interactiveReact, /nodeMotionValues/, "Animated content state was not connected to the React output");
  assert.match(interactiveReact, /animated-vector:geometry\.vectorPoints\.0\.x/, "Animated vector points were not connected to the React runtime");
  assert.match(interactiveReact, /<path d=\{`M /, "Generated vector paths do not consume animated point values");
  assert.match(interactiveReact, /if \(variant === "base"\)/, "Interaction variant guard was not exported");
  assert.match(interactiveReact, /pointerOrigins/, "Swipe distance tracking was not exported");
  assert.match(interactiveReact, /data-transition=\{transition\.type\}/, "Interaction transition mode was not exported");
  assert.match(interactiveReact, /function openMorphiqUrl/, "Safe URL runtime was not exported");
  assert.match(interactiveReact, /\["http:", "https:", "mailto:", "tel:"\]/, "Unsafe URL protocols are not blocked in generated React");
  assert.match(interactiveReact, /window\.addEventListener\("keydown", onMorphiqKeyDown\)/, "Global keyboard interactions were not exported");
  assert.match(interactiveCss, /0\.000%/, "CSS motion did not normalize the work-area start");
  assert.match(interactiveCss, /100\.000%/, "CSS motion did not normalize the work-area end");
  assert.match(interactiveCss, /animation: [^;]+ 0\.5s/, "CSS motion duration did not honor work area and speed");
  assert.match(interactiveCss, /repeating-linear-gradient/, "Texture effect was not exported");
  assert.match(interactiveCss, /clip-path: polygon/, "Animated clip paths were not exported");
  assert.match(interactiveCss, /--morphiq-stroke/, "Animated SVG stroke tokens were not exported");
  assert.ok((interactiveCss.match(/animation-timing-function: linear/g) ?? []).length > 20, "Configured springs were not sampled into exportable motion frames");

  const controls = model.createEmptyDocument("Accessible controls");
  controls.nodes = [model.createNode("input"), model.createNode("toggle"), model.createNode("slider"), model.createNode("dial")];
  const controlsReact = exporter.generateReact(controls);
  const controlsParsed = ts.createSourceFile("controls.tsx", controlsReact, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  generatedSources.push({ filename: "controls.tsx", source: controlsReact });
  assert.equal(controlsParsed.parseDiagnostics.length, 0, "Generated control React contains invalid TSX");
  assert.match(controlsReact, /controlValues/, "Interactive control state was not exported");
  assert.match(controlsReact, /onChange=\{\(event\)/, "Slider change behavior was not exported");
  assert.match(controlsReact, /onWheel=\{\(event\)/, "Dial wheel behavior was not exported");
  assert.match(controlsReact, /onPointerCancel=\{\(event\)/, "Pointer cancellation cleanup was not exported");

  const generatedTypes = `
declare namespace JSX { interface IntrinsicElements { [element: string]: unknown } }
declare module "react" {
  export type CSSProperties = Record<string, string | number | undefined>;
  type SetStateAction<State> = State | ((current: State) => State);
  type Dispatch<Action> = (action: Action) => void;
  export function useState<State>(initial: State): [State, Dispatch<SetStateAction<State>>];
  export function useEffect(effect: () => void | (() => void), dependencies: unknown[]): void;
  export function useRef<Value>(initial: Value): { current: Value };
}
declare module "react/jsx-runtime" { export const Fragment: unknown; export function jsx(...args: unknown[]): unknown; export function jsxs(...args: unknown[]): unknown; }
declare module "*.module.css" { const styles: Record<string, string>; export default styles; }
`;
  const declarationPath = join(output, "generated-types.d.ts");
  writeFileSync(declarationPath, generatedTypes);
  const generatedPaths = generatedSources.map(({ filename, source }) => {
    const path = join(output, filename);
    writeFileSync(path, source);
    return path;
  });
  execFileSync(join(root, "node_modules", ".bin", "tsc"), [
    "--noEmit",
    "--target", "es2022",
    "--module", "esnext",
    "--moduleResolution", "bundler",
    "--jsx", "react-jsx",
    "--lib", "es2022,dom",
    "--skipLibCheck",
    "--noUnusedLocals",
    "--esModuleInterop",
    declarationPath,
    ...generatedPaths,
  ], { cwd: root, stdio: "inherit" });

  process.stdout.write(`${JSON.stringify({ templates: templates.studioTemplates.length, nodeKinds: requiredKinds.length, paintTypes: requiredPaints.length, effectTypes: requiredEffects.length, totalNodes, totalTracks, midpoint: motion.valueAtTime(track, 1), variableMidpoint: variables[0].value, status: "ok" })}\n`);
} finally {
  rmSync(output, { recursive: true, force: true });
}
