import sharp from "sharp";
import { resolve } from "node:path";
await sharp(".prerender/social.svg")
  .png()
  .toFile(resolve(process.env.SITE_OUT_DIR || "dist", "social-preview.png"));
