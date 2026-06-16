// Copy the token stylesheet into dist as the `./styles` export target.
// Run after `vite build` (see package.json `build`).
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../src/tokens/tokens.css");
const dest = resolve(here, "../dist/tokens.css");

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`[design-system] copied tokens.css → ${dest}`);
