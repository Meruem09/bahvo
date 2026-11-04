"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";

export interface MenuItem {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface MenuGroup {
  label?: string;
  items: MenuItem[];
}

export interface DropdownMenuProps {
  /** Trigger text, and its accessible name when `icon` replaces it. */
  label: string;
  /** Shows an icon-only trigger instead of the text. */
  icon?: ReactNode;
  /** Groups of items, separated by hairlines. */
  groups: MenuGroup[];
  align?: "start" | "end";
  defaultOpen?: boolean;
  className?: string;
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent";

const triggers = {
  text:
    "inline-flex h-8 items-center gap-1.5 rounded-mn border border-mn-line bg-mn-surface pr-2 pl-3 text-[13px] font-medium text-mn-fg shadow-mn-sm " +
    `transition-colors hover:border-mn-line-strong hover:bg-mn-subtle aria-expanded:bg-mn-subtle ${focusRing}`,
  icon:
    "inline-flex size-8 items-center justify-center rounded-mn text-mn-muted transition-colors " +
    `hover:bg-mn-subtle hover:text-mn-fg aria-expanded:bg-mn-subtle aria-expanded:text-mn-fg ${focusRing}`,
};

// The menu is a 12px radius with 1px border + 4px padding, so items get 7px.
const item =
  "flex h-8 w-full items-center gap-2.5 rounded-[7px] px-2 text-left text-sm transition-colors " +
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mn-accent " +
  "disabled:pointer-events-none disabled:opacity-45";

const tones = {
  default: "text-mn-fg hover:bg-mn-subtle focus-visible:bg-mn-subtle",
  danger: "text-mn-danger hover:bg-mn-danger/10 focus-visible:bg-mn-danger/10",
};

function enabledItems(menu: HTMLElement | null) {
  return Array.from(
    menu?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [],
  );
}

export function DropdownMenu({
  label,
  icon,
  groups,
  align = "start",
  defaultOpen = false,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  /** Which item to focus once the menu has rendered open. */
  const focusOnOpen = useRef<"first" | "last" | null>(null);

  useEffect(() => {
    if (!open) return;
    if (focusOnOpen.current) {
      const list = enabledItems(menu.current);
      (focusOnOpen.current === "first" ? list[0] : list.at(-1))?.focus();
      focusOnOpen.current = null;
    }
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function openAt(target: "first" | "last") {
    focusOnOpen.current = target;
    if (open) {
      const list = enabledItems(menu.current);
      (target === "first" ? list[0] : list.at(-1))?.focus();
    } else {
      setOpen(true);
    }
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openAt(event.key === "ArrowDown" ? "first" : "last");
    }
    if (event.key === "Escape" && open) close();
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const list = enabledItems(menu.current);
    const index = list.indexOf(document.activeElement as HTMLButtonElement);
    const next = {
      ArrowDown: list[(index + 1) % list.length],
      ArrowUp: list[(index - 1 + list.length) % list.length],
      Home: list[0],
      End: list.at(-1),
    }[event.key];
    if (next) {
      event.preventDefault();
      next.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={root}
      className={["relative inline-flex font-mn", className].filter(Boolean).join(" ")}
    >
      <button
        ref={trigger}
        id={`${id}-trigger`}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={icon ? label : undefined}
        onClick={() => (open ? setOpen(false) : openAt("first"))}
        onKeyDown={onTriggerKeyDown}
        className={icon ? triggers.icon : triggers.text}
      >
        {icon ? (
          <span aria-hidden="true" className="inline-flex size-4">
            {icon}
          </span>
        ) : (
          <>
            {label}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="size-4 text-mn-muted"
            >
              <path
                d="m4.5 6.5 3.5 3.5 3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>
      <div
        ref={menu}
        id={`${id}-menu`}
        role="menu"
        tabIndex={-1}
        aria-labelledby={`${id}-trigger`}
        hidden={!open}
        onKeyDown={onMenuKeyDown}
        className={`absolute top-full z-10 mt-1.5 flex min-w-52 flex-col rounded-mn-lg border border-mn-line bg-mn-surface p-1 shadow-mn-lg ${
          align === "end" ? "right-0" : "left-0"
        }`}
      >
        {groups.map((group, groupIndex) => {
          const groupId = `${id}-group-${group.label ?? group.items[0]?.label}`;
          return (
            // biome-ignore lint/a11y/useSemanticElements: inside role="menu" a group is role="group"; a <fieldset> is for form controls.
            <div
              key={group.label ?? group.items[0]?.label}
              role="group"
              aria-labelledby={group.label ? groupId : undefined}
              className={groupIndex > 0 ? "-mx-1 mt-1 border-t border-mn-line px-1 pt-1" : ""}
            >
              {group.label && (
                <div
                  id={groupId}
                  className="px-2 pt-1.5 pb-1 text-[11px] font-medium tracking-wide text-mn-muted uppercase"
                >
                  {group.label}
                </div>
              )}
              {group.items.map((entry) => (
                <button
                  key={entry.label}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  disabled={entry.disabled}
                  onClick={() => {
                    entry.onSelect?.();
                    close();
                  }}
                  className={`${item} ${entry.danger ? tones.danger : tones.default}`}
                >
                  {entry.icon && (
                    <span
                      aria-hidden="true"
                      className={`inline-flex size-4 shrink-0 ${entry.danger ? "" : "text-mn-muted"}`}
                    >
                      {entry.icon}
                    </span>
                  )}
                  <span className="truncate">{entry.label}</span>
                  {entry.shortcut && (
                    <span className="ml-auto pl-6 text-xs tracking-wide text-mn-muted">
                      {entry.shortcut}
                    </span>
                  )}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
