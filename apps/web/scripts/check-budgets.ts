/**
 * Performance guardrails, run in CI against a production build.
 *
 * - JS and CSS budgets per route (compressed bytes, cold cache).
 * - Grid pages must not mount live iframes (they show thumbnails).
 * - The site's CSS must not contain hosted-style tokens, and previews must not
 *   load the site's CSS.
 */
import { type ChildProcess, spawn } from "node:child_process";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
const KB = 1024;

interface Budget {
  path: string;
  maxJs: number;
  maxCss: number;
  kind: "grid" | "detail" | "preview";
}

// Compressed bytes. Set just above today's numbers: raise them deliberately, never casually.
const budgets: Budget[] = [
  { path: "/", maxJs: 165 * KB, maxCss: 8 * KB, kind: "grid" },
  { path: "/styles", maxJs: 165 * KB, maxCss: 8 * KB, kind: "grid" },
  { path: "/styles/isometric", maxJs: 165 * KB, maxCss: 8 * KB, kind: "grid" },
  { path: "/illustrations", maxJs: 165 * KB, maxCss: 8 * KB, kind: "grid" },
  { path: "/illustrations/server", maxJs: 165 * KB, maxCss: 8 * KB, kind: "grid" },
  { path: "/components", maxJs: 165 * KB, maxCss: 8 * KB, kind: "grid" },
  { path: "/styles/isometric/server", maxJs: 170 * KB, maxCss: 8 * KB, kind: "detail" },
  { path: "/preview/isometric/server", maxJs: 155 * KB, maxCss: 8 * KB, kind: "preview" },
];

function startServer(): Promise<ChildProcess> {
  const next = createRequire(import.meta.url).resolve("next/dist/bin/next");
  const server = spawn(process.execPath, [next, "start", "-p", String(PORT)], {
    stdio: ["ignore", "pipe", "inherit"],
  });
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("next start did not become ready")), 30_000);
    server.stdout?.on("data", (chunk: Buffer) => {
      if (/ready|started|localhost/i.test(chunk.toString())) {
        clearTimeout(timeout);
        resolve(server);
      }
    });
    server.on("exit", (code) => reject(new Error(`next start exited with ${code}`)));
  });
}

const fmt = (bytes: number) => `${(bytes / KB).toFixed(1)} KB`;

const server = await startServer();
const browser = await chromium.launch();
const failures: string[] = [];

try {
  for (const budget of budgets) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const css: string[] = [];
    // Only the top-level document: the detail page's iframe legitimately loads style CSS.
    page.on("response", async (res) => {
      const request = res.request();
      if (request.resourceType() === "stylesheet" && request.frame() === page.mainFrame()) {
        css.push(await res.text().catch(() => ""));
      }
    });

    const response = await page.goto(BASE + budget.path, { waitUntil: "networkidle" });
    if (!response?.ok()) {
      failures.push(`${budget.path}: HTTP ${response?.status()}`);
      await context.close();
      continue;
    }

    const sizes = await page.evaluate(() => {
      let js = 0;
      let css = 0;
      for (const entry of performance.getEntriesByType("resource") as PerformanceResourceTiming[]) {
        const url = new URL(entry.name);
        if (url.origin !== location.origin) continue;
        if (entry.initiatorType === "script" || url.pathname.endsWith(".js"))
          js += entry.encodedBodySize;
        if (url.pathname.endsWith(".css")) css += entry.encodedBodySize;
      }
      return { js, css, iframes: document.querySelectorAll("iframe").length };
    });

    const line = `${budget.path.padEnd(28)} JS ${fmt(sizes.js).padStart(9)} / ${fmt(budget.maxJs)}   CSS ${fmt(sizes.css).padStart(8)} / ${fmt(budget.maxCss)}`;
    console.log(line);

    if (sizes.js > budget.maxJs)
      failures.push(`${budget.path}: JS ${fmt(sizes.js)} > ${fmt(budget.maxJs)}`);
    if (sizes.css > budget.maxCss)
      failures.push(`${budget.path}: CSS ${fmt(sizes.css)} > ${fmt(budget.maxCss)}`);
    if (budget.kind === "grid" && sizes.iframes > 0) {
      failures.push(
        `${budget.path}: grid pages must use thumbnails, found ${sizes.iframes} iframe(s)`,
      );
    }
    const allCss = css.join("\n");
    if (budget.kind !== "preview" && allCss.includes("--iso-")) {
      failures.push(`${budget.path}: site CSS contains hosted-style tokens (--iso-*)`);
    }
    if (budget.kind === "preview" && allCss.includes("--font-geist")) {
      failures.push(`${budget.path}: preview loaded the site's CSS`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}

if (failures.length > 0) {
  console.error(`\nBudget failures:\n${failures.map((f) => `  - ${f}`).join("\n")}`);
  process.exit(1);
}
console.log("\nAll budgets passed.");
