import {
  clipPathCss,
  cornerRadiusCss,
  effectShadowCss,
  getNodeChildren,
  getRootNodes,
  isSafePropertyPath,
  mergeNodeOverride,
  nodeBackdropFilter,
  nodeBackground,
  nodeBoxShadow,
  nodeFilter,
  resolveResponsiveNode,
  setPathValue,
  type AnimatableProperty,
  type Device,
  type StudioDocument,
  type StudioInteraction,
  type StudioNode,
} from "./studio-model";
import { easingCss, valueAtTime } from "./studio-motion";

const cssName = (value: string) => value.replace(/[^a-z0-9_-]/gi, "-").replace(/^-+/, "").toLowerCase() || "layer";
const componentName = (document: StudioDocument) => `Morphiq${document.name.replace(/[^a-z0-9]+/gi, " ").trim().split(/\s+/).map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join("") || "Component"}`;
const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function setAnyPath(node: StudioNode, path: string, value: string | number | boolean) {
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

function materializeComponentInstances(document: StudioDocument): StudioDocument {
  let nodes = document.nodes.map((source) => {
    if (!source.instanceSourceId) return source;
    const blueprint = document.nodes.find((candidate) => candidate.id === source.instanceSourceId);
    if (!blueprint) return source;
    return {
      ...structuredClone(blueprint),
      id: source.id,
      parentId: source.parentId,
      childIds: source.childIds,
      name: source.name,
      componentId: source.componentId,
      instanceSourceId: source.instanceSourceId,
      instanceOverrides: source.instanceOverrides,
      transform: source.componentId ? source.transform : blueprint.transform,
      responsive: source.componentId ? source.responsive : blueprint.responsive,
    };
  });
  nodes = nodes.map((node) => {
    if (!node.instanceSourceId) return node;
    let source = document.nodes.find((candidate) => candidate.id === node.id);
    let root: StudioNode | undefined;
    while (source) {
      if (source.componentId && source.instanceSourceId) { root = source; break; }
      const parentId = source.parentId;
      source = parentId ? document.nodes.find((candidate) => candidate.id === parentId) : undefined;
    }
    if (!root?.componentId) return node;
    const definition = document.components.find((component) => component.id === root.componentId);
    if (!definition) return node;
    return definition.properties.filter((property) => property.targetNodeId === node.instanceSourceId && Object.hasOwn(root.instanceOverrides, property.id)).reduce((current, property) => setAnyPath(current, property.targetPath, root.instanceOverrides[property.id]), node);
  });
  return { ...document, nodes };
}

function nodeClass(node: StudioNode) {
  return `morphiq-${cssName(node.name)}-${cssName(node.id)}`;
}

function effectClass(node: StudioNode, index: number) {
  return `${nodeClass(node)}-effect-${index}`;
}

function renderEffectLayers(node: StudioNode) {
  return node.style.effects
    .map((effect, index) => ({ effect, index }))
    .filter(({ effect }) => effect.visible && (
      (effect.blendMode !== "normal" && ["dropShadow", "innerShadow", "glow", "innerGlow"].includes(effect.type))
      || effect.type === "noise"
      || effect.type === "texture"
    ))
    .map(({ index }) => `<i aria-hidden="true" className={styles[${JSON.stringify(effectClass(node, index))}]}></i>`)
    .join("");
}

function shapePoints(node: StudioNode) {
  const sides = Math.max(3, node.geometry.polygonSides);
  const count = node.kind === "star" ? sides * 2 : sides;
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
    const radius = node.kind === "star" && index % 2 ? node.geometry.starRatio / 2 : 48;
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
    const a = previous.handleOut;
    const b = current.handleIn;
    path += a || b ? ` C ${a?.x ?? previous.x} ${a?.y ?? previous.y}, ${b?.x ?? current.x} ${b?.y ?? current.y}, ${current.x} ${current.y}` : ` L ${current.x} ${current.y}`;
  }
  return `${path}${node.geometry.closed ? " Z" : ""}`;
}

function operandPath(operand: StudioNode, owner: StudioNode) {
  const x = operand.transform.x / Math.max(1, owner.transform.width) * 100;
  const y = operand.transform.y / Math.max(1, owner.transform.height) * 100;
  const width = operand.transform.width / Math.max(1, owner.transform.width) * 100;
  const height = operand.transform.height / Math.max(1, owner.transform.height) * 100;
  if (operand.kind === "ellipse" || operand.kind === "dial") return `M ${x} ${y + height / 2} A ${width / 2} ${height / 2} 0 1 0 ${x + width} ${y + height / 2} A ${width / 2} ${height / 2} 0 1 0 ${x} ${y + height / 2} Z`;
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
    return shapePoints(operand).split(" ").map((pair, index) => {
      const [pointX, pointY] = pair.split(",").map(Number);
      return `${index ? "L" : "M"} ${x + pointX / 100 * width} ${y + pointY / 100 * height}`;
    }).join(" ") + " Z";
  }
  return `M ${x} ${y} H ${x + width} V ${y + height} H ${x} Z`;
}

function renderSvgPrimitive(document: StudioDocument, node: StudioNode, includeMotion = false) {
  const fill = node.style.fills[0]?.color ?? "transparent";
  const stroke = node.style.strokeColor;
  if (node.kind === "line" || node.kind === "arrow") return `<svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="arrow-${esc(node.id)}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="var(--morphiq-stroke, ${esc(stroke)})" /></marker></defs><line x1="2" y1="50" x2="94" y2="50" stroke="var(--morphiq-stroke, ${esc(stroke)})" strokeWidth="var(--morphiq-stroke-width, ${node.style.strokeWidth})" ${node.kind === "arrow" ? `markerEnd="url(#arrow-${esc(node.id)})"` : ""} /></svg>`;
  if (node.kind === "polygon" || node.kind === "star") return `<svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${shapePoints(node)}" fill="var(--morphiq-fill, ${esc(fill)})" stroke="var(--morphiq-stroke, ${esc(stroke)})" strokeWidth="var(--morphiq-stroke-width, ${node.style.strokeWidth})" /></svg>`;
  if (node.kind === "vector") {
    const animatedPath = includeMotion && node.geometry.vectorPoints.some((_, index) => hasNodeMotionTrack(document, node, `geometry.vectorPoints.${index}.x`) || hasNodeMotionTrack(document, node, `geometry.vectorPoints.${index}.y`));
    const path = animatedPath ? `d={${vectorPathExpression(document, node)}}` : `d="${esc(vectorPath(node))}"`;
    return `<svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><path ${path} fill="${node.geometry.closed ? `var(--morphiq-fill, ${esc(fill)})` : "none"}" stroke="var(--morphiq-stroke, ${esc(stroke)})" strokeWidth="var(--morphiq-stroke-width, ${node.style.strokeWidth})" strokeLinecap="round" strokeLinejoin="round" /></svg>`;
  }
  if (node.kind === "boolean") {
    const paths = getNodeChildren(document.nodes, node.id).map((operand) => operandPath(operand, node)).join(" ");
    const operands = getNodeChildren(document.nodes, node.id).map((operand) => operandPath(operand, node));
    const safeId = cssName(node.id);
    if (node.geometry.booleanOperation === "intersect" && operands.length > 1) {
      const definitions = operands.slice(1).map((path, index) => `<clipPath id="boolean-clip-${safeId}-${index}"><path d="${esc(path)}" /></clipPath>`).join("");
      let content = `<path d="${esc(operands[0])}" fill="var(--morphiq-fill, ${esc(fill)})" stroke="var(--morphiq-stroke, ${esc(stroke)})" strokeWidth="var(--morphiq-stroke-width, ${node.style.strokeWidth})" />`;
      operands.slice(1).forEach((_, index) => { content = `<g clipPath="url(#boolean-clip-${safeId}-${index})">${content}</g>`; });
      return `<svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><defs>${definitions}</defs>${content}</svg>`;
    }
    return `<svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${esc(paths)}" fill="var(--morphiq-fill, ${esc(fill)})" fillRule="${node.geometry.booleanOperation === "exclude" || node.geometry.booleanOperation === "subtract" ? "evenodd" : "nonzero"}" stroke="var(--morphiq-stroke, ${esc(stroke)})" strokeWidth="var(--morphiq-stroke-width, ${node.style.strokeWidth})" /></svg>`;
  }
  return "";
}

