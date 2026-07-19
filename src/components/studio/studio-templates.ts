import {
  applySurfaceRecipe,
  createEffect,
  createEmptyDocument,
  createGradientStop,
  createId,
  createNode,
  createPaint,
  type Paint,
  type StudioDocument,
  type StudioNode,
} from "./studio-model";
import { createKeyframe, createTrack } from "./studio-motion";

export type StudioTemplate = {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  family: "clay" | "glass" | "skeuo" | "adaptive" | "motion";
  document: StudioDocument;
};

function fixedId(node: StudioNode, id: string) {
  node.id = id;
  return node;
}

function setParent(parent: StudioNode, children: StudioNode[]) {
  parent.childIds = children.map((node) => node.id);
  children.forEach((node) => { node.parentId = parent.id; });
}

function solid(color: string, opacity = 100) {
  const paint = createPaint("solid", color);
  paint.opacity = opacity;
  return paint;
}

function gradient(type: Paint["type"], colors: [string, number][], angle = 145, opacity = 100) {
  const paint = createPaint(type, colors[0][0]);
  paint.stops = colors.map(([color, position]) => createGradientStop(color, position));
  paint.angle = angle;
  paint.opacity = opacity;
  return paint;
}

function textNode(id: string, text: string, x: number, y: number, width: number, size: number, color = "#232421", weight = 700) {
  const node = fixedId(createNode("text"), id);
  node.text = text;
  node.transform = { ...node.transform, x, y, width, height: Math.max(24, size * 1.45) };
  node.style.fills = [solid(color)];
  node.style.typography = { ...node.style.typography, size, weight, align: "left" };
  node.style.strokeWidth = 0;
  node.style.effects = [];
  node.geometry.cornerRadii = [0, 0, 0, 0];
  node.accessibility.decorative = false;
  return node;
}

function baseShowcase(name: string, family: StudioTemplate["family"]) {
  const document = createEmptyDocument(name);
  document.canvas = { ...document.canvas, width: 960, height: 620, color: "#efeee9", showGrid: false };
  const card = fixedId(createNode("frame"), `${family}-showcase`);
  card.name = `${family} showcase card`;
  card.transform = { ...card.transform, x: 170, y: 34, width: 620, height: 552 };
  card.geometry.cornerRadii = [32, 32, 32, 32];
  card.style.fills = [solid("#f8f7f2")];
  card.style.strokeColor = "#cbc9c2";
  card.style.strokeOpacity = 65;
  card.style.effects = [
    createEffect("innerShadow", { color: "#ffffff", opacity: 90, x: 0, y: 1, blur: 1 }),
    createEffect("dropShadow", { color: "#2c2b27", opacity: 8, x: 0, y: 16, blur: 34 }),
  ];
  card.geometry.clipChildren = true;
  document.nodes = [card];
  return { document, card };
}

function addMeta(document: StudioDocument, card: StudioNode, family: string, title: string) {
  const label = textNode(`${family}-label`, family.toUpperCase(), 30, 460, 180, 11, "#c95845", 900);
  label.style.typography.letterSpacing = 2;
  const heading = textNode(`${family}-heading`, title, 30, 493, 480, 25, "#20211f", 500);
  heading.style.typography.family = "display";
  const arrow = fixedId(createNode("icon"), `${family}-arrow`);
  arrow.icon = "arrow";
  arrow.transform = { ...arrow.transform, x: 548, y: 487, width: 34, height: 34 };
  arrow.style.fills = [solid("#20211f")];
  arrow.style.strokeWidth = 0;
  arrow.style.effects = [];
  setParent(card, [...card.childIds.map((id) => document.nodes.find((node) => node.id === id)).filter((node): node is StudioNode => Boolean(node)), label, heading, arrow]);
  document.nodes.push(label, heading, arrow);
}

