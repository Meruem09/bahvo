"use client";

import {
  cloneElement,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

export interface TooltipProps {
  content: ReactNode;
  /** The trigger. It receives the tooltip's event handlers and aria attributes. */
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  /** A keyboard shortcut shown after the text. */
  shortcut?: string;
  side?: "top" | "bottom";
  /** Names the trigger (icon-only buttons) instead of describing it. */
  asLabel?: boolean;
  /** Hover delay in ms. Keyboard focus shows the tooltip at once. */
  delay?: number;
  defaultOpen?: boolean;
}

// A solid inverse bubble in bold Nunito; it pops a little toward its trigger as it appears.
const bubble =
  "pointer-events-none absolute left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-gm-sm bg-gm-fg px-2.5 py-1 font-gm text-[13px] leading-5 font-semibold text-gm-bg " +
  "invisible opacity-0 transition-[opacity,translate,visibility] duration-150 ease-out motion-reduce:transition-none " +
  "data-open:visible data-open:translate-y-0 data-open:opacity-100";

const sides = {
  top: "bottom-full mb-2.5 translate-y-1",
  bottom: "top-full mt-2.5 -translate-y-1",
};

export function Tooltip({
  content,
  children,
  shortcut,
  side = "top",
  asLabel = false,
  delay = 300,
  defaultOpen = false,
}: TooltipProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const trigger = children.props;

  useEffect(() => () => clearTimeout(timer.current), []);

  function show(wait: number) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), wait);
  }

  function hide() {
    clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span className="relative inline-flex">
      {cloneElement(children, {
        [asLabel ? "aria-labelledby" : "aria-describedby"]: id,
        onPointerEnter: (event: PointerEvent<HTMLElement>) => {
          trigger.onPointerEnter?.(event);
          if (event.pointerType === "mouse") show(delay);
        },
        onPointerLeave: (event: PointerEvent<HTMLElement>) => {
          trigger.onPointerLeave?.(event);
          hide();
        },
        onFocus: (event: FocusEvent<HTMLElement>) => {
          trigger.onFocus?.(event);
          // Only keyboard focus: a click shouldn't pop a tooltip over the thing clicked.
          if (event.currentTarget.matches(":focus-visible")) show(0);
        },
        onBlur: (event: FocusEvent<HTMLElement>) => {
          trigger.onBlur?.(event);
          hide();
        },
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          trigger.onKeyDown?.(event);
          if (event.key === "Escape") hide();
        },
      })}
      <span
        id={id}
        role="tooltip"
        data-open={open || undefined}
        className={`${bubble} ${sides[side]}`}
      >
        {content}
        {shortcut && (
          // Hidden so an icon button named by its tooltip reads "Copy link", not "Copy link ⌘C".
          <span aria-hidden="true" className="text-gm-bg/70">
            {shortcut}
          </span>
        )}
      </span>
    </span>
  );
}
