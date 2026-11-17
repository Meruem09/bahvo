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
        className={direction === "ascending" ? "text-fl-fg" : "text-fl-line-strong"}
      />
      <path
        d="m5.5 9.5 2.5 2.5 2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "descending" ? "text-fl-fg" : "text-fl-line-strong"}
      />
    </svg>
  );
}

/**
 * A leaf-cut paper pane around a real table. The pane's overflow clips the row
 * hover to the leaf corners, so no row paints past them.
 */
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
        "overflow-x-auto rounded-fl-leaf border border-fl-line bg-fl-surface font-fl shadow-fl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-fl-line">
            {columns.map((column) => {
              const end = column.align === "end";
              const direction = sort?.key === column.key ? sort.direction : undefined;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={direction}
                  className={`h-10 px-4 text-[13px] font-semibold whitespace-nowrap text-fl-muted ${
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
                      className={`-mx-2.5 inline-flex h-7 items-center gap-1 rounded-full px-2.5 transition-colors hover:bg-fl-subtle hover:text-fl-fg focus-visible:outline-2 focus-visible:outline-fl-accent ${
                        end ? "flex-row-reverse" : ""
                      } ${direction ? "text-fl-fg" : ""}`}
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
              className="border-b border-fl-line transition-colors last:border-0 hover:bg-fl-subtle"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`h-12 px-4 text-fl-fg ${
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
