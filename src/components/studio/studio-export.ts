import { elementBackground, elementShadow, type StudioDocument, type StudioNode } from "./studio-model";
import { motionEasingCss, motionKeyframesCss } from "./studio-motion";

const esc = (value: string) => JSON.stringify(value);
const classNameFor = (node: StudioNode) => `morphiq-${node.kind}-${node.id.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}`;
const componentNameFor = (node: StudioNode) => `Morphiq${node.name.replace(/[^a-z0-9]+/gi, " ").trim().split(/\s+/).map((word) => word[0]?.toUpperCase() + word.slice(1)).join("") || "Component"}`;

function componentMarkup(node: StudioNode, className: string) {
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
  return (
    <div className={styles.motion}>
      ${componentMarkup(node, className)}
    </div>
  );
}
`;
}

const stateTransform = (node: StudioNode, state: StudioNode["states"]["hover"]) => `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale / 100}) rotate(${node.style.rotation + state.rotate}deg) skew(${node.style.skewX}deg, ${node.style.skewY}deg)`;

const stateRules = (node: StudioNode, selector: string, state: StudioNode["states"]["hover"], includeOutline = false) => `
${selector} {
  ${state.fill ? `background: ${state.fill};\n  ` : ""}${state.color ? `color: ${state.color};\n  ` : ""}opacity: ${state.opacity / 100};
  transform: ${stateTransform(node, state)};
  ${state.blur ? `filter: blur(${state.blur}px);\n  ` : ""}${includeOutline ? `outline: 2px solid ${state.outlineColor};\n  outline-offset: 3px;` : ""}
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
  const iteration = node.motion.repeat < 0 ? "infinite" : String(node.motion.repeat + 1);
  const animation = `${node.motion.duration}s ${motionEasingCss(node)} ${node.motion.delay}s ${iteration} ${node.motion.direction} ${node.motion.fillMode} ${animationName}`;
  const animationRule = !node.motion.enabled || node.motion.preset === "none" ? "" : node.motion.trigger === "hover" ? `\n.motion:hover { animation: ${animation}; }` : node.motion.trigger === "tap" ? `\n.motion:active { animation: ${animation}; }` : `\n.motion { animation: ${animation}; }`;
  const layout = node.kind === "card" ? "align-items: flex-start; flex-direction: column; justify-content: flex-end;" : node.kind === "progress" ? "align-items: stretch; flex-direction: column; justify-content: center;" : "align-items: center; justify-content: center;";
  const fontFamily = node.style.fontFamily === "display" ? '"Bricolage Grotesque", system-ui, sans-serif' : node.style.fontFamily === "mono" ? "ui-monospace, SFMono-Regular, Consolas, monospace" : 'Manrope, system-ui, sans-serif';
  return `.motion {
  width: ${Math.round(node.width)}px;
  height: ${Math.round(node.height)}px;
  perspective: 900px;
  transform-style: preserve-3d;
}

${selector} {
  width: 100%;
  height: 100%;
  display: flex;
  ${layout}
  gap: ${node.kind === "card" ? 7 : 10}px;
  box-sizing: border-box;
  padding: ${node.style.padding}px;
  border: ${node.style.borderWidth}px ${node.style.borderStyle} ${node.style.borderColor};
  border-radius: ${node.style.radius}px;
  color: ${node.style.color};
  background: ${elementBackground(node)};
  box-shadow: ${elementShadow(node)};
  ${node.surface === "glass" ? `backdrop-filter: blur(${node.style.blur}px) saturate(${node.style.saturate}%);\n  ` : ""}font: ${node.style.fontWeight} ${node.style.fontSize}px/${node.style.lineHeight} ${fontFamily};
  letter-spacing: ${node.style.letterSpacing}px;
  text-align: ${node.style.textAlign};
  text-transform: ${node.style.textTransform};
  opacity: ${node.style.opacity / 100};
  transform: translate(0, 0) scale(1) rotate(${node.style.rotation}deg) skew(${node.style.skewX}deg, ${node.style.skewY}deg);
  transform-origin: ${node.style.transformOrigin};
  transition: transform 180ms ease, opacity 180ms ease, filter 180ms ease, color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}${stateRules(node, `${selector}:hover`, node.states.hover)}${stateRules(node, `${selector}:active`, node.states.pressed)}${stateRules(node, `${selector}:focus-visible`, node.states.focus, true)}${stateRules(node, `${selector}:disabled, ${selector}[aria-disabled="true"]`, node.states.disabled)}${animationRule}

${componentCss(node, selector)}

${motionKeyframesCss(node, animationName)}

@media (prefers-reduced-motion: reduce) {
  .motion { animation: none !important; }
  ${selector} { transition-duration: .01ms; }
}`;
}

export function generateAiPrompt(node: StudioNode) {
  const name = componentNameFor(node);
  return `Agrega este componente ${name} sin reinterpretar su diseño. Crea los dos archivos indicados, conserva sus estados accesibles, su material y sus keyframes, y respeta prefers-reduced-motion.\n\n// ${name}.tsx\n${generateReact(node)}\n\n/* ${name}.module.css */\n${generateCss(node)}`;
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
