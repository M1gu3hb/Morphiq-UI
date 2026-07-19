"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Rnd } from "react-rnd";
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Badge as BadgeIcon,
  Box,
  Check,
  CircleUserRound,
  Code2,
  Copy,
  Download,
  Eye,
  EyeOff,
  Grid3X3,
  Image as ImageIcon,
  Layers3,
  Lock,
  Monitor,
  MousePointer2,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Square,
  Tablet,
  ToggleLeft,
  Trash2,
  Type,
  Undo2,
  Unlock,
  Upload,
  WandSparkles,
} from "lucide-react";
import { tr, type Locale } from "@/lib/i18n";
import { StudioNodePreview } from "./studio-node";
import {
  createNode,
  deviceSizes,
  initialDocument,
  isStudioDocument,
  surfaceDefaults,
  type Device,
  type InspectorTab,
  type InteractionState,
  type MotionEasing,
  type MotionPreset,
  type MotionTrigger,
  type NodeKind,
  type NodeMotion,
  type NodeStyle,
  type StateStyle,
  type StudioDocument,
  type StudioNode,
  type Surface,
} from "./studio-model";
import { downloadFile, exportDocument, generateAiPrompt, generateCss, generateReact } from "./studio-export";

type ExportTab = "react" | "css" | "ai" | "json";

const componentKinds: NodeKind[] = ["button", "card", "text", "badge", "input", "toggle", "avatar", "progress"];
const interactionStates: InteractionState[] = ["base", "hover", "pressed", "focus", "disabled"];
const motionPresets: MotionPreset[] = ["none", "float", "pulse", "wobble", "bounce", "rotate", "slide", "glow"];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

function iconForKind(kind: NodeKind, size = 13) {
  if (kind === "button") return <Box size={size} />;
  if (kind === "card") return <Square size={size} />;
  if (kind === "text") return <Type size={size} />;
  if (kind === "badge") return <BadgeIcon size={size} />;
  if (kind === "input") return <SlidersHorizontal size={size} />;
  if (kind === "toggle") return <ToggleLeft size={size} />;
  if (kind === "avatar") return <CircleUserRound size={size} />;
  return <ImageIcon size={size} />;
}

