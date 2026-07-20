"use client";

import { useState, type DragEvent, type MouseEvent } from "react";
import {
  Box,
  ChevronDown,
  ChevronRight,
  Circle,
  Component,
  Eye,
  EyeOff,
  Frame,
  Group,
  Image as ImageIcon,
  Lock,
  Minus,
  MousePointer2,
  PenTool,
  SlidersHorizontal,
  Square,
  Star,
  ToggleLeft,
  Type,
  Unlock,
} from "lucide-react";
import { tr, type Locale } from "@/lib/i18n";
import { getNodeChildren, isContainer, type StudioNode } from "./studio-model";

type StudioLayerTreeProps = {
  locale: Locale;
  nodes: StudioNode[];
  selectedIds: string[];
  search: string;
  onSelect: (id: string, additive: boolean, range: boolean) => void;
  onToggleExpanded: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onToggleLocked: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onReparent: (draggedId: string, parentId: string | null) => void;
};

function layerIcon(node: StudioNode) {
  if (node.kind === "frame") return <Frame size={12} />;
  if (node.kind === "group") return <Group size={12} />;
  if (node.kind === "ellipse" || node.kind === "dial") return <Circle size={12} />;
  if (node.kind === "text") return <Type size={12} />;
  if (node.kind === "image") return <ImageIcon size={12} />;
  if (node.kind === "vector" || node.kind === "boolean") return <PenTool size={12} />;
  if (node.kind === "star" || node.kind === "polygon") return <Star size={12} />;
  if (node.kind === "line" || node.kind === "arrow") return <Minus size={12} />;
  if (node.kind === "toggle") return <ToggleLeft size={12} />;
  if (node.kind === "slider" || node.kind === "progress") return <SlidersHorizontal size={12} />;
  if (node.kind === "componentInstance") return <Component size={12} />;
  if (node.kind === "button" || node.kind === "input") return <Box size={12} />;
  return <Square size={12} />;
}

function layerMatches(nodes: StudioNode[], node: StudioNode, query: string, visited = new Set<string>()): boolean {
  if (!query) return true;
  if (visited.has(node.id)) return false;
  visited.add(node.id);
  if (node.name.toLowerCase().includes(query)) return true;
  return getNodeChildren(nodes, node.id).some((child) => layerMatches(nodes, child, query, visited));
}

function LayerRow({ node, depth, tree }: { node: StudioNode; depth: number; tree: StudioLayerTreeProps }) {
  const [renaming, setRenaming] = useState(false);
  const t = (english: string, spanish: string) => tr(tree.locale, english, spanish);
  const children = getNodeChildren(tree.nodes, node.id);
  const selected = tree.selectedIds.includes(node.id);
  const query = tree.search.trim().toLowerCase();
  if (!layerMatches(tree.nodes, node, query)) return null;

  function drop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const draggedId = event.dataTransfer.getData("application/morphiq-layer");
    if (draggedId && draggedId !== node.id && isContainer(node)) tree.onReparent(draggedId, node.id);
  }

  function select(event: MouseEvent) {
    tree.onSelect(node.id, event.metaKey || event.ctrlKey, event.shiftKey);
  }

  return <>
    <div
      className={`v5-layer-row ${selected ? "v5-layer-row-selected" : ""}`}
      draggable={!node.locked}
      onDragOver={(event) => { if (isContainer(node)) event.preventDefault(); }}
      onDragStart={(event) => { event.dataTransfer.setData("application/morphiq-layer", node.id); event.dataTransfer.effectAllowed = "move"; }}
      onDrop={drop}
      style={{ paddingLeft: 8 + depth * 14 }}
    >
      <button aria-label={node.expanded ? t("Collapse", "Colapsar") : t("Expand", "Expandir")} className="v5-layer-expand" disabled={!children.length} onClick={() => tree.onToggleExpanded(node.id)} type="button">{children.length ? node.expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} /> : <span />}</button>
      {renaming ? <input aria-label={t("Layer name", "Nombre de capa")} autoFocus className="v5-layer-rename" defaultValue={node.name} onBlur={(event) => { tree.onRename(node.id, event.target.value.trim() || node.name); setRenaming(false); }} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); if (event.key === "Escape") setRenaming(false); }} /> : <button className="v5-layer-main" onClick={select} onDoubleClick={() => setRenaming(true)} type="button">{layerIcon(node)}<span>{node.name}</span></button>}
      {node.componentId && <Component aria-label={t("Component instance", "Instancia de componente")} className="v5-layer-component-mark" size={10} />}
      <button aria-label={node.visible ? t("Hide layer", "Ocultar capa") : t("Show layer", "Mostrar capa")} className="v5-layer-action" onClick={() => tree.onToggleVisible(node.id)} type="button">{node.visible ? <Eye size={11} /> : <EyeOff size={11} />}</button>
      <button aria-label={node.locked ? t("Unlock layer", "Desbloquear capa") : t("Lock layer", "Bloquear capa")} className="v5-layer-action" onClick={() => tree.onToggleLocked(node.id)} type="button">{node.locked ? <Lock size={10} /> : <Unlock size={10} />}</button>
    </div>
    {(node.expanded || Boolean(query)) && children.map((child) => <LayerRow depth={depth + 1} key={child.id} node={child} tree={tree} />)}
  </>;
}

export function StudioLayerTree(props: StudioLayerTreeProps) {
  const roots = props.nodes.filter((node) => !node.parentId || !props.nodes.some((candidate) => candidate.id === node.parentId));
  return <div className="v5-layer-tree" onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
    if (event.target !== event.currentTarget) return;
    const draggedId = event.dataTransfer.getData("application/morphiq-layer");
    if (draggedId) props.onReparent(draggedId, null);
  }}>
    {!roots.length && <div className="v5-empty-state"><MousePointer2 size={16} /><span>{tr(props.locale, "No layers yet", "Aún no hay capas")}</span></div>}
    {roots.map((node) => <LayerRow depth={0} key={node.id} node={node} tree={props} />)}
  </div>;
}
