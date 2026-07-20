import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves Tailwind conflicts.
 *
 * `clsx` flattens conditionals/arrays/objects; `twMerge` then keeps only the
 * last of any conflicting Tailwind utilities so a caller's `className` can
 * always override a component's defaults.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
