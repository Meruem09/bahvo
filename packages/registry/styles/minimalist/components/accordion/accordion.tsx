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
      className={["divide-y divide-mn-line border-y border-mn-line font-mn", className]
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
          <summary className="flex h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-mn-sm text-sm font-medium text-mn-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent hover:[&>svg]:text-mn-fg [&::-webkit-details-marker]:hidden">
            {item.title}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="size-4 shrink-0 text-mn-muted transition-[rotate,color] duration-200 group-open:rotate-180 motion-reduce:transition-none"
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
          <div className="pr-8 pb-4 text-sm text-mn-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