function nodeMotionKey(node: StudioNode, path: string) {
  return `${node.id}:${path}`;
}

function tracksForNode(document: StudioDocument, node: StudioNode) {
  const tracks = new Map<string, StudioDocument["timeline"]["tracks"][number]>();
  if (node.instanceSourceId) {
    document.timeline.tracks.filter((track) => track.nodeId === node.instanceSourceId).forEach((track) => tracks.set(track.property, track));
  }
  document.timeline.tracks.filter((track) => track.nodeId === node.id).forEach((track) => tracks.set(track.property, track));
  return [...tracks.values()];
}

function hasNodeMotionTrack(document: StudioDocument, node: StudioNode, path: string) {
  return tracksForNode(document, node).some((track) => track.enabled && track.property === path);
}

function motionNumberExpression(document: StudioDocument, node: StudioNode, path: AnimatableProperty, fallback: number) {
  return hasNodeMotionTrack(document, node, path) ? `Number(nodeMotionValues[${JSON.stringify(nodeMotionKey(node, path))}] ?? ${fallback})` : String(fallback);
}

function vectorPathExpression(document: StudioDocument, node: StudioNode) {
  const points = node.geometry.vectorPoints;
  if (!points.length) return '""';
  const coordinate = (index: number, axis: "x" | "y") => motionNumberExpression(document, node, `geometry.vectorPoints.${index}.${axis}`, points[index][axis]);
  let expression = `\`M \${${coordinate(0, "x")}} \${${coordinate(0, "y")}}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (previous.handleOut || current.handleIn) expression += ` C ${previous.handleOut?.x ?? previous.x} ${previous.handleOut?.y ?? previous.y}, ${current.handleIn?.x ?? current.x} ${current.handleIn?.y ?? current.y}, \${${coordinate(index, "x")}} \${${coordinate(index, "y")}}`;
    else expression += ` L \${${coordinate(index, "x")}} \${${coordinate(index, "y")}}`;
  }
  return `${expression}${node.geometry.closed ? " Z" : ""}\``;
}

function boundText(document: StudioDocument, node: StudioNode, path: string, fallback: string | number, enabled: boolean) {
  const variableId = node.bindings[path];
  if (enabled && hasNodeMotionTrack(document, node, path)) {
    const fallbackExpression = variableId ? `variables[${JSON.stringify(variableId)}] ?? ${JSON.stringify(fallback)}` : JSON.stringify(fallback);
    return `{String(nodeMotionValues[${JSON.stringify(nodeMotionKey(node, path))}] ?? (${fallbackExpression}))}`;
  }
  return enabled && variableId ? `{String(variables[${JSON.stringify(variableId)}] ?? ${JSON.stringify(fallback)})}` : esc(String(fallback));
}

function boundNumberExpression(document: StudioDocument, node: StudioNode, path: string, fallback: number, enabled: boolean) {
  const variableId = node.bindings[path];
  if (enabled && hasNodeMotionTrack(document, node, path)) {
    const fallbackExpression = variableId ? `variables[${JSON.stringify(variableId)}] ?? ${fallback}` : fallback;
    return `Number(nodeMotionValues[${JSON.stringify(nodeMotionKey(node, path))}] ?? (${fallbackExpression}))`;
  }
  if (enabled && variableId) return `Number(variables[${JSON.stringify(variableId)}] ?? ${fallback})`;
  if (enabled && path === "value" && (node.kind === "slider" || node.kind === "dial")) return `Number(controlValues[${JSON.stringify(node.id)}] ?? ${fallback})`;
  return String(fallback);
}

function boundBooleanExpression(node: StudioNode, path: string, fallback: boolean, enabled: boolean) {
  const variableId = node.bindings[path];
  if (enabled && variableId) return `Boolean(variables[${JSON.stringify(variableId)}] ?? ${fallback})`;
  if (enabled && path === "checked" && node.kind === "toggle") return `Boolean(controlValues[${JSON.stringify(node.id)}] ?? ${fallback})`;
  return String(fallback);
}

function controlSetter(node: StudioNode, path: "value" | "checked", value: string) {
  const variableId = node.bindings[path];
  return variableId
    ? `setVariables((current) => ({ ...current, ${JSON.stringify(variableId)}: ${value} }))`
    : `setControlValues((current) => ({ ...current, ${JSON.stringify(node.id)}: ${value} }))`;
}

function boundNodeStyle(node: StudioNode, enabled: boolean) {
  if (!enabled) return "";
  const declarations: string[] = [];
  const variable = (path: string) => node.bindings[path] ? `variables[${JSON.stringify(node.bindings[path])}]` : "";
  if (variable("visible")) declarations.push(`opacity: ${variable("visible")} ? ${node.style.opacity / 100} : 0`);
  if (variable("transform.width")) declarations.push(`width: Number(${variable("transform.width")} ?? ${node.transform.width})`);
  if (variable("transform.height")) declarations.push(`height: Number(${variable("transform.height")} ?? ${node.transform.height})`);
  if (variable("style.fills.0.color")) declarations.push(`background: String(${variable("style.fills.0.color")} ?? ${JSON.stringify(node.style.fills[0]?.color ?? "transparent")})`);
  if (variable("style.fills.0.imageUrl")) declarations.push(`backgroundImage: "url(" + String(${variable("style.fills.0.imageUrl")} ?? "") + ")"`);
  if (variable("style.typography.color")) declarations.push(`color: String(${variable("style.typography.color")} ?? ${JSON.stringify(node.style.typography.color)})`);
  return declarations.length ? `style={{ ${declarations.join(", ")} }}` : "";
}

function renderContent(document: StudioDocument, node: StudioNode, includeBindings = true) {
  if (["line", "arrow", "polygon", "star", "vector", "boolean"].includes(node.kind)) return renderSvgPrimitive(document, node, includeBindings);
  if (!includeBindings) {
    if (node.kind === "input") return `<span>${esc(node.text)}</span><input aria-label="${esc(node.accessibility.ariaLabel || node.text)}" placeholder="${esc(node.secondaryText)}" />`;
    if (node.kind === "toggle") return `<span>${esc(node.text)}</span><i aria-hidden="true"></i>`;
    if (node.kind === "slider") return `<span><b>${esc(node.text)}</b><small>${node.value}%</small></span><input aria-label="${esc(node.accessibility.ariaLabel || node.text)}" min="0" max="100" value="${node.value}" type="range" />`;
    if (node.kind === "progress") return `<span><b>${esc(node.text)}</b><small>${node.value}%</small></span><i><em style="width:${node.value}%"></em></i>`;
    if (node.kind === "dial") return `<i style="transform:rotate(${node.value * 2.7 - 135}deg)"></i><b>${node.value}%</b><small>${esc(node.secondaryText || "INTENSITY")}</small>`;
  }
  const text = boundText(document, node, "text", node.text, includeBindings);
  const secondary = boundText(document, node, "secondaryText", node.secondaryText, includeBindings);
  const value = boundNumberExpression(document, node, "value", node.value, includeBindings);
  if (node.kind === "input") return `<span>${text}</span><input aria-label="${esc(node.accessibility.ariaLabel || node.text)}" placeholder={String(${node.bindings.secondaryText && includeBindings ? `variables[${JSON.stringify(node.bindings.secondaryText)}] ?? ${JSON.stringify(node.secondaryText)}` : JSON.stringify(node.secondaryText)})} />`;
  if (node.kind === "toggle") return `<span>${text}</span><i aria-hidden="true"></i>`;
  if (node.kind === "slider") return `<span><b>${text}</b><small>{${value}}%</small></span><input aria-label="${esc(node.accessibility.ariaLabel || node.text)}" min="0" max="100" value={${value}} type="range" onChange={(event) => { const value = Number(event.target.value); ${controlSetter(node, "value", "value")}; }} />`;
  if (node.kind === "progress") return `<span><b>${text}</b><small>{${value}}%</small></span><i><em style={{ width: String(${value}) + "%" }} /></i>`;
  if (node.kind === "dial") return `<i style={{ transform: "rotate(" + (${value} * 2.7 - 135) + "deg)" }} /><b>{${value}}%</b><small>${secondary || "INTENSITY"}</small>`;
  if (node.kind === "icon") return node.svgPath ? `<svg aria-hidden="true" viewBox="${esc(node.svgViewBox || "0 0 24 24")}"><path d="${esc(node.svgPath)}" fill="currentColor" /></svg>` : `<span aria-hidden="true">↗</span>`;
  if (node.kind === "text" || node.kind === "button") return text;
  return "";
}

