# CLAUDE.md — `fire-code-design-system` (`@firecode/design-system`)

Guidance for AI agents (and humans) working in this repo. Read this before
making changes.

---

## 1. Purpose

`@firecode/design-system` is the **shared, private** design system for FireCode
CR. It owns the **Blue Book token contract** and a **runtime theme engine**, so
both `fire-code-fe` and the future admin app render the same brand from one
source of truth.

- **Stage 1 (done):** tokens + theme engine.
- **Stage 2 (done, FCR-003):** the branded UI primitives (Button/Input+Select/
  FormField+FormLabel/Card(+Header/Body/Footer/Title/Description)/Badge/Icon/
  Modal/Drawer/OtpInput/Spinner/Pagination/MediaPicker), built token-driven with
  `class-variance-authority` + `clsx`/`tailwind-merge` (`cn`) and re-exported
  from the barrel. Overlays (Modal/Drawer) use Radix `@radix-ui/react-dialog`;
  icons resolve through a lucide registry (`Icon name="..."`). Primitives are
  app-agnostic: no app CSS, no app contexts — copy is passed via `labels`
  props and data (MediaPicker gallery/upload) via callbacks.
- **Stage 2b (done, FCR-003):** absorbed the brand-neutral **shadcn/Radix
  primitive set** from `fire-code-fe/src/components/ui/*` so every screen builds
  from one package. These are the kebab-case multi-export files in
  `components/ui/` (alert, alert-dialog, accordion, aspect-ratio, avatar,
  breadcrumb, calendar, carousel, chart, checkbox, collapsible, command,
  context-menu, dropdown-menu, hover-card, label, input-otp, menubar,
  navigation-menu, popover, progress, radio-group, resizable, scroll-area,
  separator, sheet, skeleton, slider, sonner, switch, table, tabs, textarea,
  toggle, toggle-group, tooltip). All adapted to `../../lib/cn` + tokens (no
  `@/` app imports, no app-only deps — `sonner` takes `theme` as a prop instead
  of reading `next-themes`; `command` wraps Radix dialog directly since the DS
  has no raw `Dialog`). The branded primitive stays **canonical** where a
  shadcn one overlaps: `FormLabel` (canonical) ⟷ `Label` (compat, `./label`),
  `OtpInput` (canonical) ⟷ `InputOTP*` (compat, `./input-otp`). The third-party
  libs these wrap (the `@radix-ui/*` set, `cmdk`, `embla-carousel-react`,
  `react-day-picker`, `input-otp`, `react-resizable-panels`, `recharts`,
  `sonner`) are **peerDependencies**, externalized in `vite.config.ts`.

**Brand source of truth:** `E:\dev\fire-code-app\BLUE-BOOK.md` (FCR-002).
**Delivery (FCR-086, 2026-06-16):** published to **GitHub Packages**
(`npm.pkg.github.com`, scope `@firecode`) for CI consumers + a `file:` path
alias for local dev. The package is **NOT** `"private": true` (npm refuses to
publish that flag, and GH Packages hosts scoped packages fine) — privacy comes
from the **private GH repo + `@firecode`→GH-Packages scope mapping**, never the
public npm registry. Publish is release-tag-driven via
`.github/workflows/publish.yml` (release published / `workflow_dispatch` →
`setup-node` GH-Packages registry → `bun install` → `bun run build` → `npm
publish`, `NODE_AUTH_TOKEN=secrets.GITHUB_TOKEN`, `permissions: packages:
write`). `package.json` carries `publishConfig.registry`, `repository`,
`prepublishOnly: npm run build`; repo `.npmrc` maps the scope. Consumers add
their own `.npmrc` (`@firecode:registry=…` +
`//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`) and set
`NODE_AUTH_TOKEN=secrets.GITHUB_TOKEN` with `packages: read` in their deploy
workflow — see README "Publishing" + "§0 Install from GitHub Packages in CI".

