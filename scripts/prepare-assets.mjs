import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
await Promise.all(
  ["public/projects", "public/images", "public/resume"].map((directory) =>
    mkdir(path.join(root, directory), { recursive: true }),
  ),
);
const assets = [
  ["rocket-label-lock.png", "rocket-label-lock"],
  ["djordan-media.png", "djordan-media"],
  ["BUNDLE__BUILDER.png", "bundle-builder"],
  ["Formatica.png", "formatica"],
  ["Project.png", "efendina"],
  ["LG1.png", "legacy-gallery"],
  ["afterparty.jpg", "afterparty"],
  ["shopvoice.jpg", "shopvoice"],
];
for (const [source, destination] of assets) {
  await sharp(path.join(root, "assets/images", source))
    .resize({ width: 1440, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(root, `public/projects/${destination}.webp`));
}
await sharp(path.join(root, "assets/images/LinkednDp.jpeg"))
  .rotate()
  .resize({ width: 720, withoutEnlargement: true })
  .webp({ quality: 86 })
  .toFile(path.join(root, "public/images/wajahat-naqvi.webp"));
await copyFile(
  path.join(root, "assets/WajahatNaqvi - Software Engineer.pdf"),
  path.join(root, "public/resume/Wajahat-Naqvi.pdf"),
);
const social = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#0b0f14"/><path d="M70 85H1130M70 545H1130" stroke="#29342f"/><text x="75" y="60" fill="#63e6be" font-family="sans-serif" font-size="25">w/n.</text><text x="75" y="165" fill="#a0a8b5" font-family="sans-serif" font-size="20" letter-spacing="4">WAJAHAT NAQVI</text><text x="70" y="300" fill="#f5f7fa" font-family="sans-serif" font-size="106" letter-spacing="-5">Full-Stack</text><text x="70" y="415" fill="#a0aaa9" font-family="sans-serif" font-size="106" letter-spacing="-5">Developer<tspan fill="#63e6be">.</tspan></text><text x="75" y="490" fill="#a0a8b5" font-family="sans-serif" font-size="24">From interface to infrastructure.</text><text x="75" y="585" fill="#a0a8b5" font-family="sans-serif" font-size="17">wajahatalinaqvi.github.io</text><path d="m960 220 100 60-100 60-100-60Z m0 45 100 60-100 60-100-60Z m0 45 100 60-100 60-100-60Z" fill="#172d23" stroke="#63e6be" stroke-width="2"/></svg>`;
await sharp(Buffer.from(social))
  .png()
  .toFile(path.join(root, "public/images/social-card.png"));
console.log(
  "Prepared eight project previews, portrait, résumé, and social sharing image.",
);
