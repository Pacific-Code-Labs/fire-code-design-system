/**
 * FireCode CR theme registry.
 *
 * Each `ThemeDef` carries a `light` and a `dark` `TokenMap` over the SAME token
 * contract defined in `../tokens/contract.ts`, plus `radius` and `fonts`, so
 * `applyTheme(themeId, isDark)` can write each entry onto
 * `document.documentElement` and lazily inject the theme's Google Fonts.
 *
 * The `firecode` theme is the brand default and mirrors `tokens.css` /
 * `BLUE-BOOK.md` exactly (so selecting it is a visual no-op against the static
 * stylesheet). `firecode-light` is a light-first demo/alt variant that swaps the
 * default mode emphasis — useful for the theme gallery and for orgs that prefer
 * a light surface. Add new org/CMS themes here keyed by a stable id.
 *
 * Colour values are HSL channel triples; gradient/shadow values are full CSS.
 * Dark is the product default (`<html class="dark">`).
 */

import { type TokenMap } from "../tokens/contract";

export interface ThemeFonts {
  /** Value written to `--font-sans`. */
  sans: string;
  /** Value written to `--font-display`. */
  display: string;
  /** Google Fonts family specs to lazily inject as <link>s (deduped). */
  googleFonts: string[];
}

export interface ThemeDef {
  /** Stable id (matches an org/CMS theme value). */
  id: string;
  /** Human-readable label (gallery / settings UI). */
  name: string;
  fonts: ThemeFonts;
  /** Value written to `--radius`. */
  radius: string;
  light: TokenMap;
  dark: TokenMap;
}

// Brand fonts per Blue Book §3 (technical grotesque body, condensed display).
const FIRECODE_FONTS: ThemeFonts = {
  sans: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  display: '"Barlow Condensed", "Barlow", "Arial Narrow", sans-serif',
  googleFonts: ["Inter:wght@400;500;600;700;800", "Barlow+Condensed:wght@600;700;800"],
};

// ─── Light token map (mirrors tokens.css :root) ──────────────────────────────
const FIRECODE_LIGHT: TokenMap = {
  background: "0 0% 100%",
  foreground: "222 47% 11%",
  card: "0 0% 100%",
  "card-foreground": "222 47% 11%",
  popover: "0 0% 100%",
  "popover-foreground": "222 47% 11%",
  primary: "8 90% 54%",
  "primary-foreground": "0 0% 100%",
  "primary-glow": "8 95% 62%",
  secondary: "210 40% 96%",
  "secondary-foreground": "222 47% 11%",
  muted: "210 40% 96%",
  "muted-foreground": "215 16% 42%",
  accent: "200 95% 45%",
  "accent-foreground": "0 0% 100%",
  destructive: "0 84% 55%",
  "destructive-foreground": "0 0% 100%",
  border: "214 32% 88%",
  input: "214 32% 90%",
  ring: "8 90% 54%",
  "cat-initiation": "0 84% 55%",
  "cat-notification": "42 95% 48%",
  "cat-monitoring": "210 95% 50%",
  "cat-actuation": "142 70% 40%",
  "risk-high": "0 84% 55%",
  "risk-medium": "38 92% 48%",
  "risk-low": "142 65% 40%",
  "sidebar-background": "210 40% 98%",
  "sidebar-foreground": "222 30% 25%",
  "sidebar-primary": "8 90% 54%",
  "sidebar-primary-foreground": "0 0% 100%",
  "sidebar-accent": "210 40% 94%",
  "sidebar-accent-foreground": "222 47% 11%",
  "sidebar-border": "214 32% 88%",
  "sidebar-ring": "8 90% 54%",
  "gradient-hero":
    "radial-gradient(ellipse at top, hsl(8 90% 54% / 0.10), transparent 60%), linear-gradient(180deg, hsl(0 0% 100%), hsl(210 40% 98%))",
  "gradient-panel": "linear-gradient(160deg, hsl(0 0% 100%), hsl(210 40% 98%))",
  "shadow-glow":
    "0 0 0 1px hsl(8 90% 54% / 0.20), 0 12px 40px -12px hsl(8 90% 54% / 0.30)",
  "shadow-panel": "0 10px 30px -15px hsl(222 47% 11% / 0.15)",
};