---

## 2. Tech stack

- **TypeScript + React 18** (peer deps; `react`/`react-dom` are NOT bundled).
- **Vite library mode** → ESM (`index.js`) + CJS (`index.cjs`); **`tsc
  --emitDeclarationOnly`** → `index.d.ts`; `scripts/copy-css.mjs` →
  `dist/tokens.css`.
- Package manager: **Bun** (matches `fire-code-fe`); `npm` works too.

Commands: `bun run build`, `bun run dev` (watch), `bun run typecheck`,
`bun run build:css`.

---

## 3. Structure

```
src/
├── index.ts                 # public barrel (side-effect-free — NO css import)
├── tokens/
│   ├── tokens.css           # Blue Book tokens (:root + .dark) + .t-* typography utilities
│   ├── contract.ts          # TOKEN_NAMES + TokenName/TokenMap types (TS mirror of the CSS)
│   └── index.ts             # token barrel
├── theme/
│   ├── themes.ts            # ThemeDef registry: THEMES, THEME_LIST, DEFAULT_THEME_ID, getTheme
│   ├── applyTheme.ts        # applyTheme(themeId, isDark) → writes :root + deduped Google Fonts
│   ├── ThemeContext.tsx     # ThemeProvider + useTheme (resolution: override > org > default)
│   └── index.ts             # theme barrel
├── lib/
│   ├── cn.ts                # clsx + tailwind-merge combiner (overrides win predictably)
│   └── index.ts
└── components/
    ├── index.ts             # → ./ui
    └── ui/                  # PascalCase branded primitives + kebab-case
                             #   absorbed shadcn set + index.ts barrel
scripts/copy-css.mjs         # copies tokens.css → dist/tokens.css (the ./styles export)
```

**Two file conventions in `components/ui/`:** PascalCase files
(`Button.tsx`, `Card.tsx`, …) are the hand-built **canonical** branded
primitives. kebab-case files (`alert-dialog.tsx`, `dropdown-menu.tsx`, …) are
the absorbed shadcn set (multi-export, generic). When a new component duplicates
a branded one, keep the branded export canonical and add the shadcn one under
its own name as a compat alias — never rename/clobber a canonical export.

**Primitive conventions:** every component is a `forwardRef` (where it wraps a
DOM node), accepts `className` funnelled through `cn` (caller wins), and styles
ONLY via Tailwind semantic-token classes (`bg-card`, `text-primary`,
`ring-ring`) or `hsl(var(--token))` arbitrary values (e.g. the `--cat-*`/
`--risk-*` Badge variants). NO hardcoded hex. Variants use `cva`. Do NOT import
app CSS or app contexts — keep them portable across `fire-code-fe` and admin.

**Export surface** (`package.json` `exports`):
- `@firecode/design-system` → the JS/types barrel (token types + theme engine).
- `@firecode/design-system/styles` (and `/tokens.css`) → `dist/tokens.css`.

The JS barrel is **side-effect-free** — never `import "./tokens/tokens.css"`
from it. Hosts import the stylesheet explicitly via the `./styles` export.

---

## 4. The token contract (authoritative)

Defined in **both** light (`:root`) and dark (`.dark`) in `tokens.css`, and
mirrored as an ordered list in `contract.ts` (`TOKEN_NAMES`). The two MUST stay
in lockstep with each other and with `BLUE-BOOK.md`. Adding/removing a token =
edit `tokens.css` + `contract.ts` + every `ThemeDef.light/dark` map in
`themes.ts` + the Blue Book.

- **Core semantic:** `--background/--foreground`, `--card(-foreground)`,
  `--popover(-foreground)`, `--primary` (`8 90% 54%`) + `--primary-foreground` +
  **`--primary-glow`**, `--secondary`, `--muted`, `--accent` (cyan
  `200 95% 45%`), `--destructive`, `--border`, `--input`, `--ring`,
  `--radius` (`0.6rem`).
