"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Rnd } from "react-rnd";
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  ArrowLeft,
  Box,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  Eye,
  Grid3X3,
  Layers3,
  Monitor,
  MousePointer2,
  Plus,
  Redo2,
  Save,
  Smartphone,
  Square,
  Tablet,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import { tr, type Locale } from "@/lib/i18n";

type Surface = "clay" | "glass" | "skeuo" | "adaptive";
type ElementKind = "button" | "card" | "label";
type Motion = "none" | "float" | "pulse" | "wiggle";
type Device = "desktop" | "tablet" | "mobile";

type CanvasElement = {
  id: string;
  kind: ElementKind;
  name: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  surface: Surface;
  fill: string;
  color: string;
  radius: number;
  depth: number;
  blur: number;
  fontSize: number;
  motion: Motion;
};

const initialElements: CanvasElement[] = [
  { id: "launch", kind: "button", name: "Primary action", text: "Launch project", x: 235, y: 185, width: 190, height: 64, surface: "clay", fill: "#ff8068", color: "#512219", radius: 20, depth: 9, blur: 18, fontSize: 13, motion: "float" },
  { id: "caption", kind: "label", name: "Caption", text: "PRESS TO SHIP", x: 259, y: 271, width: 142, height: 30, surface: "adaptive", fill: "transparent", color: "#6e6d67", radius: 0, depth: 0, blur: 0, fontSize: 9, motion: "none" },
];

const deviceSizes: Record<Device, { width: number; height: number }> = {
  desktop: { width: 820, height: 520 },
  tablet: { width: 640, height: 760 },
  mobile: { width: 390, height: 720 },
};

const surfaceDefaults: Record<Surface, Pick<CanvasElement, "fill" | "color" | "radius" | "depth" | "blur">> = {
  clay: { fill: "#ff8068", color: "#512219", radius: 20, depth: 9, blur: 18 },
  glass: { fill: "#ffffff66", color: "#171817", radius: 18, depth: 18, blur: 20 },
  skeuo: { fill: "#d7d4cd", color: "#3e3d39", radius: 18, depth: 8, blur: 12 },
  adaptive: { fill: "#20211f", color: "#ffffff", radius: 16, depth: 7, blur: 10 },
};

function elementShadow(element: CanvasElement) {
  const { surface, depth, blur } = element;
  if (surface === "clay") return `inset 0 4px 4px rgba(255,255,255,.45), inset 0 -5px 7px rgba(100,28,18,.2), 0 ${depth}px 0 rgba(145,55,38,.82), 0 ${depth + 7}px ${blur}px rgba(67,40,33,.18)`;
  if (surface === "glass") return `inset 0 1px 0 rgba(255,255,255,.9), 0 ${depth}px ${blur + 12}px rgba(49,38,77,.2)`;
  if (surface === "skeuo") return `inset 0 2px 1px rgba(255,255,255,.9), inset 0 -2px 3px rgba(0,0,0,.12), 0 ${depth}px ${blur}px rgba(38,36,31,.25)`;
  return `inset 0 2px 1px rgba(255,255,255,.15), 0 ${depth}px 0 rgba(104,111,61,.9), 0 ${depth + 5}px ${blur}px rgba(52,58,24,.16)`;
}

function generateCode(element: CanvasElement) {
  const tag = element.kind === "button" ? "button" : "div";
  const animation = element.motion === "none" ? "" : `\n        animation: \"morphiq-${element.motion} 1.8s ease-in-out infinite alternate\",`;
  const backdrop = element.surface === "glass" ? "\n    backdropFilter: \"blur(20px) saturate(135%)\"," : "";
  return `export function Morphiq${element.kind[0].toUpperCase() + element.kind.slice(1)}() {\n  return (\n    <${tag}\n      style={{\n        width: ${Math.round(element.width)},\n        height: ${Math.round(element.height)},\n        color: \"${element.color}\",\n        background: \"${element.fill}\",\n        borderRadius: ${element.radius},\n        fontSize: ${element.fontSize},${backdrop}${animation}\n        boxShadow: \"${elementShadow(element)}\",\n      }}\n    >\n      ${element.text}\n    </${tag}>\n  );\n}`;
}

