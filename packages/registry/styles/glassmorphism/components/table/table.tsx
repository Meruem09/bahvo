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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "ascending" ? "text-gl-fg" : "text-gl-line-strong"}
      />
      <path
        d="m5.5 9.5 2.5 2.5 2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "descending" ? "text-gl-fg" : "text-gl-line-strong"}
      />
    </svg>
  );
}

/** A table in one frosted pane: hairline rows, flat inside, lit on hover. */
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
        "overflow-x-auto rounded-gl-lg border border-gl-edge bg-gl-glass font-gl shadow-gl backdrop-blur-gl backdrop-saturate-150",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-gl-line">
            {columns.map((column) => {
              const end = column.align === "end";
              const direction = sort?.key === column.key ? sort.direction : undefined;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={direction}
                  className={`h-10 px-4 text-[13px] font-medium whitespace-nowrap text-gl-muted ${
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
                      className={`-mx-1.5 inline-flex h-7 items-center gap-1 rounded-gl-sm px-1.5 transition-colors hover:text-gl-fg focus-visible:outline-2 focus-visible:outline-gl-accent ${
                        end ? "flex-row-reverse" : ""
                      } ${direction ? "text-gl-fg" : ""}`}
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
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-gl-line transition-colors last:border-0 hover:bg-gl-glass-hover"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`h-12 px-4 text-gl-fg ${
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
