import { elementShadow, type StudioDocument, type StudioNode } from "./studio-model";

const esc = (value: string) => JSON.stringify(value);
const classNameFor = (node: StudioNode) => `morphiq-${node.kind}-${node.id.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}`;
const componentNameFor = (node: StudioNode) => `Morphiq${node.name.replace(/[^a-z0-9]+/gi, " ").trim().split(/\s+/).map((word) => word[0]?.toUpperCase() + word.slice(1)).join("") || "Component"}`;

function markup(node: StudioNode, className: string) {
  if (node.kind === "button") return `<button className={styles.${className}} disabled={${node.disabled}} type="button">{${esc(node.text)}}</button>`;
  if (node.kind === "card") return `<article className={styles.${className}}><span>MORPHIQ</span><strong>{${esc(node.text)}}</strong><small>{${esc(node.secondaryText)}}</small></article>`;
  if (node.kind === "text") return `<p className={styles.${className}}>{${esc(node.text)}}</p>`;
  if (node.kind === "badge") return `<span className={styles.${className}}><i />{${esc(node.text)}}</span>`;
  if (node.kind === "input") return `<label className={styles.${className}}><span>{${esc(node.text)}}</span><input placeholder=${esc(node.secondaryText)} /></label>`;
  if (node.kind === "toggle") return `<button aria-checked={checked} className={styles.${className}} onClick={() => setChecked((value) => !value)} role="switch" type="button"><span>{${esc(node.text)}}</span><i /></button>`;
  if (node.kind === "avatar") return `<span aria-label=${esc(node.name)} className={styles.${className}} role="img">{${esc(node.text.slice(0, 3))}}</span>`;
  return `<div aria-label=${esc(node.text)} className={styles.${className}} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={${node.value}}><span><b>{${esc(node.text)}}</b><small>${node.value}%</small></span><i><em style={{ width: "${node.value}%" }} /></i></div>`;
}

export function generateReact(node: StudioNode) {
  const name = componentNameFor(node);
  const className = classNameFor(node).replace(/-/g, "_");
  const isToggle = node.kind === "toggle";
  return `${isToggle ? '"use client";\n\nimport { useState } from "react";\n' : ""}import styles from "./${name}.module.css";

export function ${name}() {${isToggle ? `
  const [checked, setChecked] = useState(${node.checked});
` : ""}
  return ${markup(node, className)};
}
`;
}

function keyframes(node: StudioNode, name: string) {
  const i = node.motion.intensity;
  switch (node.motion.preset) {
    case "float": return `@keyframes ${name} { 50% { transform: translateY(-${i}px); } }`;
    case "pulse": return `@keyframes ${name} { 50% { transform: scale(${1 + i / 100}); } }`;
    case "wobble": return `@keyframes ${name} { 25% { transform: rotate(-${i / 3}deg); } 75% { transform: rotate(${i / 3}deg); } }`;
    case "bounce": return `@keyframes ${name} { 45% { transform: translateY(-${i * 1.8}px); } 70% { transform: translateY(${i / 3}px); } }`;
    case "rotate": return `@keyframes ${name} { 50% { transform: rotate(${i * 6}deg); } }`;
    case "slide": return `@keyframes ${name} { 25% { transform: translateX(-${i}px); } 75% { transform: translateX(${i}px); } }`;
    case "glow": return `@keyframes ${name} { 50% { filter: brightness(${1 + i / 45}); } }`;
    default: return "";
  }
}

const stateRules = (selector: string, state: StudioNode["states"]["hover"], includeOutline = false) => `
${selector} {
  ${state.fill ? `background: ${state.fill};\n  ` : ""}${state.color ? `color: ${state.color};\n  ` : ""}opacity: ${state.opacity / 100};
  transform: translateY(${state.translateY}px) scale(${state.scale / 100}) rotate(${state.rotate}deg);
  ${includeOutline ? `outline: 2px solid ${state.outlineColor};\n  outline-offset: 3px;` : ""}
}`;

