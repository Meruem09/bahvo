"use client";

import { useState } from "react";
import { Pagination } from "./pagination";

const total = 214;
const perPage = 10;
const pageCount = Math.ceil(total / perPage);

export default function PaginationDemo() {
  const [page, setPage] = useState(3);
  const first = (page - 1) * perPage + 1;
  const last = Math.min(page * perPage, total);

  return (
    <div className="flex w-[520px] max-w-full flex-wrap items-center justify-between gap-4 font-gm">
      <p className="text-[13px] text-gm-muted tabular-nums" aria-live="polite">
        {first}–{last} of {total} deployments
      </p>
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
