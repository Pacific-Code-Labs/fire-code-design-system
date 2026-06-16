# @firecode/design-system

The **shared, private design system** for FireCode CR. It ships the **Blue Book
token contract** (`BLUE-BOOK.md`, FCR-002), a **runtime theme engine** with
`override > org > default` resolution, and a set of **token-driven UI
primitives** (Button, Input, Card, Badge, Icon, Modal, Drawer, …).

Consumed by:
- **`fire-code-fe`** — the FireCode CR web app.
- a **future admin app** (the variant-B private admin repo; FCR-082/083).

Delivery mechanism (decided 2026-06-15): **private npm package + path/workspace
alias**. The package is `"private": true` and never published to the public
registry.

---

## What's in it

| Export | Contents |
|---|---|
| `@firecode/design-system` | Token contract types (`TOKEN_NAMES`, `TokenMap`), theme registry (`THEMES`, `THEME_LIST`, `DEFAULT_THEME_ID`), `applyTheme`, `ThemeProvider`/`useTheme`, the `cn` helper, and the **UI primitives**. |
| `@firecode/design-system/styles` | The token stylesheet (`tokens.css`) — `:root` (light) + `.dark` defaults for the full Blue Book contract, plus the `t-h1..t-h4 / t-body / t-sm / t-label` typography utilities. |

### UI primitives

All token-driven (Tailwind semantic classes / `hsl(var(--token))`), built with
`class-variance-authority` for variants and `cn` (clsx + tailwind-merge) so a
caller's `className` always wins. Every component re-themes at runtime.

| Primitive | Notes |
|---|---|
| `Button` | `variant`: primary / secondary / outline / ghost / destructive / success / link · `size`: xs–xl · `icon`/`iconRight` (registry names) · `loading`. |
| `Input`, `Select` | `inputSize` sm/md/lg · `invalid` (→ `--destructive` border/ring). |
| `FormField`, `FormLabel` | label + control + hint/error scaffold; `t-label` uppercase micro-label; wires `htmlFor`/`aria-describedby`. |
| `Card` (+`CardHeader`/`CardBody`/`CardFooter`/`CardTitle`/`CardDescription`) | `hoverable` lift + fire-orange border glow; `as` polymorphic. |
| `Badge` | generic variants **plus** brand `initiation`/`notification`/`monitoring`/`actuation` (`--cat-*`) and `risk-high`/`risk-medium`/`risk-low` (`--risk-*`). |
| `Icon` | lucide **registry resolver** — `<Icon name="ShieldCheck" />` (PascalCase, kebab/camel, or short aliases like `"close"`/`"trash"`); brand `Flame` fallback. |
| `Modal`, `Drawer` | accessible overlays on **Radix `@radix-ui/react-dialog`** (focus-trap, scroll-lock, Escape). Modal has tinted variant icon + confirm/cancel footer; Drawer docks left/right. |
| `OtpInput` | segmented **6-digit** numeric code (configurable `length`); type-to-advance, Backspace/arrow nav, full-code paste; controlled. |
| `Spinner` | inline or `fullHeight` route loader; fire-orange. |
| `Pagination` | range summary + page-size `Select` + prev/next; **app-agnostic** — copy via `labels` (English defaults). |
| `MediaPicker` | preview + Select/Change/Clear + library modal (dropzone, URL paste, gallery). **Decoupled** — host injects `gallery`, `onUpload`, `onAddUrl`, `resolveUrl`; stores a plain URL string. |

### Token contract

The full Blue Book set, defined in **both** light (`:root`) and dark (`.dark`):

- **Core semantic** — `--background/--foreground`, `--card(-foreground)`,
  `--popover(-foreground)`, `--primary` (`8 90% 54%`) + `--primary-foreground`
  + `--primary-glow`, `--secondary`, `--muted`, `--accent` (cyan `200 95% 45%`),
  `--destructive`, `--border`, `--input`, `--ring`, `--radius` (`0.6rem`).
- **Fire-protection categories** — `--cat-initiation`, `--cat-notification`,
  `--cat-monitoring`, `--cat-actuation`.
- **Risk** — `--risk-high`, `--risk-medium`, `--risk-low`.
- **Sidebar family** — `--sidebar-background/-foreground/-primary(-foreground)/`
  `-accent(-foreground)/-border/-ring`.
- **Effects** — `--gradient-hero`, `--gradient-panel`, `--shadow-glow`,
  `--shadow-panel`.

All colours are HSL channel triples (no `hsl()` wrapper) → use as
`hsl(var(--token))`. **Dark is the product default** (`<html class="dark">`).

---

## How `fire-code-fe` and the admin app consume it

### 1. Add the dependency (alias to the sibling folder)

Because the package is private and lives as a sibling of `fire-code-fe`, depend
on it via a path/workspace spec. In the consumer's `package.json`:

```jsonc
{
  "dependencies": {
    // Bun / npm path dependency (no registry):
    "@firecode/design-system": "file:../fire-code-design-system"
    // or, if you adopt a workspace: "@firecode/design-system": "workspace:*"
  }
}
```

Then `bun install` (fire-code-fe uses Bun). For a non-workspace setup, run
`bun run build` in `fire-code-design-system` first so `dist/` exists.

Optionally mirror the import alias in the consumer's `vite.config.ts` /
`tsconfig` if you want to import source directly during development:

```ts
// vite.config.ts (consumer)
resolve: {
  alias: {
    "@firecode/design-system": resolve(__dirname, "../fire-code-design-system/src/index.ts"),
    "@firecode/design-system/styles": resolve(__dirname, "../fire-code-design-system/src/tokens/tokens.css"),
  },
}
```

### 2. Import the token stylesheet once

In the consumer's entry CSS (e.g. `src/index.css`), **before** Tailwind layers,
or in `main.tsx`:

```css
@import "@firecode/design-system/styles";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

The consumer's `tailwind.config.ts` keeps mapping these tokens to Tailwind
colours (`hsl(var(--primary))`, `text-cat-*`, etc.) exactly as today — the
design system owns the **values**, the app owns the Tailwind mapping + utility
classes (`.panel`, `.glow-red`, `.scanline`, scrollbar/print styles).

> **Host requirements for the primitives (important):**
> 1. The semantic token → Tailwind colour mapping must exist in the consumer's
>    `tailwind.config` (the primitives use classes like `bg-card`,
>    `text-primary`, `border-border`, `ring-ring`, `text-muted-foreground`,
>    `text-accent`, `text-destructive`, plus `font-display`).
> 2. Install **`tailwindcss-animate`** and add it to `plugins` — `Modal`/`Drawer`
>    use Radix `data-[state=open]`/`data-[state=closed]` with `animate-in` /
>    `animate-out` / `fade-*` / `zoom-*` / `slide-in-from-right` etc.
> 3. Ensure Tailwind scans the package, e.g. add
>    `"../fire-code-design-system/src/**/*.{ts,tsx}"` to `content` (or the
>    built `dist` if consuming the bundle) so the primitive classes aren't
>    purged.

> When FCR-003 lands, `fire-code-fe/src/index.css` token blocks become this
> package's defaults — **do not fork them**; change the token here.

### 3. Wrap the app in `ThemeProvider`

```tsx
import { ThemeProvider } from "@firecode/design-system";

// org/CMS theme value + dark flag come from the HOST app.
<ThemeProvider orgThemeId={orgTheme} isDark={isDark}>
  <App />
</ThemeProvider>
```

`useTheme()` exposes `{ themeId, theme, isDark, setThemeId, clearOverride }`.
`setThemeId(id)` sets a runtime OVERRIDE (e.g. a theme gallery); `clearOverride()`
returns to org/default resolution.

---

## How CMS / org theme values feed `applyTheme`

The package is **app-agnostic** — it does not call Cognito, TanStack Query, or
any CMS. The host injects the org/CMS-resolved theme id; the provider resolves:

```
OVERRIDE  (runtime setThemeId / theme gallery)
  > ORG / CMS theme  (orgThemeId prop OR resolveOrgThemeId() callback)
    > DEFAULT  (DEFAULT_THEME_ID = "firecode")
```

Typical wiring in `fire-code-fe`: the host reads the org's theme from its org
config endpoint or the landing DXP `themes.json`, then passes it down:

```tsx
const orgTheme = useOrgTheme();        // host hook → string | null
const { dark } = useDarkMode();        // host's existing light/dark toggle
<ThemeProvider resolveOrgThemeId={() => orgTheme} resolveIsDark={() => dark}>
```

You can also call `applyTheme(themeId, isDark)` imperatively (e.g. a live
preview in the admin) without the provider — it writes all tokens to `:root` and
lazily injects the theme's Google Fonts (deduped by href).

Register new org/CMS themes in `src/theme/themes.ts` keyed by a stable id (the
same id stored in org config / `themes.json`). A theme provides a `light` and a
`dark` `TokenMap` over the full contract plus `fonts` + `radius`.

---

## Develop / build

```bash
bun install
bun run build       # tsc (types) → vite (ESM+CJS) → copy tokens.css
bun run dev         # vite build --watch
bun run typecheck
```

Outputs to `dist/`: `index.js` (ESM), `index.cjs` (CJS), `index.d.ts` (types),
`tokens.css` (the `./styles` export).

---

## Roadmap

This package is tracked as **FCR-003** in
`E:\dev\fire-code-app\docs\roadmap\firecode_roadmap.md`. See `CLAUDE.md` for the
mandatory roadmap-upkeep rule.
