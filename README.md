# fire-code-design-system

The shared design system for FireCode CR: the Blue Book token contract, a Tailwind 3 preset,
token-driven UI primitives, the runtime theme engine, the i18n runtime, the sidebar app shell,
loading skeletons and the anonymous published-content reader.

Used by the three frontends of the workspace (`Fire-Code-CR/fe/*`):

| Consumer | Repo | Host |
|---|---|---|
| landing | `fire-safety-advisor` | `fire-code.jcampos.dev` |
| app | `fire-code-app` | `app.fire-code.jcampos.dev` |
| admin | `fire-code-admin` (private) | `admin.fire-code.jcampos.dev` |

## Install (TypeScript source from a git tag)

There is no build step and no registry. Consumers install a tag and compile the source with
their own Vite:

```jsonc
{ "dependencies": { "@pacific-code-labs/fire-code-design-system": "github:Pacific-Code-Labs/fire-code-design-system#v0.2.0" } }
```

```ts
// main.tsx: tokens first, so the app's own index.css can override values
import "@pacific-code-labs/fire-code-design-system/styles";
```

```ts
// tailwind.config.ts: the preset + scan the package source
import preset from "@pacific-code-labs/fire-code-design-system/tailwind-preset";
export default { presets: [preset], content: ["./index.html", "./src/**/*.{ts,tsx}", ...preset.dsContent] };
```

Local work on the DS and an app together: `pnpm link ../design-system` in the app.

## Exports

| Export | Contents |
|---|---|
| `.` | tokens contract, theme engine (`ThemeProvider`, `applyTheme`), `cn`, primitives (`Button`, `Card`, `Drawer`, `Modal`, …, the shadcn set), `Hint`, `ActivityBar`, skeleton layouts (`ShellSkeleton`, `TableSkeleton`, `ListSkeleton`, `StatGridSkeleton`, `DetailSkeleton`, `FormSkeleton`), i18n (`LanguageProvider`, `useLanguage`, `Localized`, `useLocalized`, `parseRichText`), `AppShell`, published content (`loadPublishedContent`, `cachedPublishedContent`, `signedPublicGet`) |
| `./styles` (`./tokens.css`) | `:root` + `.dark` token values, typography utilities, activity-bar and language-swap motion |
| `./tailwind-preset` | Tailwind 3 preset mapping the tokens to colors, plus `dsContent` globs |

## Release

1. `pnpm typecheck`
2. bump `version` in `package.json`, commit
3. `git tag vX.Y.Z && git push origin main vX.Y.Z`
4. bump the tag in each consumer's `package.json`