function interactionCommand(interaction: StudioInteraction, includeDelay = true) {
  let command = "";
  const transition = `setTransition({ type: ${JSON.stringify(interaction.transition)}, duration: ${interaction.transition === "instant" ? 0 : interaction.duration}, easing: ${JSON.stringify(easingCss(interaction.easing))} })`;
  if (interaction.action === "changeVariant") command = `${transition}; setMotion("paused"); setVariant(${JSON.stringify(interaction.targetVariantId ?? "base")})`;
  if (interaction.action === "toggleVariant") command = `${transition}; setMotion("paused"); setVariant((current) => current === ${JSON.stringify(interaction.targetVariantId ?? "base")} ? "base" : ${JSON.stringify(interaction.targetVariantId ?? "base")})`;
  if (interaction.action === "playTimeline") command = `setVariant("base"); setMotion("running")`;
  if (interaction.action === "pauseTimeline") command = `setMotion("paused")`;
  if (interaction.action === "reverseTimeline") command = `setVariant("base"); setReverse((current) => !current); setMotion("running")`;
  if (interaction.action === "setVariable" && interaction.variableId) command = `${interaction.trigger === "variable" ? "suppressVariableReaction.current = true; " : ""}setVariables((current) => ({ ...current, ${JSON.stringify(interaction.variableId)}: resolveMorphiqValue(${JSON.stringify(interaction.value)}, current[${JSON.stringify(interaction.variableId)}]) }))`;
  if (interaction.action === "openUrl") command = `openMorphiqUrl(${JSON.stringify(interaction.url ?? "#")})`;
  if (!command) return "";
  if (includeDelay && interaction.delay > 0) command = `window.setTimeout(() => ${command}, ${Math.round(interaction.delay * 1000)})`;
  if (interaction.condition) {
    const condition = interaction.condition;
    const left = `variables[${JSON.stringify(condition.variableId)}]`;
    const operator = condition.operator === "equals" ? "===" : condition.operator === "notEquals" ? "!==" : condition.operator === "greater" ? ">" : "<";
    command = `if (${left} ${operator} ${JSON.stringify(condition.value)}) { ${command}; }`;
  }
  if (interaction.trigger === "key") command = `if (event.key === ${JSON.stringify(interaction.key)}) { ${command}; }`;
  return command;
}

function eventAttributes(document: StudioDocument, node: StudioNode) {
  const interactions = document.interactions.filter((interaction) => interaction.sourceNodeId === node.id || interaction.sourceNodeId === node.instanceSourceId);
  const eventMap: Partial<Record<(typeof interactions)[number]["trigger"], string>> = { click: "onClick", doubleClick: "onDoubleClick", mouseDown: "onMouseDown", mouseUp: "onMouseUp", hover: "onMouseEnter", hoverEnd: "onMouseLeave", focus: "onFocus", blur: "onBlur", scroll: "onScroll", drag: "onDragEnd", swipe: "onPointerUp" };
  const commands = new Map<string, string[]>();
  interactions.forEach((interaction) => {
    const event = eventMap[interaction.trigger];
    if (!event) return;
    const actions = commands.get(event) ?? [];
    const command = interactionCommand(interaction);
    if (!command) return;
    const guarded = `if (variant === ${JSON.stringify(interaction.sourceVariantId)}) { ${command}; }`;
    actions.push(interaction.trigger === "swipe"
      ? `{ const origin = pointerOrigins.current[${JSON.stringify(node.id)}]; if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 24) { ${guarded} } }`
      : guarded);
    commands.set(event, actions);
  });
  if (node.kind === "toggle") {
    const current = boundBooleanExpression(node, "checked", node.checked, true);
    commands.set("onClick", [`${controlSetter(node, "checked", `!(${current})`)}`, ...(commands.get("onClick") ?? [])]);
  }
  if (node.kind === "dial") {
    const current = boundNumberExpression(document, node, "value", node.value, true);
    const keyValue = `event.key === "Home" ? 0 : event.key === "End" ? 100 : Math.max(0, Math.min(100, ${current} + ((event.key === "ArrowLeft" || event.key === "ArrowDown") ? -1 : 1) * (event.shiftKey ? 10 : 1)))`;
    commands.set("onKeyDown", [`if (["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"].includes(event.key)) { event.preventDefault(); ${controlSetter(node, "value", keyValue)}; }`, ...(commands.get("onKeyDown") ?? [])]);
    commands.set("onWheel", [`event.preventDefault(); ${controlSetter(node, "value", `Math.max(0, Math.min(100, ${current} + (event.deltaY < 0 ? 1 : -1) * (event.shiftKey ? 10 : 1)))`)}`, ...(commands.get("onWheel") ?? [])]);
    const dragValue = `Math.max(0, Math.min(100, ${current} + (event.clientX - origin.x - (event.clientY - origin.y)) / 2))`;
    commands.set("onPointerUp", [`{ const origin = pointerOrigins.current[${JSON.stringify(node.id)}]; if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 4) { ${controlSetter(node, "value", dragValue)}; } }`, ...(commands.get("onPointerUp") ?? [])]);
  }
  const tracksPointer = node.kind === "dial" || interactions.some((interaction) => interaction.trigger === "swipe");
  if (tracksPointer) {
    commands.set("onPointerUp", [...(commands.get("onPointerUp") ?? []), `delete pointerOrigins.current[${JSON.stringify(node.id)}]`]);
    commands.set("onPointerCancel", [`delete pointerOrigins.current[${JSON.stringify(node.id)}]`]);
  }
  const attributes = [...commands.entries()].map(([event, actions]) => `${event}={(event) => { void event; ${actions.join("; ")}; }}`);
  if (tracksPointer) attributes.push(`onPointerDown={(event) => { pointerOrigins.current[${JSON.stringify(node.id)}] = { x: event.clientX, y: event.clientY }; }}`);
  return attributes.join(" ");
}

