import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const base = process.env.SITE_BASE_PATH || "/";
const origin = "http://127.0.0.1:4173";
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4173",
    "--strictPort",
    "--base",
    base,
    "--outDir",
    process.env.SITE_OUT_DIR || "dist",
  ],
  { stdio: "ignore" },
);
let launchError;
server.on("error", (error) => {
  launchError = error;
});
try {
  let response;
  for (let attempt = 0; attempt < 30; attempt++) {
    if (launchError) throw launchError;
    try {
      response = await fetch(origin + base, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) break;
    } catch {
      /* wait briefly for the owned preview process */
    }
    if (server.exitCode !== null)
      throw new Error(`Preview server exited: ${server.exitCode}`);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  assert.ok(response?.ok, "Preview did not serve the page");
  const doc = new JSDOM(await response.text()).window.document;
  assert.ok(doc.querySelector("h1")?.textContent.includes("Toward verifiable"));
  const paths = new Set(
    ["favicon.svg", "social-preview.png", "robots.txt", "sitemap.xml"].map(
      (path) => base + path,
    ),
  );
  for (const el of doc.querySelectorAll("script[src],link[href]")) {
    const path = el.getAttribute("src") || el.getAttribute("href");
    if (path?.startsWith(base)) paths.add(path);
  }
  for (const path of paths) {
    const asset = await fetch(origin + path);
    assert.equal(asset.status, 200, `Failed HTTP asset: ${path}`);
    if (path.endsWith(".css")) {
      const css = await asset.text();
      for (const match of css.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/g)) {
        if (match[1].startsWith("data:")) continue;
        const fontUrl = new URL(match[1], origin + path);
        assert.equal(
          (await fetch(fontUrl)).status,
          200,
          `Font failed: ${fontUrl.pathname}`,
        );
      }
    }
  }
  console.log(
    `HTTP smoke test passed: ${base}, prerendered identity, scripts, styles, fonts, favicon, social PNG, robots and sitemap.`,
  );
} finally {
  server.kill();
}
