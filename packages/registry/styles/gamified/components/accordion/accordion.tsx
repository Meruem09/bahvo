import { type ReactNode, useId } from "react";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Lets several sections stay open. By default opening one closes the others. */
  multiple?: boolean;
  /** Ids of the sections open at first. */
  defaultOpen?: string[];
  className?: string;
}

/** Built on <details>: works without script, and with find-in-page. */
export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const name = useId();

  return (
    <div
      className={[
        "divide-y-2 divide-gm-line rounded-gm-lg border-2 border-gm-line bg-gm-surface font-gm shadow-gm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => (
        <details
          key={item.id}
          name={multiple ? undefined : name}
          open={defaultOpen.includes(item.id)}
          className="group"
        >
          {/* rounded-[16px] keeps the inset focus ring concentric with the pane's inner corners. */}
          <summary className="group/summary flex h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-[16px] px-5 font-gm-display text-[15px] font-semibold text-gm-fg focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-gm-primary [&::-webkit-details-marker]:hidden">
            {item.title}
            {/* The chevron sits in a small round well that turns violet on hover and when open. */}
            <span
              aria-hidden="true"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gm-subtle text-gm-muted transition-colors group-open:bg-gm-primary-soft group-open:text-gm-primary group-hover/summary:bg-gm-primary-soft group-hover/summary:text-gm-primary"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="size-4 transition-[rotate] duration-200 group-open:rotate-180 motion-reduce:transition-none"
              >
                <path
                  d="m4.5 6.5 3.5 3.5 3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </summary>
          <div className="pr-14 pb-4 pl-5 text-sm text-gm-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