function clayTemplate(): StudioDocument {
  const { document, card } = baseShowcase("Soft launch showcase", "clay");
  const stage = fixedId(createNode("frame"), "clay-stage");
  stage.name = "Peach presentation stage";
  stage.transform = { ...stage.transform, x: 18, y: 18, width: 584, height: 416 };
  stage.geometry.cornerRadii = [24, 24, 24, 24];
  stage.style.fills = [solid("#ffb3a1")];
  stage.style.strokeWidth = 0;
  stage.style.effects = [];
  const button = applySurfaceRecipe(fixedId(createNode("button"), "clay-launch-button"), "clay");
  button.name = "Launch button";
  button.text = "Launch it  ↗";
  button.transform = { ...button.transform, x: 190, y: 166, width: 205, height: 78 };
  button.geometry.cornerRadii = [22, 22, 22, 22];
  button.style.typography.size = 19;
  button.style.fills[0].type = "linear";
  button.style.fills[0].stops = [createGradientStop("#ff957f", 0), createGradientStop("#ff725e", 100)];
  button.style.fills[0].angle = 180;
  setParent(stage, [button]);
  setParent(card, [stage]);
  document.nodes.push(stage, button);
  addMeta(document, card, "clay", "Botón de lanzamiento suave");
  return document;
}

function glassTemplate(): StudioDocument {
  const { document, card } = baseShowcase("Prism account showcase", "glass");
  const stage = fixedId(createNode("frame"), "glass-stage");
  stage.transform = { ...stage.transform, x: 18, y: 18, width: 584, height: 416 };
  stage.geometry.cornerRadii = [24, 24, 24, 24];
  const yellow = gradient("radial", [["#f8fa83", 0], ["#f8fa8300", 100]], 0, 100);
  yellow.centerX = 16; yellow.centerY = 20; yellow.scaleX = 35; yellow.scaleY = 40;
  const violet = gradient("radial", [["#a67eff", 0], ["#a67eff00", 100]], 0, 100);
  violet.centerX = 84; violet.centerY = 76; violet.scaleX = 45; violet.scaleY = 48;
  stage.style.fills = [yellow, violet, solid("#65c9f7")];
  stage.style.strokeWidth = 0;
  stage.style.effects = [];

  const prism = applySurfaceRecipe(fixedId(createNode("frame"), "prism-card"), "glass");
  prism.name = "Prism account card";
  prism.transform = { ...prism.transform, x: 118, y: 94, width: 350, height: 230 };
  prism.geometry.cornerRadii = [28, 28, 28, 28];
  prism.style.fills = [gradient("linear", [["#ffffff", 0], ["#ffffff20", 100]], 135, 58)];
  prism.style.strokeWidth = 1.5;
  const code = textNode("prism-code", "MORPHIQ / 0428", 28, 28, 190, 11, "#4f5860", 800);
  code.style.typography.letterSpacing = 1.5;
  const dot = fixedId(createNode("ellipse"), "prism-status");
  dot.transform = { ...dot.transform, x: 306, y: 28, width: 13, height: 13 };
  dot.style.fills = [solid("#d8ff66")];
  dot.style.strokeWidth = 0;
  dot.style.effects = [createEffect("glow", { color: "#d8ff66", opacity: 38, blur: 12, spread: 3 })];
  const amount = textNode("prism-amount", "$24,880", 28, 78, 250, 36, "#111722", 800);
  amount.style.typography.family = "display";
  const available = textNode("prism-available", "Available balance", 28, 122, 200, 12, "#67717a", 500);
  const virtual = textNode("prism-virtual", "VIRTUAL", 28, 184, 120, 10, "#48525b", 900);
  virtual.style.typography.letterSpacing = 2;
  const digits = textNode("prism-digits", "•• 7812", 251, 184, 78, 10, "#48525b", 800);
  setParent(prism, [code, dot, amount, available, virtual, digits]);
  setParent(stage, [prism]);
  setParent(card, [stage]);
  document.nodes.push(stage, prism, code, dot, amount, available, virtual, digits);
  addMeta(document, card, "glass", "Tarjeta prisma de cuenta");
  return document;
}

