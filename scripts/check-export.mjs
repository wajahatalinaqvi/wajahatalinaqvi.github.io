import { readFile, readdir, stat, access } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

const root = path.resolve("out");
async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? htmlFiles(path.join(directory, entry.name))
        : entry.name.endsWith(".html")
          ? [path.join(directory, entry.name)]
          : [],
    ),
  );
  return nested.flat();
}
await access(path.join(root, "index.html"));
await access(path.join(root, ".nojekyll"));
const files = await htmlFiles(root);
const missing = [];
for (const file of files) {
  const html = await readFile(file, "utf8");
  assert.match(html, /<title>[^<]+<\/title>/, `Title missing: ${file}`);
  assert.match(html, /name="description"/, `Description missing: ${file}`);
  assert.match(html, /<h1\b/, `H1 missing: ${file}`);
  if (!file.endsWith("404.html") && !file.includes(`${path.sep}404${path.sep}`))
    assert.match(html, /rel="canonical"/, `Canonical missing: ${file}`);
  for (const match of html.matchAll(
    /(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g,
  )) {
    const url = decodeURIComponent(match[1]);
    try {
      const target = path.join(root, url);
      const info = await stat(target);
      if (info.isDirectory()) await access(path.join(target, "index.html"));
    } catch {
      missing.push(`${path.relative(root, file)} → ${url}`);
    }
  }
}
assert.deepEqual(missing, [], `Broken local URLs: ${missing.join(", ")}`);
const projectRoutes = await readdir(path.join(root, "projects"), {
  withFileTypes: true,
});
assert.equal(
  projectRoutes.filter((item) => item.isDirectory()).length,
  8,
  "Expected all eight project routes",
);
const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
assert.equal((sitemap.match(/<loc>/g) || []).length, 9);
console.log(
  `PASS: ${files.length} HTML pages, eight project routes, local assets/links, titles, descriptions, canonical URLs, sitemap, and .nojekyll.`,
);
