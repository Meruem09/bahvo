/**
 * Dev watcher: rebuilds the registry whenever content changes. Each rebuild
 * runs in a fresh process so edited components are re-imported, not cached.
 */
import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
let timer: NodeJS.Timeout | undefined;
let running = false;
let queued = false;

function rebuild() {
  if (running) {
    queued = true;
    return;
  }
  running = true;
  const child = spawn(process.execPath, ["--import", "tsx", "scripts/build.ts"], {
    cwd: root,
    stdio: "inherit",
  });
  child.on("exit", () => {
    running = false;
    if (queued) {
      queued = false;
      rebuild();
    }
  });
}

for (const dir of ["styles", "contracts"]) {
  watch(new URL(`../${dir}/`, import.meta.url), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}
console.log("registry: watching styles/ and contracts/");
