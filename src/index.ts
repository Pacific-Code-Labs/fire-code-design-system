/**
 * @pacific-code-labs/sokol-design-system — public entry (barrel).
 *
 * Stage 1: the Blue Book token contract + the runtime theme engine.
 * Stage 2 (FCR-003): the token-driven UI primitives + the `cn` helper.
 *
 * The token stylesheet is a SEPARATE export — import it once in the host app:
 *   import "@pacific-code-labs/sokol-design-system/styles";
 * (do NOT import it from this barrel, to keep the JS entry side-effect-free).
 */

// Token contract (names + types).
export * from "./tokens";

// Theme engine: registry, applyTheme, ThemeProvider/useTheme.
export * from "./theme";

// Class-name helper (clsx + tailwind-merge).
export * from "./lib";

// UI primitives (Button/Input/FormField/Card/Badge/Icon/Modal/Drawer/…).
export * from "./components";

// i18n runtime: LanguageProvider/useLanguage, Localized<T>, rich text.
export * from "./i18n";

// Sidebar application layout.
export * from "./layout";

// Anonymous published-content reads (public-api, identity-pool guests + SigV4).
export * from "./content";

// Brand lockup driven by the branding content document (logos uploaded in the admin).
export * from "./brand";
