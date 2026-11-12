import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";
import { createServer } from "node:net";
import { writeFile, mkdir } from "node:fs/promises";
import { serve } from "./serve.mjs";

const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}`;
await mkdir("test-results", { recursive: true });
const portProbe = createServer();
await new Promise((resolve) => portProbe.listen(0, "127.0.0.1", resolve));
const debuggingPort = portProbe.address().port;
await new Promise((resolve) => portProbe.close(resolve));
const chrome = await chromium.launch({
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : { channel: "chrome" }),
  args: [`--remote-debugging-port=${debuggingPort}`],
});
try {
  for (const [name, route] of [
    ["home", "/"],
    ["case-study", "/projects/rocket-label-lock/"],
  ]) {
    const result = await lighthouse(`${base}${route}`, {
      port: debuggingPort,
      output: ["json", "html"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });
    await writeFile(`test-results/lighthouse-${name}.json`, result.report[0]);
    await writeFile(`test-results/lighthouse-${name}.html`, result.report[1]);
    console.log(
      name,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
      ),
    );
  }
} finally {
  await chrome.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