// ─── Dark token map (mirrors tokens.css .dark — product default) ─────────────
const FIRECODE_DARK: TokenMap = {
  background: "222 30% 7%",
  foreground: "210 40% 96%",
  card: "222 28% 10%",
  "card-foreground": "210 40% 96%",
  popover: "222 28% 10%",
  "popover-foreground": "210 40% 96%",
  primary: "8 90% 58%",
  "primary-foreground": "0 0% 100%",
  "primary-glow": "8 95% 65%",
  secondary: "222 25% 14%",
  "secondary-foreground": "210 40% 96%",
  muted: "222 22% 14%",
  "muted-foreground": "215 18% 65%",
  accent: "200 95% 55%",
  "accent-foreground": "222 47% 8%",
  destructive: "0 84% 60%",
  "destructive-foreground": "0 0% 100%",
  border: "222 25% 18%",
  input: "222 25% 16%",
  ring: "8 90% 58%",
  "cat-initiation": "0 84% 60%",
  "cat-notification": "42 95% 58%",
  "cat-monitoring": "210 95% 60%",
  "cat-actuation": "142 70% 48%",
  "risk-high": "0 84% 60%",
  "risk-medium": "38 92% 55%",
  "risk-low": "142 65% 48%",
  "sidebar-background": "222 32% 6%",
  "sidebar-foreground": "210 30% 80%",
  "sidebar-primary": "8 90% 58%",
  "sidebar-primary-foreground": "0 0% 100%",
  "sidebar-accent": "222 25% 12%",
  "sidebar-accent-foreground": "210 40% 96%",
  "sidebar-border": "222 25% 14%",
  "sidebar-ring": "8 90% 58%",
  "gradient-hero":
    "radial-gradient(ellipse at top, hsl(8 90% 58% / 0.18), transparent 60%), linear-gradient(180deg, hsl(222 30% 7%), hsl(222 35% 5%))",
  "gradient-panel": "linear-gradient(160deg, hsl(222 28% 11%), hsl(222 30% 8%))",
  "shadow-glow":
    "0 0 0 1px hsl(8 90% 58% / 0.25), 0 12px 40px -12px hsl(8 90% 58% / 0.45)",
  "shadow-panel": "0 10px 30px -15px hsl(0 0% 0% / 0.6)",
};

/** Brand default — the canonical Blue Book palette (dark-first). */
const firecode: ThemeDef = {
  id: "firecode",
  name: "FireCode CR",
  fonts: FIRECODE_FONTS,
  radius: "0.6rem",
  light: FIRECODE_LIGHT,
  dark: FIRECODE_DARK,
};

/**
 * Light-first demo / alternate variant. Same brand palette, but tuned so the
 * light map leads (slightly cooler surfaces) — used in the theme gallery and as
 * a sensible alt for orgs that prefer a light surface. Dark map reuses the brand
 * dark so toggling dark mode stays on-brand.
 */
const firecodeLight: ThemeDef = {
  id: "firecode-light",
  name: "FireCode Light",
  fonts: FIRECODE_FONTS,
  radius: "0.6rem",
  light: {
    ...FIRECODE_LIGHT,
    background: "210 40% 99%",
    secondary: "210 40% 94%",
    muted: "210 40% 94%",
    "sidebar-background": "0 0% 100%",
    "gradient-hero":
      "radial-gradient(ellipse at top, hsl(200 95% 45% / 0.08), transparent 60%), linear-gradient(180deg, hsl(210 40% 99%), hsl(210 40% 96%))",
  },
  dark: FIRECODE_DARK,
};

/** All themes keyed by id. */
export const THEMES: Record<string, ThemeDef> = {
  firecode,
  "firecode-light": firecodeLight,
};

/** Ordered theme list for galleries — default first. */
export const THEME_LIST: ThemeDef[] = [firecode, firecodeLight];

/** Fallback theme id when an org has no theme / an unknown one. */
export const DEFAULT_THEME_ID = "firecode";

/** Type guard: is `id` a known theme id? */
export function isKnownThemeId(id: string | undefined | null): id is string {
  return !!id && id in THEMES;
}

/** Resolve a theme by id, falling back to the default. */
export function getTheme(id: string | undefined | null): ThemeDef {
  return (id && THEMES[id]) || THEMES[DEFAULT_THEME_ID];
}