function renderNode(document: StudioDocument, node: StudioNode, depth = 0, includeInteractions = true): string {
  const children = node.kind === "boolean" ? [] : getNodeChildren(document.nodes, node.id);
  const tag = node.accessibility.semanticTag === "input" ? "div" : node.accessibility.semanticTag;
  const numericValue = boundNumberExpression(document, node, "value", node.value, includeInteractions);
  const attributes = [
    `className={styles[${JSON.stringify(nodeClass(node))}]}`,
    `data-node-id=${JSON.stringify(node.id)}`,
    tag === "button" ? `type="button"` : "",
    node.accessibility.decorative ? `aria-hidden="true"` : node.accessibility.ariaLabel ? `aria-label=${JSON.stringify(node.accessibility.ariaLabel)}` : "",
    node.accessibility.role && node.kind !== "slider" ? `role=${JSON.stringify(node.accessibility.role)}` : "",
    node.accessibility.tabIndex >= 0 && node.kind !== "slider" && node.kind !== "input" ? `tabIndex={${node.accessibility.tabIndex}}` : "",
    node.kind === "dial" || node.kind === "progress" ? `aria-valuemin="0" aria-valuemax="100" ${includeInteractions ? `aria-valuenow={${numericValue}}` : `aria-valuenow=${JSON.stringify(numericValue)}`}` : "",
    node.kind === "toggle" ? includeInteractions ? `aria-pressed={${boundBooleanExpression(node, "checked", node.checked, true)}}` : `aria-pressed=${JSON.stringify(String(node.checked))}` : "",
    node.kind === "toggle" ? includeInteractions ? `data-checked={${boundBooleanExpression(node, "checked", node.checked, true)}}` : `data-checked=${JSON.stringify(String(node.checked))}` : "",
    includeInteractions && document.interactions.some((interaction) => (interaction.sourceNodeId === node.id || interaction.sourceNodeId === node.instanceSourceId) && interaction.trigger === "drag") ? `draggable={true}` : "",
    includeInteractions ? eventAttributes(document, node) : "",
    boundNodeStyle(node, includeInteractions),
  ].filter(Boolean).join(" ");
  const indent = "  ".repeat(depth);
  const inner = `${renderEffectLayers(node)}${renderContent(document, node, includeInteractions)}${children.length ? `\n${children.map((child) => renderNode(document, child, depth + 1, includeInteractions)).join("\n")}\n${indent}` : ""}`;
  return `${indent}<${tag} ${attributes}>${inner}</${tag}>`;
}

function transformCss(node: StudioNode) {
  return `perspective(${node.transform.perspective}px) translateZ(${node.transform.z}px) rotateX(${node.transform.rotationX}deg) rotateY(${node.transform.rotationY}deg) rotateZ(${node.transform.rotationZ}deg) skew(${node.transform.skewX}deg, ${node.transform.skewY}deg) scale(${node.transform.scaleX / 100 * (node.transform.flipX ? -1 : 1)}, ${node.transform.scaleY / 100 * (node.transform.flipY ? -1 : 1)})`;
}

function layoutCss(node: StudioNode) {
  if (node.layout.mode === "free") return `display: flex; flex-direction: row;`;
  if (node.layout.mode === "grid") return `display: grid; grid-template-columns: repeat(${node.layout.columns}, minmax(0, 1fr));`;
  return `display: flex; flex-direction: ${node.layout.mode === "vertical" ? "column" : "row"}; flex-wrap: ${node.layout.wrap ? "wrap" : "nowrap"};`;
}

function positionCss(node: StudioNode, parent?: StudioNode) {
  if (node.layout.position === "relative") return "position: relative;";
  if (!parent) return `position: absolute; left: ${node.transform.x}px; top: ${node.transform.y}px;`;
  const right = parent.transform.width - node.transform.x - node.transform.width;
  const bottom = parent.transform.height - node.transform.y - node.transform.height;
  const horizontal = node.layout.horizontalConstraint === "end"
    ? `left: auto; right: ${right}px;`
    : node.layout.horizontalConstraint === "center"
      ? `left: calc(50% + ${node.transform.x + node.transform.width / 2 - parent.transform.width / 2 - node.transform.width / 2}px);`
      : node.layout.horizontalConstraint === "stretch"
        ? `left: ${node.transform.x}px; right: ${right}px;`
        : node.layout.horizontalConstraint === "scale"
          ? `left: ${node.transform.x / Math.max(1, parent.transform.width) * 100}%;`
          : `left: ${node.transform.x}px;`;
  const vertical = node.layout.verticalConstraint === "end"
    ? `top: auto; bottom: ${bottom}px;`
    : node.layout.verticalConstraint === "center"
      ? `top: calc(50% + ${node.transform.y + node.transform.height / 2 - parent.transform.height / 2 - node.transform.height / 2}px);`
      : node.layout.verticalConstraint === "stretch"
        ? `top: ${node.transform.y}px; bottom: ${bottom}px;`
        : node.layout.verticalConstraint === "scale"
          ? `top: ${node.transform.y / Math.max(1, parent.transform.height) * 100}%;`
          : `top: ${node.transform.y}px;`;
  return `position: absolute; ${horizontal} ${vertical}`;
}

function nodeDeclarations(node: StudioNode, includePosition = true, parent?: StudioNode) {
  const type = node.style.typography;
  const backgroundBlur = nodeBackdropFilter(node);
  const imagePaint = node.style.fills.find((paint) => paint.visible && paint.type === "image" && paint.imageUrl);
  const relative = node.layout.position === "relative";
  const stretchWidth = !relative && Boolean(parent) && node.layout.horizontalConstraint === "stretch";
  const stretchHeight = !relative && Boolean(parent) && node.layout.verticalConstraint === "stretch";
  const scaleWidth = !relative && Boolean(parent) && node.layout.horizontalConstraint === "scale";
  const scaleHeight = !relative && Boolean(parent) && node.layout.verticalConstraint === "scale";
  const width = stretchWidth ? "auto" : scaleWidth ? `${node.transform.width / Math.max(1, parent!.transform.width) * 100}%` : relative && node.layout.horizontalSizing === "fill" ? "100%" : relative && node.layout.horizontalSizing === "hug" ? "fit-content" : `${node.transform.width}px`;
  const height = stretchHeight ? "auto" : scaleHeight ? `${node.transform.height / Math.max(1, parent!.transform.height) * 100}%` : relative && node.layout.verticalSizing === "fill" ? "100%" : relative && node.layout.verticalSizing === "hug" ? "fit-content" : `${node.transform.height}px`;
  return `${includePosition ? positionCss(node, parent) : ""}
  width: ${width};
  height: ${height};
  min-width: ${node.layout.minWidth}px;
  max-width: ${node.layout.maxWidth > 0 ? `${node.layout.maxWidth}px` : "none"};
  min-height: ${node.layout.minHeight}px;
  max-height: ${node.layout.maxHeight > 0 ? `${node.layout.maxHeight}px` : "none"};
  ${relative && node.layout.horizontalSizing === "fill" ? "flex: 1 1 0;" : ""}
  box-sizing: border-box;
  ${layoutCss(node)}
  gap: ${node.layout.gap}px;
  row-gap: ${node.layout.rowGap}px;
  column-gap: ${node.layout.columnGap}px;
  padding: ${node.layout.mode === "free" ? 0 : node.layout.padding.map((value) => `${value}px`).join(" ")};
  align-items: ${node.layout.align === "start" ? "flex-start" : node.layout.align === "end" ? "flex-end" : node.layout.align};
  justify-content: ${node.layout.justify === "start" ? "flex-start" : node.layout.justify === "end" ? "flex-end" : node.layout.justify};
  overflow: ${node.geometry.clipChildren || node.geometry.mask ? "hidden" : "visible"};
  --morphiq-fill: ${node.style.fills[0]?.color ?? "transparent"};
  --morphiq-stroke: ${node.style.strokeColor};
  --morphiq-stroke-width: ${node.style.strokeWidth};
  color: ${node.kind === "text" ? node.style.fills[0]?.color ?? type.color : type.color};
  background: ${node.kind === "text" ? nodeBackground(node) : ["icon", "group", "line", "arrow", "vector", "polygon", "star"].includes(node.kind) ? "transparent" : nodeBackground(node)};
  ${node.kind === "text" && node.style.fills[0]?.type !== "solid" ? "background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;" : ""}
  background-blend-mode: ${node.style.fills.filter((paint) => paint.visible).map((paint) => paint.blendMode).join(", ") || "normal"};
  ${imagePaint ? `background-size: ${imagePaint.imageMode === "fit" ? "contain" : imagePaint.imageMode === "tile" ? "auto" : "cover"}; background-position: center; background-repeat: ${imagePaint.imageMode === "tile" ? "repeat" : "no-repeat"};` : ""}
  border: ${node.style.strokeAlign === "outside" ? 0 : node.style.strokeAlign === "center" ? node.style.strokeWidth / 2 : node.style.strokeWidth}px ${node.style.strokeStyle} color-mix(in srgb, ${node.style.strokeColor} ${node.style.strokeOpacity}%, transparent);
  ${node.style.strokeAlign === "outside" || node.style.strokeAlign === "center" ? `outline: ${node.style.strokeAlign === "outside" ? node.style.strokeWidth : node.style.strokeWidth / 2}px ${node.style.strokeStyle} color-mix(in srgb, ${node.style.strokeColor} ${node.style.strokeOpacity}%, transparent); outline-offset: 0;` : ""}
  border-radius: ${cornerRadiusCss(node)};
  ${node.geometry.cornerSmoothing > 0 ? `corner-shape: superellipse(${(1 + node.geometry.cornerSmoothing / 50).toFixed(2)});` : ""}
  box-shadow: ${nodeBoxShadow(node)};
  ${backgroundBlur ? `backdrop-filter: ${backgroundBlur}; -webkit-backdrop-filter: ${backgroundBlur};` : ""}
  ${nodeFilter(node) ? `filter: ${nodeFilter(node)};` : ""}
  opacity: ${node.visible ? node.style.opacity / 100 : 0};
  mix-blend-mode: ${node.style.blendMode};
  ${clipPathCss(node) ? `clip-path: ${clipPathCss(node)};` : ""}
  transform: ${transformCss(node)};
  transform-origin: ${node.transform.pivotX}% ${node.transform.pivotY}%;
  transform-style: preserve-3d;
  perspective: ${node.transform.perspective}px;
  font-family: ${type.family === "display" ? '"Bricolage Grotesque", system-ui, sans-serif' : type.family === "mono" ? "ui-monospace, monospace" : "Manrope, system-ui, sans-serif"};
  font-size: ${type.size}px;
  font-weight: ${type.weight};
  font-style: ${type.italic ? "italic" : "normal"};
  line-height: ${type.lineHeight};
  letter-spacing: ${type.letterSpacing}px;
  text-align: ${type.align};
  text-decoration: ${type.underline ? "underline" : "none"};
  text-transform: ${type.transform};`;
}

