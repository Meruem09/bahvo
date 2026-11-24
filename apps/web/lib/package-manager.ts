import { useSyncExternalStore } from "react";

/**
 * The reader's package manager, remembered across pages and tabs. Every
 * command on the site is written for npx and shown with the chosen runner.
 * The static HTML always says npx; a saved choice takes over on hydration.
 */
export const packageManagers = ["npm", "pnpm", "yarn", "bun"] as const;
export type PackageManager = (typeof packageManagers)[number];

const KEY = "bahvo:package-manager";
const FALLBACK: PackageManager = "npm";
const runners: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx",
};

const isPackageManager = (value: unknown): value is PackageManager =>
  packageManagers.includes(value as PackageManager);

function stored(): PackageManager {
  try {
    const value = localStorage.getItem(KEY);
    return isPackageManager(value) ? value : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

// Kept in memory too, so the switch still works where storage is blocked.
let current: PackageManager | undefined;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    current = stored();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function usePackageManager() {
  return useSyncExternalStore(
    subscribe,
    () => (current ??= stored()),
    () => FALLBACK,
  );
}

export function setPackageManager(next: PackageManager) {
  current = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Private mode: the choice lasts for this page only.
  }
  for (const listener of listeners) listener();
}

/** `npx bahvo add x` → `pnpm dlx bahvo add x`. Commands that don't start with npx pass through. */
export function withRunner(command: string, manager: PackageManager) {
  return command.startsWith("npx ") ? `${runners[manager]} ${command.slice(4)}` : command;
}
