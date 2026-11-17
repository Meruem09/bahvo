import { Kbd } from "./kbd";

const shortcuts = [
  { action: "Open the command menu", keys: ["⌘", "K"] },
  { action: "New project", keys: ["⌘", "⇧", "N"] },
  { action: "Go to deployments", keys: ["G", "D"] },
  { action: "Show all shortcuts", keys: ["?"] },
];

export default function KbdDemo() {
  return (
    <div className="flex w-[380px] max-w-full flex-col gap-5 font-gm">
      <p className="text-sm text-gm-muted">
        Press <Kbd keys={["⌘", "K"]} /> to search, or <Kbd>Esc</Kbd> to close.
      </p>
      <ul className="divide-y-2 divide-gm-line rounded-gm-lg border-2 border-gm-line bg-gm-surface px-5 shadow-gm">
        {shortcuts.map((shortcut) => (
          <li
            key={shortcut.action}
            className="flex h-11 items-center justify-between gap-4 text-sm"
          >
            <span className="text-gm-fg">{shortcut.action}</span>
            <Kbd keys={shortcut.keys} />
          </li>
        ))}
      </ul>
    </div>
  );
}
