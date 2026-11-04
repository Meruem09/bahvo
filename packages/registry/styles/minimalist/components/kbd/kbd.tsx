import type { HTMLAttributes } from "react";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Several keys of one combination, each in its own key cap. */
  keys?: string[];
}

const cap =
  "inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border border-mn-line bg-mn-surface px-1 " +
  "font-mn text-[11px] leading-none font-medium text-mn-muted shadow-mn-sm";

export function Kbd({ keys, className, children, ...props }: KbdProps) {
  if (keys) {
    // A combination nests one <kbd> per key, as the HTML spec describes.
    return (
      <kbd
        className={["inline-flex items-center gap-0.5 font-mn", className]
          .filter(Boolean)
          .join(" ")}
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
