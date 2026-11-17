import type { ReactNode } from "react";

export type SortDirection = "ascending" | "descending";

export interface TableSort {
  key: string;
  direction: SortDirection;
}

export interface TableColumn<Row> {
  key: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  /** Numbers and dates align to the end. */
  align?: "start" | "end";
  sortable?: boolean;
  /** Width or other classes for the column's cells. */
  className?: string;
}

export interface TableProps<Row> {
  columns: TableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Names the table for assistive tech. Visually hidden. */
  caption: ReactNode;
  sort?: TableSort;
  onSortChange?: (sort: TableSort) => void;
  className?: string;
}

function SortIcon({ direction }: { direction?: SortDirection }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5 shrink-0">
      <path
        d="m5.5 6.5 2.5-2.5 2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "ascending" ? "text-gm-primary" : "text-gm-control"}
      />
      <path
        d="m5.5 9.5 2.5 2.5 2.5-2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "descending" ? "text-gm-primary" : "text-gm-control"}
      />
    </svg>
  );
}

/** Rows in a chunky pane: a tinted header row with Fredoka labels and 2px dividers. */
export function Table<Row>({
  columns,
  rows,
  rowKey,
  caption,
  sort,
  onSortChange,
  className,
}: TableProps<Row>) {
  return (
    <div
      className={[
        "overflow-x-auto rounded-gm-lg border-2 border-gm-line bg-gm-surface font-gm shadow-gm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b-2 border-gm-line bg-gm-subtle">
            {columns.map((column) => {
              const end = column.align === "end";
              const direction = sort?.key === column.key ? sort.direction : undefined;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={direction}
                  className={`h-10 px-4 font-gm-display text-[13px] font-semibold whitespace-nowrap text-gm-muted ${
                    end ? "text-right" : "text-left"
                  } ${column.className ?? ""}`}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() =>
                        onSortChange({
                          key: column.key,
                          direction: direction === "ascending" ? "descending" : "ascending",
                        })
                      }
                      className={`-mx-1.5 inline-flex h-7 items-center gap-1 rounded-gm-sm px-1.5 font-semibold transition-colors hover:bg-gm-surface hover:text-gm-fg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary ${
                        end ? "flex-row-reverse" : ""
                      } ${direction ? "text-gm-fg" : ""}`}
                    >
                      {column.header}
                      <SortIcon direction={direction} />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gm-line">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-gm-subtle">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`h-12 px-4 text-gm-fg ${
                    column.align === "end" ? "text-right tabular-nums" : "text-left"
                  } ${column.className ?? ""}`}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