export function StudioShell({ locale }: { locale: Locale }) {
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  const [project, setProject] = useState<StudioDocument>(initialDocument);
  const [past, setPast] = useState<StudioDocument[]>([]);
  const [future, setFuture] = useState<StudioDocument[]>([]);
  const [selectedId, setSelectedId] = useState(initialDocument.nodes[0].id);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("design");
  const [forcedState, setForcedState] = useState<InteractionState>("base");
  const [previewMode, setPreviewMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showExport, setShowExport] = useState(false);
  const [exportTab, setExportTab] = useState<ExportTab>("react");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [animationEpoch, setAnimationEpoch] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selected = project.nodes.find((node) => node.id === selectedId) ?? project.nodes[0];
  const size = deviceSizes[project.canvas.device];
  const reactCode = useMemo(() => generateReact(selected), [selected]);
  const cssCode = useMemo(() => generateCss(selected), [selected]);
  const aiPrompt = useMemo(() => generateAiPrompt(selected), [selected]);
  const exportContent = exportTab === "react" ? reactCode : exportTab === "css" ? cssCode : exportTab === "ai" ? aiPrompt : JSON.stringify(project, null, 2);

  useEffect(() => {
    const stored = window.localStorage.getItem("morphiq-studio-v3");
    if (!stored) return;
    try {
      const parsed: unknown = JSON.parse(stored);
      if (!isStudioDocument(parsed)) throw new Error("Invalid document");
      const restore = window.setTimeout(() => {
        setProject(parsed);
        setSelectedId(parsed.nodes[0].id);
      }, 0);
      return () => window.clearTimeout(restore);
    } catch {
      window.localStorage.removeItem("morphiq-studio-v3");
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function commit(next: StudioDocument) {
    if (JSON.stringify(next) === JSON.stringify(project)) return;
    setPast((current) => [...current, project].slice(-60));
    setProject(next);
    setFuture([]);
  }

  function updateSelected(patch: Partial<StudioNode>) {
    commit({ ...project, nodes: project.nodes.map((node) => node.id === selectedId ? { ...node, ...patch } : node) });
  }

  function updateNode(nodeId: string, patch: Partial<StudioNode>) {
    commit({ ...project, nodes: project.nodes.map((node) => node.id === nodeId ? { ...node, ...patch } : node) });
  }

  function updateStyle(patch: Partial<NodeStyle>) {
    updateSelected({ style: { ...selected.style, ...patch } });
  }

  function updateState(stateName: Exclude<InteractionState, "base">, patch: Partial<StateStyle>) {
    updateSelected({ states: { ...selected.states, [stateName]: { ...selected.states[stateName], ...patch } } });
  }

  function updateMotion(patch: Partial<NodeMotion>) {
    updateSelected({ motion: { ...selected.motion, ...patch } });
    setAnimationEpoch((value) => value + 1);
  }

  function updateCanvas(patch: Partial<StudioDocument["canvas"]>) {
    commit({ ...project, canvas: { ...project.canvas, ...patch } });
  }

  function updateToken(token: "accent" | "ink", color: string) {
    const previous = project.tokens[token];
    const nodes = project.nodes.map((node) => {
      const style = { ...node.style };
      const states = structuredClone(node.states);
      if (token === "accent" && style.fill === previous) style.fill = color;
      if (token === "ink" && style.color === previous) style.color = color;
      for (const state of Object.values(states)) {
        if (token === "accent" && state.fill === previous) state.fill = color;
        if (token === "ink" && state.color === previous) state.color = color;
      }
      return { ...node, style, states };
    });
    commit({ ...project, tokens: { ...project.tokens, [token]: color }, nodes });
  }

  function undo() {
    const previous = past.at(-1);
    if (!previous) return;
    setPast((current) => current.slice(0, -1));
    setFuture((current) => [project, ...current].slice(0, 60));
    setProject(previous);
    if (!previous.nodes.some((node) => node.id === selectedId)) setSelectedId(previous.nodes[0].id);
  }

  function redo() {
    const next = future[0];
    if (!next) return;
    setFuture((current) => current.slice(1));
    setPast((current) => [...current, project].slice(-60));
    setProject(next);
    if (!next.nodes.some((node) => node.id === selectedId)) setSelectedId(next.nodes[0].id);
  }

  function applySurface(surface: Surface) {
    updateSelected({ surface, style: { ...selected.style, ...surfaceDefaults[surface] } });
  }

  function addNode(kind: NodeKind) {
    const node = createNode(kind, project.nodes.length);
    if (node.style.fill === initialDocument.tokens.accent) node.style.fill = project.tokens.accent;
    if (kind === "text") node.style.color = project.tokens.ink;
    node.x = clamp(node.x, 0, Math.max(0, size.width - node.width));
    node.y = clamp(node.y, 0, Math.max(0, size.height - node.height));
    commit({ ...project, nodes: [...project.nodes, node] });
    setSelectedId(node.id);
    setPreviewMode(false);
  }

  function duplicateSelected() {
    const clone: StudioNode = { ...selected, style: { ...selected.style }, states: structuredClone(selected.states), motion: { ...selected.motion }, id: `${selected.kind}-${Date.now()}`, name: `${selected.name} copy`, x: clamp(selected.x + 18, 0, size.width - selected.width), y: clamp(selected.y + 18, 0, size.height - selected.height) };
    commit({ ...project, nodes: [...project.nodes, clone] });
    setSelectedId(clone.id);
  }

  function deleteSelected() {
    if (project.nodes.length === 1) return;
    const index = project.nodes.findIndex((node) => node.id === selectedId);
    const nodes = project.nodes.filter((node) => node.id !== selectedId);
    commit({ ...project, nodes });
    setSelectedId(nodes[Math.max(0, index - 1)]?.id ?? nodes[0].id);
  }

  function moveLayer(direction: -1 | 1) {
    const index = project.nodes.findIndex((node) => node.id === selectedId);
    const target = clamp(index + direction, 0, project.nodes.length - 1);
    if (index === target) return;
    const nodes = [...project.nodes];
    [nodes[index], nodes[target]] = [nodes[target], nodes[index]];
    commit({ ...project, nodes });
  }

  function alignSelected(axis: "x" | "y") {
    if (selected.locked) return;
    updateSelected(axis === "x" ? { x: Math.max(0, (size.width - selected.width) / 2) } : { y: Math.max(0, (size.height - selected.height) / 2) });
  }

  function saveProject() {
    window.localStorage.setItem("morphiq-studio-v3", JSON.stringify(project));
    setNotice(t("Project saved locally", "Proyecto guardado localmente"));
  }

  async function copy(content: string) {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  async function importProject(file: File | undefined) {
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isStudioDocument(parsed)) throw new Error("Invalid project");
      setPast((current) => [...current, project].slice(-60));
      setProject(parsed);
      setFuture([]);
      setSelectedId(parsed.nodes[0].id);
      setNotice(t("Project imported", "Proyecto importado"));
    } catch {
      setNotice(t("That file is not a Morphiq v3 project", "El archivo no es un proyecto Morphiq v3"));
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      const command = event.metaKey || event.ctrlKey;
      if (command && event.key.toLowerCase() === "z") { event.preventDefault(); if (event.shiftKey) redo(); else undo(); return; }
      if (command && event.key.toLowerCase() === "d") { event.preventDefault(); duplicateSelected(); return; }
      if ((event.key === "Delete" || event.key === "Backspace") && project.nodes.length > 1) { event.preventDefault(); deleteSelected(); return; }
      if (selected.locked || !event.key.startsWith("Arrow")) return;
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      if (event.key === "ArrowLeft") updateSelected({ x: clamp(selected.x - step, 0, size.width - selected.width) });
      if (event.key === "ArrowRight") updateSelected({ x: clamp(selected.x + step, 0, size.width - selected.width) });
      if (event.key === "ArrowUp") updateSelected({ y: clamp(selected.y - step, 0, size.height - selected.height) });
      if (event.key === "ArrowDown") updateSelected({ y: clamp(selected.y + step, 0, size.height - selected.height) });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const kindLabel = (kind: NodeKind) => kind === "button" ? t("Button", "Botón") : kind === "card" ? t("Card", "Tarjeta") : kind === "text" ? t("Text", "Texto") : kind === "badge" ? "Badge" : kind === "input" ? "Input" : kind === "toggle" ? "Toggle" : kind === "avatar" ? "Avatar" : t("Progress", "Progreso");

  return (
    <main className="studio-app">
      <header className="studio-header">
        <div className="studio-header-left">
          <Link href="/" className="studio-icon-button" aria-label={t("Return home", "Volver al inicio")}><ArrowLeft size={17} /></Link>
          <div className="studio-wordmark"><b>MQ</b><span>MORPHIQ STUDIO</span><em className="mh97-signature">MH97</em></div>
          <input aria-label={t("Project name", "Nombre del proyecto")} className="studio-project-input" onChange={(event) => setProject({ ...project, name: event.target.value })} value={project.name} />
        </div>
        <div aria-label={t("Editor tools", "Herramientas del editor")} className="studio-header-center" role="toolbar">
          <button aria-label={t("Edit mode", "Modo edición")} aria-pressed={!previewMode} className={!previewMode ? "studio-tool-active" : ""} onClick={() => setPreviewMode(false)} type="button"><MousePointer2 size={15} /></button>
          <button aria-label={t("Preview interactions", "Probar interacciones")} aria-pressed={previewMode} className={previewMode ? "studio-tool-active" : ""} onClick={() => setPreviewMode(true)} type="button"><Play size={15} /></button>
          <i />
          <button aria-label={t("Add card", "Agregar tarjeta")} onClick={() => addNode("card")} type="button"><Square size={15} /></button>
          <button aria-label={t("Add text", "Agregar texto")} onClick={() => addNode("text")} type="button"><Type size={15} /></button>
          <i />
          <button aria-label={t("Undo", "Deshacer")} disabled={!past.length} onClick={undo} type="button"><Undo2 size={15} /></button>
          <button aria-label={t("Redo", "Rehacer")} disabled={!future.length} onClick={redo} type="button"><Redo2 size={15} /></button>
        </div>
        <div className="studio-header-right">
          <input accept="application/json,.json" className="studio-file-input" onChange={(event) => { void importProject(event.target.files?.[0]); event.currentTarget.value = ""; }} ref={fileInputRef} type="file" />
          <button className="studio-save" onClick={() => fileInputRef.current?.click()} type="button"><Upload size={14} /> {t("Import", "Importar")}</button>
          <button className="studio-save" onClick={saveProject} type="button"><Save size={14} /> {t("Save", "Guardar")}</button>
          <button className="studio-export" onClick={() => setShowExport(true)} type="button"><Code2 size={14} /> {t("Export", "Exportar")}</button>
        </div>
      </header>

      <div className="studio-layout">
        <aside className="studio-sidebar layers-sidebar">
          <div className="studio-panel-title"><span><Layers3 size={14} /> {t("Layers", "Capas")} <b>{project.nodes.length}</b></span><button aria-label={t("Add button", "Agregar botón")} onClick={() => addNode("button")} type="button"><Plus size={14} /></button></div>
          <div className="component-palette">
            <span className="studio-panel-label">{t("Components", "Componentes")}</span>
            <div className="component-grid">{componentKinds.map((kind) => <button key={kind} onClick={() => addNode(kind)} type="button">{iconForKind(kind, 15)}<span>{kindLabel(kind)}</span></button>)}</div>
          </div>
          <div className="layer-list">
            {[...project.nodes].reverse().map((node) => (
              <div className={node.id === selectedId ? "layer-active" : ""} key={node.id}>
                <button className="layer-select" onClick={() => { setSelectedId(node.id); setPreviewMode(false); }} type="button">{iconForKind(node.kind)}<span>{node.name}</span></button>
                <button aria-label={node.visible ? t("Hide layer", "Ocultar capa") : t("Show layer", "Mostrar capa")} onClick={() => { setSelectedId(node.id); commit({ ...project, nodes: project.nodes.map((item) => item.id === node.id ? { ...item, visible: !item.visible } : item) }); }} type="button">{node.visible ? <Eye size={12} /> : <EyeOff size={12} />}</button>
                <button aria-label={node.locked ? t("Unlock layer", "Desbloquear capa") : t("Lock layer", "Bloquear capa")} onClick={() => { setSelectedId(node.id); commit({ ...project, nodes: project.nodes.map((item) => item.id === node.id ? { ...item, locked: !item.locked } : item) }); }} type="button">{node.locked ? <Lock size={11} /> : <Unlock size={11} />}</button>
              </div>
            ))}
          </div>
          <div className="layer-actions">
            <button aria-label={t("Move layer forward", "Subir capa")} disabled={project.nodes.at(-1)?.id === selectedId} onClick={() => moveLayer(1)} type="button"><ArrowUp size={12} /></button>
            <button aria-label={t("Move layer backward", "Bajar capa")} disabled={project.nodes[0]?.id === selectedId} onClick={() => moveLayer(-1)} type="button"><ArrowDown size={12} /></button>
            <button onClick={duplicateSelected} type="button"><Copy size={12} /> {t("Duplicate", "Duplicar")}</button>
            <button onClick={deleteSelected} disabled={project.nodes.length === 1} type="button"><Trash2 size={12} /> {t("Delete", "Borrar")}</button>
          </div>
          <div className="document-settings">
            <span className="studio-panel-label">{t("Document tokens", "Variables del documento")}</span>
            <ColorControl label={t("Canvas", "Lienzo")} onChange={(color) => commit({ ...project, canvas: { ...project.canvas, color }, tokens: { ...project.tokens, surface: color } })} value={project.canvas.color} />
            <ColorControl label={t("Accent", "Acento")} onChange={(accent) => updateToken("accent", accent)} value={project.tokens.accent} />
            <ColorControl label={t("Ink", "Tinta")} onChange={(ink) => updateToken("ink", ink)} value={project.tokens.ink} />
          </div>
        </aside>

        <section className="studio-workspace">
          <div className="canvas-toolbar">
            <div className="device-tools">
              {(["desktop", "tablet", "mobile"] as Device[]).map((device) => <button aria-label={device} aria-pressed={project.canvas.device === device} key={device} onClick={() => updateCanvas({ device })} type="button">{device === "desktop" ? <Monitor size={13} /> : device === "tablet" ? <Tablet size={13} /> : <Smartphone size={13} />}</button>)}
              <span>{size.width} × {size.height}</span>
            </div>
            <div className="canvas-mode-status"><i className={previewMode ? "status-live" : ""} />{previewMode ? t("Preview — controls are live", "Vista previa — controles activos") : t("Edit — drag, resize or nudge", "Edición — mueve, escala o ajusta")}</div>
            <div className="canvas-quick-tools">
              <button aria-label={t("Toggle grid", "Mostrar cuadrícula")} aria-pressed={project.canvas.showGrid} onClick={() => updateCanvas({ showGrid: !project.canvas.showGrid })} type="button"><Grid3X3 size={13} /></button>
              <button aria-label={t("Align horizontally", "Centrar horizontalmente")} disabled={selected.locked} onClick={() => alignSelected("x")} type="button"><AlignCenterHorizontal size={13} /></button>
              <button aria-label={t("Align vertically", "Centrar verticalmente")} disabled={selected.locked} onClick={() => alignSelected("y")} type="button"><AlignCenterVertical size={13} /></button>
              <button className="snap-toggle" aria-pressed={project.canvas.snap} onClick={() => updateCanvas({ snap: !project.canvas.snap })} type="button">SNAP</button>
            </div>
            <div className="zoom-tools"><button aria-label={t("Zoom out", "Alejar")} onClick={() => setZoom((value) => Math.max(50, value - 10))} type="button">−</button><span>{zoom}%</span><button aria-label={t("Zoom in", "Acercar")} onClick={() => setZoom((value) => Math.min(140, value + 10))} type="button">+</button></div>
          </div>
          <div className="workspace-scroll">
            <div className={`studio-artboard ${project.canvas.showGrid ? "artboard-grid-visible" : ""} ${previewMode ? "artboard-preview-mode" : ""}`} onClick={() => setForcedState("base")} style={{ width: size.width, height: size.height, background: project.canvas.color, transform: `scale(${zoom / 100})` }}>
              <div className="artboard-ambient artboard-ambient-one" /><div className="artboard-ambient artboard-ambient-two" />
              {project.nodes.map((node, index) => node.visible && (
                <Rnd
                  bounds="parent"
                  disableDragging={previewMode || node.locked || node.id !== selectedId}
                  enableResizing={!previewMode && !node.locked && node.id === selectedId}
                  key={`${node.id}-${animationEpoch}`}
                  minHeight={28}
                  minWidth={48}
                  onDragStart={() => setSelectedId(node.id)}
                  onDragStop={(_, data) => { if (node.id === selectedId) updateSelected({ x: project.canvas.snap ? Math.round(data.x / 10) * 10 : data.x, y: project.canvas.snap ? Math.round(data.y / 10) * 10 : data.y }); }}
                  onResizeStop={(_, __, ref, ___, position) => { if (node.id === selectedId) updateSelected({ width: ref.offsetWidth, height: ref.offsetHeight, x: position.x, y: position.y }); }}
                  position={{ x: node.x, y: node.y }}
                  size={{ width: node.width, height: node.height }}
                  style={{ zIndex: index + 1 }}
                >
                  <StudioNodePreview forcedState={node.id === selectedId ? forcedState : "base"} node={node} onChange={(patch) => { if (previewMode) updateNode(node.id, patch); }} onSelect={() => setSelectedId(node.id)} previewMode={previewMode} selected={node.id === selectedId} />
                </Rnd>
              ))}
              <div className="artboard-label">MORPHIQ UI / MH97 / {project.name}</div>
            </div>
          </div>
        </section>

        <aside className="studio-sidebar inspector-sidebar">
          <div className="studio-panel-title inspector-title"><span>{t("Inspector", "Inspector")}</span><span className="selected-kind">{iconForKind(selected.kind)} {kindLabel(selected.kind)}</span></div>
          <label className="node-name-field"><span>{t("Layer name", "Nombre de capa")}</span><input onChange={(event) => updateSelected({ name: event.target.value })} value={selected.name} /></label>
          <div className="inspector-tabs" role="tablist">
            {(["design", "states", "motion"] as InspectorTab[]).map((tab) => <button aria-selected={inspectorTab === tab} key={tab} onClick={() => setInspectorTab(tab)} role="tab" type="button">{tab === "design" ? t("Design", "Diseño") : tab === "states" ? t("States", "Estados") : t("Motion", "Animación")}</button>)}
          </div>

          {inspectorTab === "design" && <DesignInspector locale={locale} node={selected} onApplySurface={applySurface} onChange={updateSelected} onStyle={updateStyle} />}
          {inspectorTab === "states" && <StatesInspector forcedState={forcedState} locale={locale} node={selected} onForcedState={setForcedState} onState={updateState} onStyle={updateStyle} />}
          {inspectorTab === "motion" && <MotionInspector locale={locale} node={selected} onChange={updateMotion} onReplay={() => setAnimationEpoch((value) => value + 1)} presets={motionPresets} />}

          <div className="inspector-section code-snippet"><div><span className="studio-panel-label">{t("Generated React", "React generado")}</span><button aria-label={t("Copy React", "Copiar React")} onClick={() => void copy(reactCode)} type="button">{copied ? <Check size={13} /> : <Copy size={13} />}</button></div><pre>{reactCode.slice(0, 220)}…</pre><button className="open-export-button" onClick={() => setShowExport(true)} type="button"><Code2 size={12} /> {t("Open full export", "Abrir exportación")}</button></div>
        </aside>
      </div>

      {notice && <div aria-live="polite" className="studio-notice"><Check size={14} /> {notice}</div>}

      {showExport && <div className="export-backdrop" role="presentation" onMouseDown={() => setShowExport(false)}><section className="export-dialog export-dialog-expanded" role="dialog" aria-modal="true" aria-label={t("Export component", "Exportar componente")} onMouseDown={(event) => event.stopPropagation()}><div className="export-dialog-head"><div><span>{t("Production handoff", "Entrega para producción")}</span><h2>{t("Export", "Exportar")} {selected.name}</h2></div><button onClick={() => setShowExport(false)} aria-label={t("Close", "Cerrar")} type="button">×</button></div><div className="export-tabs" role="tablist">{(["react", "css", "ai", "json"] as ExportTab[]).map((tab) => <button aria-selected={exportTab === tab} key={tab} onClick={() => setExportTab(tab)} role="tab" type="button">{tab === "ai" ? t("AI handoff", "Para IA") : tab.toUpperCase()}</button>)}</div><pre>{exportContent}</pre><div className="export-dialog-actions"><span>{exportTab === "json" ? t("Versioned project backup", "Respaldo versionado del proyecto") : t("Accessible states and reduced motion included", "Incluye estados accesibles y movimiento reducido")}</span><div><button onClick={() => { if (exportTab === "json") exportDocument(project); else downloadFile(exportTab === "react" ? `${selected.name.replace(/\s+/g, "")}.tsx` : exportTab === "css" ? `${selected.name.replace(/\s+/g, "")}.module.css` : `${selected.name.replace(/\s+/g, "")}-ai.txt`, exportContent); }} type="button"><Download size={15} /> {t("Download", "Descargar")}</button><button onClick={() => void copy(exportContent)} type="button">{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? t("Copied", "Copiado") : t("Copy", "Copiar")}</button></div></div></section></div>}
    </main>
  );
}

function DesignInspector({ locale, node, onApplySurface, onChange, onStyle }: { locale: Locale; node: StudioNode; onApplySurface: (surface: Surface) => void; onChange: (patch: Partial<StudioNode>) => void; onStyle: (patch: Partial<NodeStyle>) => void }) {
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  return <>
    <div className="inspector-section"><span className="studio-panel-label">{t("Content", "Contenido")}</span><label className="stacked-field"><span>{node.kind === "input" ? t("Label", "Etiqueta") : t("Text", "Texto")}</span><input value={node.text} onChange={(event) => onChange({ text: event.target.value })} /></label>{["card", "input"].includes(node.kind) && <label className="stacked-field"><span>{node.kind === "input" ? "Placeholder" : t("Description", "Descripción")}</span><textarea rows={2} value={node.secondaryText} onChange={(event) => onChange({ secondaryText: event.target.value })} /></label>}{node.kind === "progress" && <RangeControl label={t("Progress", "Progreso")} max={100} min={0} onChange={(value) => onChange({ value })} value={node.value} suffix="%" />}{node.kind === "toggle" && <label className="check-field"><input checked={node.checked} onChange={(event) => onChange({ checked: event.target.checked })} type="checkbox" /><span>{t("Checked by default", "Activado por defecto")}</span></label>}<label className="check-field"><input checked={node.disabled} onChange={(event) => onChange({ disabled: event.target.checked })} type="checkbox" /><span>{t("Disabled", "Desactivado")}</span></label></div>
    <div className="inspector-section"><span className="studio-panel-label">{t("Surface language", "Lenguaje de superficie")}</span><div className="surface-selector">{(["clay", "glass", "skeuo", "adaptive"] as Surface[]).map((surface) => <button aria-pressed={node.surface === surface} className={node.surface === surface ? "surface-option-active" : ""} key={surface} onClick={() => onApplySurface(surface)} type="button"><i className={`surface-dot surface-dot-${surface}`} />{surface}</button>)}</div></div>
    <div className="inspector-section"><span className="studio-panel-label">{t("Geometry", "Geometría")}</span><div className="inspector-field-grid">{(["width", "height", "x", "y"] as const).map((key) => <NumberControl key={key} label={key === "width" ? "W" : key === "height" ? "H" : key.toUpperCase()} onChange={(value) => onChange({ [key]: Math.max(0, value) })} value={Math.round(node[key])} />)}</div><RangeControl label={t("Padding", "Relleno interno")} max={48} min={0} onChange={(padding) => onStyle({ padding })} value={node.style.padding} suffix="px" /></div>
    <div className="inspector-section"><span className="studio-panel-label">{t("Material", "Material")}</span><ColorControl label={t("Fill", "Relleno")} onChange={(fill) => onStyle({ fill })} value={node.style.fill === "transparent" ? "#ffffff" : node.style.fill} /><ColorControl label={t("Text", "Texto")} onChange={(color) => onStyle({ color })} value={node.style.color} /><ColorControl label={t("Border", "Borde")} onChange={(borderColor) => onStyle({ borderColor })} value={node.style.borderColor} /><RangeControl label={t("Border width", "Ancho de borde")} max={8} min={0} onChange={(borderWidth) => onStyle({ borderWidth })} value={node.style.borderWidth} suffix="px" /><RangeControl label={t("Radius", "Radio")} max={80} min={0} onChange={(radius) => onStyle({ radius })} value={node.style.radius} suffix="px" /><RangeControl label={t("Depth", "Profundidad")} max={28} min={0} onChange={(depth) => onStyle({ depth })} value={node.style.depth} /><RangeControl label={t("Softness", "Suavidad")} max={48} min={0} onChange={(blur) => onStyle({ blur })} value={node.style.blur} /><RangeControl label={t("Opacity", "Opacidad")} max={100} min={0} onChange={(opacity) => onStyle({ opacity })} value={node.style.opacity} suffix="%" /></div>
    <div className="inspector-section"><span className="studio-panel-label">{t("Typography", "Tipografía")}</span><RangeControl label={t("Font size", "Tamaño")} max={52} min={7} onChange={(fontSize) => onStyle({ fontSize })} value={node.style.fontSize} suffix="px" /><RangeControl label={t("Weight", "Peso")} max={900} min={300} onChange={(fontWeight) => onStyle({ fontWeight })} step={100} value={node.style.fontWeight} /><RangeControl label={t("Tracking", "Espaciado")} max={8} min={-2} onChange={(letterSpacing) => onStyle({ letterSpacing })} step={.1} value={node.style.letterSpacing} suffix="px" /><div className="segmented-control">{(["left", "center", "right"] as const).map((textAlign) => <button aria-pressed={node.style.textAlign === textAlign} key={textAlign} onClick={() => onStyle({ textAlign })} type="button">{textAlign}</button>)}</div></div>
  </>;
}

function StatesInspector({ forcedState, locale, node, onForcedState, onState, onStyle }: { forcedState: InteractionState; locale: Locale; node: StudioNode; onForcedState: (state: InteractionState) => void; onState: (state: Exclude<InteractionState, "base">, patch: Partial<StateStyle>) => void; onStyle: (patch: Partial<NodeStyle>) => void }) {
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  const current = forcedState === "base" ? null : node.states[forcedState];
  return <>
    <div className="inspector-section"><span className="studio-panel-label">{t("Interaction state", "Estado de interacción")}</span><div className="state-selector">{interactionStates.map((state) => <button aria-pressed={forcedState === state} key={state} onClick={() => onForcedState(state)} type="button">{state === "pressed" ? t("Press", "Presión") : state === "disabled" ? t("Disabled", "Inactivo") : state}</button>)}</div><p className="inspector-help">{t("The canvas is forcing this state. Preview mode uses real pointer and keyboard interaction.", "El lienzo fuerza este estado. La vista previa usa interacción real de puntero y teclado.")}</p></div>
    <div className="inspector-section"><span className="studio-panel-label">{forcedState === "base" ? t("Base appearance", "Apariencia base") : t("State overrides", "Cambios del estado")}</span>{forcedState === "base" ? <><ColorControl label={t("Fill", "Relleno")} onChange={(fill) => onStyle({ fill })} value={node.style.fill === "transparent" ? "#ffffff" : node.style.fill} /><ColorControl label={t("Text", "Texto")} onChange={(color) => onStyle({ color })} value={node.style.color} /><RangeControl label={t("Opacity", "Opacidad")} max={100} min={0} onChange={(opacity) => onStyle({ opacity })} value={node.style.opacity} suffix="%" /></> : <><OverrideColor label={t("Fill override", "Cambio de relleno")} onChange={(fill) => onState(forcedState, { fill })} value={current?.fill ?? ""} fallback={node.style.fill} /><OverrideColor label={t("Text override", "Cambio de texto")} onChange={(color) => onState(forcedState, { color })} value={current?.color ?? ""} fallback={node.style.color} /><RangeControl label={t("Opacity", "Opacidad")} max={100} min={0} onChange={(opacity) => onState(forcedState, { opacity })} value={current?.opacity ?? 100} suffix="%" /><RangeControl label="Scale" max={140} min={60} onChange={(scale) => onState(forcedState, { scale })} value={current?.scale ?? 100} suffix="%" /><RangeControl label="Translate Y" max={24} min={-24} onChange={(translateY) => onState(forcedState, { translateY })} value={current?.translateY ?? 0} suffix="px" /><RangeControl label="Rotate" max={20} min={-20} onChange={(rotate) => onState(forcedState, { rotate })} value={current?.rotate ?? 0} suffix="°" />{forcedState === "focus" && <ColorControl label={t("Focus ring", "Anillo de foco")} onChange={(outlineColor) => onState("focus", { outlineColor })} value={current?.outlineColor ?? "#7359df"} />}</>}</div>
  </>;
}

function MotionInspector({ locale, node, onChange, onReplay, presets }: { locale: Locale; node: StudioNode; onChange: (patch: Partial<NodeMotion>) => void; onReplay: () => void; presets: MotionPreset[] }) {
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  return <>
    <div className="inspector-section"><div className="section-heading"><span className="studio-panel-label">{t("Motion preset", "Animación")}</span><button onClick={onReplay} type="button"><RotateCcw size={11} /> {t("Replay", "Repetir")}</button></div><div className="motion-grid">{presets.map((preset) => <button aria-pressed={node.motion.preset === preset} key={preset} onClick={() => onChange({ preset })} type="button"><WandSparkles size={13} />{preset}</button>)}</div></div>
    <div className="inspector-section"><span className="studio-panel-label">{t("Playback", "Reproducción")}</span><label className="select-field"><span>{t("Trigger", "Disparador")}</span><select value={node.motion.trigger} onChange={(event) => onChange({ trigger: event.target.value as MotionTrigger })}><option value="loop">Loop</option><option value="hover">Hover</option><option value="tap">Tap / Press</option><option value="load">On load</option></select></label><label className="select-field"><span>Easing</span><select value={node.motion.easing} onChange={(event) => onChange({ easing: event.target.value as MotionEasing })}><option value="easeOut">Ease out</option><option value="easeInOut">Ease in/out</option><option value="linear">Linear</option><option value="spring">Spring</option></select></label><RangeControl label={t("Duration", "Duración")} max={4} min={.1} onChange={(duration) => onChange({ duration })} step={.05} value={node.motion.duration} suffix="s" /><RangeControl label={t("Delay", "Retraso")} max={2} min={0} onChange={(delay) => onChange({ delay })} step={.05} value={node.motion.delay} suffix="s" /><RangeControl label={t("Intensity", "Intensidad")} max={24} min={1} onChange={(intensity) => onChange({ intensity })} value={node.motion.intensity} /><label className="select-field"><span>{t("Repeat", "Repetición")}</span><select value={node.motion.repeat} onChange={(event) => onChange({ repeat: Number(event.target.value) })}><option value={0}>{t("Once", "Una vez")}</option><option value={1}>2×</option><option value={2}>3×</option><option value={-1}>{t("Infinite", "Infinita")}</option></select></label></div>
    <div className="motion-summary"><Sparkles size={15} /><div><b>{node.motion.preset}</b><span>{node.motion.trigger} · {node.motion.duration}s · {node.motion.easing}</span></div></div>
  </>;
}

function NumberControl({ label, onChange, value }: { label: string; onChange: (value: number) => void; value: number }) {
  return <label className="inspector-field"><span>{label}</span><input onChange={(event) => onChange(Number(event.target.value))} type="number" value={value} /></label>;
}

function RangeControl({ label, max, min, onChange, step = 1, suffix = "", value }: { label: string; max: number; min: number; onChange: (value: number) => void; step?: number; suffix?: string; value: number }) {
  return <label className="range-field"><span>{label} <b>{value}{suffix}</b></span><input max={max} min={min} onChange={(event) => onChange(Number(event.target.value))} step={step} type="range" value={value} /></label>;
}

function ColorControl({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  const safeValue = /^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff";
  return <label className="color-field"><span>{label}</span><input onChange={(event) => onChange(event.target.value)} type="color" value={safeValue} /><code>{value}</code></label>;
}

function OverrideColor({ fallback, label, onChange, value }: { fallback: string; label: string; onChange: (value: string) => void; value: string }) {
  return <div className="override-color"><ColorControl label={label} onChange={onChange} value={value || fallback} /><button disabled={!value} onClick={() => onChange("")} type="button">{value ? "↺ inherit" : "inherited"}</button></div>;
}