function nodeContentRules(node: StudioNode) {
  const selector = `.${nodeClass(node)}`;
  const effects = node.style.effects.map((effect, index) => ({ effect, index })).filter(({ effect }) => effect.visible).map(({ effect, index }) => {
    const base = `.${effectClass(node, index)} { position: absolute; inset: 0; z-index: 2; border-radius: inherit; pointer-events: none; opacity: ${effect.opacity / 100}; mix-blend-mode: ${effect.blendMode};`;
    if (effect.type === "noise") return `${base} background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.62'/%3E%3C/svg%3E"); background-size: ${Math.max(3, 18 - effect.intensity / 7)}px ${Math.max(3, 18 - effect.intensity / 7)}px; }`;
    if (effect.type === "texture") return `${base} background-image: repeating-linear-gradient(35deg, rgba(255,255,255,.7) 0 1px, rgba(25,24,22,.16) 1px 2px, transparent 2px 5px); background-size: ${Math.max(3, 18 - effect.intensity / 7)}px ${Math.max(3, 18 - effect.intensity / 7)}px; }`;
    if (effect.blendMode !== "normal" && ["dropShadow", "innerShadow", "glow", "innerGlow"].includes(effect.type)) return `${base} opacity: 1; z-index: 0; box-shadow: ${effectShadowCss(effect)}; }`;
    return "";
  }).filter(Boolean).join(" ");
  let content = "";
  if (["line", "arrow", "polygon", "star", "vector", "boolean", "icon"].includes(node.kind)) content = `${selector} > svg { width: 100%; height: 100%; display: block; overflow: visible; }`;
  if (node.kind === "input") content = `${selector} { align-items: flex-start; justify-content: center; flex-direction: column; padding: 0 16px; } ${selector} > span { font-size: .75em; opacity: .65; } ${selector} > input { width: 100%; border: 0; outline: 0; background: transparent; color: inherit; font: inherit; }`;
  if (node.kind === "toggle") content = `${selector} { justify-content: space-between; padding: 0 14px; } ${selector} > i:not([class]) { width: 34px; height: 20px; position: relative; border-radius: 999px; background: rgba(0,0,0,.13); } ${selector} > i:not([class])::after { content: ""; width: 14px; height: 14px; position: absolute; left: 3px; top: 3px; border-radius: 50%; background: white; box-shadow: 0 2px 5px rgba(0,0,0,.2); transition: transform .2s ease; } ${selector}[data-checked="true"] > i:not([class])::after { transform: translateX(14px); }`;
  if (node.kind === "slider") content = `${selector} { flex-direction: column; align-items: stretch; padding: 10px 14px; } ${selector} > span { display: flex; justify-content: space-between; } ${selector} input { width: 100%; accent-color: ${node.style.fills[0]?.color ?? "#7359df"}; }`;
  if (node.kind === "dial") content = `${selector} { position: relative; flex-direction: column; } ${selector} > i:not([class]) { width: 52%; aspect-ratio: 1; position: relative; border-radius: 50%; background: linear-gradient(145deg,#fff,#c9c7c1); box-shadow: inset 0 2px 3px rgba(255,255,255,.8),0 8px 14px rgba(0,0,0,.18); } ${selector} > i:not([class])::after { content: ""; width: 3px; height: 24%; position: absolute; left: 50%; top: 10%; border-radius: 3px; background: #ff8068; } ${selector} > small { font-size: .55em; letter-spacing: .12em; }`;
  if (node.kind === "progress") content = `${selector} { flex-direction: column; align-items: stretch; padding: 12px 16px; } ${selector} > span { display: flex; justify-content: space-between; } ${selector} > i:not([class]) { height: 8px; overflow: hidden; border-radius: 99px; background: rgba(0,0,0,.12); } ${selector} > i:not([class]) > em { height: 100%; display: block; border-radius: inherit; background: currentColor; }`;
  return `${effects} ${content}`;
}

function animatedNodeAtTime(document: StudioDocument, node: StudioNode, time: number) {
  let result = node;
  tracksForNode(document, node).forEach((track) => {
    const value = valueAtTime(track, time);
    if (value !== undefined) result = setPathValue(result, track.property, value);
  });
  return result;
}