function skeuoTemplate(): StudioDocument {
  const { document, card } = baseShowcase("Studio dial showcase", "skeuo");
  const stage = fixedId(createNode("frame"), "skeuo-stage");
  stage.transform = { ...stage.transform, x: 18, y: 18, width: 584, height: 416 };
  stage.geometry.cornerRadii = [24, 24, 24, 24];
  stage.style.fills = [solid("#c9c6bd")];
  stage.style.strokeWidth = 0;
  stage.style.effects = [];
  const panel = applySurfaceRecipe(fixedId(createNode("frame"), "skeuo-control-panel"), "skeuo");
  panel.transform = { ...panel.transform, x: 123, y: 129, width: 338, height: 150 };
  panel.geometry.cornerRadii = [26, 26, 26, 26];
  panel.style.fills = [gradient("linear", [["#eeece7", 0], ["#aaa8a1", 100]], 145)];
  const dial = applySurfaceRecipe(fixedId(createNode("ellipse"), "skeuo-dial"), "skeuo");
  dial.transform = { ...dial.transform, x: 27, y: 23, width: 106, height: 106 };
  dial.geometry.cornerRadii = [999, 999, 999, 999];
  dial.style.fills = [gradient("radial", [["#ffffff", 0], ["#b9b7b0", 70], ["#aaa8a2", 100]], 0)];
  dial.style.effects = [
    createEffect("innerShadow", { color: "#ffffff", opacity: 55, x: -2, y: -2, blur: 10 }),
    createEffect("dropShadow", { color: "#000000", opacity: 28, x: 0, y: 5, blur: 6 }),
  ];
  const needle = fixedId(createNode("rectangle"), "skeuo-needle");
  needle.transform = { ...needle.transform, x: 78, y: 32, width: 5, height: 33 };
  needle.geometry.cornerRadii = [99, 99, 99, 99];
  needle.style.fills = [solid("#ff8068")];
  needle.style.strokeWidth = 0;
  needle.style.effects = [];
  const amount = textNode("skeuo-value", "62%", 177, 52, 120, 31, "#181916", 850);
  amount.style.typography.family = "display";
  const label = textNode("skeuo-intensity", "INTENSITY", 179, 91, 120, 11, "#65635e", 800);
  label.style.typography.letterSpacing = 1.5;
  setParent(dial, [needle]);
  setParent(panel, [dial, amount, label]);
  setParent(stage, [panel]);
  setParent(card, [stage]);
  document.nodes.push(stage, panel, dial, needle, amount, label);
  addMeta(document, card, "skeuo", "Dial de control de estudio");
  return document;
}

function adaptiveTemplate(): StudioDocument {
  const { document, card } = baseShowcase("Adaptive surface showcase", "adaptive");
  const stage = fixedId(createNode("frame"), "adaptive-stage");
  stage.transform = { ...stage.transform, x: 18, y: 18, width: 584, height: 416 };
  stage.geometry.cornerRadii = [24, 24, 24, 24];
  stage.style.fills = [solid("#d8ff66")];
  stage.style.strokeWidth = 0;
  stage.style.effects = [];
  const component = applySurfaceRecipe(fixedId(createNode("frame"), "adaptive-component"), "adaptive");
  component.transform = { ...component.transform, x: 142, y: 116, width: 300, height: 184 };
  component.geometry.cornerRadii = [28, 28, 72, 28];
  component.layout.mode = "free";
  component.responsive.mobile = { transform: { width: 230, height: 220 }, layout: { direction: "column" } };
  const icon = fixedId(createNode("rectangle"), "adaptive-acid-icon");
  icon.transform = { ...icon.transform, x: 28, y: 33, width: 48, height: 48 };
  icon.geometry.cornerRadii = [15, 15, 15, 15];
  icon.style.fills = [gradient("linear", [["#efffb8", 0], ["#d8ff66", 100]], 145)];
  icon.style.strokeWidth = 0;
  icon.style.effects = [createEffect("innerShadow", { color: "#ffffff", opacity: 65, x: 0, y: 3, blur: 3 })];
  const title = textNode("adaptive-title", "Fluid", 94, 34, 150, 26, "#ffffff", 700);
  title.style.typography.family = "display";
  const copy = textNode("adaptive-copy", "WIDE → COMPACT", 28, 126, 200, 11, "#a7aaa3", 800);
  copy.style.typography.letterSpacing = 1.5;
  const toggle = fixedId(createNode("toggle"), "adaptive-toggle");
  toggle.text = "";
  toggle.transform = { ...toggle.transform, x: 222, y: 32, width: 52, height: 30 };
  toggle.geometry.cornerRadii = [99, 99, 99, 99];
  toggle.style.fills = [solid("#d8ff66")];
  toggle.style.strokeWidth = 0;
  toggle.style.effects = [];
  setParent(component, [icon, title, copy, toggle]);
  setParent(stage, [component]);
  setParent(card, [stage]);
  document.nodes.push(stage, component, icon, title, copy, toggle);
  addMeta(document, card, "adaptive", "Superficie fluida adaptable");
  return document;
}

