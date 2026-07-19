import type { StyleSlug } from "@/lib/component-data";

export type LibraryCategory = "actions" | "cards" | "navigation" | "feedback" | "media" | "loaders";
export type MotionPreset = "press" | "float" | "pulse" | "shimmer" | "orbit" | "scan" | "morph" | "slide" | "tilt" | "breathe" | "bounce" | "wave";

export type LibraryComponent = {
  slug: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  category: LibraryCategory;
  style: StyleSlug;
  motion: MotionPreset;
  defaultText: string;
  defaultTextEs: string;
  accent: string;
};

export const libraryComponents: LibraryComponent[] = [
  { slug: "clay-launch", name: "Clay launch", nameEs: "Lanzamiento clay", description: "Inflated CTA with physical press depth.", descriptionEs: "CTA inflado con profundidad física al presionar.", category: "actions", style: "clay", motion: "press", defaultText: "Launch now", defaultTextEs: "Lanzar ahora", accent: "#ff8068" },
  { slug: "gel-download", name: "Gel download", nameEs: "Descarga gel", description: "A soft download action with a liquid bounce.", descriptionEs: "Acción de descarga suave con rebote líquido.", category: "actions", style: "clay", motion: "bounce", defaultText: "Get the kit", defaultTextEs: "Obtener el kit", accent: "#9c89ff" },
  { slug: "glass-command", name: "Glass command", nameEs: "Comando de vidrio", description: "Compact command action over live backdrops.", descriptionEs: "Acción compacta de comando sobre fondos vivos.", category: "actions", style: "glass", motion: "shimmer", defaultText: "Run command", defaultTextEs: "Ejecutar comando", accent: "#73d4ff" },
  { slug: "adaptive-split", name: "Adaptive split", nameEs: "Acción dividida", description: "A context-aware primary and secondary action.", descriptionEs: "Acción primaria y secundaria sensible al contexto.", category: "actions", style: "adaptive", motion: "slide", defaultText: "Create project", defaultTextEs: "Crear proyecto", accent: "#d8ff66" },
  { slug: "prism-balance", name: "Prism balance", nameEs: "Balance prisma", description: "Frosted financial card with controlled contrast.", descriptionEs: "Tarjeta financiera esmerilada con contraste controlado.", category: "cards", style: "glass", motion: "tilt", defaultText: "$24,880", defaultTextEs: "$24,880", accent: "#73d4ff" },
  { slug: "clay-profile", name: "Clay profile", nameEs: "Perfil clay", description: "Friendly identity card with molded avatar.", descriptionEs: "Tarjeta de identidad amigable con avatar moldeado.", category: "cards", style: "clay", motion: "float", defaultText: "Creative director", defaultTextEs: "Director creativo", accent: "#ff9e89" },
  { slug: "skeuo-ticket", name: "Studio ticket", nameEs: "Boleto de estudio", description: "A tactile event pass with perforated detail.", descriptionEs: "Pase táctil para eventos con detalle perforado.", category: "cards", style: "skeuo", motion: "breathe", defaultText: "ADMIT ONE", defaultTextEs: "ACCESO UNO", accent: "#f2c96d" },
  { slug: "adaptive-stat", name: "Adaptive stat", nameEs: "Estadística adaptable", description: "Metric card that changes density with its container.", descriptionEs: "Tarjeta métrica que cambia densidad según su contenedor.", category: "cards", style: "adaptive", motion: "pulse", defaultText: "+28.4%", defaultTextEs: "+28.4%", accent: "#d8ff66" },
  { slug: "glass-dock", name: "Frosted dock", nameEs: "Dock esmerilado", description: "Floating navigation with magnified active state.", descriptionEs: "Navegación flotante con estado activo magnificado.", category: "navigation", style: "glass", motion: "float", defaultText: "Explore", defaultTextEs: "Explorar", accent: "#9c89ff" },
  { slug: "molded-tabs", name: "Molded tabs", nameEs: "Pestañas moldeadas", description: "Chunky tab group with a pressed selection.", descriptionEs: "Grupo robusto de pestañas con selección presionada.", category: "navigation", style: "clay", motion: "slide", defaultText: "Overview", defaultTextEs: "Resumen", accent: "#ff8068" },
  { slug: "metal-segment", name: "Metal segment", nameEs: "Segmento metálico", description: "Machined segmented control with indicator rail.", descriptionEs: "Control segmentado mecanizado con riel indicador.", category: "navigation", style: "skeuo", motion: "slide", defaultText: "Studio", defaultTextEs: "Estudio", accent: "#ff7459" },
  { slug: "context-breadcrumb", name: "Context breadcrumb", nameEs: "Ruta contextual", description: "Breadcrumb that collapses intelligently.", descriptionEs: "Ruta de navegación que colapsa de forma inteligente.", category: "navigation", style: "adaptive", motion: "morph", defaultText: "Components / Cards", defaultTextEs: "Componentes / Tarjetas", accent: "#d8ff66" },
  { slug: "liquid-toast", name: "Liquid toast", nameEs: "Aviso líquido", description: "Glass notification with a traveling highlight.", descriptionEs: "Notificación de vidrio con brillo en movimiento.", category: "feedback", style: "glass", motion: "shimmer", defaultText: "Project saved", defaultTextEs: "Proyecto guardado", accent: "#73d4ff" },
  { slug: "clay-success", name: "Clay success", nameEs: "Éxito clay", description: "Celebratory confirmation with soft spring motion.", descriptionEs: "Confirmación celebratoria con movimiento de resorte suave.", category: "feedback", style: "clay", motion: "bounce", defaultText: "All done", defaultTextEs: "Todo listo", accent: "#78dd9a" },
  { slug: "physical-alert", name: "Physical alert", nameEs: "Alerta física", description: "Safety panel inspired by real control hardware.", descriptionEs: "Panel de seguridad inspirado en hardware de control real.", category: "feedback", style: "skeuo", motion: "pulse", defaultText: "Check system", defaultTextEs: "Revisar sistema", accent: "#ff7459" },
  { slug: "adaptive-tooltip", name: "Adaptive tooltip", nameEs: "Tooltip adaptable", description: "Tooltip that becomes a touch sheet on small screens.", descriptionEs: "Tooltip que se convierte en hoja táctil en pantallas pequeñas.", category: "feedback", style: "adaptive", motion: "morph", defaultText: "More context", defaultTextEs: "Más contexto", accent: "#d8ff66" },
  { slug: "frosted-player", name: "Frosted player", nameEs: "Reproductor esmerilado", description: "Compact audio player with crystalline controls.", descriptionEs: "Reproductor de audio compacto con controles cristalinos.", category: "media", style: "glass", motion: "wave", defaultText: "Soft focus", defaultTextEs: "Enfoque suave", accent: "#9c89ff" },
  { slug: "clay-recorder", name: "Clay recorder", nameEs: "Grabadora clay", description: "Molded record control with breathing status light.", descriptionEs: "Control de grabación moldeado con luz de estado respirante.", category: "media", style: "clay", motion: "breathe", defaultText: "Recording", defaultTextEs: "Grabando", accent: "#ff7459" },
  { slug: "studio-dial", name: "Studio dial", nameEs: "Dial de estudio", description: "Rotary volume component with machined depth.", descriptionEs: "Componente giratorio de volumen con profundidad mecanizada.", category: "media", style: "skeuo", motion: "orbit", defaultText: "VOLUME 62", defaultTextEs: "VOLUMEN 62", accent: "#ff7459" },
  { slug: "responsive-gallery", name: "Responsive gallery", nameEs: "Galería responsiva", description: "Media strip that reshapes around available width.", descriptionEs: "Tira multimedia que se transforma según el ancho disponible.", category: "media", style: "adaptive", motion: "tilt", defaultText: "View story", defaultTextEs: "Ver historia", accent: "#d8ff66" },
  { slug: "orbital-loader", name: "Orbital loader", nameEs: "Cargador orbital", description: "Layered glass orbits with low-cost transforms.", descriptionEs: "Órbitas de vidrio por capas con transformaciones eficientes.", category: "loaders", style: "glass", motion: "orbit", defaultText: "Loading", defaultTextEs: "Cargando", accent: "#73d4ff" },
  { slug: "clay-dots", name: "Clay dots", nameEs: "Puntos clay", description: "Three soft shapes with staggered bounce.", descriptionEs: "Tres formas suaves con rebote escalonado.", category: "loaders", style: "clay", motion: "bounce", defaultText: "Working", defaultTextEs: "Procesando", accent: "#ff8068" },
  { slug: "meter-loader", name: "Meter loader", nameEs: "Medidor de carga", description: "Physical progress meter with a moving needle.", descriptionEs: "Medidor físico de progreso con aguja en movimiento.", category: "loaders", style: "skeuo", motion: "scan", defaultText: "72%", defaultTextEs: "72%", accent: "#ff7459" },
  { slug: "morph-loader", name: "Morph loader", nameEs: "Cargador morph", description: "Adaptive blob that changes shape without layout shift.", descriptionEs: "Forma adaptable que cambia sin provocar saltos de layout.", category: "loaders", style: "adaptive", motion: "morph", defaultText: "Building", defaultTextEs: "Construyendo", accent: "#d8ff66" },
];
