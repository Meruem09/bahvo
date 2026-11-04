"use client";

import { useState } from "react";
import { Table, type TableSort } from "./table";

type Status = "ready" | "building" | "error" | "queued";

interface Deployment {
  id: string;
  project: string;
  branch: string;
  status: Status;
  /** Build time in seconds. */
  duration: number;
  /** Minutes ago. */
  age: number;
}

const deployments: Deployment[] = [
  { id: "d1", project: "acme-web", branch: "main", status: "ready", duration: 48, age: 2 },
  {
    id: "d2",
    project: "acme-docs",
    branch: "feat-search",
    status: "building",
    duration: 31,
    age: 5,
  },
  {
    id: "d3",
    project: "acme-api",
    branch: "fix-rate-limit",
    status: "error",
    duration: 76,
    age: 18,
  },
  { id: "d4", project: "acme-web", branch: "feat-billing", status: "ready", duration: 52, age: 64 },
  { id: "d5", project: "acme-admin", branch: "main", status: "queued", duration: 0, age: 71 },
];

const statuses: Record<Status, { label: string; dot: string }> = {
  ready: { label: "Ready", dot: "bg-mn-fg" },
  building: { label: "Building", dot: "bg-mn-accent motion-safe:animate-pulse" },
  error: { label: "Error", dot: "bg-mn-danger" },
  queued: { label: "Queued", dot: "bg-mn-line-strong" },
};

function ago(minutes: number) {
  return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ago`;
}

export default function TableDemo() {
  const [sort, setSort] = useState<TableSort>({ key: "age", direction: "ascending" });
  const field = sort.key as "duration" | "age";
  const rows = [...deployments].sort(
    (a, b) => (a[field] - b[field]) * (sort.direction === "ascending" ? 1 : -1),
  );

  return (
    <Table
      caption="Recent deployments"
      className="w-[620px] max-w-full"
      rows={rows}
      rowKey={(row) => row.id}
      sort={sort}
      onSortChange={setSort}
      columns={[
        {
          key: "project",
          header: "Project",
          cell: (row) => (
            <div className="flex flex-col">
              <span className="font-medium">{row.project}</span>
              <span className="text-[13px] text-mn-muted">{row.branch}</span>
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (row) => (
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${statuses[row.status].dot}`}
              />
              {statuses[row.status].label}
            </span>
          ),
        },
        {
          key: "duration",
          header: "Duration",
          align: "end",
          sortable: true,
          cell: (row) =>
            row.duration ? `${row.duration}s` : <span className="text-mn-muted">–</span>,
        },
        {
          key: "age",
          header: "Created",
          align: "end",
          sortable: true,
          className: "w-32",
          cell: (row) => <span className="text-mn-muted">{ago(row.age)}</span>,
        },
      ]}
    />
  );
}
