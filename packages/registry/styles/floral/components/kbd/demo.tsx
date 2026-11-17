import { Kbd } from "./kbd";

const shortcuts = [
  { action: "Open the command menu", keys: ["⌘", "K"] },
  { action: "New project", keys: ["⌘", "⇧", "N"] },
  { action: "Go to deployments", keys: ["G", "D"] },
  { action: "Show all shortcuts", keys: ["?"] },
];

export default function KbdDemo() {
  return (
    <div className="flex w-[380px] max-w-full flex-col gap-5 font-fl">
      <p className="text-sm text-fl-muted">
        Press <Kbd keys={["⌘", "K"]} /> to search, or <Kbd>Esc</Kbd> to close.
      </p>
      <ul className="divide-y divide-fl-line rounded-fl-leaf border border-fl-line bg-fl-surface px-5 shadow-fl">
        {shortcuts.map((shortcut) => (
          <li
            key={shortcut.action}
            className="flex h-11 items-center justify-between gap-4 text-sm"
          >
            <span className="text-fl-fg">{shortcut.action}</span>
            <Kbd keys={shortcut.keys} />
          </li>
        ))}
      </ul>
    </div>
  );
}
