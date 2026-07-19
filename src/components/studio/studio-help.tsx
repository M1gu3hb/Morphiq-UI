"use client";

import { createContext, useContext, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { CircleHelp, X } from "lucide-react";
import { tr, type Locale } from "@/lib/i18n";

type DemoKind = "move" | "shape" | "material" | "layout" | "responsive" | "timeline" | "states" | "component" | "accessibility" | "export" | "generic";

type HelpTopic = {
  title: [string, string];
  description: [string, string];
  steps: [string, string][];
  example: [string, string];
  demo: DemoKind;
  note?: [string, string];
};

type HelpRequest = { topic?: string; label: string };
type HelpContextValue = { openHelp: (request: HelpRequest) => void };

const HelpContext = createContext<HelpContextValue | null>(null);

const topics: Record<string, HelpTopic> = {
  studio: {
    title: ["Morphiq Studio help", "Ayuda de Morphiq Studio"],
    description: ["Build a web component as a hierarchy of layers, style it with web-safe materials, then animate states or properties.", "Construye un componente web como una jerarquía de capas, aplica materiales compatibles con web y después anima estados o propiedades."],
    steps: [["Add or select a layer.", "Agrega o selecciona una capa."], ["Edit it in Design, Material or Layout.", "Edítala en Diseño, Material o Layout."], ["Use Interactions or the timeline, then Preview and Export.", "Usa Interacciones o la línea de tiempo; después prueba en Vista previa y Exporta."]],
    example: ["A card can contain its background, text, shine and button as separate children.", "Una card puede contener fondo, texto, brillo y botón como hijos separados."],
    demo: "component",
  },
  "tool.select": {
    title: ["Select tool", "Herramienta Seleccionar"],
    description: ["Selects, moves and resizes existing layers without creating a new object.", "Selecciona, mueve y redimensiona capas existentes sin crear un objeto nuevo."],
    steps: [["Click a layer on the canvas.", "Haz clic en una capa del lienzo."], ["Shift-click to add or remove it from the selection.", "Usa Shift + clic para agregarla o quitarla de la selección."], ["Drag the box or its handles; locked layers cannot move.", "Arrastra la caja o sus tiradores; las capas bloqueadas no se mueven."]],
    example: ["Move a button 24 px to the right, then undo it once.", "Mueve un botón 24 px a la derecha y deshazlo una sola vez."],
    demo: "move",
  },
  "tool.shape": {
    title: ["Shape tool", "Herramienta de forma"],
    description: ["Creates a real editable layer of the selected shape. It is not a decorative screenshot.", "Crea una capa real y editable de la forma elegida. No es una captura decorativa."],
    steps: [["Choose the shape.", "Elige la forma."], ["Click the canvas to place it.", "Haz clic en el lienzo para colocarla."], ["Set exact size, corners and material in the inspector.", "Define tamaño, esquinas y material exactos en el inspector."]],
    example: ["Create a rounded rectangle, then turn its corners into an organic superellipse.", "Crea un rectángulo redondeado y convierte sus esquinas en una superelipse orgánica."],
    demo: "shape",
  },
  "tool.pen": {
    title: ["Pen tool", "Herramienta Pluma"],
    description: ["Builds a vector path point by point. Double-click the canvas or switch tools to finish it.", "Construye una ruta vectorial punto por punto. Haz doble clic en el lienzo o cambia de herramienta para terminarla."],
    steps: [["Click to place at least two points.", "Haz clic para colocar al menos dos puntos."], ["Double-click to finish the path.", "Haz doble clic para terminar la ruta."], ["Enable point editing to move points and Bézier handles.", "Activa edición de puntos para mover puntos y tiradores Bézier."]],
    example: ["Draw an asymmetric door panel and curve its upper edge.", "Dibuja una puerta asimétrica y curva su borde superior."],
    demo: "shape",
  },
  "tool.boolean": {
    title: ["Boolean operation", "Operación booleana"],
    description: ["Combines selected sibling shapes into one non-destructive boolean container.", "Combina formas hermanas seleccionadas en un contenedor booleano no destructivo."],
    steps: [["Select two or more layers with the same parent.", "Selecciona dos o más capas con el mismo padre."], ["Choose Union, Subtract, Intersect or Exclude.", "Elige Unir, Restar, Intersectar o Excluir."], ["Edit or reorder the child operands later.", "Edita o reordena después las formas hijas."]],
    example: ["Subtract a circle from a rectangle to create a physical notch.", "Resta un círculo a un rectángulo para crear una muesca física."],
    demo: "shape",
    note: ["Selection order defines the operand order.", "El orden de selección define el orden de los operandos."],
  },
  "tool.mask": {
    title: ["Mask", "Máscara"],
    description: ["Uses the first selected layer as the visible boundary for the other selected layers.", "Usa la primera capa seleccionada como límite visible de las demás capas seleccionadas."],
    steps: [["Select the mask layer first.", "Selecciona primero la capa máscara."], ["Add the content layers to the selection.", "Agrega las capas de contenido a la selección."], ["Press Mask; edit children from the layer tree.", "Pulsa Máscara; edita los hijos desde el árbol de capas."]],
    example: ["Clip a moving gradient inside an organic card shape.", "Recorta un degradado en movimiento dentro de una card orgánica."],
    demo: "shape",
  },
  "canvas.device": {
    title: ["Responsive canvas", "Lienzo responsivo"],
    description: ["Changes the active desktop, tablet or mobile viewport and resolves that device's overrides.", "Cambia el viewport activo entre escritorio, tablet o móvil y resuelve los overrides de ese dispositivo."],
    steps: [["Choose a device.", "Elige un dispositivo."], ["Open Layout and set only the values that must differ.", "Abre Layout y define solo los valores que deban cambiar."], ["Clear the override to inherit the base value again.", "Borra el override para volver a heredar el valor base."]],
    example: ["Make a 3-column card become one column on mobile without duplicating it.", "Haz que una card de 3 columnas se convierta en una columna en móvil sin duplicarla."],
    demo: "responsive",
  },
  "canvas.align": {
    title: ["Align selection", "Alinear selección"],
    description: ["Aligns selected layers to their shared selection bounds, or a single layer to its parent frame.", "Alinea las capas seleccionadas a sus límites compartidos o una sola capa a su frame padre."],
    steps: [["Select one or more layers.", "Selecciona una o más capas."], ["Choose an edge or center axis.", "Elige un borde o eje central."], ["Use Undo once to revert the complete alignment.", "Usa Deshacer una vez para revertir la alineación completa."]],
    example: ["Center a dial and its label on the same vertical axis.", "Centra un dial y su etiqueta sobre el mismo eje vertical."],
    demo: "layout",
  },
  "canvas.grid": {
    title: ["Grid, rulers and guides", "Cuadrícula, reglas y guías"],
    description: ["Visual construction aids. The two guides are draggable and none of these aids export as part of the component.", "Ayudas visuales de construcción. Las dos guías se pueden arrastrar y ninguna de estas ayudas se exporta con el componente."],
    steps: [["Enable the aid you need and drag either guide into place.", "Activa la ayuda que necesites y arrastra cualquiera de las guías."], ["Use Snap to quantize to the grid and nearby guides.", "Usa Ajustar para cuantizar a la cuadrícula y a las guías cercanas."], ["Disable the aids to inspect the final surface.", "Desactiva las ayudas para revisar la superficie final."]],
    example: ["Place two cards on 16 px increments while keeping the grid out of export.", "Coloca dos cards en incrementos de 16 px sin exportar la cuadrícula."],
    demo: "layout",
  },
  "panel.layers": {
    title: ["Layer hierarchy", "Jerarquía de capas"],
    description: ["Controls nesting, paint order, visibility, locking and selection. Children move with their parent.", "Controla anidación, orden visual, visibilidad, bloqueo y selección. Los hijos se mueven con su padre."],
    steps: [["Drag a row onto a container to reparent it.", "Arrastra una fila a un contenedor para reubicarla."], ["Use Shift or Ctrl/Cmd for multiple selection.", "Usa Shift o Ctrl/Cmd para selección múltiple."], ["Rename important layers so variants can be understood.", "Renombra las capas importantes para entender las variantes."]],
    example: ["A door group can contain left panel, right panel, handles and shadows.", "Un grupo puerta puede contener panel izquierdo, derecho, tiradores y sombras."],
    demo: "component",
  },
  "inspector.design": {
    title: ["Design inspector", "Inspector de Diseño"],
    description: ["Edits content, geometry, transforms, vector points and typography for the selected layer.", "Edita contenido, geometría, transformaciones, puntos vectoriales y tipografía de la capa seleccionada."],
    steps: [["Select exactly the intended layer.", "Selecciona exactamente la capa deseada."], ["Change a value and inspect the canvas result.", "Cambia un valor y revisa el resultado en el lienzo."], ["Use the property track when that value is animated.", "Usa la pista de propiedad cuando ese valor esté animado."]],
    example: ["Rotate a door around a pivot placed on its hinge.", "Gira una puerta alrededor de un pivote colocado en su bisagra."],
    demo: "move",
  },
  "inspector.material": {
    title: ["Material inspector", "Inspector de Material"],
    description: ["Builds ordered fill and effect stacks that reproduce clay, glass, skeuomorphic and adaptive surfaces.", "Construye pilas ordenadas de rellenos y efectos para reproducir superficies clay, glass, skeuomorphic y adaptive."],
    steps: [["Start with a recipe or an empty stack.", "Empieza con una receta o una pila vacía."], ["Select one fill or effect and edit it.", "Selecciona un relleno o efecto y edítalo."], ["Reorder, hide or duplicate layers to compare results.", "Reordena, oculta o duplica capas para comparar resultados."]],
    example: ["Glass = translucent gradient + background blur + bright border + subtle noise.", "Glass = degradado translúcido + blur de fondo + borde luminoso + ruido sutil."],
    demo: "material",
  },
  "inspector.layout": {
    title: ["Layout inspector", "Inspector de Layout"],
    description: ["Controls free positioning, flex-like auto layout, grid, padding, gaps, sizing and responsive overrides.", "Controla posición libre, auto layout tipo flex, grid, padding, gaps, tamaños y overrides responsivos."],
    steps: [["Choose Free, Horizontal, Vertical or Grid.", "Elige Libre, Horizontal, Vertical o Grid."], ["Set alignment, gaps and padding.", "Define alineación, gaps y padding."], ["Test every device and add only necessary overrides.", "Prueba cada dispositivo y agrega solo los overrides necesarios."]],
    example: ["A horizontal button group can wrap into two rows on mobile.", "Un grupo horizontal de botones puede saltar a dos filas en móvil."],
    demo: "layout",
  },
  "inspector.component": {
    title: ["Components and variables", "Componentes y variables"],
    description: ["Turns a selection into reusable instances and exposes controlled properties or design variables.", "Convierte una selección en instancias reutilizables y expone propiedades controladas o variables de diseño."],
    steps: [["Create a component from a stable root selection.", "Crea un componente desde una selección raíz estable."], ["Expose only properties consumers should change.", "Expón solo las propiedades que deban cambiar los consumidores."], ["Insert instances from the Components panel.", "Inserta instancias desde el panel Componentes."]],
    example: ["Expose a button label and accent color while keeping its material structure synchronized.", "Expón la etiqueta y color de un botón manteniendo sincronizada su estructura material."],
    demo: "component",
  },
  "inspector.interactions": {
    title: ["States and interactions", "Estados e interacciones"],
    description: ["Connects visual variants to events. Smart transitions interpolate matching layers between states.", "Conecta variantes visuales con eventos. Las transiciones inteligentes interpolan capas coincidentes entre estados."],
    steps: [["Create and edit a visual state.", "Crea y edita un estado visual."], ["Add an interaction with a valid trigger, action and target.", "Agrega una interacción con disparador, acción y destino válidos."], ["Enter Preview and perform the real event.", "Entra en Vista previa y ejecuta el evento real."],
    ],
    example: ["Click Closed → animate both doors to Open around their own hinge pivots.", "Clic en Cerrada → anima ambas puertas a Abierta alrededor de sus pivotes de bisagra."],
    demo: "states",
  },
  "inspector.accessibility": {
    title: ["Accessibility", "Accesibilidad"],
    description: ["Defines semantic HTML, accessible naming, keyboard order and reduced-motion behavior for export.", "Define HTML semántico, nombre accesible, orden de teclado y movimiento reducido para exportación."],
    steps: [["Choose the correct semantic element.", "Elige el elemento semántico correcto."], ["Give interactive layers an accessible name and keyboard access.", "Da nombre accesible y acceso por teclado a las capas interactivas."], ["Resolve every warning before export.", "Resuelve cada advertencia antes de exportar."]],
    example: ["A visual launch card exports its action as a named keyboard-operable button.", "Una card visual de lanzamiento exporta su acción como botón con nombre y teclado."],
    demo: "accessibility",
  },
  "timeline.playback": {
    title: ["Timeline playback", "Reproducción de timeline"],
    description: ["Moves the playhead through the work area at the selected FPS, speed and direction.", "Mueve el cabezal por el área de trabajo con los FPS, velocidad y dirección elegidos."],
    steps: [["Set the In and Out range.", "Define el rango Entrada y Salida."], ["Scrub or press Play.", "Arrastra el cabezal o pulsa Reproducir."], ["Use Loop only when the exported motion should repeat.", "Usa Bucle solo cuando el movimiento exportado deba repetirse."],
    ],
    example: ["Preview a 0–1.2 s door opening loop at 60 FPS.", "Previsualiza una apertura de puerta de 0–1.2 s a 60 FPS."],
    demo: "timeline",
  },
  "timeline.keyframes": {
    title: ["Tracks and keyframes", "Pistas y keyframes"],
    description: ["A track owns one animatable property; keyframes store its values at specific times.", "Una pista controla una propiedad animable; los keyframes guardan sus valores en tiempos específicos."],
    steps: [["Select a layer and property.", "Selecciona una capa y propiedad."], ["Add a track, move the playhead, then add or edit a keyframe.", "Agrega una pista, mueve el cabezal y agrega o edita un keyframe."], ["Adjust its easing curve or spring.", "Ajusta su curva de easing o resorte."],
    ],
    example: ["Animate Rotate Y from 0° to 105° for a hinged door.", "Anima Rotate Y de 0° a 105° para una puerta con bisagra."],
    demo: "timeline",
    note: ["With Auto-key off, editing between existing keyframes is blocked to prevent invisible base edits.", "Con Auto-key apagado, editar entre keyframes existentes se bloquea para evitar cambios invisibles en la base."],
  },
  "export": {
    title: ["Preview and export", "Vista previa y exportación"],
    description: ["Preview runs interactions. Export generates web code and the Morphiq project keeps the editable source.", "Vista previa ejecuta interacciones. Exportar genera código web y el proyecto Morphiq conserva la fuente editable."],
    steps: [["Test every state and device in Preview.", "Prueba cada estado y dispositivo en Vista previa."], ["Resolve accessibility warnings.", "Resuelve las advertencias de accesibilidad."], ["Copy code for integration and download the project for future editing.", "Copia el código para integrarlo y descarga el proyecto para seguir editándolo."],
    ],
    example: ["Export a React component plus its CSS and keep the JSON project as the source file.", "Exporta un componente React y su CSS, conservando el proyecto JSON como archivo fuente."],
    demo: "export",
  },
};

const keywordTopics: { match: RegExp; topic: HelpTopic }[] = [
  { match: /(?:^|\s)(x|y|position|posición|width|height|ancho|alto|rotate|rotar|scale|escala|skew|voltear|flip)(?:\s|$)/i, topic: { title: ["Transform property", "Propiedad de transformación"], description: ["Changes the selected layer's position, dimensions or transform using an exact numeric value.", "Cambia la posición, dimensiones o transformación de la capa seleccionada con un valor numérico exacto."], steps: [["Select the intended layer.", "Selecciona la capa correcta."], ["Enter a value and press Enter or leave the field.", "Escribe un valor y pulsa Enter o sal del campo."], ["If the property has a timeline track, edit a keyframe or enable Auto-key.", "Si la propiedad tiene pista, edita un keyframe o activa Auto-key."]], example: ["Set Rotate Y to 105° with Pivot X at 0% to open a left-hinged door.", "Define Rotate Y en 105° y Pivot X en 0% para abrir una puerta con bisagra izquierda."], demo: "move" } },
  { match: /corner|radius|radio|suavizado|shape|forma|clip|recorte|vector|punto|bézier|perspective|perspectiva|pivot|pivote/i, topic: { title: ["Geometry property", "Propiedad de geometría"], description: ["Changes the actual silhouette, clipping boundary or transform origin of the selected layer.", "Cambia la silueta, límite de recorte u origen de transformación real de la capa seleccionada."], steps: [["Start with a simple shape.", "Empieza con una forma simple."], ["Change one geometry value at a time.", "Cambia un valor geométrico a la vez."], ["Use point editing for direct manipulation.", "Usa edición de puntos para manipulación directa."]], example: ["Move four clip points to form an asymmetric polymorphic card.", "Mueve cuatro puntos de recorte para formar una card polimórfica asimétrica."], demo: "shape" } },
  { match: /fill|relleno|gradient|degradado|color|opacity|opacidad|shadow|sombra|blur|glow|brillo|noise|ruido|texture|textura|blend|mezcla|stroke|borde/i, topic: topics["inspector.material"] },
  { match: /layout|padding|gap|align|alineación|justify|grid|column|columna|row|fila|constraint|responsive|responsivo|min|max|wrap/i, topic: topics["inspector.layout"] },
  { match: /variant|variante|state|estado|trigger|disparador|transition|transición|easing|curva|duration|duración|delay|retraso|interaction|interacción/i, topic: topics["inspector.interactions"] },
  { match: /track|pista|keyframe|playhead|cabezal|fps|loop|bucle|spring|resorte|stagger|escalonar|timeline/i, topic: topics["timeline.keyframes"] },
  { match: /aria|semantic|semánt|tab index|decorative|decorativa|reduced motion|movimiento reducido|accessible|accesib/i, topic: topics["inspector.accessibility"] },
  { match: /component|componente|variable|binding|enlace|instance|instancia|property|propiedad expuesta/i, topic: topics["inspector.component"] },
];

function fallbackTopic(label: string): HelpTopic {
  const inferred = keywordTopics.find(({ match }) => match.test(label))?.topic;
  if (inferred) return { ...inferred, title: [label, label] };
  return {
    title: [label, label],
    description: ["Controls this property or action for the current selection. The result is applied to the canvas and kept in the editable project.", "Controla esta propiedad o acción de la selección actual. El resultado se aplica al lienzo y queda guardado en el proyecto editable."],
    steps: [["Check the current selection and editing context.", "Revisa la selección y el contexto de edición."], ["Change the control and inspect the canvas.", "Cambia el control y revisa el lienzo."], ["Use Undo if the result is not intended.", "Usa Deshacer si el resultado no es el esperado."]],
    example: ["Try a small change first so its visual effect is easy to verify.", "Prueba primero un cambio pequeño para verificar fácilmente su efecto visual."],
    demo: "generic",
  };
}

function resolveTopic(request: HelpRequest) {
  return (request.topic && topics[request.topic]) || fallbackTopic(request.label);
}

export function StudioHelpProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const [request, setRequest] = useState<HelpRequest | null>(null);
  const topic = useMemo(() => request ? resolveTopic(request) : null, [request]);
  useEffect(() => {
    if (!request) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setRequest(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [request]);
  return <HelpContext.Provider value={{ openHelp: setRequest }}>
    {children}
    {request && topic && <div className="v5-help-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setRequest(null); }}>
      <aside aria-labelledby="v5-help-title" aria-modal="true" className="v5-help-drawer" role="dialog">
        <header><div><span>{tr(locale, "CONTEXT HELP", "AYUDA CONTEXTUAL")}</span><h2 id="v5-help-title">{topic.title[locale === "es" ? 1 : 0]}</h2></div><button aria-label={tr(locale, "Close help", "Cerrar ayuda")} onClick={() => setRequest(null)} type="button"><X size={15} /></button></header>
        <div className="v5-help-content">
          <p>{topic.description[locale === "es" ? 1 : 0]}</p>
          <section><h3>{tr(locale, "How it works", "Cómo funciona")}</h3><ol>{topic.steps.map((step, index) => <li key={index}>{step[locale === "es" ? 1 : 0]}</li>)}</ol></section>
          <section><h3>{tr(locale, "Animated example", "Ejemplo animado")}</h3><HelpDemo kind={topic.demo} /><p className="v5-help-example">{topic.example[locale === "es" ? 1 : 0]}</p></section>
          {topic.note && <div className="v5-help-note"><b>{tr(locale, "Important", "Importante")}</b><span>{topic.note[locale === "es" ? 1 : 0]}</span></div>}
        </div>
      </aside>
    </div>}
  </HelpContext.Provider>;
}

export function HelpButton({ className = "", label, topic }: { className?: string; label: string; topic?: string }) {
  const context = useContext(HelpContext);
  if (!context) return null;
  const click = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    context.openHelp({ label, topic });
  };
  return <button aria-label={`${label} — ?`} className={`v5-help-button ${className}`} onClick={click} title="?" type="button"><CircleHelp aria-hidden="true" size={10} /></button>;
}

export function Helpable({ children, label, topic }: { children: ReactNode; label: string; topic?: string }) {
  return <span className="v5-helpable">{children}<HelpButton label={label} topic={topic} /></span>;
}

function HelpDemo({ kind }: { kind: DemoKind }) {
  return <div aria-hidden="true" className={`v5-help-demo v5-help-demo-${kind}`}>
    {kind === "timeline" ? <><i className="v5-help-track" /><b className="v5-help-keyframe first" /><b className="v5-help-keyframe last" /><em className="v5-help-playhead" /><span className="v5-help-demo-object" /></> :
      kind === "layout" ? <><span className="v5-help-layout-frame"><i /><i /><i /></span><b className="v5-help-axis" /></> :
      kind === "responsive" ? <><span className="v5-help-device desktop"><i /><i /><i /></span><b>→</b><span className="v5-help-device mobile"><i /><i /><i /></span></> :
      kind === "states" ? <><span className="v5-help-door left" /><span className="v5-help-door right" /><i className="v5-help-hinge left" /><i className="v5-help-hinge right" /></> :
      kind === "material" ? <><span className="v5-help-material-card"><i /><b /></span><em /></> :
      kind === "component" ? <><span className="v5-help-component-frame"><i /><b /><em /></span><span className="v5-help-component-instance"><i /><b /><em /></span></> :
      kind === "accessibility" ? <><span className="v5-help-focus-ring"><b>↵</b></span><i className="v5-help-check">✓</i></> :
      kind === "export" ? <><span className="v5-help-code"><i /><i /><i /><i /></span><b>→</b><span className="v5-help-export-card" /></> :
      kind === "shape" ? <><svg viewBox="0 0 120 72"><path d="M18 54 C10 28, 28 9, 57 18 C80 4, 110 18, 102 49 C89 70, 44 66, 18 54 Z" /><circle cx="18" cy="54" r="3" /><circle cx="57" cy="18" r="3" /><circle cx="102" cy="49" r="3" /></svg></> :
      <><span className="v5-help-demo-object" /><i className="v5-help-demo-arrow">→</i></>}
  </div>;
}
