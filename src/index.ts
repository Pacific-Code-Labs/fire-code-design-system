/**
 * @firecode/design-system — public entry (barrel).
 *
 * Stage 1: the Blue Book token contract + the runtime theme engine.
 * Stage 2 (FCR-003): the token-driven UI primitives + the `cn` helper.
 *
 * The token stylesheet is a SEPARATE export — import it once in the host app:
 *   import "@firecode/design-system/styles";
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
