/**
 * ThemeProvider / ThemeContext / useTheme.
 *
 * App-agnostic theme provider for the Sóköl design system. It does NOT know
 * about Cognito, TanStack Query, or any specific CMS — the org/CMS theme value
 * is injected by the host via the `orgThemeId` prop (or the `resolveOrgThemeId`
 * callback), keeping this package free of app dependencies.
 *
 * ── Resolution order (highest wins) ──────────────────────────────────────────
 *   1. OVERRIDE        — a runtime selection (`setThemeId`), e.g. theme gallery.
 *   2. ORG / CMS theme — `orgThemeId` prop or `resolveOrgThemeId()` result
 *                        (sourced by the host from org config / themes.json).
 *   3. DEFAULT         — `DEFAULT_THEME_ID` ("sokol").
 *
 * Dark mode is supplied by the host (`isDark` prop / `resolveIsDark`), since
 * each app already owns its light/dark toggle. Defaults to dark (product
 * default per the Blue Book). The provider mirrors the resolved theme to
 * localStorage for instant first-paint next load.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyTheme } from "./applyTheme";
import {
  DEFAULT_THEME_ID,
  THEMES,
  isKnownThemeId,
  type ThemeDef,
} from "./themes";

const STORAGE_KEY = "sokol.themeId";

export interface ThemeContextValue {
  /** The active, resolved theme id (always a known id). */
  themeId: string;
  /** The resolved theme definition. */
  theme: ThemeDef;
  /** Whether dark mode is currently applied. */
  isDark: boolean;
  /** Set a runtime OVERRIDE (instant live apply on selection). */
  setThemeId: (id: string) => void;
  /** Clear the override so org/CMS → default resolution resumes. */
  clearOverride: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Org/CMS-supplied theme id (resolution tier 2). Pass the value the host read
   * from org config / `themes.json`. `undefined`/`null`/unknown → falls through
   * to the default. Reactive: changing it re-resolves the theme.
   */
  orgThemeId?: string | null;
  /**
   * Alternative to `orgThemeId` for hosts that resolve the org theme lazily
   * (e.g. from a hook). Called on every render; its result is used as tier 2
   * when `orgThemeId` is not provided.
   */
  resolveOrgThemeId?: () => string | null | undefined;
  /** Whether dark mode should be applied. Defaults to `true` (product default). */
  isDark?: boolean;
  /** Lazy dark resolver (used when `isDark` is not provided). */
  resolveIsDark?: () => boolean;
  /**
   * Initial override (tier 1) — e.g. restored from a prior user selection.
   * If omitted, the provider seeds from localStorage on first paint.
   */
  initialThemeId?: string;
  /** Persist the resolved theme id to localStorage. Defaults to `true`. */
  persist?: boolean;
}

/** Read the first-paint override id from localStorage (best-effort). */
function readStoredThemeId(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isKnownThemeId(stored)) return stored;
  } catch {
    /* localStorage unavailable (SSR / privacy mode) */
  }
  return null;
}

export function ThemeProvider({
  children,
  orgThemeId,
  resolveOrgThemeId,
  isDark,
  resolveIsDark,
  initialThemeId,
  persist = true,
}: ThemeProviderProps) {
  // Tier 1 — runtime override. Seed from prop, else last persisted selection.
  const [override, setOverride] = useState<string | null>(
    () => (isKnownThemeId(initialThemeId) ? initialThemeId! : readStoredThemeId()),
  );

  // Tier 2 — org/CMS theme (prop wins over the lazy resolver).
  const orgResolved = orgThemeId ?? resolveOrgThemeId?.();
  const orgTier = isKnownThemeId(orgResolved) ? orgResolved! : null;

  // Resolution order: override > org > default.
  const themeId = override ?? orgTier ?? DEFAULT_THEME_ID;

  const dark = isDark ?? resolveIsDark?.() ?? true;

  const setThemeId = useCallback((id: string) => {
    setOverride(isKnownThemeId(id) ? id : DEFAULT_THEME_ID);
  }, []);

  const clearOverride = useCallback(() => setOverride(null), []);

  // Apply on every change to the resolved theme or dark mode; mirror to storage.
  useEffect(() => {
    applyTheme(themeId, dark);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, themeId);
      } catch {
        /* ignore persistence failures */
      }
    }
  }, [themeId, dark, persist]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeId,
      theme: THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID],
      isDark: dark,
      setThemeId,
      clearOverride,
    }),
    [themeId, dark, setThemeId, clearOverride],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Access the active theme + setters. Throws outside a `ThemeProvider`. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
