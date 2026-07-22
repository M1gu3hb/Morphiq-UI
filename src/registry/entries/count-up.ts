import { CountUpPreview } from "@/registry/previews/count-up-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "count-up",
  name: "Count Up",
  nameEs: "Contador ascendente",
  category: "text",
  materials: ["adaptive"],
  description: "A locale-aware number that counts to a formatted target on mount or intersection, with prefix, suffix, decimals and zero layout shift.",
  descriptionEs: "Un número sensible al locale que cuenta hasta un objetivo formateado al montar o entrar en vista, con prefijo, sufijo, decimales y cero desplazamiento de layout.",
  variants: [
    { id: "integer", label: "Integer", labelEs: "Entero" },
    { id: "decimal", label: "Decimal", labelEs: "Decimal" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The final locale-formatted value is present in a screen-reader-only node from the first render. Changing visual digits are aria-hidden, so assistive technology never hears every frame. An invisible final-value layer reserves exact width and prevents CLS. prefers-reduced-motion displays a dedicated final visual layer immediately and the effect also resolves its state without traversing intermediate values. forced-colors exposes the same final text in CanvasText. Typography and color inherit; the host must provide at least 4.5:1 contrast.",
  a11yEs: "El valor final formateado según locale está presente en un nodo solo para lectores desde el primer render. Los dígitos visuales cambiantes usan aria-hidden, así que la tecnología asistiva no oye cada frame. Una capa invisible con el valor final reserva el ancho exacto y evita CLS. prefers-reduced-motion muestra de inmediato una capa visual final y el efecto también resuelve su estado sin recorrer valores intermedios. forced-colors expone el mismo texto final en CanvasText. Tipografía y color se heredan; el host debe aportar al menos 4,5:1 de contraste.",
  sourcePath: "src/registry/ui/count-up.tsx",
  Preview: CountUpPreview,
};
