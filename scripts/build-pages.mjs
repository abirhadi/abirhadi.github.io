import { spawnSync } from "node:child_process";

// A clean, portable build for the user repository's root URL. Custom-domain
// deployment remains available by explicitly setting SITE_PREVIEW=false.
const env = {
  ...process.env,
  SITE_OUT_DIR: "github-pages",
  SITE_BASE_PATH: process.env.SITE_BASE_PATH || "/",
  SITE_PREVIEW: process.env.SITE_PREVIEW || "true",
};
for (const args of [
  ["node_modules/typescript/bin/tsc", "--noEmit"],
  ["node_modules/vite/bin/vite.js", "build", "--outDir", env.SITE_OUT_DIR],
  [
    "node_modules/vite/bin/vite.js",
    "build",
    "--ssr",
    "src/entry-server.tsx",
    "--outDir",
    ".prerender",
  ],
  ["scripts/prerender.mjs"],
  ["scripts/verify-dist.mjs"],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(
  "GitHub Pages upload folder: github-pages/ (upload its contents, including .nojekyll).",
);
