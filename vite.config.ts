import { resolve } from "node:path";
import { defineConfig } from "vite";

/**
 * Library-mode build for @firecode/design-system.
 *
 * Emits ESM (`index.js`) + CJS (`index.cjs`) for the package entry. React /
 * react-dom are externalized — they're peer dependencies provided by the host
 * app (fire-code-fe, admin). Type declarations are produced separately by
 * `tsc --emitDeclarationOnly`, and the token stylesheet is copied to
 * `dist/tokens.css` (the `./styles` export) by `scripts/copy-css.mjs`
 * (see package.json `build`).
 */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "FireCodeDesignSystem",
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      /**
       * Externalize React, the Radix dialog peer, and lucide-react (incl. their
       * deep imports). Bundled runtime deps (clsx / tailwind-merge / cva) are
       * intentionally NOT externalized — they ship inside the package.
       */
      external: (id) =>
        /^react($|\/)/.test(id) ||
        /^react-dom($|\/)/.test(id) ||
        /^@radix-ui\//.test(id) ||
        /^lucide-react($|\/)/.test(id),
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
