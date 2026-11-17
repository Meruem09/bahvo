import type { HTMLAttributes } from "react";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Several keys of one combination, each in its own key cap. */
  keys?: string[];
}

// A chunky game-pad cap: a 2px edge on a small hard ledge, with the key in Fredoka.
const cap =
  "inline-flex h-6 min-w-6 items-center justify-center rounded-gm-sm border-2 border-gm-line bg-gm-surface px-1.5 " +
  "font-gm-display text-xs leading-none font-semibold text-gm-muted shadow-gm-sm";

export function Kbd({ keys, className, children, ...props }: KbdProps) {
  if (keys) {
    // A combination nests one <kbd> per key, as the HTML spec describes.
    return (
      <kbd
        className={["inline-flex items-center gap-1 font-gm", className].filter(Boolean).join(" ")}
        {...props}
      >
        {keys.map((key) => (
          <kbd key={key} className={cap}>
            {key}
          </kbd>
        ))}
      </kbd>
    );
  }
  return (
    <kbd className={[cap, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </kbd>
  );
}
