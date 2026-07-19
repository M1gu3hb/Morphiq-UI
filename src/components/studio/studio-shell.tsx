"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { Rnd } from "react-rnd";
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignStartVertical,
  ArrowLeft,
  Box,
  BringToFront,
  Check,
  Circle,
  CircleDot,
  Code2,
  Component,
  Copy,
  Download,
  Eye,
  FileJson,
  Frame,
  Group,
  Image as ImageIcon,
  Import,
  Layers3,
  Lock,
  Maximize2,
  Menu,
  Minus,
  Monitor,
  MousePointer2,
  PanelBottomClose,
  PanelBottomOpen,
  PenTool,
  Play,
  Plus,
  Redo2,
  Save,
  Search,
  SendToBack,
  Shapes,
  Smartphone,
  Sparkles,
  Square,
  Star,
  Tablet,
  ToggleLeft,
  Trash2,
  Type,
  Undo2,
  Ungroup,
  Upload,
  WandSparkles,
} from "lucide-react";
import { tr, type Locale } from "@/lib/i18n";
import { StudioInspector } from "./studio-inspector";
import { StudioLayerTree } from "./studio-layers";
import {
  animatableProperties,
  createId,
  createNode,
  deviceSizes,
  getDescendantIds,
  getNodeChildren,
  getPathValue,
  getRootNodes,
  isSafePropertyPath,
  initialDocument,
  isContainer,
  mergeNodeOverride,
  normalizeStudioDocument,
  resolveResponsiveNode,
  setPathValue,
  type AccessibilitySettings,
  type AnimatableProperty,
  type BooleanOperation,
  type ComponentDefinition,
  type ComponentPropertyType,
  type Device,
  type InspectorTab,
  type KeyframeValue,
  type NodeGeometry,
  type NodeKind,
  type NodeLayout,
  type NodeOverride,
  type NodeStyle,
  type NodeTransform,
  type Point,
  type ResponsiveOverride,
  type SceneVariant,
  type StudioDocument,
  type StudioInteraction,
  type StudioNode,
  type StudioTool,
  type StudioVariable,
  type TransitionType,
  type TriggerType,
} from "./studio-model";
import { applyTimelineToNodes, applyTimelineToVariables, easingCss, upsertKeyframe } from "./studio-motion";
import { StudioNodePreview } from "./studio-node";
import { StudioTimelinePanel } from "./studio-timeline";
import { instantiateTemplate, studioTemplates } from "./studio-templates";
import { downloadFile, exportDocument, generateAiPrompt, generateCss, generateHtml, generateReact, generateSvg } from "./studio-export";

type LeftTab = "add" | "layers" | "components";
type ExportTab = "react" | "css" | "html" | "svg" | "ai" | "json";

function openSafeUrl(value: string) {
  try {
    const url = new URL(value, window.location.href);
    if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) return;
    window.open(url.href, "_blank", "noopener,noreferrer");
  } catch {
    // Invalid prototype URLs are ignored instead of reaching the browser opener.
  }
}

const primitiveTools: { kind: NodeKind; label: string; icon: typeof Square }[] = [
  { kind: "frame", label: "Frame", icon: Frame },
  { kind: "group", label: "Group", icon: Group },
  { kind: "rectangle", label: "Rectangle", icon: Square },
  { kind: "ellipse", label: "Ellipse", icon: Circle },
  { kind: "line", label: "Line", icon: Minus },
  { kind: "arrow", label: "Arrow", icon: ArrowLeft },
  { kind: "polygon", label: "Polygon", icon: Shapes },
  { kind: "star", label: "Star", icon: Star },
  { kind: "text", label: "Text", icon: Type },
  { kind: "image", label: "Image", icon: ImageIcon },
  { kind: "icon", label: "Icon", icon: Sparkles },
  { kind: "vector", label: "Vector", icon: PenTool },
];

const uiPrimitives: { kind: NodeKind; label: string; icon: typeof Square }[] = [
  { kind: "button", label: "Button", icon: Box },
  { kind: "input", label: "Input", icon: Menu },
  { kind: "toggle", label: "Toggle", icon: ToggleLeft },
  { kind: "slider", label: "Slider", icon: Maximize2 },
  { kind: "dial", label: "Dial", icon: CircleDot },
  { kind: "progress", label: "Progress", icon: Minus },
];

const toolbarTools: { tool: StudioTool; label: string; icon: typeof Square }[] = [
  { tool: "select", label: "Select", icon: MousePointer2 },
  { tool: "frame", label: "Frame", icon: Frame },
  { tool: "rectangle", label: "Rectangle", icon: Square },
  { tool: "ellipse", label: "Ellipse", icon: Circle },
  { tool: "line", label: "Line", icon: Minus },
  { tool: "arrow", label: "Arrow", icon: ArrowLeft },
  { tool: "polygon", label: "Polygon", icon: Shapes },
  { tool: "star", label: "Star", icon: Star },
  { tool: "pen", label: "Pen", icon: PenTool },
  { tool: "text", label: "Text", icon: Type },
];

const toolToKind: Partial<Record<StudioTool, NodeKind>> = { frame: "frame", rectangle: "rectangle", ellipse: "ellipse", line: "line", arrow: "arrow", polygon: "polygon", star: "star", text: "text" };
const primitiveLabelsEs: Partial<Record<NodeKind, string>> = { frame: "Frame", group: "Grupo", rectangle: "Rectángulo", ellipse: "Elipse", line: "Línea", arrow: "Flecha", polygon: "Polígono", star: "Estrella", text: "Texto", image: "Imagen", icon: "Icono", vector: "Vector", button: "Botón", input: "Campo", toggle: "Interruptor", slider: "Deslizador", dial: "Dial", progress: "Progreso" };
const toolLabelsEs: Partial<Record<StudioTool, string>> = { select: "Seleccionar", frame: "Frame", rectangle: "Rectángulo", ellipse: "Elipse", line: "Línea", arrow: "Flecha", polygon: "Polígono", star: "Estrella", pen: "Pluma", text: "Texto" };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