function animationCss(document: StudioDocument, node: StudioNode) {
  const tracks = tracksForNode(document, node).filter((track) => track.enabled && track.keyframes.length);
  if (!tracks.length) return "";
  const [workStart, workEnd] = document.timeline.workArea;
  const workLength = Math.max(.001, workEnd - workStart);
  const hasSpring = tracks.some((track) => track.keyframes.some((frame, index) => frame.easing === "spring" && index < track.keyframes.length - 1));
  const springSampleCount = Math.ceil(workLength * Math.min(30, document.timeline.fps)) + 1;
  const springSamples = hasSpring ? Array.from({ length: springSampleCount }, (_, index) => workStart + index / Math.max(1, springSampleCount - 1) * workLength) : [];
  const times = [...new Set([workStart, workEnd, ...springSamples, ...tracks.flatMap((track) => track.keyframes.map((frame) => frame.time).filter((time) => time >= workStart && time <= workEnd))])].sort((a, b) => a - b);
  const name = `${nodeClass(node)}-motion`;
  const frames = times.map((time) => {
    const current = animatedNodeAtTime(document, node, time);
    const segment = tracks.flatMap((track) => track.keyframes).filter((frame) => frame.time <= time).sort((a, b) => b.time - a.time)[0];
    const timing = hasSpring ? "linear" : segment ? easingCss(segment.easing, segment.bezier) : "linear";
    return `  ${((time - workStart) / workLength * 100).toFixed(3)}% { width: ${current.transform.width}px; height: ${current.transform.height}px; left: ${current.transform.x}px; top: ${current.transform.y}px; opacity: ${current.visible ? current.style.opacity / 100 : 0}; transform: ${transformCss(current)}; background: ${nodeBackground(current)}; border-width: ${current.style.strokeWidth}px; border-color: color-mix(in srgb, ${current.style.strokeColor} ${current.style.strokeOpacity}%, transparent); border-radius: ${cornerRadiusCss(current)}; clip-path: ${clipPathCss(current) ?? "none"}; --morphiq-fill: ${current.style.fills[0]?.color ?? "transparent"}; --morphiq-stroke: ${current.style.strokeColor}; --morphiq-stroke-width: ${current.style.strokeWidth}; box-shadow: ${nodeBoxShadow(current)}; filter: ${nodeFilter(current) ?? "none"}; animation-timing-function: ${timing}; }`;
  }).join("\n");
  const firstFrame = tracks[0].keyframes[0];
  const iterations = document.timeline.loop ? "infinite" : document.timeline.direction === "alternate" ? "2" : "1";
  return `\n@keyframes ${name} {\n${frames}\n}\n.root[data-variant="base"] .${nodeClass(node)} { animation: ${name} ${workLength / Math.max(.01, document.timeline.speed)}s ${easingCss(firstFrame?.easing ?? "easeInOut", firstFrame?.bezier)} ${iterations} ${document.timeline.direction}; }`;
}

function resolveVariantNode(document: StudioDocument, node: StudioNode, variant: StudioDocument["variants"][number]) {
  let resolved = node;
  if (node.instanceSourceId) resolved = mergeNodeOverride(resolved, variant.overrides[node.instanceSourceId]);
  return mergeNodeOverride(resolved, variant.overrides[node.id]);
}

function variantCss(document: StudioDocument, node: StudioNode) {
  return document.variants.map((variant) => {
    const baseParent = node.parentId ? document.nodes.find((candidate) => candidate.id === node.parentId) : undefined;
    const hasNodeOverride = Boolean(variant.overrides[node.id] || (node.instanceSourceId && variant.overrides[node.instanceSourceId]));
    const hasParentOverride = Boolean(baseParent && (variant.overrides[baseParent.id] || (baseParent.instanceSourceId && variant.overrides[baseParent.instanceSourceId])));
    if (!hasNodeOverride && !hasParentOverride) return "";
    const resolved = resolveVariantNode(document, node, variant);
    const parent = baseParent ? resolveVariantNode(document, baseParent, variant) : undefined;
    return `.root[data-variant=${JSON.stringify(variant.id)}] .${nodeClass(node)} { ${nodeDeclarations(resolved, true, parent)} }`;
  }).filter(Boolean).join("\n");
}

function responsiveCss(document: StudioDocument, node: StudioNode) {
  const rules: string[] = [];
  (["tablet", "mobile"] as Device[]).forEach((device) => {
    const override = node.responsive[device];
    if (!override || !Object.keys(override).length) return;
    const resolved = resolveResponsiveNode(node, device);
    const baseParent = node.parentId ? document.nodes.find((candidate) => candidate.id === node.parentId) : undefined;
    const parent = baseParent ? resolveResponsiveNode(baseParent, device) : undefined;
    const max = device === "mobile" ? 520 : 900;
    const variants = document.variants.map((variant) => {
      const variantNode = resolveVariantNode(document, resolved, variant);
      const variantParent = parent ? resolveVariantNode(document, parent, variant) : undefined;
      return `.root[data-variant=${JSON.stringify(variant.id)}] .${nodeClass(node)} { ${nodeDeclarations(variantNode, true, variantParent)} }`;
    }).join("\n");
    rules.push(`@media (max-width: ${max}px) { .${nodeClass(node)} { ${nodeDeclarations(resolved, true, parent)} }\n${variants} }`);
  });
  return rules.join("\n");
}

function generatedLifecycleEffects(document: StudioDocument) {
  const scheduled = document.interactions.filter((interaction) => interaction.trigger === "load" || interaction.trigger === "delay");
  const variable = document.interactions.filter((interaction) => interaction.trigger === "variable");
  const keyboard = document.interactions.filter((interaction) => interaction.trigger === "key");
  const variableSelfMutation = variable.some((interaction) => interaction.action === "setVariable");
  const blocks: string[] = [];
  if (scheduled.length) {
    const actions = scheduled.map((interaction) => {
      const command = interactionCommand(interaction, false);
      const guarded = `if (variant === ${JSON.stringify(interaction.sourceVariantId)}) { ${command}; }`;
      return interaction.delay > 0 ? `timers.push(window.setTimeout(() => { ${guarded} }, ${Math.round(interaction.delay * 1000)}));` : guarded;
    }).join("\n    ");
    blocks.push(`useEffect(() => {\n    const timers: number[] = [];\n    ${actions}\n    return () => timers.forEach((timer) => window.clearTimeout(timer));\n  }, [variant]);`);
  }
  if (variable.length) {
    const actions = variable.map((interaction) => `if (variant === ${JSON.stringify(interaction.sourceVariantId)}) { ${interactionCommand(interaction)}; }`).join("\n    ");
    blocks.push(`const variableSnapshot = useRef(JSON.stringify(variables));\n  ${variableSelfMutation ? "const suppressVariableReaction = useRef(false);" : ""}\n  useEffect(() => {\n    const nextSnapshot = JSON.stringify(variables);\n    if (nextSnapshot === variableSnapshot.current) return;\n    variableSnapshot.current = nextSnapshot;\n    ${variableSelfMutation ? "if (suppressVariableReaction.current) { suppressVariableReaction.current = false; return; }" : ""}\n    ${actions}\n  }, [variant, variables]);`);
  }
  if (keyboard.length) {
    const actions = keyboard.map((interaction) => `if (variant === ${JSON.stringify(interaction.sourceVariantId)}) { ${interactionCommand(interaction)}; }`).join("\n      ");
    blocks.push(`useEffect(() => {\n    const onMorphiqKeyDown = (event: KeyboardEvent) => {\n      ${actions}\n    };\n    window.addEventListener("keydown", onMorphiqKeyDown);\n    return () => window.removeEventListener("keydown", onMorphiqKeyDown);\n  }, [variant, variables]);`);
  }
  return { code: blocks.join("\n  "), useEffect: Boolean(scheduled.length || variable.length || keyboard.length), useRef: Boolean(variable.length) };
}

