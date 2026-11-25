// Generates a 1200x630 Open Graph card per project into public/og/<slug>.jpg,
// so shared case-study links show that project instead of the generic card.
// Run after prepare-assets (it reads public/projects/<slug>.webp).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const { projects } = await import("../src/content/projects.ts");
const root = process.cwd();
await mkdir(path.join(root, "public/og"), { recursive: true });

const escape = (text) =>
  text.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

for (const project of projects) {
  const shot = await sharp(
    path.join(root, `public/projects/${project.slug}.webp`),
  )
    .resize(620, 470, { fit: "cover", position: "top" })
    .png()
    .toBuffer();
  const frame = Buffer.from(
    `<svg width="636" height="486" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="635" height="485" rx="14" fill="#121821" stroke="#63e6be" stroke-opacity="0.45"/></svg>`,
  );
  const name = escape(project.name);
  const type = escape(project.type);
  const stack = project.stack
    .slice(0, 4)
    .map((tech, i) => {
      const x = 70 + i * 110;
      return `<rect x="${x}" y="430" width="100" height="34" rx="6" fill="#152620" stroke="#63e6be" stroke-opacity="0.4"/><text x="${x + 50}" y="452" text-anchor="middle" fill="#63e6be" font-family="Consolas, monospace" font-size="15">${escape(tech)}</text>`;
    })
    .join("");
  const size = project.name.length > 14 ? 52 : 62;
  const text =
    Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0b0f14"/>
  <circle cx="1040" cy="90" r="320" fill="#63e6be" fill-opacity="0.05"/>
  <text x="70" y="92" fill="#63e6be" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700">w/n.</text>
  <text x="70" y="190" fill="#a0a8b5" font-family="Consolas, monospace" font-size="17" letter-spacing="3">CASE STUDY · ${escape(project.category.toUpperCase())}</text>
  <text x="70" y="${190 + size + 20}" fill="#f5f7fa" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="600" letter-spacing="-2">${name}<tspan fill="#63e6be">.</tspan></text>
  <text x="70" y="${190 + size + 70}" fill="#a0aaa9" font-family="Segoe UI, Arial, sans-serif" font-size="24">${type}</text>
  ${stack}
  <text x="70" y="560" fill="#f5f7fa" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="600">Wajahat Naqvi</text>
  <text x="70" y="588" fill="#a0a8b5" font-family="Segoe UI, Arial, sans-serif" font-size="17">Shopify Full-Stack Developer · wajahatalinaqvi.github.io</text>
</svg>`);
  await sharp(text)
    .composite([
      { input: frame, left: 532, top: 72 },
      { input: shot, left: 540, top: 80 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(root, `public/og/${project.slug}.jpg`));
}
console.log(`Generated ${projects.length} Open Graph cards in public/og/.`);
