"use client";

import { useMemo, useState, type PointerEvent } from "react";
import {
  ChevronDown,
  ChevronRight,
  ClipboardPaste,
  Copy,
  Diamond,
  Gauge,
  Pause,
  Play,
  Plus,
  Rewind,
  RotateCcw,
  StepBack,
  StepForward,
  Trash2,
} from "lucide-react";
import { tr, type Locale } from "@/lib/i18n";
import {
  animatableProperties,
  createId,
  getPathValue,
  type AnimatableProperty,
  type EasingType,
  type StudioNode,
  type StudioTimeline,
  type StudioVariable,
  type TimelineKeyframe,
} from "./studio-model";
import {
  createTrack,
  createKeyframe,
  duplicateKeyframes,
  easingOptions,
  moveKeyframes,
  removeKeyframes,
  reverseTimeline,
  staggerTracks,
  stretchTimelineSelection,
  upsertKeyframe,
} from "./studio-motion";

type TimelineProps = {
  locale: Locale;
  nodes: StudioNode[];
  selectedNodeIds: string[];
  selectedKeyframeIds: Set<string>;
  playhead: number;
  playing: boolean;
  timeline: StudioTimeline;
  variables: StudioVariable[];
  onPlayhead: (value: number) => void;
  onPlaying: (value: boolean) => void;
  onSelectKeyframes: (ids: Set<string>) => void;
  onSelectNode: (id: string) => void;
  onTimeline: (timeline: StudioTimeline) => void;
};

type PropertyOption = (typeof animatableProperties)[number];
type ClipboardFrame = { nodeId: string; property: AnimatableProperty; offset: number; frame: TimelineKeyframe };

function dynamicProperties(node?: StudioNode): PropertyOption[] {
  if (!node) return animatableProperties;
  const options: PropertyOption[] = [...animatableProperties];
  const add = (property: AnimatableProperty, label: string, group: string) => options.push({ property, label, group });
  node.style.fills.forEach((fill, fillIndex) => {
    add(`style.fills.${fillIndex}.color`, `${fill.name} color`, "Material");
    add(`style.fills.${fillIndex}.opacity`, `${fill.name} opacity`, "Material");
    add(`style.fills.${fillIndex}.angle`, `${fill.name} angle`, "Material");
    add(`style.fills.${fillIndex}.centerX`, `${fill.name} center X`, "Material");
    add(`style.fills.${fillIndex}.centerY`, `${fill.name} center Y`, "Material");
    fill.stops.forEach((_, stopIndex) => {
      add(`style.fills.${fillIndex}.stops.${stopIndex}.color`, `${fill.name} stop ${stopIndex + 1} color`, "Gradient stops");
      add(`style.fills.${fillIndex}.stops.${stopIndex}.position`, `${fill.name} stop ${stopIndex + 1} position`, "Gradient stops");
      add(`style.fills.${fillIndex}.stops.${stopIndex}.opacity`, `${fill.name} stop ${stopIndex + 1} opacity`, "Gradient stops");
    });
  });
  node.style.effects.forEach((effect, effectIndex) => {
    add(`style.effects.${effectIndex}.color`, `${effect.name} color`, "Effects");
    add(`style.effects.${effectIndex}.opacity`, `${effect.name} opacity`, "Effects");
    add(`style.effects.${effectIndex}.x`, `${effect.name} X`, "Effects");
    add(`style.effects.${effectIndex}.y`, `${effect.name} Y`, "Effects");
    add(`style.effects.${effectIndex}.blur`, `${effect.name} blur`, "Effects");
    add(`style.effects.${effectIndex}.spread`, `${effect.name} spread`, "Effects");
  });
  node.geometry.vectorPoints.forEach((_, index) => {
    add(`geometry.vectorPoints.${index}.x`, `Vector point ${index + 1} X`, "Vector");
    add(`geometry.vectorPoints.${index}.y`, `Vector point ${index + 1} Y`, "Vector");
  });
  node.geometry.clipPoints.forEach((_, index) => {
    add(`geometry.clipPoints.${index}.x`, `Clip point ${index + 1} X`, "Vector");
    add(`geometry.clipPoints.${index}.y`, `Clip point ${index + 1} Y`, "Vector");
  });
  return [...new Map(options.map((option) => [option.property, option])).values()];
}