function download(filename: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function StudioShell({ locale }: { locale: Locale }) {
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const [past, setPast] = useState<CanvasElement[][]>([]);
  const [future, setFuture] = useState<CanvasElement[][]>([]);
  const [selectedId, setSelectedId] = useState("launch");
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showCode, setShowCode] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [showGrid, setShowGrid] = useState(true);
  const [snap, setSnap] = useState(true);
  const [canvasColor, setCanvasColor] = useState("#f2efe8");
  const selected = elements.find((element) => element.id === selectedId) ?? elements[0];
  const size = deviceSizes[device];
  const code = useMemo(() => generateCode(selected), [selected]);

  useEffect(() => {
    const stored = window.localStorage.getItem("morphiq-studio-v2");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CanvasElement[];
      if (!Array.isArray(parsed) || !parsed.length) return;
      const restore = window.setTimeout(() => {
        setElements(parsed);
        setSelectedId(parsed[0].id);
      }, 0);
      return () => window.clearTimeout(restore);
    } catch {
      window.localStorage.removeItem("morphiq-studio-v2");
    }
  }, []);

  function commit(next: CanvasElement[]) {
    if (JSON.stringify(next) === JSON.stringify(elements)) return;
    setPast((current) => [...current, elements].slice(-40));
    setElements(next);
    setFuture([]);
  }

  function updateSelected(patch: Partial<CanvasElement>) {
    commit(elements.map((element) => element.id === selectedId ? { ...element, ...patch } : element));
  }

  function undo() {
    const previous = past.at(-1);
    if (!previous) return;
    setPast((current) => current.slice(0, -1));
    setFuture((current) => [elements, ...current].slice(0, 40));
    setElements(previous);
  }

  function redo() {
    const next = future[0];
    if (!next) return;
    setFuture((current) => current.slice(1));
    setPast((current) => [...current, elements].slice(-40));
    setElements(next);
  }

  function applySurface(surface: Surface) {
    updateSelected({ surface, ...surfaceDefaults[surface] });
  }

  function addElement(kind: ElementKind) {
    const id = `${kind}-${Date.now()}`;
    const element: CanvasElement = {
      id, kind, name: kind === "button" ? t("New button", "Botón nuevo") : kind === "card" ? t("New card", "Tarjeta nueva") : t("New label", "Texto nuevo"),
      text: kind === "button" ? t("New action", "Nueva acción") : kind === "card" ? t("Surface card", "Tarjeta táctil") : t("Text label", "Etiqueta"),
      x: Math.min(190 + elements.length * 12, size.width - 280), y: 130 + elements.length * 12,
      width: kind === "card" ? 260 : kind === "label" ? 130 : 170, height: kind === "card" ? 160 : kind === "label" ? 32 : 58,
      surface: kind === "label" ? "adaptive" : "clay", fontSize: kind === "card" ? 24 : kind === "label" ? 9 : 13, motion: "none",
      ...(kind === "label" ? { fill: "transparent", color: "#4f4f4a", radius: 0, depth: 0, blur: 0 } : surfaceDefaults.clay),
    };
    commit([...elements, element]);
    setSelectedId(id);
  }

  function duplicateSelected() {
    const clone = { ...selected, id: `${selected.kind}-${Date.now()}`, name: `${selected.name} copy`, x: selected.x + 18, y: selected.y + 18 };
    commit([...elements, clone]);
    setSelectedId(clone.id);
  }

  function deleteSelected() {
    if (elements.length === 1) return;
    const next = elements.filter((element) => element.id !== selectedId);
    commit(next);
    setSelectedId(next[0].id);
  }

  function saveProject() {
    window.localStorage.setItem("morphiq-studio-v2", JSON.stringify(elements));
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="studio-app">
      <header className="studio-header">
        <div className="studio-header-left">
          <Link href="/" className="studio-icon-button" aria-label={t("Return home", "Volver al inicio")}><ArrowLeft size={17} /></Link>
          <div className="studio-wordmark"><b>MQ</b><span>MORPHIQ STUDIO</span><em className="mh97-signature">MH97</em></div>
          <button className="studio-project-name" type="button">{t("Untitled surface", "Superficie sin título")} <ChevronDown size={13} /></button>
        </div>
        <div className="studio-header-center">
          <button className="studio-tool-active" aria-label={t("Select tool", "Seleccionar")} type="button"><MousePointer2 size={15} /></button>
          <button aria-label={t("Add card", "Agregar tarjeta")} onClick={() => addElement("card")} type="button"><Square size={15} /></button>
          <button aria-label={t("Add text", "Agregar texto")} onClick={() => addElement("label")} type="button"><Type size={15} /></button>
          <i />
          <button aria-label={t("Undo", "Deshacer")} disabled={!past.length} onClick={undo} type="button"><Undo2 size={15} /></button>
          <button aria-label={t("Redo", "Rehacer")} disabled={!future.length} onClick={redo} type="button"><Redo2 size={15} /></button>
        </div>
        <div className="studio-header-right">
          <button className="studio-save" onClick={saveProject} type="button"><Save size={14} /> {t("Save local", "Guardar local")}</button>
          <button className="studio-export" onClick={() => setShowCode(true)} type="button"><Code2 size={14} /> {t("Export", "Exportar")}</button>
        </div>
      </header>

      <div className="studio-layout">
        <aside className="studio-sidebar layers-sidebar">
          <div className="studio-panel-title"><span><Layers3 size={14} /> {t("Layers", "Capas")}</span><button aria-label={t("Add layer", "Agregar capa")} onClick={() => addElement("card")}><Plus size={14} /></button></div>
          <div className="add-row"><button onClick={() => addElement("button")} type="button"><Box size={13} /> {t("Button", "Botón")}</button><button onClick={() => addElement("label")} type="button"><Type size={13} /> {t("Text", "Texto")}</button></div>
          <div className="layer-list">
            {elements.map((element) => <button className={element.id === selectedId ? "layer-active" : ""} key={element.id} onClick={() => setSelectedId(element.id)} type="button">{element.kind === "label" ? <Type size={13} /> : <Square size={13} />}<span>{element.name}</span><Eye size={12} /></button>)}
          </div>
          <div className="layer-actions"><button onClick={duplicateSelected} type="button"><Copy size={12} /> {t("Duplicate", "Duplicar")}</button><button onClick={deleteSelected} disabled={elements.length === 1} type="button"><Trash2 size={12} /> {t("Delete", "Borrar")}</button></div>
          <div className="assets-block"><span className="studio-panel-label">{t("Primitives", "Primitivas")}</span><div className="asset-grid"><button onClick={() => addElement("button")} type="button"><div className="asset-clay" /><span>{t("Button", "Botón")}</span></button><button onClick={() => addElement("card")} type="button"><div className="asset-glass" /><span>{t("Card", "Tarjeta")}</span></button><button onClick={() => addElement("label")} type="button"><div className="asset-type">Aa</div><span>{t("Label", "Texto")}</span></button></div></div>
        </aside>

        <section className="studio-workspace">
          <div className="canvas-toolbar">
            <div className="device-tools">
              {(["desktop", "tablet", "mobile"] as Device[]).map((item) => <button aria-label={item} aria-pressed={device === item} key={item} onClick={() => setDevice(item)} type="button">{item === "desktop" ? <Monitor size={13} /> : item === "tablet" ? <Tablet size={13} /> : <Smartphone size={13} />}</button>)}
              <span>{size.width} × {size.height}</span>
            </div>
            <div className="canvas-quick-tools">
              <button aria-label={t("Toggle grid", "Mostrar cuadrícula")} aria-pressed={showGrid} onClick={() => setShowGrid((value) => !value)} type="button"><Grid3X3 size={13} /></button>
              <button aria-label={t("Align horizontally", "Centrar horizontalmente")} onClick={() => updateSelected({ x: Math.max(0, (size.width - selected.width) / 2) })} type="button"><AlignCenterHorizontal size={13} /></button>
              <button aria-label={t("Align vertically", "Centrar verticalmente")} onClick={() => updateSelected({ y: Math.max(0, (size.height - selected.height) / 2) })} type="button"><AlignCenterVertical size={13} /></button>
              <button className="snap-toggle" aria-pressed={snap} onClick={() => setSnap((value) => !value)} type="button">SNAP</button>
            </div>
            <div className="zoom-tools"><button onClick={() => setZoom((value) => Math.max(50, value - 10))} type="button">−</button><span>{zoom}%</span><button onClick={() => setZoom((value) => Math.min(140, value + 10))} type="button">+</button></div>
          </div>
          <div className="workspace-scroll">
            <div className={`studio-artboard ${showGrid ? "artboard-grid-visible" : ""}`} style={{ width: size.width, height: size.height, background: canvasColor, transform: `scale(${zoom / 100})` }}>
              <div className="artboard-ambient artboard-ambient-one" /><div className="artboard-ambient artboard-ambient-two" />
              {elements.map((element) => (
                <Rnd bounds="parent" disableDragging={element.id !== selectedId} enableResizing={element.id === selectedId} key={element.id} minHeight={28} minWidth={70}
                  onDragStop={(_, data) => { if (element.id === selectedId) updateSelected({ x: snap ? Math.round(data.x / 10) * 10 : data.x, y: snap ? Math.round(data.y / 10) * 10 : data.y }); }}
                  onResizeStop={(_, __, ref, ___, position) => { if (element.id === selectedId) updateSelected({ width: ref.offsetWidth, height: ref.offsetHeight, ...position }); }}
                  position={{ x: element.x, y: element.y }} size={{ width: element.width, height: element.height }}>
                  <button className={`canvas-node canvas-node-${element.kind} canvas-motion-${element.motion} ${element.id === selectedId ? "canvas-node-selected" : ""}`} onClick={() => setSelectedId(element.id)} style={{ color: element.color, background: element.fill, borderRadius: element.radius, boxShadow: element.kind === "label" ? "none" : elementShadow(element), backdropFilter: element.surface === "glass" ? `blur(${element.blur}px) saturate(135%)` : undefined, fontSize: element.fontSize }} type="button">{element.text}</button>
                </Rnd>
              ))}
              <div className="artboard-label">MORPHIQ UI / MH97 / tactile study 001</div>
            </div>
          </div>
        </section>

        <aside className="studio-sidebar inspector-sidebar">
          <div className="studio-panel-title"><span>{t("Inspector", "Inspector")}</span><button aria-label={t("More options", "Más opciones")}>•••</button></div>
          <div className="inspector-section"><span className="studio-panel-label">{t("Surface language", "Lenguaje de superficie")}</span><div className="surface-selector">{(["clay", "glass", "skeuo", "adaptive"] as Surface[]).map((surface) => <button aria-pressed={selected.surface === surface} className={selected.surface === surface ? "surface-option-active" : ""} key={surface} onClick={() => applySurface(surface)} type="button"><i className={`surface-dot surface-dot-${surface}`} />{surface}</button>)}</div></div>
          <div className="inspector-section"><span className="studio-panel-label">{t("Content", "Contenido")}</span><label className="inspector-field inspector-field-full"><span>{t("Text", "Texto")}</span><input value={selected.text} onChange={(event) => updateSelected({ text: event.target.value })} /></label></div>
          <div className="inspector-section"><span className="studio-panel-label">{t("Geometry", "Geometría")}</span><div className="inspector-field-grid">{(["width", "height", "x", "y"] as const).map((key) => <label className="inspector-field" key={key}><span>{key === "width" ? "W" : key === "height" ? "H" : key.toUpperCase()}</span><input type="number" value={Math.round(selected[key])} onChange={(event) => updateSelected({ [key]: Number(event.target.value) })} /></label>)}</div></div>
          <div className="inspector-section"><span className="studio-panel-label">{t("Material", "Material")}</span><label className="color-field"><span>{t("Fill", "Relleno")}</span><input type="color" value={selected.fill === "transparent" ? "#ffffff" : selected.fill.slice(0, 7)} onChange={(event) => updateSelected({ fill: event.target.value })} /><code>{selected.fill}</code></label><label className="color-field"><span>{t("Canvas", "Lienzo")}</span><input type="color" value={canvasColor} onChange={(event) => setCanvasColor(event.target.value)} /><code>{canvasColor}</code></label>
            <label className="range-field"><span>{t("Radius", "Radio")} <b>{selected.radius}</b></span><input min="0" max="48" type="range" value={selected.radius} onChange={(event) => updateSelected({ radius: Number(event.target.value) })} /></label><label className="range-field"><span>{t("Depth", "Profundidad")} <b>{selected.depth}</b></span><input min="0" max="24" type="range" value={selected.depth} onChange={(event) => updateSelected({ depth: Number(event.target.value) })} /></label><label className="range-field"><span>{t("Softness", "Suavidad")} <b>{selected.blur}</b></span><input min="0" max="40" type="range" value={selected.blur} onChange={(event) => updateSelected({ blur: Number(event.target.value) })} /></label>
          </div>
          <div className="inspector-section"><span className="studio-panel-label">{t("Type & motion", "Texto y movimiento")}</span><label className="range-field"><span>{t("Font size", "Tamaño de fuente")} <b>{selected.fontSize}px</b></span><input min="7" max="42" type="range" value={selected.fontSize} onChange={(event) => updateSelected({ fontSize: Number(event.target.value) })} /></label><label className="select-field"><span>{t("Animation", "Animación")}</span><select value={selected.motion} onChange={(event) => updateSelected({ motion: event.target.value as Motion })}><option value="none">{t("None", "Ninguna")}</option><option value="float">Float</option><option value="pulse">Pulse</option><option value="wiggle">Wiggle</option></select></label></div>
          <div className="inspector-section code-snippet"><div><span className="studio-panel-label">{t("Generated JSX", "JSX generado")}</span><button onClick={copyCode} type="button">{copied ? <Check size={13} /> : <Copy size={13} />}</button></div><pre>{code.slice(0, 185)}…</pre></div>
        </aside>
      </div>

      {showCode && <div className="export-backdrop" role="presentation" onMouseDown={() => setShowCode(false)}><section className="export-dialog" role="dialog" aria-modal="true" aria-label={t("Export component", "Exportar componente")} onMouseDown={(event) => event.stopPropagation()}><div className="export-dialog-head"><div><span>{t("Ready to own", "Listo para ser tuyo")}</span><h2>{t("Export Morphiq component", "Exportar componente Morphiq")}</h2></div><button onClick={() => setShowCode(false)} aria-label={t("Close", "Cerrar")}>×</button></div><pre>{code}</pre><div className="export-dialog-actions"><span>{t("Zero runtime styling dependency", "Sin dependencia de estilos en ejecución")}</span><div><button onClick={() => download("morphiq-project.json", JSON.stringify({ device, canvasColor, elements }, null, 2), "application/json")} type="button"><Download size={15} /> JSON</button><button onClick={copyCode} type="button">{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? t("Copied", "Copiado") : t("Copy JSX", "Copiar JSX")}</button></div></div></section></div>}
    </main>
  );
}
