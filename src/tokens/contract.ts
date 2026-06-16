/**
 * The Blue Book token contract, expressed as TypeScript.
 *
 * `TOKEN_NAMES` is the canonical, ordered list of every CSS custom property a
 * theme map MUST define. `applyTheme` iterates this list and writes
 * `--${name}` onto `document.documentElement`. Keep this list, `tokens.css`,
 * and `BLUE-BOOK.md` in lockstep — adding a token means touching all three.
 *
 * Values are HSL channel triples ("H S% L%"), except the `--gradient-*` and
 * `--shadow-*` tokens which are full CSS values (they wrap `hsl(...)` inline).
 */

/** Every colour token expressed as an HSL channel triple. */
export type ColorTokenName =
  // Core semantic
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "primary-glow"
  | "secondary"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "destructive-foreground"
  | "border"
  | "input"
  | "ring"
  // Domain: fire-protection categories
  | "cat-initiation"
  | "cat-notification"
  | "cat-monitoring"
  | "cat-actuation"
  // Risk
  | "risk-high"
  | "risk-medium"
  | "risk-low"
  // Sidebar family
  | "sidebar-background"
  | "sidebar-foreground"
  | "sidebar-primary"
  | "sidebar-primary-foreground"
  | "sidebar-accent"
  | "sidebar-accent-foreground"
  | "sidebar-border"
  | "sidebar-ring";

/** Full-CSS-value tokens (gradients + shadows). */
export type EffectTokenName =
  | "gradient-hero"
  | "gradient-panel"
  | "shadow-glow"
  | "shadow-panel";

export type TokenName = ColorTokenName | EffectTokenName;

/** A complete per-mode token map: every token → its CSS value string. */
export type TokenMap = Record<TokenName, string>;

/**
 * Canonical ordered list of every token a theme map must define.
 * `applyTheme` writes exactly these (plus `--radius`, `--font-sans`,
 * `--font-display`) onto `:root`.
 */
export const TOKEN_NAMES: TokenName[] = [
  // Core semantic
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "primary-glow",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  // Domain
  "cat-initiation",
  "cat-notification",
  "cat-monitoring",
  "cat-actuation",
  // Risk
  "risk-high",
  "risk-medium",
  "risk-low",
  // Sidebar
  "sidebar-background",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  // Effects
  "gradient-hero",
  "gradient-panel",
  "shadow-glow",
  "shadow-panel",
];