export function StudioTimelinePanel(props: TimelineProps) {
  const { locale, nodes, onPlayhead, onPlaying, onSelectKeyframes, onSelectNode, onTimeline, playhead, playing, selectedKeyframeIds, selectedNodeIds, timeline, variables } = props;
  const t = (en: string, es: string) => tr(locale, en, es);
  const [property, setProperty] = useState<AnimatableProperty>("transform.x");
  const [zoom, setZoom] = useState(100);
  const [stretchFactor, setStretchFactor] = useState(1.25);
  const [staggerAmount, setStaggerAmount] = useState(0.12);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<ClipboardFrame[]>([]);
  const [selectedVariableId, setSelectedVariableId] = useState("");
  const trackWidth = Math.max(680, timeline.duration * 170 * zoom / 100);
  const selectedNode = nodes.find((node) => node.id === selectedNodeIds[0]);
  const selectedVariable = variables.find((variable) => variable.id === selectedVariableId);
  const propertyOptions = useMemo(() => selectedVariable ? [{ property: "variable.value" as AnimatableProperty, label: `${selectedVariable.name} value`, group: "Component variables" }] : dynamicProperties(selectedNode), [selectedNode, selectedVariable]);
  const propertyGroups = useMemo(() => propertyOptions.reduce<Record<string, PropertyOption[]>>((groups, option) => {
    (groups[option.group] ??= []).push(option);
    return groups;
  }, {}), [propertyOptions]);
  const selectedFrames = useMemo(() => timeline.tracks.flatMap((track) => track.keyframes.map((keyframe) => ({ track, keyframe }))).filter(({ keyframe }) => selectedKeyframeIds.has(keyframe.id)), [timeline.tracks, selectedKeyframeIds]);
  const activeFrame = selectedFrames[0];
  const trackGroups = useMemo(() => [
    ...nodes.map((node) => ({ id: node.id, name: node.name, variableId: "", tracks: timeline.tracks.filter((track) => !track.variableId && track.nodeId === node.id) })),
    ...variables.map((variable) => ({ id: `variable-${variable.id}`, name: `◆ ${variable.name}`, variableId: variable.id, tracks: timeline.tracks.filter((track) => track.variableId === variable.id) })),
  ].filter((item) => item.tracks.length), [nodes, timeline.tracks, variables]);

  function addTrack() {
    if (selectedVariable) {
      const existing = timeline.tracks.find((track) => track.variableId === selectedVariable.id);
      if (existing) { addKeyframe(); return; }
      onTimeline({ ...timeline, tracks: [...timeline.tracks, { id: createId("track"), nodeId: `variable:${selectedVariable.id}`, variableId: selectedVariable.id, property: "variable.value", enabled: true, expanded: true, keyframes: [createKeyframe(0, selectedVariable.value), createKeyframe(timeline.duration, selectedVariable.value)] }] });
      return;
    }
    if (!selectedNode) return;
    if (timeline.tracks.some((track) => track.nodeId === selectedNode.id && track.property === property)) {
      onTimeline(upsertKeyframe(timeline, selectedNode, property, playhead));
      return;
    }
    onTimeline({ ...timeline, tracks: [...timeline.tracks, createTrack(selectedNode, property, timeline.duration)] });
  }

  function addKeyframe() {
    if (selectedVariable) {
      let frameId = "";
      const tracks = timeline.tracks.map((track) => {
        if (track.variableId !== selectedVariable.id) return track;
        const keyframes = [...track.keyframes];
        const existing = keyframes.find((frame) => Math.abs(frame.time - playhead) < .001);
        if (existing) { existing.value = selectedVariable.value; frameId = existing.id; }
        else { const frame = createKeyframe(playhead, selectedVariable.value); keyframes.push(frame); frameId = frame.id; }
        return { ...track, keyframes: keyframes.sort((a, b) => a.time - b.time) };
      });
      if (!tracks.some((track) => track.variableId === selectedVariable.id)) {
        const frame = createKeyframe(playhead, selectedVariable.value);
        frameId = frame.id;
        tracks.push({ id: createId("track"), nodeId: `variable:${selectedVariable.id}`, variableId: selectedVariable.id, property: "variable.value", enabled: true, expanded: true, keyframes: [frame] });
      }
      onTimeline({ ...timeline, tracks });
      onSelectKeyframes(new Set([frameId]));
      return;
    }
    if (!selectedNode) return;
    const next = upsertKeyframe(timeline, selectedNode, property, playhead, getPathValue(selectedNode, property));
    const track = next.tracks.find((candidate) => candidate.nodeId === selectedNode.id && candidate.property === property);
    const frame = track?.keyframes.find((candidate) => Math.abs(candidate.time - playhead) < 0.001);
    onTimeline(next);
    if (frame) onSelectKeyframes(new Set([frame.id]));
  }

  function updateFrame(id: string, patch: Partial<TimelineKeyframe>) {
    onTimeline({ ...timeline, tracks: timeline.tracks.map((track) => ({ ...track, keyframes: track.keyframes.map((frame) => frame.id === id ? { ...frame, ...patch, spring: patch.spring ? { ...frame.spring, ...patch.spring } : frame.spring } : frame).sort((a, b) => a.time - b.time) })) });
  }

  function selectFrame(event: PointerEvent, id: string) {
    event.stopPropagation();
    const additive = event.metaKey || event.ctrlKey || event.shiftKey;
    const ids = additive ? new Set(selectedKeyframeIds) : new Set<string>();
    if (ids.has(id) && additive) ids.delete(id); else ids.add(id);
    onSelectKeyframes(ids);
  }

  function beginFrameDrag(event: PointerEvent<HTMLButtonElement>, id: string) {
    selectFrame(event, id);
    const ids = selectedKeyframeIds.has(id) ? new Set(selectedKeyframeIds) : new Set([id]);
    const startX = event.clientX;
    const source = structuredClone(timeline);
    const move = (pointer: globalThis.PointerEvent) => onTimeline(moveKeyframes(source, ids, (pointer.clientX - startX) / trackWidth * timeline.duration));
    const stop = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); window.removeEventListener("pointercancel", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  }

  function beginScrub(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const update = (clientX: number) => onPlayhead(Math.max(0, Math.min(timeline.duration, (clientX - rect.left) / trackWidth * timeline.duration)));
    update(event.clientX);
    onSelectKeyframes(new Set());
    const move = (pointer: globalThis.PointerEvent) => update(pointer.clientX);
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  }

  function copySelection() {
    if (!selectedFrames.length) return;
    const origin = Math.min(...selectedFrames.map(({ keyframe }) => keyframe.time));
    setClipboard(selectedFrames.map(({ track, keyframe }) => ({ nodeId: track.nodeId, property: track.property, offset: keyframe.time - origin, frame: structuredClone(keyframe) })));
  }

  function pasteSelection() {
    if (!clipboard.length) return;
    const next = structuredClone(timeline);
    const ids = new Set<string>();
    clipboard.forEach((item) => {
      const track = next.tracks.find((candidate) => candidate.nodeId === item.nodeId && candidate.property === item.property);
      if (!track) return;
      const frame = { ...structuredClone(item.frame), id: createId("keyframe"), time: Math.min(timeline.duration, Math.max(0, playhead + item.offset)) };
      track.keyframes.push(frame);
      track.keyframes.sort((a, b) => a.time - b.time);
      ids.add(frame.id);
    });
    onTimeline(next);
    onSelectKeyframes(ids);
  }

  return <section className="v5-timeline" aria-label={t("Animation timeline", "Línea de tiempo de animación")}>
    <header className="v5-timeline-toolbar">
      <div className="v5-playback-controls">
        <button aria-label={t("Go to start", "Ir al inicio")} onClick={() => onPlayhead(timeline.workArea[0])} type="button"><Rewind size={12} /></button>
        <button aria-label={t("Previous frame", "Frame anterior")} onClick={() => onPlayhead(Math.max(0, playhead - 1 / timeline.fps))} type="button"><StepBack size={12} /></button>
        <button aria-label={playing ? t("Pause", "Pausar") : t("Play", "Reproducir")} className={playing ? "active" : ""} onClick={() => onPlaying(!playing)} type="button">{playing ? <Pause size={12} /> : <Play size={12} />}</button>
        <button aria-label={t("Next frame", "Frame siguiente")} onClick={() => onPlayhead(Math.min(timeline.duration, playhead + 1 / timeline.fps))} type="button"><StepForward size={12} /></button>
        <label className="v5-playhead-input"><span>{t("Playhead", "Cabezal")}</span><input aria-label={t("Playhead time in seconds", "Tiempo del cabezal en segundos")} max={timeline.duration} min="0" onChange={(event) => onPlayhead(Math.max(0, Math.min(timeline.duration, Number(event.target.value))))} step={1 / timeline.fps} type="number" value={Number(playhead.toFixed(3))} /><i>s</i></label>
      </div>
      <div className="v5-timeline-create">
        <select aria-label={t("Animation target", "Destino de animación")} onChange={(event) => { setSelectedVariableId(event.target.value); setProperty(event.target.value ? "variable.value" : "transform.x"); }} value={selectedVariableId}><option value="">{selectedNode ? `${t("Layer", "Capa")}: ${selectedNode.name}` : t("Select a layer", "Selecciona una capa")}</option>{variables.map((variable) => <option key={variable.id} value={variable.id}>{t("Variable", "Variable")}: {variable.name}</option>)}</select>
        <select aria-label={t("Animated property", "Propiedad animada")} disabled={Boolean(selectedVariable)} onChange={(event) => setProperty(event.target.value as AnimatableProperty)} value={selectedVariable ? "variable.value" : property}>{Object.entries(propertyGroups).map(([group, options]) => <optgroup key={group} label={group}>{options.map((option) => <option key={option.property} value={option.property}>{option.label}</option>)}</optgroup>)}</select>
        <button disabled={!selectedNode && !selectedVariable} onClick={addTrack} type="button"><Plus size={11} /> {t("Track", "Pista")}</button>
        <button disabled={!selectedNode && !selectedVariable} onClick={addKeyframe} type="button"><Diamond size={10} /> {t("Keyframe", "Keyframe")}</button>
      </div>
      <div className="v5-timeline-edit">
        <button aria-label={t("Copy keyframes", "Copiar keyframes")} disabled={!selectedKeyframeIds.size} onClick={copySelection} type="button"><Copy size={11} /></button>
        <button aria-label={t("Paste keyframes at playhead", "Pegar keyframes en el playhead")} disabled={!clipboard.length} onClick={pasteSelection} type="button"><ClipboardPaste size={11} /></button>
        <button aria-label={t("Duplicate keyframes", "Duplicar keyframes")} disabled={!selectedKeyframeIds.size} onClick={() => { const result = duplicateKeyframes(timeline, selectedKeyframeIds); onTimeline(result.timeline); onSelectKeyframes(result.ids); }} type="button">2×</button>
        <button aria-label={t("Delete keyframes", "Eliminar keyframes")} disabled={!selectedKeyframeIds.size} onClick={() => { onTimeline(removeKeyframes(timeline, selectedKeyframeIds)); onSelectKeyframes(new Set()); }} type="button"><Trash2 size={11} /></button>
        <button aria-label={t("Reverse timeline", "Invertir timeline")} onClick={() => onTimeline(reverseTimeline(timeline))} type="button"><RotateCcw size={11} /></button>
        <label className="v5-compact-motion-field"><span>{t("Stretch", "Estirar")}</span><input aria-label={t("Stretch factor", "Factor de estiramiento")} max="8" min="0.1" onChange={(event) => setStretchFactor(Math.max(.1, Math.min(8, Number(event.target.value))))} step="0.05" type="number" value={stretchFactor} /></label>
        <button aria-label={t("Apply time stretch", "Aplicar estiramiento temporal")} disabled={selectedKeyframeIds.size < 2} onClick={() => onTimeline(stretchTimelineSelection(timeline, selectedKeyframeIds, stretchFactor))} type="button">×{stretchFactor}</button>
        <label className="v5-compact-motion-field"><span>{t("Offset", "Desfase")}</span><input aria-label={t("Stagger offset in seconds", "Desfase escalonado en segundos")} max={timeline.duration} min={-timeline.duration} onChange={(event) => setStaggerAmount(Math.max(-timeline.duration, Math.min(timeline.duration, Number(event.target.value))))} step="0.01" type="number" value={staggerAmount} /></label>
        <button disabled={selectedNodeIds.length < 2} onClick={() => onTimeline(staggerTracks(timeline, selectedNodeIds, staggerAmount))} type="button">{t("Stagger", "Escalonar")}</button>
      </div>
      <div className="v5-timeline-settings">
        <label><span>FPS</span><select onChange={(event) => onTimeline({ ...timeline, fps: Number(event.target.value) as StudioTimeline["fps"] })} value={timeline.fps}><option value="24">24</option><option value="30">30</option><option value="60">60</option></select></label>
        <label><span>{t("Speed", "Velocidad")}</span><select onChange={(event) => onTimeline({ ...timeline, speed: Number(event.target.value) })} value={timeline.speed}><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>
        <label><span>{t("Direction", "Dirección")}</span><select onChange={(event) => onTimeline({ ...timeline, direction: event.target.value as StudioTimeline["direction"] })} value={timeline.direction}><option value="normal">→</option><option value="reverse">←</option><option value="alternate">↔</option></select></label>
        <button aria-pressed={timeline.loop} onClick={() => onTimeline({ ...timeline, loop: !timeline.loop })} type="button">{t("Loop", "Bucle")}</button>
        <button aria-pressed={timeline.autoKey} className="v5-autokey" onClick={() => onTimeline({ ...timeline, autoKey: !timeline.autoKey })} type="button"><i /> {t("Auto", "Auto")}</button>
      </div>
    </header>

    <div className="v5-timeline-body">
      <aside className="v5-timeline-labels">
        <div className="v5-timeline-label-head"><span>{t("Layers / properties", "Capas / propiedades")}</span></div>
        {trackGroups.map((group) => <div className="v5-timeline-node-group" key={group.id}><button onClick={() => { const next = new Set(collapsedNodes); if (next.has(group.id)) next.delete(group.id); else next.add(group.id); setCollapsedNodes(next); if (group.variableId) setSelectedVariableId(group.variableId); else onSelectNode(group.id); }} type="button">{collapsedNodes.has(group.id) ? <ChevronRight size={10} /> : <ChevronDown size={10} />}<span>{group.name}</span><small>{group.tracks.length}</small></button>{!collapsedNodes.has(group.id) && group.tracks.map((track) => <div className="v5-track-label" key={track.id}><input aria-label={t("Enable track", "Activar pista")} checked={track.enabled} onChange={() => onTimeline({ ...timeline, tracks: timeline.tracks.map((candidate) => candidate.id === track.id ? { ...candidate, enabled: !candidate.enabled } : candidate) })} type="checkbox" /><Diamond size={8} /><span>{track.variableId ? t("Variable value", "Valor de variable") : propertyOptions.find((item) => item.property === track.property)?.label ?? track.property}</span><button aria-label={t("Delete track", "Eliminar pista")} onClick={() => onTimeline({ ...timeline, tracks: timeline.tracks.filter((candidate) => candidate.id !== track.id) })} type="button"><Trash2 size={9} /></button></div>)}</div>)}
        {!trackGroups.length && <div className="v5-timeline-empty">{t("Select a layer or variable and add a track.", "Selecciona una capa o variable y agrega una pista.")}</div>}
      </aside>
      <div className="v5-track-scroll">
        <div aria-label={t("Timeline tracks and playhead", "Pistas y cabezal de reproducción")} className="v5-track-content" onPointerDown={beginScrub} role="group" style={{ width: trackWidth }}>
          <TimeRuler duration={timeline.duration} />
          {trackGroups.map((group) => <div className="v5-track-node" key={group.id}><div className="v5-track-node-spacer" />{!collapsedNodes.has(group.id) && group.tracks.map((track) => <div className={`v5-track-row ${track.enabled ? "" : "disabled"}`} key={track.id}>{track.keyframes.map((frame) => <button aria-label={`${t("Keyframe", "Keyframe")} ${frame.time.toFixed(2)}s`} aria-pressed={selectedKeyframeIds.has(frame.id)} className="v5-keyframe" key={frame.id} onClick={(event) => { if (event.detail !== 0) return; const ids = new Set(selectedKeyframeIds); if (event.metaKey || event.ctrlKey || event.shiftKey) { if (ids.has(frame.id)) ids.delete(frame.id); else ids.add(frame.id); } else { ids.clear(); ids.add(frame.id); } onSelectKeyframes(ids); }} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); const ids = selectedKeyframeIds.has(frame.id) ? selectedKeyframeIds : new Set([frame.id]); if (!selectedKeyframeIds.has(frame.id)) onSelectKeyframes(ids); onTimeline(moveKeyframes(timeline, ids, (event.key === "ArrowLeft" ? -1 : 1) / timeline.fps)); } }} onPointerDown={(event) => beginFrameDrag(event, frame.id)} style={{ left: `${frame.time / timeline.duration * 100}%` }} type="button"><i /></button>)}</div>)}</div>)}
          {timeline.markers.map((marker) => <div className="v5-timeline-marker" key={marker.id} style={{ left: `${marker.time / timeline.duration * 100}%`, color: marker.color }}><i /><span>{marker.label}</span></div>)}
          <div className="v5-work-area" style={{ left: `${timeline.workArea[0] / timeline.duration * 100}%`, right: `${100 - timeline.workArea[1] / timeline.duration * 100}%` }} />
          <div className="v5-playhead" style={{ left: `${playhead / timeline.duration * 100}%` }}><i /><span /></div>
        </div>
      </div>
    </div>

    <footer className="v5-timeline-footer">
      <div className="v5-work-controls"><label>{t("Duration", "Duración")}<input min="0.1" onChange={(event) => { const duration = Math.max(0.1, Number(event.target.value)); onTimeline({ ...timeline, duration, workArea: [Math.min(timeline.workArea[0], duration), Math.min(duration, timeline.workArea[1])] }); }} step="0.1" type="number" value={timeline.duration} />s</label><label>{t("In", "Entrada")}<input min="0" onChange={(event) => onTimeline({ ...timeline, workArea: [Math.min(Number(event.target.value), timeline.workArea[1]), timeline.workArea[1]] })} step="0.05" type="number" value={timeline.workArea[0]} /></label><label>{t("Out", "Salida")}<input max={timeline.duration} min={timeline.workArea[0]} onChange={(event) => onTimeline({ ...timeline, workArea: [timeline.workArea[0], Number(event.target.value)] })} step="0.05" type="number" value={timeline.workArea[1]} /></label><button onClick={() => onTimeline({ ...timeline, markers: [...timeline.markers, { id: createId("marker"), time: playhead, label: `M${timeline.markers.length + 1}`, color: "#ff8068" }] })} type="button"><Plus size={10} /> {t("Marker", "Marcador")}</button></div>
      {timeline.markers.length > 0 && <div className="v5-marker-editor">{timeline.markers.map((marker) => <div key={marker.id}><input aria-label={t("Marker label", "Etiqueta del marcador")} onChange={(event) => onTimeline({ ...timeline, markers: timeline.markers.map((item) => item.id === marker.id ? { ...item, label: event.target.value } : item) })} value={marker.label} /><input aria-label={t("Marker color", "Color del marcador")} onChange={(event) => onTimeline({ ...timeline, markers: timeline.markers.map((item) => item.id === marker.id ? { ...item, color: event.target.value } : item) })} type="color" value={marker.color} /><button aria-label={t("Delete marker", "Eliminar marcador")} onClick={() => onTimeline({ ...timeline, markers: timeline.markers.filter((item) => item.id !== marker.id) })} type="button"><Trash2 size={9} /></button></div>)}</div>}
      {activeFrame ? <KeyframeInspector frame={activeFrame.keyframe} locale={locale} onChange={(patch) => updateFrame(activeFrame.keyframe.id, patch)} timeline={timeline} /> : <span className="v5-keyframe-hint">{t("Select a keyframe to edit its value and curve.", "Selecciona un keyframe para editar su valor y curva.")}</span>}
      <label className="v5-timeline-zoom"><Gauge size={11} /><input max="220" min="50" onChange={(event) => setZoom(Number(event.target.value))} type="range" value={zoom} /><span>{zoom}%</span></label>
    </footer>
  </section>;
}