function genericSet(node: StudioNode, path: string, value: KeyframeValue) {
  if (!isSafePropertyPath(path)) return node;
  if ((animatableProperties.some((property) => property.property === path))) return setPathValue(node, path as AnimatableProperty, value);
  const clone = deepClone(node) as StudioNode;
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

function resolveExpression(input: string | number | boolean | undefined, target: StudioVariable, variables: StudioVariable[]) {
  if (input === undefined) return target.value;
  if (typeof input !== "string") return input;
  const expression = input.trim();
  if (target.type === "boolean") {
    if (expression === "toggle" || expression === `!${target.name}`) return !Boolean(target.value);
    if (expression === "true" || expression === "false") return expression === "true";
  }
  if (target.type === "number") {
    const values = new Map(variables.map((variable) => [variable.name, Number(variable.value)]));
    values.set("current", Number(target.value));
    const match = expression.match(/^([a-zA-Z_][\w-]*|-?\d+(?:\.\d+)?)\s*([+\-*/])?\s*(-?\d+(?:\.\d+)?)?$/);
    if (match) {
      const left = values.has(match[1]) ? values.get(match[1])! : Number(match[1]);
      const right = match[3] === undefined ? 0 : Number(match[3]);
      if (!match[2]) return left;
      if (match[2] === "+") return left + right;
      if (match[2] === "-") return left - right;
      if (match[2] === "*") return left * right;
      if (match[2] === "/") return right === 0 ? left : left / right;
    }
    const numeric = Number(expression);
    return Number.isFinite(numeric) ? numeric : target.value;
  }
  const referenced = variables.find((variable) => variable.name === expression);
  return referenced ? referenced.value : expression;
}

function mergeOverride(existing: NodeOverride | undefined, patch: NodeOverride): NodeOverride {
  return {
    ...existing,
    ...patch,
    transform: patch.transform ? { ...existing?.transform, ...patch.transform } : existing?.transform,
    geometry: patch.geometry ? { ...existing?.geometry, ...patch.geometry } : existing?.geometry,
    style: patch.style ? {
      ...existing?.style,
      ...patch.style,
      filters: patch.style.filters ? { ...existing?.style?.filters, ...patch.style.filters } : existing?.style?.filters,
      typography: patch.style.typography ? { ...existing?.style?.typography, ...patch.style.typography } : existing?.style?.typography,
    } : existing?.style,
    layout: patch.layout ? { ...existing?.layout, ...patch.layout } : existing?.layout,
  };
}

function absolutePosition(nodes: StudioNode[], nodeId: string): { x: number; y: number } {
  const node = nodes.find((item) => item.id === nodeId);
  if (!node) return { x: 0, y: 0 };
  if (!node.parentId) return { x: node.transform.x, y: node.transform.y };
  const parent: { x: number; y: number } = absolutePosition(nodes, node.parentId);
  return { x: parent.x + node.transform.x, y: parent.y + node.transform.y };
}

function updateParentChildren(nodes: StudioNode[], parentId: string | null, update: (ids: string[]) => string[]) {
  if (!parentId) return nodes;
  return nodes.map((node) => node.id === parentId ? { ...node, childIds: update(node.childIds) } : node);
}

function cleanupRemovedNodeReferences(document: StudioDocument, nodes: StudioNode[], removedIds: Set<string>): StudioDocument {
  const components = document.components
    .filter((component) => !removedIds.has(component.rootNodeId))
    .map((component) => ({ ...component, properties: component.properties.filter((property) => !removedIds.has(property.targetNodeId)) }));
  const componentIds = new Set(components.map((component) => component.id));
  return {
    ...document,
    nodes: nodes.map((node) => ({
      ...node,
      componentId: node.componentId && componentIds.has(node.componentId) ? node.componentId : undefined,
      instanceSourceId: node.instanceSourceId && !removedIds.has(node.instanceSourceId) ? node.instanceSourceId : undefined,
      instanceOverrides: node.componentId && componentIds.has(node.componentId) ? node.instanceOverrides : {},
    })),
    variants: document.variants.map((variant) => ({ ...variant, overrides: Object.fromEntries(Object.entries(variant.overrides).filter(([nodeId]) => !removedIds.has(nodeId))) })),
    interactions: document.interactions.filter((interaction) => !removedIds.has(interaction.sourceNodeId)),
    components,
    timeline: { ...document.timeline, tracks: document.timeline.tracks.filter((track) => !removedIds.has(track.nodeId)) },
  };
}

function groupNodesInDocument(document: StudioDocument, ids: string[], kind: "group" | "boolean" = "group", operation: BooleanOperation = "union") {
  const selected = document.nodes.filter((node) => ids.includes(node.id));
  if (!selected.length) return null;
  const parentId = selected[0].parentId;
  if (!selected.every((node) => node.parentId === parentId)) return null;
  const minX = Math.min(...selected.map((node) => node.transform.x));
  const minY = Math.min(...selected.map((node) => node.transform.y));
  const maxX = Math.max(...selected.map((node) => node.transform.x + node.transform.width));
  const maxY = Math.max(...selected.map((node) => node.transform.y + node.transform.height));
  const group = createNode(kind, {
    name: kind === "boolean" ? `${operation} boolean` : "Group",
    parentId,
    childIds: selected.map((node) => node.id),
    transform: { ...createNode(kind).transform, x: minX, y: minY, width: maxX - minX, height: maxY - minY },
  });
  group.geometry.booleanOperation = operation;
  group.geometry.clipChildren = kind === "boolean";
  group.style = kind === "boolean" ? deepClone(selected[0].style) : { ...group.style, fills: [], effects: [], strokeWidth: 0 };
  let nodes = document.nodes.map((node) => ids.includes(node.id) ? { ...node, parentId: group.id, transform: { ...node.transform, x: node.transform.x - minX, y: node.transform.y - minY } } : node);
  if (parentId) {
    const parent = nodes.find((node) => node.id === parentId);
    const firstIndex = Math.min(...ids.map((id) => parent?.childIds.indexOf(id) ?? 0).filter((index) => index >= 0));
    nodes = updateParentChildren(nodes, parentId, (childIds) => {
      const next = childIds.filter((id) => !ids.includes(id));
      next.splice(Math.max(0, firstIndex), 0, group.id);
      return next;
    });
  }
  nodes.push(group);
  return { document: { ...document, nodes }, groupId: group.id };
}

export function StudioShell({ locale }: { locale: Locale }) {
  const t = useCallback((english: string, spanish: string) => tr(locale, english, spanish), [locale]);
  const [project, setProject] = useState<StudioDocument>(deepClone(initialDocument));
  const [past, setPast] = useState<StudioDocument[]>([]);
  const [future, setFuture] = useState<StudioDocument[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([initialDocument.nodes[1]?.id ?? initialDocument.nodes[0]?.id]);
  const [selectedKeyframeIds, setSelectedKeyframeIds] = useState<Set<string>>(new Set());
  const [leftTab, setLeftTab] = useState<LeftTab>("add");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("design");
  const [activeTool, setActiveTool] = useState<StudioTool>("select");
  const [activeVariantId, setActiveVariantId] = useState("base");
  const [previewMode, setPreviewMode] = useState(false);
  const [vectorEditMode, setVectorEditMode] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [zoom, setZoom] = useState(88);
  const [search, setSearch] = useState("");
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [exportTab, setExportTab] = useState<ExportTab>("react");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [penPoints, setPenPoints] = useState<Point[]>([]);
  const [runtimeVariables, setRuntimeVariables] = useState<Record<string, string | number | boolean>>({});
  const [runtimeNodePatches, setRuntimeNodePatches] = useState<Record<string, Partial<StudioNode>>>({});
  const [runtimeDirection, setRuntimeDirection] = useState<StudioDocument["timeline"]["direction"] | null>(null);
  const [smartTransition, setSmartTransition] = useState<{ duration: number; easing: string; type: TransitionType }>({ duration: 0.35, easing: "ease-in-out", type: "smart" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const variableSnapshotRef = useRef("");
  const suppressVariableReactionRef = useRef(false);

  const structuralNodeMap = useMemo(() => new Map(project.nodes.map((node) => [node.id, node])), [project.nodes]);
  const activeVariant = project.variants.find((variant) => variant.id === activeVariantId);
  const playbackDirection = previewMode && runtimeDirection ? runtimeDirection : project.timeline.direction;
  const variableAnimationTime = project.timeline.tracks.some((track) => track.variableId) ? playhead : 0;
  const variableSource = useMemo(() => project.variables.map((variable) => previewMode && Object.hasOwn(runtimeVariables, variable.id) ? { ...variable, value: runtimeVariables[variable.id] } : variable), [previewMode, project.variables, runtimeVariables]);
  const resolvedVariables = useMemo(() => applyTimelineToVariables(variableSource, project.timeline, variableAnimationTime), [project.timeline, variableAnimationTime, variableSource]);

  const baseResolvedNodes = useMemo(() => {
    let nodes = project.nodes.map((source) => {
      const blueprint = source.instanceSourceId ? project.nodes.find((candidate) => candidate.id === source.instanceSourceId) : undefined;
      const synchronized: StudioNode = blueprint ? {
        ...deepClone(blueprint),
        id: source.id,
        parentId: source.parentId,
        childIds: source.childIds,
        name: source.name,
        componentId: source.componentId,
        instanceSourceId: source.instanceSourceId,
        instanceOverrides: source.instanceOverrides,
        responsive: source.responsive,
        transform: source.componentId ? source.transform : blueprint.transform,
      } : source;
      let node = resolveResponsiveNode(synchronized, project.canvas.device);
      node = mergeNodeOverride(node, activeVariant?.overrides[blueprint?.id ?? source.id]);
      node = mergeNodeOverride(node, activeVariant?.overrides[source.id]);
      Object.entries(node.bindings).forEach(([path, variableId]) => {
        const variable = resolvedVariables.find((candidate) => candidate.id === variableId);
        if (variable) node = genericSet(node, path, variable.value);
      });
      if (previewMode && runtimeNodePatches[source.id]) node = { ...node, ...runtimeNodePatches[source.id] };
      return node;
    });
    const resolvedMap = new Map(nodes.map((node) => [node.id, node]));
    nodes = nodes.map((node) => {
      if (!node.instanceSourceId) return node;
      let source = project.nodes.find((candidate) => candidate.id === node.id);
      let root: StudioNode | undefined;
      while (source) {
        if (source.componentId && source.instanceSourceId) {
          root = resolvedMap.get(source.id);
          break;
        }
        source = source.parentId ? project.nodes.find((candidate) => candidate.id === source!.parentId) : undefined;
      }
      if (!root?.componentId) return node;
      const definition = project.components.find((component) => component.id === root.componentId);
      if (!definition) return node;
      return definition.properties
        .filter((property) => property.targetNodeId === node.instanceSourceId && Object.hasOwn(root.instanceOverrides, property.id))
        .reduce((current, property) => genericSet(current, property.targetPath, root.instanceOverrides[property.id]), node);
    });
    return nodes;
  }, [activeVariant, previewMode, project.canvas.device, project.components, project.nodes, resolvedVariables, runtimeNodePatches]);
  const resolvedNodes = useMemo(() => activeVariantId === "base" ? applyTimelineToNodes(baseResolvedNodes, project.timeline, playhead) : baseResolvedNodes, [activeVariantId, baseResolvedNodes, playhead, project.timeline]);

  const resolvedNodeMap = useMemo(() => new Map(resolvedNodes.map((node) => [node.id, node])), [resolvedNodes]);
  const selected = selectedIds.length ? resolvedNodeMap.get(selectedIds[0]) : undefined;
  const exportContent = useMemo(() => {
    if (exportTab === "react") return generateReact(project);
    if (exportTab === "css") return generateCss(project);
    if (exportTab === "html") return generateHtml(project);
    if (exportTab === "svg") return generateSvg(project, selectedIds);
    if (exportTab === "ai") return generateAiPrompt(project);
    return JSON.stringify(project, null, 2);
  }, [exportTab, project, selectedIds]);

  const commit = useCallback((next: StudioDocument, history = true) => {
    if (JSON.stringify(next) === JSON.stringify(project)) return;
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    if (history) setPast((current) => [...current, project].slice(-100));
    setProject(stamped);
    if (history) setFuture([]);
  }, [project]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get("template");
    if (templateId && studioTemplates.some((template) => template.id === templateId)) {
      const document = instantiateTemplate(templateId);
      const timeout = window.setTimeout(() => {
        setProject(document);
        setSelectedIds([getRootNodes(document.nodes)[0]?.id].filter((id): id is string => Boolean(id)));
      }, 0);
      return () => window.clearTimeout(timeout);
    }
    try {
      const stored = window.localStorage.getItem("morphiq-studio-v5") ?? window.localStorage.getItem("morphiq-studio-v4");
      if (!stored) return;
      const normalized = normalizeStudioDocument(JSON.parse(stored));
      if (!normalized) return;
      const timeout = window.setTimeout(() => {
        setProject(normalized);
        setSelectedIds([normalized.nodes[0]?.id].filter((id): id is string => Boolean(id)));
      }, 0);
      return () => window.clearTimeout(timeout);
    } catch {
      try { window.localStorage.removeItem("morphiq-studio-v5"); } catch { /* Storage may be unavailable in privacy-restricted contexts. */ }
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let lastPaint = 0;
    const start = performance.now();
    const initial = playhead;
    const [workStart, workEnd] = project.timeline.workArea;
    const length = Math.max(0.001, workEnd - workStart);
    const direction = playbackDirection;
    const tick = (now: number) => {
      if (now - lastPaint < 1000 / project.timeline.fps) { frame = requestAnimationFrame(tick); return; }
      lastPaint = now;
      const elapsed = (now - start) / 1000 * project.timeline.speed;
      let value = direction === "reverse" ? initial - elapsed : initial + elapsed;
      if (direction === "alternate") {
        const relative = Math.max(0, initial - workStart) + elapsed;
        const cycle = Math.floor(relative / length);
        const phase = relative % length;
        value = cycle % 2 ? workEnd - phase : workStart + phase;
      } else if (value > workEnd || value < workStart) {
        if (project.timeline.loop) value = direction === "reverse" ? workEnd - ((workStart - value) % length) : workStart + ((value - workEnd) % length);
        else {
          setPlayhead(direction === "reverse" ? workStart : workEnd);
          setPlaying(false);
          return;
        }
      }
      setPlayhead(clamp(value, workStart, workEnd));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Playhead is intentionally captured as the start position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, playbackDirection, project.timeline.fps, project.timeline.loop, project.timeline.speed, project.timeline.workArea]);

  function undo() {
    const previous = past.at(-1);
    if (!previous) return;
    setPast((current) => current.slice(0, -1));
    setFuture((current) => [project, ...current].slice(0, 100));
    setProject(previous);
    setSelectedIds((current) => current.filter((id) => previous.nodes.some((node) => node.id === id)).slice(0, 1));
  }

  function redo() {
    const next = future[0];
    if (!next) return;
    setFuture((current) => current.slice(1));
    setPast((current) => [...current, project].slice(-100));
    setProject(next);
  }

  function applyNodeMutation(nodeId: string, patch: NodeOverride, property?: AnimatableProperty | AnimatableProperty[]) {
    const base = structuralNodeMap.get(nodeId);
    if (!base) return;
    const next = deepClone(project);
    let changedNode: StudioNode;
    if (activeVariantId === "base") {
      next.nodes = next.nodes.map((node) => node.id === nodeId ? mergeNodeOverride(node, patch) : node);
      changedNode = next.nodes.find((node) => node.id === nodeId)!;
    } else {
      next.variants = next.variants.map((variant) => variant.id === activeVariantId ? { ...variant, overrides: { ...variant.overrides, [nodeId]: mergeOverride(variant.overrides[nodeId], patch) } } : variant);
      changedNode = mergeNodeOverride(base, next.variants.find((variant) => variant.id === activeVariantId)?.overrides[nodeId]);
    }
    if (property && next.timeline.autoKey) {
      const properties = Array.isArray(property) ? property : [property];
      properties.forEach((path) => { next.timeline = upsertKeyframe(next.timeline, changedNode, path, playhead, getPathValue(changedNode, path)); });
    }
    commit(next);
  }

  function updateNode(patch: Partial<StudioNode>, property?: AnimatableProperty) {
    if (!selected) return;
    applyNodeMutation(selected.id, patch, property);
  }
  function updateTransform(patch: Partial<NodeTransform>, property?: AnimatableProperty) { if (selected) applyNodeMutation(selected.id, { transform: patch }, property); }
  function updateGeometry(patch: Partial<NodeGeometry>, property?: AnimatableProperty) { if (selected) applyNodeMutation(selected.id, { geometry: patch }, property); }
  function updateStyle(patch: Partial<NodeStyle>, property?: AnimatableProperty) { if (selected) applyNodeMutation(selected.id, { style: patch }, property); }
  function updateLayout(patch: Partial<NodeLayout>) { if (selected) applyNodeMutation(selected.id, { layout: patch }); }
  function updateAccessibility(patch: Partial<AccessibilitySettings>) { if (selected) applyNodeMutation(selected.id, { accessibility: { ...selected.accessibility, ...patch } } as Partial<StudioNode>); }
  function bindVariable(path: string, variableId: string) {
    if (!selected) return;
    const bindings = { ...selected.bindings };
    if (variableId) bindings[path] = variableId; else delete bindings[path];
    updateNode({ bindings });
  }

  function updateResponsive(device: Device, override: ResponsiveOverride | null) {
    if (!selected) return;
    const source = structuralNodeMap.get(selected.id)!;
    commit({ ...project, nodes: project.nodes.map((node) => node.id === selected.id ? { ...node, responsive: { ...source.responsive, [device]: override ?? {} } } : node) });
  }

  function selectLayer(id: string, additive = false, range = false) {
    if (previewMode) return;
    setSelectedIds((current) => {
      if (range && current.length) {
        const from = project.nodes.findIndex((node) => node.id === current.at(-1));
        const to = project.nodes.findIndex((node) => node.id === id);
        if (from >= 0 && to >= 0) return project.nodes.slice(Math.min(from, to), Math.max(from, to) + 1).map((node) => node.id);
      }
      if (!additive) return [id];
      return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    });
  }

  function addNode(kind: NodeKind, point?: Point, parentId?: string | null) {
    const node = createNode(kind);
    const parent = parentId === undefined && selectedIds.length === 1 && isContainer(structuralNodeMap.get(selectedIds[0])!) ? structuralNodeMap.get(selectedIds[0]) : parentId ? structuralNodeMap.get(parentId) : undefined;
    node.parentId = parent?.id ?? null;
    const bounds = parent?.transform ?? { width: project.canvas.width, height: project.canvas.height };
    node.transform.x = clamp((point?.x ?? bounds.width / 2) - node.transform.width / 2, 0, Math.max(0, bounds.width - node.transform.width));
    node.transform.y = clamp((point?.y ?? bounds.height / 2) - node.transform.height / 2, 0, Math.max(0, bounds.height - node.transform.height));
    let nodes = [...project.nodes, node];
    if (parent) nodes = updateParentChildren(nodes, parent.id, (ids) => [...ids, node.id]);
    commit({ ...project, nodes });
    setSelectedIds([node.id]);
    setActiveTool("select");
    setLeftTab("layers");
  }

  function deleteSelection() {
    if (!selectedIds.length) return;
    const ids = new Set(selectedIds.flatMap((id) => [id, ...getDescendantIds(project.nodes, id)]));
    project.nodes.forEach((node) => {
      if (node.instanceSourceId && ids.has(node.instanceSourceId)) [node.id, ...getDescendantIds(project.nodes, node.id)].forEach((id) => ids.add(id));
    });
    let nodes = project.nodes.filter((node) => !ids.has(node.id));
    nodes = nodes.map((node) => ({ ...node, childIds: node.childIds.filter((id) => !ids.has(id)) }));
    commit(cleanupRemovedNodeReferences(project, nodes, ids));
    setSelectedIds(nodes.length ? [nodes[0].id] : []);
  }

  function duplicateSelection() {
    if (!selectedIds.length) return;
    const roots = selectedIds.filter((id) => !selectedIds.some((candidate) => getDescendantIds(project.nodes, candidate).includes(id)));
    const allIds = roots.flatMap((id) => [id, ...getDescendantIds(project.nodes, id)]);
    const idMap = new Map(allIds.map((id) => [id, createId("clone")]));
    const instancedSources = new Map<string, ComponentDefinition>();
    roots.forEach((rootId) => {
      const definition = project.components.find((component) => component.rootNodeId === rootId);
      if (!definition) return;
      [rootId, ...getDescendantIds(project.nodes, rootId)].forEach((nodeId) => instancedSources.set(nodeId, definition));
    });
    const clones = project.nodes.filter((node) => allIds.includes(node.id)).map((node) => {
      const definition = instancedSources.get(node.id);
      const isInstanceRoot = definition?.rootNodeId === node.id;
      return {
        ...deepClone(node),
        id: idMap.get(node.id)!,
        name: isInstanceRoot ? `${definition.name} instance` : roots.includes(node.id) ? `${node.name} copy` : node.name,
        parentId: node.parentId && idMap.has(node.parentId) ? idMap.get(node.parentId)! : node.parentId,
        childIds: node.childIds.map((id) => idMap.get(id) ?? id),
        transform: roots.includes(node.id) ? { ...node.transform, x: node.transform.x + 24, y: node.transform.y + 24 } : node.transform,
        ...(definition ? { componentId: isInstanceRoot ? definition.id : undefined, instanceSourceId: node.id, instanceOverrides: isInstanceRoot ? Object.fromEntries(definition.properties.map((property) => [property.id, property.defaultValue])) : {} } : {}),
      };
    });
    let nodes = [...project.nodes, ...clones];
    clones.filter((node) => roots.map((id) => structuralNodeMap.get(id)?.parentId).includes(node.parentId)).forEach((clone) => {
      if (clone.parentId) nodes = updateParentChildren(nodes, clone.parentId, (ids) => [...ids, clone.id]);
    });
    const behaviorIds = new Set(allIds.filter((id) => !instancedSources.has(id)));
    const clonedTracks = project.timeline.tracks.filter((track) => behaviorIds.has(track.nodeId)).map((track) => ({ ...deepClone(track), id: createId("track"), nodeId: idMap.get(track.nodeId)!, keyframes: track.keyframes.map((frame) => ({ ...deepClone(frame), id: createId("keyframe") })) }));
    const interactions = [...project.interactions, ...project.interactions.filter((interaction) => behaviorIds.has(interaction.sourceNodeId)).map((interaction) => ({ ...deepClone(interaction), id: createId("interaction"), sourceNodeId: idMap.get(interaction.sourceNodeId)! }))];
    const variants = project.variants.map((variant) => ({
      ...variant,
      overrides: Object.entries(variant.overrides).reduce((overrides, [nodeId, nodeOverride]) => behaviorIds.has(nodeId) ? { ...overrides, [nodeId]: nodeOverride, [idMap.get(nodeId)!]: deepClone(nodeOverride) } : { ...overrides, [nodeId]: nodeOverride }, {} as SceneVariant["overrides"]),
    }));
    commit({ ...project, nodes, interactions, variants, timeline: { ...project.timeline, tracks: [...project.timeline.tracks, ...clonedTracks] } });
    setSelectedIds(roots.map((id) => idMap.get(id)!));
  }

  function groupSelection(kind: "group" | "boolean" = "group", operation: BooleanOperation = "union") {
    const result = groupNodesInDocument(project, selectedIds, kind, operation);
    if (!result) { setNotice(t("Select layers with the same parent to group them", "Selecciona capas con el mismo padre para agruparlas")); return; }
    commit(result.document);
    setSelectedIds([result.groupId]);
  }

  function ungroupSelection() {
    const groups = project.nodes.filter((node) => selectedIds.includes(node.id) && isContainer(node));
    if (!groups.length) return;
    let nodes = deepClone(project.nodes);
    const nextSelection: string[] = [];
    groups.forEach((group) => {
      const children = getNodeChildren(nodes, group.id);
      children.forEach((child) => {
        child.parentId = group.parentId;
        child.transform.x += group.transform.x;
        child.transform.y += group.transform.y;
        nextSelection.push(child.id);
      });
      if (group.parentId) nodes = updateParentChildren(nodes, group.parentId, (ids) => ids.flatMap((id) => id === group.id ? children.map((child) => child.id) : [id]));
      nodes = nodes.filter((node) => node.id !== group.id);
    });
    commit(cleanupRemovedNodeReferences(project, nodes, new Set(groups.map((group) => group.id))));
    setSelectedIds(nextSelection);
  }

  function maskSelection() {
    if (selectedIds.length < 2) { setNotice(t("Select a mask and at least one content layer", "Selecciona una máscara y al menos una capa de contenido")); return; }
    const mask = structuralNodeMap.get(selectedIds[0]);
    const result = groupNodesInDocument(project, selectedIds, "group");
    if (!mask || !result) return;
    const group = result.document.nodes.find((node) => node.id === result.groupId)!;
    let localPoints: Point[] = mask.geometry.clipPoints.length
      ? deepClone(mask.geometry.clipPoints)
      : mask.geometry.vectorPoints.map(({ x, y }) => ({ x, y }));
    if (!localPoints.length && (mask.kind === "ellipse" || mask.kind === "dial")) localPoints = Array.from({ length: 32 }, (_, index) => { const angle = index / 32 * Math.PI * 2; return { x: 50 + Math.cos(angle) * 50, y: 50 + Math.sin(angle) * 50 }; });
    if (!localPoints.length) localPoints = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }];
    const maskPoints = localPoints.map((point) => ({
      x: (mask.transform.x - group.transform.x + point.x / 100 * mask.transform.width) / Math.max(1, group.transform.width) * 100,
      y: (mask.transform.y - group.transform.y + point.y / 100 * mask.transform.height) / Math.max(1, group.transform.height) * 100,
    }));
    result.document.nodes = result.document.nodes.map((node) => node.id === result.groupId ? { ...node, name: "Mask group", geometry: { ...node.geometry, clipChildren: true, clipPoints: maskPoints, cornerRadii: [0, 0, 0, 0], mask: true } } : node.id === mask.id ? { ...node, visible: false } : node);
    commit(result.document);
    setSelectedIds([result.groupId]);
  }

  function reparentNode(draggedId: string, parentId: string | null) {
    const dragged = structuralNodeMap.get(draggedId);
    const parent = parentId ? structuralNodeMap.get(parentId) : undefined;
    if (!dragged || (parentId && !isContainer(parent)) || dragged.parentId === parentId || getDescendantIds(project.nodes, draggedId).includes(parentId ?? "")) return;
    const oldAbsolute = absolutePosition(project.nodes, draggedId);
    const parentAbsolute = parentId ? absolutePosition(project.nodes, parentId) : { x: 0, y: 0 };
    let nodes = deepClone(project.nodes);
    nodes = updateParentChildren(nodes, dragged.parentId, (ids) => ids.filter((id) => id !== draggedId));
    nodes = nodes.map((node) => node.id === draggedId ? { ...node, parentId, transform: { ...node.transform, x: oldAbsolute.x - parentAbsolute.x, y: oldAbsolute.y - parentAbsolute.y } } : node);
    if (parentId) nodes = updateParentChildren(nodes, parentId, (ids) => [...ids.filter((id) => id !== draggedId), draggedId]);
    commit({ ...project, nodes });
  }

  function alignSelection(position: "left" | "centerX" | "right" | "top" | "centerY" | "bottom") {
    if (!selectedIds.length) return;
    const selectedNodes = project.nodes.filter((node) => selectedIds.includes(node.id));
    const sameParent = selectedNodes.every((node) => node.parentId === selectedNodes[0].parentId);
    if (!sameParent) return;
    const parent = selectedNodes[0].parentId ? structuralNodeMap.get(selectedNodes[0].parentId) : null;
    const bounds = selectedNodes.length === 1 ? { x: 0, y: 0, width: parent?.transform.width ?? project.canvas.width, height: parent?.transform.height ?? project.canvas.height } : { x: Math.min(...selectedNodes.map((node) => node.transform.x)), y: Math.min(...selectedNodes.map((node) => node.transform.y)), width: Math.max(...selectedNodes.map((node) => node.transform.x + node.transform.width)) - Math.min(...selectedNodes.map((node) => node.transform.x)), height: Math.max(...selectedNodes.map((node) => node.transform.y + node.transform.height)) - Math.min(...selectedNodes.map((node) => node.transform.y)) };
    const nodes = project.nodes.map((node) => {
      if (!selectedIds.includes(node.id) || node.locked) return node;
      if (position === "left") return { ...node, transform: { ...node.transform, x: bounds.x } };
      if (position === "centerX") return { ...node, transform: { ...node.transform, x: bounds.x + (bounds.width - node.transform.width) / 2 } };
      if (position === "right") return { ...node, transform: { ...node.transform, x: bounds.x + bounds.width - node.transform.width } };
      if (position === "top") return { ...node, transform: { ...node.transform, y: bounds.y } };
      if (position === "centerY") return { ...node, transform: { ...node.transform, y: bounds.y + (bounds.height - node.transform.height) / 2 } };
      return { ...node, transform: { ...node.transform, y: bounds.y + bounds.height - node.transform.height } };
    });
    commit({ ...project, nodes });
  }

  function moveLayer(direction: -1 | 1) {
    if (!selected) return;
    const source = structuralNodeMap.get(selected.id)!;
    if (source.parentId) {
      const parent = structuralNodeMap.get(source.parentId)!;
      const index = parent.childIds.indexOf(source.id);
      const target = clamp(index + direction, 0, parent.childIds.length - 1);
      const childIds = [...parent.childIds];
      [childIds[index], childIds[target]] = [childIds[target], childIds[index]];
      commit({ ...project, nodes: project.nodes.map((node) => node.id === parent.id ? { ...node, childIds } : node) });
    } else {
      const roots = getRootNodes(project.nodes);
      const index = roots.findIndex((node) => node.id === source.id);
      const target = clamp(index + direction, 0, roots.length - 1);
      if (index === target) return;
      const order = new Map(roots.map((node, rootIndex) => [node.id, rootIndex]));
      order.set(roots[index].id, target); order.set(roots[target].id, index);
      commit({ ...project, nodes: [...project.nodes].sort((a, b) => (order.get(a.id) ?? project.nodes.indexOf(a) + 1000) - (order.get(b.id) ?? project.nodes.indexOf(b) + 1000)) });
    }
  }

  function loadTemplate(id: string) {
    const document = instantiateTemplate(id);
    setPast((current) => [...current, project].slice(-100));
    setProject(document);
    setFuture([]);
    setSelectedIds([getRootNodes(document.nodes)[0]?.id].filter(Boolean));
    setActiveVariantId("base");
    setPlayhead(0);
    setLeftTab("layers");
    window.history.replaceState(null, "", `${window.location.pathname}?template=${id}`);
    setNotice(t("Template loaded — every layer is editable", "Plantilla cargada: cada capa es editable"));
  }

  function createComponentFromSelection() {
    if (!selectedIds.length) return;
    let next = project;
    let rootId = selectedIds[0];
    if (selectedIds.length > 1) {
      const result = groupNodesInDocument(next, selectedIds, "group");
      if (!result) return;
      next = result.document;
      rootId = result.groupId;
    }
    const root = next.nodes.find((node) => node.id === rootId)!;
    const definition: ComponentDefinition = { id: createId("component"), name: root.name, rootNodeId: rootId, description: "Reusable Morphiq component", properties: [], variantIds: next.variants.map((variant) => variant.id) };
    next = { ...next, components: [...next.components, definition], nodes: next.nodes.map((node) => node.id === rootId ? { ...node, componentId: definition.id } : node) };
    commit(next);
    setSelectedIds([rootId]);
    setNotice(t("Reusable component created", "Componente reutilizable creado"));
  }

  function instantiateComponent(componentId: string) {
    const definition = project.components.find((component) => component.id === componentId);
    if (!definition) return;
    const ids = [definition.rootNodeId, ...getDescendantIds(project.nodes, definition.rootNodeId)];
    const idMap = new Map(ids.map((id) => [id, createId("instance") ]));
    const clones = project.nodes.filter((node) => ids.includes(node.id)).map((node) => ({
      ...deepClone(node),
      id: idMap.get(node.id)!,
      parentId: node.parentId && idMap.has(node.parentId) ? idMap.get(node.parentId)! : null,
      childIds: node.childIds.map((id) => idMap.get(id) ?? id),
      componentId: node.id === definition.rootNodeId ? definition.id : undefined,
      instanceSourceId: node.id,
      instanceOverrides: node.id === definition.rootNodeId ? Object.fromEntries(definition.properties.map((property) => [property.id, property.defaultValue])) : {},
      name: node.id === definition.rootNodeId ? `${definition.name} instance` : node.name,
      transform: node.id === definition.rootNodeId ? { ...node.transform, x: node.transform.x + 36, y: node.transform.y + 36 } : node.transform,
    }));
    commit({ ...project, nodes: [...project.nodes, ...clones] });
    setSelectedIds([idMap.get(definition.rootNodeId)!]);
  }

  function addComponentProperty(componentId: string, name: string, type: ComponentPropertyType, targetPath: string) {
    const value = selected ? getPathValue(selected, targetPath as AnimatableProperty) : "";
    commit({ ...project, components: project.components.map((component) => component.id === componentId ? { ...component, properties: [...component.properties, { id: createId("property"), name, type, targetNodeId: selected?.id ?? component.rootNodeId, targetPath, defaultValue: value, options: type === "enum" ? ["Default", "Alternative"] : [] }] } : component) });
  }

  function updateComponentDefinition(componentId: string, patch: Partial<ComponentDefinition>) {
    const current = project.components.find((component) => component.id === componentId);
    if (!current) return;
    const updated = { ...current, ...patch };
    const propertyIds = new Set(updated.properties.map((property) => property.id));
    commit({
      ...project,
      components: project.components.map((component) => component.id === componentId ? updated : component),
      nodes: project.nodes.map((node) => node.componentId === componentId ? {
        ...node,
        instanceOverrides: Object.fromEntries(Object.entries(node.instanceOverrides).filter(([propertyId]) => propertyIds.has(propertyId))),
      } : node),
    });
  }

  function addVariant(variant?: SceneVariant) {
    if (!variant) return;
    commit({ ...project, variants: [...project.variants, variant], components: project.components.map((component) => ({ ...component, variantIds: [...new Set([...component.variantIds, variant.id])] })) });
    setPlaying(false);
    setPlayhead(project.timeline.workArea[0]);
    setActiveVariantId(variant.id);
  }

  function deleteVariant(id: string) {
    commit({ ...project, variants: project.variants.filter((variant) => variant.id !== id), interactions: project.interactions.filter((interaction) => interaction.sourceVariantId !== id && interaction.targetVariantId !== id), components: project.components.map((component) => ({ ...component, variantIds: component.variantIds.filter((variantId) => variantId !== id) })) });
    if (activeVariantId === id) {
      setPlaying(false);
      setPlayhead(project.timeline.workArea[0]);
      setActiveVariantId("base");
    }
  }

  function deleteVariable(id: string) {
    commit({
      ...project,
      variables: project.variables.filter((variable) => variable.id !== id),
      nodes: project.nodes.map((node) => ({
        ...node,
        bindings: Object.fromEntries(Object.entries(node.bindings).filter(([, variableId]) => variableId !== id)),
      })),
      timeline: { ...project.timeline, tracks: project.timeline.tracks.filter((track) => track.variableId !== id) },
      interactions: project.interactions
        .filter((interaction) => !(interaction.action === "setVariable" && interaction.variableId === id))
        .map((interaction) => interaction.condition?.variableId === id ? { ...interaction, condition: undefined } : interaction),
    });
  }

  function conditionPasses(interaction: StudioInteraction) {
    if (!interaction.condition) return true;
    const variable = resolvedVariables.find((candidate) => candidate.id === interaction.condition!.variableId);
    if (!variable) return false;
    const { operator, value } = interaction.condition;
    if (operator === "equals") return variable.value === value;
    if (operator === "notEquals") return variable.value !== value;
    if (operator === "greater") return Number(variable.value) > Number(value);
    return Number(variable.value) < Number(value);
  }

  function runInteraction(interaction: StudioInteraction) {
    if (!conditionPasses(interaction)) return;
    setSmartTransition({ duration: interaction.transition === "instant" ? 0 : interaction.duration, easing: easingCss(interaction.easing), type: interaction.transition });
    const execute = () => {
      if (interaction.action === "changeVariant") { setPlaying(false); setPlayhead(project.timeline.workArea[0]); setActiveVariantId(interaction.targetVariantId ?? "base"); }
      if (interaction.action === "toggleVariant") { setPlaying(false); setPlayhead(project.timeline.workArea[0]); setActiveVariantId((current) => current === (interaction.targetVariantId ?? "base") ? "base" : interaction.targetVariantId ?? "base"); }
      if (interaction.action === "playTimeline") { setActiveVariantId("base"); setPlayhead(project.timeline.workArea[0]); setPlaying(true); }
      if (interaction.action === "pauseTimeline") setPlaying(false);
      if (interaction.action === "reverseTimeline") { setActiveVariantId("base"); setRuntimeDirection((current) => current === "reverse" ? "normal" : "reverse"); setPlayhead(project.timeline.workArea[1]); setPlaying(true); }
      if (interaction.action === "setVariable" && interaction.variableId) {
        if (interaction.trigger === "variable") suppressVariableReactionRef.current = true;
        setRuntimeVariables((current) => {
        const variables = project.variables.map((variable) => Object.hasOwn(current, variable.id) ? { ...variable, value: current[variable.id] } : variable);
        const target = variables.find((variable) => variable.id === interaction.variableId);
        return target ? { ...current, [target.id]: resolveExpression(interaction.value, target, variables) } : current;
        });
      }
      if (interaction.action === "openUrl" && interaction.url) openSafeUrl(interaction.url);
    };
    if (interaction.delay > 0) return window.setTimeout(execute, interaction.delay * 1000);
    execute();
    return undefined;
  }

  function triggerNode(nodeId: string, trigger: TriggerType) {
    if (!previewMode) return;
    const sourceId = structuralNodeMap.get(nodeId)?.instanceSourceId;
    project.interactions.filter((interaction) => (interaction.sourceNodeId === nodeId || interaction.sourceNodeId === sourceId) && interaction.sourceVariantId === activeVariantId && interaction.trigger === trigger).forEach(runInteraction);
  }

  useEffect(() => {
    if (!previewMode) return;
    const timers = project.interactions
      .filter((interaction) => interaction.sourceVariantId === activeVariantId && (interaction.trigger === "load" || interaction.trigger === "delay"))
      .map(runInteraction)
      .filter((timer): timer is number => typeof timer === "number");
    return () => timers.forEach((timer) => window.clearTimeout(timer));
    // Interactions are intentionally evaluated when preview state or variant changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewMode, activeVariantId]);

  useEffect(() => {
    const snapshot = JSON.stringify(runtimeVariables);
    const changed = variableSnapshotRef.current && variableSnapshotRef.current !== snapshot;
    variableSnapshotRef.current = snapshot;
    if (suppressVariableReactionRef.current) {
      suppressVariableReactionRef.current = false;
      return;
    }
    if (!previewMode || !changed) return;
    project.interactions.filter((interaction) => interaction.sourceVariantId === activeVariantId && interaction.trigger === "variable").forEach(runInteraction);
    // Variable-triggered actions intentionally run only after values change in preview.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeVariables, previewMode, activeVariantId]);

  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable) return;
      if (previewMode) {
        project.interactions.filter((interaction) => interaction.sourceVariantId === activeVariantId && interaction.trigger === "key" && interaction.key.toLowerCase() === event.key.toLowerCase()).forEach(runInteraction);
        if (event.key === "Escape") setPreviewMode(false);
        return;
      }
      const command = event.metaKey || event.ctrlKey;
      if (command && event.key.toLowerCase() === "z") { event.preventDefault(); if (event.shiftKey) redo(); else undo(); }
      if (command && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); }
      if (command && event.key.toLowerCase() === "d") { event.preventDefault(); duplicateSelection(); }
      if (command && event.key.toLowerCase() === "g") { event.preventDefault(); groupSelection(); }
      if (command && event.key.toLowerCase() === "s") { event.preventDefault(); saveProject(); }
      if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); deleteSelection(); }
      if (event.key === "Escape") { setSelectedIds([]); setPenPoints([]); setActiveTool("select"); }
      if (event.key === "Enter" && activeTool === "pen") finishPenPath();
      if (event.key.toLowerCase() === "v") setActiveTool("select");
      if (event.key.toLowerCase() === "f") setActiveTool("frame");
      if (event.key.toLowerCase() === "r") setActiveTool("rectangle");
      if (event.key.toLowerCase() === "o") setActiveTool("ellipse");
      if (event.key.toLowerCase() === "p") setActiveTool("pen");
      if (event.key.toLowerCase() === "t") setActiveTool("text");
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) && selectedIds.length) {
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
        commit({ ...project, nodes: project.nodes.map((node) => selectedIds.includes(node.id) && !node.locked ? { ...node, transform: { ...node.transform, x: node.transform.x + dx, y: node.transform.y + dy } } : node) });
      }
    }
    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
    // Keyboard handlers always use the latest render state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool, activeVariantId, previewMode, project, selectedIds]);

  function saveProject() {
    try {
      window.localStorage.setItem("morphiq-studio-v5", JSON.stringify(project));
      setNotice(t("Project saved locally", "Proyecto guardado localmente"));
    } catch {
      setNotice(t("Local storage is full — export the project JSON instead", "El almacenamiento local está lleno: exporta el proyecto como JSON"));
    }
  }

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportContent);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setNotice(t("Clipboard access was denied — download the file instead", "Se negó el acceso al portapapeles: descarga el archivo"));
    }
  }

  async function importProject(file: File | undefined) {
    if (!file) return;
    try {
      const normalized = normalizeStudioDocument(JSON.parse(await file.text()));
      if (!normalized) throw new Error("Invalid Morphiq project");
      setPast((current) => [...current, project].slice(-100));
      setProject(normalized);
      setFuture([]);
      setSelectedIds([normalized.nodes[0]?.id].filter(Boolean));
      setNotice(t("Project imported", "Proyecto importado"));
    } catch {
      setNotice(t("This file is not a valid Morphiq project", "Este archivo no es un proyecto Morphiq válido"));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function addImage(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const node = createNode("image");
      node.name = file.name;
      node.transform.x = project.canvas.width / 2 - node.transform.width / 2;
      node.transform.y = project.canvas.height / 2 - node.transform.height / 2;
      node.style.fills[0].type = "image";
      node.style.fills[0].imageUrl = String(reader.result ?? "");
      node.style.fills[0].imageMode = "fill";
      commit({ ...project, nodes: [...project.nodes, node] });
      setSelectedIds([node.id]);
    };
    reader.readAsDataURL(file);
  }

  function canvasPoint(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / (zoom / 100), y: (event.clientY - rect.top) / (zoom / 100) };
  }

  function handleCanvasPointer(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("[data-node-id]")) return;
    const point = canvasPoint(event);
    if (activeTool === "pen") {
      setPenPoints((current) => [...current, point]);
      return;
    }
    const kind = toolToKind[activeTool];
    if (kind) { addNode(kind, point, null); return; }
    setSelectedIds([]);
  }

  function finishPenPath() {
    if (penPoints.length < 2) { setPenPoints([]); setActiveTool("select"); return; }
    const minX = Math.min(...penPoints.map((point) => point.x));
    const minY = Math.min(...penPoints.map((point) => point.y));
    const maxX = Math.max(...penPoints.map((point) => point.x));
    const maxY = Math.max(...penPoints.map((point) => point.y));
    const width = Math.max(20, maxX - minX);
    const height = Math.max(20, maxY - minY);
    const node = createNode("vector");
    node.transform = { ...node.transform, x: minX, y: minY, width, height };
    node.geometry.vectorPoints = penPoints.map((point) => ({ id: createId("point"), x: (point.x - minX) / width * 100, y: (point.y - minY) / height * 100 }));
    node.geometry.closed = penPoints.length > 2;
    commit({ ...project, nodes: [...project.nodes, node] });
    setSelectedIds([node.id]);
    setPenPoints([]);
    setActiveTool("select");
    setVectorEditMode(true);
  }

  function switchDevice(device: Device) {
    const size = deviceSizes[device];
    commit({ ...project, canvas: { ...project.canvas, device, width: size.width, height: size.height } });
  }

  function snapValue(value: number) {
    return project.canvas.snap ? Math.round(value / project.canvas.gridSize) * project.canvas.gridSize : value;
  }

  function changeNodeFromPreview(nodeId: string, patch: Partial<StudioNode>) {
    if (!previewMode) { applyNodeMutation(nodeId, patch); return; }
    const node = resolvedNodeMap.get(nodeId);
    if (!node) return;
    const localPatch = { ...patch };
    (["value", "checked"] as const).forEach((key) => {
      const variableId = node.bindings[key];
      const value = patch[key];
      if (!variableId || (typeof value !== "number" && typeof value !== "boolean")) return;
      setRuntimeVariables((current) => ({ ...current, [variableId]: value }));
      delete localPatch[key];
    });
    if (Object.keys(localPatch).length) setRuntimeNodePatches((current) => ({ ...current, [nodeId]: { ...current[nodeId], ...localPatch } }));
  }

  function renderSceneNode(source: StudioNode, parentSource?: StudioNode): React.ReactNode {
    const resolved = resolvedNodeMap.get(source.id);
    if (!resolved || !resolved.visible) return null;
    const parentResolved = parentSource ? resolvedNodeMap.get(parentSource.id) : undefined;
    let node = resolved;
    if (parentResolved && node.layout.position === "absolute") {
      const transform = { ...node.transform };
      const baseParentWidth = Math.max(1, parentSource?.transform.width ?? parentResolved.transform.width);
      const baseParentHeight = Math.max(1, parentSource?.transform.height ?? parentResolved.transform.height);
      const right = baseParentWidth - source.transform.x - source.transform.width;
      const bottom = baseParentHeight - source.transform.y - source.transform.height;
      if (node.layout.horizontalConstraint === "center") transform.x = parentResolved.transform.width / 2 + (source.transform.x + source.transform.width / 2 - baseParentWidth / 2) - transform.width / 2;
      if (node.layout.horizontalConstraint === "end") transform.x = parentResolved.transform.width - right - transform.width;
      if (node.layout.horizontalConstraint === "stretch") { transform.x = source.transform.x; transform.width = Math.max(node.layout.minWidth || 1, parentResolved.transform.width - source.transform.x - right); }
      if (node.layout.horizontalConstraint === "scale") { transform.x = source.transform.x / baseParentWidth * parentResolved.transform.width; transform.width = source.transform.width / baseParentWidth * parentResolved.transform.width; }
      if (node.layout.verticalConstraint === "center") transform.y = parentResolved.transform.height / 2 + (source.transform.y + source.transform.height / 2 - baseParentHeight / 2) - transform.height / 2;
      if (node.layout.verticalConstraint === "end") transform.y = parentResolved.transform.height - bottom - transform.height;
      if (node.layout.verticalConstraint === "stretch") { transform.y = source.transform.y; transform.height = Math.max(node.layout.minHeight || 1, parentResolved.transform.height - source.transform.y - bottom); }
      if (node.layout.verticalConstraint === "scale") { transform.y = source.transform.y / baseParentHeight * parentResolved.transform.height; transform.height = source.transform.height / baseParentHeight * parentResolved.transform.height; }
      node = { ...node, transform };
    }
    const children = source.childIds.map((id) => structuralNodeMap.get(id)).filter((child): child is StudioNode => Boolean(child));
    const relative = (parentResolved?.layout.mode ?? "free") !== "free" && node.layout.position === "relative";
    const preview = <StudioNodePreview
      locale={locale}
      node={node}
      operandNodes={node.kind === "boolean" ? children.map((child) => resolvedNodeMap.get(child.id)).filter((child): child is StudioNode => Boolean(child)) : undefined}
      onChange={(patch) => changeNodeFromPreview(node.id, patch)}
      onSelect={(event) => selectLayer(node.id, "metaKey" in event && (event.metaKey || event.ctrlKey), "shiftKey" in event && event.shiftKey)}
      onTrigger={(trigger) => triggerNode(node.id, trigger)}
      onVectorPointChange={(index, point) => { const vectorPoints = node.geometry.vectorPoints.map((item, itemIndex) => itemIndex === index ? { ...item, ...point } : item); applyNodeMutation(node.id, { geometry: { vectorPoints } }, [`geometry.vectorPoints.${index}.x`, `geometry.vectorPoints.${index}.y`]); }}
      onVectorHandleChange={(index, handle, point) => { const vectorPoints = node.geometry.vectorPoints.map((item, itemIndex) => itemIndex === index ? { ...item, [handle]: point, corner: false } : item); applyNodeMutation(node.id, { geometry: { vectorPoints } }); }}
      onClipPointChange={(index, point) => { const clipPoints = node.geometry.clipPoints.map((item, itemIndex) => itemIndex === index ? point : item); applyNodeMutation(node.id, { geometry: { clipPoints } }, [`geometry.clipPoints.${index}.x`, `geometry.clipPoints.${index}.y`]); }}
      onPivotChange={(point) => applyNodeMutation(node.id, { transform: { pivotX: point.x, pivotY: point.y } }, ["transform.pivotX", "transform.pivotY"])}
      previewMode={previewMode}
      selected={selectedIds.includes(node.id)}
      smartDuration={smartTransition.duration}
      smartEasing={smartTransition.easing}
      transitionType={smartTransition.type}
      vectorEditMode={vectorEditMode}
    >{node.kind === "boolean" ? null : children.map((child) => renderSceneNode(child, source))}</StudioNodePreview>;
    if (relative) {
      const style: CSSProperties = {
        width: node.layout.horizontalSizing === "fill" ? "100%" : node.layout.horizontalSizing === "hug" ? "fit-content" : node.transform.width,
        height: node.layout.verticalSizing === "fill" ? "100%" : node.layout.verticalSizing === "hug" ? "fit-content" : node.transform.height,
        minWidth: node.layout.minWidth || undefined,
        maxWidth: node.layout.maxWidth || undefined,
        minHeight: node.layout.minHeight || undefined,
        maxHeight: node.layout.maxHeight || undefined,
        flex: node.layout.horizontalSizing === "fill" ? "1 1 0" : undefined,
        position: "relative",
        transition: previewMode
          ? smartTransition.type === "instant"
            ? "none"
            : smartTransition.type === "dissolve"
              ? `opacity ${smartTransition.duration}s ${smartTransition.easing}`
              : `width ${smartTransition.duration}s ${smartTransition.easing}, height ${smartTransition.duration}s ${smartTransition.easing}, flex-basis ${smartTransition.duration}s ${smartTransition.easing}`
          : undefined,
      };
      return <div aria-label={!previewMode ? `${t("Select", "Seleccionar")} ${node.name}` : undefined} className="v5-relative-node-wrap" data-node-wrap={node.id} key={node.id} onKeyDown={!previewMode ? (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectLayer(node.id, event.metaKey || event.ctrlKey, event.shiftKey); } } : undefined} onPointerDown={!previewMode ? (event) => { event.stopPropagation(); selectLayer(node.id, event.metaKey || event.ctrlKey, event.shiftKey); } : undefined} role={!previewMode ? "button" : undefined} style={style} tabIndex={!previewMode ? 0 : -1}>{preview}</div>;
    }
    return <Rnd
      bounds="parent"
      className="v5-rnd-node"
      disableDragging={previewMode || node.locked || vectorEditMode}
      enableResizing={!previewMode && !node.locked && selectedIds.includes(node.id) && !vectorEditMode}
      key={node.id}
      minHeight={Math.max(1, node.layout.minHeight)}
      minWidth={Math.max(1, node.layout.minWidth)}
      onDragStart={(event) => { event.stopPropagation(); selectLayer(node.id, event.metaKey || event.ctrlKey, event.shiftKey); }}
      onDragStop={(_, data) => applyNodeMutation(node.id, { transform: { x: snapValue(data.x), y: snapValue(data.y) } }, ["transform.x", "transform.y"])}
      onResizeStart={(event) => { event.stopPropagation(); selectLayer(node.id); }}
      onResizeStop={(_, __, ref, ___, position) => applyNodeMutation(node.id, { transform: { x: snapValue(position.x), y: snapValue(position.y), width: snapValue(ref.offsetWidth), height: snapValue(ref.offsetHeight) } }, ["transform.x", "transform.y", "transform.width", "transform.height"])}
      position={{ x: node.transform.x, y: node.transform.y }}
      resizeGrid={project.canvas.snap ? [project.canvas.gridSize, project.canvas.gridSize] : undefined}
      size={{ width: node.transform.width, height: node.transform.height }}
      style={{
        zIndex: project.nodes.indexOf(source) + 1,
        perspective: node.transform.perspective,
        transition: previewMode
          ? smartTransition.type === "instant"
            ? "none"
            : smartTransition.type === "dissolve"
              ? `opacity ${smartTransition.duration}s ${smartTransition.easing}`
              : `transform ${smartTransition.duration}s ${smartTransition.easing}, width ${smartTransition.duration}s ${smartTransition.easing}, height ${smartTransition.duration}s ${smartTransition.easing}`
          : undefined,
      }}
    >{preview}</Rnd>;
  }

  const roots = getRootNodes(project.nodes);
  const filteredPrimitives = [...primitiveTools, ...uiPrimitives].map((item) => ({ ...item, displayLabel: locale === "es" ? primitiveLabelsEs[item.kind] ?? item.label : item.label })).filter((item) => item.displayLabel.toLowerCase().includes(search.toLowerCase()));

  return <main className={`morphiq-studio-v5 ${previewMode ? "v5-preview-mode" : ""} ${timelineOpen ? "v5-timeline-visible" : ""}`}>
    <header className="v5-topbar">
      <div className="v5-topbar-brand"><Link aria-label={t("Back to Morphiq UI", "Volver a Morphiq UI")} href="/"><ArrowLeft size={13} /></Link><div><span>Morphiq UI</span><b>Studio v5</b></div><i className="mh97-signature">MH97</i></div>
      <div className="v5-document-controls"><input aria-label={t("Project name", "Nombre del proyecto")} onChange={(event) => commit({ ...project, name: event.target.value })} value={project.name} /><span>{project.nodes.length} {t("layers", "capas")}</span></div>
      <div className="v5-history-controls"><button aria-label={t("Undo", "Deshacer")} disabled={!past.length} onClick={undo} type="button"><Undo2 size={13} /></button><button aria-label={t("Redo", "Rehacer")} disabled={!future.length} onClick={redo} type="button"><Redo2 size={13} /></button><button onClick={saveProject} type="button"><Save size={12} /> {t("Save", "Guardar")}</button><button onClick={() => fileInputRef.current?.click()} type="button"><Import size={12} /> {t("Import", "Importar")}</button><input accept="application/json,.json" hidden onChange={(event) => void importProject(event.target.files?.[0])} ref={fileInputRef} type="file" /></div>
      <div className="v5-mode-controls"><button aria-pressed={previewMode} className={previewMode ? "active" : ""} onClick={() => {
        const next = !previewMode;
        const values = Object.fromEntries(project.variables.map((variable) => [variable.id, variable.value]));
        setRuntimeVariables(next ? values : {});
        setRuntimeNodePatches({});
        setRuntimeDirection(next ? project.timeline.direction : null);
        variableSnapshotRef.current = JSON.stringify(next ? values : {});
        setPreviewMode(next);
      }} type="button"><Play size={12} /> {previewMode ? t("Exit preview", "Salir de vista previa") : t("Preview", "Vista previa")}</button><button onClick={() => setShowExport(true)} type="button"><Code2 size={12} /> {t("Export", "Exportar")}</button></div>
    </header>

    <nav className="v5-toolstrip" aria-label={t("Creation tools", "Herramientas de creación")}>
      <div>{toolbarTools.map(({ tool, label, icon: Icon }) => { const displayLabel = locale === "es" ? toolLabelsEs[tool] ?? label : label; return <button aria-label={displayLabel} aria-pressed={activeTool === tool} key={tool} onClick={() => { if (activeTool === "pen" && penPoints.length) finishPenPath(); setActiveTool(tool); }} title={displayLabel} type="button"><Icon size={14} /><kbd>{tool === "select" ? "V" : tool === "frame" ? "F" : tool === "rectangle" ? "R" : tool === "ellipse" ? "O" : tool === "pen" ? "P" : tool === "text" ? "T" : ""}</kbd></button>; })}</div>
      <span />
      <div className="v5-boolean-tools">{(["union", "subtract", "intersect", "exclude"] as BooleanOperation[]).map((operation) => { const label = locale === "es" ? ({ union: "Unir", subtract: "Restar", intersect: "Intersectar", exclude: "Excluir" } as const)[operation] : operation; return <button aria-label={label} disabled={selectedIds.length < 2} key={operation} onClick={() => groupSelection("boolean", operation)} title={label} type="button"><Shapes size={13} /><small>{operation[0].toUpperCase()}</small></button>; })}<button aria-label={t("Create mask", "Crear máscara")} disabled={selectedIds.length < 2} onClick={maskSelection} title={t("Mask", "Máscara")} type="button"><Eye size={13} /></button></div>
      <span />
      <div><button aria-label={t("Group", "Agrupar")} disabled={selectedIds.length < 2} onClick={() => groupSelection()} type="button"><Group size={13} /></button><button aria-label={t("Ungroup", "Desagrupar")} disabled={!selectedIds.some((id) => { const node = structuralNodeMap.get(id); return node ? isContainer(node) : false; })} onClick={ungroupSelection} type="button"><Ungroup size={13} /></button><button aria-label={t("Duplicate", "Duplicar")} disabled={!selectedIds.length} onClick={duplicateSelection} type="button"><Copy size={13} /></button><button aria-label={t("Delete", "Eliminar")} disabled={!selectedIds.length} onClick={deleteSelection} type="button"><Trash2 size={13} /></button></div>
    </nav>

    <section className="v5-editor-grid">
      <aside className="v5-left-panel">
        <div className="v5-panel-tabs" role="tablist">{(["add", "layers", "components"] as LeftTab[]).map((tab) => <button aria-selected={leftTab === tab} key={tab} onClick={() => setLeftTab(tab)} role="tab" type="button">{tab === "add" ? <Plus size={12} /> : tab === "layers" ? <Layers3 size={12} /> : <Component size={12} />}<span>{tab === "add" ? t("Add", "Agregar") : tab === "layers" ? t("Layers", "Capas") : t("Components", "Componentes")}</span></button>)}</div>
        {(leftTab === "add" || leftTab === "layers") && <label className="v5-panel-search"><Search size={11} /><input onChange={(event) => setSearch(event.target.value)} placeholder={leftTab === "layers" ? t("Search layers", "Buscar capas") : t("Search assets", "Buscar recursos")} value={search} /></label>}
        {leftTab === "add" && <div className="v5-left-scroll">
          <PanelLabel>{t("Primitives", "Primitivas")}</PanelLabel><div className="v5-asset-grid">{filteredPrimitives.map(({ kind, displayLabel, icon: Icon }) => <button key={kind} onClick={() => addNode(kind)} type="button"><Icon size={17} /><span>{displayLabel}</span></button>)}</div>
          <div className="v5-upload-row"><button onClick={() => imageInputRef.current?.click()} type="button"><Upload size={12} /> {t("Upload image", "Subir imagen")}</button><input accept="image/*" hidden onChange={(event) => addImage(event.target.files?.[0])} ref={imageInputRef} type="file" /></div>
          <PanelLabel>{t("Editable templates", "Plantillas editables")}</PanelLabel><div className="v5-template-list">{studioTemplates.map((template) => <button key={template.id} onClick={() => loadTemplate(template.id)} type="button"><i className={`v5-template-thumb v5-template-${template.family}`}><Sparkles size={13} /></i><span><b>{locale === "es" ? template.nameEs : template.name}</b><small>{locale === "es" ? template.descriptionEs : template.description}</small></span><ArrowLeft size={11} /></button>)}</div>
        </div>}
        {leftTab === "layers" && <><StudioLayerTree locale={locale} nodes={project.nodes} onRename={(id, name) => commit({ ...project, nodes: project.nodes.map((node) => node.id === id ? { ...node, name } : node) })} onReparent={reparentNode} onSelect={selectLayer} onToggleExpanded={(id) => commit({ ...project, nodes: project.nodes.map((node) => node.id === id ? { ...node, expanded: !node.expanded } : node) })} onToggleLocked={(id) => commit({ ...project, nodes: project.nodes.map((node) => node.id === id ? { ...node, locked: !node.locked } : node) })} onToggleVisible={(id) => commit({ ...project, nodes: project.nodes.map((node) => node.id === id ? { ...node, visible: !node.visible } : node) })} search={search} selectedIds={selectedIds} /><div className="v5-layer-footer"><button aria-label={t("Move backward", "Enviar atrás")} disabled={!selected} onClick={() => moveLayer(-1)} type="button"><SendToBack size={12} /></button><button aria-label={t("Move forward", "Traer adelante")} disabled={!selected} onClick={() => moveLayer(1)} type="button"><BringToFront size={12} /></button><button disabled={selectedIds.length < 2} onClick={() => groupSelection()} type="button"><Group size={11} /> {t("Group", "Agrupar")}</button></div></>}
        {leftTab === "components" && <div className="v5-left-scroll"><PanelLabel>{t("Local components", "Componentes locales")}</PanelLabel>{project.components.length ? <div className="v5-local-components">{project.components.map((component) => <button key={component.id} onClick={() => instantiateComponent(component.id)} type="button"><Component size={15} /><span><b>{component.name}</b><small>{component.properties.length} {t("props", "props")} · {component.variantIds.length} {t("variants", "variantes")}</small></span><Plus size={11} /></button>)}</div> : <div className="v5-empty-component"><Component size={20} /><p>{t("Select one or more layers and create a reusable component from the right panel.", "Selecciona una o más capas y crea un componente reutilizable desde el panel derecho.")}</p></div>}</div>}
      </aside>

      <section className="v5-workspace">
        <div className="v5-canvas-toolbar">
          <div className="v5-device-switch">{(["desktop", "tablet", "mobile"] as Device[]).map((device) => { const Icon = device === "desktop" ? Monitor : device === "tablet" ? Tablet : Smartphone; const label = locale === "es" ? ({ desktop: "Escritorio", tablet: "Tablet", mobile: "Móvil" } as const)[device] : device; return <button aria-label={label} aria-pressed={project.canvas.device === device} key={device} onClick={() => switchDevice(device)} type="button"><Icon size={12} /></button>; })}<span>{project.canvas.width} × {project.canvas.height}</span></div>
          <div className="v5-align-tools">{[{ icon: AlignStartHorizontal, value: "left", es: "Alinear izquierda" }, { icon: AlignCenterHorizontal, value: "centerX", es: "Centrar horizontal" }, { icon: AlignEndHorizontal, value: "right", es: "Alinear derecha" }, { icon: AlignStartVertical, value: "top", es: "Alinear arriba" }, { icon: AlignCenterVertical, value: "centerY", es: "Centrar vertical" }, { icon: AlignEndVertical, value: "bottom", es: "Alinear abajo" }].map(({ icon: Icon, value, es }) => <button aria-label={locale === "es" ? es : value} disabled={!selectedIds.length} key={value} onClick={() => alignSelection(value as Parameters<typeof alignSelection>[0])} type="button"><Icon size={12} /></button>)}</div>
          <div className="v5-canvas-options"><button aria-pressed={project.canvas.showGrid} onClick={() => commit({ ...project, canvas: { ...project.canvas, showGrid: !project.canvas.showGrid } })} type="button">{t("Grid", "Cuadrícula")}</button><button aria-pressed={project.canvas.showRulers} onClick={() => commit({ ...project, canvas: { ...project.canvas, showRulers: !project.canvas.showRulers } })} type="button">{t("Rulers", "Reglas")}</button><button aria-pressed={project.canvas.showGuides} onClick={() => commit({ ...project, canvas: { ...project.canvas, showGuides: !project.canvas.showGuides } })} type="button">{t("Guides", "Guías")}</button><button aria-pressed={project.canvas.snap} onClick={() => commit({ ...project, canvas: { ...project.canvas, snap: !project.canvas.snap } })} type="button">{t("Snap", "Ajustar")}</button></div>
          <div className="v5-zoom"><button onClick={() => setZoom((value) => Math.max(25, value - 10))} type="button">−</button><span>{zoom}%</span><button onClick={() => setZoom((value) => Math.min(180, value + 10))} type="button">+</button></div>
        </div>
        <div className="v5-canvas-scroller">
          <div className="v5-artboard-wrap" style={{ width: project.canvas.width * zoom / 100, height: project.canvas.height * zoom / 100 }}>
            {project.canvas.showRulers && <><div className="v5-ruler v5-ruler-x">{Array.from({ length: Math.ceil(project.canvas.width / 100) }, (_, index) => <span key={index} style={{ left: index * 100 }}>{index * 100}</span>)}</div><div className="v5-ruler v5-ruler-y">{Array.from({ length: Math.ceil(project.canvas.height / 100) }, (_, index) => <span key={index} style={{ top: index * 100 }}>{index * 100}</span>)}</div></>}
            <div className={`v5-artboard ${project.canvas.showGrid ? "grid" : ""}`} onDoubleClick={() => { if (activeTool === "pen") finishPenPath(); }} onPointerDown={handleCanvasPointer} style={{ width: project.canvas.width, height: project.canvas.height, backgroundColor: project.canvas.color, backgroundSize: `${project.canvas.gridSize}px ${project.canvas.gridSize}px`, transform: `scale(${zoom / 100})` }}>
              {roots.map((node) => renderSceneNode(node))}
              {project.canvas.showGuides && <><i aria-hidden="true" className="v5-canvas-guide v5-canvas-guide-x" /><i aria-hidden="true" className="v5-canvas-guide v5-canvas-guide-y" /></>}
              {penPoints.length > 0 && <svg className="v5-pen-draft" height={project.canvas.height} viewBox={`0 0 ${project.canvas.width} ${project.canvas.height}`} width={project.canvas.width}><polyline fill="none" points={penPoints.map((point) => `${point.x},${point.y}`).join(" ")} stroke="#7359df" strokeWidth="2" />{penPoints.map((point, index) => <circle cx={point.x} cy={point.y} fill="#7359df" key={index} r="4" stroke="white" strokeWidth="2" />)}</svg>}
              {!project.nodes.length && <div className="v5-canvas-empty"><PenTool size={24} /><b>{t("Start from a shape or the Pen tool", "Empieza con una forma o la herramienta Pluma")}</b><span>{t("Every object becomes an editable, animatable layer.", "Cada objeto se convierte en una capa editable y animable.")}</span></div>}
            </div>
          </div>
        </div>
      </section>

      <aside className="v5-right-panel">
        <div className="v5-selection-title">{selected ? <><div><b>{selected.name}</b><span>{locale === "es" ? primitiveLabelsEs[selected.kind] ?? selected.kind : selected.kind} · {activeVariantId === "base" ? "Base" : project.variants.find((variant) => variant.id === activeVariantId)?.name}</span></div><button aria-label={selected.locked ? t("Unlock", "Desbloquear") : t("Lock", "Bloquear")} onClick={() => commit({ ...project, nodes: project.nodes.map((node) => node.id === selected.id ? { ...node, locked: !node.locked } : node) })} type="button"><Lock size={11} /></button></> : <span>{t("No selection", "Sin selección")}</span>}</div>
        <div className="v5-inspector-tabs" role="tablist">{(["design", "material", "layout", "component", "interactions", "accessibility"] as InspectorTab[]).map((tab) => { const label = locale === "es" ? ({ design: "Diseño", material: "Material", layout: "Layout", component: "Componente", interactions: "Interacciones", accessibility: "Accesibilidad" } as Record<InspectorTab, string>)[tab] : tab; return <button aria-label={label} aria-selected={inspectorTab === tab} key={tab} onClick={() => setInspectorTab(tab)} role="tab" title={label} type="button">{tab === "design" ? <Maximize2 size={12} /> : tab === "material" ? <WandSparkles size={12} /> : tab === "layout" ? <Frame size={12} /> : tab === "component" ? <Component size={12} /> : tab === "interactions" ? <Play size={12} /> : <Check size={12} />}<span>{label}</span></button>; })}</div>
        <div className="v5-inspector-scroll">{selected ? <StudioInspector
          activeVariantId={activeVariantId}
          device={project.canvas.device}
          document={project}
          locale={locale}
          node={selected}
          onAccessibility={updateAccessibility}
          onAddComponentProperty={addComponentProperty}
          onAddInteraction={(interaction) => commit({ ...project, interactions: [...project.interactions, interaction] })}
          onAddVariable={(variable) => commit({ ...project, variables: [...project.variables, variable] })}
          onBindVariable={bindVariable}
          onComponentDefinition={updateComponentDefinition}
          onCreateComponent={createComponentFromSelection}
          onDeleteInteraction={(id) => commit({ ...project, interactions: project.interactions.filter((interaction) => interaction.id !== id) })}
          onDeleteVariable={deleteVariable}
          onDeleteVariant={deleteVariant}
          onGeometry={updateGeometry}
          onInstanceOverrides={(rootNodeId, instanceOverrides) => commit({ ...project, nodes: project.nodes.map((node) => node.id === rootNodeId ? { ...node, instanceOverrides } : node) })}
          onInteraction={(id, patch) => commit({ ...project, interactions: project.interactions.map((interaction) => interaction.id === id ? { ...interaction, ...patch } : interaction) })}
          onLayout={updateLayout}
          onNode={updateNode}
          onResponsive={updateResponsive}
          onSetVariant={(id) => { setPlaying(false); setPlayhead(project.timeline.workArea[0]); setActiveVariantId(id); }}
          onStyle={updateStyle}
          onSurface={(node) => applyNodeMutation(node.id, { surface: node.surface, geometry: node.geometry, style: node.style })}
          onToggleVectorEdit={() => setVectorEditMode((value) => !value)}
          onTransform={updateTransform}
          onUpsertVariant={addVariant}
          onVariable={(id, patch) => commit({ ...project, variables: project.variables.map((variable) => variable.id === id ? { ...variable, ...patch } : variable) })}
          tab={inspectorTab}
          vectorEditMode={vectorEditMode}
        /> : <div className="v5-no-selection"><MousePointer2 size={22} /><p>{t("Select a layer to edit its geometry, material, layout and behavior.", "Selecciona una capa para editar su geometría, material, layout y comportamiento.")}</p></div>}</div>
      </aside>
    </section>

    <button aria-label={timelineOpen ? t("Hide timeline", "Ocultar línea de tiempo") : t("Show timeline", "Mostrar línea de tiempo")} className="v5-timeline-toggle" onClick={() => setTimelineOpen((value) => !value)} type="button">{timelineOpen ? <PanelBottomClose size={13} /> : <PanelBottomOpen size={13} />}<span>{t("Timeline", "Línea de tiempo")}</span></button>
    {timelineOpen && <StudioTimelinePanel locale={locale} nodes={resolvedNodes} onPlayhead={(value) => { setActiveVariantId("base"); setPlayhead(value); }} onPlaying={(value) => { if (value) setActiveVariantId("base"); setPlaying(value); }} onSelectKeyframes={setSelectedKeyframeIds} onSelectNode={(id) => setSelectedIds([id])} onTimeline={(timeline) => commit({ ...project, timeline })} playhead={playhead} playing={playing} selectedKeyframeIds={selectedKeyframeIds} selectedNodeIds={selectedIds} timeline={project.timeline} variables={resolvedVariables} />}

    {showExport && <div className="v5-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowExport(false); }}><dialog aria-labelledby="v5-export-title" className="v5-export-dialog" onCancel={() => setShowExport(false)} open><header><div><span>MORPHIQ EXPORT</span><h2 id="v5-export-title">{project.name}</h2></div><button aria-label={t("Close", "Cerrar")} onClick={() => setShowExport(false)} type="button">×</button></header><div aria-label={t("Export format", "Formato de exportación")} className="v5-export-tabs" role="tablist">{(["react", "css", "html", "svg", "ai", "json"] as ExportTab[]).map((tab) => <button aria-selected={exportTab === tab} key={tab} onClick={() => setExportTab(tab)} role="tab" type="button">{tab}</button>)}</div><pre><code>{exportContent}</code></pre><footer><span>{t("Includes hierarchy, materials, responsive rules, variants, motion and reduced-motion fallback.", "Incluye jerarquía, materiales, responsive, variantes, movimiento y alternativa de movimiento reducido.")}</span><div><button onClick={() => void copyExport()} type="button">{copied ? <Check size={12} /> : <Copy size={12} />} {copied ? t("Copied", "Copiado") : t("Copy", "Copiar")}</button><button onClick={() => { const extensions: Record<ExportTab, string> = { react: "tsx", css: "css", html: "html", svg: "svg", ai: "txt", json: "json" }; downloadFile(`${project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.${extensions[exportTab]}`, exportContent, exportTab === "svg" ? "image/svg+xml" : "text/plain"); }} type="button"><Download size={12} /> {t("Download", "Descargar")}</button><button onClick={() => exportDocument(project)} type="button"><FileJson size={12} /> {t("Project", "Proyecto")}</button></div></footer></dialog></div>}
    {notice && <div className="v5-notice"><Check size={12} />{notice}</div>}
  </main>;
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <div className="v5-panel-label">{children}</div>;
}
