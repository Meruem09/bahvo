import { Kbd } from "./kbd";

const shortcuts = [
  { action: "Open the command menu", keys: ["⌘", "K"] },
  { action: "New project", keys: ["⌘", "⇧", "N"] },
  { action: "Go to deployments", keys: ["G", "D"] },
  { action: "Show all shortcuts", keys: ["?"] },
];

export default function KbdDemo() {
  return (
    <div className="flex w-[380px] max-w-full flex-col gap-5 font-gl">
      <p className="text-sm text-gl-muted">
        Press <Kbd keys={["⌘", "K"]} /> to search, or <Kbd>Esc</Kbd> to close.
      </p>
      {/* The key caps carry their own frost, so the list is a rimmed outline on the backdrop, not a second frosted pane. */}
      <ul className="divide-y divide-gl-line rounded-gl-lg border border-gl-edge bg-gl-glass px-4 shadow-gl backdrop-blur-gl backdrop-saturate-150">
        {shortcuts.map((shortcut) => (
          <li
            key={shortcut.action}
            className="flex h-11 items-center justify-between gap-4 text-sm"
          >
            <span className="text-gl-fg">{shortcut.action}</span>
            <Kbd keys={shortcut.keys} />
          </li>
        ))}
      </ul>
    </div>
  );
}
