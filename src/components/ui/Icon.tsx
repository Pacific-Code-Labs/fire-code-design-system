import * as React from "react";
import {
  icons as lucideIcons,
  Flame,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Icon — the single, registry-driven resolver for FireCode iconography.
 *
 * Per the Blue Book (FCR-002 §4): icons are `lucide-react`, resolved through a
 * registry by string name (`iconName` → component) so content/config can pick
 * an icon without importing component references, and we never hardcode an icon
 * per id. The brand motif is `Flame`.
 *
 * Naming: lucide's canonical PascalCase keys (e.g. `"Flame"`, `"ShieldCheck"`)
 * are accepted directly. For ergonomics we also accept kebab/camel input
 * (`"shield-check"`, `"shieldCheck"`) and a handful of short aliases used across
 * the POS family (`"close"`, `"trash"`, `"warning"`…). Unknown names fall back
 * to the brand `Flame` (dev-warned once) so a typo never crashes a screen.
 */

/** Short, intent-named aliases → lucide PascalCase keys. */
const ALIASES: Record<string, string> = {
  close: "X",
  menu: "Menu",
  check: "Check",
  plus: "Plus",
  minus: "Minus",
  add: "Plus",
  remove: "Trash2",
  trash: "Trash2",
  delete: "Trash2",
  edit: "Pencil",
  save: "Save",
  search: "Search",
  filter: "Filter",
  settings: "Settings",
  user: "User",
  users: "Users",
  warning: "TriangleAlert",
  alert: "TriangleAlert",
  alertTri: "TriangleAlert",
  alertCircle: "CircleAlert",
  info: "Info",
  success: "CircleCheck",
  checkCircle: "CircleCheck",
  error: "CircleX",
  xCircle: "CircleX",
  upload: "Upload",
  download: "Download",
  copy: "Copy",
  eye: "Eye",
  eyeOff: "EyeOff",
  lock: "Lock",
  unlock: "LockOpen",
  logIn: "LogIn",
  logOut: "LogOut",
  shield: "Shield",
  home: "House",
  chevronLeft: "ChevronLeft",
  chevronRight: "ChevronRight",
  chevronDown: "ChevronDown",
  chevronUp: "ChevronUp",
  chevronsLeft: "ChevronsLeft",
  chevronsRight: "ChevronsRight",
  arrowLeft: "ArrowLeft",
  arrowRight: "ArrowRight",
  more: "Ellipsis",
  moreV: "EllipsisVertical",
  sun: "Sun",
  moon: "Moon",
  refresh: "RefreshCw",
  flame: "Flame",
  fire: "Flame",
};

const warned = new Set<string>();

/** Best-effort dev detection without relying on bundler-specific globals (or @types/node:
 *  consumers compile this source with their own tsconfig). */
function isDev(): boolean {
  try {
    const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env;
    return !!env && env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}

/** Normalize arbitrary casing (kebab/camel/snake) to lucide PascalCase. */
function toPascal(name: string): string {
  return name
    .replace(/[_\s]+/g, "-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Resolve a string name to a lucide component. Tries: exact PascalCase key →
 * alias table → normalized PascalCase. Returns `Flame` (brand) on miss.
 */
export function resolveIcon(name: string): LucideIcon {
  const registry = lucideIcons as unknown as Record<string, LucideIcon>;
  if (registry[name]) return registry[name];

  const aliased = ALIASES[name];
  if (aliased && registry[aliased]) return registry[aliased];

  const pascal = toPascal(name);
  if (registry[pascal]) return registry[pascal];

  if (isDev() && !warned.has(name)) {
    warned.add(name);
    // eslint-disable-next-line no-console
    console.warn(`[FireCode Icon] unknown icon "${name}" — falling back to Flame.`);
  }
  return Flame;
}

export interface IconProps extends Omit<LucideProps, "ref"> {
  /** Icon name: lucide PascalCase, an alias, or kebab/camel-case. */
  name: string;
  /** Pixel size (width === height). Defaults to 18 to match UI density. */
  size?: number;
}

/**
 * Render a registry-resolved lucide icon. Stroke inherits `currentColor`, so
 * colour is driven by the surrounding token-mapped text colour.
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 18, strokeWidth = 2, className, ...rest }, ref) => {
    const Cmp = resolveIcon(name);
    return (
      <Cmp
        ref={ref}
        size={size}
        strokeWidth={strokeWidth}
        className={cn("shrink-0", className)}
        aria-hidden="true"
        {...rest}
      />
    );
  }
);
Icon.displayName = "Icon";