function TimeRuler({ duration }: { duration: number }) {
  const marks = Array.from({ length: Math.ceil(duration * 2) + 1 }, (_, index) => index / 2).filter((value) => value <= duration);
  return <div className="v5-time-ruler">{marks.map((value) => <span key={value} style={{ left: `${value / duration * 100}%` }}><i />{Number.isInteger(value) ? `${value}s` : ""}</span>)}</div>;
}

function KeyframeInspector({ frame, locale, onChange, timeline }: { frame: TimelineKeyframe; locale: Locale; onChange: (patch: Partial<TimelineKeyframe>) => void; timeline: StudioTimeline }) {
  const t = (en: string, es: string) => tr(locale, en, es);
  const numeric = typeof frame.value === "number";
  const boolean = typeof frame.value === "boolean";
  const color = typeof frame.value === "string" && /^#[0-9a-f]{6}$/i.test(frame.value);
  return <div className="v5-keyframe-inspector">
    <label><span>{t("Time", "Tiempo")}</span><input max={timeline.duration} min="0" onChange={(event) => onChange({ time: Number(event.target.value) })} step={1 / timeline.fps} type="number" value={Number(frame.time.toFixed(3))} /></label>
    <label><span>{t("Value", "Valor")}</span>{numeric ? <input onChange={(event) => onChange({ value: Number(event.target.value) })} step="0.1" type="number" value={Number(frame.value)} /> : boolean ? <input checked={Boolean(frame.value)} onChange={(event) => onChange({ value: event.target.checked })} type="checkbox" /> : color ? <input onChange={(event) => onChange({ value: event.target.value })} type="color" value={String(frame.value)} /> : <input onChange={(event) => onChange({ value: event.target.value })} value={String(frame.value)} />}</label>
    <label><span>{t("Easing", "Curva")}</span><select onChange={(event) => onChange({ easing: event.target.value as EasingType })} value={frame.easing}>{easingOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
    <EasingGraph frame={frame} locale={locale} onChange={onChange} />
    {frame.easing === "cubicBezier" && <div className="v5-bezier-fields">{frame.bezier.map((value, index) => <label key={index}><span>{["X1", "Y1", "X2", "Y2"][index]}</span><input aria-label={`Bezier ${index + 1}`} max="1.5" min="-0.5" onChange={(event) => { const bezier = [...frame.bezier] as TimelineKeyframe["bezier"]; bezier[index] = Number(event.target.value); onChange({ bezier }); }} step="0.01" type="range" value={value} /><output>{value.toFixed(2)}</output></label>)}</div>}
    {frame.easing === "spring" && <div className="v5-spring-fields">{(["mass", "stiffness", "damping", "velocity"] as const).map((key) => <label key={key}><span>{locale === "es" ? ({ mass: "masa", stiffness: "rigidez", damping: "amort.", velocity: "velocidad" } as const)[key] : key}</span><input min="0" onChange={(event) => onChange({ spring: { ...frame.spring, [key]: Number(event.target.value) } })} step={key === "mass" ? 0.1 : 1} type="number" value={frame.spring[key]} /></label>)}</div>}
  </div>;
}

function previewEasing(frame: TimelineKeyframe, t: number) {
  if (frame.easing === "linear") return t;
  if (frame.easing === "easeIn") return t ** 3;
  if (frame.easing === "easeOut") return 1 - (1 - t) ** 3;
  if (frame.easing === "easeInOut") return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
  if (frame.easing === "cubicBezier") {
    const inverse = 1 - t;
    return 3 * inverse * inverse * t * frame.bezier[1] + 3 * inverse * t * t * frame.bezier[3] + t ** 3;
  }
  const mass = Math.max(.1, frame.spring.mass);
  const angular = Math.sqrt(Math.max(1, frame.spring.stiffness) / mass);
  const damping = frame.spring.damping / (2 * Math.sqrt(Math.max(1, frame.spring.stiffness) * mass));
  return 1 - Math.exp(-damping * angular * t * 6) * Math.cos(angular * Math.sqrt(Math.max(.01, 1 - damping * damping)) * t * .75 + frame.spring.velocity * .03);
}

function EasingGraph({ frame, locale, onChange }: { frame: TimelineKeyframe; locale: Locale; onChange: (patch: Partial<TimelineKeyframe>) => void }) {
  const points = Array.from({ length: 41 }, (_, index) => {
    const t = index / 40;
    if (frame.easing === "cubicBezier") {
      const inverse = 1 - t;
      const x = 3 * inverse * inverse * t * frame.bezier[0] + 3 * inverse * t * t * frame.bezier[2] + t ** 3;
      const y = 3 * inverse * inverse * t * frame.bezier[1] + 3 * inverse * t * t * frame.bezier[3] + t ** 3;
      return `${4 + x * 88},${40 - y * 36}`;
    }
    return `${4 + t * 88},${40 - previewEasing(frame, t) * 36}`;
  }).join(" ");
  function beginHandleDrag(event: PointerEvent<SVGCircleElement>, handle: 0 | 1) {
    event.stopPropagation();
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const move = (pointer: globalThis.PointerEvent) => {
      const bezier = [...frame.bezier] as TimelineKeyframe["bezier"];
      bezier[handle * 2] = Math.max(-.5, Math.min(1.5, (pointer.clientX - rect.left - 4) / Math.max(1, rect.width - 8)));
      bezier[handle * 2 + 1] = Math.max(-.5, Math.min(1.5, 1 - (pointer.clientY - rect.top - 4) / Math.max(1, rect.height - 8)));
      onChange({ bezier });
    };
    const stop = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); window.removeEventListener("pointercancel", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  }
  return <svg aria-label={tr(locale, "Visual easing editor", "Editor visual de curva")} className="v5-easing-graph" role="img" viewBox="0 0 96 44"><path d="M4 40 H92 M4 40 V4" /><polyline fill="none" points={points} />{frame.easing === "cubicBezier" && <><line x1="4" x2={4 + frame.bezier[0] * 88} y1="40" y2={40 - frame.bezier[1] * 36} /><line x1="92" x2={4 + frame.bezier[2] * 88} y1="4" y2={40 - frame.bezier[3] * 36} /><circle cx={4 + frame.bezier[0] * 88} cy={40 - frame.bezier[1] * 36} onPointerDown={(event) => beginHandleDrag(event, 0)} r="3" /><circle cx={4 + frame.bezier[2] * 88} cy={40 - frame.bezier[3] * 36} onPointerDown={(event) => beginHandleDrag(event, 1)} r="3" /></>}</svg>;
}