function doorTemplate(): StudioDocument {
  const document = createEmptyDocument("Double door motion study");
  document.canvas = { ...document.canvas, color: "#ddd9d0", showGrid: true, width: 960, height: 620 };
  document.timeline = { ...document.timeline, duration: 2.4, workArea: [0, 2.4], loop: true };
  const scene = fixedId(createNode("frame"), "door-scene");
  scene.name = "Door scene";
  scene.transform = { ...scene.transform, x: 210, y: 65, width: 540, height: 500, perspective: 1100 };
  scene.geometry.cornerRadii = [28, 28, 28, 28];
  scene.style.fills = [gradient("radial", [["#fff8e8", 0], ["#bdb7aa", 100]], 0)];
  scene.style.effects = [createEffect("innerShadow", { color: "#ffffff", opacity: 65, x: 0, y: 2, blur: 2 }), createEffect("dropShadow", { color: "#302a23", opacity: 18, x: 0, y: 20, blur: 38 })];
  const frame = fixedId(createNode("frame"), "door-frame");
  frame.name = "Door frame";
  frame.transform = { ...frame.transform, x: 85, y: 55, width: 370, height: 390, perspective: 1000 };
  frame.geometry.cornerRadii = [14, 14, 5, 5];
  frame.style.fills = [gradient("linear", [["#67442e", 0], ["#2f2018", 100]], 145)];
  frame.style.effects = [createEffect("innerShadow", { color: "#ffffff", opacity: 18, x: 0, y: 2, blur: 2 }), createEffect("dropShadow", { color: "#20150f", opacity: 32, x: 0, y: 14, blur: 22 })];
  const left = fixedId(createNode("frame"), "door-left");
  left.name = "Left door";
  left.transform = { ...left.transform, x: 16, y: 16, width: 168, height: 358, pivotX: 0, pivotY: 50, perspective: 1000 };
  left.geometry.cornerRadii = [8, 2, 2, 8];
  left.style.fills = [gradient("linear", [["#b8784e", 0], ["#75452d", 54], ["#4f2f21", 100]], 90)];
  left.style.effects = [createEffect("innerShadow", { color: "#f3bd8c", opacity: 25, x: 4, y: 0, blur: 9 }), createEffect("dropShadow", { color: "#1d120d", opacity: 35, x: 8, y: 10, blur: 18 })];
  const right = fixedId(createNode("frame"), "door-right");
  right.name = "Right door";
  right.transform = { ...right.transform, x: 185, y: 16, width: 168, height: 358, pivotX: 100, pivotY: 50, perspective: 1000 };
  right.geometry.cornerRadii = [2, 8, 8, 2];
  right.style = structuredClone(left.style);
  const leftPanel = fixedId(createNode("rectangle"), "left-panel-detail");
  leftPanel.transform = { ...leftPanel.transform, x: 22, y: 28, width: 124, height: 265 };
  leftPanel.style.fills = [gradient("linear", [["#8d5637", 0], ["#5e3927", 100]], 145)];
  leftPanel.style.effects = [createEffect("innerShadow", { color: "#2b190f", opacity: 42, x: 0, y: 4, blur: 10 }), createEffect("innerShadow", { color: "#f5c79d", opacity: 20, x: 0, y: -2, blur: 3 })];
  leftPanel.geometry.cornerRadii = [7, 7, 7, 7];
  const rightPanel = structuredClone(leftPanel);
  rightPanel.id = "right-panel-detail";
  const leftHandle = fixedId(createNode("ellipse"), "left-handle");
  leftHandle.transform = { ...leftHandle.transform, x: 134, y: 178, width: 18, height: 18, z: 12 };
  leftHandle.style.fills = [gradient("radial", [["#fff4b0", 0], ["#aa7c24", 70], ["#59400f", 100]], 0)];
  leftHandle.style.effects = [createEffect("dropShadow", { color: "#1b110a", opacity: 45, x: 2, y: 3, blur: 4 })];
  const rightHandle = structuredClone(leftHandle);
  rightHandle.id = "right-handle";
  rightHandle.transform.x = 16;
  setParent(left, [leftPanel, leftHandle]);
  setParent(right, [rightPanel, rightHandle]);
  setParent(frame, [left, right]);
  setParent(scene, [frame]);
  document.nodes = [scene, frame, left, leftPanel, leftHandle, right, rightPanel, rightHandle];
  document.variants = [
    { id: "door-open", name: "Open", description: "Both leaves open around their hinges", overrides: { "door-left": { transform: { rotationY: -105 } }, "door-right": { transform: { rotationY: 105 } } } },
    { id: "door-ajar", name: "Ajar", description: "Partially open state", overrides: { "door-left": { transform: { rotationY: -38 } }, "door-right": { transform: { rotationY: 38 } } } },
  ];
  document.interactions = [
    { id: createId("interaction"), sourceNodeId: frame.id, sourceVariantId: "base", trigger: "click", action: "changeVariant", targetVariantId: "door-open", delay: 0, key: "", transition: "smart", duration: 0.9, easing: "easeInOut" },
    { id: createId("interaction"), sourceNodeId: frame.id, sourceVariantId: "door-open", trigger: "click", action: "changeVariant", targetVariantId: "base", delay: 0, key: "", transition: "smart", duration: 0.9, easing: "easeInOut" },
  ];
  const leftTrack = createTrack(left, "transform.rotationY", 2.4);
  leftTrack.keyframes = [createKeyframe(0, 0), createKeyframe(0.95, -105), createKeyframe(1.45, -105), createKeyframe(2.4, 0)];
  leftTrack.keyframes[0].easing = "spring";
  leftTrack.keyframes[2].easing = "easeInOut";
  const rightTrack = createTrack(right, "transform.rotationY", 2.4);
  rightTrack.keyframes = [createKeyframe(0, 0), createKeyframe(0.95, 105), createKeyframe(1.45, 105), createKeyframe(2.4, 0)];
  rightTrack.keyframes[0].easing = "spring";
  rightTrack.keyframes[2].easing = "easeInOut";
  const shadowTrack = createTrack(frame, "style.effects.0.opacity", 2.4);
  shadowTrack.keyframes = [createKeyframe(0, 32), createKeyframe(1, 48), createKeyframe(2.4, 32)];
  document.timeline.tracks = [leftTrack, rightTrack, shadowTrack];
  document.timeline.markers = [
    { id: createId("marker"), time: 0, label: "Closed", color: "#ff8068" },
    { id: createId("marker"), time: 0.95, label: "Open", color: "#d8ff66" },
    { id: createId("marker"), time: 2.4, label: "Closed", color: "#9c89ff" },
  ];
  return document;
}

