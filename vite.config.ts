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
       * Externalize React, every Radix peer, lucide-react, and the heavier
       * third-party UI libs the absorbed primitives wrap (cmdk / embla /
       * react-day-picker / input-otp / react-resizable-panels / recharts /
       * sonner) — all declared as peerDependencies and provided by the host.
       * Bundled runtime deps (clsx / tailwind-merge / cva) are intentionally
       * NOT externalized — they ship inside the package.
       */
      external: (id) =>
        /^react($|\/)/.test(id) ||
        /^react-dom($|\/)/.test(id) ||
        /^react-day-picker($|\/)/.test(id) ||
        /^react-resizable-panels($|\/)/.test(id) ||
        /^@radix-ui\//.test(id) ||
        /^lucide-react($|\/)/.test(id) ||
        /^cmdk($|\/)/.test(id) ||
        /^embla-carousel-react($|\/)/.test(id) ||
        /^input-otp($|\/)/.test(id) ||
        /^recharts($|\/)/.test(id) ||
        /^sonner($|\/)/.test(id),
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
