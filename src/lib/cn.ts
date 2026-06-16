/**
 * `cn` — the canonical class-name combiner for FireCode primitives.
 *
 * `clsx` resolves conditional/array/object class inputs; `tailwind-merge` then
 * dedupes conflicting Tailwind utilities so a caller's `className` always wins
 * over a component's defaults (e.g. passing `px-2` overrides a built-in `px-4`).
 * Every primitive funnels its classes through this so overrides are predictable.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