function generatedRuntimeMotion(document: StudioDocument) {
  const variableTracks = document.timeline.tracks.filter((track) => track.enabled && track.variableId).map((track) => ({ variableId: track.variableId!, keyframes: [...track.keyframes].sort((a, b) => a.time - b.time) }));
  const supportsContentTrack = (node: StudioNode, property: string) => property.startsWith("geometry.vectorPoints.") && node.kind === "vector"
    ? property.endsWith(".x") || property.endsWith(".y")
    : property === "text"
    ? ["text", "button", "input", "toggle", "slider", "dial", "progress"].includes(node.kind)
    : property === "secondaryText"
      ? ["input", "dial", "progress"].includes(node.kind)
      : property === "value" && ["slider", "dial", "progress"].includes(node.kind);
  const nodeTracks = document.nodes.flatMap((node) => tracksForNode(document, node)
    .filter((track) => track.enabled && supportsContentTrack(node, track.property))
    .map((track) => ({ key: nodeMotionKey(node, track.property), keyframes: [...track.keyframes].sort((a, b) => a.time - b.time) })));
  if (!variableTracks.length && !nodeTracks.length) return { helper: "", effect: "", enabled: false, nodes: false, variables: false };
  const [workStart, workEnd] = document.timeline.workArea;
  const helper = `type MorphiqMotionFrame = { id?: string; time: number; value: string | number | boolean; easing: string; bezier: [number, number, number, number]; spring: { mass: number; stiffness: number; damping: number; velocity: number } };
${variableTracks.length ? `const morphiqVariableTracks: { variableId: string; keyframes: MorphiqMotionFrame[] }[] = ${JSON.stringify(variableTracks)};` : ""}
${nodeTracks.length ? `const morphiqNodeTracks: { key: string; keyframes: MorphiqMotionFrame[] }[] = ${JSON.stringify(nodeTracks)};` : ""}

function morphiqCubic(progress: number, bezier: MorphiqMotionFrame["bezier"]) {
  const coordinate = (t: number, first: number, second: number) => 3 * (1 - t) ** 2 * t * first + 3 * (1 - t) * t ** 2 * second + t ** 3;
  let low = 0, high = 1, parameter = progress;
  for (let index = 0; index < 12; index += 1) { parameter = (low + high) / 2; if (coordinate(parameter, bezier[0], bezier[2]) < progress) low = parameter; else high = parameter; }
  return coordinate(parameter, bezier[1], bezier[3]);
}

function morphiqEase(progress: number, frame: MorphiqMotionFrame) {
  const t = Math.max(0, Math.min(1, progress));
  if (frame.easing === "linear") return t;
  if (frame.easing === "easeIn") return t ** 3;
  if (frame.easing === "easeOut") return 1 - (1 - t) ** 3;
  if (frame.easing === "easeInOut") return t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
  if (frame.easing === "cubicBezier") return morphiqCubic(t, frame.bezier);
  const mass = Math.max(.1, frame.spring.mass), angular = Math.sqrt(Math.max(1, frame.spring.stiffness) / mass), damping = frame.spring.damping / (2 * Math.sqrt(Math.max(1, frame.spring.stiffness) * mass));
  return 1 - Math.exp(-damping * angular * t * 6) * Math.cos(angular * Math.sqrt(Math.max(.01, 1 - damping * damping)) * t * .75 + frame.spring.velocity * .03);
}

function morphiqSample(frames: MorphiqMotionFrame[], time: number) {
  if (!frames.length) return undefined;
  if (time <= frames[0].time) return frames[0].value;
  if (time >= frames[frames.length - 1].time) return frames[frames.length - 1].value;
  const index = frames.findIndex((frame) => frame.time >= time), before = frames[index - 1], after = frames[index];
  const progress = morphiqEase((time - before.time) / Math.max(.0001, after.time - before.time), before);
  if (typeof before.value === "number" && typeof after.value === "number") return before.value + (after.value - before.value) * progress;
  if (typeof before.value === "string" && typeof after.value === "string" && /^#[0-9a-f]{6}$/i.test(before.value) && /^#[0-9a-f]{6}$/i.test(after.value)) {
    const beforeColor = before.value, afterColor = after.value;
    const channel = (offset: number) => Math.round(parseInt(beforeColor.slice(offset, offset + 2), 16) + (parseInt(afterColor.slice(offset, offset + 2), 16) - parseInt(beforeColor.slice(offset, offset + 2), 16)) * progress).toString(16).padStart(2, "0");
    return "#" + channel(1) + channel(3) + channel(5);
  }
  return progress < .5 ? before.value : after.value;
}`;
  const effect = `useEffect(() => {
    if (motion !== "running") return;
    let request = 0, lastPaint = 0;
    const startedAt = performance.now();
    const start = ${workStart}, end = ${workEnd}, length = Math.max(.001, end - start);
    const direction: string = ${JSON.stringify(document.timeline.direction)};
    const totalLength = direction === "alternate" ? length * 2 : length;
    const tick = (now: number) => {
      if (now - lastPaint < ${1000 / document.timeline.fps}) { request = requestAnimationFrame(tick); return; }
      lastPaint = now;
      const elapsed = (now - startedAt) / 1000 * ${document.timeline.speed};
      const cycle = Math.floor(elapsed / length), phase = elapsed % length;
      let time = start + phase;
      if (direction === "reverse") time = end - phase;
      if (direction === "alternate" && cycle % 2) time = end - phase;
      if (reverse) time = end - (time - start);
      if (!${document.timeline.loop} && elapsed >= totalLength) { time = direction === "alternate" ? start : reverse || direction === "reverse" ? start : end; if (reverse && direction === "alternate") time = end; setMotion("paused"); }
      ${variableTracks.length ? "setVariables((current) => { const next = { ...current }; morphiqVariableTracks.forEach((track) => { const value = morphiqSample(track.keyframes, time); if (value !== undefined) next[track.variableId] = value; }); return next; });" : ""}
      ${nodeTracks.length ? "setNodeMotionValues((current) => { const next = { ...current }; morphiqNodeTracks.forEach((track) => { const value = morphiqSample(track.keyframes, time); if (value !== undefined) next[track.key] = value; }); return next; });" : ""}
      if (${document.timeline.loop} || elapsed < totalLength) request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [motion, reverse]);`;
  return { helper, effect, enabled: true, nodes: Boolean(nodeTracks.length), variables: Boolean(variableTracks.length) };
}

