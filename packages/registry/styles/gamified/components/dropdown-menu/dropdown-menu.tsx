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
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary";

// Triggers are white keys that press down, and stay pressed while their menu is open.
const key =
  "border-2 border-gm-line bg-gm-surface shadow-gm transition-[background-color,color,translate,box-shadow] duration-100 " +
  "hover:bg-gm-subtle active:translate-y-1 active:shadow-none " +
  "aria-expanded:translate-y-1 aria-expanded:bg-gm-subtle aria-expanded:shadow-none";

const triggers = {
  text: `inline-flex h-8 items-center gap-1.5 rounded-gm pr-2.5 pl-3.5 font-gm-display text-sm font-semibold text-gm-fg ${key} ${focusRing}`,
  icon: `inline-flex size-8 items-center justify-center rounded-gm text-gm-muted hover:text-gm-fg aria-expanded:text-gm-fg ${key} ${focusRing}`,
};

// A chunky 12px menu with a 2px edge and 4px padding around 8px items.
const item =
  "flex h-8 w-full items-center gap-2.5 rounded-gm-sm px-2 text-left text-sm font-semibold transition-colors " +
  "focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-gm-primary " +
  "disabled:pointer-events-none disabled:opacity-50";

const tones = {
  default: "text-gm-fg hover:bg-gm-subtle focus-visible:bg-gm-subtle",
  danger: "text-gm-danger hover:bg-gm-danger-soft focus-visible:bg-gm-danger-soft",
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
      className={["relative inline-flex font-gm", className].filter(Boolean).join(" ")}
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
              className="size-4 text-gm-muted"
            >
              <path
                d="m4.5 6.5 3.5 3.5 3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
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
        className={`absolute top-full z-10 mt-2.5 flex min-w-52 flex-col rounded-gm border-2 border-gm-line bg-gm-surface p-1 shadow-gm-lg ${
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
              className={groupIndex > 0 ? "-mx-1 mt-1 border-t-2 border-gm-line px-1 pt-1" : ""}
            >
              {group.label && (
                <div
                  id={groupId}
                  className="px-2 pt-1.5 pb-1 text-[11px] leading-4 font-extrabold tracking-wider text-gm-muted uppercase"
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
                      className={`inline-flex size-4 shrink-0 ${entry.danger ? "" : "text-gm-muted"}`}
                    >
                      {entry.icon}
                    </span>
                  )}
                  <span className="truncate">{entry.label}</span>
                  {entry.shortcut && (
                    <span className="ml-auto pl-6 text-xs font-bold tracking-wide text-gm-muted">
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
