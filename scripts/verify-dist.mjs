import { readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { getPublicationIds } from "../.prerender/entry-server.js";
import { resolve } from "node:path";
const outputDir = process.env.SITE_OUT_DIR || "dist";
const outputPath = (path) => resolve(outputDir, path);
const html = await readFile(outputPath("index.html"), "utf8");
const doc = new JSDOM(html).window.document;
const base = process.env.SITE_BASE_PATH || "/";
const png = await readFile(outputPath("social-preview.png"));
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
assert.equal(doc.querySelectorAll("h1").length, 1);
assert.ok(
  doc
    .querySelector("main")
    ?.textContent.includes("Toward Verifiable Lifelong Intelligent Systems"),
);
const publicationIds = getPublicationIds();
assert.equal(
  doc.querySelectorAll(".publication").length,
  publicationIds.length,
);
for (const id of publicationIds)
  assert.ok(
    doc.getElementById(`publication-${id}`),
    `Missing publication: ${id}`,
  );
assert.equal(
  doc.querySelector('link[rel="canonical"]').href,
  "https://abirhadi.phd/",
);
assert.equal(doc.documentElement.lang, "en");
JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
for (const link of doc.querySelectorAll('a[href^="#"]'))
  assert.ok(
    doc.getElementById(link.hash.slice(1)),
    `Missing anchor: ${link.hash}`,
  );
for (const el of doc.querySelectorAll("script[src], link[href]")) {
  const url = el.getAttribute("src") || el.getAttribute("href");
  if (!url.startsWith("/")) continue;
  assert.ok(url.startsWith(base), `Incorrect asset base: ${url}`);
  await access(outputPath(url.slice(base.length)));
}
for (const path of [
  "robots.txt",
  "sitemap.xml",
  "social-preview.png",
  "favicon.svg",
  ".nojekyll",
])
  await access(outputPath(path));
if (process.env.SITE_PREVIEW === "true") {
  await assert.rejects(access(outputPath("CNAME")));
} else
  assert.equal(
    (await readFile(outputPath("CNAME"), "utf8")).trim(),
    "abirhadi.phd",
  );
assert.ok(!html.includes("<!--app-html-->"));
console.log(
  `Verified prerendered content, anchors, SEO, static assets and custom-domain configuration for ${base}`,
);
