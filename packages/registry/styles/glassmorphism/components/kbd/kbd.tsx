import type { HTMLAttributes } from "react";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Several keys of one combination, each in its own key cap. */
  keys?: string[];
}

// A small glass key cap with a bright rim and the inner top highlight. No blur of its own, so a
// shortcut inside a frosted menu or panel never nests frost.
const cap =
  "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-gl-edge bg-gl-glass-hover px-1 " +
  "font-gl text-[11px] leading-none font-medium text-gl-muted shadow-gl";

export function Kbd({ keys, className, children, ...props }: KbdProps) {
  if (keys) {
    // A combination nests one <kbd> per key, as the HTML spec describes.
    return (
      <kbd
        className={["inline-flex items-center gap-0.5 font-gl", className]
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