export function generateReact(document: StudioDocument) {
  document = materializeComponentInstances(document);
  const name = componentName(document);
  const roots = getRootNodes(document.nodes);
  const lifecycle = generatedLifecycleEffects(document);
  const runtimeMotion = generatedRuntimeMotion(document);
  const actions = new Set(document.interactions.map((interaction) => interaction.action));
  const controlNodes = document.nodes.filter((node) => node.kind === "toggle" || node.kind === "slider" || node.kind === "dial");
  const usesLocalControls = controlNodes.some((node) => node.kind === "toggle" ? !node.bindings.checked : !node.bindings.value);
  const usesPointerOrigins = document.nodes.some((node) => node.kind === "dial") || document.interactions.some((interaction) => interaction.trigger === "swipe");
  const needsSetVariant = ["changeVariant", "toggleVariant", "playTimeline", "reverseTimeline"].some((action) => actions.has(action as StudioInteraction["action"]));
  const needsTransition = actions.has("changeVariant") || actions.has("toggleVariant");
  const needsSetMotion = ["changeVariant", "toggleVariant", "playTimeline", "pauseTimeline", "reverseTimeline"].some((action) => actions.has(action as StudioInteraction["action"])) || runtimeMotion.enabled;
  const needsSetReverse = actions.has("reverseTimeline");
  const needsSetVariables = actions.has("setVariable") || runtimeMotion.variables || controlNodes.some((node) => node.kind === "toggle" ? Boolean(node.bindings.checked) : Boolean(node.bindings.value));
  const valueResolver = actions.has("setVariable") ? `function resolveMorphiqValue(input: unknown, current: unknown) {
  if (input === "toggle") return !current;
  if (typeof input === "string") {
    const match = input.match(/^current\\s*([+\\-*/])\\s*(-?\\d+(?:\\.\\d+)?)$/);
    if (match) {
      const left = Number(current);
      const right = Number(match[2]);
      if (match[1] === "+") return left + right;
      if (match[1] === "-") return left - right;
      if (match[1] === "*") return left * right;
      return right === 0 ? left : left / right;
    }
  }
  return input;
}` : "";
  const urlOpener = actions.has("openUrl") ? `function openMorphiqUrl(value: string) {
  try {
    const url = new URL(value, window.location.href);
    if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) return;
    window.open(url.href, "_blank", "noopener,noreferrer");
  } catch {
    // Ignore invalid and unsafe protocols in generated prototype interactions.
  }
}` : "";
  const imports = ["useState", lifecycle.useEffect || runtimeMotion.enabled ? "useEffect" : "", lifecycle.useRef || usesPointerOrigins ? "useRef" : ""].filter(Boolean).sort().join(", ");
  return `"use client";

import { ${imports}${needsTransition ? ", type CSSProperties" : ""} } from "react";
import styles from "./${name}.module.css";

${valueResolver}
${urlOpener}
${runtimeMotion.helper}

type ${name}Props = {
  className?: string;
  initialVariant?: ${["base", ...document.variants.map((variant) => variant.id)].map((id) => JSON.stringify(id)).join(" | ")};
  initialVariables?: Partial<Record<${document.variables.length ? document.variables.map((variable) => JSON.stringify(variable.id)).join(" | ") : "string"}, string | number | boolean>>;
  ${usesLocalControls ? "initialControls?: Partial<Record<string, number | boolean>>;" : ""}
};

export function ${name}({ className = "", initialVariant = "base", initialVariables = {}${usesLocalControls ? ", initialControls = {}" : ""} }: ${name}Props) {
  const [variant${needsSetVariant ? ", setVariant" : ""}] = useState(initialVariant);
  const [motion${needsSetMotion ? ", setMotion" : ""}] = useState<"running" | "paused">("running");
  const [reverse${needsSetReverse ? ", setReverse" : ""}] = useState(false);
  ${needsTransition ? "const [transition, setTransition] = useState<{ type: \"smart\" | \"instant\" | \"dissolve\"; duration: number; easing: string }>({ type: \"smart\", duration: .35, easing: \"ease-in-out\" });" : ""}
  const [variables${needsSetVariables ? ", setVariables" : ""}] = useState<Record<string, unknown>>({ ...${JSON.stringify(Object.fromEntries(document.variables.map((variable) => [variable.id, variable.value])))}, ...initialVariables });
  ${runtimeMotion.nodes ? "const [nodeMotionValues, setNodeMotionValues] = useState<Record<string, string | number | boolean>>({});" : ""}
  ${usesLocalControls ? `const [controlValues, setControlValues] = useState<Record<string, number | boolean>>({ ...${JSON.stringify(Object.fromEntries(controlNodes.map((node) => [node.id, node.kind === "toggle" ? node.checked : node.value])))}, ...initialControls });` : ""}
  ${usesPointerOrigins ? "const pointerOrigins = useRef<Record<string, { x: number; y: number }>>({});" : ""}
  ${lifecycle.code}
  ${runtimeMotion.effect}
  return (
    <div className={\`${"${styles.root}"} ${"${className}"}\`} data-motion={motion} data-reverse={reverse} data-transition={${needsTransition ? "transition.type" : '"smart"'}} data-variables={JSON.stringify(variables)} data-variant={variant}${needsTransition ? ' style={{ "--morphiq-transition-duration": transition.duration + "s", "--morphiq-transition-easing": transition.easing } as CSSProperties}' : ""}>
${roots.map((node) => renderNode(document, node, 3)).join("\n")}
    </div>
  );
}
`;
}

export function generateCss(document: StudioDocument) {
  document = materializeComponentInstances(document);
  const nodeRules = document.nodes.map((node) => {
    const parent = node.parentId ? document.nodes.find((candidate) => candidate.id === node.parentId) : undefined;
    return `.${nodeClass(node)} {\n  ${nodeDeclarations(node, true, parent)}\n  transition: left var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), top var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), right var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), bottom var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), width var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), height var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), transform var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), opacity var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), background var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), box-shadow var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease), filter var(--morphiq-transition-duration, .35s) var(--morphiq-transition-easing, ease);\n}\n${nodeContentRules(node)}\n${variantCss(document, node)}\n${responsiveCss(document, node)}${animationCss(document, node)}`;
  }).join("\n\n");
  return `.root {
  width: ${document.canvas.width}px;
  height: ${document.canvas.height}px;
  max-width: 100%;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: ${document.canvas.color};
  perspective: 1200px;
}

${nodeRules}

.root[data-motion="paused"] *, .root[data-motion="paused"] { animation-play-state: paused !important; }
.root[data-reverse="true"] *, .root[data-reverse="true"] { animation-direction: reverse !important; }
.root[data-transition="instant"] * { transition-duration: 0s !important; }
.root[data-transition="dissolve"] * { transition-property: opacity !important; }

@media (prefers-reduced-motion: reduce) {
  .root, .root * {
    animation: none !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}`;
}

function staticNodeMarkup(document: StudioDocument, node: StudioNode) {
  return renderNode(document, node, 0, false)
    .replace(/className=\{styles\["([^"]+)"\]\}/g, 'class="$1"')
    .replace(/on[A-Z][A-Za-z]+=\{[^}]+\}/g, "")
    .replace(/tabIndex=\{(-?\d+)\}/g, 'tabindex="$1"')
    .replace(/style=\{\{ width: "([^"]+)" \}\}/g, 'style="width:$1"')
    .replace(/strokeWidth=/g, "stroke-width=")
    .replace(/strokeLinecap=/g, "stroke-linecap=")
    .replace(/strokeLinejoin=/g, "stroke-linejoin=")
    .replace(/fillRule=/g, "fill-rule=")
    .replace(/markerEnd=/g, "marker-end=")
    .replace(/clipPath=/g, "clip-path=")
    .replace(/className=/g, "class=");
}

export function generateHtml(document: StudioDocument) {
  document = materializeComponentInstances(document);
  const roots = getRootNodes(document.nodes);
  const body = roots.map((node) => staticNodeMarkup(document, node)).join("\n");
  return `<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(document.name)}</title><style>${generateCss(document).replace(/\.root/g, ".morphiq-root")}</style></head>\n<body><main class="morphiq-root">${body}</main></body>\n</html>`;
}

export function generateSvg(document: StudioDocument, selectedIds: string[]) {
  document = materializeComponentInstances(document);
  const selectedSet = new Set(selectedIds);
  const hasSelectedAncestor = (node: StudioNode) => {
    let parentId = node.parentId;
    while (parentId) {
      if (selectedSet.has(parentId)) return true;
      parentId = document.nodes.find((candidate) => candidate.id === parentId)?.parentId ?? null;
    }
    return false;
  };
  const selectionRoots = document.nodes.filter((node) => selectedSet.has(node.id) && !hasSelectedAncestor(node));
  const roots = selectionRoots.length ? selectionRoots : getRootNodes(document.nodes);
  const css = generateCss(document).replace(/\.root/g, ".morphiq-svg-root");
  const body = roots.map((node) => staticNodeMarkup(document, node)).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${document.canvas.width} ${document.canvas.height}" width="${document.canvas.width}" height="${document.canvas.height}" role="img" aria-labelledby="morphiq-svg-title morphiq-svg-description">
  <title id="morphiq-svg-title">${esc(document.name)}</title>
  <desc id="morphiq-svg-description">Morphiq Studio web component export with editable layer hierarchy and material styling.</desc>
  <foreignObject x="0" y="0" width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" class="morphiq-svg-root" data-motion="running" data-reverse="false" data-variant="base">
      <style>${esc(css)}</style>
${body}
    </div>
  </foreignObject>
</svg>`;
}

export function generateAiPrompt(document: StudioDocument) {
  return `Implementa el componente ${componentName(document)} exactamente como está definido. Conserva todas las capas, jerarquías, materiales, variantes, interacciones, timeline, comportamiento responsive, semántica y prefers-reduced-motion. No simplifiques gradientes, sombras, pivotes ni transformaciones 3D.\n\n// ${componentName(document)}.tsx\n${generateReact(document)}\n\n/* ${componentName(document)}.module.css */\n${generateCss(document)}`;
}

export function downloadFile(filename: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportDocument(document: StudioDocument) {
  downloadFile(`${cssName(document.name)}.morphiq.json`, JSON.stringify(document, null, 2), "application/json");
}
