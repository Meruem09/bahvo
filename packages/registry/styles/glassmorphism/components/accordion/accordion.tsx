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

/**
 * Built on <details>: works without script, and with find-in-page. The rows sit in one
 * frosted pane, divided by hairlines; py-1 keeps the inset focus ring inside its round corners.
 */
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
        "divide-y divide-gl-line rounded-gl-lg border border-gl-edge bg-gl-glass py-1 font-gl shadow-gl backdrop-blur-gl backdrop-saturate-150",
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
          <summary className="flex h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-gl px-5 text-sm font-medium text-gl-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gl-accent hover:[&>svg]:text-gl-fg [&::-webkit-details-marker]:hidden">
            {item.title}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="size-4 shrink-0 text-gl-muted transition-[rotate,color] duration-200 group-open:rotate-180 motion-reduce:transition-none"
            >
              <path
                d="m4.5 6.5 3.5 3.5 3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>
          <div className="pr-13 pb-4 pl-5 text-sm text-gl-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