function componentCss(node: StudioNode, selector: string) {
  if (node.kind === "card") return `${selector} strong, ${selector} small, ${selector} span { display: block; }
${selector} strong { font-size: 1em; }
${selector} small { opacity: .65; font-size: .5em; }`;
  if (node.kind === "badge") return `${selector} > i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }`;
  if (node.kind === "input") return `${selector} { align-items: stretch; flex-direction: column; gap: 4px; }
${selector} span { font-size: .72em; opacity: .68; }
${selector} input { width: 100%; border: 0; outline: 0; background: transparent; color: inherit; font: inherit; }`;
  if (node.kind === "toggle") return `${selector} { justify-content: space-between; }
${selector} > i { width: 40px; height: 22px; border-radius: 999px; background: rgba(0,0,0,.16); }
${selector}[aria-checked="true"] > i { background: ${node.style.color}; }`;
  if (node.kind === "progress") return `${selector} > span { display: flex; justify-content: space-between; }
${selector} > i { display: block; height: 8px; overflow: hidden; border-radius: 999px; background: rgba(0,0,0,.12); }
${selector} > i > em { display: block; height: 100%; border-radius: inherit; background: ${node.style.color}; }`;
  return "";
}

export function generateCss(node: StudioNode) {
  const className = classNameFor(node).replace(/-/g, "_");
  const selector = `.${className}`;
  const animationName = `${className}_motion`;
  const easing = node.motion.easing === "spring" ? "cubic-bezier(.2, 1.4, .4, 1)" : node.motion.easing === "easeInOut" ? "ease-in-out" : node.motion.easing === "easeOut" ? "ease-out" : "linear";
  const animation = `${animationName} ${node.motion.duration}s ${easing} ${node.motion.delay}s ${node.motion.repeat < 0 ? "infinite" : node.motion.repeat + 1}`;
  const animationRule = node.motion.preset === "none" ? "" : node.motion.trigger === "hover" ? `\n${selector}:hover { animation: ${animation}; }` : node.motion.trigger === "tap" ? `\n${selector}:active { animation: ${animation}; }` : `\n${selector} { animation: ${animation}; }`;
  const layout = node.kind === "card" ? "align-items: flex-start; flex-direction: column; justify-content: flex-end;" : node.kind === "progress" ? "align-items: stretch; flex-direction: column; justify-content: center;" : "align-items: center; justify-content: center;";
  return `${selector} {
  width: ${Math.round(node.width)}px;
  height: ${Math.round(node.height)}px;
  display: flex;
  ${layout}
  gap: ${node.kind === "card" ? 7 : 10}px;
  box-sizing: border-box;
  padding: ${node.style.padding}px;
  border: ${node.style.borderWidth}px solid ${node.style.borderColor};
  border-radius: ${node.style.radius}px;
  color: ${node.style.color};
  background: ${node.style.fill};
  box-shadow: ${elementShadow(node)};
  ${node.surface === "glass" ? `backdrop-filter: blur(${node.style.blur}px) saturate(135%);\n  ` : ""}font: ${node.style.fontWeight} ${node.style.fontSize}px/1.2 system-ui, sans-serif;
  letter-spacing: ${node.style.letterSpacing}px;
  text-align: ${node.style.textAlign};
  opacity: ${node.style.opacity / 100};
  transition: transform 180ms ease, opacity 180ms ease, color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}${stateRules(`${selector}:hover`, node.states.hover)}${stateRules(`${selector}:active`, node.states.pressed)}${stateRules(`${selector}:focus-visible`, node.states.focus, true)}${stateRules(`${selector}:disabled, ${selector}[aria-disabled="true"]`, node.states.disabled)}${animationRule}

${componentCss(node, selector)}

${keyframes(node, animationName)}

@media (prefers-reduced-motion: reduce) {
  ${selector} { animation: none; transition-duration: .01ms; }
}`;
}

export function generateAiPrompt(node: StudioNode) {
  const name = componentNameFor(node);
  return `Agrega este componente ${name} sin reinterpretar su diseño. Crea los dos archivos indicados, conserva sus estados accesibles y respeta prefers-reduced-motion.\n\n// ${name}.tsx\n${generateReact(node)}\n\n/* ${name}.module.css */\n${generateCss(node)}`;
}

export function downloadFile(filename: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportDocument(document: StudioDocument) {
  downloadFile(`${document.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "morphiq-project"}.json`, JSON.stringify(document, null, 2), "application/json");
}
