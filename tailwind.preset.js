/**
 * Tailwind 3 preset for Sóköl. Maps the token CSS variables (src/tokens/tokens.css)
 * to Tailwind colors so every frontend (landing, app, admin) shares one theme.
 *
 *   // tailwind.config.ts
 *   import preset from "@pacific-code-labs/sokol-design-system/tailwind-preset";
 *   export default {
 *     presets: [preset],
 *     content: ["./index.html", "./src/**\/*.{ts,tsx}", ...preset.dsContent],
 *   };
 *
 * The package ships TS source, so consumers must scan it (`dsContent`) to emit its classes.
 */
import animate from "tailwindcss-animate";

const token = (name) => `hsl(var(--${name}))`;
const pair = (name) => ({ DEFAULT: token(name), foreground: token(`${name}-foreground`) });

/** @type {import("tailwindcss").Config & { dsContent: string[] }} */
const preset = {
  darkMode: ["class"],
  content: [],
  dsContent: ["./node_modules/@pacific-code-labs/sokol-design-system/src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        border: token("border"),
        input: token("input"),
        ring: token("ring"),
        background: token("background"),
        foreground: token("foreground"),
        primary: { ...pair("primary"), glow: token("primary-glow") },
        secondary: pair("secondary"),
        destructive: pair("destructive"),
        muted: pair("muted"),
        accent: pair("accent"),
        popover: pair("popover"),
        card: pair("card"),
        sidebar: {
          DEFAULT: token("sidebar-background"),
          foreground: token("sidebar-foreground"),
          primary: token("sidebar-primary"),
          "primary-foreground": token("sidebar-primary-foreground"),
          accent: token("sidebar-accent"),
          "accent-foreground": token("sidebar-accent-foreground"),
          border: token("sidebar-border"),
          ring: token("sidebar-ring"),
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default preset;
