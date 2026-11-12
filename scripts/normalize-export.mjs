import { readdir, copyFile } from "node:fs/promises";
import path from "node:path";

// Next.js Windows export can put segment payloads into directories although its
// client requests dot-separated filenames. Copy aliases; preserve original data.
// Upstream: https://github.com/vercel/next.js/issues/92339
const root = path.resolve("out");
let aliases = 0;
async function normalize(directory, segmentRoot, parts = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (segmentRoot) {
      const nextParts = [...parts, entry.name];
      if (entry.isDirectory()) await normalize(file, segmentRoot, nextParts);
      else if (entry.name.endsWith(".txt")) {
        await copyFile(
          file,
          path.join(
            path.dirname(segmentRoot),
            [path.basename(segmentRoot), ...nextParts].join("."),
          ),
        );
        aliases++;
      }
    } else if (entry.isDirectory()) {
      await normalize(
        file,
        entry.name.startsWith("__next.") ? file : undefined,
      );
    }
  }
}
await normalize(root);
console.log(
  `Static export ready; ${aliases} Windows route-payload aliases added.`,
);
