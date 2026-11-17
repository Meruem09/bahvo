import type { HTMLAttributes } from "react";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Several keys of one combination, each in its own key cap. */
  keys?: string[];
}

// A small cream paper cap: a warm edge and one soft shadow.
const cap =
  "inline-flex h-5 min-w-5 items-center justify-center rounded-fl-sm border border-fl-line-strong bg-fl-surface px-1.5 " +
  "font-fl text-[11px] leading-none font-semibold text-fl-muted shadow-fl";

export function Kbd({ keys, className, children, ...props }: KbdProps) {
  if (keys) {
    // A combination nests one <kbd> per key, as the HTML spec describes.
    return (
      <kbd
        className={["inline-flex items-center gap-0.5 font-fl", className]
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