const documents = {
  clay: clayTemplate(),
  glass: glassTemplate(),
  skeuo: skeuoTemplate(),
  adaptive: adaptiveTemplate(),
  door: doorTemplate(),
};

export const studioTemplates: StudioTemplate[] = [
  { id: "clay-showcase", name: "Soft launch card", nameEs: "Card de lanzamiento clay", description: "Complete clay showcase card from the homepage.", descriptionEs: "Card clay completa de la portada.", family: "clay", document: documents.clay },
  { id: "glass-showcase", name: "Prism account card", nameEs: "Card prisma de cuenta", description: "Layered glass card with ambient gradients.", descriptionEs: "Card de vidrio por capas con degradados ambientales.", family: "glass", document: documents.glass },
  { id: "skeuo-showcase", name: "Studio control dial", nameEs: "Dial de control de estudio", description: "Skeuomorphic panel, dial, needle and readout.", descriptionEs: "Panel skeuomórfico con dial, aguja y lectura.", family: "skeuo", document: documents.skeuo },
  { id: "adaptive-showcase", name: "Adaptive surface", nameEs: "Superficie adaptable", description: "Responsive polymorphic component with an asymmetric body.", descriptionEs: "Componente polimórfico responsivo con cuerpo asimétrico.", family: "adaptive", document: documents.adaptive },
  { id: "double-door", name: "Double door motion", nameEs: "Animación de puerta doble", description: "A complete 3D hinge, variant and timeline example.", descriptionEs: "Ejemplo completo de bisagras 3D, variantes y timeline.", family: "motion", document: documents.door },
];

export function instantiateTemplate(id: string) {
  const template = studioTemplates.find((item) => item.id === id) ?? studioTemplates[0];
  const document = structuredClone(template.document);
  const now = new Date().toISOString();
  document.id = createId("document");
  document.createdAt = now;
  document.updatedAt = now;
  return document;
}