- **`--cat-*`** (fire-protection categories): `--cat-initiation`,
  `--cat-notification`, `--cat-monitoring`, `--cat-actuation`.
- **`--risk-*`:** `--risk-high`, `--risk-medium`, `--risk-low`.
- **`--sidebar-*`:** `-background/-foreground/-primary(-foreground)/`
  `-accent(-foreground)/-border/-ring`.
- **Effects:** `--gradient-hero`, `--gradient-panel`, `--shadow-glow`,
  `--shadow-panel`.
- **Typography (theme-driven):** `--font-sans`, `--font-display` (written by
  `applyTheme`).

Colours are **HSL channel triples** (no `hsl()` wrapper) → `hsl(var(--token))`.
**Dark is the product default.** Gradient/shadow tokens are full CSS values.

The app (not this package) owns Tailwind mapping + utility classes
(`.panel`, `.glow-red`, `.text-cat-*`, scrollbar/print styles). This package
owns the **values**; when FCR-003 lands, `fire-code-fe/src/index.css` token
blocks become these defaults — do not fork them.

---

## 5. Theme resolution order (`ThemeProvider`)

Highest wins:

1. **OVERRIDE** — `setThemeId(id)` at runtime (e.g. theme gallery / live
   preview). Seeded from `initialThemeId` prop or `localStorage`
   (`firecode.themeId`).
2. **ORG / CMS theme** — `orgThemeId` prop, or `resolveOrgThemeId()` callback.
   The HOST supplies this from org config / the DXP `themes.json`. This package
   is app-agnostic — it never calls Cognito / TanStack Query / a CMS directly.
3. **DEFAULT** — `DEFAULT_THEME_ID` (`"firecode"`).

Dark mode is host-supplied (`isDark` prop / `resolveIsDark()`), defaulting to
**dark**. `applyTheme(themeId, isDark)` writes every `TOKEN_NAMES` entry +
`--radius`/`--font-sans`/`--font-display` to `:root` and lazily injects the
theme's Google Fonts (deduped by href). Seeded themes: `firecode` (default) and
`firecode-light` (demo/alt). Add org/CMS themes in `themes.ts` keyed by stable
id (the same id stored in org config / `themes.json`).

See `README.md` for consumer wiring (alias + dependency + `ThemeProvider`).

---

## 6. Roadmap upkeep — REQUIRED for every change

**`E:\dev\fire-code-app\docs\roadmap\firecode_roadmap.md` is the single source
of truth** for tracking all FireCode CR work across every repo (be, fe, agent,
admin, design-system). Treat it as a living document. After **any substantive
change** in this repo you MUST:

1. **Update the relevant `FCR-NNN` row** in §2 (the status board): set the
   correct **Status** (`Done` / `In progress` / `Planned` / `Not started` /
   `Won't do`) and update the **Evidence / next step** cell with what landed and
   what remains.
2. **Append a dated line to the §5 changelog** (date + short summary, e.g.
   `2026-06-15: design-system — scaffolded @firecode/design-system (tokens + theme engine), FCR-003 In progress.`).
3. **Add a new `FCR-NNN` row** for newly discovered work — IDs are stable and
   never reused/renumbered. When splitting an item, keep the original ID on the
   parent and add child IDs (note lineage).
4. **Never silently drop scope.** Do not delete rows — strike through or mark
   `Won't do` with a cited decision source.

FCR IDs most relevant to this repo: **FCR-003** (this package — tokens + theme
engine now; primitives next), **FCR-086** (this package's GitHub Packages
publishing setup; lineage under FCR-003), **FCR-002** (Blue Book brand source of
truth), **FCR-004** (this CLAUDE.md), **FCR-060/061** (FE app + RBAC UI that
consume the primitives), **FCR-082/083** (admin app — the second consumer). If
your change touches one of these, update its row in the same commit/PR.
