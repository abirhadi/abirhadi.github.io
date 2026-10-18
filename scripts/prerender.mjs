import { readFile, writeFile, unlink, mkdir, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { render } from "../.prerender/entry-server.js";
const outputDir = process.env.SITE_OUT_DIR || "dist";
// Keep font caches local and writable, including on restricted Windows machines.
const fontCache = resolve(".prerender/font-cache").replaceAll("\\", "/");
await mkdir(fontCache, { recursive: true });
const fontDirectory =
  process.platform === "win32"
    ? `${process.env.WINDIR || "C:/Windows"}/Fonts`
    : "/usr/share/fonts";
const fontConfig = resolve(".prerender/fonts.conf");
await writeFile(
  fontConfig,
  `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>${fontDirectory.replaceAll("\\", "/")}</dir><cachedir>${fontCache}</cachedir><alias><family>sans-serif</family><prefer><family>Arial</family><family>DejaVu Sans</family></prefer></alias><alias><family>serif</family><prefer><family>Georgia</family><family>DejaVu Serif</family></prefer></alias></fontconfig>`,
);
const { html, head, canonicalUrl, socialSvg } = render();
const template = await readFile(resolve(outputDir, "index.html"), "utf8");
if (
  !template.includes("<!--app-html-->") ||
  !template.includes("<!--site-meta-->")
)
  throw new Error("Prerender placeholders missing");
await writeFile(
  resolve(outputDir, "index.html"),
  template.replace("<!--app-html-->", html).replace("<!--site-meta-->", head),
);
await writeFile(
  resolve(outputDir, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap.xml", canonicalUrl).href}\n`,
);
await writeFile(
  resolve(outputDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonicalUrl}</loc></url></urlset>\n`,
);
await writeFile(".prerender/social.svg", socialSvg);
// Windows native font libraries read their environment when the process starts.
execFileSync(process.execPath, ["scripts/render-social.mjs"], {
  env: { ...process.env, FONTCONFIG_FILE: fontConfig.replaceAll("\\", "/") },
  stdio: "inherit",
});
await mkdir(resolve(outputDir, "licenses"), { recursive: true });
await copyFile(
  "node_modules/@fontsource-variable/manrope/LICENSE",
  resolve(outputDir, "licenses/manrope.txt"),
);
await copyFile(
  "node_modules/@fontsource/dm-serif-display/LICENSE",
  resolve(outputDir, "licenses/dm-serif-display.txt"),
);
await copyFile(
  "node_modules/lucide-react/LICENSE",
  resolve(outputDir, "licenses/lucide.txt"),
);
if (process.env.SITE_PREVIEW === "true")
  await unlink(resolve(outputDir, "CNAME"));
console.log(
  "Prerendered complete academic content, metadata, robots.txt and sitemap.xml.",
);
