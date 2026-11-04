import { Kbd } from "./kbd";

const shortcuts = [
  { action: "Open the command menu", keys: ["⌘", "K"] },
  { action: "New project", keys: ["⌘", "⇧", "N"] },
  { action: "Go to deployments", keys: ["G", "D"] },
  { action: "Show all shortcuts", keys: ["?"] },
];

export default function KbdDemo() {
  return (
    <div className="flex w-[380px] max-w-full flex-col gap-5 font-mn">
      <p className="text-sm text-mn-muted">
        Press <Kbd keys={["⌘", "K"]} /> to search, or <Kbd>Esc</Kbd> to close.
      </p>
      <ul className="divide-y divide-mn-line rounded-mn-lg border border-mn-line bg-mn-surface px-4 shadow-mn-sm">
        {shortcuts.map((shortcut) => (
          <li
            key={shortcut.action}
            className="flex h-11 items-center justify-between gap-4 text-sm"
          >
            <span className="text-mn-fg">{shortcut.action}</span>
            <Kbd keys={shortcut.keys} />
          </li>
        ))}
      </ul>
    </div>
  );
}
