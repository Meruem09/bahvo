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
 * Built on <details>: works without script, and with find-in-page. A leaf-cut
 * paper pane divided by warm hairlines; py-1 keeps the focus ring inside the pane.
 * Rows carry no background of their own (they reach the leaf corners), so hover
 * lights a round paper chip behind the chevron instead.
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
        "divide-y divide-fl-line rounded-fl-leaf border border-fl-line bg-fl-surface py-1 font-fl text-fl-fg shadow-fl",
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
          className="group px-6"
        >
          <summary className="flex h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-fl-sm text-sm font-semibold text-fl-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-accent hover:[&>svg]:bg-fl-subtle hover:[&>svg]:text-fl-fg [&::-webkit-details-marker]:hidden">
            {item.title}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="-mr-1.5 size-7 shrink-0 rounded-full p-1.5 text-fl-muted transition-[rotate,color,background-color] duration-200 group-open:rotate-180 motion-reduce:transition-none"
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
          <div className="pr-8 pb-5 text-sm text-fl-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
