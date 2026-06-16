/**
 * Runtime theme application.
 *
 * `applyTheme(themeId, isDark)` writes every token from the resolved theme's
 * `light` / `dark` `TokenMap` onto `document.documentElement` as
 * `--${token}` custom properties (plus `--radius`, `--font-sans`,
 * `--font-display`), and lazily injects the theme's Google Fonts <link>s,
 * deduped by href so repeated theme switches don't pile up duplicates.
 *
 * SSR-safe: no-ops when `document` is unavailable.
 */

import { TOKEN_NAMES } from "../tokens/contract";
import { DEFAULT_THEME_ID, THEMES, type ThemeDef } from "./themes";

/** Hrefs already injected this session — dedupe across theme switches. */
const injectedFontHrefs = new Set<string>();

/**
 * Lazily inject the Google Font <link>s a theme needs into <head>. Deduped by
 * href so repeated theme switches don't add duplicate links.
 */
export function ensureGoogleFonts(families: string[]): void {
  if (typeof document === "undefined" || families.length === 0) return;
  const query = families.map((f) => `family=${f}`).join("&");
  const href = `https://fonts.googleapis.com/css2?${query}&display=swap`;
  if (injectedFontHrefs.has(href)) return;
  if (document.querySelector(`link[href="${href}"]`)) {
    injectedFontHrefs.add(href);
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
  injectedFontHrefs.add(href);
}

/**
 * Write a theme's variable map onto :root for the given mode, plus radius and
 * fonts, and ensure the theme's web fonts are loaded.
 *
 * @param themeId  A known theme id (falls back to the default if unknown).
 * @param isDark   Whether the dark token map should be applied.
 */
export function applyTheme(themeId: string, isDark: boolean): void {
  if (typeof document === "undefined") return;
  const theme: ThemeDef = THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID];
  const root = document.documentElement;
  const vars = isDark ? theme.dark : theme.light;

  for (const token of TOKEN_NAMES) {
    root.style.setProperty(`--${token}`, vars[token]);
  }

  root.style.setProperty("--radius", theme.radius);
  root.style.setProperty("--font-sans", theme.fonts.sans);
  root.style.setProperty("--font-display", theme.fonts.display);

  ensureGoogleFonts(theme.fonts.googleFonts);
}
